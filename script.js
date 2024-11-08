// script.js - Funcionalidad de la página
console.log("Página cargada");

// Datos simulados de usuarios
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

let cart = [];

// Redirige a la página de login
function redirectToLogin() {
    window.location.href = "login.html"; // Asegúrate de que "login.html" esté en el mismo directorio
}

// Maneja el inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert(`Bienvenido ${user.role === 'admin' ? 'Administrador' : 'Usuario'}: ${user.username}`);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "index.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Maneja el registro
function handleRegister(event) {
    event.preventDefault();
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    users.push({ username: newUsername, password: newPassword, role: 'user' });
    alert("Usuario registrado con éxito. Ahora puede iniciar sesión.");
}

// Añade producto al carrito
function addToCart(productName) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        cart.push(productName);
        displayCart();
    } else if (loggedInUser && loggedInUser.role === 'admin') {
        alert("El carrito de compras solo está disponible para usuarios.");
    } else {
        alert("Por favor, inicia sesión para comprar.");
        redirectToLogin();
    }
}

// Muestra el carrito con los productos añadidos
function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    const cartItems = document.getElementById("cartItems");

    // Muestra el carrito
    cartContainer.style.display = "block";

    // Limpia la lista de elementos antes de renderizar
    cartItems.innerHTML = "";

    // Agrega cada producto al carrito
    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        cartItems.appendChild(listItem);
    });
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        alert("¡Gracias por tu compra!");
        cart = []; // Limpia el carrito después de la compra
        displayCart(); // Actualiza la vista del carrito
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Verifica el estado de sesión y cambia el botón de "Iniciar sesión" a "Cerrar sesión"
window.onload = function() {
    const loginBtn = document.getElementById("loginBtn");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        loginBtn.textContent = "Cerrar sesión";
        loginBtn.onclick = function() {
            localStorage.removeItem("loggedInUser");
            alert("Sesión cerrada");
            location.reload();
        };
    }

    // Agregar eventos de compra solo para usuarios
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.onclick = function() {
            const productName = this.parentNode.querySelector('.description').textContent;
            addToCart(productName);
        };
    });
};


