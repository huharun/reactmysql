// Backend: application services, accessible by URIs

const express = require('express')
const session = require('express-session');
const requestIp = require('request-ip');
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// Middleware to capture IP address
app.use(requestIp.mw());

// Session management
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


//create
// sign up
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
    // return response.json(request.body);


    try {
        const { email, hashedPassword } = request.body;
        const db = dbService.getDbServiceInstance();

        // Get user by email
        const user = await db.getUserByEmail(email);

        if (!user) {
            return response.status(401).json({ error: "Invalid email or password." });
        }

        // Check if the password matches the hashed password in the database

        // const isMatch = await bcrypt.compare(password, user.password);
        // return response.json(user.password+"   "+ hashedPassword);

        if (hashedPassword != user.password) {
            return response.status(401).json({ error: "Invalid password." });
        }

        // Successful sign-in
        // response.json({ message: "Sign in successful!", user });
        response.json({ data: user }); // Return the newly added row to frontend

    } catch (error) {
        console.error("Error during sign in:", error);
        response.status(500).json({ error: "Internal server error." });
    }
});


// Function to fetch user by email (implement according to your database logic)
async function getUserByEmail(email) {
    // Example: Replace with your database query to find user by email
    const user = await User.findOne({ email }); // Example using Mongoose
    return user;
}

 




// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5000/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


  





// set up the web server listener
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening.")
    }
);
