import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS for styling

// Function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
};

const TableComponent = () => {
  // State to hold the data for all tables
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    doctors: [],
    medicaltests: [],
    prescriptions: [],
    medications: [],
    surgeries: [],
    bills: [],
    nurses: [],
    wards: [],
    patients_with_appointments: [],
    doctors_with_appointments: [],
    patients_with_medications: [],
    doctors_with_surgeries: [],
    nurses_assigned_to_wards: [],
    patients_with_bills: [],
    medications_prescribed_by_doctors: [],
    appointments_with_medical_tests: [],
    surgeries_with_medications: [],
    patients_with_assigned_nurses: []
  });
  
  
  // State for handling errors
  const [error, setError] = useState(null);
  
  // State for handling loading state
  const [loading, setLoading] = useState(true);
  
  // State to keep track of the currently active tab
  const [activeTab, setActiveTab] = useState('patients'); // Default to patients
  
  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        // List of table names
        const tableNames = ['patients', 'appointments', 'doctors', 'medicaltests', 'prescriptions', 
          'medications', 'surgeries', 'bills', 'nurses', 'wards', 
          'patients_with_appointments', 'doctors_with_appointments', 
          'patients_with_medications', 'doctors_with_surgeries', 
          'nurses_assigned_to_wards', 'patients_with_bills', 
          'medications_prescribed_by_doctors', 'appointments_with_medical_tests', 
          'surgeries_with_medications', 'patients_with_assigned_nurses'
        ];
        
        
        // Fetch data for all tables
        const responses = await Promise.all(
          tableNames.map(table => fetch(`http://localhost:8081/${table}`))
        );
        
        // Convert responses to JSON
        const dataPromises = responses.map(response => response.json());
        const allData = await Promise.all(dataPromises);
        
        console.log('API Response:', allData); // Log the API response
        
        // Map table names to their corresponding data
        const newData = tableNames.reduce((acc, tableName, index) => {
          acc[tableName] = allData[index];
          return acc;
        }, {});
        
        // Update state with fetched data
        setData(newData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts
  
  // Render a loading message while data is being fetched
  if (loading) {
    return <div className="loading-message">Loading data...</div>;
  }
  
  // Render an error message if there was an error fetching data
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  // Function to render the table for a given table name
  const renderTable = (tableName) => {
    // Column mappings for different tables
    const columnMapping = {
      'patients': { 'patient_id': 'Id', 'first_name': 'Name', 'age': 'Age', 'dob': 'DOB', 'gender': 'Gender', 'phone': 'Phone' },
      'appointments': { 'appointment_id': 'Id', 'patient_id': 'Patient Id', 'doctor_id': 'Doctor Id', 'appointment_date': 'Date', 'reason': 'Reason' },
      'doctors': { 'doctor_id': 'Id', 'first_name': 'Name', 'speciality': 'Specialization', 'phone': 'Phone' },
      'medicaltests': { 'test_id': 'Id', 'patient_id': 'Patient Id', 'doctor_id': 'Doctor Id', 'test_name': 'Test Name', 'test_date': 'Date', 'results': 'Results' },
      'prescriptions': { 'prescription_id': 'Id', 'patient_id': 'Patient Id', 'doctor_id': 'Doctor Id', 'medication_id': 'Medication Id', 'dosage': 'Dosage', 'prescription_date': 'Date' },
      'medications': { 'medication_id': 'Id', 'medication_name': 'Medication Name', 'dosage': 'Dosage', 'side_effects': 'Side Effects' },
      'surgeries': { 'surgery_id': 'Id', 'patient_id': 'Patient Id', 'doctor_id': 'Doctor Id', 'surgery_type': 'Surgery Type', 'surgery_date': 'Date' },
      'bills': { 'bill_id': 'Id', 'patient_id': 'Patient Id', 'total_amount': 'Total Amount', 'bill_date': 'Date', 'status': 'Status' },
      'nurses': { 'nurse_id': 'Id', 'first_name': 'Name', 'department': 'Department' },
      'wards': { 'ward_id': 'Id', 'ward_name': 'Ward Name', 'capacity': 'Capacity', 'nurse_id': 'Nurse Id' },
      'patients_with_appointments': { 'patient_name': 'Patient Name', 'doctor_name': 'Doctor Name', 'medication_name': 'Medication Name', 'dosage': 'Dosage' },
      'doctors_with_appointments': { 'doctor_name': 'Doctor Name', 'appointment_date': 'Appointment Date', 'patient_name': 'Patient Name', 'reason': 'Reason' },
      'patients_with_medications': { 'patient_name': 'Patient Name', 'medication_name': 'Medication Name', 'dosage': 'Dosage' },
      'doctors_with_surgeries': { 'doctor_name': 'Doctor Name', 'surgery_type': 'Surgery Type', 'surgery_date': 'Surgery Date', 'patient_name': 'Patient Name' },
      'nurses_assigned_to_wards': { 'nurse_name': 'Nurse Name', 'ward_name': 'Ward Name', 'capacity': 'capacity' },
      'patients_with_bills': { 'patient_name': 'Patient Name', 'total_amount': 'Total Amount', 'bill_date': 'Bill Date', 'status': 'Status' },
      'medications_prescribed_by_doctors': { 'doctor_name': 'Doctor Name', 'medication_name': 'Medication Name', 'dosage': 'Dosage', 'patient_name': 'Patient Name' },
      'appointments_with_medical_tests': { 'appointment_date': 'Appointment Date', 'reason': 'Reason', 'test_name': 'Test Name', 'results': 'Results' },
      'surgeries_with_medications': { 'surgery_type': 'Surgery Type', 'medication_name': 'Medication Name', 'dosage': 'Dosage' },
      'patients_with_assigned_nurses': { 'patient_name': 'Patients Name', 'nurse_name': 'Nurse Name', 'department': 'Department' },
      
    };
    
    // Get column headers and keys for the selected table
    const columns = Object.values(columnMapping[tableName]);
    const columnKeys = Object.keys(columnMapping[tableName]);
    const dateColumns = columnKeys.filter(key => key.includes('date') || key === 'dob');
    
    return (
      <section className="table-section">
      <h2>
      {tableName
        .replace(/_/g, ' ') 
        .replace(/\b\w/g, char => char.toUpperCase())}
        </h2>
        
        <table className="service-table">
        <thead>
        <tr>
        {columns.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
        </tr>
        </thead>
        <tbody>
        {data[tableName].length > 0 ? (
          data[tableName].map((row, index) => (
            <tr key={index}>
            {columnKeys.map((key, i) => (
              <td key={i}>
              {dateColumns.includes(key) ? formatDate(row[key]) :
                key === 'first_name' ? row[key] + ' ' + row['last_name'] :
                row[key] || 'N/A'}
                </td>
              ))}
              </tr>
            ))
          ) : (
            <tr>
            <td colSpan={columns.length}>No data available</td>
            </tr>
          )}
          </tbody>
          </table>
          </section>
        );
      };
      
      return (
        <div className="table-container">
        <header className="table-header">
        <h1>Hospital Records</h1>
        </header>
        
        {/* Menu */}
        <nav className="menu">
        <ul>
        {Object.keys(data).map(tableName => (
          <li key={tableName} onClick={() => setActiveTab(tableName)}>
          {tableName
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase())}
            </li>
          ))}
          </ul>
          </nav>
          
          {/* Display Active Table */}
          {renderTable(activeTab)}
          </div>
        );
      };
      
      export default TableComponent;
      