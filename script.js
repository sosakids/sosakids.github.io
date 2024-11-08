// Datos simulados de usuarios
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

let cart = [];
let totalAmount = 0;

// Redirige a la página de login
function redirectToLogin() {
    window.location.href = "login.html";
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
function addToCart(productName, price) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        cart.push({ name: productName, price: price });
        totalAmount += price;
        displayCart();
    } else if (loggedInUser && loggedInUser.role === 'admin') {
        alert("El carrito de compras solo está disponible para usuarios.");
    } else {
        alert("Por favor, inicia sesión para comprar.");
        redirectToLogin();
    }
}

// Muestra el carrito con los productos añadidos y el total
function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");

    cartContainer.style.display = "block";
    cartItems.innerHTML = "";
    totalElement.textContent = `Total: $${totalAmount}`;

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(listItem);
    });
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        alert("¡Gracias por su compra!");
        cart = [];
        totalAmount = 0;
        displayCart();
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

    // Configura los botones de compra para los usuarios
document.querySelectorAll('.buy-btn').forEach(button => {
    button.onclick = function() {
        const productContainer = this.parentNode; // Encuentra el contenedor del producto

        // Obtiene el nombre y el precio del producto si existen
        const productName = productContainer.querySelector('.description')?.textContent || "Producto desconocido";
        const priceText = productContainer.querySelector('.price')?.textContent || "$0";

        // Convierte el precio a número, eliminando símbolos y puntos
        const price = parseInt(priceText.replace('$', '').replace('.', '')) || 0;

        // Añade el producto al carrito
        addToCart(productName, price);
    };
});

};
