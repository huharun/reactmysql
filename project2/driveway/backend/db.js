   // database services, accessbile by DbService methods.
   
   const mysql = require('mysql');
   const dotenv = require('dotenv');
   dotenv.config(); // read from .env file
   
   let instance = null; 
   
   const connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,        
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DB_PORT
   });
   
   // to see if the DB is connected or not
   connection.connect((err) => {
      if(err){
         console.log(err.message);
      }
      console.log('db ' + connection.state);    
   });
   
   // the following are database functions, 
   class DbService{
      static getDbServiceInstance(){ // only one instance is sufficient
         return instance? instance: new DbService();
      }
      
      // getAll
      async getAllData(){
         try{
            // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => {
               const query = `
                  SELECT u.id, u.first_name, u.last_name, u.email, u.salary, u.age, u.registration_date, u.last_sign_in, 
                  CONCAT(added.first_name, ' ', added.last_name) AS added_by, 
                  IFNULL(CONCAT(edited.first_name, ' ', edited.last_name), 'None') AS edited_by 
                  FROM users u 
                  LEFT JOIN users added ON u.added_by = added.id 
                  LEFT JOIN users edited ON u.edited_by = edited.id 
                  WHERE u.is_deleted = 0;`;
               
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
      
      // insert login data
      async insertLoginData(userId, loginTime, loginStatus, ipAddress) {
         return new Promise((resolve, reject) => {
            const insertQuery = `
                 INSERT INTO user_login (user_id, login_time, status, ip_address)
                 VALUES (?, ?, ?, ?);
             `;
            const updateQuery = `
                 UPDATE users
                 SET last_sign_in = ?
                 WHERE id = ?;
             `;
            
            const insertValues = [userId, loginTime, loginStatus, ipAddress];
            const updateValues = [loginTime, userId];
            
            // Insert login attempt into user_login table
            connection.query(insertQuery, insertValues, (err, insertResults) => {
               if (err) {
                  return reject(err); 
               }
               
               // Update user's last sign-in time
               connection.query(updateQuery, updateValues, (err, updateResults) => {
                  if (err) {
                     return reject(err);
                  }
                  
                  resolve({ insertResults, updateResults });
               });
            });
         });
      }
      
      async incrementFailedAttempts(userId) {
         return new Promise((resolve, reject) => {
            const query = `
              UPDATE users 
              SET failed_attempts = failed_attempts + 1
              WHERE id = ?;
          `;
            connection.query(query, [userId], (err, result) => {
               if (err) return reject(err);
               resolve(result);
            });
         });
      }
      
      async lockUserAccount(userId) {
         return new Promise((resolve, reject) => {
            const query = `
           UPDATE users
           SET locked = TRUE
           WHERE id = ?;
       `;
            connection.query(query, [userId], (err, result) => {
               if (err) return reject(err);
               resolve(result);
            });
         });
      }
      
      async resetFailedAttempts(userId) {
         return new Promise((resolve, reject) => {
            const query = `
           UPDATE users 
           SET failed_attempts = 0 
           WHERE id = ?;
       `;
            connection.query(query, [userId], (err, result) => {
               if (err) return reject(err);
               resolve(result);
            });
         });
      }
      
      
      async insertNewName(user_type, firstName, lastName, email, password, phone, address) {
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
             const isDeleted = 0;
     
             // Insert the new user data into the database
             const insertId = await new Promise((resolve, reject) => {
                 const query = "INSERT INTO `users` ( `first_name`, `last_name`, `email`, `password`, `phone`, `address`, `registration_date`, `last_sign_in`, `is_deleted`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
                 connection.query(query, [, firstName, lastName, email, password, phone, address, registrationDate, lastSignIn, isDeleted], (err, result) => {
                     if (err) {
                         reject(new Error(err.message));
                     } else {
                         resolve(result.insertId);
                     }
                 });
             });
     
             console.log(insertId);
             return {
                 id: insertId,
                 firstName: firstName,
                 lastName: lastName,
                 email: email,
                 phone: phone,
                 address: address,
                 dateAdded: registrationDate
             };
         } catch (error) {
             console.error("Error inserting new name:", error);
             throw error; // Rethrow the error for caller to handle
         }
     }
     
      
      
      // Function to get autocomplete results
      async getAutocompleteResults(searchValue, searchType, minSalary, maxSalary, minAge, maxAge) {
         return new Promise((resolve, reject) => {
            const searchPattern = `%${searchValue}%`; 
            let query;
            let params = []; 
            
            // Base query with common condition
            const baseQuery = `
               SELECT u.id, u.first_name, u.last_name, u.email, u.salary, u.age, u.registration_date, u.last_sign_in, 
                  CONCAT(added.first_name, ' ', added.last_name) AS added_by, 
                  CONCAT(edited.first_name, ' ', edited.last_name) AS edited_by 
               FROM users u 
               LEFT JOIN users added ON u.added_by = added.id 
               LEFT JOIN users edited ON u.edited_by = edited.id 
               WHERE u.is_deleted = 0`;
            
            // Determine the search condition based on searchType
            switch (searchType) {
               case 'name':
               query = `${baseQuery} AND ((u.first_name LIKE ?) OR (u.last_name LIKE ?) OR (u.first_name LIKE CONCAT('%', SUBSTRING_INDEX(?, ' ', 1), '%') 
         AND u.last_name LIKE CONCAT('%', SUBSTRING_INDEX(?, ' ', -1), '%')))`; 
               params = [searchPattern, searchPattern, searchPattern, searchPattern];
               break;
               case 'salary':
               query = `${baseQuery} AND (u.salary BETWEEN ? AND ?)`; 
               params = [minSalary, maxSalary, minSalary, maxSalary];
               break;
               case 'age':
               query = `${baseQuery} AND u.age BETWEEN ? AND ?`; 
               params = [minAge, maxAge];
               break;
               case 'after':
               query = `${baseQuery} AND (u.id > ?)`; 
               params = [searchValue];
               break;
               case 'never':
               query = `${baseQuery} AND u.id NOT IN (SELECT user_id FROM user_login)`; 
               break;
               case 'sameReg':
               query = `${baseQuery} AND DATE(u.registration_date) = (SELECT DATE(registration_date) FROM users WHERE id = ?)`; 
               params = [searchValue];
               break;
               case 'todayReg':
               query = `${baseQuery} AND DATE(u.registration_date) = CURDATE()`; 
               break;
               case 'all':
               query = `${baseQuery}`; 
               break;
               default:
               query = `${baseQuery} AND u.${searchType} LIKE ?`; 
               params = [searchPattern];
               break;
            }
            
            // Execute the query
            connection.query(query, params, (error, results) => {
               if (error) {
                  console.error("Query error:", error); // Log the specific error
                  reject(new Error(error.message));
               } else {
                  resolve(results);
               }
            });
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
                     console.log(results[0]);  
                     resolve(results[0]); // Return the first matching user
                  } else {
                     resolve(null); // If no user is found, resolve with null
                  }
               }
            });
         });
      }
      
      // update is_deleted to keep info
      async deleteRowById(id,sessionUserid){
         try{
            id = parseInt(id, 10);
            sessionUserid = parseInt(sessionUserid, 10);
            // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => 
               {
               const query = "UPDATE users Set is_deleted = 1, edited_by = ? WHERE id = ?;";
               connection.query(query, [sessionUserid,id], (err, result) => {
                  if(err) reject(new Error(err.message));
                  else resolve(result.affectedRows);
               });
            }
         );
         
         console.log(response);  
         return response === 1? true: false;
         
      }  catch(error){
         console.log(error);
      }
   }
   
   // update
   async updateNameById(id, first_name, last_name, email, salary, age, sessionUserid) {
      try {
         console.log("dbService: ");
         console.log(id, first_name, last_name, email, salary, age, sessionUserid);
         
         // Parse the ID to an integer
         id = parseInt(id, 10);
         sessionUserid = parseInt(sessionUserid, 10);
         
         const response = await new Promise((resolve, reject) => {
            // Correctly using the database column names
            const query = "UPDATE users SET first_name = ?, last_name = ?, email = ?, salary = ?, age = ?, edited_by = ? WHERE id = ?;";
            console.log("Executing query:", query, [first_name, last_name, email, salary, age, sessionUserid, id]); // Log the query
            
            connection.query(query, [first_name, last_name, email, salary, age, sessionUserid, id], (err, result) => {
               if (err) {
                  console.error("Database error:", err.message);
                  return reject(new Error(err.message)); 
               }
               console.log("Rows affected:", result.affectedRows);
               resolve(result.affectedRows);
            });
         });
         
         return response === 1; 
      } catch (error) {
         console.error("Caught error:", error.message);
         throw error; 
      }
   }
   
}

module.exports = DbService;
