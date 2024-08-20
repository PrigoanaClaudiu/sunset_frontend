document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const contactForm = document.getElementById('contactForm');
    const contactsContainer = document.createElement('div'); // Container pentru mesajele de contact

    if (userRole === 'admin') {
        // Ascunde formularul de contact pentru admini
        contactForm.style.display = 'none';

        // Afișează toate mesajele de contact
        fetchContacts();
    } else {
        setupFormSubmission();
    }

    function setupFormSubmission() {
        document.getElementById('contactForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            await submitContactForm();
        });
    }

    function fetchContacts() {
        fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/contacts/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayContacts(data);
            } else {
                contactsContainer.innerHTML = 'Nu există mesaje de contact.';
                document.querySelector('main').appendChild(contactsContainer);
            }
        })
        .catch(error => {
            console.error('Eroare la încărcarea mesajelor de contact:', error);
        });
    }

    function displayContacts(contacts) {
        contactsContainer.innerHTML = '';
        contactsContainer.classList.add('admin-reservations-grid'); // Folosim același stil ca la rezervări

        contacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.className = 'admin-reservation-item'; // Stil similar cu rezervările
            contactElement.innerHTML = `
                <h3>Mesaj de la: ${contact.name}</h3>
                <p>Email: ${contact.email}</p>
                <p>Telefon: ${contact.phone_nr}</p>
                <p>Mesaj: ${contact.message}</p>
                <button class="delete-contact-btn" data-id="${contact.id}">Șterge</button>
            `;
            contactsContainer.appendChild(contactElement);
        });

        document.querySelector('main').appendChild(contactsContainer);

        document.querySelectorAll('.delete-contact-btn').forEach(button => {
            button.addEventListener('click', function () {
                const contactId = this.dataset.id;
                deleteContact(contactId);
            });
        });
    }

    function deleteContact(id) {
        fetch(`https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                fetchContacts(); // Reîncarcă contactele după ștergere
            } else {
                console.error('Eroare la ștergerea mesajului de contact');
            }
        })
        .catch(error => {
            console.error('Eroare la ștergerea mesajului de contact:', error);
        });
    }
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

async function submitContactForm() {
    const token = localStorage.getItem('token');

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
