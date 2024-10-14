// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

// Constants for API base URLs
const LOCAL_API_BASE_URL = 'http://localhost:5050';
const PUBLIC_API_BASE_URL = 'http://35.16.20.72:5050';

// Choose the API base URL based on the environment
const API_BASE_URL = window.location.hostname === 'localhost' ? LOCAL_API_BASE_URL : PUBLIC_API_BASE_URL;
// alert(window.location.hostname)

// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    fetch(API_BASE_URL+'/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

// Show alert function
function showAlert(message, type) {

    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const pageContent = document.getElementById('page-content'); // Get the page content

    alertMessage.textContent = message; // Set the message
    alertBox.classList.remove('hidden'); // Show the alert
    alertBox.classList.add('show'); // Trigger the show animation
    // pageContent.classList.add('blur'); // Add blur to the page content

    // Clear existing alert type classes
    alertBox.classList.remove('alert-success', 'alert-failure');
    // Set alert styles based on type (success or failure)

    
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



//listing all data in the table
function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
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
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
    });
    
    table.innerHTML = tableHtml;
}


// Function to hash the password
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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


    // // Add validation
    // if (!email || !password) {
    //     showAlert('Please fill in all required fields.', 'failure');
    //     return;
    // }

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
            // Optionally, redirect to another page or perform further actions
        } else {
            showAlert('Sign in failed: ' + result.error, 'failure');
        }
    } catch (error) {
        console.error('%cError during sign in:', 'color: red; font-weight: bold;', error);
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
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch(API_BASE_URL+'/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowById(event.target.dataset.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id); // display the edit row interface
        }
      }
);

function deleteRowById(id){
    // debug(id);
    fetch('http://localhost:5050/delete/' + id,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

let idToUpdate = 0;

function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = ""; // clear this field
    const updateSetction = document.querySelector("#update-row");  
    updateSetction.hidden = false;
    // we assign the id to the update button as its id attribute value
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate+"");
}


// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    id: idToUpdate,
                    name: updatedNameInput.value
                  }
            )
          }
    ) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else 
           debug("no update occurs");
    })
}


// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

function insertRowIntoTable(data){

   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

  // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){ // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){   // key is a direct property for data
            if(key === 'dateAdded'){  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
   tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        // debug(tableHtml);

        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}


// Get modal elements
const signUpModal = document.getElementById('sign-up-modal');
const signInModal = document.getElementById('sign-in-modal');
const closeSignUp = document.getElementById('close-sign-up');
const closeSignIn = document.getElementById('close-sign-in');
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');

// Open the sign-up modal
signUpBtn.onclick = function() {
    signUpModal.style.display = "flex"; // Change to flex to center modal
}

// Open the sign-in modal
signInBtn.onclick = function() {
    signInModal.style.display = "flex"; // Change to flex to center modal
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
}
