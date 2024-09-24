# **CSC 6710 Exercise 1: SQL Database Creation and Manipulation**

## **Overview**
In this exercise, I created and manipulated a database using SQL. The goal was to demonstrate fluency in SQL through various operations.

## **Tasks Completed**

### **Accessed an Online SQL Compiler**
Used: **Programiz SQL Online Compiler**

### **Created Tables**
I created **10 tables**, including **patients**, **doctors**, **appointments**, and others.

### **Inserted Data**
Inserted at least **10 records** into each table to simulate a healthcare database.

### **Executed DELETE Statements**
Performed **10 different DELETE operations** to remove records from the tables.

### **Executed UPDATE Statements**
Carried out **10 different UPDATE operations** to modify existing records.

### **Documentation**
All SQL statements were documented in a file named **`sql_ex1_arun.txt`**.

---

# **CSC 6710 Exercise 2: SQL Database Interaction with XAMPP**

## **Overview**
In this exercise, I used XAMPP to create and interact with a database. The goal was to demonstrate SQL fluency through various SELECT statements involving multiple tables.

## **Tasks Completed**

### **Downloaded and Installed XAMPP**
Downloaded XAMPP from the official website and installed it on my Windows PC.

### **Launched XAMPP**
Opened the XAMPP control panel and started the **Apache** and **MySQL** services.

### **Accessed phpMyAdmin**
Clicked the **Admin** button in the XAMPP control panel to open phpMyAdmin for SQL operations.

### **Created Tables and Inserted Data**
Created **10 tables** using SQL CREATE statements and inserted at least **10 records** into each table to build a healthcare database.

### **Executed SELECT Statements**
Ran **10 SELECT statements** that joined at least two tables, retrieving relevant information from the database.

### **Documentation**
All SQL statements were documented in a file named **`sql_ex2_arun.txt`**.

---

# **CSC 6710 Exercise 3: Node.js and React Application Development**

## **Overview**
In this exercise, I modified both frontend and backend code to display the results of executing various SQL SELECT statements. The main goal was to integrate Node.js with a MySQL database and present the data through a React application.

## **How to Run the Given Sample Code**

To get the sample project working:

1. **Create Project Directory**: Create a directory called `reactmysql` as your project directory.
2. **Set Up Backend Directory**: Under `reactmysql`, create a directory named `Backend`.
3. **Copy Backend Files**: Copy the necessary files into your `Backend` directory.
4. **Create Database Tables**: Open your MySQL client and create the required **10 tables** in the **hospital** database.
5. **Insert Sample Data**: Insert sample data into the **10 tables**. You can find the SQL export in the repository.
6. **Initialize Backend**: Navigate to the `Backend` directory, initialize a new Node.js project, and install the necessary packages.
7. **Modify package.json**: Modify the scripts section of the `Backend/package.json` to set up the start command.
8. **Start the Backend**: Run the backend server and access the backend endpoints directly.
9. **Set Up Frontend**: At the project home directory, create a new Vite project for the frontend.
10. **Replace Frontend Code**: Replace the `App.jsx` file under `Frontend/src` with the updated code.
11. **Run Frontend**: Open a new terminal and run the necessary commands to start the frontend application.

## **Tasks Completed**

### **Installed Necessary Packages**
I began by installing Node.js and npm on my system. Then, I installed the following packages:
- **Express** for creating the server.
- **MySQL** for database interaction.
- **CORS** to allow cross-origin requests.
- **Nodemon** for automatic server restarts during development.

### **Set Up the Backend (`server.js`)**
I created a `server.js` file where I:
- Established a connection to the MySQL database.
- Created endpoints to handle requests for various tables and custom queries.
- Implemented SQL SELECT statements that join multiple tables and include conditions in their WHERE clauses. For example, I queried for patients with their appointments, doctors with their surgeries, and nurses assigned to wards.

### **Modified Frontend Code (`App.jsx`)**
In the `App.jsx` file, I:
- Used React to create a table component that fetches data from the server.
- Organized the data into different sections based on the types of information.
- Utilized state management to handle loading states and errors while fetching data.

### **CSS Styling**
I updated the `App.css` file to improve the visual layout of the application. This included styling for tables, headers, and loading/error messages.

## **SQL Statements**
All SQL statements used in this exercise are documented in the file named **`sql_ex3_arun.txt`**.
