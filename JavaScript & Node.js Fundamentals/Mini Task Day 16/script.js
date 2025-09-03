let products = [];

// Fetch product data from FakeStore API
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        products = data;
        displayProducts(products);
        updateCartCount();
    });

// Display products in the container
function displayProducts(productList) {
    const container = document.getElementById("product-container");
    container.innerHTML = "";
    productList.forEach(p => {
        let div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
      <img src="${p.image}" />
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
        container.appendChild(div);
    });
}

// Add item to cart and prevent duplicates
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!");
    } else {
        alert("Item already in cart!");
    }
    updateCartCount();
}

// Update cart item count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElem = document.getElementById("cart-count");
    if (countElem) {
        countElem.textContent = cart.length;
    }
}

// Handle sorting
document.getElementById("sort").addEventListener("change", (e) => {
    if (e.target.value === "price") {
        products.sort((a, b) => a.price - b.price);
    } else if (e.target.value === "name") {
        products.sort((a, b) => a.title.localeCompare(b.title));
    }
    displayProducts(products);
});

// Debounced search filter
let debounce;
document.getElementById("search").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        let query = e.target.value.toLowerCase();
        let filtered = products.filter(p => p.title.toLowerCase().includes(query));
        displayProducts(filtered);
    }, 300);
});