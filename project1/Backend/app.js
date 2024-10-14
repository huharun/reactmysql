// Backend: application services, accessible by URIs

const express = require('express');
const session = require('express-session');
const requestIp = require('request-ip');
const cors = require('cors');
const dotenv = require('dotenv');
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

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'arun_key', // Move to environment variable for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Session retrieval route
app.get('/session', (request, response) => {
    response.json(request.session.user || { message: "No user is logged in." });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        console.log('Session data:', req.session.user);
        res.json({ message: "Welcome to your dashboard", user: req.session.user });
    } else {
        res.status(401).json({ message: "Unauthorized: Please sign in first." });
    }
});

// Profile route
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json({ message: "Profile data", user: req.session.user });
    } else {
        res.status(401).json({ message: "Unauthorized: Please sign in first." });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Failed to log out." });
        }
        res.json({ message: "Logged out successfully." });
    });
});

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

// Search by name
app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    console.log(name);
    
    const db = dbService.getDbServiceInstance();
    let result;
    if (name === "all") // in case we want to search all
    result = db.getAllData();
    else
    result = db.searchByName(name); // call a DB function
    
    result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
});

// Update
app.patch('/update', (request, response) => {
    console.log("app: update is called");
    const { id, name } = request.body;
    console.log(id);
    console.log(name);
    const db = dbService.getDbServiceInstance();
    
    const result = db.updateNameById(id, name);
    result.then(data => response.json({ success: true }))
    .catch(err => console.log(err));
});

// Delete service
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    console.log("delete");
    console.log(id);
    const db = dbService.getDbServiceInstance();
    
    const result = db.deleteRowById(id);
    result.then(data => response.json({ success: true }))
    .catch(err => console.log(err));
});

// Debug function, will be deleted later
app.post('/debug', (request, response) => {
    const { debug } = request.body;
    console.log(debug);
    return response.json({ success: true });
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
