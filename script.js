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

// --- Funcionalidad del Carrito de Compras ---
document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const openCartBtn = document.getElementById('open-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Toggle Modal
    function openCart() {
        cartModal.classList.remove('hidden');
        renderCart();
    }
    
    function closeCart() {
        cartModal.classList.add('hidden');
    }
    
    if(openCartBtn) openCartBtn.addEventListener('click', openCart);
    if(cartIconBtn) cartIconBtn.addEventListener('click', openCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    
    // Añadir al Carrito
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            // Limpiar precio (remover $ y puntos)
            const price = parseInt(priceText.replace('$', '').replace('.', ''));
            
            // Buscar si ya existe
            const existingItem = carrito.find(item => item.name === name);
            if(existingItem) {
                existingItem.quantity += 1;
            } else {
                carrito.push({ name, price, quantity: 1, id: Date.now() + index });
            }
            
            saveCart();
            renderCart();
            
            // Efecto visual (opcional)
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
            }, 1000);
        });
    });
    
    function saveCart() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        updateCartCount();
    }
    
    function updateCartCount() {
        const totalItems = carrito.reduce((acc, item) => acc + item.quantity, 0);
        if(cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    }
    
    window.removeFromCart = function(id) {
        carrito = carrito.filter(item => item.id !== id);
        saveCart();
        renderCart();
    };
    
    function renderCart() {
        if(carrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartTotalPrice.textContent = '$0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        carrito.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.quantity} x $${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        cartTotalPrice.textContent = '$' + total.toLocaleString('es-CL');
    }
    
    // Checkout
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            
            const nameInput = document.getElementById('customer-name');
            const addressInput = document.getElementById('customer-address');
            
            if(!nameInput.value || !addressInput.value) {
                alert('Por favor, ingresa tu nombre y dirección para despachar el pedido.');
                return;
            }
            
            const total = carrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            const newOrder = {
                id: 'ORD-' + Math.floor(Math.random() * 10000),
                date: new Date().toLocaleString('es-CL'),
                customerName: nameInput.value,
                customerAddress: addressInput.value,
                items: carrito,
                total: total
            };
            
            // Guardar en pedidosPendientes
            const pedidos = JSON.parse(localStorage.getItem('pedidosPendientes')) || [];
            pedidos.push(newOrder);
            localStorage.setItem('pedidosPendientes', JSON.stringify(pedidos));
            
            // Limpiar Carrito
            carrito = [];
            saveCart();
            renderCart();
            
            // Limpiar form
            nameInput.value = '';
            addressInput.value = '';
            
            closeCart();
            alert('¡Compra finalizada con éxito! Tu pedido ha sido enviado.');
        });
    }
    
    // Initialize count on load
    updateCartCount();
});

// --- Funcionalidad de Búsqueda Inteligente ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productsSection = document.getElementById('productos');
    const productsTitle = document.getElementById('productos-title');

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        let hasResults = false;

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            
            if (productName.includes(query)) {
                card.style.display = 'flex';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Actualizar título de la sección
        if (query === '') {
            productsTitle.textContent = 'NUESTROS PRODUCTOS DESTACADOS';
        } else if (hasResults) {
            productsTitle.textContent = 'RESULTADOS PARA: "' + query.toUpperCase() + '"';
        } else {
            productsTitle.textContent = 'NO SE ENCONTRARON RESULTADOS PARA: "' + query.toUpperCase() + '"';
        }

        // Hacer scroll suave hacia los productos si el usuario busca algo
        if (query !== '' && productsSection) {
            const headerOffset = 100;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }

    if (searchInput) {
        // Buscar mientras se escribe (búsqueda en vivo)
        searchInput.addEventListener('input', performSearch);
        
        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    if (searchBtn) {
        // Buscar al hacer clic en el botón de lupa
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
});

// --- Funcionalidad de Login Administrativo ---
document.addEventListener('DOMContentLoaded', () => {
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.getElementById('close-login-btn');
    const submitLoginBtn = document.getElementById('submit-login-btn');
    const loginUser = document.getElementById('login-user');
    const loginPass = document.getElementById('login-pass');
    const loginError = document.getElementById('login-error');

    if (adminLoginBtn && loginModal) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('hidden');
            loginUser.value = '';
            loginPass.value = '';
            loginError.style.display = 'none';
        });

        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
        });

        submitLoginBtn.addEventListener('click', () => {
            const user = loginUser.value.trim();
            const pass = loginPass.value.trim();

            if (user === 'eleodoro' && pass === '123456') {
                // Credenciales correctas, redirigir a pedidos.html
                window.location.href = 'pedidos.html';
            } else {
                // Credenciales incorrectas
                loginError.style.display = 'block';
            }
        });

        // Permitir Enter para iniciar sesión
        loginPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitLoginBtn.click();
            }
        });
    }
});
