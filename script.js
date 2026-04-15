document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMASI TEKS BERGANTI (Hero Section)
    const words = ["Living", "Dining", "Laundry"];
    let index = 0;
    const textElement = document.getElementById('spin-text');

    setInterval(() => {
        // Efek Fade Out
        textElement.style.opacity = 0;

        setTimeout(() => {
            index = (index + 1) % words.length;
            textElement.textContent = words[index];
            // Efek Fade In
            textElement.style.opacity = 1;
        }, 500);
    }, 2000); // Ganti tiap 3 detik


    // 2. REVEAL ANIMATION (LOOPING)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Hapus class active pas keluar dari layar biar bisa fade-out (Looping)
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2 // Animasi jalan pas 20% element keliatan
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });


    // 3. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

const menuData = [
    { id: 1, name: "Satu Kopi", category: "coffee", price: 25000, options: ["Vanilla", "Caramel", "Hazelnut"] },
    { id: 2, name: "Cold Brew", category: "coffee", price: 28000, options: ["No Sugar", "Less Sugar", "Normal"] },
    { id: 3, name: "Earl Grey Tea", category: "tea", price: 20000, options: ["Honey", "Lemon", "Lychee"] },
    { id: 4, name: "Matcha Latte", category: "milk", price: 30000, options: ["Boba", "Jelly", "Extra Shot"] },
    { id: 5, name: "Chocolate Signature", category: "milk", price: 27000, options: ["Marshmallow", "Whipped Cream"] }
];

let cart = [];

function renderMenu(filter = "all") {
    const display = document.getElementById("menu-display");
    display.innerHTML = "";

    const filtered = filter === "all" ? menuData : menuData.filter(item => item.category === filter);

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
      <h3>${item.name}</h3>
      <span class="price">Rp ${item.price.toLocaleString()}</span>
      <div class="options-group">
        <label>Flavor / Topping</label>
        <select id="opt-${item.id}">
          ${item.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
        </select>
      </div>
      <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Order</button>
    `;
        display.appendChild(card);
    });
}

window.addToCart = (id) => {
    const item = menuData.find(i => i.id === id);
    const selectedOpt = document.getElementById(`opt-${id}`).value;

    cart.push({ ...item, selectedOpt });
    updateCartUI();
};

function updateCartUI() {
    const cartBar = document.getElementById("cart-summary");
    const countEl = document.getElementById("item-count");
    const priceEl = document.getElementById("total-price");

    if (cart.length > 0) {
        cartBar.classList.add("active");
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        countEl.innerText = `${cart.length} Items Selected`;
        priceEl.innerText = `Rp ${total.toLocaleString()}`;
    }
}

document.getElementById("buy-button").addEventListener("click", () => {
    window.open("https://gojek.com/en-id", "_blank");
});

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        e.target.classList.add("active");
        renderMenu(e.target.dataset.category);
    });
});

document.addEventListener("DOMContentLoaded", () => renderMenu());