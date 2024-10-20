// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

// Constants for API base URLs
const LOCAL_API_BASE_URL = 'http://localhost:5050';
// const PUBLIC_API_BASE_URL = 'http://141.217.210.187:5050';
const PUBLIC_API_BASE_URL = 'http://35.16.20.72:5050';

// Choose the API base URL based on the environment
const API_BASE_URL = window.location.hostname === 'localhost' ? LOCAL_API_BASE_URL : PUBLIC_API_BASE_URL;
// alert(window.location.hostname)

// Show alert function
function showAlert(message, type) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const pageContent = document.getElementById('page-content'); 
    
    alertMessage.textContent = message; 
    alertBox.classList.remove('hidden'); 
    alertBox.classList.add('show'); 
    
    // Clear existing alert type classes
    alertBox.classList.remove('alert-success', 'alert-failure');
    
    
    if (type === 'success') {
        alertBox.classList.add('alert-success'); 
    } else if (type === 'failure') {
        alertBox.classList.add('alert-failure');
    }
    
    // Automatically close the alert after 5 seconds
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

function closeAlert() {
    const alertBox = document.getElementById('custom-alert');
    const pageContent = document.getElementById('page-content'); 
    alertBox.classList.remove('show'); 
    alertBox.classList.add('hidden'); 
    
    // Reset styles to default after closing
    alertBox.classList.remove('alert-success', 'alert-failure');
}

//show password
document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordVisibility = (inputId, iconElement) => {
        const passwordInput = document.getElementById(inputId);
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        iconElement.textContent = passwordInput.type === 'text' ? '🙈' : '👁️';
    };
    
    // Event listeners for toggle icons
    ['toggle-signup-password', 'toggle-signin-password'].forEach(id => {
        document.getElementById(id).addEventListener('click', function () {
            togglePasswordVisibility(id === 'toggle-signup-password' ? 'signup-password' : 'signin-password', this);
        });
    });
});

//getAll
document.addEventListener('DOMContentLoaded', function() {
    fetch(API_BASE_URL + '/getAll', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => loadHTMLTable(data['data']))
    .catch(error => console.error('Failed to fetch data:', error));
});

//listing all data in the table
function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");
    
    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='11'>No Data</td></tr>";
        return;
    }
    
    let tableHtml = "";
    data.forEach(function ({id, first_name, last_name, email, user_id, salary, age, registration_date, last_sign_in, added_by, edited_by}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${first_name} ${last_name}</td>`;
        tableHtml += `<td>${email}</td>`;
        tableHtml += `<td>${salary}</td>`;
        tableHtml += `<td>${age}</td>`;
        tableHtml += `<td>${new Date(registration_date).toLocaleString()}</td>`;
        tableHtml += `<td>${new Date(last_sign_in).toLocaleString()}</td>`;
        tableHtml += `<td>${added_by}</td>`;
        tableHtml += `<td>${edited_by}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id} data-first_name=${first_name} data-last_name=${last_name} data-email=${email} data-salary=${salary} data-age=${age} >Edit</button></td>`;
        tableHtml += "</tr>";
    });
    
    table.innerHTML = tableHtml;
    
    // Initialize sorting
    initializeTableSorting('table');
}

// Function to initialize sorting for the table
function initializeTableSorting(tableId) {
    const table = document.getElementById(tableId);
    const headers = table.querySelectorAll('th');
    const tbody = table.tBodies[0];
    const sortStates = Array(headers.length).fill(true); // true for ascending
    
    headers.forEach((header, index) => {
        // Skip last two headers (Delete and Edit)
        if (index >= headers.length - 2) return;
        
        header.addEventListener('click', () => {
            const ascending = sortStates[index];
            const rows = Array.from(tbody.rows).sort((a, b) => {
                const aValue = isNaN(a.cells[index].innerText) ? a.cells[index].innerText : parseFloat(a.cells[index].innerText);
                const bValue = isNaN(b.cells[index].innerText) ? b.cells[index].innerText : parseFloat(b.cells[index].innerText);
                return ascending ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
            });
            rows.forEach(row => tbody.appendChild(row));
            sortStates[index] = !ascending;
            headers.forEach((hdr, i) => {
                const sortIcon = hdr.querySelector('.sort-icon');
                if (i < headers.length - 2 && sortIcon) { // Ensure it's not the last two headers
                    sortIcon.innerHTML = i === index ? (sortStates[index] ? '▲' : '▼') : '';
                }
            });
        });
    });
}

// // Function to hash the password
async function hashPassword(password) {
    const response = await fetch(API_BASE_URL + '/hashPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password }) 
    });
    
    const data = await response.json();
    return data.hashedPassword; 
}

// Sign-up action
document.getElementById('sign-up-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    
    // Collect data from form fields
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const salary = document.getElementById('salary').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;
    
    // Add validation
    if (!firstName || !lastName || !email || !password || !salary || !age || !dob) {
        showAlert('Please fill in all required fields.', 'failure');
        return;
    }
    
    // Email format validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        showAlert('Please enter a valid email address.', 'failure');
        return;
    }
    
    // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    if (!password.match(passwordPattern)) {
        showAlert('Password must be between 8 and 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters.', 'failure');
        return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password); 
    // alert(hashedPassword); return;
    
    // Create a user object
    const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        salary: salary,
        age: age,
        dob: dob
    };
    
    // Send user data to backend
    try {
        const response = await fetch(API_BASE_URL + '/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        // alert(JSON.stringify(result));return
        
        if (response.ok) {
            showAlert('Sign up successful!', 'success'); 
            document.getElementById('sign-up-modal').style.display = 'none';
        } else {
            showAlert('Sign up failed: ' + result.error, 'failure');
        }
    } catch (error) {
        console.error('Error during sign up:', error);
    }
});

// Sign-in action
document.getElementById('sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    
    // Collect data from form fields
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Add validation
    if (!email || !password) {
        showAlert('Please fill in all required fields.', 'failure');
        return;
    }
    
    // Send login request to backend
    try {
        const response = await fetch(API_BASE_URL + '/signin', {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, hashedPassword }) 
        });
        
        console.log('Response:', response);
        
        const result = await response.json();
        
        if (response.ok) {
            isSignedIn = true; // Set the sign-in status to true
            // showAlert('Sign in successful!', 'success'); // Notify user of success
            
            // Store user data in session storage
            sessionStorage.setItem('user', JSON.stringify(result.user)); // Save user data
            
            document.getElementById('sign-in-modal').style.display = 'none';
            document.getElementById('sign-up-btn').style.display = 'none';
            document.getElementById('sign-in-btn').style.display = 'none';
            document.getElementById('sign-out-btn').style.display = 'block';
            toggleSignInStatus(); // Update sign-in status UI
        } else {
            showAlert('Sign in failed: ' + result.error, 'failure');
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        showAlert("An error occurred during sign in. Please try again.", "failure");
    }
});

//sign-out action
document.getElementById('sign-out-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(API_BASE_URL + '/logout', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
        });
        
        // Debugging: Log the response to see what's being returned
        console.log('Logout response:', response);
        
        if (response.ok) {
            const result = await response.json(); // Parse the response data
            console.log(result); // Log the response data
            
            // Handle successful logout
            sessionStorage.removeItem('user'); 
            sessionStorage.removeItem('isLoggedIn'); 
            document.getElementById('sign-out-btn').style.display = 'none'; 
            document.getElementById('sign-up-btn').style.display = 'block'; 
            document.getElementById('sign-in-btn').style.display = 'block'; 
            showAlert(result.message, 'success'); 
        } else {
            // Handle HTTP error response
            const errorData = await response.json(); 
            console.error('Logout error:', errorData);
            showAlert('Logout failed. Please try again.', 'failure');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        showAlert("An error occurred during logout. Please try again.", "failure");
    }
});

//dropdown change
document.getElementById('dropdown').addEventListener('change', function() {
    const selectedValue = this.value; 
    const inputField = document.getElementById('search-input'); 
    const searchInput1 = document.getElementById("search-input1"); 
    
    // Reset fields initially
    inputField.removeAttribute('disabled'); 
    inputField.placeholder = ''; 
    inputField.type = 'text'; 
    searchInput1.hidden = true; 
    
    switch (selectedValue) {
        case 'all':
        inputField.setAttribute('disabled', 'true'); // Disable input for 'all'
        fetchUsers('all');
        break;
        case 'id':
        inputField.placeholder = 'Search by Id';
        break;
        case 'name':
        inputField.placeholder = 'Search by Name';
        break;
        case 'email':
        inputField.placeholder = 'Search by Email'; 
        break;
        case 'salary':
        inputField.placeholder = 'Min Salary'; // Placeholder for Min Salary
        inputField.type = 'number'; // Change type to number for Min Salary
        searchInput1.placeholder = 'Max Salary'; // Placeholder for Max Salary
        searchInput1.type = 'number'; // Change type to number for Max Salary
        searchInput1.hidden = false; // Show the Max Salary input
        break;
        case 'age':
        inputField.placeholder = 'Min Age';
        inputField.type = 'number';
        searchInput1.placeholder = 'Max Age';
        searchInput1.type = 'number';
        searchInput1.hidden = false;
        break;
        case 'after':
        inputField.placeholder = 'Search by After the Id'; 
        inputField.type = 'number';
        break;
        case 'never':
        inputField.placeholder = 'Users never Signed In'; 
        inputField.type = 'number'; 
        inputField.disabled = true;
        fetchUsers('never');
        break;
        case 'sameReg':
        inputField.placeholder = 'Users Registered on Same Day'; 
        inputField.type = 'number'; 
        break;
        case 'todayReg':
        inputField.placeholder = 'Users Registered on Today'; 
        inputField.type = 'number'; 
        inputField.disabled = true;
        fetchUsers('todayReg');
        break;
        
        default:
        inputField.placeholder = 'Select All';
    }
});

// Function to handle input changes for both salary fields
async function handleInput() {
    const searchInput = document.getElementById('search-input').value;
    const searchInput1 = document.getElementById('search-input1').value;
    const dropdown = document.getElementById('dropdown');
    const selectedOption = dropdown.value;
    
    let bodyData;
    if (selectedOption === 'salary') {
        let minSalary = searchInput.trim() === '' ? 0 : parseFloat(searchInput);
        let maxSalary = searchInput1.trim() === '' ? Infinity : parseFloat(searchInput1);
        
        if (isNaN(minSalary) || isNaN(maxSalary)) {
            showAlert('Please enter valid numeric values for both salaries.', 'failure');
            return;
        }
        
        if (minSalary >= maxSalary) {
            showAlert('Min Salary must be less than Max Salary.', 'failure');
            return;
        }
        
        bodyData = { minSalary, maxSalary, searchType: selectedOption };
    }
    else if (selectedOption === 'age') {
        let minAge = searchInput.trim() === '' ? 0 : parseInt(searchInput, 10);
        let maxAge = searchInput1.trim() === '' ? Infinity : parseInt(searchInput1, 10);
        
        if (isNaN(minAge) || isNaN(maxAge)) {
            showAlert('Please enter valid numeric values for both ages.', 'failure');
            return;
        }
        
        if (minAge >= maxAge) {
            showAlert('Min Age must be less than Max Age.', 'failure');
            return;
        }
        
        bodyData = { minAge, maxAge, searchType: selectedOption };
    }
    else {
        bodyData = { searchValue: searchInput, searchType: selectedOption };
    }
    
    const response = await fetch(API_BASE_URL + '/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
    });
    
    // Check if response is OK
    if (!response.ok) {
        const errorDetails = await response.json();
        showAlert(`Error: ${errorDetails.details}`, 'failure');
        return; 
    }
    
    const results = await response.json();
    displayResults(results);
}

// Function to handle fetching users based on selected option
async function fetchUsers(type, searchValue = null) {
    let bodyData = { searchType: type }; 
    
    if (searchValue) {
        bodyData.searchValue = searchValue;
    }
    
    const response = await fetch(API_BASE_URL + '/autocomplete', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData), 
    });
    
    if (!response.ok) {
        const errorDetails = await response.json();
        showAlert(`Error: ${errorDetails.details}`, 'failure');
        return;
    }
    
    const results = await response.json();
    displayResults(results);
}

// Add event listeners to both input fields
document.getElementById('search-input').addEventListener('input', handleInput);
document.getElementById('search-input1').addEventListener('input', handleInput);

function displayResults(results) {
    if(results){
        loadHTMLTable(results);
    }
}

let rowToDelete; 
// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
    function(event){
        const userData = sessionStorage.getItem('user');
        const sessionUserid = JSON.parse(userData);
        
        
        if(event.target.className === "delete-row-btn"){
            // alert(event.target.dataset.id);return
            
            const id = event.target.dataset.id
            deleteRowById(id,sessionUserid.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            // alert(JSON.stringify(event.target.dataset));return
            const id = event.target.dataset.id
            const first_name = event.target.dataset.first_name
            const last_name = event.target.dataset.last_name
            const email = event.target.dataset.email
            const salary = event.target.dataset.salary
            const age = event.target.dataset.age
            
            
            showEditRowInterface(id, first_name, last_name, email, salary, age); 
            
        }
    }
);

//not exactly deleting
function deleteRowById(id,sessionUserid){
    debug(id);
    fetch(API_BASE_URL + '/delete/' + id + '/' + sessionUserid, { 
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload the page upon successful deletion
            location.reload();
        } else {
            console.log("Error deleting row");
        }
    })
    .catch(error => console.log("Error: ", error));
}

let idToUpdate = 0;
// update pop up
function showEditRowInterface(id, first_name, last_name, email, salary, age) {
    
    debug("id clicked: ");
    debug(id);
    
    // Populate the input fields with the current row values
    document.querySelector('#update-id-input').value = id; 
    document.querySelector('#update-name-input').value = first_name + ' ' + last_name; 
    document.querySelector('#update-email-input').value = email; 
    document.querySelector('#update-salary-input').value = salary; 
    document.querySelector('#update-age-input').value = age; 
    
    // Show the update modal
    const updateModal = document.querySelector('#update-row-modal');  
    updateModal.style.display = "flex"; 
    
    // Assign the id to the update button (if needed)
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate + "");
}

// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function() {
    event.preventDefault(); //prevent from update
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');
    const updatedEmailInput = document.querySelector('#update-email-input');
    const updatedSalaryInput = document.querySelector('#update-salary-input');
    const updatedAgeInput = document.querySelector('#update-age-input');
    const userData = sessionStorage.getItem('user');
    const sessionUserid = JSON.parse(userData);
    
    
    // Check for empty fields (optional)
    if (!updatedNameInput.value || !updatedEmailInput.value || !updatedSalaryInput.value || !updatedAgeInput.value) {
        showAlert('All fields must be filled out.', 'failure');
        return;
    }
    // alert(updatedEmailInput.value);return;
    
    // Email format validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!updatedEmailInput.value.match(emailPattern)) {
        showAlert('Please enter a valid email address.', 'failure');
        return;
    }
    
    const nameParts = updatedNameInput.value.split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts[1] || ""; // Handle case if no last name is provided
    
    fetch(API_BASE_URL + '/update', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: idToUpdate,
            first_name: first_name,
            last_name: last_name,
            email: updatedEmailInput.value,
            salary: updatedSalaryInput.value,
            age: updatedAgeInput.value,
            sessionUserid: sessionUserid.id
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // alert(JSON.stringify(data));return;
            debug("Update successful!");
            location.reload();
        } else {
            showAlert("Update failed: " + JSON.stringify(data), 'failure');
            debug("no update occurs");
            
        }
    })
    .catch(error => {
        console.error("Error during fetch:", error);
    });
}

// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch(API_BASE_URL + '/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

// Get modal elements
const signUpModal = document.getElementById('sign-up-modal');
const signInModal = document.getElementById('sign-in-modal');
const closeSignUp = document.getElementById('close-sign-up');
const closeSignIn = document.getElementById('close-sign-in');
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const updateModal = document.getElementById('update-row-modal');
const closeUpdateRow = document.getElementById('close-update-row');

// Elements for sign-in status
const signedInSection = document.getElementById('signed-in-section');
const guestSection = document.getElementById('guest-section');

// Track sign-in status
let isSignedIn = false;

// Function to close modals
const closeModal = (modal) => {
    modal.style.display = "none";
};

// Event listeners for modal buttons
closeUpdateRow.addEventListener('click', () => closeModal(updateModal));
signUpBtn.addEventListener('click', () => signUpModal.style.display = "flex");
signInBtn.addEventListener('click', () => signInModal.style.display = "flex");
closeSignUp.addEventListener('click', () => closeModal(signUpModal));
closeSignIn.addEventListener('click', () => closeModal(signInModal));

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === signUpModal) closeModal(signUpModal);
    if (event.target === signInModal) closeModal(signInModal);
    if (event.target === updateModal) closeModal(updateModal);
});

// Function to toggle sign-in status
const toggleSignInStatus = () => {
    const welcomeMessage = document.getElementById('welcome-message');
    signInBtn.style.display = isSignedIn ? 'none' : 'inline';
    signOutBtn.style.display = isSignedIn ? 'inline' : 'none';
    signedInSection.classList.toggle('disabled', !isSignedIn);
    guestSection.style.display = isSignedIn ? 'none' : 'block';
    welcomeMessage.hidden = !isSignedIn;
    
    if (isSignedIn) {
        setTimeout(() => {
            welcomeMessage.hidden = true; // Hide the welcome message after 5 seconds
        }, 5000);
    }
};

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    isSignedIn = !!localStorage.getItem('isLoggedIn'); // Check login status using localStorage
    toggleSignInStatus(); // Update the UI based on sign-in status
});

// Example when the user logs in successfully:
const handleLogin = () => {
    // Assuming the login is successful, set the isLoggedIn flag
    localStorage.setItem('isLoggedIn', 'true'); // Store login status
    isSignedIn = true; // Update the sign-in status
    toggleSignInStatus(); // Update UI
};

