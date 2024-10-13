const express = require('express');  // Import Express framework for building the web server
const mysql = require('mysql');      // Import MySQL module for database interaction
const cors = require('cors');        // Import CORS module to handle cross-origin requests

const app = express();               // Create an Express application instance
const port = 8081;                   // Define the port where the server will listen for requests


// Middleware to enable CORS
app.use(cors());

// Database connection
const db = mysql.createConnection({ 
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'hospital' 
});

// Connect to the database
db.connect(err => { 
  if (err) { 
    console.error('Database connection failed:', err); 
    return; 
  } 
  console.log('Database connected!'); 
});

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


// Function to execute SQL queries and handle responses
const executeQuery = (sql, res) => {
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Database query failed', detail:err.message });
    }
    return res.json(data);
  });
};


// Create endpoints for all tables
const data =  tableNames.forEach(table => { 
  app.get(`/${table}`, (req, res) => { 
    const sql = `SELECT * FROM ${table}`; 
    executeQuery(sql, res,);
  }); 
});

// 1. Patients, Doctors, Medications, and Prescriptions:
app.get('/patients_with_appointments', (req, res) => {
  const sql = `
    SELECT CONCAT(P.first_name, ' ', P.last_name) AS patient_name,
       CONCAT(D.first_name, ' ', D.last_name) AS doctor_name,
       M.medication_name,
       PT.dosage
    FROM prescriptions PT
    JOIN patients P ON P.patient_id = PT.patient_id
    JOIN doctors D ON D.doctor_id = PT.doctor_id
    JOIN medications M ON M.medication_id = PT.medication_id
    WHERE PT.doctor_id IN (
        SELECT doctor_id 
        FROM prescriptions 
        HAVING COUNT(DISTINCT patient_id) > 1
    AND PT.dosage > '20mg'
    );`;
  executeQuery(sql, res,);
});

// 2. Doctors and Their Appointments
app.get('/doctors_with_appointments', (req, res) => {
  const sql = `
    SELECT CONCAT(D.first_name, ' ', D.last_name) AS doctor_name,
           A.appointment_date,
           CONCAT(P.first_name, ' ', P.last_name) AS patient_name,
           A.reason
    FROM doctors D
    JOIN appointments A ON D.doctor_id = A.doctor_id
    JOIN patients P ON A.patient_id = P.patient_id
    WHERE A.appointment_date BETWEEN '2024-08-05' AND '2024-08-10'
    AND A.reason IN ('therapy', 'consultation');
  `;
  executeQuery(sql, res);
});

// 3. Patients and Their Medications
app.get('/patients_with_medications', (req, res) => {
  const sql = `
    SELECT CONCAT(P.first_name, ' ', P.last_name) AS patient_name,
           M.medication_name,
           PR.dosage
    FROM patients P
    JOIN prescriptions PR ON P.patient_id = PR.patient_id
    JOIN medications M ON PR.medication_id = M.medication_id
    WHERE M.dosage > 200 
    AND M.dosage <= 500 ;
  `;
  executeQuery(sql, res);
});

// 4. Doctors and Surgeries They Performed
app.get('/doctors_with_surgeries', (req, res) => {
  const sql = `
    SELECT CONCAT(D.first_name, ' ', D.last_name) AS doctor_name,
           S.surgery_type,
           S.surgery_date,
           CONCAT(P.first_name, ' ', P.last_name) AS patient_name
    FROM doctors D
    JOIN surgeries S ON D.doctor_id = S.doctor_id
    JOIN patients P ON S.patient_id = P.patient_id
    WHERE S.surgery_type LIKE '%surgery%'
    AND S.surgery_date < '2024-08-05';
  `;
  executeQuery(sql, res);
});

// 5. Nurses Assigned to Wards
app.get('/nurses_assigned_to_wards', (req, res) => {
  const sql = `
    SELECT CONCAT(N.first_name, ' ', N.last_name) AS nurse_name,
           W.ward_name,
           W.capacity
    FROM nurses N
    JOIN wards W ON N.nurse_id = W.nurse_id
    WHERE capacity >= 20
    ORDER BY W.ward_name DESC;
  `;
  executeQuery(sql, res);
});

// 6. Patients and Their Bills
app.get('/patients_with_bills', (req, res) => {
  const sql = `
    SELECT CONCAT(P.first_name, ' ', P.last_name) AS patient_name,
           B.total_amount,
           B.bill_date,
           B.status
    FROM patients P
    JOIN bills B ON P.patient_id = B.patient_id
    WHERE B.total_amount >= 400
    AND B.status = "unpaid";
  `;
  executeQuery(sql, res);
});

// 7. Medications Prescribed by Doctors
app.get('/medications_prescribed_by_doctors', (req, res) => {
  const sql = `
    SELECT CONCAT(D.first_name, ' ', D.last_name) AS doctor_name,
           M.medication_name,
           PR.dosage,
           CONCAT(P.first_name, ' ', P.last_name) AS patient_name
    FROM doctors D
    JOIN prescriptions PR ON D.doctor_id = PR.doctor_id
    JOIN medications M ON PR.medication_id = M.medication_id
    JOIN patients P ON PR.patient_id = P.patient_id
    WHERE M.medication_id IN (2, 4, 6, 9)
    AND PR.dosage < 100;
  `;
  executeQuery(sql, res);
});

// 8. Appointments and Related Medical Tests
app.get('/appointments_with_medical_tests', (req, res) => {
  const sql = `
    SELECT A.appointment_date,
           A.reason,
           M.test_name,
           M.results
    FROM appointments A
    JOIN medicaltests M ON A.patient_id = M.patient_id AND A.doctor_id = M.doctor_id
    Where M.results != 'normal'
    AND M.test_name IN ('mri','Cholesterol Test', 'biopsy');
  `;
  executeQuery(sql, res);
});

// 9. Surgeries and the Medications Used
app.get('/surgeries_with_medications', (req, res) => {
  const sql = `
    SELECT S.surgery_type,
           M.medication_name,
           PR.dosage
    FROM surgeries S
    JOIN prescriptions PR ON S.patient_id = PR.patient_id
    JOIN medications M ON PR.medication_id = M.medication_id
    WHERE S.surgery_type LIKE 'H%' 
    AND M.medication_name LIKE '%l';
  `;
  executeQuery(sql, res);
});

// 10. Patients and Their Assigned Nurses
app.get('/patients_with_assigned_nurses', (req, res) => {
  const sql = `
    SELECT GROUP_CONCAT(CONCAT(P.first_name,' ',P.last_name) SEPARATOR ', ') AS patient_name,
       CONCAT(N.first_name,' ',N.last_name) AS nurse_name,
       N.department
    FROM patients P
    JOIN surgeries S ON S.patient_id=P.patient_id
    JOIN doctors D ON D.doctor_id=S.doctor_id
    JOIN nurses N ON N.department=D.speciality
    GROUP BY D.doctor_id,N.department
    HAVING COUNT(P.patient_id)>1;
  `;
  executeQuery(sql, res);
});




// Start the server
app.listen(port, () => { 
  console.log(`Server running at http://localhost:${port}`); 
});
