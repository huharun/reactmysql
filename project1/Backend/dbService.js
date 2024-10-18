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
                    is_deleted = 0;`;
            
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
   
   async insertLoginData(userId, loginTime, loginStatus, ipAddress) {
      return new Promise((resolve, reject) => {
         const query = `
              INSERT INTO user_login (user_id, login_time, status, ip_address) 
              VALUES (?, ?, ?, ?);
          `;
         const values = [userId, loginTime, loginStatus, ipAddress];
         
         connection.query(query, values, (err, results) => {
            if (err) {
               reject(err); // Reject the promise if an error occurs
            } else {
               resolve(results); // Resolve with the results of the insert operation
            }
         });
      });
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
   
   // Function to get autocomplete results
   async getAutocompleteResults(searchValue, searchType) {
      return new Promise((resolve, reject) => {
         const searchPattern = `%${searchValue}%`; // Define the search pattern
         let query;
         
         // Check if the searchType is name and adjust the query accordingly
         if (searchType === 'name') {
            query = `
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
                   (first_name LIKE ? OR last_name LIKE ?)
                   AND is_deleted = 0
           `;
            connection.query(query, [searchPattern, searchPattern], (error, results) => {
               if (error) {
                  reject(new Error(error.message));
               } else {
                  resolve(results);
               }
            });
         } else {
            // For other search types, use the generic query
            query = `
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
                   ${searchType} LIKE ?
                   AND is_deleted = 0
           `;
            connection.query(query, [searchPattern], (error, results) => {
               if (error) {
                  reject(new Error(error.message));
               } else {
                  resolve(results);
               }
            });
         }
      });
   }
   
   
   
   // Function to get user by email
   async getUserByEmail(email) {
      return new Promise((resolve, reject) => {
         const query = "SELECT * FROM `users` WHERE `email` = ?;";
         
         connection.query(query, [email], (err, results) => {
            if (err) {
               reject(err);
            } else {
               if (results.length > 0) {
                  console.log(results[0]);  // Debugging: log the retrieved user
                  resolve(results[0]); // Return the first matching user
               } else {
                  resolve(null); // If no user is found, resolve with null
               }
            }
         });
      });
   }
   
   
   async searchByName(name){
      try{
         const dateAdded = new Date();
         // use await to call an asynchronous function
         const response = await new Promise((resolve, reject) => 
            {
            const query = "SELECT * FROM users where name = ?;";
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
         const query = "UPDATE users Set is_deleted = 1 WHERE id = ?;";
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


async updateNameById(id, first_name, last_name, email, salary, age) {
   try {
      console.log("dbService: ");
      console.log(id, first_name, last_name, email, salary, age);
      
      // Parse the ID to an integer
      id = parseInt(id, 10);
      
      const response = await new Promise((resolve, reject) => {
         // Intentionally incorrect SQL query for testing error handling
         const query = "UPDATE users SET first_name = ?, last_name = ?, email = ?, salary = ?, age = ? WHERE id = ?;";
         
         connection.query(query, [first_name, last_name, email, salary, age, id], (err, result) => {
            if (err) {
               console.error("Database error:", err.message);
               return reject(new Error(err.message)); // Reject if there's an error
            }
            console.log("Rows affected:", result.affectedRows);
            resolve(result.affectedRows); // Resolve with the number of affected rows
         });
      });
      
      return response === 1; // Return true if one row was affected, otherwise false
   } catch (error) {
      console.error("Caught error:", error.message);
      throw error; // Re-throw the error for higher-level handling
   }
}


}

module.exports = DbService;
