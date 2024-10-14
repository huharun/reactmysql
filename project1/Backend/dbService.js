// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 

/* for debugging
console.log(process.env.HOST);
console.log(process.env.USER);
console.log(process.env.PASSWORD);
*/

const connection = mysql.createConnection({
   host: process.env.HOST,
   user: process.env.USER,        
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   port: process.env.DB_PORT
});


connection.connect((err) => {
   if(err){
      console.log(err.message);
   }
   console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
   static getDbServiceInstance(){ // only one instance is sufficient
      return instance? instance: new DbService();
   }
   
   async getAllData(){
      try{
         // use await to call an asynchronous function
         const response = await new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    id, 
                    first_name, 
                    last_name, 
                    email, 
                    salary, 
                    age, 
                    registration_date, 
                    last_sign_in, 
                    (SELECT CONCAT(first_name, ' ', last_name) FROM users WHERE id = added_by) AS added_by,
                    (SELECT CONCAT(first_name, ' ', last_name) FROM users WHERE id = edited_by) AS edited_by
                FROM 
                    users 
                WHERE 
                    1;`;
            
            connection.query(query, (err, results) => {
               if (err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         
         
         // console.log("dbServices.js: search result:");
         // console.log(response);  // for debugging to see the result of select
         return response;
         
      }  catch(error){
         console.log(error);
      }
   }
   
   
   async insertNewName(firstName, lastName, email, password, salary, age, dob) {
      try {
         
         // Check if email already exists
         const emailExists = await new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS count FROM `users` WHERE `email` = ?;";
            connection.query(query, [email], (err, result) => {
               if (err) {
                  reject(new Error(err.message));
               } else {
                  resolve(result[0].count > 0); // Resolve with true if email exists
               }
            });
         });
         
         if (emailExists) {
            throw new Error("Email already exists."); // Throw an error if email is found
         }
         
         const registrationDate = new Date().toISOString();
         const lastSignIn = new Date().toISOString();
         const addedBy = 1;
         const editedBy = 1;
         const isDeleted = 0;
         
         const insertId = await new Promise((resolve, reject) => {
            const query = "INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `salary`, `age`, `dob`, `registration_date`, `last_sign_in`, `added_by`, `edited_by`, `is_deleted`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            connection.query(query, [firstName, lastName, email, password, salary, age, dob, registrationDate, lastSignIn, addedBy, editedBy, isDeleted], (err, result) => {
               if (err) {
                  reject(new Error(err.message));
               } else {
                  resolve(result.insertId);
               }
            });
         });
         
         console.log(insertId);  // Debugging: see the result of the insert
         return {
            id: insertId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            salary: salary,
            age: age,
            dob: dob,
            dateAdded: registrationDate
         };     
      } catch (error) {
         console.error("Error inserting new name:", error);
         throw error; // Rethrow the error for caller to handle
      }
   }
   
   
   
   
   
   async searchByName(name){
      try{
         const dateAdded = new Date();
         // use await to call an asynchronous function
         const response = await new Promise((resolve, reject) => 
            {
            const query = "SELECT * FROM names where name = ?;";
            connection.query(query, [name], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
            });
         }
      );
      
      // console.log(response);  // for debugging to see the result of select
      return response;
      
   }  catch(error){
      console.log(error);
   }
}

async deleteRowById(id){
   try{
      id = parseInt(id, 10);
      // use await to call an asynchronous function
      const response = await new Promise((resolve, reject) => 
         {
         const query = "DELETE FROM names WHERE id = ?;";
         connection.query(query, [id], (err, result) => {
            if(err) reject(new Error(err.message));
            else resolve(result.affectedRows);
         });
      }
   );
   
   console.log(response);  // for debugging to see the result of select
   return response === 1? true: false;
   
}  catch(error){
   console.log(error);
}
}


async updateNameById(id, newName){
   try{
      console.log("dbService: ");
      console.log(id);
      console.log(newName);
      id = parseInt(id, 10);
      // use await to call an asynchronous function
      const response = await new Promise((resolve, reject) => 
         {
         const query = "UPDATE names SET name = ? WHERE id = ?;";
         connection.query(query, [newName, id], (err, result) => {
            if(err) reject(new Error(err.message));
            else resolve(result.affectedRows);
         });
      }
   );
   
   // console.log(response);  // for debugging to see the result of select
   return response === 1? true: false;
}  catch(error){
   console.log(error);
}
}
}

module.exports = DbService;
