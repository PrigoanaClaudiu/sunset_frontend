document.addEventListener("DOMContentLoaded", function() {
    loadReviewSection();
});

async function loadReviewSection() {
    const token = localStorage.getItem('token');
    const reviewSection = document.getElementById('review-section');

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
                // User does not have a review, display the form
                displayReviewForm();
            } else {
                throw new Error('Failed to fetch user review.');
            }
        } catch (error) {
            console.error('Error fetching review:', error);
            reviewSection.innerHTML = '<p>Eroare la încărcarea recenziei.</p>';
        }
    } else {
        reviewSection.innerHTML = `
            <p>Autentifica-te pentru a ne lasa un review!</p>
            <a href="./pages/login.html" class="auth-link">AUTENTIFICARE</a>
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
        <div class="user-review">
            <h3>Recenzia ta</h3>
            <p>${review.content}</p>
            <p>Rating: ${generateStarRating(review.rating)}</p>
            <button onclick="editReview(${review.id})">Modifica</button>
            <button onclick="deleteReview(${review.id})">Sterge</button>
        </div>
    `;
}

function displayReviewForm() {
    const reviewSection = document.getElementById('review-section');

    reviewSection.innerHTML = `
        <h3>Lasa un review</h3>
        <form id="reviewForm">
            <textarea id="reviewContent" placeholder="Scrie recenzia ta..." required></textarea>
            <div id="rating-container">
                ${generateStarInputs(0)}
            </div>
            <button type="submit">Trimite</button>
        </form>
        <p id="error-message" style="display:none; color:red;"></p>
    `;

    document.getElementById('reviewForm').addEventListener('submit', submitReview);
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
            <input type="radio" name="rating" value="${i}" id="star${i}" ${i === selectedRating ? 'checked' : ''}>
            <label for="star${i}">★</label>
        `;
    }
    return starInputs;
}

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
        console.error('Error:', error);
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
            console.error('Failed to fetch the review for editing.');
        }
    } catch (error) {
        console.error('Error:', error);
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
        console.error('Error:', error);
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
            console.error('Failed to delete review.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
