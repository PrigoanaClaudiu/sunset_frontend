function loadHeader() {
    let headerPath = '';
    if (window.location.pathname.includes('/pages/')) {
        headerPath = '/sunset_frontend/pages/header.html';
    } else {
        headerPath = '/sunset_frontend/pages/header.html';
    }

    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}


// document.addEventListener('DOMContentLoaded', function () {
//     if (!document.getElementById('auth-page')) {
//         fetch('header.html')
//             .then(response => response.text())
//             .then(data => {
//                 document.body.insertAdjacentHTML('afterbegin', data);
//             });
//     }
// });
/* slideshow */
let slideIndex = 1;
let slideTimer;
function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    if (slideIndex < 1) {
        slideIndex = slides.length;
    }
    slides[slideIndex - 1].style.display = "block";
    
    slideTimer = setTimeout(() => {
        slideIndex++;
        showSlides();
    }, 5000); 
}
function plusSlides(n) {
    clearTimeout(slideTimer);
    slideIndex += n;
    showSlides();
}
document.addEventListener('DOMContentLoaded', function() {
    showSlides();
});
// facility - about page
const facilityImages = [
    "../images/ciubar.jpeg",
    "../images/piscina.jpg",
    "../images/bucatarie.jpeg",
    "../images/gratar.jpg"
];
let currentIndex = 0;
let autoChange = true;
let imageInterval;
function changeImage() {
    const facilityImg = document.getElementById('facility-img');
    
    if (autoChange) {
        facilityImg.setAttribute('src', facilityImages[currentIndex]);
        facilityImg.style.objectFit = "cover";  
        currentIndex = (currentIndex + 1) % facilityImages.length; 
    }
}
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('about.html')) {
        const facilityImg = document.getElementById('facility-img');
        facilityImg.setAttribute('src', facilityImages[currentIndex]);
        facilityImg.style.objectFit = "cover";
        imageInterval = setInterval(changeImage, 3000);
    }
});
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