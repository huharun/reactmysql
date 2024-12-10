<!-- # Project 2 -->
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
- Implemented a dynamic dashboard for clients to manage their activities, with the following navigation:

  1. **Request a Quote**
     - View My Requests
     - Submit New Request
  2. **Orders**
     - View My Orders
     - Manage Order Negotiations
  3. **Billing**
     - View Bills
     - Dispute Bill
  4. **Account Management**
     - View Profile
     - View Payment History

### 5. Contractor Dashboard
- Implemented a dynamic dashboard for contractors to manage their requests, with the following navigation:

  1. **Quote Requests**
     - View Urgency Requests
     - View All Requests
  2. **Work Orders**
     - Manage Orders
     - View Active Orders
     - View Completed Orders
  3. **Billing**
     - View All Bills
     - Manage Disputes
  4. **Reports**
     - List of Big Clients
     - Difficult Clients
     - This Month Quotes
     - Prospective Quotes
     - Largest Driveway
     - Overdue Bills
     - Bad Clients
     - Good Clients


### 6. Reports for Contractors
- Implemented a comprehensive set of reports for contractors, with the following queries and explanations:

  1. **Big Clients**
     - Lists the clients that David Smith completed the most number of orders. 
     - If there is a tie, all the top clients are listed; if there is no tie, only the top client is displayed.
     - **Submission Requirement**: After performing the query, verify that the result is correct. Show the result and explain why it is accurate. Then, modify the database and explain the new result that appears after the change, including the reason behind the change.
  
  2. **Difficult Clients**
     - Lists clients who sent three different requests to David Smith but never followed up after the requests.
  
  3. **This Month Quotes**
     - Lists all the AGREED quotes for the current month (e.g., December 2024).
  
  4. **Prospective Clients**
     - Lists all clients who have registered but never submitted any request for quotes.
  
  5. **Largest Driveway**
     - Lists the locations of the driveways with the largest square footage that David Smith ever worked on.
     - If there is a tie, all locations are listed; if there is no tie, only the top location is displayed.
  
  6. **Overdue Bills**
     - Lists all bills that have not been paid one week after they are generated.
  
  7. **Bad Clients**
     - Lists clients who have never paid a bill after its due date (i.e., one week after the bill is generated).
     - A client is not considered "bad" if no bill has been generated for them.
  
  8. **Good Clients**
     - Lists clients who have paid their bills within 24 hours after the bills are generated.


---

## Additional Key Features

### 1. Autofetch Address Function
- Implemented an address fetching feature using the OpenStreetMap API, which allows users to automatically retrieve accurate addresses based on their input. The system provides autocomplete functionality to enhance user experience and ensure accuracy when entering addresses.
  - **Example Code:**
    ```javascript
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`)
    ```

### 2. Customized Alerts
- Developed a versatile `showAlert` function to handle various types of alert notifications across the application. This ensures that users receive clear, consistent feedback for both successful actions and error handling.

### 3. Pop-up Modals
- Integrated pop-up modals for specific tasks, offering a more interactive way to present crucial information, confirm actions, or provide options without navigating away from the current page. These modals improve user engagement by keeping the interface dynamic and efficient.

### 4. Chat Section
- Incorporated a dedicated chat section that facilitates real-time communication between contractors and clients. This feature enables users to negotiate prices, discuss project details, and resolve issues directly within the platform, enhancing collaboration and workflow.

### 5. Session Management
- Implemented session management using JSON Web Tokens (JWT) to store user authentication details temporarily. This functionality ensures that users remain logged in throughout their interaction with the application, streamlining the user experience and enhancing security.

### 6. PDF Export
- Integrated **jsPDF**, a library for generating PDF documents, to enable clients and contractors to export their bills, payment receipts, and other important documents in a downloadable and printable format. This feature ensures that users have easy access to essential records in a convenient format.

### 7. Image Upload
- Developed functionality for image uploads within the backend, providing users with the ability to submit visual content alongside their requests. Images are stored in a dedicated folder for easy management and retrieval, enabling clients to provide visual documentation for their project needs.


---

## SQL Statements

All SQL statements used in this project are documented in the file named **`sql_pr2_arun.txt`**.

---
