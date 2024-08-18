document.addEventListener("DOMContentLoaded", function() {
    updateAuthState();  // Adjust the form based on the user's authentication state

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await submitContactForm();
    });
});

function updateAuthState() {
    const token = localStorage.getItem('token');
    const unauthenticatedFields = document.getElementById('unauthenticated-fields');

    if (token) {
        // Example placeholder data; should replace with real user data retrieval logic
        const userName = "John Doe";  // Replace with actual user data retrieval
        const userEmail = "john@example.com";  // Replace with actual user data retrieval

        document.getElementById('name').value = userName;
        document.getElementById('email').value = userEmail;
        unauthenticatedFields.style.display = 'none';  // Hide fields for authenticated users
    } else {
        unauthenticatedFields.style.display = 'block';  // Show fields for unauthenticated users
    }
}

async function submitContactForm() {
    const token = localStorage.getItem('token');

    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/contacts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(contactData)
        });

        const responseData = await response.json();

        if (response.ok) {
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
            contactForm.reset();
        } else {
            document.getElementById('error-message').innerText = responseData.detail || 'An error occurred.';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An unexpected error occurred. Please try again later.';
        document.getElementById('error-message').style.display = 'block';
    }
}
