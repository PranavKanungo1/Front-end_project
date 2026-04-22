// Mock Product Data
const products = [
    {
        id: 1,
        title: "Nexus Pro Wireless Headphones",
        description: "Studio-quality sound with active noise cancellation and 40h battery life.",
        price: 299.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Quantum Smartwatch Series 7",
        description: "Advanced health tracking, always-on OLED display, and titanium casing.",
        price: 399.99,
        category: "wearables",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Aura True Wireless Earbuds",
        description: "Ultra-compact earbuds with immersive spatial audio technology.",
        price: 149.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "Pulse Fitness Tracker",
        description: "Minimalist band tracking sleep, heart rate, and daily activity.",
        price: 89.99,
        category: "wearables",
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        title: "Titanium MagSafe Charger",
        description: "Fast wireless charging pad crafted from aerospace-grade aluminum.",
        price: 49.99,
        category: "accessories",
        image: "https://img.tvcmall.com/dynamic/uploads/400x400_6630001021A.webp"
    },
    {
        id: 6,
        title: "Nexus Boom Portable Speaker",
        description: "Waterproof Bluetooth speaker with 360-degree bass-heavy sound.",
        price: 129.99,
        category: "audio",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        title: "Ergo Stand for Laptops",
        description: "Adjustable aluminum stand to improve posture and cooling.",
        price: 59.99,
        category: "accessories",
        image: "https://m.media-amazon.com/images/I/318ge1662jL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        id: 8,
        title: "Zenith VR Headset",
        description: "Next-gen virtual reality headset with 4K resolution per eye.",
        price: 499.99,
        category: "wearables",
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=400&q=80"
    }
];

// State Management
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'popular';
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const navLinks = document.querySelectorAll('.nav-links a');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');
const cartBadge = document.getElementById('cartBadge');
const toastContainer = document.getElementById('toastContainer');

// Initialize
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

// Render Products based on state
function renderProducts() {
    let filteredProducts = products.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // Sorting
    if (currentSort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } // 'popular' maintains default order

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">No products found matching your criteria.</div>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <span class="product-category">${product.category}</span>
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Category Filtering
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active state
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            currentCategory = link.dataset.category;
            renderProducts();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Cart Sidebar Toggles
    cartToggleBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
}

// Cart Functionality
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${product.title} to cart`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Animate badge
    cartBadge.style.transform = 'translate(20%, -20%) scale(1.2)';
    setTimeout(() => {
        cartBadge.style.transform = 'translate(20%, -20%) scale(1)';
    }, 200);

    // Update Items List
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
        cartTotalValue.textContent = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // Update Total
    cartTotalValue.textContent = `$${total.toFixed(2)}`;
}

// Toast Notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Start the app
init();
