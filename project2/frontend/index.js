// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button


// Constants for API base URLs
const LOCAL_API_BASE_URL = 'http://localhost:5050';
// const PUBLIC_API_BASE_URL = 'http://141.217.210.187:5050';
const PUBLIC_API_BASE_URL = 'http://35.16.1.228:5050';

// Choose the API base URL based on the environment
const API_BASE_URL = window.location.hostname === 'localhost' ? LOCAL_API_BASE_URL : PUBLIC_API_BASE_URL;
// alert(window.location.hostname)

// load check session
document.addEventListener('DOMContentLoaded', async () => {
    const guestSection = document.getElementById('guest-section');
    const welcomeMessage = document.getElementById('welcome-message');
    
    try {
        const token = localStorage.getItem('authToken');
        
        // If there's no token, show the guest message and don't attempt to authenticate
        if (!token) {
            guestSection.innerHTML = '<h3>Please Sign In</h3><p>You need to sign in to access this section. Log in to continue.</p>';
            localStorage.setItem('isLoggedIn', 'false');
            return;
        }
        
        // If there is a token, attempt to authenticate
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(API_BASE_URL + '/authenticateJWT', {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });
        
        //handle response
        if (!response.ok) {
            if (response.status === 401) { // Check if the token is expired
                showAlert('Your session has expired. Please log in again.', 'failure');
                localStorage.removeItem('authToken'); // Clear the expired token
                localStorage.setItem('isLoggedIn', 'false');
                guestSection.innerHTML = '<h3>Please Sign In</h3><p>You need to sign in to access this section. Log in to continue.</p>';
                return;
            } else {
                throw new Error('Failed to check session');
            }
        }
        
        const data = await response.json();
        
        if (data.loggedIn) {
            const user = data.user;
            welcomeMessage.innerHTML = `<h3>Welcome, ${user.firstName}</h3><p>You're logged in and ready to go. Explore all the features available to you!</p>`;
            localStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('user', JSON.stringify(user));
            toggleSignInStatus(true);
        } else {
            guestSection.innerHTML = '<h3>Please Sign In</h3><p>You need to sign in to access this section. Log in to continue.</p>';
            localStorage.setItem('isLoggedIn', 'false');
        }
    } catch (error) {
        console.error('Error:', error);
        guestSection.innerHTML = '<h1>Error checking session</h1>';
    }
});


// Function to fetch address on page load
function initAutocomplete() {
    const addressInput = document.getElementById("address");
    const suggestionsContainer = document.getElementById("address-suggestions");
    
    addressInput.addEventListener("input", function () {
        const query = addressInput.value;
        
        if (query.length < 3) {
            suggestionsContainer.innerHTML = ''; // Clear suggestions if the query is too short
            return;
        }
        
        suggestionsContainer.innerHTML = '<div>Loading...</div>';
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`)
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = '';
            data.forEach(item => {
                const suggestion = document.createElement("div");
                suggestion.textContent = item.display_name;
                suggestion.style.fontSize = '12px'; 
                suggestion.style.cursor = 'pointer';
                suggestion.style.padding = '4px';
                suggestion.style.borderBottom = '1px solid #ddd';
                
                suggestion.addEventListener("click", () => {
                    addressInput.value = item.display_name;
                    suggestionsContainer.innerHTML = '';
                });
                
                suggestionsContainer.appendChild(suggestion);
            });
            
            if (data.length === 0) {
                suggestionsContainer.innerHTML = '<div>No suggestions found</div>';
            }
        })
        .catch(() => {
            suggestionsContainer.innerHTML = '<div>Error fetching suggestions</div>';
        });
    });
}

window.onload = initAutocomplete;


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



// Function to render the correct menu based on user type
function renderMenu() {
    const contractorMenu = `
        <h2 class="section-title">Contractor Dashboard</h2>
        <nav class="menu">
            <ul>
                <li><a href="#" onclick="toggleSubMenu(event, 'quote-requests')">Quote Requests</a>
                    <ul class="submenu" id="quote-requests">
                        <li><a href="#" onclick="viewNewRequests(1)">View Urgency Requests</a></li>
                        <li><a href="#" id="viewUrgencyRequestsLink" onclick="viewNewRequests(2)">View All Requests</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'work-orders')">Work Orders</a>
                    <ul class="submenu" id="work-orders">
                        <li><a href="#" onclick="manageOrders()">Manage Orders</a></li>
                        <li><a href="#" onclick="viewActiveOrders(1)">View Active Orders</a></li>
                        <li><a href="#" onclick="viewActiveOrders(2)">View Completed Orders</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'billing')">Billing</a>
                    <ul class="submenu" id="billing">
                        <li><a href="#" onclick="viewAllBills()">View All Bills</a></li>
                        <li><a href="#" onclick="manageDisputes()">Manage Disputes</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'reports')">Reports</a>
                    <ul class="submenu" id="reports">
                        <li><a href="#" onclick="viewRevenueReport()">Revenue Report</a></li>
                        <li><a href="#" onclick="viewBigClients()">List of Big Clients</a></li>
                        <li><a href="#" onclick="viewOverdueBills()">Overdue Bills</a></li>
                        <li><a href="#" onclick="viewClientRatings()">Good and Bad Clients</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    `;
    
    const clientMenu = `
        <h2 class="section-title">Client Dashboard</h2>
        <nav class="menu">
            <ul>
                <li><a href="#" onclick="toggleSubMenu(event, 'request-quote')">Request a Quote</a>
                    <ul class="submenu" id="request-quote">
                        <li><a href="#" onclick="viewMyRequests()">View My Requests</a></li>
                        <li><a href="#" onclick="submitNewRequest()">Submit New Request</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'orders')">Orders</a>
                    <ul class="submenu" id="orders">
                        <li><a href="#" onclick="viewMyOrders()">View My Orders</a></li>
                        <li><a href="#" onclick="manageNegotiations()">Manage Order Negotiations</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'billing')">Billing</a>
                    <ul class="submenu" id="billing">
                        <li><a href="#" onclick="viewAllBills()">View Bills</a></li>
                        <li><a href="#" onclick="disputeBill()">Dispute Bill</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="toggleSubMenu(event, 'account-management')">Account Management</a>
                    <ul class="submenu" id="account-management">
                        <li><a href="#" onclick="viewProfile()">View Profile</a></li>
                        <li><a href="#" onclick="viewPaymentHistory()">View Payment History</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    `;
    
    const menuContainer = document.getElementById("menu-container");
    const formContainer = document.getElementById('formContainer');
    
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // If not logged in, display a message or hide the menu
    if (isLoggedIn !== 'true') {
        formContainer.innerHTML = `<div style="text-align: center;">
        <video width="100%" height="auto" controls autoplay muted loop>
        <source src="gwen.mp4" type="video/mp4">
        <source src="gwen.webm" type="video/webm">
        <source src="gwen.ogg" type="video/ogg">
        Your browser does not support the video tag.
        </video>
        </div>`;
        
    } else {
        // User is logged in, proceed with fetching user data
        const userData = JSON.parse(sessionStorage.getItem('user'));
        
        // If userData exists, proceed
        if (userData) {
            const userType = userData.user_type; 
            
            console.log("User Type:", userType); 
            
            // Render the menu based on user type
            if (userType === 2) {
                menuContainer.innerHTML = contractorMenu;  // Display contractor menu
                
                // Simulate click on the default "View Urgency Requests" link
                const urgencyRequestLink = document.getElementById('viewUrgencyRequestsLink');
                if (urgencyRequestLink) {
                    urgencyRequestLink.click();  // Simulate click
                }
            } else if (userType === 3) {
                menuContainer.innerHTML = clientMenu;  // Display client menu
                
                // Open the "Request a Quote" submenu by default
                const requestQuoteSubMenu = document.getElementById('request-quote');
                if (requestQuoteSubMenu) {
                    requestQuoteSubMenu.style.display = 'block';  // Ensure the submenu is displayed
                }
                
                // Open the "View My Requests" by default (similar to clicking on it)
                const viewMyRequestsLink = requestQuoteSubMenu.querySelector('a');
                if (viewMyRequestsLink) {
                    // Trigger the function for "View My Requests" on page load
                    viewMyRequestsLink.click();
                }
            } else {
                menuContainer.innerHTML = "<div><h1 style='text-align:center'>Not a valid user</h1></div>";
            }
        } else {
            // If userData is not available, prompt to log in
            menuContainer.innerHTML = "<div><h1 style='text-align:center'>Please log in to view this content.</h1></div>";
        }
    }
    
}

// Function to toggle the visibility of submenu when clicking on a parent link
function toggleSubMenu(event, submenuId) {
    event.preventDefault();  // Prevent the default link action
    
    const submenu = document.getElementById(submenuId);
    const allSubmenus = document.querySelectorAll('.submenu');
    
    // Close all submenus
    allSubmenus.forEach(sub => {
        if (sub !== submenu) {
            sub.classList.remove('active');  // Remove active class to hide it
        }
    });
    
    // Toggle the clicked submenu
    submenu.classList.toggle('active');  // Toggle the 'active' class to show or hide it
}

// Define functions for each action triggered by the menu links
// contractor
function viewNewRequests(type) {
    console.log("Viewing Quote Requests...");
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const userId = userData.userId;
    
    fetch(API_BASE_URL + '/new_requests/'+ type, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('table');
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('table').style.display = 'block';
        
        if (data && data.length > 0) {
            let tableHTML = `
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Client Name</th>
                        <th>Service</th>
                        <th>Urgency</th>
                        <th>Status</th>
                        <th>Owned by</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
            `;
            
            data.forEach(request => {
                tableHTML += `
                    <tr>
                        <td>${request.request_id}</td>
                        <td>${request.client_name || 'N/A'}</td>
                        <td>${request.service_name || 'N/A'}</td>
                        <td>${request.urgency || 'N/A'}</td>
                        <td>${request.status || 'N/A'}</td>
                        <td>${request.owner_name || 'No Owner'}</td>
                        <td>
                ${!request.owner_name ? 
                `<button onclick="handleRequestAction(${request.request_id}, 1)" title="Take ownership of this request">
            <i class="fas fa-user-plus"></i> Take Ownership
                </button>` : 
                (request.owned_by === userId ? 
                    `<button onclick="handleRequestAction(${request.request_id}, 2)" title="Remove ownership of this request">
                <i class="fas fa-user-minus"></i> Remove Ownership
                    </button>` : 
                    `<span title="This request is already taken">Already Taken</span>`)}
                    </td>
                    </tr>
                `;
                });
                
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No new requests found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching new requests:', error);
            showAlert('Error', 'There was an error fetching new requests. Please try again later.', 'failure');
        });
    }
    
    function handleRequestAction(requestId, action_type) {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData.userId;
        
        if (!userId) {
            showAlert('Authentication Error', 'User not authenticated. Please log in again.', 'failure');
            return;
        }
        
        fetch(API_BASE_URL + '/take_ownership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({ requestId, userId, action_type })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to take ownership');
            return response.json();
        })
        .then(result => {
            showAlert(`Success, ${result.message}`, 'success');
            viewNewRequests(); // Refresh the table to show the updated ownership
        })
        .catch(error => {
            console.error('Error taking action:', error);
            showAlert('Error', 'Failed to take action. Please try again later.', 'failure');
        });
    }
    
    function manageOrders() {
        console.log("Managing Work Orders...");
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData.userId;
        
        fetch(API_BASE_URL + '/manage_orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            },
            body: JSON.stringify({ userId }) // Sending userId in the body of the request
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('table').style.display = 'block';
            
            if (data && data.length > 0) {
                let tableHTML = `
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Request ID</th>
                        <th>Accepted Date</th>
                        <th>Status</th>
                        <th>Quote Note</th>
                        <th>Counter Price</th>
                        <th>Time Window</th>
                        <th>quote</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
            `;
                
                data.forEach(order => {
                    // Formatting the time window as 'Start - End'
                    const timeWindow = `${new Date(order.time_window_start).toISOString().split('T')[0]} - ${new Date(order.time_window_end).toISOString().split('T')[0]}`;
                    
                    tableHTML += `<tr>
                              <td>${order.order_id}</td>
                              <td>${order.request_id}</td>
                              <td>${new Date(order.accepted_date).toLocaleDateString()}</td>
                              <td>${order.status}</td>
                              <td>${order.response_note || 'N/A'}</td>
                              <td>${order.counter_price ? `$${order.counter_price.toFixed(2)}` : "N/A"}</td>
                              <td>${timeWindow}</td>
                              <td>
                                  <button class="icon-btn" onclick="manageQuote(
                                      ${order.request_id}, 
                                      '${order.response_note || ''}', 
                                      '${order.counter_price || ''}', 
                                      '${order.time_window_start || ''}', 
                                      '${order.time_window_end || ''}')"
                                      title="Manage Quote">
                                      <i class="fas fa-quote-left"></i> Quote
                                  </button>
                              </td>
                              <td>
                                  <button class="icon-btn" onclick="openChatPopup(
                                      ${order.order_id}, 
                                      ${order.client_id}, 
                                      ${order.owned_by}, 
                                      '${order.client_name}')"
                                      title="Chat with ${order.client_name}">
                                      <i class="fas fa-comments"></i> Chat with ${order.client_name}
                                  </button>
                                  <button class="icon-btn" onclick="generateBill(
                                      ${order.order_id}, 
                                      ${order.request_id}, 
                                      ${order.amount}, 
                                      ${order.discount}, 
                                      '${order.generated_date}', 
                                      '${order.due_date}', 
                                      '${order.bill_status}', 
                                      '${order.counter_price || ''}')" 
                                      title="Generate Bill">
                                    <i class="fas fa-file-invoice-dollar"></i> Generate Bill
                                    </button>
                                </td>
                            </tr>`;
                    
                });
                
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No orders found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            showAlert('Error', 'There was an error fetching orders. Please try again later.', 'failure');
        });
    }
    
    // Function to open the chat modal
    function openChatPopup(orderId, receiverId, senderId, receivername) {
        // Show the chat modal
        chatModal.style.display = 'flex';
        
        // Fetch chat history from the server
        fetch(API_BASE_URL + '/get_chat?orderId=' + orderId)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const chatMessages = document.getElementById('chat-messages');
                const receiverName = document.getElementById('chat-receiver-name');
                receiverName.textContent = receivername; // Set receiver's name
                chatMessages.innerHTML = ''; // Clear existing messages
                
                // Append all messages to the chat window
                data.messages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = `${message.sender_name}: ${message.message}`;
                    chatMessages.appendChild(messageElement);
                });
            } else {
                showAlert('Failed to load chat history.', 'failure');
            }
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
            showAlert('Error fetching chat history. Please try again later.', 'failure');
        });
        
        // Handle chat form submission
        document.getElementById('chat-form').onsubmit = function (e) {
            e.preventDefault();
            
            const chatMessage = document.getElementById('chat-input').value;
            
            // Send chat message to the server
            fetch(API_BASE_URL + '/send_chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    orderId: orderId,
                    senderId: senderId,  // or contractorId based on who is sending
                    receiverId: receiverId, // or clientId based on who is receiving
                    message: chatMessage
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Append new chat message to the chat window
                    const chatMessages = document.getElementById('chat-messages');
                    const messageElement = document.createElement('div');
                    messageElement.textContent = `${senderId}: ${chatMessage}`;
                    chatMessages.appendChild(messageElement);
                    openChatPopup(orderId, receiverId, senderId, receivername)
                    
                    // Clear the chat input
                    document.getElementById('chat-input').value = '';
                } else {
                    showAlert('Failed to send message.', 'failure');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                showAlert('Error sending message. Please try again later.', 'failure');
            });
        };
    }
    
    
    
    
    
    
    
    function manageQuote(requestId, quoteNote, counterPrice, timeWindowStart, timeWindowEnd) {
        // Show the Manage Quote modal
        manageQuoteModal.style.display = 'flex';
        
        // Set the Request ID in the modal title
        document.getElementById('request-id-span').textContent = requestId;
        
        // Populate the modal fields with the passed data
        document.getElementById('quote-note-input').value = quoteNote || '';
        document.getElementById('counter-price-input').value = counterPrice || '';
        
        // Convert timeWindowStart and timeWindowEnd to `YYYY-MM-DD` format
        const startDate = timeWindowStart ? new Date(timeWindowStart).toISOString().split('T')[0] : '';
        const endDate = timeWindowEnd ? new Date(timeWindowEnd).toISOString().split('T')[0] : '';
        
        // Populate date inputs
        document.getElementById('time-window-start-input').value = startDate;
        document.getElementById('time-window-end-input').value = endDate;
        
        // Handle form submission as before
        document.getElementById('manage-quote-form').onsubmit = function (e) {
            e.preventDefault();
            
            const updatedQuoteNote = document.getElementById('quote-note-input').value;
            const updatedCounterPrice = document.getElementById('counter-price-input').value;
            const updatedTimeWindowStart = document.getElementById('time-window-start-input').value;
            const updatedTimeWindowEnd = document.getElementById('time-window-end-input').value;
            
            // Submit updated data to the server
            fetch(API_BASE_URL + '/manage_quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    requestId: requestId,
                    quoteNote: updatedQuoteNote,
                    counterPrice: updatedCounterPrice,
                    timeWindowStart: updatedTimeWindowStart,
                    timeWindowEnd: updatedTimeWindowEnd,
                    status: 'Accepted'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Quote updated successfully!');
                    closeModal(manageQuoteModal);
                    manageOrders();
                } else {
                    alert('Failed to update quote.');
                }
            })
            .catch(error => {
                console.error('Error submitting quote:', error);
                alert('Error submitting quote. Please try again later.');
            });
        };
    }
    
    
    
    function viewActiveOrders(orderType) {
        console.log(`Viewing ${orderType === 1 ? 'Active' : 'Completed'} Orders...`);
        
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
        
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
        
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
        
        // Determine the URL based on order type
        const orderStatus = orderType === 1 ? 'In Progress' : 'Completed';
        
        fetch(API_BASE_URL + '/viewActiveorders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, orderStatus }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>${orderStatus === 'In Progress' ? 'Active' : 'Completed'} Orders</h2>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Request No</th>
                        <th>Service</th>
                        <th>Proposed Price</th>
                        <th>Counter Price</th>
                        <th>Accepted Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            `;
                data.forEach(order => {
                    tableHTML += `
                    <tr>
                        <td>${order.order_id || 'N/A'}</td>
                        <td>${order.request_id || 'N/A'}</td>
                        <td>${order.service_name || 'N/A'}</td>
                        <td>${order.proposed_price ? `$${order.proposed_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${order.counter_price ? `$${order.counter_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${order.accepted_date ? new Date(order.accepted_date).toLocaleDateString() : 'N/A'}</td>
                        <td>${order.status || 'N/A'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No orders found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            showAlert('There was an error fetching orders. Please try again later.', 'failure');
        });
    }
    
    
    
    
    function generateBill(orderId, requestId, amount, discount, generated_date, due_date, status, counterPrice) {
        // Show the Generate Bill modal
        const generateBillModal = document.getElementById('generate-bill-modal');
        generateBillModal.style.display = 'flex';
        
        // Set the Order ID in the modal title
        document.getElementById('bill-order-id-span').textContent = orderId;
        
        // Populate the modal fields with the passed data
        document.getElementById('amount-input').value = counterPrice || '';  // Using counterPrice as default amount
        document.getElementById('discount-input').value = discount || '';  // Default discount passed as argument
        
        // Check if due_date is valid
        if (due_date && !isNaN(new Date(due_date).getTime())) {
            // Format due_date to "YYYY-MM-DD" if it's a valid date string
            const formattedDate = new Date(due_date).toISOString().split('T')[0]; // Convert to "YYYY-MM-DD"
            document.getElementById('due-date-input').value = formattedDate;  // Set formatted date
        } else {
            document.getElementById('due-date-input').value = '';  // Empty if not provided or invalid
        }
        
        // Ensure the status is set properly
        const statusSelect = document.getElementById('status-select');
        if (status) {
            statusSelect.value = status; // If status exists, set it
        } else {
            statusSelect.value = 'Pending';  // Default to 'Pending' if no status is provided
        }
        
        // Handle form submission
        document.getElementById('generate-bill-form').onsubmit = function (e) {
            e.preventDefault();
            
            // Get the updated values from the modal form
            const updatedAmount = parseFloat(document.getElementById('amount-input').value);
            const updatedDiscount = parseFloat(document.getElementById('discount-input').value);
            const updatedDueDate = document.getElementById('due-date-input').value;
            const updatedStatus = document.getElementById('status-select').value;
            
            // Validate the amount and discount
            if (isNaN(updatedAmount) || isNaN(updatedDiscount)) {
                alert('Please enter valid amount and discount values.');
                return;
            }
            
            // Calculate the final amount after applying the discount
            const finalAmount = updatedAmount - updatedDiscount;
            
            // Send the data to the server
            fetch(API_BASE_URL + '/generateBill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')  // Assuming token-based authentication
                },
                body: JSON.stringify({
                    orderId: orderId,
                    requestId: requestId,
                    amount: finalAmount,  // Send the final amount after discount
                    discount: updatedDiscount,
                    dueDate: updatedDueDate,
                    status: updatedStatus
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Bill generated successfully!');
                    closeModal(generateBillModal);
                    manageOrders();  // Adjust if needed
                } else {
                    alert('Failed to generate bill.');
                }
            })
            .catch(error => {
                console.error('Error generating bill:', error);
                alert('Error generating bill. Please try again later.');
            });
        };
    }
    
    
    function viewAllBills(ifdispute) {
        console.log('View All Bills clicked');
        // Fetch user information
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
        const userType = userData?.user_type;
        
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('table').style.display = 'block';
        
        if (!userId) {
            showAlert('User is not authenticated.', 'failure');
            return;
        }
        
        // API call to fetch all bills
        fetch(API_BASE_URL + '/viewAllBills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, userType }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bills');
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                // Render bills table
                let billsHTML = `
                    <h3>Bills</h3>
                    <table>
                        <tr>
                            <th>Bill ID</th>
                            <th>Initial Amount</th>
                            <th>Discount</th>
                            <th>Final Amount</th>
                            <th>Generated Date</th>
                            <th>Due Date</th>
                            <th>Bill Status</th>
                            <th>Order Status</th>
                `;
                
                // Add "Pay Bill" column only if userType is 3
                if (userType === 3 && ifdispute !== 'dispute') {
                    billsHTML += `<th>Pay Bill</th>`;
                }
                if (ifdispute === 'dispute') {
                    billsHTML += `<th>Dispute Bill</th>`;
                }
                
                billsHTML += `</tr>`;
                
                // Loop through bills and build table rows
                data.forEach(bill => {
                    const generatedDate = bill.generated_date ? new Date(bill.generated_date).toLocaleDateString() : 'N/A';
                    const dueDate = bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A';
                    const billStatus = bill.bill_status ?? 'Unknown';
                    const orderStatus = bill.order_status ?? 'Unknown';
                    const propertyAddress = bill.property_address ?? 'N/A';
                    
                    billsHTML += `
                        <tr>
                            <td>${bill.bill_id}</td>
                            <td>$${bill.counter_price.toFixed(2)}</td>
                            <td>$${bill.discount.toFixed(2)}</td>
                            <td>$${bill.amount.toFixed(2)}</td>
                            <td>${generatedDate}</td>
                            <td>${dueDate}</td>
                            <td>${billStatus}</td>
                            <td>${orderStatus}</td>
                    `;
                    
                    // Check if the bill is paid or not
                    if (userType === 3 && ifdispute !== 'dispute') {
                        if (billStatus === 'Paid') {
                            // Show a "Paid" icon if the bill is paid
                            billsHTML += `
                            <td>
                                <i class="fas fa-check-circle" style="color: green;" title="Paid"></i> Paid
                                <button class="icon-btn" onclick="exportBillToPDF(
                                ${bill.bill_id}, 
                                ${bill.order_id}, 
                                ${bill.amount}, 
                                ${bill.proposed_price}, 
                                ${bill.discount}, 
                                '${bill.generated_date}', 
                                '${bill.due_date}', 
                                '${billStatus}', 
                                '${bill.client_name}', 
                                '${bill.service_name}', 
                                '${bill.email}'
                                )" title="Export to PDF">
                                <i class="fas fa-file-pdf" style="color: red; font-size: 16px;"></i> 
                                </button>
                            </td>`;
                        } else {
                            // Show "Pay Bill" button if the bill is not paid
                            billsHTML += `
                            <td>
                                <button class="icon-btn" onclick="payBill(
                                ${bill.bill_id}, 
                                ${bill.order_id}, 
                                ${bill.amount}, 
                                ${bill.discount}, 
                                '${bill.generated_date}', 
                                '${bill.due_date}', 
                                '${billStatus}'
                                )" title="Pay Bill">
                                <i class="fas fa-file-invoice-dollar"></i> Pay Bill
                                </button>
                            </td>`;
                        }
                    }
                    
                    // Show "Dispute Bill" button if needed
                    if (ifdispute === 'dispute') {
                        if (billStatus === 'Disputed') {
                            billsHTML += `
                            <td>
                                <i class="fas fa-exclamation-triangle" style="color: red;" title="${bill.dispute_reason}"></i> Disputed 
                                <span style="font-size: 12px; margin-left: 5px; color: red;">(you:${bill.dispute_reason})</span>
                                <span style="font-size: 12px; margin-left: 5px; color: green;">(cont:${bill.dispute_resolve})</span>
                            </td>`;
                        } else if (billStatus === 'Resolved') {
                            billsHTML += `
                            <td>
                                <i class="fas fa-thumbs-up" style="color: green;" title="${bill.dispute_resolve}"></i> Resolved
                                <span style="font-size: 12px; margin-left: 5px; color: red;">(you:${bill.dispute_reason})</span>
                                <span style="font-size: 12px; margin-left: 5px; color: green;">(cont:${bill.dispute_resolve})</span>
                            </td>`;
                        } else {
                            billsHTML += `
                            <td>
                                <button class="icon-btn" onclick="disputeThebill(
                                ${bill.bill_id}, 
                                ${bill.order_id},
                                '${bill.dispute_reason}'
                                )" title="Dispute Bill">
                                <i class="fas fa-exclamation-triangle"></i> Dispute Bill
                                </button>
                            </td>`;
                        }
                    }
                    
                    billsHTML += '</tr>';
                });
                
                billsHTML += '</table>';
                document.getElementById('table').innerHTML = billsHTML;
            } else {
                showAlert('No bills found.', 'failure');
            }
        })
        .catch(error => {
            console.error('Error fetching bills:', error);
            showAlert('There was an error fetching bills. Please try again later.', 'failure');
        });
    }
    
    
    
    
    
    // Manage Disputes Logic
    function manageDisputes() {
        console.log('Manage Disputes clicked');
        
        // Fetch user data
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
        const userType = userData?.user_type;
        
        if (!userId) {
            showAlert('User is not authenticated.', 'failure');
            return;
        }
        
        // Example API call to fetch disputes
        fetch(API_BASE_URL + '/viewAllBills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, userType })
        })
        .then(response => response.json())
        .then(data => {
            // Check if data is available
            if (data && data.length > 0) {
                // Start building the table HTML
                let tableHTML = '<tr><th>Bill ID</th><th>Order ID</th><th>Amount</th><th>Due Date</th><th>Dispute Reason</th><th>Status</th><th>Action</th></tr>';
                
                // Loop through disputes and create rows
                data.forEach(dispute => {
                    if (dispute.bill_status === 'Disputed') {
                        tableHTML += `
                            <tr>
                                <td>${dispute.bill_id}</td>
                                <td>${dispute.order_id}</td>
                                <td>$${dispute.amount.toFixed(2)}</td>
                                <td>${new Date(dispute.due_date).toLocaleDateString()}</td>
                                <td>${dispute.dispute_reason || 'No reason provided'}</td> <!-- Display dispute reason -->
                                <td>${dispute.bill_status}</td>
                                <td><button onclick="resolveDispute(${dispute.bill_id})" title="Resolve the dispute"><i class="fas fa-file-invoice-dollar"></i> Resolve</button></td>
                            </tr>`;
                    }
                });
                
                // If no disputes are found
                if (tableHTML === '<tr><th>Bill ID</th><th>Order ID</th><th>Amount</th><th>Due Date</th><th>Dispute Reason</th><th>Status</th><th>Action</th></tr>') {
                    tableHTML += '<tr>No active disputes found.</tr>';
                }
                
                // Populate the table with the generated rows
                document.getElementById('table').innerHTML = tableHTML;
            } else {
                showAlert('No active disputes found.', 'failure');
            }
        })
        .catch(error => {
            console.error('Error fetching disputes:', error);
            showAlert('There was an error fetching disputes. Please try again later.', 'failure');
        });
    }
    
    
    // Function to resolve a dispute
    function resolveDispute(billId) {
        // Get modal elements
        const resolveDisputeModal = document.getElementById('dispute-bill-modal');  // Reusing same modal
        const closeResolveDispute = document.getElementById('close-dispute-bill');  // Close button
        const disputeReasonInput = document.getElementById('dispute-reason-input');  // Input for the reason
        
        // Open the modal (if not already open)
        resolveDisputeModal.style.display = "flex";
        
        // Close modal when clicking on the close button
        closeResolveDispute.addEventListener('click', function() {
            resolveDisputeModal.style.display = "none";
        });
        
        // Function to submit the dispute once the reason is provided
        document.getElementById('submit-dispute-btn').addEventListener('click', function () {
            const reason = disputeReasonInput.value.trim();
            
            // Check if reason is empty
            if (!reason) {
                alert("Please provide a reason for resolving the dispute.");
                return; // Don't proceed if the reason is empty
            }
            
            // Close the modal after capturing the reason
            resolveDisputeModal.style.display = "none";
            
            console.log("Resolving Dispute with Bill ID:", billId);
            console.log("Reason:", reason);
            
            // Example API call to send the resolution request
            fetch(API_BASE_URL + '/resolveDispute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')  // Assuming token-based auth
                },
                body: JSON.stringify({
                    billId,
                    reason
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Dispute resolved successfully') {
                    showAlert('Dispute resolved successfully!', 'success');
                    manageDisputes();
                } else {
                    showAlert('Failed to resolve dispute. Please try again.', 'failure');
                }
            })
            .catch(error => {
                console.error('Error resolving dispute:', error);
                showAlert('There was an error resolving the dispute. Please try again later.', 'failure');
            });
        });
    }
    
    
    
    
    function viewRevenueReport() {
        console.log("Viewing Revenue Report...");
    
        // Assume the user is authenticated and has a userId stored in sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
    
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
    
        // Hide or show relevant elements
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
    
        // Fetch the revenue report data
        fetch(API_BASE_URL + '/revenue_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>Revenue Report</h2>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total Revenue</th>
                        <th>New Clients</th>
                    </tr>
                </thead>
                <tbody>`;
                data.forEach(report => {
                    tableHTML += `
                    <tr>
                        <td>${report.month || 'N/A'}</td>
                        <td>${report.total_revenue ? `$${report.total_revenue.toFixed(2)}` : "Not available"}</td>
                        <td>${report.new_clients || 'N/A'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No revenue data available for the selected period.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching revenue report:', error);
            showAlert('There was an error fetching the revenue report. Please try again later.', 'failure');
        });
    }
    
    
    function viewBigClients() {
        console.log("Viewing List of Big Clients...");
    
        // Assume user authentication as before
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
    
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
    
        // Hide or show relevant elements
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
    
        // Fetch list of big clients
        fetch(API_BASE_URL + '/big_clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>Big Clients</h2>
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Revenue</th>
                        <th>Last Purchase</th>
                    </tr>
                </thead>
                <tbody>`;
                data.forEach(client => {
                    tableHTML += `
                    <tr>
                        <td>${client.name || 'N/A'}</td>
                        <td>${client.revenue ? `$${client.revenue.toFixed(2)}` : "Not available"}</td>
                        <td>${client.last_purchase ? new Date(client.last_purchase).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No big clients data available.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching big clients:', error);
            showAlert('There was an error fetching big clients. Please try again later.', 'failure');
        });
    }
    
    
    function viewOverdueBills() {
        console.log("Viewing Overdue Bills...");
    
        // Assume user authentication as before
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
    
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
    
        // Hide or show relevant elements
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
    
        // Fetch overdue bills data
        fetch(API_BASE_URL + '/overdue_bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>Overdue Bills</h2>
                <thead>
                    <tr>
                        <th>Bill ID</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>`;
                data.forEach(bill => {
                    tableHTML += `
                    <tr>
                        <td>${bill.bill_id || 'N/A'}</td>
                        <td>${bill.amount ? `$${bill.amount.toFixed(2)}` : "Not available"}</td>
                        <td>${bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</td>
                        <td>${bill.status || 'N/A'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No overdue bills found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching overdue bills:', error);
            showAlert('There was an error fetching overdue bills. Please try again later.', 'failure');
        });
    }
    
    
    function viewClientRatings() {
        console.log("Viewing Client Ratings...");
    
        // Assume user authentication as before
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
    
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
    
        // Hide or show relevant elements
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
    
        // Fetch client ratings data
        fetch(API_BASE_URL + '/client_ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>Client Ratings</h2>
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                    </tr>
                </thead>
                <tbody>`;
                data.forEach(client => {
                    tableHTML += `
                    <tr>
                        <td>${client.name || 'N/A'}</td>
                        <td>${client.rating || 'Not rated'}</td>
                        <td>${client.feedback || 'No feedback'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>No client ratings found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching client ratings:', error);
            showAlert('There was an error fetching client ratings. Please try again later.', 'failure');
        });
    }
    
    
    
    
    //Clients
    function submitNewRequest() {
        console.log("Submitting a New Request...");
        
        const userData = JSON.parse(sessionStorage.getItem('user')) || {};
        const clientId = userData.userId || '';
        const clientName = `${userData.firstName || ''} ${userData.lastName || ''}`;
        const userType = userData.user_type || '';
        
        const formContainer = document.getElementById('formContainer');
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('table').style.display = 'none';
        formContainer.innerHTML = `
        <form id="serviceRequestForm">
            <h2>Submit a New Service Request</h2>
            
            <div class="input-container">
                <label for="clientId">Client ID:</label>
                <input type="text" id="clientId" name="clientId" value="${clientId}" readonly required>
            </div>
            
            <div class="input-container">
                <label for="clientName">Client Name:</label>
                <input type="text" id="clientName" name="clientName" value="${clientName}" readonly required>
            </div>
            
            <div class="input-container">
                <label for="serviceType">Service Type:</label>
                <select id="serviceType" name="serviceType" required>
                    <option value="1">Driveway Sealing</option>
                    <option value="2">Crack Repair</option>
                    <option value="3">Pothole Filling</option>
                    <option value="4">Resurfacing</option>
                    <option value="5">Pressure Washing</option>
                    <option value="6">Driveway Cleaning</option>
                    <option value="7">Regraveling</option>
                    <option value="8">Seal Coating</option>
                    <option value="9">Other</option>
                </select>
            </div>
            
            <div class="input-container">
                <label for="description">Property Adress:</label>
                <textarea id="propertyAdress" name="propertyAdress" placeholder="Adress of the property.." required></textarea>
            </div>
    
            <div class="input-container">
                <label for="description">Description of the Issue:</label>
                <textarea id="description" name="description" placeholder="Describe the issue you are facing..." required></textarea>
            </div>
    
            <div class="input-container">
                <label for="urgency">Urgency Level:</label>
                <select id="urgency" name="urgency" required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            
            <div class="input-container">
                <label for="images">Upload Images (optional):</label>
                <input type="file" id="images" name="images" accept="image/*" multiple>
            </div>
            
            <div class="button-container">
                <button type="submit">Submit Request</button>
            </div>
        </form>
    `;
        
        const serviceRequestForm = document.getElementById('serviceRequestForm');
        serviceRequestForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const serviceType = document.getElementById('serviceType').value;   
            const description = document.getElementById('description').value;
            const urgency = document.getElementById('urgency').value;
            const images = document.getElementById('images').files; // Get multiple files
            
            const formData = new FormData();
            formData.append('clientId', clientId);
            formData.append('clientName', clientName);
            formData.append('userType', userType);
            formData.append('serviceType', serviceType);
            formData.append('propertyAdress', description);
            formData.append('description', description);
            formData.append('urgency', urgency);
            
            // Append each selected file to FormData
            Array.from(images).forEach((image) => {
                formData.append('images', image);  // Same field name ('images') for multiple files
            });
            
            try {
                const response = await fetch(API_BASE_URL + '/submit_request', {
                    method: 'POST',
                    body: formData,
                });
                
                if (!response.ok) throw new Error('Failed to submit request');
                
                const result = await response.json();
                console.log('Request submitted successfully:', result);
                showAlert('Your service request has been submitted successfully!', 'success');
                viewMyRequests()
                
            } catch (error) {
                console.error('Error submitting the request:', error);
                showAlert('An error occurred. Please try again later.', 'failure');
                
            }
        });
    }
    
    function viewMyRequests() {
        console.log("Viewing My Requests...");
        
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData.userId;  // Get the userId from session data
        
        // Check if userId is present
        if (!userId) {
            console.error('User is not authenticated');
            return;  // Exit the function if no userId found
        }
        
        // Fetch the user's service requests from the server using a POST request
        fetch(API_BASE_URL + '/view_requests', {
            method: 'POST',  // Use POST method to send data
            headers: {
                'Content-Type': 'application/json',  // Ensure the server knows we're sending JSON
            },
            body: JSON.stringify({ userId: userId })  // Send userId in the request body
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table'); // Get the table by id
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('table').style.display = 'block';
            
            // Check if there are any requests to display
            if (data && data.length > 0) {
                // Create table headers based on the fields
                let tableHTML = `<h2>My Service Requests</h2>
                <thead>
                    <tr>
                        <th>Request No</th>
                        <th>Service</th>
                        <th>Property Address</th>
                        <th>Proposed Price</th>
                        <th>Note</th>
                        <th>Urgency</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Images</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
            `;
                
                // Loop through the data to populate rows
                data.forEach(request => {
                    tableHTML += `
                    <tr>
                        <td>${request.request_id}</td>
                        <td>${request.service_name}</td>
                        <td>${request.property_address}</td>
                        <td>${request.proposed_price ? `$${request.proposed_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${request.note ? request.note : 'N/A'}</td>
                        <td>${request.urgency ? request.urgency : 'N/A'}</td>
                        <td>${request.status ? request.status : 'N/A'}</td>
                        <td>${new Date(request.created_at).toLocaleString()}</td>
                        <td>${request.image_urls ? request.image_urls.split(', ').map(url => `<a href="${url}" target="_blank"><img src="${url}" alt="Request Image" style="width: 100px; height: 100px; display: inline; margin-right: 10px;" /></a>`).join('') : 'No Images'}</td>
                        <td><button class="delete-row-btn" data-id=${request.request_id} title="Delete Request"><i class="fas fa-trash-alt"></i></button></td>
                    </tr>
                `;
                });
                
                // Close the table tags
                tableHTML += `
                </tbody>
            `;
                
                // Inject the table rows into the table element with id "table"
                table.innerHTML = tableHTML;
                
                // Add event listener for Delete buttons
                // Add event listener for Delete buttons
                document.querySelectorAll('.delete-row-btn').forEach(button => {
                    button.addEventListener('click', event => {
                        const request_id = event.target.getAttribute('data-id');
                        
                        // Show confirmation message using window.confirm
                        const isConfirmed = window.confirm(`Are you sure you want to delete the service request: ${request_id}?`);
                        
                        // Show alert based on the confirmation result
                        if (isConfirmed) {
                            deleteRowById(request_id); 
                            showAlert(`Client ID: ${request_id} has been successfully deleted.`, 'success');
                        } else {
                            showAlert('Delete action cancelled.', 'failure');
                        }
                    });
                });
                
                
                
            } else {
                table.innerHTML = '<tr>No service requests found.</tr>';
            }
        })
        .catch(error => {
            console.error('Error in fetching requests:', error);
            showAlert('There was an error fetching your requests. Please try again later.', 'failure');
        });
    }
    
    
    function viewMyOrders() {
        console.log("Viewing My Orders...");
        
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
        
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
        
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
        
        fetch(API_BASE_URL + '/view_orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            if (data && data.length > 0) {
                let tableHTML = `<h2>My Orders</h2>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Request No</th>
                        <th>Service</th>
                        <th>Proposed Price</th>
                        <th>Accepted Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            `;
                data.forEach(order => {
                    tableHTML += `
                    <tr>
                        <td>${order.order_id || 'N/A'}</td>
                        <td>${order.request_id || 'N/A'}</td>
                        <td>${order.service_name || 'N/A'}</td>
                        <td>${order.proposed_price ? `$${order.proposed_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${order.accepted_date ? new Date(order.accepted_date).toLocaleDateString() : 'N/A'}</td>
                        <td>${order.status || 'N/A'}</td>
                    </tr>
                `;
                });
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            }else {
                table.innerHTML = '<tr>Orders will show when contractor accepts request.</tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            showAlert('There was an error fetching your orders. Please try again later.', 'failure');
        });
    }
    
    
    
    function manageNegotiations() {
        console.log("Managing Order Negotiations...");
        
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData ? userData.userId : null;
        
        if (!userId) {
            console.error('User is not authenticated');
            return;
        }
        
        // Dynamically add the header for managing negotiations
        document.getElementById('table').style.display = 'block';
        document.getElementById('formContainer').style.display = 'none';
        
        // Fetch negotiation-related orders
        fetch(API_BASE_URL + '/manage_negotiations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }),
        })
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('table');
            
            if (data && data.length > 0) {
                let tableHTML = `<h2>Manage Negotiations</h2>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Proposed Price</th>
                        <th>Counter Price</th>
                        <th>Time Window</th>
                        <th>Response Note</th>
                        <th>Status</th>
                        <th>Negotiate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
            `;
                
                // Dynamically populate rows
                data.forEach(order => {
                    const timeWindow = `${new Date(order.time_window_start).toLocaleDateString()} - ${new Date(order.time_window_end).toLocaleDateString()}`;
                    
                    tableHTML += `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.proposed_price ? `$${order.proposed_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${order.counter_price ? `$${order.counter_price.toFixed(2)}` : "Not provided"}</td>
                        <td>${timeWindow}</td>
                        <td>${order.response_note || "No notes provided"}</td>
                        <td>${order.status}</td>
                        <td><button onclick="openChatPopup(${order.order_id}, ${order.owned_by}, ${order.client_id}, '${order.owner_name}')" title="Chat with ${order.owner_name}"><i class="fas fa-comments"></i> Chat with ${order.owner_name}</button></td>
                        <td><button onclick="handleNegotiation(${order.response_id}, 'Accept')" title="Accept the offer"><i class="fas fa-check"></i> Accept</button>
                        <button onclick="handleNegotiation(${order.response_id}, 'Decline')" title="Decline the offer"><i class="fas fa-times"></i> Decline</button>
                        </td>
                    </tr>
                `;
                });
                
                tableHTML += `</tbody>`;
                table.innerHTML = tableHTML;
            } else {
                table.innerHTML = '<tr>negotiations will avaialable after contractor quotes..</tr>';
            }
        })
        .catch(error => {
            console.error('Error managing negotiations:', error);
            showAlert('There was an error fetching negotiation data. Please try again later.', 'failure');
        });
    }
    
    function handleNegotiation(responseId, action) {
        const status = action === 'Accept' ? 'Accepted' : 'Rejected';
        
        // Make the request to update the negotiation status
        fetch(API_BASE_URL + '/update_negotiation_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responseId: responseId, status: status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${action} negotiation successfully!`);
                manageNegotiations();  // Refresh negotiations table after action
            } else {
                alert(`Failed to ${action.toLowerCase()} the negotiation.`);
            }
        })
        .catch(error => {
            console.error(`Error ${action.toLowerCase()}ing negotiation:`, error);
            alert(`Error during negotiation ${action.toLowerCase()}.`);
        });
    }
    
    
    // Pay Bill Modal functionality
    function payBill(billId, orderId, amount, discount, generatedDate, dueDate, billStatus) {
        console.log('Pay Bill clicked for Bill ID:', billId);
        
        // Fetch user information from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData?.userId;
        const userType = userData?.user_type;
        
        if (!userId) {
            showAlert('User is not authenticated.', 'failure');
            return;
        }
        
        // Fetch the user's profile and bill details from the server
        fetch(API_BASE_URL + '/getBill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Pass the token
            },
            body: JSON.stringify({ userId, billId, orderId }) // Send the userId, billId, and orderId in the request body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bill details');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                showAlert('No bill details found.', 'failure');
                return;
            }
            
            // Display the user's profile information in the modal
            const user = data[0];  // Assuming data contains the first user's profile
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-email').textContent = user.email;
            
            // Display the bill details
            document.getElementById('bill-id').textContent = billId;
            document.getElementById('order-id').textContent = orderId;
            document.getElementById('amount-to-pay').textContent = amount.toFixed(2);
            document.getElementById('discount').textContent = discount.toFixed(2);
            document.getElementById('generated-date').textContent = new Date(generatedDate).toLocaleDateString();
            document.getElementById('due-date').textContent = new Date(dueDate).toLocaleDateString();
            document.getElementById('bill-status').textContent = billStatus;
            document.getElementById('card-number').value = user.credit_card;
            
            // Enable the payment amount field and set it to the amount
            const paymentAmountField = document.getElementById('payment-amount');
            paymentAmountField.value = amount.toFixed(2);
            paymentAmountField.disabled = false;
            
            // Show the modal
            const payBillModal = document.getElementById('pay-bill-modal');
            payBillModal.style.display = "flex";
            
            // Handle payment submission
            document.getElementById('submit-payment').onclick = function () {
                // Get credit card details
                const cardNumber = document.getElementById('card-number').value;
                const cardExpiry = document.getElementById('card-expiry').value;
                const cardCVC = document.getElementById('card-cvc').value;
                
                // Validation for the card fields
                if (!cardNumber || !cardExpiry || !cardCVC) {
                    showAlert('Please fill in all credit card details.', 'failure');
                    return;
                }
                
                // Submit the payment with bill ID, amount, and credit card details
                submitPayment(billId, userId, amount, cardNumber, cardExpiry, cardCVC);
            };
        })
        .catch(error => {
            console.error('Error fetching bill details:', error);
            showAlert('Error fetching bill data. Please try again later.', 'failure');
        });
    }
    
    
    // Function to show the payment section and hide the review section
    function showPaymentSection() {
        document.getElementById('review-section').style.display = 'none';
        document.getElementById('payment-section').style.display = 'block';
    }
    
    // Function to show the review section and hide the payment section
    function showReviewSection() {
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('review-section').style.display = 'block';
    }
    
    
    // Submit Payment Function
    function submitPayment(billId, userId, amount, cardNumber, cardExpiry, cardCVC) {
        // Log payment submission for debugging
        console.log('Payment submitted:', cardNumber, cardExpiry, cardCVC, amount);
        
        // Close the modal after submitting payment
        document.getElementById('pay-bill-modal').style.display = 'none';
        
        // Prepare payment details to send to the server
        const paymentDetails = {
            billId,
            userId,
            amount,
            cardNumber,
            cardExpiry,
            cardCVC
        };
        
        // Send the payment details to the server via a POST request
        fetch(API_BASE_URL + '/submitPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Include token for authorization
            },
            body: JSON.stringify(paymentDetails)
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.message) {
                if (data.message === 'This bill has already been paid.') {
                    showAlert('This bill has already been paid.', 'failure');
                } else {
                    showAlert('Payment successful!', 'success');
                    viewAllBills()
                }
            } else {
                showAlert('Payment failed. Please try again.', 'failure');
            }
        })
        .catch(error => {
            // Handle errors during the fetch request
            console.error('Error processing payment:', error);
            showAlert('Error processing payment. Please try again later.', 'failure');
        });
    }
    
    
    
    
    
    
    function disputeBill() {
        console.log("Disputing Bill...");
        viewAllBills('dispute')
    }
    
    
    function disputeThebill(billId, orderId, reason) {
        // Get modal elements
        const disputeBillModal = document.getElementById('dispute-bill-modal');
        const closeDisputeBill = document.getElementById('close-dispute-bill');
        const disputeReasonInput = document.getElementById('dispute-reason-input');
        
        // Open the modal (if not already open)
        disputeBillModal.style.display = "flex";
        
        
        // Function to submit the dispute once the reason is provided
        document.getElementById('submit-dispute-btn').addEventListener('click', function () {
            const reason = disputeReasonInput.value.trim();
            
            if (!reason) {
                alert("Please provide a reason for disputing the bill.");
                return; // Don't proceed if the reason is empty
            }
            
            // Close the modal after capturing the reason
            disputeBillModal.style.display = "none";
            
            console.log("Disputing Bill with ID:", billId);
            console.log("Order ID:", orderId);
            console.log("Reason:", reason);
            
            // Example API call to send the dispute request along with the reason
            fetch(API_BASE_URL + '/disputeBill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    billId,
                    orderId,
                    reason
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Bill dispute raised successfully.', 'success');
                    disputeBill()
                } else {
                    showAlert('Failed to raise dispute. Please try again later.', 'failure');
                }
            })
            .catch(error => {
                console.error('Error disputing the bill:', error);
                showAlert('There was an error. Please try again later.', 'failure');
            });
        });
    }
    
    
    
    
    function viewProfile() {
        console.log("Viewing Profile...");
        
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        const userId = userData ? userData.userId : null;  // Safely get userId
        
        // Check if userId is present
        if (!userId) {
            console.error('User is not authenticated');
            showAlert('You must be logged in to view your profile.', 'failure');
            return;
        }
        
        // Fetch the user's profile data from the server
        fetch(API_BASE_URL + '/view_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Pass the token
            },
            body: JSON.stringify({ userId: userId })  // Send userId in the request body
        })
        .then(response => response.json())
        .then(data => {
            const formContainer = document.getElementById('formContainer');
            document.getElementById('formContainer').style.display = 'block';
            document.getElementById('table').style.display = 'none';
            
            if (data && data.first_name) { // Ensure valid profile data
                formContainer.innerHTML = `
                    <form id="profileForm">
                        <h2>Edit User Profile</h2>
                        <div class="input-container">
                            <label for="firstName">First Name:</label>
                            <input type="text" id="firstName" name="firstName" value="${data.first_name}" required />
                        </div>
                        <div class="input-container">
                            <label for="lastName">Last Name:</label>
                            <input type="text" id="lastName" name="lastName" value="${data.last_name}" required />
                        </div>
                        <div class="input-container">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" value="${data.email}" required />
                        </div>
                        <div class="input-container">
                            <label for="phone">Phone:</label>
                            <input type="text" id="updatephone" name="updatephone" value="${data.phone}" required />
                        </div>
                        <div class="input-container">
                            <label for="address">Address:</label>
                            <textarea id="updateaddress" name="updateaddress" required>${data.address}</textarea>
                        </div>
                        <div class="input-container">
                            <label for="creditCard">Credit Card:</label>
                            <input type="text" id="creditCard" name="creditCard" maxlength="16" value="${data.credit_card}" required />
                        </div>
                        <div class="button-container">
                            <button type="submit">Save Changes</button>
                        </div>
                    </form>
                `;
                
                // Add an event listener to handle the form submission
                document.getElementById('profileForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Collect the updated data from the form
                    const updatedData = {
                        userId: userId,
                        first_name: document.getElementById('firstName').value,
                        last_name: document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('updatephone').value,
                        address: document.getElementById('updateaddress').value,
                        credit_card: document.getElementById('creditCard').value,
                    };
                    console.log("Sending updated data:", updatedData);  // Debug log
                    
                    // Send the updated data to the server
                    fetch(API_BASE_URL + '/update_profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Pass the token
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showAlert('Profile updated successfully!', 'success');
                        } else {
                            showAlert('Failed to update profile. Please try again later.', 'failure');
                        }
                    })
                    .catch(error => {
                        console.error('Error updating profile:', error);
                        showAlert('There was an error updating your profile. Please try again later.', 'failure');
                    });
                });
            } else {
                formContainer.innerHTML = '<p>No profile data found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            showAlert('There was an error fetching your profile. Please try again later.', 'failure');
        });
    }
    
    
    
    function viewPaymentHistory() {
        console.log("Viewing Payment History...");
        
        // Retrieve user data from sessionStorage
        const userData = sessionStorage.getItem('user');
        if (!userData) {
            console.error('User session not found');
            return;
        }
        
        const userId = JSON.parse(userData).userId;
        
        // Fetch the user's payment history
        fetch(API_BASE_URL + '/view_payment_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('table').style.display = 'block';
            const paymentHistoryContainer = document.getElementById('table');
            
            if (data && data.length > 0) {
                let tableHTML = `
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Paid On</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Print</th>
                    </tr>
                </thead>
                <tbody>
            `;
                
                data.forEach(payment => {
                    tableHTML += `
                    <tr>
                        <td>${payment.payment_id}</td>
                        <td>${payment.transaction_id}</td>
                        <td>$${payment.amount.toFixed(2)}</td>
                        <td>${new Date(payment.payment_date).toLocaleDateString()}</td>
                        <td>${payment.payment_method}</td>
                        <td>${payment.payment_status}</td>
                        <td>${payment.client_name}</td>
                        <td>${payment.service_name}</td>
                        <td>
                            <button class="icon-btn"
                                onclick="printPayment(
                                    '${payment.payment_id}', 
                                    '${payment.transaction_id}', 
                                    '${payment.amount}', 
                                    '${new Date(payment.payment_date).toLocaleDateString()}', 
                                    '${payment.payment_method}', 
                                    '${payment.payment_status}',
                                    '${payment.client_name}',
                                    '${payment.service_name}',
                                    '${payment.proposed_price}',
                                    '${payment.owner_name}',
                                    '${payment.email}',
                                    '${payment.credit_card}'
                                )"
                                
                                title="Export payment details to PDF">
                                <i class="fas fa-file-pdf" aria-hidden="true" style="color: red; font-size: 16px;"></i>
                            </button>
                        </td>
                    </tr>
                `;
                });
                
                tableHTML += `</tbody>`;
                paymentHistoryContainer.innerHTML = tableHTML;
            } else {
                paymentHistoryContainer.innerHTML = '<p>No payment history found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching payment history:', error);
            showAlert('There was an error fetching your payment history. Please try again later.', 'failure');
        });
    }
    
    function exportBillToPDF(billId, orderId, amount, proposed_price, discount, generatedDate, dueDate, billStatus, clientName, serviceName, email) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set Title
        doc.setFontSize(22); // Larger font size for the main title
        doc.text("Bill", 105, 20, null, null, "center");
        
        // Add Subtitle or Details
        doc.setFontSize(14); // Medium font size for the subtitle
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");
        
        // Add Horizontal Line
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);
        
        // Add Client and Service Information
        doc.setFontSize(16); // Larger font size for section headers
        const clientInfo = [
            ["Client Name", clientName],
            ["Email", email],
            ["Service", serviceName],
            ["Proposed Price", `$${parseFloat(proposed_price).toFixed(2)}`], // Ensure amount is treated as a string
            ["Discount", `$${parseFloat(discount).toFixed(2)}`], // Ensure discount is treated as a string
        ];
        
        let startY = 45; // Starting Y position for the client info
        
        clientInfo.forEach(row => {
            let x1 = 10, x2 = 70; // Column positions
            doc.setFontSize(12); // Standard font size for labels
            doc.text(row[0], x1, startY); // Field
            doc.setFontSize(12); // Standard font size for content
            doc.text(row[1].toString(), x2, startY); // Ensure value is treated as a string
            startY += 10; // Increment Y position
        });
        
        // Add Payment Details
        doc.setFontSize(16); // Larger font size for section headers
        doc.text("Payment Information", 10, startY + 10);
        startY += 20;
        
        const paymentInfo = [
            ["Bill ID", billId],
            ["Order ID", orderId],
            ["Amount", `$${parseFloat(amount).toFixed(2)}`], // Ensure amount is treated as a string
            ["Generated Date", new Date(generatedDate).toLocaleDateString()], // Format date to show only date
            ["Due Date", new Date(dueDate).toLocaleDateString()], // Format date to show only date
            ["Status", billStatus],
        ];
        
        paymentInfo.forEach(row => {
            let x1 = 10, x2 = 70;
            doc.setFontSize(12); // Standard font size for labels
            doc.text(row[0], x1, startY); // Field
            doc.setFontSize(12); // Standard font size for content
            doc.text(row[1].toString(), x2, startY); // Ensure value is treated as a string
            startY += 10;
        });
        
        // Add Footer
        doc.setFontSize(10); // Small font size for footer
        doc.text("Thank you for your payment.", 105, startY + 20, null, null, "center");
        
        // Generate PDF as Blob
        const pdfBlob = doc.output('blob');
        
        // Create a URL for the Blob and open in a new tab
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, '_blank');
    }
    
    
    
    
    
    function printPayment(paymentId, transactionId, amount, paymentDate, paymentMethod, paymentStatus, clientName, serviceName, proposedPrice, contractorName, email, creditCard) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set Title
        doc.setFontSize(22); // Larger font size for the main title
        doc.text("Payment", 105, 20, null, null, "center");
        
        // Add Subtitle or Details
        doc.setFontSize(14); // Medium font size for the subtitle
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");
        
        // Add Horizontal Line
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);
        
        // Add Client and Service Information
        doc.setFontSize(16); // Larger font size for section headers
        const clientInfo = [
            ["Client Name", clientName],
            ["Email", email],
            ["Credit Card", `**** **** **** ${creditCard.slice(-4)}`],
            ["Service", serviceName],
            // Ensure proposedPrice is a valid number before formatting it
            ["Proposed Price", `$${isNaN(parseFloat(proposedPrice)) ? 0 : parseFloat(proposedPrice).toFixed(2)}`],
        ];
        
        let startY = 45; // Starting Y position for the client info
        
        clientInfo.forEach(row => {
            let x1 = 10, x2 = 70; // Column positions
            doc.setFontSize(12); // Standard font size for labels
            doc.text(row[0], x1, startY); // Field
            doc.setFontSize(12); // Standard font size for content
            doc.text(row[1], x2, startY); // Details
            startY += 10; // Increment Y position
        });
        
        // Add Payment Details
        doc.setFontSize(16); // Larger font size for section headers
        doc.text("Payment Information", 10, startY + 10);
        startY += 20;
        
        const paymentInfo = [
            ["Payment ID", paymentId],
            ["Transaction ID", transactionId],
            ["Amount", `$${parseFloat(amount).toFixed(2)}`],  // Ensure amount is a number
            ["Paid On", paymentDate],
            ["Payment Method", paymentMethod],
            ["Payment Status", paymentStatus],
        ];
        
        paymentInfo.forEach(row => {
            let x1 = 10, x2 = 70;
            doc.setFontSize(12); // Standard font size for labels
            doc.text(row[0], x1, startY); // Field
            doc.setFontSize(12); // Standard font size for content
            doc.text(row[1], x2, startY); // Details
            startY += 10;
        });
        
        // Add Contractor Information (if applicable)
        if (contractorName) {
            doc.setFontSize(16); // Larger font size for section headers
            doc.text("Contractor Information", 10, startY + 10);
            startY += 15;
            
            doc.setFontSize(12); // Standard font size for labels
            doc.text("Contractor:", 10, startY);
            doc.setFontSize(12); // Standard font size for content
            doc.text(contractorName, 70, startY);
        }
        
        // Add Footer
        doc.setFontSize(10); // Small font size for footer
        doc.text("Thank you for your payment.", 105, startY + 20, null, null, "center");
        
        // Generate PDF as Blob
        const pdfBlob = doc.output('blob');
        
        // Create a URL for the Blob and open in a new tab
        const pdfURL = URL.createObjectURL(pdfBlob);
        window.open(pdfURL, '_blank');
    }
    
    
    
    
    
    
    
    // Call the renderMenu function on page load
    window.onload = renderMenu;
    
    
    
    
    document.getElementById("contractor-btn").addEventListener("click", function() {
        // Record the selected user type as '2' for Contractor
        document.getElementById("user-type").value = "2";
        
        // Hide the user type selection and show the rest of the form
        document.getElementById("user-type-selection").style.display = "none";
        document.getElementById("sign-up-form").style.display = "block";
    });
    
    document.getElementById("client-btn").addEventListener("click", function() {
        // Record the selected user type as '3' for Client
        const userType = document.getElementById("user-type").value = "3";
        
        // Hide the user type selection and show the rest of the form
        document.getElementById("user-type-selection").style.display = "none";
        document.getElementById("sign-up-form").style.display = "block";
    });
    
    // Back to User Type Selection
    document.getElementById("back-btn").addEventListener("click", function() {
        // Show the user type selection again and hide the sign-up form
        document.getElementById("user-type-selection").style.display = "block";
        document.getElementById("sign-up-form").style.display = "none";
    });
    
    
    
    // Sign-up action
    document.getElementById('sign-up-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        
        // Collect data from form fields
        const userType = document.getElementById('user-type').value;
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const address = document.getElementById('address').value;
        
        // Add validation
        if (!firstName || !lastName || !email || !password || !phone || !address) {
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
        
        // Create a user object without hashing the password client-side
        const userData = {
            user_type: userType,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password, // Send plaintext password to the server
            phone: phone,
            address: address
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
        
        // Add validation
        if (!email || !password) {
            showAlert('Please fill in all required fields.', 'failure');
            return;
        }
        
        // Send login request to backend
        try {
            const response = await fetch(API_BASE_URL + '/signin', {
                method: 'POST',
                credentials: 'include', // If you are using cookies for session management
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }) // Send plaintext password
            });
            
            const result = await response.json();
            // alert(JSON.stringify(result))
            
            if (response.ok) {
                // Store JWT in localStorage or sessionStorage
                localStorage.setItem('authToken', result.token); // Store JWT token
                
                // Update UI elements based on sign-in status
                document.getElementById('sign-in-modal').style.display = 'none';
                document.getElementById('sign-up-btn').style.display = 'none';
                document.getElementById('sign-in-btn').style.display = 'none';
                document.getElementById('sign-out-btn').style.display = 'block';
                
                // Optionally, reload the page or redirect
                toggleSignInStatus(true);  // Update the UI sign-in state
                localStorage.setItem('reloadFlag', 'true');
                location.reload();
            } else {
                showAlert('Sign in failed: ' + result.error, 'failure');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            showAlert("An error occurred during sign in. Please try again.", "failure");
        }
    });
    
    // Check if the flag is set on page load
    window.addEventListener('load', () => {
        const reloadFlag = localStorage.getItem('reloadFlag');
        
        if (reloadFlag === 'true') {
            // Reset the flag
            localStorage.removeItem('reloadFlag');
            
            // Trigger the second reload after a short delay
            setTimeout(() => {
                location.reload();
            }, 100); // 100ms delay before the second reload
            
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    });
    
    
    
    //sign-out action
    document.getElementById('sign-out-btn').addEventListener('click', async () => {
        try {
            // Get the JWT token from localStorage
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                console.error('No token found');
                showAlert('You are not logged in.', 'failure');
                return;
            }
            
            // Send request to logout route with the token in the Authorization header
            const response = await fetch(API_BASE_URL + '/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Add token to Authorization header
                },
                credentials: 'include', // Ensure session cookies are included if used
            });
            
            // Check if the logout was successful
            if (response.ok) {
                // Clear the JWT token from localStorage
                localStorage.removeItem('authToken');
                toggleSignInStatus(false);  // Update the UI sign-in state
                showAlert('Successfully logged out.', 'success');  // Inform user of success
                location.reload();
            } else {
                // Handle error during logout
                const errorData = await response.json();
                console.error('Logout error:', errorData);
                showAlert('Logout failed. Please try again.', 'failure');
            }
        } catch (error) {
            // Catch any network or other errors
            console.error('Error during logout:', error);
            showAlert("An error occurred during logout. Please try again.", "failure");
        }
    });
    
    
    
    //not exactly deleting
    function deleteRowById(request_id) {
        console.log("Attempting to delete row with Request ID:", request_id);
        
        fetch(API_BASE_URL + '/delete/' + request_id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Ensure you are passing the correct token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Row marked as deleted successfully");
                location.reload(); // Or update the UI dynamically
            } else {
                console.log("Error deleting row:", data.message || "Unknown error");
            }
        })
        .catch(error => {
            console.error("Error during the fetch operation:", error);
        });
    }
    
    
    
    
    
    
    function displayResults(results) {
        if(results){
            loadHTMLTable(results);
        }
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
    const manageQuoteModal = document.getElementById('manage-quote-modal');
    const closeManageQuote = document.getElementById('close-manage-quote');
    const chatModal = document.getElementById('chat-modal');
    const closeChatModal = document.getElementById('close-chat-modal');
    const generateBillModal = document.getElementById('generate-bill-modal');
    const closeGenerateBill = document.getElementById('close-generate-bill');
    const payBillModal = document.getElementById('pay-bill-modal');
    const closePayBillModal = document.getElementById('close-pay-bill-modal');
    const disputeBillModal = document.getElementById('dispute-bill-modal');
    const closeDisputeBill = document.getElementById('close-dispute-bill');
    
    // Elements for sign-in status
    const signedInSection = document.getElementById('signed-in-section');
    const guestSection = document.getElementById('guest-section');
    
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
    closeManageQuote.addEventListener('click', () => closeModal(manageQuoteModal));
    closeChatModal.addEventListener('click', () => closeModal(chatModal));
    closeGenerateBill.addEventListener('click', () => closeModal(generateBillModal));
    closePayBillModal.addEventListener('click', () => closeModal(payBillModal));
    closeDisputeBill.addEventListener('click', () => closeModal(disputeBillModal));
    
    
    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === signUpModal) closeModal(signUpModal);
        if (event.target === signInModal) closeModal(signInModal);
        if (event.target === updateModal) closeModal(updateModal);
        if (event.target === manageQuoteModal) closeModal(manageQuoteModal);
        if (event.target === chatModal) closeModal(chatModal);  
        if (event.target === generateBillModal) closeModal(generateBillModal);
        if (event.target === payBillModal) closeModal(payBillModal);
        if (event.target === disputeBillModal) closeModal(disputeBillModal);
        
    });
    
    // Function to toggle sign-in status
    const toggleSignInStatus = (isLoggedIn) => {
        
        const welcomeMessage = document.getElementById('welcome-message');
        signInBtn.style.display = isLoggedIn ? 'none' : 'inline';
        signUpBtn.style.display = isLoggedIn ? 'none' : 'inline';
        signOutBtn.style.display = isLoggedIn ? 'inline' : 'none';
        signedInSection.classList.toggle('disabled', !isLoggedIn);
        guestSection.style.display = isLoggedIn ? 'none' : 'block';
        welcomeMessage.hidden = !isLoggedIn;
        
    };
    
    
    
    