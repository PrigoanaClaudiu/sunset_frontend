console.log('contact.js script is running');
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

    if (unauthenticatedFields) {
        console.log('Unauthenticated fields found:', unauthenticatedFields);  // Check if element exists
    } else {
        console.error('Unauthenticated fields not found in the DOM!');
        return;
    }

    if (token) {
        unauthenticatedFields.style.display = 'none';  // Hide name and email fields for authenticated users
        console.log('Unauthenticated fields hidden.');
    } else {
        unauthenticatedFields.style.display = 'block';  // Show name and email fields for unauthenticated users
        console.log('Unauthenticated fields shown.');
    }
}

// async function submitContactForm() {
//     const token = localStorage.getItem('token');

//     // Collect the data from the form
//     const nameField = document.getElementById('name');
//     const emailField = document.getElementById('email');
//     const phoneField = document.getElementById('phone');
//     const messageField = document.getElementById('message');

//     if (token) {
//         // Retrieve stored user info for authenticated users
//         const storedName = localStorage.getItem('user_name');
//         const storedEmail = localStorage.getItem('user_email');

//         if (storedName && nameField) {
//             nameField.value = storedName;
//         }
//         if (storedEmail && emailField) {
//             emailField.value = storedEmail;
//         }
//     }

//     const contactData = {
//         name: nameField ? nameField.value : "",
//         email: emailField ? emailField.value : "",
//         phone_nr: phoneField.value,
//         message: messageField.value
//     };


//     try {
//         const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/contacts/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...(token && { 'Authorization': `Bearer ${token}` })
//             },
//             body: JSON.stringify(contactData)
//         });

//         const responseData = await response.json();

//         if (response.ok) {
//             document.getElementById('success-message').style.display = 'block';
//             document.getElementById('error-message').style.display = 'none';
//             document.getElementById('contactForm').reset();
//         } else {
//             console.error('Error Response Data:', responseData);
//             document.getElementById('error-message').innerText = responseData.detail ? responseData.detail[0].msg : 'An error occurred.';
//             document.getElementById('error-message').style.display = 'block';
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         document.getElementById('error-message').innerText = 'An unexpected error occurred. Please try again later.';
//         document.getElementById('error-message').style.display = 'block';
//     }
// }

async function submitContactForm() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug: Check if the token is retrieved

    // Collect the data from the form
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const messageField = document.getElementById('message');
    const errorMessage = document.getElementById('error-message');

    if (token) {
        const storedName = localStorage.getItem('user_name');
        const storedEmail = localStorage.getItem('user_email');

        console.log('Stored Name:', storedName); // Debug: Check if name is retrieved
        console.log('Stored Email:', storedEmail); // Debug: Check if email is retrieved

        // Handle name field
        if (storedName && nameField) {
            nameField.value = storedName;
            nameField.disabled = true;  // Disable the name field
            nameField.removeAttribute('required'); // Remove the required attribute
            nameField.style.display = 'block'; // Ensure the field is visible
        }

        // Handle email field
        if (storedEmail && emailField) {
            emailField.value = storedEmail;
            emailField.disabled = true;  // Disable the email field
            emailField.removeAttribute('required'); // Remove the required attribute
            emailField.style.display = 'block'; // Ensure the field is visible
        }
    }

    // Phone number validation
    const phoneNumber = phoneField.value;
    const phoneRegex = /^\d{10}$/;  // Regular expression to match exactly 10 digits

    if (!phoneRegex.test(phoneNumber)) {
        errorMessage.innerText = 'Numărul de telefon trebuie să conțină exact 10 cifre.';
        errorMessage.style.display = 'block';
        return;  // Stop the form submission if the phone number is invalid
    }

    // Clear the error message if the phone number is valid
    errorMessage.style.display = 'none';

    const contactData = {
        name: nameField ? nameField.value : "",
        email: emailField ? emailField.value : "",
        phone_nr: phoneField.value,
        message: messageField.value
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
            // Hide the form and display success message
            document.getElementById('contactForm').style.display = 'none';
            const successMessage = document.getElementById('success-message');
            successMessage.innerHTML = 'Mesaj trimis cu succes!<br>Veți fi redirecționat!';
            successMessage.style.display = 'block';

            // Redirect to the homepage after 3 seconds
            setTimeout(() => {
                window.location.href = '/sunset_frontend/index.html';
            }, 3000);
        } else {
            errorMessage.innerText = responseData.detail ? responseData.detail[0].msg : 'An error occurred.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.innerText = 'An unexpected error occurred. Please try again later.';
        errorMessage.style.display = 'block';
    }
}

// Event listener to clear the error message when the user corrects the phone number
document.getElementById('phone').addEventListener('input', function() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');

    if (token) {
        const storedName = localStorage.getItem('user_name');
        const storedEmail = localStorage.getItem('user_email');

        if (storedName && nameField) {
            nameField.value = storedName;
            nameField.disabled = true; // Disable the name field so it's not editable
            nameField.style.display = 'block'; // Ensure it's visible
        }

        if (storedEmail && emailField) {
            emailField.value = storedEmail;
            emailField.disabled = true; // Disable the email field so it's not editable
            emailField.style.display = 'block'; // Ensure it's visible
        }
    } else {
        // If unauthenticated, ensure fields are editable and required
        nameField.removeAttribute('disabled');
        nameField.setAttribute('required', 'true');
        nameField.style.display = 'block'; // Ensure it's visible

        emailField.removeAttribute('disabled');
        emailField.setAttribute('required', 'true');
        emailField.style.display = 'block'; // Ensure it's visible
    }
});
