let updateBranchMenu = null;
let baseCatalogo = [];
let setProducts = null;
let scrollToProducts = null;
let carrito = [];
let saveCart = null;
let renderCart = null;
let selectedBranchName = null;

// Global variables for slider
let originalSlides = null;
let autoPlayInterval = null;
let currentSliderIndex = 0;
let sliderTrack = null;
let sliderSlides = [];
let sliderDots = [];
let numSlides = 0;

function updateSlider() {
    if (!sliderTrack || numSlides === 0) return;
    const slideWidth = 100 / numSlides;
    sliderTrack.style.transform = `translateX(-${currentSliderIndex * slideWidth}%)`;
    
    sliderDots.forEach((dot, index) => {
        if (index === currentSliderIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    sliderSlides.forEach((slide, index) => {
        const video = slide.querySelector('video.slider-video');
        if (video) {
            if (index === currentSliderIndex) {
                const dataSrc = video.getAttribute('data-src');
                if (dataSrc && !video.src) {
                    video.src = dataSrc;
                    video.load();
                }
                video.play().catch(err => console.log("Autoplay slider video prevented:", err));
            } else {
                video.pause();
            }
        }
    });
}

function nextSlide() {
    if (numSlides === 0) return;
    currentSliderIndex = (currentSliderIndex + 1) % numSlides;
    updateSlider();
}

function prevSlide() {
    if (numSlides === 0) return;
    currentSliderIndex = (currentSliderIndex - 1 + numSlides) % numSlides;
    updateSlider();
}

function startAutoPlay() {
    if (numSlides <= 1) return;
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

function initSlider(isCerroNavia) {
    sliderTrack = document.getElementById('sliderTrack');
    if (!sliderTrack) return;

    if (!originalSlides) {
        originalSlides = Array.from(sliderTrack.children);
    }

    stopAutoPlay();

    // Filter slides
    sliderSlides = originalSlides.filter(slide => {
        const isAlcohol = slide.getAttribute('data-alcohol') === 'true';
        return !(isCerroNavia && isAlcohol);
    });

    // Re-insert slides
    sliderTrack.innerHTML = '';
    sliderSlides.forEach(slide => sliderTrack.appendChild(slide));

    // Dynamic dots generation
    const dotsContainer = document.getElementById('sliderDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        sliderSlides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'dot active' : 'dot';
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                currentSliderIndex = i;
                updateSlider();
                stopAutoPlay();
                startAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        sliderDots = Array.from(dotsContainer.children);
    }

    currentSliderIndex = 0;
    numSlides = sliderSlides.length;

    sliderTrack.style.width = `${numSlides * 100}%`;
    sliderSlides.forEach(slide => {
        slide.style.width = `${100 / numSlides}%`;
    });

    updateSlider();
    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    updateBranchMenu = function(branchName) {
        const isCerroNavia = branchName === 'Cerro Navia';
        
        if (isCerroNavia) {
            baseCatalogo = catalogoProductos.filter(p => {
                if (!p) return false;
                const category = p.category ? p.category.trim().toUpperCase() : '';
                const name = p.name ? p.name.trim().toUpperCase() : '';
                
                const alcoholCategories = ['CERVEZA', 'CERVEZAS', 'LICORES', 'LICOR', 'PISCO', 'PISCOS', 'WHISKY', 'WHISKIES', 'RON', 'RONES', 'VODKA', 'VODKAS', 'GIN', 'GINS', 'TEQUILA', 'TEQUILAS', 'VINOS', 'VINO', 'ESPUMANTE', 'ESPUMANTES'];
                const alcoholKeywords = ['VINO', 'ESPUMANTE', 'CERVEZA', 'PISCO', 'RON', 'WHISKY', 'VODKA', 'GIN', 'LICOR', 'TEQUILA', 'ALCOHOL', 'CHAMPAGNE', 'CHAMPÁN', 'CHAMPAN', 'SIDRA', 'COCTEL', 'CÓCTEL', 'SANGRIA', 'SANGRÍA', 'MISTRAL', 'ALTO DEL CARMEN', 'CAPEL', 'CAMPARI', 'APEROL', 'FERNET', 'RAMAZZOTTI', 'JAGERMEISTER', 'JÄGERMEISTER', 'HEINEKEN', 'BUDWEISER', 'CORONA', 'CRISTAL', 'ESCUDO', 'ROYAL', 'KUNSTMANN', 'MADDERO', 'GORDONS', 'TANQUERAY', 'BUCHANAN', 'SANDY MAC', 'JOHNNIE', 'RED LABEL', 'BLACK LABEL', 'BALLANTINE', 'CHIVAS'];

                if (alcoholCategories.includes(category)) return false;
                if (alcoholKeywords.some(keyword => name.includes(keyword))) return false;
                
                return true;
            });

            // Eliminar productos de alcohol del carrito si cambiamos a Cerro Navia
            if (typeof carrito !== 'undefined') {
                const originalLength = carrito.length;
                carrito = carrito.filter(item => {
                    if (!item) return false;
                    const category = item.category ? item.category.trim().toUpperCase() : '';
                    const name = item.name ? item.name.trim().toUpperCase() : '';
                    
                    const alcoholCategories = ['CERVEZA', 'CERVEZAS', 'LICORES', 'LICOR', 'PISCO', 'PISCOS', 'WHISKY', 'WHISKIES', 'RON', 'RONES', 'VODKA', 'VODKAS', 'GIN', 'GINS', 'TEQUILA', 'TEQUILAS', 'VINOS', 'VINO', 'ESPUMANTE', 'ESPUMANTES'];
                    const alcoholKeywords = ['VINO', 'ESPUMANTE', 'CERVEZA', 'PISCO', 'RON', 'WHISKY', 'VODKA', 'GIN', 'LICOR', 'TEQUILA', 'ALCOHOL', 'CHAMPAGNE', 'CHAMPÁN', 'CHAMPAN', 'SIDRA', 'COCTEL', 'CÓCTEL', 'SANGRIA', 'SANGRÍA', 'MISTRAL', 'ALTO DEL CARMEN', 'CAPEL', 'CAMPARI', 'APEROL', 'FERNET', 'RAMAZZOTTI', 'JAGERMEISTER', 'JÄGERMEISTER', 'HEINEKEN', 'BUDWEISER', 'CORONA', 'CRISTAL', 'ESCUDO', 'ROYAL', 'KUNSTMANN', 'MADDERO', 'GORDONS', 'TANQUERAY', 'BUCHANAN', 'SANDY MAC', 'JOHNNIE', 'RED LABEL', 'BLACK LABEL', 'BALLANTINE', 'CHIVAS'];

                    if (alcoholCategories.includes(category)) return false;
                    if (alcoholKeywords.some(keyword => name.includes(keyword))) return false;
                    
                    return true;
                });
                if (carrito.length !== originalLength) {
                    if (typeof saveCart === 'function') saveCart();
                    if (typeof renderCart === 'function') renderCart();
                }
            }
        } else {
            baseCatalogo = catalogoProductos;
        }

        // Ocultar la barra de advertencia de alcohol si es Cerro Navia
        const warningBanner = document.getElementById('alcohol-warning-banner');
        if (warningBanner) {
            warningBanner.style.display = isCerroNavia ? 'none' : '';
        }

        // Reinicializar el slider para remover/mostrar slides de alcohol
        initSlider(isCerroNavia);
        
        // Ocultar categorías de alcohol en el navbar si es Cerro Navia
        const navLinks = document.querySelectorAll('.nav-container a');
        navLinks.forEach(link => {
            const cat = link.getAttribute('data-category');
            if (cat && ['CERVEZA', 'PISCO', 'WHISKY', 'RON', 'VODKA', 'GIN', 'TEQUILA', 'LICORES'].includes(cat)) {
                link.style.display = isCerroNavia ? 'none' : '';
            }
        });

        // Re-renderizar productos
        if (typeof setProducts === 'function') {
            setProducts(baseCatalogo);
            const productsTitle = document.getElementById('productos-title');
            if (productsTitle) productsTitle.textContent = 'TODOS LOS PRODUCTOS';
            
            navLinks.forEach(l => l.classList.remove('active'));
            const btnTodos = document.querySelector('.nav-container a[data-category="TODOS"]');
            if (btnTodos) btnTodos.classList.add('active');

            // Si es Cerro Navia, hacer scroll automático directamente hasta la sección de productos
            if (isCerroNavia) {
                setTimeout(() => {
                    if (typeof scrollToProducts === 'function') {
                        scrollToProducts();
                    }
                }, 150);
            }
        }
    };

    // --- Modal de Edad ---
    const ageModal = document.getElementById('age-modal');
    const btnAgeYes = document.getElementById('btn-age-yes');
    const btnAgeNo = document.getElementById('btn-age-no');
    const ageErrorMsg = document.getElementById('age-error-msg');

    if (ageModal) {
        // Ocultar por defecto al entrar
        ageModal.style.display = 'none'; 
        ageModal.classList.add('hidden');

        if (btnAgeYes) {
            btnAgeYes.addEventListener('click', () => {
                ageModal.style.display = 'none';
                ageModal.classList.add('hidden');
                
                // Cargar Laguna Sur tras verificar la edad
                if (typeof updateBranchMenu === 'function') {
                    updateBranchMenu('Laguna Sur');
                }
                console.log('Sucursal seleccionada tras verificación de edad: Laguna Sur');

                // Reproducir audio inmediatamente
                const audio = document.getElementById('bg-audio');
                if (audio) {
                    audio.play().catch(e => console.log('Autoplay blocked:', e));
                }
            });
        }
        if (btnAgeNo) {
            btnAgeNo.addEventListener('click', () => {
                if (ageErrorMsg) {
                    ageErrorMsg.style.display = 'block';
                }
            });
        }
    }

    // --- Modal de Sucursal (Home Principal) ---
    const branchSelector = document.getElementById('branch-selector');
    if (branchSelector) {
        branchSelector.classList.remove('hidden');
        branchSelector.style.display = 'flex'; 
    }

    // Iniciar Slider por defecto (sin filtro)
    initSlider(false);

    // Configurar listeners de botones del slider
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    const trackContainer = document.querySelector('.slider-section');
    if (trackContainer) {
        trackContainer.addEventListener('mouseenter', stopAutoPlay);
        trackContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Si ya se seleccionó una sucursal antes de que cargara el DOM, aplicarla ahora
    if (selectedBranchName === 'Cerro Navia') {
        updateBranchMenu('Cerro Navia');
    } else if (selectedBranchName === 'Laguna Sur') {
        if (ageModal) {
            ageModal.classList.remove('hidden');
            ageModal.style.display = 'flex';
        }
    }
});

// Global function for branch selection
function selectBranch(branchName) {
    selectedBranchName = branchName;
    
    // Detener y liberar memoria del video de fondo del selector de sucursal
    const bgVideo = document.getElementById('bg-branch-video');
    if (bgVideo) {
        bgVideo.pause();
        bgVideo.src = "";
        try {
            bgVideo.load();
        } catch (e) {
            console.log("Error unloading bg video:", e);
        }
    }
    
    // Ensure the page starts at the top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const overlay = document.getElementById('branch-selector');
    const ageModal = document.getElementById('age-modal');

    if (branchName === 'Cerro Navia') {
        // Cerro Navia entra directo sin advertencia de edad
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
        if (typeof updateBranchMenu === 'function') {
            updateBranchMenu('Cerro Navia');
        }
        console.log('Sucursal seleccionada: ' + branchName);
        // Reproducir audio
        const audio = document.getElementById('bg-audio');
        if (audio) {
            audio.play().catch(e => console.log('Autoplay blocked on branch select:', e));
        }
    } else if (branchName === 'Laguna Sur') {
        // Laguna Sur requiere verificación de edad primero
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
        if (ageModal) {
            ageModal.classList.remove('hidden');
            ageModal.style.display = 'flex';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si venimos de vuelta de Webpay
    const urlParams = new URLSearchParams(window.location.search);
    const estadoPago = urlParams.get('pago');
    
    if (estadoPago) {
        if (estadoPago === 'exito') {
            const orden = urlParams.get('orden');
            
            // Guardar el pedido en localStorage para pedidos.html
            let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            let clienteActual = JSON.parse(localStorage.getItem('clienteTemporal')) || {};
            
            if (carritoActual.length > 0) {
                let pedidosGuardados = JSON.parse(localStorage.getItem('pedidosPendientes')) || [];
                
                const totalPedido = carritoActual.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 3000;
                
                const nuevaVenta = {
                    id: orden,
                    date: new Date().toLocaleString('es-CL'),
                    isoDate: new Date().toISOString(),
                    customerName: clienteActual.nombre || 'Sin Nombre',
                    customerAddress: clienteActual.direccion || 'Sin Dirección',
                    items: carritoActual,
                    total: totalPedido
                };

                pedidosGuardados.push(nuevaVenta);
                localStorage.setItem('pedidosPendientes', JSON.stringify(pedidosGuardados));

                // Guardar la venta en el backend para el historial permanente (Dashboard de Ventas)
                fetch('http://localhost:3000/api/guardar-venta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaVenta)
                }).catch(err => console.error('Error guardando venta en backend:', err));
            }

            alert('¡Pago Exitoso!\nTu compra ha sido aprobada. Número de orden: ' + orden);
            // Limpiar el carrito ya que la compra fue exitosa
            localStorage.removeItem('carrito');
            localStorage.removeItem('clienteTemporal');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (estadoPago === 'rechazado') {
            alert('El pago fue rechazado. Revisa tu saldo e intenta nuevamente.');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (estadoPago === 'abortado') {
            alert('Cancelaste el proceso de pago.');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (estadoPago === 'error') {
            alert('Hubo un error de conexión al verificar el pago.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

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
    setProducts = function(productosArray) {
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

    function renderCurrentPage() {
        if(!productsGrid) return;
        try {
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
            if (!prod) return;
            const priceStr = (prod.price !== undefined && prod.price !== null) ? prod.price.toLocaleString('es-CL') : '0';
            const nameStr = prod.name || 'Sin Nombre';
            
            // Usar la versión WebP optimizada y unificada por ID de producto
            const imageStr = prod.id ? `catalogo/${prod.id}.webp` : (prod.image || 'logo.jpg.jpeg');

            // Generar "opiniones" aleatorias para darle el estilo de Falabella
            const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
            const reviews = Math.floor(Math.random() * 50) + 1;
            
            // Simular un precio antiguo y rebaja
            const oldPrice = prod.price ? Math.floor(prod.price * 1.3) : 0;
            const savings = oldPrice - (prod.price || 0);

            // Calcular cantidad de unidades y precio unitario dinámicamente
            const upperName = nameStr.toUpperCase();
            let qty = 1;
            const matchX = upperName.match(/\bX\s*(\d+)/);
            if (matchX) {
                qty = parseInt(matchX[1], 10);
            } else {
                const matchUnits = upperName.match(/(\d+)\s*(?:UNIDADES|UNIDAD|UNID|U|BEBIDAS|FRASCOS|POTS|LATAS|LIBRAS|PACK|CAJA)\b/);
                if (matchUnits) {
                    qty = parseInt(matchUnits[1], 10);
                }
            }
            const unitPrice = prod.price ? Math.round(prod.price / qty) : 0;
            const unitPriceStr = unitPrice.toLocaleString('es-CL');
            const isAgotado = prod.agotado === true;

            html += `
            <div class="product-card falabella-style" data-id="${prod.id}" style="${isAgotado ? 'opacity: 0.85;' : ''}">
                <div class="product-image-container" style="position: relative;">
                    <img class="mini-logo-overlay" src="logo_transparente.png" alt="Logo" loading="lazy">
                    <img src="${imageStr}" alt="${nameStr}" loading="lazy" style="${isAgotado ? 'filter: grayscale(100%) opacity(0.6);' : ''}">
                    ${isAgotado ? '<div class="agotado-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; color: #d32f2f; font-weight: 900; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">AGOTADO</div>' : ''}
                </div>
                <div class="product-info-container">
                    ${savings > 0 && !isAgotado ? '<div class="rebaja-badge"><i class="fa-solid fa-arrow-down"></i> Rebaja</div>' : ''}
                    <h4 class="brand-title">${prod.category || 'VARIOS'}</h4>
                    <h3 class="product-title">${nameStr}</h3>
                    <div class="rating-container">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star-half-stroke"></i>
                        </div>
                        <span class="rating-score">(${rating})</span>
                        <a href="#" class="rating-reviews">${reviews} opiniones</a>
                    </div>
                    
                    <div class="price-container">
                        <div class="main-price">$${priceStr}</div>
                        ${savings > 0 && !isAgotado ? `
                        <div class="old-price-row">
                            <span class="old-price">$${oldPrice.toLocaleString('es-CL')}</span>
                            <span class="savings-badge">Ahorra $${savings.toLocaleString('es-CL')}</span>
                        </div>
                        ` : ''}
                    </div>

                    <div class="unit-price-label" style="font-size: 13px; color: #27ae60; font-weight: 700; margin-top: 5px; margin-bottom: 12px; background-color: rgba(39, 174, 96, 0.08); padding: 4px 8px; border-radius: 4px; display: inline-block;">
                        Precio unitario: $${unitPriceStr} c/u
                    </div>

                    <div class="action-container">
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <label style="font-size: 13px; color: #555; font-weight: 600;">CANT:</label>
                                <input type="number" class="product-qty" min="1" max="50" value="1" style="width: 60px;" ${isAgotado ? 'disabled' : ''}>
                            </div>
                            ${prod.flavors && prod.flavors.length > 0 ? `
                            <select class="product-flavor" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-size: 13px;" ${isAgotado ? 'disabled' : ''}>
                                ${prod.flavors.map(f => `<option value="${f}">${f}</option>`).join('')}
                            </select>
                            ` : ''}
                        </div>
                        ${isAgotado ? `
                        <button class="add-to-cart-btn fb-blue-btn" disabled style="background-color: #ccc; border-color: #ccc; color: #666; cursor: not-allowed; opacity: 0.8;">Agotado</button>
                        ` : `
                        <button class="add-to-cart-btn fb-blue-btn">Agregar al carro</button>
                        `}
                    </div>
                </div>
            </div>`;
        });
            productsGrid.innerHTML = html;
            renderPagination();
        } catch (e) {
            productsGrid.innerHTML = `<div style="color:red; font-size:20px; padding:20px;">ERROR FATAL: ${e.message}<br>${e.stack}</div>`;
        }
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

    scrollToProducts = function() {
        if (productsSection) {
            const headerOffset = 100;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }

    // Inicializar sin productos hasta seleccionar sucursal
    // setProducts(baseCatalogo);

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
                filtrados = baseCatalogo;
            } else {
                filtrados = baseCatalogo.filter(p => p.category === category);
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
        if (query === '') {
            setProducts(baseCatalogo);
            productsTitle.textContent = 'TODOS LOS PRODUCTOS';
            return;
        }

        // Filtrar productos
        const resultados = baseCatalogo.filter(p => {
            const name = p.name ? p.name.toLowerCase() : '';
            const category = p.category ? p.category.toLowerCase() : '';
            return name.includes(query) || category.includes(query);
        });
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
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const openCartBtn = document.getElementById('open-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const timeRestrictionMsg = document.getElementById('time-restriction-msg');

    function openCart() { 
        cartModal.classList.remove('hidden'); 
        renderCart(); 
        checkSalesHours();
    }
    
    function checkSalesHours() {
        const currentHour = new Date().getHours();
        if (currentHour >= 1 && currentHour < 9) {
            if(checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
            }
            if(timeRestrictionMsg) timeRestrictionMsg.style.display = 'block';
        } else {
            if(checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
            }
            if(timeRestrictionMsg) timeRestrictionMsg.style.display = 'none';
        }
    }

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
                if (btn.disabled) return;
                const card = btn.closest('.product-card');
                const id = card.getAttribute('data-id');

                if (id === 'JABAMIX') {
                    const customModal = document.getElementById('custom-product-modal');
                    if (customModal) {
                        document.getElementById('qty-coca').value = 0;
                        document.getElementById('qty-fanta').value = 0;
                        document.getElementById('qty-sprite').value = 0;
                        document.getElementById('custom-total-selected').textContent = '0';
                        const addBtn = document.getElementById('add-custom-product-btn');
                        addBtn.disabled = true;
                        addBtn.style.opacity = '0.5';
                        addBtn.style.cursor = 'not-allowed';
                        customModal.classList.remove('hidden');
                    }
                    return;
                }

                const qtyInput = card.querySelector('.product-qty');
                const quantity = parseInt(qtyInput.value) || 1;
                
                const flavorSelect = card.querySelector('.product-flavor');
                const flavor = flavorSelect ? flavorSelect.value : null;

                // Buscar el producto en el catálogo base de la sucursal
                const productoSeleccionado = baseCatalogo.find(p => p.id === id);
                
                const existingItem = carrito.find(item => item.id === id && item.flavor === flavor);
                if(existingItem) {
                    existingItem.quantity += quantity;
                    if(existingItem.quantity > 50) existingItem.quantity = 50;
                } else {
                    carrito.push({ ...productoSeleccionado, quantity: quantity, flavor: flavor });
                }

                saveCart();
                renderCart();

                btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
                setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar'; }, 1000);
            }
        });
    }

    saveCart = function() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = carrito.reduce((acc, item) => acc + item.quantity, 0);
        if(cartCountSpan) { cartCountSpan.textContent = totalItems; }
    }

    window.removeFromCart = function(index) {
        carrito.splice(index, 1);
        saveCart();
        renderCart();
    };

    renderCart = function() {
        // Limpiar items corruptos (del bug anterior)
        carrito = carrito.filter(item => item && item.id && item.price != null);
        
        if(carrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartTotalPrice.textContent = '$0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        carrito.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name} ${item.flavor ? `<span style="color:#007BFF; font-size: 12px;"><br>Sabor: ${item.flavor}</span>` : ''}</h4>
                        <p>${item.quantity} x $${item.price.toLocaleString('es-CL')}</p>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        const subtotalElement = document.getElementById('cart-subtotal-price');
        const shippingCost = 3000;
        const finalTotal = total + shippingCost;
        if(subtotalElement) {
            subtotalElement.textContent = '$' + total.toLocaleString('es-CL');
            cartTotalPrice.textContent = '$' + finalTotal.toLocaleString('es-CL');
        } else {
            cartTotalPrice.textContent = '$' + total.toLocaleString('es-CL');
        }
    }

    // Checkout (Integración con Webpay)
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if(carrito.length === 0) { alert('El carrito está vacío.'); return; }
            
            // Validar Horario
            const currentHour = new Date().getHours();
            if (currentHour >= 1 && currentHour < 9) {
                alert('Las compras están restringidas entre la 01:00 AM y 09:00 AM por cumplimiento legal.');
                return;
            }
            
            const nameInput = document.getElementById('customer-name');
            const addressInput = document.getElementById('customer-address');
            const rutInput = document.getElementById('customer-rut');
            const communeInput = document.getElementById('customer-commune');
            const legalCheckbox = document.getElementById('legal-checkbox');
            
            if(!nameInput.value || !addressInput.value || !communeInput.value) { 
                alert('Por favor, ingresa tu nombre, dirección y comuna para despachar el pedido.'); 
                return; 
            }

            if(!legalCheckbox.checked) {
                alert('Debes confirmar que eres mayor de 18 años y aceptar los términos y condiciones.');
                return;
            }
            
            // Cambiar texto del botón
            const textOriginal = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
            checkoutBtn.disabled = true;

            const total = carrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const finalTotal = total + 3000; // Agregar costo de envío
            
            const clienteInfo = {
                nombre: nameInput.value,
                direccion: addressInput.value,
                rut: rutInput ? rutInput.value : '',
                comuna: communeInput.value
            };

            try {
                // 1. Llamar al backend para iniciar el pago, enviando el carrito y cliente
                const response = await fetch('http://localhost:3000/api/pagar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        total: finalTotal,
                        carrito: carrito,
                        cliente: clienteInfo
                    })
                });
                
                const data = await response.json();
                
                if (data.url && data.token) {
                    // 2. Guardar cliente temporalmente para recuperar después si es necesario
                    localStorage.setItem('clienteTemporal', JSON.stringify(clienteInfo));

                    // 3. Crear formulario automático para Webpay
                    const form = document.createElement('form');
                    form.action = data.url;
                    form.method = 'POST';
                    
                    const inputToken = document.createElement('input');
                    inputToken.type = 'hidden';
                    inputToken.name = 'token_ws';
                    inputToken.value = data.token;
                    
                    form.appendChild(inputToken);
                    document.body.appendChild(form);
                    
                    // 4. Enviar a Transbank
                    form.submit(); 
                } else {
                    alert('Error del Servidor: ' + (data.error || 'No se recibió token de Webpay.'));
                    checkoutBtn.innerHTML = textOriginal;
                    checkoutBtn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                alert('No se pudo conectar con el servidor Backend. Asegúrate de que iniciar_servidor.bat esté corriendo.');
                checkoutBtn.innerHTML = textOriginal;
                checkoutBtn.disabled = false;
            }
        });
    }

    // Custom Product Modal Logic
    const customModal = document.getElementById('custom-product-modal');
    const closeCustomModalBtn = document.getElementById('close-custom-modal-btn');
    const addCustomProductBtn = document.getElementById('add-custom-product-btn');
    
    if (customModal) {
        closeCustomModalBtn.addEventListener('click', () => {
            customModal.classList.add('hidden');
        });

        const qtyBtns = customModal.querySelectorAll('.qty-btn');
        qtyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const flavor = e.target.getAttribute('data-flavor');
                const isPlus = e.target.classList.contains('plus');
                const input = document.getElementById('qty-' + flavor);
                
                let currentCoca = parseInt(document.getElementById('qty-coca').value);
                let currentFanta = parseInt(document.getElementById('qty-fanta').value);
                let currentSprite = parseInt(document.getElementById('qty-sprite').value);
                let total = currentCoca + currentFanta + currentSprite;

                let val = parseInt(input.value);
                if (isPlus && total < 10 && val < 10) {
                    input.value = val + 1;
                    total++;
                } else if (!isPlus && val > 0) {
                    input.value = val - 1;
                    total--;
                }

                document.getElementById('custom-total-selected').textContent = total;
                
                if (total === 10) {
                    addCustomProductBtn.disabled = false;
                    addCustomProductBtn.style.opacity = '1';
                    addCustomProductBtn.style.cursor = 'pointer';
                } else {
                    addCustomProductBtn.disabled = true;
                    addCustomProductBtn.style.opacity = '0.5';
                    addCustomProductBtn.style.cursor = 'not-allowed';
                }
            });
        });

        if (addCustomProductBtn) {
            addCustomProductBtn.addEventListener('click', () => {
                const coca = parseInt(document.getElementById('qty-coca').value);
                const fanta = parseInt(document.getElementById('qty-fanta').value);
                const sprite = parseInt(document.getElementById('qty-sprite').value);
                
                if (coca + fanta + sprite !== 10) return;

                const baseProduct = catalogoProductos.find(p => p.id === 'JABAMIX');
                const customId = `JABAMIX-${coca}-${fanta}-${sprite}`;
                const customName = `JABA MIXTA (C:${coca} F:${fanta} S:${sprite})`;

                const existingItem = carrito.find(item => item.id === customId);
                if(existingItem) {
                    existingItem.quantity += 1;
                    if(existingItem.quantity > 50) existingItem.quantity = 50;
                } else {
                    carrito.push({
                        ...baseProduct,
                        id: customId,
                        name: customName,
                        quantity: 1
                    });
                }

                saveCart();
                renderCart();
                customModal.classList.add('hidden');
                
                alert('¡Jaba Mixta agregada al carro!');
            });
        }
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

    const ventasLoginBtn = document.getElementById('ventas-login-btn');

    let loginTarget = 'pedidos.html'; // Por defecto

    if (loginModal) {
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginTarget = 'pedidos.html';
                loginModal.classList.remove('hidden');
                loginUser.value = '';
                loginPass.value = '';
                loginError.style.display = 'none';
            });
        }
        
        if (ventasLoginBtn) {
            ventasLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginTarget = 'ventas.html';
                loginModal.classList.remove('hidden');
                loginUser.value = '';
                loginPass.value = '';
                loginError.style.display = 'none';
            });
        }

        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
        });

        submitLoginBtn.addEventListener('click', () => {
            const user = loginUser.value.trim();
            const pass = loginPass.value.trim();

            if (user === 'eleodoro' && pass === '123456') {
                // Credenciales correctas, redirigir a la página correspondiente
                window.location.href = loginTarget;
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

// --- Funcionalidad del Contador de Visitas Global ---
document.addEventListener('DOMContentLoaded', () => {
    const counterDiv = document.getElementById('visitor-flip-counter');
    if (!counterDiv) return;

    function renderCounter(num) {
        // Asegurar que tenga al menos 4 dígitos (rellenando con 0 a la izquierda)
        const visitString = num.toString().padStart(4, '0');
        counterDiv.innerHTML = ''; // Limpiar
        
        // Inyectar cada dígito en el estilo flip
        visitString.split('').forEach(digit => {
            const digitSpan = document.createElement('span');
            digitSpan.className = 'flip-digit';
            digitSpan.textContent = digit;
            counterDiv.appendChild(digitSpan);
        });
    }

    // Usamos una API gratuita para llevar el conteo real global
    // Namespace: distribuidora_eleodoro_2026_oficial
    fetch('https://api.counterapi.dev/v1/distribuidora_eleodoro_2026_oficial/visits/up')
        .then(response => response.json())
        .then(data => {
            // data.count nos da el número real de visitas desde que se creó el contador
            // Queremos que empiece en 2333, así que le sumamos una base (ej. 2332)
            const totalVisits = data.count + 2332;
            renderCounter(totalVisits);
        })
        .catch(error => {
            // Si la API falla, usamos localStorage como respaldo temporal
            console.error('Error cargando el contador:', error);
            let fallback = parseInt(localStorage.getItem('site_total_visits_fallback_v2')) || 2332;
            fallback = fallback + 1;
            localStorage.setItem('site_total_visits_fallback_v2', fallback);
            renderCounter(fallback);
        });
});

// --- Reproductor de Audio Personalizado ---
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('audio-play-btn');
    const muteBtn = document.getElementById('audio-mute-btn');

    if (audio && playBtn && muteBtn) {
        // Función para actualizar iconos
        const updatePlayerUI = () => {
            // Icono Play/Pause
            if (audio.paused) {
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            } else {
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
            // Icono Muted
            if (audio.muted) {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        };

        // Evento Play/Pause
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play()
                    .then(updatePlayerUI)
                    .catch(err => console.log("Play failed:", err));
            } else {
                audio.pause();
                updatePlayerUI();
            }
        });

        // Evento Mute/Unmute
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audio.muted = !audio.muted;
            updatePlayerUI();
        });

        // Escuchar eventos nativos para mantener sincronizada la UI
        audio.addEventListener('play', updatePlayerUI);
        audio.addEventListener('pause', updatePlayerUI);
        audio.addEventListener('volumechange', updatePlayerUI);

        // Intentar reproducir automáticamente cada 2 segundos hasta lograrlo (por políticas de autoplay)
        const playAttempt = setInterval(() => {
            audio.play()
                .then(() => {
                    clearInterval(playAttempt);
                    updatePlayerUI();
                })
                .catch(() => {
                    // Esperando interacción del usuario
                });
        }, 2000);

        // Si el usuario hace clic en cualquier lado del documento, forzar reproducción
        document.body.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().then(updatePlayerUI).catch(e => console.log(e));
            }
        }, { once: true });

        // Inicializar UI
        updatePlayerUI();
    }
});

// --- Funcionalidad del Modal de Contacto ---
document.addEventListener('DOMContentLoaded', () => {
    const openContactBtn = document.getElementById('open-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContactBtn = document.getElementById('close-contact-btn');

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.remove('hidden');
            contactModal.style.display = 'flex';
        });

        if (closeContactBtn) {
            closeContactBtn.addEventListener('click', () => {
                contactModal.classList.add('hidden');
            });
        }
        
        // Cerrar haciendo click en el fondo oscuro
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
            }
        });
    }
});

// --- Funcionalidad del Modal de Comunidad ---
document.addEventListener('DOMContentLoaded', () => {
    const openComunidadBtn = document.getElementById('open-comunidad-btn');
    const comunidadModal = document.getElementById('comunidad-modal');
    const closeComunidadBtn = document.getElementById('close-comunidad-btn');

    if (openComunidadBtn && comunidadModal) {
        openComunidadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            comunidadModal.classList.remove('hidden');
            comunidadModal.style.display = 'flex';
        });

        if (closeComunidadBtn) {
            closeComunidadBtn.addEventListener('click', () => {
                comunidadModal.classList.add('hidden');
            });
        }
        
        // Cerrar haciendo click en el fondo oscuro
        comunidadModal.addEventListener('click', (e) => {
            if (e.target === comunidadModal) {
                comunidadModal.classList.add('hidden');
            }
        });
    }
});

// --- Botón de Catálogo en el Slider (Esquina inferior izquierda) ---
document.addEventListener('DOMContentLoaded', () => {
    const sliderCatalogBtn = document.getElementById('slider-catalog-btn');
    if (sliderCatalogBtn) {
        sliderCatalogBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular clic en la categoría "TODOS" en el menú para restablecer filtros y scrollear
            const btnTodos = document.querySelector('.nav-container a[data-category="TODOS"]');
            if (btnTodos) {
                btnTodos.click();
            } else {
                // Si no se encuentra (caso borde), hacer scroll directamente
                const productsSection = document.getElementById('productos');
                if (productsSection) {
                    const headerOffset = 100;
                    const elementPosition = productsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
        });
    }
});
