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
               const query = "INSERT INTO `users` (`user_type`, `first_name`, `last_name`, `email`, `password`, `phone`, `address`, `registration_date`, `last_sign_in`, `is_deleted`) VALUES (?,   ?, ?, ?, ?, ?, ?, ?, ?, ?);";
               connection.query(query, [user_type, firstName, lastName, email, password, phone, address, registrationDate, lastSignIn, isDeleted], (err, result) => {
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
      
      async getNewRequests(type) {
         return new Promise((resolve, reject) => {
            let query = `
                 SELECT R.*, 
                        CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                        CONCAT(O.first_name, ' ', O.last_name) AS owner_name, 
                        S.service_name
                 FROM requestforquote R
                 JOIN users U ON U.id = R.client_id
                 LEFT JOIN users O ON O.id = R.owned_by 
                 JOIN service_types S ON S.service_id = R.service_id
                 WHERE R.is_deleted = 0
             `;
            
            // Append condition based on urgency type
            if (type === '1') {
               query += ` AND R.urgency = 'High'`;  // Filter for high urgency
            }
            
            // Finalize the query
            query += ` ORDER BY R.request_id DESC;`;
            
            connection.query(query, (err, results) => {
               if (err) {
                  return reject(err);
               }
               resolve(results); // Return the result of the query
            });
         });
      }
      
      
      async takeOwnership(requestId, userId, action_type) {
         return new Promise((resolve, reject) => {
            // Determine the owner based on action type
            const ownedBy = action_type === 1 ? userId : 0;
            
            // Query to update the ownership of the request
            const updateQuery = `
              UPDATE requestforquote
              SET owned_by = ?
              WHERE request_id = ?;
          `;
            
            connection.query(updateQuery, [ownedBy, requestId], (err, results) => {
               if (err) {
                  return reject(err);
               }
               
               // If action_type is 1, insert a new order record into 'orderofwork'
               if (action_type === 1) {
                  const checkQuery = `SELECT * FROM orderofwork WHERE request_id = ? AND status = 'In Progress';`;
                  
                  connection.query(checkQuery, [requestId], (err, results) => {
                     if (err) {
                        return reject(err);
                     }
                     
                     // If a record with the same request_id and status 'In Progress' exists, update it
                     if (results.length > 0) {
                        const updateQuery = `UPDATE orderofwork 
                                             SET accepted_date = ?, is_deleted = 0 
                                             WHERE request_id = ?`;
                        const acceptedDate = new Date().toISOString().replace('T', ' ').split('.')[0]; // Current date in YYYY-MM-DD format
                        
                        connection.query(updateQuery, [acceptedDate, requestId], (err, results) => {
                           if (err) {
                              return reject(err);
                           }
                           // Successfully updated the record
                           resolve(results);
                        });
                     } else {
                        // If no record exists, insert a new one
                        const insertQuery = `INSERT INTO orderofwork (request_id, accepted_date, status)
                                             VALUES (?, ?, 'In Progress');`;
                        const acceptedDate = new Date().toISOString().replace('T', ' ').split('.')[0]; // Current date in YYYY-MM-DD format
                        
                        connection.query(insertQuery, [requestId, acceptedDate], (err, results) => {
                           if (err) {
                              return reject(err);
                           }
                           // Successfully inserted the new order of work
                           resolve(results);
                        });
                     }
                  });
                  
               } else {
                  // If action_type is not 1, set is_deleted = 1 in requestforquote table
                  const deleteQuery = `
                      UPDATE orderofwork
                      SET is_deleted = 1
                      WHERE request_id = ?;
                  `;
                  
                  connection.query(deleteQuery, [requestId], (err, results) => {
                     if (err) {
                        return reject(err);
                     }
                     // Successfully updated ownership and marked the request as deleted
                     resolve(results);
                  });
               }
            });
         });
      }
      
      
      // Function to save a quote to the database
      async saveQuoteToDB({ requestId, quoteNote, counterPrice, timeWindowStart, timeWindowEnd, status }) {
         return new Promise((resolve, reject) => {
            // Query to check if the request ID already exists
            const checkQuery = `SELECT COUNT(*) AS count FROM quoteresponse WHERE request_id = ?`;
            
            connection.query(checkQuery, [requestId], (err, results) => {
               if (err) return reject(err);
               
               const recordExists = results[0].count > 0;
               
               if (recordExists) {
                  // If the record exists, perform an UPDATE
                  const updateQuery = `
                   UPDATE quoteresponse
                   SET counter_price = ?, time_window_start = ?, time_window_end = ?, response_note = ?, status = ?
                   WHERE request_id = ?
               `;
                  const updateValues = [counterPrice, timeWindowStart, timeWindowEnd, quoteNote, status, requestId];
                  
                  connection.query(updateQuery, updateValues, (err, results) => {
                     if (err) return reject(err);
                     resolve({ action: 'updated', results });
                  });
               } else {
                  // If the record doesn't exist, perform an INSERT
                  const insertQuery = `
                   INSERT INTO quoteresponse (request_id, counter_price, time_window_start, time_window_end, response_note, status)
                   VALUES (?, ?, ?, ?, ?, ?)
               `;
                  const insertValues = [requestId, counterPrice, timeWindowStart, timeWindowEnd, quoteNote, status];
                  
                  connection.query(insertQuery, insertValues, (err, results) => {
                     if (err) return reject(err);
                     resolve({ action: 'inserted', results });
                  });
               }
            });
         });
      }
      
      
      
      
      
      
      // Function to save the service request to the database
      async saveRequestToDB({ clientId, serviceType, propertyAdress, description, urgency, images }) {
         return new Promise((resolve, reject) => {
            const query = `
           INSERT INTO requestforquote (client_id, service_id, property_address, note, urgency, status)
           VALUES (?, ?, ?, ?, ?, ?)
       `;
            const values = [clientId, serviceType, propertyAdress, description, urgency, 'Pending'];
            
            connection.query(query, values, (err, results) => {
               if (err) return reject(err);
               const requestId = results.insertId;
               
               if (images && images.length > 0) {
                  const insertImageQuery = `INSERT INTO images (request_id, image_url) VALUES ?`;
                  const imageValues = images.map(image => [requestId, image]);
                  connection.query(insertImageQuery, [imageValues], (err) => {
                     if (err) return reject(err);
                     resolve(results);
                  });
               } else {
                  resolve(results);
               }
            });
         });
      }
      
      // Function to get service requests by user ID
      async getRequestsByUserId(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT R.*, 
                           CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                           S.service_name, S.proposed_price,
                           GROUP_CONCAT(I.image_url SEPARATOR ', ') AS image_urls
                           FROM requestforquote R 
                           JOIN users U ON U.id = R.client_id
                           JOIN service_types S ON S.service_id = R.service_id
                           JOIN images I ON I.request_id = R.request_id
                           WHERE R.client_id = ? 
                             AND R.is_deleted = 0
                           GROUP BY R.request_id, U.first_name, U.last_name, S.service_name;`;
            
            connection.query(query, [userId], (err, results) => {
               if (err) return reject(err);
               resolve(results);  // Return the list of requests
            });
         });
      }
      
      
      // getOrdersByUserId
      async getOrdersByUserId(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT O.*, R.*, QR.*, S.service_name, O.status, S.proposed_price
                           FROM orderofwork O
                           JOIN requestforquote R ON R.request_id = O.request_id
                           JOIN quoteresponse QR ON QR.request_id = O.request_id
                           JOIN service_types S ON S.service_id = R.service_id
                           WHERE R.client_id = ? AND R.is_deleted = 0 AND O.is_deleted = 0`;
            
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err); // Log the error for debugging
                  return reject(err);
               }
               resolve(results);
            });
         });
      }

      async getOrdersByUserIdAndStatus(userId, orderStatus) {
         return new Promise((resolve, reject) => {
             const query = `
                 SELECT O.*, R.*, QR.*, S.service_name, O.status, S.proposed_price
                 FROM orderofwork O
                 JOIN requestforquote R ON R.request_id = O.request_id
                 JOIN quoteresponse QR ON QR.request_id = O.request_id
                 JOIN service_types S ON S.service_id = R.service_id
                 WHERE R.owned_by = ? 
                 AND R.is_deleted = 0 
                 AND O.is_deleted = 0
                 AND O.status = '?'`; // Filter by the status (Active or Completed)
     
             connection.query(query, [userId, orderStatus], (err, results) => {
                 if (err) {
                     console.error('Database error:', err);
                     return reject(err);
                 }
                 resolve(results);
             });
         });
     }
     
     
      
      
      async getOrders(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT O.*, R.*, QR.*, S.service_name, O.status, O.request_id, S.proposed_price
                           FROM orderofwork O
                           JOIN requestforquote R ON R.request_id = O.request_id
                           LEFT JOIN quoteresponse QR ON QR.request_id = O.request_id
                           JOIN service_types S ON S.service_id = R.service_id
                           WHERE R.owned_by = ? AND O.is_deleted = 0;`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      
      
      // getNegotiationsByUserId
      async getNegotiationsByUserId(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT O.*, R.*, QR.*, S.service_name, S.proposed_price
                           FROM orderofwork O
                           JOIN requestforquote R ON R.request_id = O.request_id
                           JOIN quoteresponse QR ON QR.request_id = O.request_id
                           JOIN service_types S ON S.service_id = R.service_id
                           WHERE client_id = ? AND R.is_deleted = 0 AND O.is_deleted = 0 AND O.status = 'In Progress'`;  // Changed 'orders' to 'requestforquote'
            
            connection.query(query, [userId], (err, results) => {
               if (err) return reject(err);  // Handle errors
               resolve(results);  // Return the negotiation results
            });
         });
      }
      
      // In dbService.js file
      async updateNegotiationStatus(responseId, status) {
         return new Promise((resolve, reject) => {
            const query = `UPDATE quoteresponse
                      SET status = ?
                      WHERE response_id = ?`;
            
            // Execute the query to update the status
            connection.query(query, [status, responseId], (err, result) => {
               if (err) return reject(err);  // Handle any errors
               resolve(result);  // Return the result (affected rows)
            });
         });
      }
      
      
      // Get user profile by userId
      async getUserProfile(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users WHERE id = ?`;
            
            connection.query(query, [userId], (err, results) => {
               if (err) return reject(err);
               resolve(results[0]);  // Assuming the first result is the user's profile
            });
         });
      }
      
      // Get payment history by userId
      async getPaymentHistory(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT * FROM payment WHERE user_id = ?`;
            
            connection.query(query, [userId], (err, results) => {
               if (err) return reject(err);
               resolve(results);  // Return the list of payments
            });
         });
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
      async deleteRowById(request_id){
         try{
            request_id = parseInt(request_id, 10);
            // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => 
               {
               const query = "UPDATE requestforquote SET is_deleted = 1, updated_at = NOW() WHERE request_id = ?;";
               connection.query(query, [request_id], (err, result) => {
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
