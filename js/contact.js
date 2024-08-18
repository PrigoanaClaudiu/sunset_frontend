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
        unauthenticatedFields.style.display = 'none';  // Hide name and email fields for authenticated users
    } else {
        unauthenticatedFields.style.display = 'block';  // Show name and email fields for unauthenticated users
    }
}

async function submitContactForm() {
    const token = localStorage.getItem('token');

    const contactData = {
        name: document.getElementById('name') ? document.getElementById('name').value : null,
        email: document.getElementById('email') ? document.getElementById('email').value : null,
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
            document.getElementById('contactForm').reset();
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
