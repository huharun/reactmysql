# Project 1

# Cloning the Repository and Running the Project

To clone the repository and get the project up and running, follow these steps:

1. **Clone the Repository**:  
   Open your terminal or command prompt and run the following command:
   ```bash
   git clone https://github.com/huharun/dbms1_project1.git
   ```

2. **Database and Setup environment**:  
   1. Create new Database named **`project1`**.
   2. Find the **`project1.sql`** inside the folder and import in your created Database.
   3. Make sure the cloned folder inside **`xampp/htdocs`**.

3. **Navigate to the Project Directory and Backend**:  
   Open terminal inside htdocs and locate to the project directory:
   ```bash
   cd C:\xampp\htdocs\database_javascript\project1\Backend
   ```

4. **Run the Project**:  
   Start the project using:
   ```bash
   npm start
   ```

5. **Modify Environment Variables** (if needed):  
   Ensure any necessary environment variables are set in your **`.env`** file.

6. **Change URL in index.js:**(if needed)
If you need to update the API URL in your frontend code, locate the index.js file within your Frontend directory and update the endpoint URLs as necessary to match your backend server.

7. **Enjoy the Application**:  
   Feel free to access some of the Backend endpoints directly such as **`http://localhost:5050/getAll`**. You will only receive JSON data without nice rendering.

   Now you can interact with the Frontend http://localhost/reactmysql/project1/Frontend/index.html.


# **Tasks Completed**

### **Installed Necessary Packages** (if needed)
1. I began by installing Node.js and npm on my system. Then, I installed the following packages: **``npm install express mysql cors nodemon dotenv`**
2. Make sure the scripts section of the Backend/package.json as follows:

   ```bash
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
    }, 
   ```

### **Setting Up the Environment**

1. **Backend Folder**  
   First, create a folder for your backend. Inside this folder, you’ll need to have two important files:
   - `app.js`: This file contains your main server logic.
   - `dbService.js`: This file handles your database interactions.

   Your backend folder structure should look like this:
   ```bash  
   backend/
   ├── app.js
   └── dbService.js
   ```

2. **Frontend Folder**  
   Next, set up a folder for your frontend. In this folder, include the following files:
   - `index.html`: This is your main HTML file for the frontend.
   - `index.js`: This file contains your frontend JavaScript logic.
   - `stylesheet.css`: This file holds all your styles to make everything look nice.

   Your frontend folder structure should look like this:
   ```bash
   frontend/
   ├── index.html
   ├── index.js
   └── stylesheet.css
   ```


### **Project Implementation**

1. **User Registration**
   - I implemented a user registration feature that allows new users to sign up and securely stores their information in the `users` table.

2. **User Sign-In**
   - I developed a user sign-in functionality that tracks user activities in the `user_login` table. This includes logging their IP address and whether their sign-in attempt was successful or failed.

3. **Update and Delete**
   - I added the ability to update and delete user details in the `users` table, ensuring that changes are recorded with information on who made the edits.

4. **User Search**
   - I enabled the search functionality for users, allowing searches by first name and/or last name.
   - I also added the capability to search for users by their unique user ID.
   - Additionally, I implemented searches for users whose salary falls between specified amounts (X and Y) and those whose ages are within a certain range.
   - I created a feature to find users who registered after a specified user, like Arun.

5. **User Activity**
   - I introduced a way to identify users who have never signed in.
   - I also implemented a search for users who registered on the same day as Arun.

6. **Today's Registrations**
   - Finally, I developed functionality to return a list of users who registered today.


## **SQL Statements**
All SQL statements used in this exercise are documented in the file named **`sql_pr1_arun.txt`**.

---


