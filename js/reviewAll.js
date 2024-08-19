let currentPage = 1;
let reviewsPerPage = 6;

document.addEventListener("DOMContentLoaded", function() {
    loadReviews();  // Încarcă toate review-urile inițial
    setupFilterButtons();
});

async function loadReviews(rating = null, page = 1) {
    // Folosește URL-ul complet către API-ul de pe Heroku, adăugând rating-ul dacă este specificat
    let apiUrl = `https://fastapi-prigoana-eb60b2d64bc2.herokuapp.com/reviews`;
    if (rating) {
        apiUrl += `?rating=${rating}`;
    }
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reviews = await response.json();
        const start = (page - 1) * reviewsPerPage;
        const paginatedReviews = reviews.slice(start, start + reviewsPerPage);
        displayReviews(paginatedReviews, reviews.length);
    } catch (error) {
        console.error('Failed to load reviews:', error);
    }
}

function displayReviews(reviews, totalReviews) {
    const reviewsGrid = document.getElementById('reviews-grid');
    reviewsGrid.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review-item-small');
        reviewElement.innerHTML = `
            <h4>${review.owner.username}</h4>
            <p>${review.content}</p>
            <div class="rating-stars">${generateStarRating(review.rating)}</div>
        `;
        reviewsGrid.appendChild(reviewElement);
    });

    setupNavigationButtons(totalReviews);
}

function setupNavigationButtons(totalReviews) {
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    document.getElementById('prev-button').style.display = currentPage > 1 ? 'block' : 'none';
    document.getElementById('next-button').style.display = currentPage < totalPages ? 'block' : 'none';

    document.getElementById('prev-button').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadReviews(null, currentPage);
        }
    };

    document.getElementById('next-button').onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadReviews(null, currentPage);
        }
    };
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', () => {
            const rating = button.dataset.rating === 'all' ? null : button.dataset.rating;
            currentPage = 1;  // Reset to first page on filter change
            loadReviews(rating, currentPage);
        });
    });
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}
