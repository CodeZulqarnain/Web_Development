// Cart state
let cart = JSON.parse(localStorage.getItem('chinar_cart')) || [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupMobileMenu();
    
    // Check which page we are on and initialize specific functions
    if (document.getElementById('products-container')) {
        renderProducts();
    }
    
    if (document.getElementById('cart-items-container')) {
        renderCartItems();
    }
});

// Setup mobile menu
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Render products on products page or home page
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // Check if it's the home page (limit to 3 products)
    const isHome = container.dataset.limit === '3';
    const displayProducts = isHome ? products.slice(0, 3) : products;
    
    container.innerHTML = '';
    
    displayProducts.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <div class="product-img-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString()}</p>
                    <p class="product-desc">${product.description}</p>
                    <button class="btn btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// Update cart count badge
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    countElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('chinar_cart', JSON.stringify(cart));
}

// Show toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    
    // Create toast element if it doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'show';
    
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

// Checkout Page specific functions
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">Your cart is empty. <br><br><a href="products.html" class="btn">Continue Shopping</a></div>';
        if (subtotalEl) subtotalEl.textContent = '₹0';
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString()} x ${item.quantity}</div>
                    </div>
                </div>
                <div style="text-align: right">
                    <div style="margin-bottom: 10px; font-weight: bold;">₹${itemTotal.toLocaleString()}</div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = cartHTML;
    
    if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}
