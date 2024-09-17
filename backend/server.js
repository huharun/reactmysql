const express = require('express'); const mysql = require('mysql'); const cors = require('cors');

const app = express(); const port = 8081;

// Middleware to enable CORS
app.use(cors());

// Database connection
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'hospital' });

// Connect to the database
db.connect(err => { if (err) { console.error('Database connection failed:', err); return; } console.log('Database connected!'); });

// // when the browser points to localhost:8081/listall
// app.get('/listall', (request, response) => {
//   const stmt = "SELECT * FROM Students"
//   dbconn.query(stmt, (err, data) => {
//       if(err) return response.json(err)
//       else return response.json(data)
//   })
// });

// Define table names
const tableNames = [
    'patients', 'appointments', 'doctors', 'medicaltests', 'prescriptions',
    'medications', 'surgeries', 'bills', 'nurses', 'wards'
  ];
  
// Create endpoints for all tables
tableNames.forEach(table => { app.get(`/${table}`, (req, res) => { const sql = `SELECT * FROM ${table}`; db.query(sql, (err, data) => { if (err) { console.error(`Error executing query for ${table}:`, err); return res.status(500).json({ error: 'Database query failed' }); } return res.json(data); }); }); });

// Start the server
app.listen(port, () => { console.log(`Server running at http://localhost:${port}`); });
