document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('auth-page')) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
            });
    }
});

/* slideshow */
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 4000); // Change image every 4 seconds
}

function plusSlides(n) {
    slideIndex += n - 1;
    showSlides();
}
