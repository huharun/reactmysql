Here's an improved version of your **Project 2** README file in markdown format, based on the details you provided:

```markdown
# Project 2

## Cloning the Repository and Running the Project

To clone the repository and get the project up and running, follow these steps:

1. **Clone the Repository**:  
   Open your terminal or command prompt and run the following command:
   ```bash
   git clone https://github.com/huharun/reactmysql.git
   ```

2. **Database and Setup Environment**:  
   1. Create a new Database named **`project2`**.
   2. Find the **`project2.sql`** file inside the folder and import it into your newly created Database.
   3. Ensure that the cloned folder is inside **`xampp/htdocs`**.

3. **Navigate to the Project Directory and Backend**:  
   Open terminal inside `htdocs` and navigate to the project directory:
   ```bash
   cd C:\xampp\htdocs\project2\Backend
   ```

4. **Run the Project**:  
   Start the backend server using:
   ```bash
   npm start
   ```

5. **Modify Environment Variables** (if needed):  
   Ensure any necessary environment variables are set in your **`.env`** file.

6. **Change URL in `index.js`** (if needed):  
   If you need to update the API URL in your frontend code, locate the `index.js` file within your Frontend directory and update the endpoint URLs to match your backend server.

7. **Enjoy the Application**:  
   Feel free to access some of the Backend endpoints directly, such as **`http://localhost:5050/getAll`** (you will receive JSON data without any rendering).

   Now, you can interact with the Frontend at **`http://localhost/reactmysql/project2/frontend/`** or by using your IP address. Make sure to set `PUBLIC_API_BASE_URL` to **your_ip_address**.

---

## Tasks Completed

### Installed Necessary Packages (if needed)
1. Installed Node.js and npm on the system.  
2. Installed the following packages for backend functionality:  
   ```bash
   npm install express mysql cors nodemon dotenv
   ```
3. Make sure the `scripts` section of **`Backend/package.json`** is as follows:
   ```bash
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
     "start": "nodemon app.js"
   }
   ```

---

## Setting Up the Environment

### Backend Folder Structure:
Create a folder for your backend with the following files:
- `app.js`: Contains the main server logic.
- `dbService.js`: Handles database interactions.

Your backend folder structure should look like this:
```bash
backend/
├── node_modules
├── uploads
├── .env
├── app.js
├── dbService.js
└── package.json
```

### Frontend Folder Structure:
Create a folder for your frontend with the following files:
- `index.html`: Main HTML file for the frontend.
- `index.js`: JavaScript logic for the frontend.
- `stylesheet.css`: Holds styles to make everything visually appealing.

Your frontend folder structure should look like this:
```bash
frontend/
├── index.html
├── index.js
└── stylesheet.css
```

---

## Project Implementation

### 1. User Registration
- Implemented a user registration feature that allows new users to sign up and securely stores their information in the `users` table.
- Three user types are supported: **admin**, **contractor**, and **client**.
- Users can sign up as a client or contractor and see a unique dashboard for their profile.

### 2. User Sign-In
- Developed user sign-in functionality that tracks user activities in the `user_login` table, including logging their IP address and whether their sign-in attempt was successful or failed.
- Users can sign in using their email and password.

### 3. Update and Delete
- Added the ability to update user details in the `users` table under account management.
- Clients can delete requested quotes.

### 4. Client Dashboard
- Implemented a dashboard for clients to manage their activities.

### 5. Contractor Dashboard
- Implemented a dashboard for contractors to view and manage their requests.

### 6. Reports for Contractors
- Developed functionality to provide reports, such as a list of users who registered today.

---

## Additional Key Features

### 1. Autofetch Address Function
- Integrated address fetching functionality using OpenStreetMap API:
  ```javascript
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`)
  ```

### 2. Session Management
- Developed session functionality using JWT authentication tokens to temporarily store user details, enhancing the user experience during interactions with the application.

### 3. PDF Export
- Integrated **jsPDF** for exporting bills and payment receipts as PDF files.

### 4. Image Upload
- Enabled image uploading functionality in the backend, with a dedicated folder for storing uploaded images.

---

## SQL Statements

All SQL statements used in this project are documented in the file named **`sql_pr2_arun.txt`**.

---
```

This version improves readability and organization, making it more structured and clear.