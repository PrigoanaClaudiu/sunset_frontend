const loginUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/login';
const registerUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/users';

document.addEventListener("DOMContentLoaded", function() {
    updateAuthButton();
});

function updateAuthButton() {
    const token = localStorage.getItem('token');
    //console.log('Token retrieved:', token);  // Log token retrieval
    const authButton = document.getElementById('auth-button');

    if (!authButton) {
        console.error('auth-button element not found in the DOM.');
        return; // Exit the function if authButton is not found
    }

    if (token) {
        // console.log('User is authenticated. Updating button to "DECONECTARE".');
        authButton.textContent = 'DECONECTARE';
        authButton.setAttribute('href', '#');
        authButton.onclick = function(event) {
            event.preventDefault();
            logoutUser();
        };
    } else {
        // console.log('User is not authenticated. Updating button to "AUTENTIFICARE".');
        authButton.textContent = 'AUTENTIFICARE';
        authButton.setAttribute('href', '/sunset_frontend/pages/login.html');
    }
}

function logoutUser() {
    // console.log('Logging out user...');
    localStorage.removeItem('token');
    updateAuthButton();  // Update the button back to login state
    window.location.href = '/sunset_frontend/index.html';  // Redirect to homepage
}

// Ensure updateAuthButton is called on script load
document.addEventListener("DOMContentLoaded", function() {
    updateAuthButton();
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the JWT token and user info in localStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_name', data.user_name);  // Store the user's name
                localStorage.setItem('user_email', data.user_email);  // Store the user's email
                window.location.href = '/sunset_frontend/index.html'; // Redirect to the main page
            } else {
                handleErrorMessage(data);
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'An unexpected error occurred. Please try again later.';
            document.getElementById('error-message').style.display = 'block';
        }
    });
}


// Function to handle error messages
function handleErrorMessage(data) {
    let errorMessage = '';

    if (data.detail) {
        errorMessage = data.detail;
    } else if (typeof data === 'object') {
        errorMessage = Object.values(data).join(', ');
    } else {
        errorMessage = 'Authentication failed';
    }

    document.getElementById('error-message').innerText = errorMessage;
    document.getElementById('error-message').style.display = 'block';
}

// Function to handle registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, email: email, password: password }),
            });

            if (response.ok) {
                document.getElementById('success-message').innerText = 'Înregistrare reușită! Puteți acum să vă autentificați.';
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('error-message').style.display = 'none';
                registerForm.reset();
            } else {
                const data = await response.json();
                handleErrorMessage(data);
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Adresa de email folosita, e deja inregistrata!';
            document.getElementById('error-message').style.display = 'block';
        }
    });
}