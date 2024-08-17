document.addEventListener('DOMContentLoaded', function () {
    updateAuthButton(); // Actualizează butonul imediat ce pagina este încărcată
});

function updateAuthButton() {
    const authButton = document.querySelector('nav ul li a[href$="login.html"]');
    const token = localStorage.getItem('token');

    if (authButton && token) {
        authButton.textContent = "Deconectare";
        authButton.href = "#";
        authButton.addEventListener('click', function () {
            localStorage.removeItem('token');
            window.location.href = "../index.html";
        });
    } else if (authButton) {
        authButton.textContent = "Autentificare";
        authButton.href = "login.html";
    }
}

// Restul funcționalităților (slideshow, schimbare imagini etc.) rămân neschimbate


// Alte funcționalități existente în script.js, dacă sunt

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
    clearTimeout(slideTimer);
    slideIndex += n - 1;
    showSlides();
}

showSlides();

// facilities
const facilityImages = [
    "../images/ciubar.jpeg",
    "../images/piscina.jpg",
    "../images/bucatarie.jpeg",
    "../images/gratar.jpg"
];

let currentIndex = 0;
let autoChange = true;

function changeImage() {
    if (autoChange) {
        const facilityImg = document.getElementById('facility-img');
        facilityImg.setAttribute('src', facilityImages[currentIndex]);
        facilityImg.style.objectFit = "cover"; 
        currentIndex = (currentIndex + 1) % facilityImages.length;
    }
}

let imageInterval = setInterval(changeImage, 4000);

document.querySelectorAll('.facility-item').forEach(item => {
    item.addEventListener('click', function() {
        const newImage = this.getAttribute('data-image');
        const facilityImg = document.getElementById('facility-img');
        facilityImg.setAttribute('src', newImage);
        facilityImg.style.objectFit = "cover";
        autoChange = false;  
        clearInterval(imageInterval); 
    });
});

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/sunset_frontend/about.html') {
        changeImage();
    }
});
