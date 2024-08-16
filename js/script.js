// document.addEventListener('DOMContentLoaded', function () {
//     if (!document.getElementById('auth-page') && window.location.pathname !== '/sunset_frontend/index.html' && window.location.pathname !== '/sunset_frontend/') {
//         fetch('header.html')
//             .then(response => response.text())
//             .then(data => {
//                 document.body.insertAdjacentHTML('afterbegin', data);
//             });
//     }
// });

// /* slideshow */
// let slideIndex = 0;
// let slideTimer;

// function showSlides() {
//     let i;
//     let slides = document.getElementsByClassName("mySlides");
    
//     if (slides.length === 0) return;  // Oprește funcția dacă nu există elemente cu clasa "mySlides"
    
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";  
//     }
//     slideIndex++;
//     if (slideIndex > slides.length) {slideIndex = 1}    
//     slides[slideIndex-1].style.display = "block";  
//     slideTimer = setTimeout(showSlides, 5000); 
// }

// function plusSlides(n) {
//     // Clear the existing timer to reset it
//     clearTimeout(slideTimer);
//     // Adjust the slide index
//     slideIndex += n - 1;
//     // Show the next slide
//     showSlides();
// }

// // Initialize the slideshow
// showSlides();


// // facilities
// const facilityImages = [
//     "../images/ciubar.jpeg",
//     "../images/piscina.jpg",
//     "../images/bucatarie.jpeg",
//     "../images/gratar.jpg"
// ];



// let currentIndex = 0;
// let autoChange = true;

// function changeImage() {
//     if (autoChange) {
//         const facilityImg = document.getElementById('facility-img');
//         facilityImg.setAttribute('src', facilityImages[currentIndex]);
//         facilityImg.style.objectFit = "cover";  // asigura ca img se redimensioneaza corect
//         currentIndex = (currentIndex + 1) % facilityImages.length;
//     }
// }

// let imageInterval = setInterval(changeImage, 4000);

// // opreste rotatia si seteaza o imagine la selectarea unei obtiuni
// document.querySelectorAll('.facility-item').forEach(item => {
//     item.addEventListener('click', function() {
//         const newImage = this.getAttribute('data-image');
//         const facilityImg = document.getElementById('facility-img');
//         facilityImg.setAttribute('src', newImage);
//         facilityImg.style.objectFit = "cover";  // asigura ca img e corect redimensionata
//         autoChange = false;  
//         clearInterval(imageInterval);  // opreste intervalul de schimbare automat
//     });
// });

// // Inițializează schimbarea automată a imaginilor
// changeImage();


// // photo page
// // Funcționalitate de deschidere a secțiunilor
// document.querySelectorAll('.gallery-item').forEach(item => {
//     item.addEventListener('click', function() {
//         const sectionId = this.getAttribute('data-section');
//         const section = document.getElementById(sectionId);

//         // Verifică dacă secțiunea este deja deschisă
//         const isOpen = section.style.display === 'block';

//         // Închide toate secțiunile deschise
//         document.querySelectorAll('.expanded-gallery').forEach(gallery => {
//             gallery.style.display = 'none';
//         });

//         // Deschide secțiunea selectată dacă nu era deja deschisă
//         if (!isOpen) {
//             section.style.display = 'block';
//         }
//     });
// });


// // photo page - gallery
// if (window.location.pathname === '/sunset_frontend/photos.html') {
//     document.querySelectorAll('.gallery-item').forEach(item => {
//         item.addEventListener('click', function() {
//             const sectionId = this.getAttribute('data-section');
//             const section = document.getElementById(sectionId);

//             // Verifică dacă secțiunea este deja deschisă
//             const isOpen = section.style.display === 'block';

//             // Închide toate secțiunile deschise
//             document.querySelectorAll('.expanded-gallery').forEach(gallery => {
//                 gallery.style.display = 'none';
//             });

//             // Deschide secțiunea selectată dacă nu era deja deschisă
//             if (!isOpen) {
//                 section.style.display = 'block';
//             }
//         });
//     });

//     // Funcționalitate de mărire a imaginilor
//     document.querySelectorAll('.expanded-gallery-grid img').forEach(img => {
//         img.addEventListener('click', function() {
//             const modal = document.createElement('div');
//             modal.classList.add('image-modal');
//             modal.innerHTML = `
//                 <div class="image-modal-content">
//                     <span class="close">&times;</span>
//                     <img src="${this.src}" alt="${this.alt}">
//                 </div>
//             `;

//             document.body.appendChild(modal);

//             modal.querySelector('.close').addEventListener('click', () => {
//                 document.body.removeChild(modal);
//             });
//             modal.addEventListener('click', () => {
//                 document.body.removeChild(modal);
//             });
//         });
//     });
// }
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
        // Clear the existing timer to reset it
        clearTimeout(slideTimer);
        // Adjust the slide index
        slideIndex += n - 1;
        // Show the next slide
        showSlides();
    }

    // Initialize the slideshow
    showSlides();


    // facilities page
    if (document.getElementById('facility-img')) {
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

        let imageInterval = setInterval(changeImage, 4000);

        // Oprește rotația și setează o imagine la selectarea unei opțiuni
        document.querySelectorAll('.facility-item').forEach(item => {
            item.addEventListener('click', function () {
                const newImage = this.getAttribute('data-image');
                const facilityImg = document.getElementById('facility-img');
                if (facilityImg) {
                    facilityImg.setAttribute('src', newImage);
                    facilityImg.style.objectFit = "cover";
                    autoChange = false;
                    clearInterval(imageInterval);
                }
            });
        });

        // Inițializează schimbarea automată a imaginilor
        changeImage();
    }


    // photo page - gallery
    if (window.location.pathname === '/sunset_frontend/photos.html') {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function () {
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId);

                // Verifică dacă secțiunea este deja deschisă
                const isOpen = section.style.display === 'block';

                // Închide toate secțiunile deschise
                document.querySelectorAll('.expanded-gallery').forEach(gallery => {
                    gallery.style.display = 'none';
                });

                // Deschide secțiunea selectată dacă nu era deja deschisă
                if (!isOpen) {
                    section.style.display = 'block';
                }
            });
        });

        // Funcționalitate de mărire a imaginilor
        document.querySelectorAll('.expanded-gallery-grid img').forEach(img => {
            img.addEventListener('click', function () {
                const modal = document.createElement('div');
                modal.classList.add('image-modal');
                modal.innerHTML = `
                    <div class="image-modal-content">
                        <span class="close">&times;</span>
                        <img src="${this.src}" alt="${this.alt}">
                    </div>
                `;

                document.body.appendChild(modal);

                modal.querySelector('.close').addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
                modal.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
            });
        });
    }
});


