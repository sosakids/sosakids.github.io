// Datos simulados de usuarios
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

// Lista de productos (chaquetas) con precio y stock inicial
let products = [
    { name: 'Chaqueta de Mario Bros', price: 69999, stock: 10 },
    { name: 'Chaqueta de More Love', price: 69999, stock: 15 },
    { name: 'Chaqueta de Capitán América', price: 69999, stock: 8 },
    { name: 'Chaqueta de Pompón', price: 69999, stock: 12 },
    { name: 'Chaqueta de Cars', price: 69999, stock: 10 },
    { name: 'Chaqueta de Pompón (estilo 2)', price: 69999, stock: 9 },
    { name: 'Beisbolera en cuerina', price: 69999, stock: 7 },
    { name: 'Sudadera de Minnie', price: 69999, stock: 11 },
    { name: 'Chaqueta de Top Gun', price: 69999, stock: 6 },
    { name: 'Chaqueta estampada de corazones', price: 69999, stock: 14 }
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

// Maneja el registro
function handleRegister(event) {
    event.preventDefault();
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    users.push({ username: newUsername, password: newPassword, role: 'user' });
    alert("Usuario registrado con éxito. Ahora puede iniciar sesión.");
}

// Muestra el stock si el usuario es administrador
function displayStock() {
    const productStockList = document.getElementById("productStockList");
    productStockList.innerHTML = "";

    products.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${product.name} - Stock: ${product.stock}`;
        productStockList.appendChild(listItem);
    });
}


// Añade producto al carrito si el usuario no es admin
function addToCart(index) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        if (products[index].stock > 0) {
            cart.push({ name: products[index].name, price: products[index].price });
            totalAmount += products[index].price;
            displayCart();
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

// Muestra el carrito con los productos añadidos y el total
function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");

    cartContainer.style.display = "block";
    cartItems.innerHTML = "";
    totalElement.textContent = `Total: $${totalAmount}`;

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - $${item.price}`;

        // Crear botón de eliminar
        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.classList.add("remove-button");
        removeButton.onclick = () => removeFromCart(index); // Llama a la función para eliminar

        listItem.appendChild(removeButton); // Añade el botón al elemento del producto
        cartItems.appendChild(listItem);
    });
}

// Elimina un producto del carrito según su índice
function removeFromCart(index) {
    totalAmount -= cart[index].price; // Resta el precio del producto eliminado del total
    cart.splice(index, 1); // Elimina el producto del carrito
    displayCart(); // Actualiza la vista del carrito
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        window.location.href = "payment.html"; // Redirige a la página de pago
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Función para filtrar productos por palabras clave en la descripción
function searchProducts(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(product => {
            const description = product.querySelector(".info .description0")?.textContent.toLowerCase() || "";
            if (description.includes(searchTerm)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
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
            displayStock(); // Muestra el stock pero sin opción de modificarlo
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
