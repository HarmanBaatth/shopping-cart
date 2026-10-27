
const products = [
  {
    id: 1,
    name: "Classic Sneakers",
    category: "Footwear",
    price: 1299,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Canvas Tote Bag",
    category: "Accessories",
    price: 499,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Everyday Hoodie",
    category: "Clothing",
    price: 899,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Classic Watch",
    category: "Accessories",
    price: 1599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 399,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Travel Backpack",
    category: "Accessories",
    price: 999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Daily Trainers",
    category: "Footwear",
    price: 1499,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Classic Cap",
    category: "Clothing",
    price: 299,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85"
  }
];

let cart = [];
let couponApplied = false;

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");

const money = amount => "₹" + amount.toLocaleString("en-IN");

// Display products
function displayProducts() {
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchInput.value.trim().toLowerCase());

    const matchesCategory =
      categorySelect.value === "All" ||
      product.category === categorySelect.value;

    return matchesSearch && matchesCategory;
  });

  if (sortSelect.value === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  document.getElementById("product-count").textContent =
    `${filteredProducts.length} products`;

  if (filteredProducts.length === 0) {
    productList.innerHTML =
      '<p class="empty-message">No matching products found.</p>';
    return;
  }

  productList.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-info">
        <p class="category-label">${product.category}</p>
        <h3>${product.name}</h3>

        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="button add-button" data-add="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Add a product or increase its quantity
function addToCart(id) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity++;
  } else {
    const product = products.find(product => product.id === id);

    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }

  renderCart();
}

// Change item quantity
function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
  }
}

// Remove an item completely
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

// Calculate subtotal, discount, delivery and total
function calculateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const discount = couponApplied ? subtotal * 0.10 : 0;
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

// Display cart and update the bill
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-message">Your cart is empty. Add something you like!</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img class="cart-thumb" src="${item.image}" alt="${item.name}">

        <div>
          <h3>${item.name}</h3>
          <p>${money(item.price)} each</p>

          <div class="quantity">
            <button data-change="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-change="1" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>

          <button class="remove-button" data-remove="${item.id}">
            Remove
          </button>
        </div>

        <div>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
      </article>
    `).join("");
  }

  const totals = calculateTotals();

  document.getElementById("cart-count").textContent =
    cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("subtotal").textContent = money(totals.subtotal);
  document.getElementById("discount").textContent = money(totals.discount);
  document.getElementById("delivery").textContent = money(totals.delivery);
  document.getElementById("total").textContent = money(totals.total);

  document.getElementById("checkout-button").disabled = cart.length === 0;
}

// Apply the coupon
document.getElementById("apply-coupon").addEventListener("click", () => {
  const code = document.getElementById("coupon-code").value
    .trim().toUpperCase();

  const message = document.getElementById("coupon-message");

  if (cart.length === 0) {
    message.textContent = "Add products before applying a coupon.";
    couponApplied = false;
  } else if (code === "SAVE10") {
    couponApplied = true;
    message.textContent = "Success! 10% discount applied.";
  } else {
    couponApplied = false;
    message.textContent = "Invalid coupon. Try SAVE10.";
  }

  renderCart();
});

// Handle product buttons
productList.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

// Handle quantity and remove buttons
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.id),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

// Search, filter and sort
searchInput.addEventListener("input", displayProducts);
categorySelect.addEventListener("change", displayProducts);
sortSelect.addEventListener("change", displayProducts);

// Show checkout form
document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) return;

  document.getElementById("checkout").classList.remove("hidden");
  document.getElementById("checkout").scrollIntoView({
    behavior: "smooth"
  });
});

// Place the demo order
document.getElementById("checkout-form").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) return;

  const name = document.getElementById("customer-name").value.trim();

  document.getElementById("order-success").textContent =
    `Thank you, ${name}! Your demo order has been placed successfully.`;

  cart = [];
  couponApplied = false;

  document.getElementById("coupon-code").value = "";
  document.getElementById("coupon-message").textContent = "";

  renderCart();
  event.target.reset();
});

// Start the website
displayProducts();
renderCart();
