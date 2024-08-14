document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('auth-page') && window.location.pathname !== '/sunset_frontend/index.html' && window.location.pathname !== '/sunset_frontend/') {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
            });
    }
});

/* slideshow */
let slideIndex = 0;
let slideTimer;

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    // Set the timer to change the slide every 10 seconds
    slideTimer = setTimeout(showSlides, 10000); 
}

function plusSlides(n) {
    // Clear the existing timer to reset it
    clearTimeout(slideTimer);
    // Adjust the slide index
    slideIndex += n - 1;
    // Show the next slide
    showSlides();
}

// Initialize the slideshow
showSlides();