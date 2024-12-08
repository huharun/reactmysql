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
      
      async getReport(type, userId) {
         return new Promise((resolve, reject) => {
            let query = "";
            
            // Define queries based on the report type
            if (type === 'bigClients') {
               query = `SELECT 
                        CONCAT(U.first_name, ' ', U.last_name) AS client_name,
                        GROUP_CONCAT(DISTINCT CONCAT(S.service_name, ' (', service_counts.service_count, ')') SEPARATOR ', ') AS service_name,
                        COUNT(O.order_id) AS total_orders,
                        SUM(CASE WHEN O.status = 'Completed' THEN 1 ELSE 0 END) AS completed_orders
                        FROM orderofwork O
                        JOIN requestforquote R ON R.request_id = O.request_id
                        JOIN service_types S ON S.service_id = R.service_id
                        JOIN users U ON U.id = R.client_id
                        JOIN (
                           SELECT R.client_id, R.service_id, COUNT(O.order_id) AS service_count
                           FROM orderofwork O
                           JOIN requestforquote R ON R.request_id = O.request_id
                           WHERE R.is_deleted = 0
                           GROUP BY R.client_id, R.service_id
                           ) AS service_counts ON service_counts.client_id = U.id AND service_counts.service_id = S.service_id
                        WHERE R.owned_by = ${userId}
                        AND R.is_deleted = 0
                        GROUP BY U.id
                        ORDER BY total_orders DESC;
               `;
            } else if (type === 'difficultClients') {
               query = `
                     SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                     COUNT(CASE WHEN QR.status = 'Accepted' AND B.status IN ('Pending', 'Disputed') THEN O.order_id END) AS difficult_orders,
                     COUNT(O.order_id) AS total_orders
                     FROM orderofwork O
                     JOIN requestforquote R ON R.request_id = O.request_id
                     LEFT JOIN quoteresponse QR ON QR.request_id = O.request_id
                     LEFT JOIN bill B ON B.order_id = O.order_id
                     JOIN users U ON U.id = R.client_id
                     WHERE R.owned_by = ${userId} AND R.is_deleted = 0
                     GROUP BY U.id
                     ORDER BY total_orders DESC;
                 `;
            } else if (type === 'thisMonthQuotes') {
               query = `
                     SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, O.order_id, S.service_name, O.accepted_date, QR.counter_price as amount, O.accepted_date
                     FROM orderofwork O
                     JOIN requestforquote R ON R.request_id = O.request_id
                     JOIN quoteresponse QR ON QR.request_id = O.request_id
                     JOIN users U ON U.id = R.client_id
                     JOIN service_types S ON S.service_id = R.service_id
                     WHERE R.owned_by = ${userId} AND MONTH(O.accepted_date) = MONTH(CURRENT_DATE()) AND R.is_deleted = 0
                     ORDER BY O.accepted_date DESC;
                 `;
            } else if (type === 'prospectiveQuotes') {
               query = `
                   SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, U.email, U.phone, U.last_sign_in
                   FROM users U
                   LEFT JOIN requestforquote R ON U.id = R.client_id
                   WHERE R.request_id IS NULL;
               `;
           }else if (type === 'largestDriveway') {
               query = `
               SELECT GROUP_CONCAT((CONCAT(U.first_name, ' ', U.last_name))) AS client_name,
               MAX(R.square_feet) AS square_feet,
		         GROUP_CONCAT(R.request_id) as request_id,
		         GROUP_CONCAT(R.property_address) as property_address,
               GROUP_CONCAT(I.image_url SEPARATOR ', ') AS image_urls
               FROM requestforquote R
               JOIN images I ON I.request_id = R.request_id
               JOIN users U ON U.id = R.client_id
               JOIN service_types S ON S.service_id = R.service_id
               WHERE R.is_deleted = 0
               AND R.owned_by = 8
               AND R.square_feet = (
                  SELECT MAX(square_feet)
                  FROM requestforquote
                  WHERE is_deleted = 0
                  AND owned_by = 8
               )
               GROUP BY R.owned_by;
               `;
            } else if (type === 'overdueBills') {
               query = `
                   SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                          B.bill_id, 
                          B.amount, 
                          B.generated_date, 
                          B.due_date
                   FROM bill B
                   JOIN orderofwork O ON O.order_id = B.order_id
                   JOIN requestforquote R ON R.request_id = O.request_id
                   JOIN users U ON U.id = R.client_id
                   LEFT JOIN payment P ON P.bill_id = B.bill_id
                   WHERE B.due_date < CURRENT_DATE() 
                     AND (P.payment_date IS NULL OR P.payment_date > DATE_ADD(B.generated_date, INTERVAL 1 WEEK))
                     AND R.is_deleted = 0
                   ORDER BY B.due_date ASC;
               `;
           }else if (type === 'badClients') {
            query = `
                SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                       COUNT(B.bill_id) AS total_overdue_bills, 
                       GROUP_CONCAT(B.generated_date) AS generated_dates, 
                       GROUP_CONCAT(B.due_date) AS due_dates
                FROM users U
                JOIN requestforquote R ON R.client_id = U.id
                JOIN orderofwork O ON O.request_id = R.request_id
                JOIN bill B ON B.order_id = O.order_id
                LEFT JOIN payment P ON P.bill_id = B.bill_id
                WHERE R.is_deleted = 0
                  AND (P.payment_date IS NULL OR P.payment_date > DATE_ADD(B.generated_date, INTERVAL 1 WEEK))
                GROUP BY U.id
                HAVING total_overdue_bills > 0
                ORDER BY total_overdue_bills DESC;
            `;
        }
        
          else if (type === 'goodClients') {
            query = `
                SELECT CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                       COUNT(B.bill_id) AS timely_payments, GROUP_CONCAT(B.due_date) as due_dates, GROUP_CONCAT(P.payment_date) AS payment_dates
                FROM users U
                JOIN requestforquote R ON R.client_id = U.id
                JOIN orderofwork O ON O.request_id = R.request_id
                JOIN bill B ON B.order_id = O.order_id
                LEFT JOIN payment P ON P.bill_id = B.bill_id
                WHERE R.is_deleted = 0
                  AND P.payment_date IS NOT NULL
                  AND P.payment_date <= DATE_ADD(B.generated_date, INTERVAL 1 DAY)
                GROUP BY U.id
                HAVING COUNT(B.bill_id) > 0
                ORDER BY timely_payments DESC;
            `;
               }  else {
               return reject(new Error("Invalid report type"));
            }
            
            // Execute the query
            connection.query(query, (err, results) => {
               if (err) {
                  return reject(err);
               }
               resolve(results);
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
      
      // Function to save chat messages to the database
      async saveChatToDB({ orderId, senderId, receiverId, message }) {
         return new Promise((resolve, reject) => {
            const insertQuery = `
           INSERT INTO chat_messages (order_id, sender_id, receiver_id, message)
           VALUES (?, ?, ?, ?)
       `;
            const insertValues = [orderId, senderId, receiverId, message];
            
            connection.query(insertQuery, insertValues, (err, results) => {
               if (err) return reject(err);
               resolve({ action: 'inserted', results });
            });
         });
      }
      
      
      // Function to get chat messages from the database
      async getChatMessages(orderId) {
         return new Promise((resolve, reject) => {
            const selectQuery = `
                     SELECT 
                         cm.chat_id, cm.sender_id, cm.receiver_id, cm.message, cm.timestamp,
                         CONCAT(
                             (CASE WHEN u_sender.user_type = 3 THEN u_sender.first_name ELSE u_sender.first_name END), ' '
                         ) AS sender_name, 
                         CONCAT(
                             (CASE WHEN u_receiver.user_type = 3 THEN u_receiver.first_name ELSE u_receiver.first_name END), ' '
                         ) AS receiver_name
                     FROM chat_messages cm
                     LEFT JOIN users u_sender ON cm.sender_id = u_sender.id  
                     LEFT JOIN users u_receiver ON cm.receiver_id = u_receiver.id  
                     WHERE cm.order_id = ?
                     ORDER BY cm.timestamp ASC;`;
            
            
            connection.query(selectQuery, [orderId], (err, results) => {
               if (err) return reject(err);
               resolve(results);
            });
         });
      }
      
      
      
      
      
      // Function to save the service request to the database
      async saveRequestToDB({ clientId, serviceType, propertyAdress, square_feet, description, urgency, images }) {
         return new Promise((resolve, reject) => {
            const query = `
           INSERT INTO requestforquote (client_id, service_id, property_address, square_feet, note, urgency, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)
       `;
            const values = [clientId, serviceType, propertyAdress, square_feet, description, urgency, 'Pending'];
            
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
            const query = `SELECT O.*, R.*, QR.*, B.*, S.service_name, O.status, S.proposed_price, O.order_id
                           FROM orderofwork O
                           LEFT JOIN bill B ON B.order_id = O.order_id
                           JOIN requestforquote R ON R.request_id = O.request_id
                           LEFT JOIN quoteresponse QR ON QR.request_id = O.request_id
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
                 AND O.status = ?`; // Filter by the status (Active or Completed)
            
            connection.query(query, [userId, orderStatus], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      async updateOrderStatus(orderId, newStatus) {
         return new Promise((resolve, reject) => {
            const query = `
                 UPDATE orderofwork
                 SET status = ?
                 WHERE order_id = ? AND is_deleted = 0
             `;
            connection.query(query, [newStatus, orderId], (err, result) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(result);
            });
         });
      }
      
      
      
      
      async getOrders(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT O.*, R.*, QR.*, B.*, S.service_name, O.status, B.status as bill_status , O.request_id, O.order_id, S.proposed_price, CONCAT(U.first_name, ' ', U.last_name) AS client_name
                           FROM orderofwork O
                           LEFT JOIN bill B ON B.order_id = O.order_id
                           JOIN requestforquote R ON R.request_id = O.request_id
                           JOIN users U ON U.id = R.client_id
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
            const query = `SELECT O.*, R.*, QR.*, S.service_name, S.proposed_price, 
                           CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                           CONCAT(O_user.first_name, ' ', O_user.last_name) AS owner_name
                           FROM orderofwork O
                           JOIN requestforquote R ON R.request_id = O.request_id
                           JOIN users U ON U.id = R.client_id
                           LEFT JOIN users O_user ON O_user.id = R.owned_by  -- Changed alias to O_user
                           JOIN quoteresponse QR ON QR.request_id = O.request_id
                           JOIN service_types S ON S.service_id = R.service_id
                           WHERE client_id = ? 
                             AND R.is_deleted = 0 
                             AND O.is_deleted = 0 
                             AND O.status = 'In Progress'`;
            
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
      
      // In dbService.js file
      async getBillsByUserId(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT bill_id, order_id, amount, discount, generated_date, due_date, status
                           FROM bills
                           AND is_deleted = 0
                           ORDER BY generated_date DESC;`;
            
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      
      // Function to generate a bill
      async generateBill(orderId, requestId, amount, discount, dueDate, status) {
         return new Promise((resolve, reject) => {
            const billDate = new Date(); // Current date for the bill's generation date
            
            // First, check if the bill already exists for the given orderId
            const checkQuery = 'SELECT * FROM bill WHERE order_id = ?';
            
            connection.query(checkQuery, [orderId], (err, results) => {
               if (err) {
                  console.error('Error checking existing bill:', err);
                  return reject(err); // Reject if an error occurs during the check
               }
               
               // If the orderId already exists, update the existing record
               if (results.length > 0) {
                  const updateQuery = `
                   UPDATE bill 
                   SET amount = ?, discount = ?, generated_date = ?, due_date = ?, status = ? 
                   WHERE order_id = ?
               `;
                  const updateValues = [amount, discount, billDate, dueDate, status, orderId];
                  
                  connection.query(updateQuery, updateValues, (updateErr, updateResults) => {
                     if (updateErr) {
                        console.error('Error updating bill:', updateErr);
                        return reject(updateErr); // Reject if an error occurs during the update
                     }
                     resolve(updateResults); // Resolve with update result
                  });
               } else {
                  // If the orderId does not exist, insert a new record
                  const insertQuery = `
                   INSERT INTO bill (order_id, amount, discount, generated_date, due_date, status) 
                   VALUES (?, ?, ?, ?, ?, ?)
               `;
                  const insertValues = [orderId, amount, discount, billDate, dueDate, status];
                  
                  connection.query(insertQuery, insertValues, (insertErr, insertResults) => {
                     if (insertErr) {
                        console.error('Error inserting bill:', insertErr);
                        return reject(insertErr); // Reject if an error occurs during the insert
                     }
                     resolve(insertResults); // Resolve with insert result
                  });
               }
            });
         });
      }
      
      // Get revenue report by userId
      async getRevenueReport(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT month, total_revenue, new_clients 
                      FROM revenue_reports 
                      WHERE user_id = ?`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      // Get big clients by userId
      async getBigClients(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT name, revenue, last_purchase 
                      FROM big_clients 
                      WHERE user_id = ?`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      // Get overdue bills by userId
      async getOverdueBills(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT bill_id, amount, due_date, status 
                      FROM overdue_bills 
                      WHERE user_id = ?`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      // Get client ratings by userId
      async getClientRatings(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT name, rating, feedback 
                      FROM client_ratings 
                      WHERE user_id = ?`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Database error:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      
      
      // Function to get all bills for a user based on user type
      async getAllBills(userId, userType) {
         return new Promise((resolve, reject) => {
            let query = `
           SELECT b.bill_id, b.order_id, b.amount, b.discount, b.generated_date, b.due_date, U.email, S.service_name, S.proposed_price, CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                        CONCAT(UO.first_name, ' ', UO.last_name) AS owner_name, b.status AS bill_status, o.status AS order_status, r.property_address, QR.counter_price, b.dispute_reason, b.dispute_resolve
           FROM bill b
           INNER JOIN orderofwork o ON b.order_id = o.order_id
           INNER JOIN requestforquote r ON o.request_id = r.request_id
           JOIN users U ON U.id = R.client_id
           LEFT JOIN users UO ON UO.id = R.owned_by 
           JOIN service_types S ON S.service_id = R.service_id
           JOIN quoteresponse QR ON QR.request_id = o.request_id
           WHERE
       `;
            let queryParams = [];
            
            // Split WHERE condition based on user type
            if (userType === 2) {
               query += " r.owned_by = ?";
               queryParams = [userId]; // userId is passed as owned_by
            } else if (userType === 3) {
               query += " r.client_id = ?";
               queryParams = [userId]; // userId is passed as client_id
            } else {
               return reject('Invalid userType');
            }
            
            // Execute the query
            connection.query(query, queryParams, (err, results) => {
               if (err) {
                  console.error('Error fetching bills:', err);
                  return reject(err);
               }
               resolve(results); // Return the fetched bills with additional details
            });
         });
      }
      
      
      
      
      // Function to get active disputes for a user
      async getActiveDisputes(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT * FROM disputes WHERE user_id = ? AND status = 'Active'`;
            connection.query(query, [userId], (err, results) => {
               if (err) {
                  console.error('Error fetching disputes:', err);
                  return reject(err);
               }
               resolve(results);
            });
         });
      }
      
      // Function to resolve a dispute in the database
      async resolveDispute(billId, reason) {
         return new Promise((resolve, reject) => {
            const query = `UPDATE bill SET status = 'Resolved', dispute_resolve = ? WHERE bill_id = ?`;
            connection.query(query, [reason, billId], (err, results) => {
               if (err) {
                  console.error('Error resolving dispute:', err);
                  return reject(err);
               }
               // If the query was successful and affected rows are > 0, resolve the promise
               if (results.affectedRows > 0) {
                  resolve(results);
               } else {
                  reject('No rows affected, dispute resolution failed.');
               }
            });
         });
      }
      
      
      // Get bill details by userId, billId, and orderId
      async getBillDetails(userId, billId, orderId) {
         return new Promise((resolve, reject) => {
            const query = `
           SELECT B.*, O.*, QR.*, S.service_name, O.status, S.proposed_price, CONCAT(U.first_name, ' ', U.last_name) AS name, U.email, U.credit_card
           FROM bill B
           JOIN orderofwork O ON O.order_id = B.order_id
           JOIN requestforquote R ON R.request_id = O.request_id
           JOIN users U ON U.id = R.client_id
           JOIN quoteresponse QR ON QR.request_id = O.request_id
           JOIN service_types S ON S.service_id = R.service_id
           WHERE B.bill_id = ? AND O.order_id = ?
       `;
            
            connection.query(query, [billId, orderId], (err, results) => {
               if (err) return reject(err);
               resolve(results);  // Resolving with the bill details
            });
         });
      }
      
      
      // Function to insert payment details into the payment table
      async insertPaymentDetails(userId, billId, amount, cardNumber, cardExpiry, cardCVC, paymentStatus, paymentMethod, transactionId) {
         return new Promise((resolve, reject) => {
            // Start a transaction
            connection.beginTransaction((err) => {
               if (err) {
                  return reject(err);
               }
               
               // Check if the bill is already paid
               const checkBillQuery = `
                     SELECT status FROM bill WHERE bill_id = ? AND status = 'paid';
                 `;
               
               connection.query(checkBillQuery, [billId], (err, results) => {
                  if (err) {
                     return connection.rollback(() => reject(err)); // Rollback if there's an error checking the bill status
                  }
                  
                  // If the bill is already paid, reject the payment request
                  if (results.length > 0) {
                     return connection.rollback(() => reject(new Error('This bill has already been paid.')));
                  }
                  
                  // Insert payment details into the payment table
                  const paymentQuery = `
                         INSERT INTO payment (bill_id, user_id, amount, card_number, card_expiry, card_cvc, payment_status, payment_method, transaction_id, payment_date)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                     `;
                  
                  connection.query(paymentQuery, [billId, userId, amount, cardNumber, cardExpiry, cardCVC, paymentStatus, paymentMethod, transactionId], (err, results) => {
                     if (err) {
                        return connection.rollback(() => reject(err)); // Rollback if payment insertion fails
                     }
                     
                     // Update the bill table to mark the bill as paid
                     const billUpdateQuery = `
                             UPDATE bill
                             SET status = 'paid'
                             WHERE bill_id = ?
                         `;
                     
                     connection.query(billUpdateQuery, [billId], (err, updateResults) => {
                        if (err) {
                           return connection.rollback(() => reject(err)); // Rollback if bill update fails
                        }
                        
                        // Commit the transaction if both queries are successful
                        connection.commit((err) => {
                           if (err) {
                              return connection.rollback(() => reject(err)); // Rollback on commit failure
                           }
                           resolve(results);  // Resolve with the payment insertion results
                        });
                     });
                  });
               });
            });
         });
      }
      
      
      // Function to dispute a bill
      async disputeBill(billId, orderId, reason) {
         return new Promise((resolve, reject) => {
            const query = `UPDATE bill SET status = 'Disputed', dispute_reason = ? WHERE bill_id = ?`;
            
            const queryParams = [reason, billId];
            
            connection.query(query, queryParams, (err, results) => {
               if (err) {
                  console.error('Error updating dispute:', err);
                  return reject(err);
               }
               resolve(results);
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
      // Function to update the user profile in the database
      async updateUserProfile(userId, first_name, last_name, email, phone, address, credit_card) {
         return new Promise((resolve, reject) => {
            const query = `
                 UPDATE users SET 
                     first_name = ?, 
                     last_name = ?, 
                     email = ?, 
                     phone = ?, 
                     address = ?, 
                     credit_card = ? 
                 WHERE id = ?
             `;
            const values = [first_name, last_name, email, phone, address, credit_card, userId];
            
            console.log('Executing query:', query);
            console.log('With values:', values); // Log query and values for troubleshooting
            
            connection.query(query, values, (err, results) => {
               if (err) {
                  console.error('Database query error:', err); // Log the actual error
                  return reject({ success: false, message: 'Error updating profile', details: err.message });
               }
               
               if (results.affectedRows > 0) {
                  resolve({ success: true });
               } else {
                  console.log('No rows affected. Maybe the user was not found.');
                  resolve({ success: false, message: 'User not found or no changes made' });
               }
            });
         });
      }
      
      // Get payment history by userId
      async getPaymentHistory(userId) {
         return new Promise((resolve, reject) => {
            const query = `SELECT B.*, O.*, QR.*, P.*, S.service_name, O.status, S.proposed_price, CONCAT(U.first_name, ' ', U.last_name) AS client_name, 
                        CONCAT(UO.first_name, ' ', UO.last_name) AS owner_name, U.email, U.credit_card
           FROM bill B
           JOIN payment P ON P.bill_id = B.bill_id
           JOIN orderofwork O ON O.order_id = B.order_id
           JOIN requestforquote R ON R.request_id = O.request_id
           JOIN users U ON U.id = R.client_id
           LEFT JOIN users UO ON UO.id = R.owned_by 
           JOIN quoteresponse QR ON QR.request_id = O.request_id
           JOIN service_types S ON S.service_id = R.service_id
           WHERE R.client_id = ?`;
            
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
