"use strict";

const TOTAL_STUDENTS = 9146;

const students = Array.from({ length: TOTAL_STUDENTS }, (_, index) => {
    const number = index + 1;

    return {
        studentNumber: `2026-${number}`,
        password: "student123",
        name: `Student ${number}`
    };
});

const staff = [
    {
        username: "staff01",
        password: "staff123",
        name: "Canteen Staff"
    },
    {
        username: "admin",
        password: "staff123",
        name: "System Administrator"
    }
];

const menu = [
    {
        id: 1,
        name: "Chicken Rice",
        price: 55,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaYYe1NBkjCd9i0b3Gf2gFd5I629K_dTto0hFCFXL_Rw&s=10"
    },
    {
        id: 2,
        name: "Burger",
        price: 45,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf4Cp0ujfQBCZMVS4H0w1hTMDehpbodq3qc2Xmi4O42A&s=10"
    },
    {
        id: 3,
        name: "Spaghetti",
        price: 50,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1XjZtVoacDBjhSVT0UVQKq2ZAsOhP8xZ3_xUuvtjnVg&s=10"
    },
    {
        id: 4,
        name: "Fried Rice",
        price: 40,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX4m77RqZ7RCPZZqvXMjWKMe4cq0hMVB0Hc8Gp7BO5vQ&s=10"
    },
    {
        id: 5,
        name: "French Fries",
        price: 35,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rDcQDXpFHX9wIq_zW2LADO45VSgSnOsvBVqNmkfdbw&s=10"
    },
    {
        id: 6,
        name: "Iced Tea",
        price: 25,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LYsuyapvC5fK9NCmUMOs8wK8SrkvoToMo-wTu0wZ9Q&s=10"
    },
    {
        id: 7,
        name: "Bottled Water",
        price: 15,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj-sSHWkyL-BX4H_7Szub3wUXq3XtlM2Au-Gf_6xAy9g&s=10"
    }
];

let currentUser = null;
let cart = [];
let orders = [];
let nextOrderId = 1;

function getElement(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return replacements[character];
    });
}

function changeLoginForm() {
    const type = getElement("accountType").value;
    const isStudent = type === "student";

    getElement("studentLogin").hidden = !isStudent;
    getElement("staffLogin").hidden = isStudent;

    getElement("studentNumber").required = isStudent;
    getElement("studentPassword").required = isStudent;
    getElement("staffUsername").required = !isStudent;
    getElement("staffPassword").required = !isStudent;

    getElement("loginMessage").textContent = "";
}

function login(event) {
    event.preventDefault();

    const type = getElement("accountType").value;
    const message = getElement("loginMessage");

    message.textContent = "";
    message.style.color = "";

    if (type === "student") {
        const number = getElement("studentNumber").value.trim();
        const password = getElement("studentPassword").value;

        const student = students.find(user =>
            user.studentNumber === number &&
            user.password === password
        );

        if (!student) {
            message.textContent =
                "Invalid student number or password. Check your details and try again.";
            return;
        }

        currentUser = {
            type: "student",
            name: student.name,
            studentNumber: student.studentNumber
        };

        cart = [];
        showStudentPage();
        return;
    }

    const username = getElement("staffUsername").value.trim();
    const password = getElement("staffPassword").value;

    const staffMember = staff.find(user =>
        user.username === username &&
        user.password === password
    );

    if (!staffMember) {
        message.textContent = "Invalid staff username or password.";
        return;
    }

    currentUser = {
        type: "staff",
        name: staffMember.name,
        username: staffMember.username
    };

    showStaffPage();
}

function showOnly(pageId) {
    getElement("loginPage").hidden = pageId !== "loginPage";
    getElement("studentPage").hidden = pageId !== "studentPage";
    getElement("staffPage").hidden = pageId !== "staffPage";
}

function showStudentPage() {
    showOnly("studentPage");

    getElement("studentWelcome").textContent =
        `Welcome, ${currentUser.name} (${currentUser.studentNumber})`;

    getElement("orderMessage").textContent = "";
    renderMenu();
    renderCart();
    renderMyOrders();
    showPaymentDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showStaffPage() {
    showOnly("staffPage");

    getElement("staffWelcome").textContent =
        `Welcome, ${currentUser.name}`;

    renderStaffOrders();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function logout() {
    currentUser = null;
    cart = [];

    getElement("loginForm").reset();
    getElement("accountType").value = "student";
    getElement("orderMessage").textContent = "";

    changeLoginForm();
    renderCart();
    showOnly("loginPage");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMenu() {
    const menuElement = getElement("menu");

    menuElement.innerHTML = menu.map(food => `
        <article class="food-card">
            <img
                class="food-image"
                src="${escapeHTML(food.image)}"
                alt="${escapeHTML(food.name)}"
                loading="lazy"
            >
            <div class="food-info">
                <h3>${escapeHTML(food.name)}</h3>
                <p class="food-price">₱${food.price.toFixed(2)}</p>
                <label for="quantity-${food.id}">Quantity</label>
                <input
                    id="quantity-${food.id}"
                    type="number"
                    min="1"
                    max="50"
                    value="1"
                    inputmode="numeric"
                >
                <button type="button" data-add-food="${food.id}">
                    Add to Cart
                </button>
            </div>
        </article>
    `).join("");

    menuElement.querySelectorAll(".food-image").forEach(image => {
        image.addEventListener("error", function () {
            this.onerror = null;
            this.src = "https://placehold.co/600x400?text=Food+Image";
        });
    });
}

function addToCart(foodId) {
    if (!currentUser || currentUser.type !== "student") {
        return;
    }

    const food = menu.find(item => item.id === foodId);

    if (!food) return;

    const quantityInput = getElement(`quantity-${foodId}`);
    const quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        alert("Please enter a quantity from 1 to 50.");
        return;
    }

    const existing = cart.find(item => item.id === foodId);
    const newQuantity = existing ? existing.quantity + quantity : quantity;

    if (newQuantity > 50) {
        alert("Maximum quantity per food item is 50.");
        return;
    }

    if (existing) {
        existing.quantity = newQuantity;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            quantity
        });
    }

    quantityInput.value = "1";
    renderCart();
}

function renderCart() {
    const cartElement = getElement("cartItems");

    if (cart.length === 0) {
        cartElement.textContent = "Your cart is empty.";
        getElement("total").textContent = "0.00";
        return;
    }

    cartElement.innerHTML = cart.map(item => `
        <div class="cart-item">
            <strong>${escapeHTML(item.name)}</strong>
            <p>
                ₱${item.price.toFixed(2)} × ${item.quantity}
                = ₱${(item.price * item.quantity).toFixed(2)}
            </p>
            <button type="button" data-decrease="${item.id}" aria-label="Decrease ${escapeHTML(item.name)} quantity">−</button>
            <button type="button" data-increase="${item.id}" aria-label="Increase ${escapeHTML(item.name)} quantity">+</button>
            <button type="button" class="remove-button" data-remove="${item.id}">
                Remove
            </button>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    getElement("total").textContent = total.toFixed(2);
}

function changeQuantity(foodId, amount) {
    const item = cart.find(entry => entry.id === foodId);

    if (!item) return;

    if (amount > 0 && item.quantity >= 50) {
        alert("Maximum quantity per food item is 50.");
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.id !== foodId);
    }

    renderCart();
}

function removeFromCart(foodId) {
    cart = cart.filter(item => item.id !== foodId);
    renderCart();
}

function showPaymentDetails() {
    const payment = getElement("payment");
    const gcashDetails = getElement("gcashDetails");
    const cashDetails = getElement("cashDetails");

    if (!payment || !gcashDetails || !cashDetails) return;

    gcashDetails.hidden = payment.value !== "GCash";
    cashDetails.hidden = payment.value !== "Cash";
}

function placeOrder() {
    const message = getElement("orderMessage");

    message.textContent = "";
    message.style.color = "";

    if (!currentUser || currentUser.type !== "student") {
        message.textContent = "Please log in as a student first.";
        return;
    }

    if (cart.length === 0) {
        message.textContent = "Your cart is empty. Add food first.";
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = {
        id: nextOrderId++,
        studentNumber: currentUser.studentNumber,
        studentName: currentUser.name,
        items: cart.map(item => ({ ...item })),
        total,
        payment: getElement("payment").value,
        status: "Pending",
        createdAt: new Date().toLocaleString()
    };

    orders.push(order);
    cart = [];

    renderCart();
    renderMyOrders();

    message.style.color = "#15803d";
    message.textContent =
        `Order #${order.id} placed successfully! Payment method: ${order.payment}.`;

    renderStaffOrders();
}

function renderMyOrders() {
    const container = getElement("myOrders");

    if (!currentUser || currentUser.type !== "student") {
        container.textContent = "No orders yet.";
        return;
    }

    const myOrders = orders.filter(
        order => order.studentNumber === currentUser.studentNumber
    );

    if (myOrders.length === 0) {
        container.textContent = "No orders yet.";
        return;
    }

    container.innerHTML = myOrders.slice().reverse().map(order => `
        <div class="order-item">
            <strong>Order #${order.id}</strong>
            <p><span class="status-label">${escapeHTML(order.status)}</span></p>
            <p>${escapeHTML(order.createdAt)}</p>
            <p>${order.items.map(item =>
                `${escapeHTML(item.name)} × ${item.quantity}`
            ).join(", ")}</p>
            <p>Payment: ${escapeHTML(order.payment)}</p>
            <p>Total: ₱${order.total.toFixed(2)}</p>
        </div>
    `).join("");
}

function renderStaffOrders() {
    const container = getElement("staffOrders");

    if (!currentUser || currentUser.type !== "staff") {
        container.textContent = "Please log in as staff to view orders.";
        return;
    }

    if (orders.length === 0) {
        container.textContent = "No orders yet.";
        return;
    }

    container.innerHTML = orders.slice().reverse().map(order => `
        <div class="order-item">
            <strong>Order #${order.id}</strong>
            <p><span class="status-label">${escapeHTML(order.status)}</span></p>
            <p>Student: ${escapeHTML(order.studentName)}</p>
            <p>Student number: ${escapeHTML(order.studentNumber)}</p>
            <p>${escapeHTML(order.createdAt)}</p>
            <p>${order.items.map(item =>
                `${escapeHTML(item.name)} × ${item.quantity}`
            ).join(", ")}</p>
            <p>Payment: ${escapeHTML(order.payment)}</p>
            <p>Total: ₱${order.total.toFixed(2)}</p>
            <button type="button" data-status="${order.id}" data-new-status="Preparing">
                Mark Preparing
            </button>
            <button type="button" data-status="${order.id}" data-new-status="Ready">
                Mark Ready
            </button>
            <button type="button" data-status="${order.id}" data-new-status="Completed">
                Complete
            </button>
        </div>
    `).join("");
}

function updateOrderStatus(orderId, newStatus) {
    if (!currentUser || currentUser.type !== "staff") {
        return;
    }

    const allowedStatuses = ["Preparing", "Ready", "Completed"];

    if (!allowedStatuses.includes(newStatus)) {
        return;
    }

    const order = orders.find(item => item.id === orderId);

    if (!order) return;

    order.status = newStatus;

    renderStaffOrders();
}

document.addEventListener("DOMContentLoaded", function () {
    getElement("loginForm").addEventListener("submit", login);

    getElement("accountType").addEventListener("change", changeLoginForm);

    document.querySelectorAll("[data-logout]").forEach(button => {
        button.addEventListener("click", logout);
    });

    getElement("menu").addEventListener("click", function (event) {
        const button = event.target.closest("[data-add-food]");

        if (button) {
            addToCart(Number(button.dataset.addFood));
        }
    });

    getElement("cartItems").addEventListener("click", function (event) {
        const button = event.target.closest("button");

        if (!button) return;

        if (button.dataset.increase) {
            changeQuantity(Number(button.dataset.increase), 1);
        } else if (button.dataset.decrease) {
            changeQuantity(Number(button.dataset.decrease), -1);
        } else if (button.dataset.remove) {
            removeFromCart(Number(button.dataset.remove));
        }
    });

    getElement("payment").addEventListener("change", showPaymentDetails);

    getElement("placeOrderButton").addEventListener("click", placeOrder);

    getElement("refreshOrders").addEventListener("click", renderStaffOrders);

    getElement("staffOrders").addEventListener("click", function (event) {
        const button = event.target.closest("[data-status]");

        if (!button) return;

        updateOrderStatus(
            Number(button.dataset.status),
            button.dataset.newStatus
        );
    });

    changeLoginForm();
    renderMenu();
    renderCart();
    showPaymentDetails();
    showOnly("loginPage");
});