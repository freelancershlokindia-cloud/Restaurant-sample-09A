// ==========================================
// 1. UI & Animations
// ==========================================

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('scroll-progress').style.width = scrolled + '%';
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    observer.unobserve(entry.target);
  });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// Active Link Highlight
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

// ==========================================
// 2. Cart System (LocalStorage)
// ==========================================

let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartOpenBtn = document.getElementById('cart-icon-btn');
const cartCloseBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Toggle Cart
function toggleCart() {
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('show');
}

cartOpenBtn.addEventListener('click', toggleCart);
cartCloseBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Save & Render Cart
function updateCart() {
  localStorage.setItem('restaurantCart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem 0;">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      count += item.qty;

      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₹${item.price}</div>
        </div>
        <div class="cart-controls">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  cartCountElement.innerText = count;
  cartTotalElement.innerText = `₹${total}`;
}

// Add Item from Global Scope
window.addToCart = function(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCart();
  toggleCart(); // Open cart to show item was added
};

// Change Quantity
window.changeQty = function(index, amount) {
  cart[index].qty += amount;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
};

// ==========================================
// 3. WhatsApp Checkout System
// ==========================================
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Please add items to your cart first!");
    return;
  }

  const restaurantPhone = "919876543210"; // Replace with actual Ranchi number
  let message = `Hello *THE SAMPLE ONE*! 👋%0AI would like to place an order:%0A%0A`;
  let total = 0;

  cart.forEach(item => {
    message += `▪ ${item.qty}x ${item.name} - ₹${item.price * item.qty}%0A`;
    total += item.price * item.qty;
  });

  message += `%0A*Total Amount: ₹${total}*%0A%0APlease confirm my order.`;

  const whatsappURL = `https://wa.me/${restaurantPhone}?text=${message}`;
  window.open(whatsappURL, '_blank');
  
  // Optional: clear cart after sending
  // cart = []; updateCart(); toggleCart();
});

// Initialize Cart on load
renderCart();

// ==========================================
// 4. Menu Filtering & Searching (menu.html)
// ==========================================
const searchInput = document.getElementById('menu-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const foodItems = document.querySelectorAll('.menu-item-card');

if (searchInput && foodItems) {
  // Search
  searchInput.addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    foodItems.forEach(item => {
      const itemName = item.querySelector('.food-title').innerText.toLowerCase();
      item.style.display = itemName.includes(text) ? 'block' : 'none';
    });
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('btn'));
      filterBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('btn');

      const filter = btn.getAttribute('data-filter');
      foodItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
