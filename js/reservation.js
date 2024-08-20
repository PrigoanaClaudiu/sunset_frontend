document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const noPersField = document.getElementById('no_pers');
    const dataStartField = document.getElementById('data_start');
    const dataFinishField = document.getElementById('data_finish');
    const detailsField = document.getElementById('details');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const unauthenticatedFields = document.getElementById('unauthenticated-fields');
    const reservationForm = document.getElementById('reservationForm');

    if (userRole === 'admin') {
        // Ascunde formularul de rezervare pentru admini
        reservationInfo.style.display = 'none';
        reservationForm.style.display = 'none';


        // Afișează rezervările viitoare
        fetchUpcomingReservations();
    } else {

        prefillAuthenticatedUserFields();
        setupFormSubmission();
    }

    function prefillAuthenticatedUserFields() {
        // Pre-fill fields for authenticated users
        if (token) {
            const storedName = localStorage.getItem('user_name');
            const storedEmail = localStorage.getItem('user_email');

            if (storedName && nameField) {
                nameField.value = storedName;
                nameField.disabled = true;
                unauthenticatedFields.style.display = 'none'; // Hide name and email fields
            }

            if (storedEmail && emailField) {
                emailField.value = storedEmail;
                emailField.disabled = true;
            }
        }
    }

    function setupFormSubmission() {
        // Flatpickr setup for date selection
        flatpickr(dataStartField, {
            minDate: "today", // Disable past dates
            dateFormat: "Y-m-d", // Format for backend compatibility
            onChange: function(selectedDates, dateStr, instance) {
                flatpickr(dataFinishField, {
                    minDate: dateStr,
                    maxDate: new Date(selectedDates[0].getTime() + 7 * 24 * 60 * 60 * 1000), // Max 7 days after check-in
                    dateFormat: "Y-m-d", // Format for backend compatibility
                    defaultDate: dateStr
                });
            }
        });

        flatpickr(dataFinishField, {
            minDate: "today", // Disable past dates
            dateFormat: "Y-m-d" // Format for backend compatibility
        });

        // Form validation and submission
        document.getElementById('reservationForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            // Phone number validation
            const phoneNumber = phoneField.value;
            const phoneRegex = /^\d{10}$/;  // Regular expression to match exactly 10 digits
            if (!phoneRegex.test(phoneNumber)) {
                errorMessage.innerText = 'Numărul de telefon trebuie să conțină exact 10 cifre.';
                errorMessage.style.display = 'block';
                return;
            }

            // Email validation
            const emailValue = emailField.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField && !emailRegex.test(emailValue)) {
                errorMessage.innerText = 'Adresa de email nu este validă. Introduceți o adresă de email corectă.';
                errorMessage.style.display = 'block';
                return;
            }

            // Check-in and Check-out date validation
            if (!dataStartField.value) {
                errorMessage.innerText = 'Selectați o dată de check-in.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!dataFinishField.value) {
                errorMessage.innerText = 'Selectați o dată de check-out.';
                errorMessage.style.display = 'block';
                return;
            }

            // Clear any previous error messages
            errorMessage.style.display = 'none';

            const reservationData = {
                name: nameField.value || "",
                email: emailField.value || "",
                phone_nr: phoneField.value,
                no_pers: noPersField.value,
                data_start: dataStartField.value,
                data_finish: dataFinishField.value,
                details: detailsField.value
            };

            try {
                const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reservations/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: JSON.stringify(reservationData)
                });

                const responseData = await response.json();

                if (response.ok) {
                    successMessage.innerHTML = 'Rezervarea a fost trimisă cu succes!';
                    successMessage.style.display = 'block';
                    document.getElementById('reservationForm').style.display = 'none';

                    // Redirect after 3 seconds
                    setTimeout(() => {
                        window.location.href = '/sunset_frontend/index.html';
                    }, 3000);
                } else {
                    errorMessage.innerText = responseData.detail || 'A apărut o eroare. Vă rugăm să încercați din nou.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.innerText = 'A apărut o eroare neprevăzută. Vă rugăm să încercați din nou mai târziu.';
                errorMessage.style.display = 'block';
            }
        });
    }


    function fetchUpcomingReservations() {
        fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reservations/upcoming', {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                displayReservations(data);
            } else {
                successMessage.innerHTML = 'Nu există rezervări viitoare.';
                successMessage.style.display = 'block';
            }
        })
        .catch(error => {
            errorMessage.innerHTML = 'A apărut o eroare la încărcarea rezervărilor.';
            errorMessage.style.display = 'block';
        });
    }

    function displayReservations(reservations) {
        reservationsContainer.innerHTML = '';
        reservationsContainer.classList.add('reservations-grid');

        reservations.forEach(reservation => {
            const reservationElement = document.createElement('div');
            reservationElement.className = 'reservation-item';
            reservationElement.innerHTML = `
                <h3>Rezervare pentru: ${reservation.name}</h3>
                <p>Email: ${reservation.email}</p>
                <p>Telefon: ${reservation.phone_nr}</p>
                <p>Număr de persoane: ${reservation.no_pers}</p>
                <p>Check-in: ${reservation.data_start}</p>
                <p>Check-out: ${reservation.data_finish}</p>
                <p>Detalii: ${reservation.details || 'N/A'}</p>
            `;
            reservationsContainer.appendChild(reservationElement);
        });
    }
});