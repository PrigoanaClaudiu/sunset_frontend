document.addEventListener('DOMContentLoaded', function () {
    // Determină calea corectă către header.html în funcție de locația paginii curente
    let path = window.location.pathname.includes('index.html') ? './pages/header.html' : '../pages/header.html';
    
    // Încarcă header-ul dinamic
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            updateAuthButton(); // Actualizează butonul după ce header-ul este adăugat
        })
        .catch(error => console.error('Error loading header:', error));
});

function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    const token = localStorage.getItem('token');

    if (authButton && token) {
        authButton.textContent = "Deconectare";
        authButton.href = "#";
        authButton.addEventListener('click', function () {
            localStorage.removeItem('token');
            window.location.href = "index.html"; // Redirecționează la index.html
        });
    } else if (authButton) {
        authButton.textContent = "Autentificare";
        authButton.href = "login.html";
    }
}

// Funcționalitatea pentru slideshow
let slideIndex = 0;
let slideTimer;

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    
    if (slides.length === 0) return;
    
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

// Funcționalitatea pentru schimbarea imaginilor la facilități
const facilityImages = [
    "./images/ciubar.jpeg",
    "./images/piscina.jpg",
    "./images/bucatarie.jpeg",
    "./images/gratar.jpg"
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
