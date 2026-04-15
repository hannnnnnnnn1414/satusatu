document.addEventListener('DOMContentLoaded', () => {
    const words = ["Living", "Dining", "Laundry"];
    let wordIndex = 0;
    const textElement = document.getElementById('spin-text');

    setInterval(() => {
        textElement.style.opacity = 0;
        setTimeout(() => {
            wordIndex = (wordIndex + 1) % words.length;
            textElement.textContent = words[wordIndex];
            textElement.style.opacity = 1;
        }, 500);
    }, 3000);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const menuData = [
        {
            id: 1,
            name: "Satu Kopi",
            category: "coffee",
            price: 25000,
            options: ["Vanilla", "Caramel", "Hazelnut"],
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            name: "Cold Brew",
            category: "coffee",
            price: 28000,
            options: ["No Sugar", "Less Sugar", "Normal"],
            image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            name: "Earl Grey Tea",
            category: "tea",
            price: 20000,
            options: ["Honey", "Lemon", "Lychee"],
            image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 4,
            name: "Matcha Latte",
            category: "milk",
            price: 30000,
            options: ["Boba", "Jelly", "Extra Shot"],
            image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 5,
            name: "Chocolate Signature",
            category: "milk",
            price: 27000,
            options: ["Marshmallow", "Whipped Cream"],
            image: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=600&q=80"
        }
    ];

    let cart = JSON.parse(localStorage.getItem('satusatu_cart')) || [];
    let currentFilter = "all";
    let searchQuery = "";

    function renderMenu() {
        const display = document.getElementById("menu-display");
        display.innerHTML = "";

        const filtered = menuData.filter(item => {
            const matchesCategory = currentFilter === "all" || item.category === currentFilter;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        filtered.forEach(item => {
            const card = document.createElement("div");
            card.className = "menu-card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="menu-item-img">
                <h3>${item.name}</h3>
                <span class="price">Rp ${item.price.toLocaleString()}</span>
                <div class="options-group">
                    <label>Flavor / Topping</label>
                    <select id="opt-${item.id}">
                        ${item.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                    </select>
                </div>
                <button class="add-to-cart" data-id="${item.id}">Add to Order</button>
            `;
            display.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
        });
    }

    function addToCart(id) {
        const item = menuData.find(i => i.id === id);
        const selectedOpt = document.getElementById(`opt-${id}`).value;
        cart.push({ ...item, selectedOpt });
        saveAndUI();
    }

    function saveAndUI() {
        localStorage.setItem('satusatu_cart', JSON.stringify(cart));
        const cartBar = document.getElementById("cart-summary");
        const countEl = document.getElementById("item-count");
        const priceEl = document.getElementById("total-price");

        if (cart.length > 0) {
            cartBar.classList.add("active");
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            countEl.innerText = `${cart.length} Items Selected`;
            priceEl.innerText = `Rp ${total.toLocaleString()}`;
        } else {
            cartBar.classList.remove("active");
        }
    }

    document.getElementById("clear-cart").addEventListener("click", () => {
        cart = [];
        saveAndUI();
    });

    document.getElementById("menu-search").addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderMenu();
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            e.target.classList.add("active");
            currentFilter = e.target.dataset.category;
            renderMenu();
        });
    });

    document.getElementById("buy-button").addEventListener("click", () => {
        if (cart.length === 0) return;
        const phoneNumber = "6287840913630";
        let message = "Halo Satu Satu, saya mau order:%0A";
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.selectedOpt})%0A`;
        });
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        message += `%0ATotal: Rp ${total.toLocaleString()}`;
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    });

    renderMenu();
    saveAndUI();
});