// auth.js

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            window.location.href = 'index.html';  // Redirecționează utilizatorul la pagina principală
        } else {
            document.getElementById('error-message').innerText = data.detail || 'Login failed';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An error occurred';
        document.getElementById('error-message').style.display = 'block';
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = 'login.html';  // Redirecționează utilizatorul la pagina de login
        } else {
            document.getElementById('error-message').innerText = data.detail || 'Registration failed';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An error occurred';
        document.getElementById('error-message').style.display = 'block';
    }
});
