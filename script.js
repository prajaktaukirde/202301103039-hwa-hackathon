const PRICE = 49.00;
const PRODUCT = { id: 'sniffshift', name: 'SniffShift Timed-Drawer Dog Puzzle', price: PRICE };

let cart = JSON.parse(localStorage.getItem('sniffshift_cart')) || [];

const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const addToCart = document.getElementById('addToCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkout = document.getElementById('checkout');
const checkoutForm = document.getElementById('checkoutForm');
const cancelCheckout = document.getElementById('cancelCheckout');
const confirmation = document.getElementById('confirmation');
const continueShopping = document.getElementById('continueShopping');
const orderNumberEl = document.getElementById('orderNumber');
const orderAddressEl = document.getElementById('orderAddress');

function saveCart() {
  localStorage.setItem('sniffshift_cart', JSON.stringify(cart));
  renderCart();
}

function itemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function totalAmount() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  cartCount.textContent = itemCount();
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
    cartFooter.style.display = 'none';
    return;
  }
  cart.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="thumb">${item.name.charAt(0)}</div>
      <div class="info">
        <div class="name">${item.name}</div>
        <div class="price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="qty-controls">
        <button type="button" data-idx="${idx}" data-delta="-1">-</button>
        <output>${item.qty}</output>
        <button type="button" data-idx="${idx}" data-delta="1">+</button>
      </div>
      <button type="button" class="remove-item" data-idx="${idx}">Remove</button>
    `;
    cartItems.appendChild(el);
  });
  cartTotal.textContent = '$' + totalAmount().toFixed(2);
  cartFooter.style.display = 'block';
}

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  if (btn.classList.contains('remove-item')) {
    cart.splice(idx, 1);
    saveCart();
    return;
  }
  const delta = Number(btn.dataset.delta);
  if (delta === -1) {
    if (cart[idx].qty > 1) cart[idx].qty -= 1;
    else cart.splice(idx, 1);
  } else {
    cart[idx].qty += 1;
  }
  saveCart();
});

addToCart.addEventListener('click', () => {
  const existing = cart.find(i => i.id === PRODUCT.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...PRODUCT, qty: 1 });
  saveCart();
  cartPanel.setAttribute('aria-hidden', 'false');
});

cartToggle.addEventListener('click', () => {
  cartPanel.setAttribute('aria-hidden', 'false');
});
closeCart.addEventListener('click', () => {
  cartPanel.setAttribute('aria-hidden', 'true');
});
cartPanel.addEventListener('click', (e) => {
  if (e.target === cartPanel) cartPanel.setAttribute('aria-hidden', 'true');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cartPanel.setAttribute('aria-hidden', 'true');
});

checkoutBtn.addEventListener('click', () => {
  cartPanel.setAttribute('aria-hidden', 'true');
  checkout.style.display = 'block';
  checkout.scrollIntoView({ behavior: 'smooth' });
});

cancelCheckout.addEventListener('click', () => {
  checkout.style.display = 'none';
});

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
    city: formData.get('city'),
    postal: formData.get('postal'),
    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
    total: totalAmount(),
  };

  const submitBtn = checkoutForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Placing order...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('/api/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Order failed');
    }

    orderNumberEl.textContent = data.orderNumber;
    orderAddressEl.textContent = payload.address;
    cart = [];
    saveCart();
    checkout.style.display = 'none';
    confirmation.style.display = 'block';
    confirmation.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    alert('Demo order could not be placed. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

continueShopping.addEventListener('click', () => {
  confirmation.style.display = 'none';
});

renderCart();
