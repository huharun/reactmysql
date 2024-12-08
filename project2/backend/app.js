const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const requestIp = require('request-ip'); // IP address middleware
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT
dotenv.config();

const app = express();
const dbService = require('./db');


// Middleware setup
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true); // Allow all origins
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to capture IP address
app.use(requestIp.mw());
app.use((req, res, next) => {
    console.log(`Request IP: ${req.clientIp}`); // Log user IP
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure file upload using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');  // Save files to 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Rename file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// JWT Token generation function
function generateToken(user,userIp) {
    return jwt.sign(
        { userId: user.id, user_type: user.user_type, email: user.email, firstName: user.first_name, lastName: user.last_name, ip: userIp},
        process.env.JWT_SECRET || 'arun_key', // Make sure to define the secret key in .env
        { expiresIn: '1h' } // Token expiration time
    );
}

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Bearer header
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied: Token missing' });
    }
    
    // Log token for debugging (optional, can be removed later)
    console.log("Token received:", token);
    
    jwt.verify(token, process.env.JWT_SECRET || 'arun_key', (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error("Token verification failed:", err.message);
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        req.user = user;  // Attach user info to request object
        next();
    });
    
}

app.get('/authenticateJWT', authenticateJWT, (req, res) => {
    // If this route is reached, it means the JWT is valid
    res.json({ loggedIn: true, user: req.user });
});



// Sign-in route (with JWT token generation)
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = dbService.getDbServiceInstance();
        
        console.log('Sign-in request data:', { email, password });
        const user = await db.getUserByEmail(email);
        
        if (!user) {
            // Log failed login attempt due to invalid email
            const userIp = req.clientIp;
            const loginTime = new Date().toISOString();
            await db.insertLoginData(null, loginTime, 'failure', userIp);  // user.id is not available yet
            return res.status(401).json({ error: "Invalid email or password." });
        }
        
        // Check if the user account is locked
        if (user.locked) {
            return res.status(403).json({ error: "Your account is locked due to multiple failed login attempts." });
        }
        
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            // Log failed login attempt due to incorrect password
            const userIp = req.clientIp;
            const loginTime = new Date().toISOString();
            await db.insertLoginData(user.id, loginTime, 'failure', userIp);
            
            // Increment the failed attempts
            await db.incrementFailedAttempts(user.id);
            
            // Check if failed attempts exceed the limit (e.g., 5 attempts)
            if (user.failed_attempts + 1 >= 5) {
                // Lock the account if failed attempts exceed threshold
                await db.lockUserAccount(user.id);
            }
            
            return res.status(401).json({ error: "Invalid password." });
        }
        
        // Reset failed attempts upon successful login
        await db.resetFailedAttempts(user.id);
        
        // Capture user's IP address
        const userIp = req.clientIp;
        const loginTime = new Date().toISOString();
        
        await db.insertLoginData(user.id, loginTime, 'success', userIp);
        
        // Generate JWT token
        const token = generateToken(user, userIp);
        
        // Send JWT token back to client
        res.json({
            message: "Sign in successful!",
            token: token,
            user: {
                id: user.id,
                user_type: user.user_type,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                ip: userIp,
            }
        });
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Logout route (to handle sign out)
app.post('/logout', authenticateJWT, (req, res) => {
    try {
        res.clearCookie('authToken');  // Clear the JWT cookie if set
        res.json({ message: 'Successfully logged out' });  // Respond to client with success message
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: 'Logout failed' });
    }
});



// Protected route example (requires JWT authentication)
app.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const db = dbService.getDbServiceInstance();
        const userId = req.user.userId;  // Access the user ID from the decoded JWT
        
        
        const user = await db.getUserById(userId);
        res.json({
            id: user.id,
            user_type: user.user_type,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            ip: req.clientIp,  // Adding IP address to the response
        });
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Sign-up route
app.post('/insert', async (req, res) => {
    try {
        const { user_type, first_name, last_name, email, password, phone, address } = req.body;
        
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Get the database instance
        const db = dbService.getDbServiceInstance();
        
        // Insert the new user data into the database
        const result = await db.insertNewName(user_type, first_name, last_name, email, hashedPassword, phone, address);
        
        // Send a success response with the newly added data
        res.json({ data: result });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message }); // Send the error message to the client
    }
});

// Endpoint to fetch new requests with owner information
app.get('/new_requests/:type', async (req, res) => {
    const type = req.params.type;
    try {
        const db = dbService.getDbServiceInstance();
        const requests = await db.getNewRequests(type);
        
        // Return the list of new requests as JSON
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching new requests:', error);
        res.status(500).json({ error: 'Failed to fetch new requests', details: error.message });
    }
});


// Endpoint to take ownership of a request
app.post('/take_ownership', async (req, res) => {
    const { requestId, userId, action_type } = req.body;
    
    try {
        if (!requestId || !userId) {
            return res.status(400).json({ error: 'Missing requestId or userId' });
        }
        
        // Access the database service
        const db = dbService.getDbServiceInstance();
        
        // Update the ownership of the request
        const result = await db.takeOwnership(requestId, userId, action_type);
        
        if (result.affectedRows > 0) {
            if (action_type === 1){
                res.status(200).json({ success: true, message: `Request ID ${requestId} is now owned by User ID ${userId}` });
            }else{
                res.status(200).json({ success: true, message: `Request ID ${requestId} is now removed ownership from User ID ${userId}` });
            }
        } else {
            res.status(404).json({ error: 'Request not found or already owned' });
        }
    } catch (error) {
        console.error('Error taking ownership:', error);
        res.status(500).json({ error: 'Failed to take ownership', details: error.message });
    }
});

app.post('/manage_orders', async (req, res) => {
    const userId = req.body.userId; // Getting userId from the request body
    
    try {
        const db = dbService.getDbServiceInstance(); // Assuming a db service
        const orders = await db.getOrders(userId); // Fetch orders for the user
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Route to handle managing quotes
app.post('/manage_quotes', async (req, res) => {
    const { requestId, quoteNote, counterPrice, timeWindowStart, timeWindowEnd, status } = req.body;
    
    // Ensure all required fields are present
    if (!requestId || !quoteNote || !counterPrice || !timeWindowStart || !timeWindowEnd || !status) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    try {
        const db = dbService.getDbServiceInstance(); // Get DB instance
        const result = await db.saveQuoteToDB({ requestId, quoteNote, counterPrice, timeWindowStart, timeWindowEnd, status });
        
        res.status(200).json({
            success: true,
            message: 'Quote submitted successfully',
            data: result
        });
    } catch (error) {
        console.error('Error submitting quote:', error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
});


app.post('/send_chat', async (req, res) => {
    const { orderId, senderId, receiverId, message } = req.body;
    
    // Ensure all required fields are present
    if (!orderId || !senderId || !receiverId || !message) {
        return res.status(400).json({ success: false, message: 'Order ID, sender ID, receiver ID, and message are required' });
    }
    
    try {
        const db = dbService.getDbServiceInstance(); // Get DB instance
        const result = await db.saveChatToDB({ orderId, senderId, receiverId, message });
        
        res.status(200).json({
            success: true,
            message: 'Chat message sent successfully',
            data: result
        });
    } catch (error) {
        console.error('Error sending chat message:', error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
});

app.get('/get_chat', async (req, res) => {
    const { orderId } = req.query;
    
    // Ensure orderId is present
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
    }
    
    try {
        const db = dbService.getDbServiceInstance(); // Get DB instance
        const messages = await db.getChatMessages(orderId);
        
        res.status(200).json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
});






// API route for submitting a new service request
app.post('/submit_request', upload.array('images', 5), async (req, res) => {
    try {
        const { clientId, clientName, userType, serviceType, propertyAdress, square_feet, description, urgency } = req.body;
        const images = req.files || [];  // Get uploaded images (array of files)
        const db = dbService.getDbServiceInstance();
        
        console.log(req.body);  // Log to inspect the received data
        console.log(req.files);  // Log the uploaded files (should be an array)
        
        // Save the request data and image paths to the database
        const savedRequest = await db.saveRequestToDB({
            clientId,
            clientName,
            userType,
            serviceType,
            propertyAdress,
            square_feet,
            description,
            urgency,
            images: images.map(image => image.path),  // Map file paths for images
        });
        
        res.status(200).json({ message: 'Request submitted successfully', request: savedRequest });
    } catch (error) {
        console.error('Error submitting request:', error);  // Log the error details
        res.status(500).json({ error: 'Failed to submit request', details: error.message });
    }
});

app.post('/view_requests', async (req, res) => {
    try {
        const userId = req.body.userId;  // Access userId from the body
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        
        const db = dbService.getDbServiceInstance();
        
        // Fetch the service requests
        const requests = await db.getRequestsByUserId(userId);
        
        // Add full URLs for images
        const baseUrl =  "/reactmysql/project2/backend/"; 
        
        const updatedRequests = requests.map(request => {
            // Prepend the base URL to each image URL
            if (request.image_urls) {
                request.image_urls = request.image_urls.split(', ').map(url => baseUrl + url).join(', ');
            }
            return request;
        });
        
        res.status(200).json(updatedRequests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
    }
});



app.post('/view_orders', async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        const db = dbService.getDbServiceInstance();
        const orders = await db.getOrdersByUserId(userId);
        
        if (orders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this user.' });
        }
        
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
    }
});

app.post('/viewActiveorders', async (req, res) => {
    try {
        const { userId, orderStatus } = req.body;
        
        
        // Validate the input
        const validOrderStatuses = ['In Progress', 'Completed'];
        if (!userId || isNaN(userId) || !validOrderStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: 'Invalid userId or orderStatus provided' });
        }
        
        const db = dbService.getDbServiceInstance();
        const orders = await db.getOrdersByUserIdAndStatus(userId, orderStatus);
        
        if (orders.length === 0) {
            return res.status(200).json({ message: `No ${orderStatus} orders found for this user.` });
        }
        
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
    }
});

app.post('/updateOrderStatus', async (req, res) => {
    try {
        const { userId, orderId, requestId, newStatus } = req.body;
        
        // Validate inputs
        const validStatuses = ['In Progress', 'Completed'];
        if (!userId || isNaN(userId) || !orderId || isNaN(orderId) || !validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid input provided' });
        }
        
        const db = dbService.getDbServiceInstance();
        const result = await db.updateOrderStatus(orderId, newStatus);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ error: 'Order not found or status unchanged' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status', details: error.message });
    }
});





app.post('/manage_negotiations', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        
        const db = dbService.getDbServiceInstance();
        const negotiations = await db.getNegotiationsByUserId(userId);
        
        res.status(200).json(negotiations);
    } catch (error) {
        console.error('Error fetching negotiations:', error);
        res.status(500).json({ error: 'Failed to fetch negotiations', details: error.message });
    }
});

// POST /update_negotiation_status
app.post('/update_negotiation_status', async (req, res) => {
    try {
        const { responseId, status } = req.body;
        
        if (!responseId || !status) {
            return res.status(400).json({ error: 'Response ID and Status are required.' });
        }
        
        // Update the negotiation status in the database
        const db = dbService.getDbServiceInstance();
        const result = await db.updateNegotiationStatus(responseId, status);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ success: true, message: `${status} negotiation successfully.` });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to update the negotiation status.' });
        }
    } catch (error) {
        console.error('Error updating negotiation status:', error);
        res.status(500).json({ error: 'Failed to update negotiation status', details: error.message });
    }
});

// Route to generate a bill for a user
app.post('/generateBill', async (req, res) => {
    try {
        const {orderId, requestId, amount, discount, dueDate, status } = req.body;
        
        // Validation: check that the essential fields are provided and are valid
        if (!orderId || !requestId || isNaN(requestId) || !amount || isNaN(amount) || !discount || isNaN(discount)) {
            return res.status(400).json({ error: 'Invalid data provided' });
        }
        
        const db = dbService.getDbServiceInstance();
        
        // Save the generated bill with the provided details
        const result = await db.generateBill(orderId, requestId, amount, discount, dueDate, status);
        
        // Send success response with billId
        res.status(200).json({ success: true, message: 'Bill generated successfully', billId: result.insertId });
    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ error: 'Failed to generate bill', details: error.message });
    }
});


// Endpoint to fetch revenue report
app.post('/revenue_report', async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        const reportData = await db.getRevenueReport(userId);
        return res.status(200).json(reportData);
    } catch (error) {
        console.error('Error fetching revenue report:', error);
        return res.status(500).json({ error: 'Failed to fetch revenue report', details: error.message });
    }
});

// Endpoint to fetch big clients
app.post('/big_clients', async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        const clientsData = await db.getBigClients(userId);
        return res.status(200).json(clientsData);
    } catch (error) {
        console.error('Error fetching big clients:', error);
        return res.status(500).json({ error: 'Failed to fetch big clients', details: error.message });
    }
});

// Endpoint to fetch overdue bills
app.post('/overdue_bills', async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        const overdueBillsData = await db.getOverdueBills(userId);
        return res.status(200).json(overdueBillsData);
    } catch (error) {
        console.error('Error fetching overdue bills:', error);
        return res.status(500).json({ error: 'Failed to fetch overdue bills', details: error.message });
    }
});

// Endpoint to fetch client ratings
app.post('/client_ratings', async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        const ratingsData = await db.getClientRatings(userId);
        return res.status(200).json(ratingsData);
    } catch (error) {
        console.error('Error fetching client ratings:', error);
        return res.status(500).json({ error: 'Failed to fetch client ratings', details: error.message });
    }
});



// Route to view all bills for a user
app.post('/viewAllBills', async (req, res) => {
    try {
        const { userId, userType } = req.body;
        
        // Validate userId
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId provided' });
        }
        
        // Fetch bills from the database
        const db = dbService.getDbServiceInstance();
        const bills = await db.getAllBills(userId, userType);
        
        // Return appropriate response
        if (!bills || bills.length === 0) {
            return res.status(200).json([]); // Send an empty array if no bills are found
        }
        
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills', details: error.message });
    }
});


// Route to manage disputes for a user
app.post('/resolveDispute', async (req, res) => {
    try {
        const { billId, reason } = req.body;
        
        // Check if required fields are empty
        if (!billId || !reason) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const db = dbService.getDbServiceInstance();
        
        // Resolve the dispute with the given billId and reason
        const result = await db.resolveDispute(billId, reason);
        if (result) {
            res.status(200).json({ message: 'Dispute resolved successfully' });
        } else {
            res.status(400).json({ error: 'Failed to resolve dispute' });
        }
    } catch (error) {
        console.error('Error managing disputes:', error);
        res.status(500).json({ error: 'Failed to manage disputes', details: error.message });
    }
});






// API route to fetch user bill details
app.post('/getBill', async (req, res) => {
    try {
        const { userId, billId, orderId } = req.body;
        
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        
        const db = dbService.getDbServiceInstance();
        
        // Fetch bill details by userId, billId, and orderId
        const bills = await db.getBillDetails(userId, billId, orderId);
        
        if (!bills.length) {
            return res.status(404).json({ error: 'No bills found for this user' });
        }
        
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching bill details:', error);
        res.status(500).json({ error: 'Failed to fetch bill details', details: error.message });
    }
});

// API route to submit payment details
app.post('/submitPayment', async (req, res) => {
    try {
        const { billId, userId, amount, cardNumber, cardExpiry, cardCVC } = req.body;
        
        // Ensure all required fields are provided
        if (!userId || !billId || !amount || !cardNumber || !cardExpiry || !cardCVC) {
            return res.status(400).json({ error: 'Missing required payment details' });
        }
        
        // Get database service instance
        const db = dbService.getDbServiceInstance();
        
        // Payment status logic (static for now, modify as per actual payment gateway response)
        const paymentStatus = 'successful'; 
        const paymentMethod = 'card'; 
        
        // Generate a unique transaction ID
        const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        
        // Insert payment details into the database
        await db.insertPaymentDetails(userId, billId, amount, cardNumber, cardExpiry, cardCVC, paymentStatus, paymentMethod, transactionId);
        
        // Return a success response
        res.status(200).json({ message: 'Payment successfully processed!' });
    } catch (error) {
        // Log error and return a failure response
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment', details: error.message });
    }
});


// Route to dispute a bill
app.post('/disputeBill', async (req, res) => {
    try {
        const { billId, orderId, reason } = req.body;
        
        // Input validation
        if (!billId || !orderId || !reason) {
            return res.status(400).json({ error: 'All fields are required to dispute a bill.' });
        }
        
        // Connect to database service
        const db = dbService.getDbServiceInstance();
        const result = await db.disputeBill(billId, orderId, reason);
        
        if (result) {
            return res.status(200).json({ success: true, message: 'Bill disputed successfully.' });
        }
        
        res.status(500).json({ success: false, message: 'Failed to dispute the bill.' });
    } catch (error) {
        console.error('Error disputing bill:', error);
        res.status(500).json({ error: 'An error occurred while disputing the bill.', details: error.message });
    }
});







// API route for fetching user profile
app.post('/view_profile', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        
        const db = dbService.getDbServiceInstance();
        const profile = await db.getUserProfile(userId);  // Assuming this function is implemented
        
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
});

// API route for updating user profile
app.post('/update_profile', async (req, res) => {
    try {
        const { userId, first_name, last_name, email, phone, address, credit_card } = req.body;
        
        // Check if all required fields are provided
        if (!userId || !first_name || !last_name || !email || !phone || !address || !credit_card) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const db = dbService.getDbServiceInstance();
        
        // Log data being passed to the query
        console.log("Updating profile for user:", {
            userId, first_name, last_name, email, phone, address, credit_card
        });
        
        // Call the database function to update the profile
        const updateResult = await db.updateUserProfile(userId, first_name, last_name, email, phone, address, credit_card);
        
        // Check if update was successful
        if (updateResult.success) {
            return res.status(200).json({ success: true, message: 'Profile updated successfully' });
        } else {
            console.error('Error with the update query:', updateResult.details); // Log query failure details
            return res.status(500).json({ success: false, error: 'Failed to update profile', details: updateResult.details });
        }
    } catch (error) {
        console.error('Unexpected error during profile update:', error); // Log unexpected errors
        return res.status(500).json({
            error: 'Failed to update profile',
            details: error.message || 'Unknown error occurred',
        });
    }
});





// API route for fetching payment history
app.post('/view_payment_history', async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ error: 'User not authenticated' });
        
        const db = dbService.getDbServiceInstance();
        const payments = await db.getPaymentHistory(userId);  // Assuming this function is implemented
        
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Failed to fetch payment history', details: error.message });
    }
});


// Endpoint to fetch reports based on the report type
app.post('/report', async (req, res) => {
    const { reportType, userId } = req.body;

    if (!reportType) {
        return res.status(400).json({ error: 'Report type is required' });
    }

    try {
        const db = dbService.getDbServiceInstance();
        const requests = await db.getReport(reportType, userId);
        // Add full URLs for images
        const baseUrl =  "/reactmysql/project2/backend/"; 
        
        const updatedRequests = requests.map(request => {
            // Prepend the base URL to each image URL
            if (request.image_urls) {
                request.image_urls = request.image_urls.split(', ').map(url => baseUrl + url).join(', ');
            }
            return request;
        });
        

        // Send the fetched report data back as a JSON response
        res.status(200).json(updatedRequests);
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Failed to fetch report data', details: error.message });
    }
});





// Autocomplete search
app.post('/autocomplete', async (req, res) => {
    const { searchValue, searchType, minSalary, maxSalary, minAge, maxAge } = req.body;
    const db = dbService.getDbServiceInstance();
    
    try {
        const result = await db.getAutocompleteResults(
            searchValue,
            searchType,
            minSalary,
            maxSalary,
            minAge,
            maxAge
        );
        res.json(result);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: 'Database query error', details: err.message });
    }
});

// Update route
app.patch('/update', authenticateJWT, async (req, res) => {
    const { id, first_name, last_name, email, salary, age, sessionUserid } = req.body;
    
    if (id !== req.user.userId) {
        return res.status(403).json({ error: 'You do not have permission to update this user.' });
    }
    
    const db = dbService.getDbServiceInstance();
    
    try {
        const result = await db.updateNameById(id, first_name, last_name, email, salary, age, sessionUserid);
        if (result) {
            res.json({ success: true, result });
        } else {
            res.json({ success: false, message: "Update failed." });
        }
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ success: false, message: "Update failed", error: err.message });
    }
});

// Delete route
app.delete('/delete/:request_id', authenticateJWT, async (req, res) => {
    const { request_id } = req.params;
    const db = dbService.getDbServiceInstance();
    
    try {
        const result = await db.deleteRowById(request_id);
        
        // Only send the response once
        if (result) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: `No rows were updated for request_id ${request_id}, maybe it does not exist.` });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});



// Debug function, will be deleted later
app.post('/debug', (req, res) => {
    const { debug } = req.body;
    console.log(debug);
    return res.json({ debug });
});

// Test DB function for debugging
app.get('/testdb', async (req, res) => {
    const db = dbService.getDbServiceInstance();
    
    try {
        const data = await db.deleteById("14"); // Call a DB function here, change it to the one you want
        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query error', details: err.message });
    }
});

// Set up the web server listener
app.listen(process.env.PORT, () => {
    console.log("I am listening on port " + process.env.PORT);
});
