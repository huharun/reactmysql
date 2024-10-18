// Backend: application services, accessible by URIs

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const requestIp = require('request-ip'); // ip-address
const CryptoJS = require('crypto-js');// hashing
dotenv.config();


const app = express();
const dbService = require('./dbService');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to capture IP address
app.use(requestIp.mw());
app.use((req, res, next) => {
    console.log(`Request IP: ${req.clientIp}`); // Log user IP
    next();
});

app.post('/hashPassword', (request, response) => {
    const { password } = request.body; // Extract password from request body
    console.log(password);
    
    // Hash the password
    const hashedPassword = CryptoJS.SHA256(password).toString(); // Convert to string
    
    response.json({ hashedPassword: hashedPassword });
});

// // Session management
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'arun_key', // Move to environment variable for security
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set to true if using HTTPS
// }));

// // Session retrieval route
// app.get('/session', (request, response) => {
    //     response.json(request.session.user || { message: "No user is logged in." });
// });

// // Dashboard route
// app.get('/dashboard', (req, res) => {
    //     if (req.session.user) {
//         console.log('Session data:', req.session.user);
//         res.json({ message: "Welcome to your dashboard", user: req.session.user });
//     } else {
//         res.status(401).json({ message: "Unauthorized: Please sign in first." });
//     }
// });

// // Profile route
// app.get('/profile', (req, res) => {
    //     if (req.session.user) {
//         res.json({ message: "Profile data", user: req.session.user });
//     } else {
//         res.status(401).json({ message: "Unauthorized: Please sign in first." });
//     }
// });

// // Logout route
// app.post('/logout', (req, res) => {
    //     req.session.destroy(err => {
        //         if (err) {
//             return res.status(500).json({ error: "Failed to log out." });
//         }
//         res.json({ message: "Logged out successfully." });
//     });
// });

// Sign-up route
app.post('/insert', async (request, response) => {
    try {
        const { first_name, last_name, email, password, salary, age, dob } = request.body;
        const db = dbService.getDbServiceInstance();
        
        // Call insertNewName with the correct parameters
        const result = await db.insertNewName(first_name, last_name, email, password, salary, age, dob);
        response.json({ data: result }); // Return the newly added row to frontend
    } catch (err) {
        console.error(err); // Log the error for debugging
        response.status(400).json({ error: err.message }); // Send the error message to the client
    }
});

// Sign In
app.post('/signin', async (request, response) => {
    try {
        const { email, hashedPassword } = request.body;
        const db = dbService.getDbServiceInstance();
        
        // Get user by email
        const user = await db.getUserByEmail(email);
        
        // Capture user's IP address
        const userIp = request.clientIp;
        const loginTime = new Date().toISOString();
        let loginstatus;
        if (hashedPassword === user.password) {
            loginstatus = 'success'; // Set login status to success
        } else {
            loginstatus = 'failure'; // Set login status to failure
        }
        console.log(loginstatus); 
        
        // Store user info and IP address in the session
        request.session.user = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            ip: userIp, // Store IP in session
        };
        
        // Log session info and IP for debugging
        console.log('User session:', request.session.user);
        
        // Insert login data into user_login table
        const result = await db.insertLoginData(user.id, loginTime, loginstatus, userIp);
        // return response.json(result);
        
        
        if (!user) {
            return response.status(401).json({ error: "Invalid email or password." });
        }
        
        // Check if the password matches
        if (hashedPassword !== user.password) {
            return response.status(401).json({ error: "Invalid password." });
        }
        
        
        // Successful sign-in
        response.json({ message: "Sign in successful!", user: request.session.user });
        
    } catch (error) {
        console.error("Error during sign-in:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});

// Read all data
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData(); // call a DB function
    
    result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// // Search by name
// app.get('/search/:name', (request, response) => {
    //     const { name } = request.params;
//     console.log(name);

//     const db = dbService.getDbServiceInstance();
//     let result;
//     if (name === "all") // in case we want to search all
//     result = db.getAllData();
//     else
//     result = db.searchByName(name); // call a DB function

//     result
//     .then(data => response.json({ data: data }))
//     .catch(err => console.log(err));
// });

// Autocomplete search
app.post('/autocomplete', async (request, response) => {
    const { searchValue, searchType } = request.body;
    
    const db = dbService.getDbServiceInstance(); // Assuming you have a db service instance
    let result;
    
    try {
        result = await db.getAutocompleteResults(searchValue, searchType); // Call the DB function
        response.json(result); // Send back results as JSON
    } catch (err) {
        console.log(err);
        response.status(500).json({ error: 'Database query error' });
    }
});


// Update
app.patch('/update', (request, response) => {
    console.log("app: update is called");
    const { id, name, email, salary, age } = request.body;
    console.log(id);
    console.log(name);
    
    const [first_name, last_name] = name.split(" ");
    console.log("First Name:", first_name);
    console.log("Last Name:", last_name);
    console.log(email);
    console.log(salary);
    console.log(age);
    
    const db = dbService.getDbServiceInstance();
    
    const result = db.updateNameById(id, first_name, last_name, email, salary, age);
    
    result.then(data => {
        response.json({ success: true, result: data });
    })
    .catch(err => {
        console.error("Error updating user:", err);
        response.status(500).json({ success: false, message: "Update failed", error: err.message });
    });
});


// Delete service
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    console.log("delete", id); // combined logs for clarity
    const db = dbService.getDbServiceInstance();
    
    const result = db.deleteRowById(id);
    result.then(data => {
        if (data) {
            // Assuming 'data' confirms deletion success
            response.json({ success: true });
        } else {
            response.json({ success: false });
        }
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ success: false, error: err.message });
    });
});


// Debug function, will be deleted later
app.post('/debug', (request, response) => {
    const { debug } = request.body;
    console.log(debug);
    return response.json({ debug });
});


// Test DB function for debugging
app.get('/testdb', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.deleteById("14"); // Call a DB function here, change it to the one you want
    
    result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// Set up the web server listener
app.listen(process.env.PORT, () => {
    console.log("I am listening.");
});
