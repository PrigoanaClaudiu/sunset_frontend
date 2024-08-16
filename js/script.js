document.addEventListener('DOMContentLoaded', function () {
    // Încărcarea header-ului pe paginile care nu sunt index.html sau pagina principală
    if (!document.getElementById('auth-page') && window.location.pathname !== '/sunset_frontend/index.html' && window.location.pathname !== '/sunset_frontend/') {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
            });
    }

    // slideshow
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
        if (slideIndex > slides.length) { slideIndex = 1 }
        slides[slideIndex - 1].style.display = "block";
        slideTimer = setTimeout(showSlides, 5000);
    }

    function plusSlides(n) {
        clearTimeout(slideTimer);
        slideIndex += n;
        if (slideIndex > document.getElementsByClassName("mySlides").length) { slideIndex = 1 }
        if (slideIndex < 1) { slideIndex = document.getElementsByClassName("mySlides").length }
        showSlides();
    }

    // Inițializează slideshow-ul doar dacă există elemente cu clasa "mySlides"
    if (document.getElementsByClassName("mySlides").length > 0) {
        showSlides();
    }

    // facilities page
    if (document.getElementById('facility-img') && window.location.pathname === '/sunset_frontend/about.html') {
        const facilityImages = [
            "../images/ciubar.jpeg",
            "../images/piscina.jpg",
            "../images/bucatarie.jpeg",
            "../images/gratar.jpg"
        ];

        let currentIndex = 0;
        let autoChange = true;

        function changeImage() {
            const facilityImg = document.getElementById('facility-img');
            if (!facilityImg) return; // Întrerupe dacă elementul nu există

            if (autoChange) {
                facilityImg.setAttribute('src', facilityImages[currentIndex]);
                facilityImg.style.objectFit = "cover";  // Asigură că imaginea se redimensionează corect
                currentIndex = (currentIndex + 1) % facilityImages.length;
            }
        }

        // Setează prima imagine imediat după încărcarea paginii
        const facilityImg = document.getElementById('facility-img');
        if (facilityImg) {
            facilityImg.setAttribute('src', facilityImages[0]);
            facilityImg.style.objectFit = "cover";
        }

        let imageInterval = setInterval(changeImage, 4000);

        // Oprește rotația și setează o imagine la selectarea unei opțiuni
        document.querySelectorAll('.facility-item').forEach(item => {
            item.addEventListener('click', function () {
                const newImage = this.getAttribute('data-image');
                facilityImg.setAttribute('src', newImage);
                facilityImg.style.objectFit = "cover";
                autoChange = false;
                clearInterval(imageInterval);
            });
        });

        // Inițializează schimbarea automată a imaginilor
        changeImage();
    }