// Cargar usuarios desde localStorage o utilizar datos simulados si no hay usuarios almacenados
let users = JSON.parse(localStorage.getItem("users")) || [
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

// Guarda los usuarios actualizados en localStorage
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

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

// Muestra la sección de inventario solo para el administrador
function displayAdminInventory() {
    const inventoryContainer = document.getElementById("inventoryContainer");
    inventoryContainer.innerHTML = ""; // Limpia el contenedor de inventario

    products.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${product.name} - Stock: <span id="admin-stock-${index}">${product.stock}</span>
            <button onclick="modifyStock(${index}, 'increase')">+</button>
            <button onclick="modifyStock(${index}, 'decrease')">-</button>
        `;
        inventoryContainer.appendChild(listItem);
    });
}

// Modifica el stock manualmente
function modifyStock(index, action) {
    const stockDisplay = document.getElementById(`admin-stock-${index}`);
    if (action === 'increase') {
        products[index].stock += 1;
    } else if (action === 'decrease' && products[index].stock > 0) {
        products[index].stock -= 1;
    }
    stockDisplay.textContent = products[index].stock; // Actualiza el stock en la sección de inventario
}

// Muestra todos los productos en la página principal con el stock y precio
function displayProducts() {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = "";

    products.forEach((product, index) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="Imagenes/Chaqueta${index + 1}.png" alt="${product.name}">
            <div class="info">
                <p class="price">$${product.price}</p>
                <p class="description">${product.name}</p>
                <button class="buy-btn" onclick="addToCart(${index})">Comprar</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Añade producto al carrito y actualiza el stock solo en la vista de inventario del admin
function addToCart(index) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        if (products[index].stock > 0) {
            cart.push({ name: products[index].name, price: products[index].price });
            totalAmount += products[index].price;
            products[index].stock -= 1; // Reduce el stock después de la compra
            displayCart();
            updateAdminInventory(index); // Actualiza el stock en la vista de inventario del admin
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

// Actualiza el stock en la sección de inventario después de una compra
function updateAdminInventory(index) {
    const stockDisplay = document.getElementById(`admin-stock-${index}`);
    if (stockDisplay) {
        stockDisplay.textContent = products[index].stock;
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

// Ejecuta esta función cuando la página esté cargada
window.onload = function() {
    const loginBtn = document.getElementById("loginBtn");
    const profileContainer = document.getElementById("profileContainer");
    const inventoryContainer = document.getElementById("inventoryContainer");
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
            inventoryContainer.style.display = "block"; // Muestra la administración de stock si es admin
            displayAdminInventory(); // Muestra el inventario solo para el administrador
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
