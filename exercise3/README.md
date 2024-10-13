# **CSC 6710 Exercise 3: Node.js and React Application Development**

## **Overview**
In this exercise, I modified both frontend and backend code to display the results of executing various SQL SELECT statements. The main goal was to integrate Node.js with a MySQL database and present the data through a React application.

---

**Open Database and Import SQL File**:  
   Open your MySQL client and connect to your database server. Create a new database named **`hospital`** if it doesn't exist. Then, import the **`hospital.sql`** file:
   ```sql
   CREATE DATABASE hospital;
   USE hospital;
   SOURCE path/to/hospital.sql;
   ```
   Make sure to replace **`path/to/hospital.sql`** with the actual path to the file inside the **reactmysql** folder.

---

## **How to Run the Given Sample Code**

1. **Create Project Directory**:  
   Create a directory called **`reactmysql`** as your project directory.

2. **Set Up Backend Directory**:  
   Under **`reactmysql`**, create a directory named **`Backend`**.

3. **Copy Backend Files**:  
   Copy the necessary files into your **`Backend`** directory.

4. **Create Database Tables**:  
   Open your MySQL client and create the required **10 tables** in the **hospital** database.

5. **Insert Sample Data**:  
   Insert sample data into the **10 tables**. You can find the SQL export in the repository.

6. **Initialize Backend**:  
   Navigate to the **`Backend`** directory, initialize a new Node.js project, and install the necessary packages:
   ```bash
   npm install
   ```

7. **Modify package.json**:  
   Modify the scripts section of the **`Backend/package.json`** to set up the start command:
   ```json
   "scripts": {
     "start": "nodemon server.js"
   }
   ```

8. **Start the Backend**:  
   Run the backend server:
   ```bash
   npm start
   ```
   Access the backend endpoints directly.

9. **Set Up Frontend**:  
   At the project home directory, create a new Vite project for the frontend:
   ```bash
   npm create vite@latest frontend -- --template react
   ```

10. **Replace Frontend Code**:  
    Replace the **`App.jsx`** file under **`Frontend/src`** with the updated code from your repository.

11. **Run Frontend**:  
    Open a new terminal, navigate to the **`Frontend`** directory, and run the necessary commands to start the frontend application:
    ```bash
    npm install
    npm run dev
    ```
    You can now access the frontend at **`http://localhost:5173`**.


# Cloning the Repository and Running the Project

To clone the repository and get the project up and running, follow these steps:

1. **Clone the Repository**:  
   Open your terminal or command prompt and run the following command:
   ```bash
   git clone https://github.com/huharun/reactmysql.git
   ```

2. **Navigate to the Project Directory**:  
   Change to the project directory:
   ```bash
   cd reactmysql/exercise3/frontend
   ```

3. **Install Dependencies**:  
   Run the following command to install the required packages:
   ```bash
   npm install
   ```

4. **Run the Project**:  
   Start the project using:
   ```bash
   npm run dev
   ```
   If you encounter any errors, you can alternatively run:
   ```bash
   npx vite
   ```
   This will launch the application, and you can access it in your browser at **`http://localhost:5173`**.

5. **Access Backend**:  
   If applicable, navigate to the **`Backend`** directory and start the backend server:
   ```bash
   cd Backend
   npm start
   ```
   Access the backend endpoints directly.

6. **Modify Environment Variables** (if needed):  
   Ensure any necessary environment variables are set in your **`.env`** file.

7. **Enjoy the Application**:  
   Your application should now be up and running. Visit **`http://localhost:5173`** to use it!



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

---