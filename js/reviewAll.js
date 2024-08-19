let currentPage = 1;
let reviewsPerPage = 6;

document.addEventListener("DOMContentLoaded", function() {
    loadReviews();
    setupFilterButtons();
});

async function loadReviews(rating = null, page = 1) {
    const response = await fetch(`/reviews?rating=${rating || ''}`);
    const reviews = await response.json();
    const start = (page - 1) * reviewsPerPage;
    const paginatedReviews = reviews.slice(start, start + reviewsPerPage);
    displayReviews(paginatedReviews);
}

function displayReviews(reviews) {
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

    setupNavigationButtons(reviews.length);
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
