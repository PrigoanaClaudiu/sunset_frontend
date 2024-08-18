document.addEventListener("DOMContentLoaded", function() {
    updateAuthState();  // Adjust the form based on the user's authentication state

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitContactForm();
    });
});

function updateAuthState() {
    const token = localStorage.getItem('token');
    const unauthenticatedFields = document.getElementById('unauthenticated-fields');

    if (token) {
        // Simulate fetching user data (Replace this with actual data retrieval if available)
        const userName = "John Doe";  // Example; replace with actual data
        const userEmail = "john@example.com";  // Example; replace with actual data

        document.getElementById('name').value = userName;
        document.getElementById('email').value = userEmail;
        unauthenticatedFields.style.display = 'none';  // Hide name and email fields for authenticated users
    } else {
        unauthenticatedFields.style.display = 'block';  // Show name and email fields for unauthenticated users
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
}
