// review.js

document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem('token');
    const reviewContainer = document.getElementById('review-section');

    if (token) {
        // User is authenticated, fetch their review
        const userReview = await getUserReview(token);

        if (userReview) {
            displayUserReview(userReview);
        } else {
            displayReviewForm();
        }
    } else {
        // User is not authenticated, show login prompt
        displayAuthMessage();
    }
});

// Function to fetch user review
async function getUserReview(token) {
    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const reviews = await response.json();
            return reviews.length ? reviews[0] : null;
        } else {
            console.error('Failed to fetch review');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display user's review with options to delete or edit
function displayUserReview(review) {
    const reviewContainer = document.getElementById('review-section');
    reviewContainer.innerHTML = `
        <div class="review-item">
            <h3>Review-ul tău</h3>
            <div class="rating-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p>${review.content}</p>
            <div class="review-buttons">
                <button onclick="deleteReview(${review.id})">Șterge</button>
                <button onclick="editReview(${review.id})">Modifică</button>
            </div>
        </div>
    `;
}

// Function to display review form if no review exists
function displayReviewForm() {
    const reviewContainer = document.getElementById('review-section');
    reviewContainer.innerHTML = `
        <form id="review-form">
            <label for="review-content">Scrie un review:</label>
            <textarea id="review-content" rows="4" required></textarea>
            <div class="rating-stars">
                <span data-value="1">☆</span>
                <span data-value="2">☆</span>
                <span data-value="3">☆</span>
                <span data-value="4">☆</span>
                <span data-value="5">☆</span>
            </div>
            <input type="hidden" id="review-rating" value="0">
            <button type="submit">Trimite</button>
        </form>
    `;

    document.querySelectorAll('.rating-stars span').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-value');
            document.getElementById('review-rating').value = rating;
            updateStarDisplay(rating);
        });
    });

    document.getElementById('review-form').addEventListener('submit', submitReview);
}

// Function to update star display
function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating-stars span');
    stars.forEach(star => {
        star.textContent = star.getAttribute('data-value') <= rating ? '★' : '☆';
    });
}

// Function to submit a new review
async function submitReview(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    const content = document.getElementById('review-content').value;
    const rating = document.getElementById('review-rating').value;

    try {
        const response = await fetch('https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, rating })
        });

        if (response.ok) {
            const newReview = await response.json();
            displayUserReview(newReview);
        } else {
            console.error('Failed to submit review');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete a review
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
            displayReviewForm();  // Show form again after deletion
        } else {
            console.error('Failed to delete review');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to edit a review
function editReview(id) {
    const reviewContainer = document.getElementById('review-section');
    const currentContent = document.querySelector('.review-item p').textContent;
    const currentRating = document.querySelectorAll('.rating-stars span').length;

    reviewContainer.innerHTML = `
        <form id="review-form">
            <label for="review-content">Modifică review-ul:</label>
            <textarea id="review-content" rows="4" required>${currentContent}</textarea>
            <div class="rating-stars">
                <span data-value="1">☆</span>
                <span data-value="2">☆</span>
                <span data-value="3">☆</span>
                <span data-value="4">☆</span>
                <span data-value="5">☆</span>
            </div>
            <input type="hidden" id="review-rating" value="${currentRating}">
            <button type="submit">Actualizează</button>
        </form>
    `;

    updateStarDisplay(currentRating);

    document.querySelectorAll('.rating-stars span').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-value');
            document.getElementById('review-rating').value = rating;
            updateStarDisplay(rating);
        });
    });

    document.getElementById('review-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submitUpdatedReview(id);
    });
}

// Function to submit an updated review
async function submitUpdatedReview(id) {
    const token = localStorage.getItem('token');
    const content = document.getElementById('review-content').value;
    const rating = document.getElementById('review-rating').value;

    try {
        const response = await fetch(`https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, rating })
        });

        if (response.ok) {
            const updatedReview = await response.json();
            displayUserReview(updatedReview);
        } else {
            console.error('Failed to update review');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display login prompt for unauthenticated users
function displayAuthMessage() {
    const reviewContainer = document.getElementById('review-section');
    reviewContainer.innerHTML = `
        <p id="auth-message">Autentifică-te pentru a ne lăsa un review! <a href="/sunset_frontend/pages/login.html">Autentificare</a></p>
    `;
}
