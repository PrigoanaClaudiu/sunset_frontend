// // auth.js

// const loginUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/login';
// const registerUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/users';

// // Gestionarea procesului de Login
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//     loginForm.addEventListener('submit', async function(event) {
//         event.preventDefault();

//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         try {
//             const response = await fetch(loginUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: new URLSearchParams({ username: email, password: password }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Stocăm token-ul JWT
//                 localStorage.setItem('token', data.access_token);
//                 window.location.href = '../index.html'; // Redirecționează la pagina principală
//             } else {
//                 handleErrorMessage(data);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             document.getElementById('error-message').innerText = 'An unexpected error occurred. Please try again later.';
//             document.getElementById('error-message').style.display = 'block';
//         }
//     });
// }

// // Funcție pentru gestionarea mesajelor de eroare
// function handleErrorMessage(data) {
//     let errorMessage = '';

//     if (data.detail) {
//         errorMessage = data.detail;
//     } else if (typeof data === 'object') {
//         errorMessage = Object.values(data).join(', ');
//     } else {
//         errorMessage = 'Authentication failed';
//     }

//     document.getElementById('error-message').innerText = errorMessage;
//     document.getElementById('error-message').style.display = 'block';
// }


const loginUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/login';
const registerUrl = 'https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/users';

// Function to update the authentication button
document.addEventListener("DOMContentLoaded", function() {
    updateAuthButton(); // Call this to update the button on page load
});

function updateAuthButton() {
    const token = localStorage.getItem('token');
    const authButton = document.getElementById('auth-button');

    if (token) {
        authButton.textContent = 'DECONECTARE';
        authButton.setAttribute('href', '#');
        authButton.addEventListener('click', logoutUser);
    } else {
        authButton.textContent = 'AUTENTIFICARE';
        authButton.setAttribute('href', '/sunset_frontend/pages/login.html');
    }
}

// Function to handle user logout
function logoutUser(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    updateAuthButton();  // Update the button back to login state
    window.location.href = '/sunset_frontend/index.html';  // Redirect to homepage
}

// Handling the login process
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
                // Store the JWT token
                localStorage.setItem('token', data.access_token);
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
