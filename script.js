document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dots = Array.from(document.getElementById('sliderDots').children);

    let currentIndex = 0;
    let autoPlayInterval;

    // Ajustar el ancho del track y los slides dinámicamente
    const numSlides = slides.length;
    track.style.width = `${numSlides * 100}%`;
    slides.forEach(slide => {
        slide.style.width = `${100 / numSlides}%`;
    });

    function updateSlider() {
        const slideWidth = 100 / numSlides;
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Start auto slide
    startAutoPlay();
    
    // Pause on hover
    track.parentElement.addEventListener('mouseenter', stopAutoPlay);
    track.parentElement.addEventListener('mouseleave', startAutoPlay);
});

// Global function for branch selection
function selectBranch(branchName) {
    // Hide the overlay
    const overlay = document.getElementById('branch-selector');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    // Optional: save to localStorage or show an alert/toast
    console.log('Sucursal seleccionada: ' + branchName);
}

// Menu Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-container a');
    const productsTitle = document.getElementById('productos-title');
    const productsSection = document.getElementById('productos');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get category
            const category = this.getAttribute('data-category');
            
            // Update title
            if (category === 'PROMOCIONES') {
                productsTitle.textContent = 'NUESTROS PRODUCTOS DESTACADOS';
            } else {
                productsTitle.textContent = 'PRODUCTOS: ' + category;
            }
            
            // Smooth scroll to products section
            if (productsSection) {
                const headerOffset = 100; // Account for sticky header if any
                const elementPosition = productsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
