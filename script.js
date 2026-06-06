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

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const navLinks = document.querySelectorAll('.nav-container a');
    const productsTitle = document.getElementById('productos-title');
    const productsSection = document.getElementById('productos');
    const sortSelect = document.getElementById('sort-select');
    const paginationControls = document.getElementById('pagination-controls');

    // Estado de Paginación
    let currentProducts = [];
    let currentPage = 1;
    const itemsPerPage = 100;

    // Función para manejar el array actual de productos
    function setProducts(productosArray) {
        currentProducts = [...productosArray];
        aplicarOrdenamiento();
        currentPage = 1;
        renderCurrentPage();
    }

    // Aplicar filtro de ordenamiento
    function aplicarOrdenamiento() {
        if(!sortSelect) return;
        const sortBy = sortSelect.value;
        if(sortBy === 'price-asc') {
            currentProducts.sort((a, b) => a.price - b.price);
        } else if(sortBy === 'price-desc') {
            currentProducts.sort((a, b) => b.price - a.price);
        } else {
            // Default: ordenar por ID (relevancia original)
            currentProducts.sort((a, b) => a.id - b.id);
        }
    }

    if(sortSelect) {
        sortSelect.addEventListener('change', () => {
            aplicarOrdenamiento();
            currentPage = 1;
            renderCurrentPage();
        });
    }

    // Dibujar página actual
    function renderCurrentPage() {
        if(!productsGrid) return;
        productsGrid.innerHTML = ''; 

        if(currentProducts.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 18px; color: #666;">No se encontraron productos en esta categoría.</p>';
            if(paginationControls) paginationControls.innerHTML = '';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = currentProducts.slice(startIndex, endIndex);

        let html = '';
        productsToShow.forEach(prod => {
            html += `
            <div class="product-card" data-id="${prod.id}">
                <div class="product-image"><img src="${prod.image}" alt="${prod.name}"></div>
                <div class="product-info">
                    <h3>${prod.name}</h3>
                    <p class="price">$${prod.price.toLocaleString('es-CL')}</p>
                    <div style="display: flex; gap: 10px; margin-top: auto; margin-bottom: 10px; align-items: center;">
                        <label style="font-size: 12px; color: #555; font-weight: bold;">CANT:</label>
                        <input type="number" class="product-qty" min="1" max="50" value="1" style="width: 60px; padding: 5px; border-radius: 4px; border: 1px solid #ccc; outline: none;">
                    </div>
                    <button class="add-to-cart-btn">Agregar al carro</button>
                </div>
            </div>`;
        });
        productsGrid.innerHTML = html;
        renderPagination();
    }

    // Dibujar controles de paginación
    function renderPagination() {
        if(!paginationControls) return;
        const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
        
        if(totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        let html = `
            <button id="prev-page" class="checkout-btn" style="padding: 10px 20px; font-size: 14px;" ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                <i class="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <span style="font-family: 'Open Sans', sans-serif; font-weight: bold; color: #333;">
                Página ${currentPage} de ${totalPages}
            </span>
            <button id="next-page" class="checkout-btn" style="padding: 10px 20px; font-size: 14px;" ${currentPage === totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                Siguiente <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
        paginationControls.innerHTML = html;

        // Añadir eventos a los botones
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if(prevBtn && currentPage > 1) {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderCurrentPage();
                scrollToProducts();
            });
        }
        
        if(nextBtn && currentPage < totalPages) {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                renderCurrentPage();
                scrollToProducts();
            });
        }
    }

    function scrollToProducts() {
        if (productsSection) {
            const headerOffset = 100;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }

    // Inicializar con PROMOCIONES
    const iniciales = catalogoProductos.filter(p => p.category === 'PROMOCIONES');
    setProducts(iniciales.length ? iniciales : catalogoProductos);

    // Navegación por categorías
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Si es un enlace de acción (como scroll al PDF), no filtramos productos
            const action = this.getAttribute('data-action');
            if (action === 'scroll') {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
                return;
            }

            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            if (category === 'PROMOCIONES') {
                productsTitle.textContent = 'NUESTROS PRODUCTOS DESTACADOS';
            } else if (category === 'TODOS') {
                productsTitle.textContent = 'TODOS LOS PRODUCTOS';
            } else {
                productsTitle.textContent = 'PRODUCTOS: ' + category;
            }

            let filtrados;
            if (category === 'TODOS') {
                filtrados = catalogoProductos;
            } else {
                filtrados = catalogoProductos.filter(p => p.category === category);
            }
            setProducts(filtrados);

            // Limpiar buscador si se navega
            if(searchInput) searchInput.value = '';
            
            scrollToProducts();
        });
    });

    // Búsqueda Inteligente
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if(query === '') {
            const activeLink = document.querySelector('.nav-container a.active');
            if(activeLink) {
                activeLink.click();
            } else {
                setProducts(catalogoProductos);
                productsTitle.textContent = 'TODOS LOS PRODUCTOS';
            }
            return;
        }

        const resultados = catalogoProductos.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
        setProducts(resultados);
        productsTitle.textContent = 'RESULTADOS PARA: "' + query.toUpperCase() + '"';
        
        navLinks.forEach(nav => nav.classList.remove('active'));
        scrollToProducts();
    }

    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); performSearch(); }
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => { e.preventDefault(); performSearch(); });
    }

    // --- Funcionalidad del Carrito ---
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const openCartBtn = document.getElementById('open-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    function openCart() { cartModal.classList.remove('hidden'); renderCart(); }
    function closeCart() { cartModal.classList.add('hidden'); }

    if(openCartBtn) openCartBtn.addEventListener('click', openCart);
    if(cartIconBtn) cartIconBtn.addEventListener('click', openCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

    // Event Delegation para "Añadir al carrito" y validación de input (ya que los elementos se crean dinámicamente)
    if(productsGrid) {
        // Prevenir que escriban números fuera del rango mientras escriben
        productsGrid.addEventListener('input', (e) => {
            if(e.target.classList.contains('product-qty')) {
                let val = parseInt(e.target.value);
                if(val > 50) e.target.value = 50;
                if(val < 1) e.target.value = 1;
            }
        });

        productsGrid.addEventListener('click', (e) => {
            if(e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const card = btn.closest('.product-card');
                const id = parseInt(card.getAttribute('data-id'));
                const qtyInput = card.querySelector('.product-qty');
                
                let quantity = parseInt(qtyInput.value);
                if(isNaN(quantity) || quantity < 1) quantity = 1;
                if(quantity > 50) { alert('Máximo 50 unidades por producto.'); quantity = 50; qtyInput.value = 50; }

                const productoSeleccionado = catalogoProductos.find(p => p.id === id);
                
                const existingItem = carrito.find(item => item.id === id);
                if(existingItem) {
                    existingItem.quantity += quantity;
                    if(existingItem.quantity > 50) existingItem.quantity = 50;
                } else {
                    carrito.push({ ...productoSeleccionado, quantity: quantity });
                }

                saveCart();
                renderCart();

                btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
                setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar'; }, 1000);
            }
        });
    }

    function saveCart() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = carrito.reduce((acc, item) => acc + item.quantity, 0);
        if(cartCountSpan) { cartCountSpan.textContent = totalItems; }
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
            if(carrito.length === 0) { alert('El carrito está vacío.'); return; }
            
            const nameInput = document.getElementById('customer-name');
            const addressInput = document.getElementById('customer-address');
            
            if(!nameInput.value || !addressInput.value) { alert('Por favor, ingresa tu nombre y dirección para despachar el pedido.'); return; }
            
            const total = carrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            const newOrder = {
                id: 'ORD-' + Math.floor(Math.random() * 10000),
                date: new Date().toLocaleString('es-CL'),
                customerName: nameInput.value,
                customerAddress: addressInput.value,
                items: carrito,
                total: total
            };
            
            const pedidos = JSON.parse(localStorage.getItem('pedidosPendientes')) || [];
            pedidos.push(newOrder);
            localStorage.setItem('pedidosPendientes', JSON.stringify(pedidos));
            
            carrito = [];
            saveCart();
            renderCart();
            nameInput.value = '';
            addressInput.value = '';
            closeCart();
            alert('¡Compra finalizada con éxito! Tu pedido ha sido enviado.');
        });
    }

    updateCartCount();
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
