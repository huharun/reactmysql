    // Backend: application services, accessible by URIs
    
    const express = require('express');
    const session = require('express-session');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const requestIp = require('request-ip'); // IP address middleware
    const CryptoJS = require('crypto-js'); // Password hashing
    dotenv.config();
    
    const app = express();
    const dbService = require('./dbService');
    
    // Middleware setup
    app.use(cors({
        origin: (origin, callback) => {
            callback(null, true); // Allow all origins
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], 
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
    
    // Session management
    app.use(session({
        secret: process.env.SESSION_SECRET || 'arun_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Should be true if you're using HTTPS
            maxAge: 60 * 60 * 1000 // 60 minutes
        }
    }));
    
    // Middleware to check session
    app.use((req, res, next) => {
        const publicRoutes = ['/signin', '/insert', '/hashPassword', '/session', '/test-session', '/debug','/getAll', '/autocomplete', '/delete', '/update'];
        const isSessionExpired = !req.session.user && req.session.cookie.expires && new Date() > req.session.cookie.expires;
        if (isSessionExpired) {
            console.log("Session expired. Redirecting to login.");
            // return res.redirect('/signin');
        }
        
        if (!req.session.user && !publicRoutes.includes(req.path)) {
            console.log("User is not logged in. Redirecting to login.");
            // return res.redirect('/signin');
        }
        
        next();
    });
    
    // Hash password route
    app.post('/hashPassword', (req, res) => {
        const { password } = req.body; // Extract password from request body
        console.log(password);
        
        // Hash the password
        const hashedPassword = CryptoJS.SHA256(password).toString(); // Convert to string
        res.json({ hashedPassword });
    });
    
    // Get session details
    app.get('/session', (req, res) => {
        if (req.session.user) {
            res.json(req.session.user); // User is logged in
        } else {
            res.status(401).json({ message: "No user is logged in." });
        }
    });
    
    
    // Logout route
    app.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Failed to log out." });
            }
            // Send back a success message and any other info you want
            res.json({ message: "Logged out successfully.", loggedOut: true });
        });
    });
    
    
    
    // Test session route
    app.get('/test-session', (req, res) => {
        req.session.views = (req.session.views || 0) + 1; // Increment views
        res.send(`Number of views: ${req.session.views}`);
    });
    
    // Sign-up route
    app.post('/insert', async (req, res) => {
        try {
            const { first_name, last_name, email, password, salary, age, dob } = req.body;
            const db = dbService.getDbServiceInstance();
            
            const result = await db.insertNewName(first_name, last_name, email, password, salary, age, dob);
            res.json({ data: result }); // Return the newly added row to frontend
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(400).json({ error: err.message }); // Send the error message to the client
        }
    });
    
    // Sign In POST route
    app.post('/signin', async (req, res) => {
        try {
            const { email, hashedPassword } = req.body;
            const db = dbService.getDbServiceInstance();
            
            console.log('Sign-in request data:', { email, hashedPassword });
            const user = await db.getUserByEmail(email);
            
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password." });
            }
            
            if (hashedPassword !== user.password) {
                return res.status(401).json({ error: "Invalid password." });
            }
            
            // Capture user's IP address
            const userIp = req.clientIp;
            const loginTime = new Date().toISOString();
            
            await db.insertLoginData(user.id, loginTime, 'success', userIp);
            
            req.session.user = {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                ip: userIp,
            };
            
            console.log("User session after sign-in:", req.session.user);
            res.json({ message: "Sign in successful!", user: req.session.user });
            
        } catch (error) {
            console.error("Error during sign-in:", error.message);
            res.status(500).json({ error: "Internal server error." });
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
    
    app.patch('/update', async (req, res) => {
        const { id, first_name, last_name, email, salary, age, sessionUserid } = req.body;
    
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
    app.delete('/delete/:id/:sessionUserid', async (req, res) => {
        const { id, sessionUserid } = req.params;
        const db = dbService.getDbServiceInstance();
        
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
    