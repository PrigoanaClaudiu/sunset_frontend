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
    
    if (slides.length === 0) return;  // Oprește funcția dacă nu există elemente cu clasa "mySlides"
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    slideTimer = setTimeout(showSlides, 5000); 
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

const facilityImages = [
    "../images/ciubar.jpeg",
    "../images/piscina.jpg"
];


// about page - facilities
let currentIndex = 0;
let autoChange = true;

function changeImage() {
    if (autoChange) {
        document.getElementById('facility-img').setAttribute('src', facilityImages[currentIndex]);
        currentIndex = (currentIndex + 1) % facilityImages.length;
    }
}

// changing interval
let imageInterval = setInterval(changeImage, 5000);

document.querySelectorAll('.facility-item').forEach(item => {
    item.addEventListener('click', function() {
        const newImage = this.getAttribute('data-image');
        console.log("Setting image to:", newImage);  // Verifică în consolă calea imaginii
        document.getElementById('facility-img').setAttribute('src', newImage);
        autoChange = false; 
        clearInterval(imageInterval);
    });
});

