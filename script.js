
// Datos simulados de usuarios
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

// Lista de productos (chaquetas) con stock inicial
let products = [
    { name: 'Chaqueta de Mario Bros', stock: 10 },
    { name: 'Chaqueta de More Love', stock: 15 },
    { name: 'Chaqueta de Capitán América', stock: 8 },
    { name: 'Chaqueta de Pompón', stock: 12 },
    { name: 'Chaqueta de Cars', stock: 10 },
    { name: 'Chaqueta de Pompón (estilo 2)', stock: 9 },
    { name: 'Beisbolera en cuerina', stock: 7 },
    { name: 'Sudadera de Minnie', stock: 11 },
    { name: 'Chaqueta de Top Gun', stock: 6 },
    { name: 'Chaqueta estampada de corazones', stock: 14 }
];

let cart = [];
let totalAmount = 0;

// Redirige a la página de login
function redirectToLogin() {
    window.location.href = "login.html";
}

// Redirige a la página de perfil
function redirectToProfile() {
    window.location.href = "profile.html";
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

// Muestra el stock y permite cambiarlo si el usuario es administrador
function displayStock() {
    const productStockList = document.getElementById("productStockList");
    productStockList.innerHTML = "";

    products.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${product.name} - Stock: <input type="number" id="stock-${index}" value="${product.stock}">
            <button onclick="updateStock(${index})">Actualizar Stock</button>
        `;
        productStockList.appendChild(listItem);
    });
}

// Función para actualizar el stock de un producto específico
function updateStock(index) {
    const newStock = document.getElementById(`stock-${index}`).value;
    products[index].stock = parseInt(newStock);

    alert(`Stock de ${products[index].name} actualizado a ${newStock}`);
    displayProducts(); // Actualiza la visualización de productos en la página principal
}

// Muestra todos los productos en la página principal con el stock actualizado
function displayProducts() {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = "";

    products.forEach((product, index) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="Imagenes/Chaqueta${index + 1}.png" alt="${product.name}">
            <div class="info">
                <p class="description${index}">${product.name} - Stock: ${product.stock}</p>
                <button class="buy-btn" onclick="addToCart(${index})">Comprar</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Añade producto al carrito y actualiza el stock si el usuario no es admin
function addToCart(index) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        if (products[index].stock > 0) {
            cart.push({ name: products[index].name });
            products[index].stock -= 1; // Reduce el stock automáticamente
            displayCart();
            displayProducts(); // Actualiza la visualización del stock en la página principal
        } else {
            alert("Este producto está agotado.");
        }
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

    cartContainer.style.display = "block";
    cartItems.innerHTML = "";

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name}`;
        cartItems.appendChild(listItem);
    });
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        window.location.href = "payment.html"; // Redirige a la página de pago
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Ejecuta esta función cuando la página esté cargada
window.onload = function() {
    const loginBtn = document.getElementById("loginBtn");
    const profileContainer = document.getElementById("profileContainer");
    const stockContainer = document.getElementById("stockContainer");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        loginBtn.textContent = "Cerrar sesión";
        loginBtn.onclick = function() {
            localStorage.removeItem("loggedInUser");
            alert("Sesión cerrada");
            location.reload();
        };
        profileContainer.style.display = "block"; // Muestra el botón "Mi perfil" si está logueado

        if (loggedInUser.role === 'admin') {
            stockContainer.style.display = "block"; // Muestra la administración de stock si es admin
            displayStock(); // Llama a la función para mostrar el stock
        }
    }

    // Mostrar productos en la página principal
    displayProducts();
};

// Dirige a la página principal
function goToHome() {
    window.location.href = "index.html";
}

// Muestra un mensaje de confirmación de compra
function completePurchase() {
    alert("Gracias por su compra");
    window.location.href = "index.html"; // Redirige a la página principal después del pago
}
