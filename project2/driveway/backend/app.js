const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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

// JWT Token generation function
function generateToken(user,userIp) {
    return jwt.sign(
        { userId: user.id, email: user.email, firstName: user.first_name, ip: userIp},
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
            console.error("Token verification failed:", err); // Log error for debugging
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


// Get all data route
app.get('/getAll', async (req, res) => {
    try {
        const db = dbService.getDbServiceInstance();
        const data = await db.getAllData(); // Await the promise
        res.json({ data });
    } catch (err) {
        console.error("Error fetching data:", err); // Log the error
        res.status(500).json({ error: 'Failed to fetch data' }); // Return a response to the client
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
app.delete('/delete/:id/:sessionUserid', authenticateJWT, async (req, res) => {
    const { id, sessionUserid } = req.params;
    const db = dbService.getDbServiceInstance();
    
    if (id !== req.user.userId) {
        return res.status(403).json({ error: 'You do not have permission to delete this user.' });
    }

    try {
        const result = await db.deleteRowById(id, sessionUserid);
        if (result) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
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
