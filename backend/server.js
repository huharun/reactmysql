const express = require('express'); 
const mysql = require('mysql'); 
const cors = require('cors');

const app = express(); 
const port = 8081;

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
    JOIN medications M ON M.medication_id = PT.medication_id;`;
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
    JOIN patients P ON A.patient_id = P.patient_id;
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
    JOIN medications M ON PR.medication_id = M.medication_id;
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
    JOIN patients P ON S.patient_id = P.patient_id;
  `;
  executeQuery(sql, res);
});

// 5. Nurses Assigned to Wards
app.get('/nurses_assigned_to_wards', (req, res) => {
  const sql = `
    SELECT CONCAT(N.first_name, ' ', N.last_name) AS nurse_name,
           W.ward_name
    FROM nurses N
    JOIN wards W ON N.nurse_id = W.nurse_id;
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
    JOIN bills B ON P.patient_id = B.patient_id;
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
    JOIN patients P ON PR.patient_id = P.patient_id;
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
    JOIN medicaltests M ON A.patient_id = M.patient_id
    AND A.doctor_id = M.doctor_id;
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
    JOIN medications M ON PR.medication_id = M.medication_id;
  `;
  executeQuery(sql, res);
});

// 10. Patients and Their Assigned Nurses
app.get('/patients_with_assigned_nurses', (req, res) => {
  const sql = `
    SELECT CONCAT(P.first_name, ' ', P.last_name) AS patient_name,
           CONCAT(N.first_name, ' ', N.last_name) AS nurse_name,
           N.department
    FROM patients P
    JOIN surgeries S ON S.patient_id = P.patient_id
    JOIN doctors D ON D.doctor_id = S.doctor_id
    JOIN nurses N ON N.department = D.speciality;
  `;
  executeQuery(sql, res);
});




// Start the server
app.listen(port, () => { 
  console.log(`Server running at http://localhost:${port}`); 
});
