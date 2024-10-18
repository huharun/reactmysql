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
    const pageContent = document.getElementById('page-content'); // Get the page content
    
    alertMessage.textContent = message; // Set the message
    alertBox.classList.remove('hidden'); // Show the alert
    alertBox.classList.add('show'); // Trigger the show animation
    
    // Clear existing alert type classes
    alertBox.classList.remove('alert-success', 'alert-failure');
    
    
    if (type === 'success') {
        alertBox.classList.add('alert-success'); // Add success class
    } else if (type === 'failure') {
        alertBox.classList.add('alert-failure'); // Add failure class
    }
    
    // Automatically close the alert after 5 seconds
    setTimeout(() => {
        closeAlert();
    }, 3000);
}

function closeAlert() {
    const alertBox = document.getElementById('custom-alert');
    const pageContent = document.getElementById('page-content'); // Get the page content
    alertBox.classList.remove('show'); // Hide the alert
    alertBox.classList.add('hidden'); // Add hidden class
    pageContent.classList.remove('blur'); // Remove blur from the page content
    
    // Reset styles to default after closing
    alertBox.classList.remove('alert-success', 'alert-failure'); // Remove classes
}

// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    fetch(API_BASE_URL+'/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

//sign-out hidden
document.getElementById('sign-out-btn').style.display = 'none';

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
        password: hashedPassword, // Store the hashed password
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
        if (response.ok) {
            showAlert('Sign up successful!', 'success'); // Notify user of success
            // Optionally close the modal
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
    
    // // Email format validation
    // const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    // if (!email.match(emailPattern)) {
    //     showAlert('Please enter a valid email address.', 'failure');
    //     return;
    // }
    
    // Send login request to backend
    try {
        const response = await fetch(API_BASE_URL + '/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, hashedPassword }) // Send email and plain password
        });
        
        const result = await response.json();
        // alert(JSON.stringify(result, null, 2));
        
        if (response.ok) {
            showAlert('Sign in successful!', 'success'); // Notify user of success
            
            document.getElementById('sign-in-modal').style.display = 'none';
            document.getElementById('sign-up-btn').style.display = 'none';
            document.getElementById('sign-in-btn').style.display = 'none';
            document.getElementById('sign-out-btn').style.display = 'block';
            
            // Optionally, redirect to another page or perform further actions
        } else {
            showAlert('Sign in failed: ' + result.error, 'failure');
        }
    } catch (error) {
        console.error('%cError during sign in:', 'color: red; font-weight: bold;', error);
        showAlert("An error occurred during sign in. Please try again.", "failure");
        
    }
});

// // when the addBtn is clicked
// const addBtn = document.querySelector('#add-name-btn');
// addBtn.onclick = function (){
//     const nameInput = document.querySelector('#name-input');
//     const name = nameInput.value;
//     nameInput.value = "";

//     fetch('http://localhost:5050/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({name: name})
//     })
//     .then(response => response.json())
//     .then(data => insertRowIntoTable(data['data']));
// }

// when the searchBtn is clicked
// const searchBtn =  document.querySelector('#search-btn');
// searchBtn.onclick = function (){
//     const searchInput = document.querySelector('#search-input');
//     const searchValue = searchInput.value;
//     searchInput.value = "";

//     fetch(API_BASE_URL+'/search/' + searchValue)
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
// }

document.getElementById('dropdown').addEventListener('change', function() {
    const selectedValue = this.value; // Get the selected option value
    const inputField = document.getElementById('search-input'); // Get the input field
    inputField.removeAttribute('disabled'); 
    
    switch (selectedValue) {
        case 'all':
        inputField.setAttribute('disabled', 'true');
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
        inputField.placeholder = 'Search by Salary';
        break;
        case 'age':
        inputField.placeholder = 'Search by Age';
        break;
        default:
        inputField.placeholder = 'Select All';
    }
});


document.getElementById('search-input').addEventListener('input', async function () {
    const searchInput = this.value;
    const dropdown = document.getElementById('dropdown');
    const selectedOption = dropdown.value;
    
    const response = await fetch(API_BASE_URL+'/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchValue: searchInput, searchType: selectedOption }),
    });
    
    const results = await response.json();
    displayResults(results);
});


function displayResults(results) {
    if(results){
        loadHTMLTable(results);
    }
}




let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
    function(event){
        if(event.target.className === "delete-row-btn"){
            // alert(event.target.dataset.id);return
            
            const id = event.target.dataset.id
            deleteRowById(id);   
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
            
            
            showEditRowInterface(id, first_name, last_name, email, salary, age); // display the edit row interface
            
        }
    }
);

//not exactly deleting
function deleteRowById(id){
    debug(id);
    fetch(API_BASE_URL + '/delete/' + id, { 
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

function showEditRowInterface(id, first_name, last_name, email, salary, age) {
    
    debug("id clicked: ");
    debug(id);
    
    // Populate the input fields with the current row values
    document.querySelector('#update-id-input').value = id; // Set the ID (read-only)
    document.querySelector('#update-name-input').value = first_name + ' ' + last_name; // Set the name
    document.querySelector('#update-email-input').value = email; // Set the email
    document.querySelector('#update-salary-input').value = salary; // Set the salary
    document.querySelector('#update-age-input').value = age; // Set the age
    
    // Show the update modal
    const updateModal = document.querySelector('#update-row-modal');  
    updateModal.style.display = "flex"; // or updateModal.hidden = false; to show the modal
    
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
    
    fetch(API_BASE_URL + '/update', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: idToUpdate,
            name: updatedNameInput.value,
            email: updatedEmailInput.value,
            salary: updatedSalaryInput.value,
            age: updatedAgeInput.value
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


// function insertRowIntoTable(data){

//     debug("index.js: insertRowIntoTable called: ");
//     debug(data);

//     const table = document.querySelector('table tbody');
//     debug(table);

//     const isTableData = table.querySelector('.no-data');

//     // debug(isTableData);

//     let tableHtml = "<tr>";

//     for(var key in data){ // iterating over the each property key of an object data
//         if(data.hasOwnProperty(key)){   // key is a direct property for data
//             if(key === 'dateAdded'){  // the property is 'dataAdded'
//                 data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
//             }
//             tableHtml += `<td>${data[key]}</td>`;
//         }
//     }

//     tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
//     tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

//     tableHtml += "</tr>";

//     if(isTableData){
//         debug("case 1");
//         table.innerHTML = tableHtml;
//     }
//     else {
//         debug("case 2");
//         // debug(tableHtml);

//         const newrow = table.insertRow();
//         newrow.innerHTML = tableHtml;
//     }
// }



//for pop-ups
// Get modal elements
const signUpModal = document.getElementById('sign-up-modal');
const signInModal = document.getElementById('sign-in-modal');
const closeSignUp = document.getElementById('close-sign-up');
const closeSignIn = document.getElementById('close-sign-in');
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');
const updateModal = document.getElementById('update-row-modal');
const closeUpdateRow = document.getElementById('close-update-row');


//close for update
closeUpdateRow.onclick = function() {
    updateModal.style.display = "none"; 
}

// Open the sign-up modal
signUpBtn.onclick = function() {
    signUpModal.style.display = "flex"; 
}

// Open the sign-in modal
signInBtn.onclick = function() {
    signInModal.style.display = "flex"; 
}

// Close the sign-up modal
closeSignUp.onclick = function() {
    signUpModal.style.display = "none";
}

// Close the sign-in modal
closeSignIn.onclick = function() {
    signInModal.style.display = "none";
}

// Close modal when clicking outside of the modal content
window.onclick = function(event) {
    if (event.target === signUpModal) {
        signUpModal.style.display = "none";
    }
    if (event.target === signInModal) {
        signInModal.style.display = "none";
    }
    if (event.target === updateModal) {
        updateModal.style.display = "none";
    }
}
