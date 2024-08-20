document.addEventListener("DOMContentLoaded", function() {
    loadReviewSection();
});

async function loadReviewSection() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    const reviewSection = document.getElementById('review-section');

    if (userRole === 'admin') {
        document.getElementById('review-section').style.display = 'none';
        return;
    }

    if (token) {
        try {
            const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/user-review', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userReview = await response.json();
                displayUserReview(userReview);
            } else if (response.status === 404) {
                // User does not have a review, display the form without logging an error
                displayReviewForm();
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to fetch user review: ${response.statusText}`);
            }
        } catch (error) {
            // In case of a non-404 error, show it on the UI but do not log it in the console
            reviewSection.innerHTML = `<p>Eroare la încărcarea recenziei: ${error.message}</p>`;
        }
    } else {
        reviewSection.innerHTML = `
            <div id="auth-message-container">
                <p id="auth-message">Autentifica-te pentru a ne lasa un review!</p>
                <a href="./pages/login.html" class="auth-link">AUTENTIFICARE</a>
            </div>
        `;
    }
}


function getUserIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
}

function displayUserReview(review) {
    const reviewSection = document.getElementById('review-section');
    reviewSection.innerHTML = `
        <div class="user-review-container">
            <div class="user-review">
                <h3>Recenzia ta</h3>
                <p>${review.content}</p>
                <div class="rating-stars">
                    ${generateStarRating(review.rating)}
                </div>
                <div class="review-buttons">
                    <button onclick="editReview(${review.id})">Modifica</button>
                    <button onclick="deleteReview(${review.id})">Sterge</button>
                </div>
            </div>
        </div>
    `;
}

function displayReviewForm(review = null) {
    const reviewSection = document.getElementById('review-section');
    const content = review ? review.content : '';
    const rating = review ? review.rating : 0;

    reviewSection.innerHTML = `
        <div id="reviewForm-container">
            <h3>${review ? 'Modifica recenzia ta' : 'Lasa un review'}</h3>
            <form id="reviewForm">
                <textarea id="reviewContent" placeholder="Scrie recenzia ta..." required>${content}</textarea>
                <div id="rating-container">
                    ${generateStarInputs(rating)}
                </div>
                <button type="submit">${review ? 'Actualizeaza' : 'Trimite'}</button>
            </form>
            <p id="error-message" style="display:none; color:red;"></p>
        </div>
    `;

    document.getElementById('reviewForm').addEventListener('submit', review ? submitReviewUpdate.bind(null, review.id) : submitReview);
}


function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

function generateStarInputs(selectedRating) {
    let starInputs = '';
    for (let i = 1; i <= 5; i++) {
        starInputs += `
            <input type="radio" name="rating" value="${i}" id="star${i}" ${i === selectedRating ? 'checked' : ''} style="display:none;">
            <label for="star${i}" class="rating-star">★</label>
        `;
    }
    return `<div class="rating-stars">${starInputs}</div>`;
}

/* Corecție la selecția stelelor */
document.addEventListener('change', function(event) {
    if (event.target.name === 'rating') {
        let selectedValue = event.target.value;
        let stars = document.querySelectorAll('.rating-stars label');
        stars.forEach((star, index) => {
            if (index < selectedValue) {
                star.style.color = 'gold';
            } else {
                star.style.color = '#ccc'; // Stele negre mai deschise pentru neactivate
            }
        });
    }
});

/* Inițializare corectă a stelelor la încărcare */
document.addEventListener('DOMContentLoaded', function() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    if (selectedRating) {
        let event = new Event('change');
        selectedRating.dispatchEvent(event);
    }
});

async function submitReview(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const content = document.getElementById('reviewContent').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, rating })
        });

        if (response.ok) {
            const newReview = await response.json();
            displayUserReview(newReview);
        } else {
            const errorData = await response.json();
            errorMessage.innerText = errorData.detail;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.innerText = 'A apărut o eroare. Vă rugăm să încercați din nou.';
        errorMessage.style.display = 'block';
    }
}


async function editReview(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const review = await response.json();
            displayReviewForm(review);  // Pre-fill the form with the review data
        } else {
            // console.error('Failed to fetch the review for editing.');
        }
    } catch (error) {
        // console.error('Error:', error);
    }
}

async function submitReviewUpdate(id, event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const content = document.getElementById('reviewContent').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, rating })
        });

        if (response.ok) {
            const updatedReview = await response.json();
            displayUserReview(updatedReview);
        } else {
            const errorData = await response.json();
            errorMessage.innerText = errorData.detail;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        // console.error('Error:', error);
        errorMessage.innerText = 'A apărut o eroare. Vă rugăm să încercați din nou.';
        errorMessage.style.display = 'block';
    }
}


async function deleteReview(id) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            displayReviewForm(); // Reset to form after deletion
        } else {
            // console.error('Failed to delete review.');
        }
    } catch (error) {
        // console.error('Error:', error);
    }
}
