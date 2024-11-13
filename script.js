// Cargar usuarios desde localStorage o utilizar datos simulados si no hay usuarios almacenados
let users = JSON.parse(localStorage.getItem("users")) || [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
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

// Maneja el registro y guarda el usuario en localStorage
function handleRegister(event) {
    event.preventDefault();
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    users.push({ username: newUsername, password: newPassword, role: 'user' });
    saveUsers();
    alert("Usuario registrado con éxito. Ahora puede iniciar sesión.");
}

// Cambia la contraseña del usuario en el perfil
function changePassword(event) {
    event.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        const userIndex = users.findIndex(u => u.username === loggedInUser.username);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            saveUsers(); // Guarda los cambios en localStorage
            alert("Contraseña actualizada con éxito.");
        } else {
            alert("Error al actualizar la contraseña.");
        }
    } else {
        alert("Por favor, inicie sesión nuevamente.");
        redirectToLogin();
    }
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

// Función para mostrar y ocultar el carrito
function toggleCart() {
    const cartContainer = document.getElementById("cartContainer");
    if (cartContainer.style.display === "block") {
        cartContainer.style.display = "none";
    } else {
        cartContainer.style.display = "block";
    }
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
            const description1 = product.querySelector(".description1")?.textContent.toLowerCase() || "";
            const description2 = product.querySelector(".description2")?.textContent.toLowerCase() || "";
            if (description1.includes(searchTerm) || description2.includes(searchTerm)) {
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
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        loginBtn.textContent = "Cerrar sesión";
        loginBtn.onclick = function() {
            localStorage.removeItem("loggedInUser");
            alert("Sesión cerrada");
            location.reload();
        };
        profileContainer.style.display = "block"; // Muestra el botón "Mi perfil" si está logueado
    }

    // Configura los botones de compra para los usuarios
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.onclick = function() {
            const productContainer = this.parentNode;
            const productName = productContainer.querySelector('.description1')?.textContent ||
                                productContainer.querySelector('.description2')?.textContent ||
                                "Producto desconocido";
            const priceText = productContainer.querySelector('.price1')?.textContent ||
                              productContainer.querySelector('.price2')?.textContent ||
                              "$0";
            const price = parseInt(priceText.replace('$', '').replace('.', '')) || 0;
            addToCart(productName, price);
        };
    });
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

// STOCK

// Datos de productos con imágenes y stock
const productsData = [
    { name: "Sudadera de Mario Bros", image: "C:\\SOSAKIDS2\\Imagenes\\Sudadera1.png", stock: 10 },
    { name: "Chaqueta de More Love", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta1.png", stock: 5 },
    { name: "Chaqueta de Capitán América", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta2.png", stock: 7 },
    { name: "Chaqueta de pompon", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta5.png", stock: 6 },
    { name: "Chaqueta de Cars", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta3.png", stock: 3 },
    { name: "Beisbolera en cuerina", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta6.png", stock: 8 },
    { name: "Sudadera de Minnie", image: "C:\\SOSAKIDS2\\Imagenes\\Sudadera2.png", stock: 9 },
    { name: "Chaqueta de Top Gun", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta8.png", stock: 4 },
    { name: "Chaqueta de corazones", image: "C:\\SOSAKIDS2\\Imagenes\\Chaqueta7.png", stock: 2 }
];

// Mostrar botón de Stock solo para el administrador
window.onload = function() {
    const loginBtn = document.getElementById("loginBtn");
    const stockBtn = document.getElementById("stockBtn");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        loginBtn.textContent = "Cerrar sesión";
        loginBtn.onclick = function() {
            localStorage.removeItem("loggedInUser");
            alert("Sesión cerrada");
            location.reload();
        };
        
        // Mostrar botón de stock si es administrador
        if (loggedInUser.role === 'admin') {
            stockBtn.style.display = "block";
        }
    }

    // Mostrar stock en stock.html
    if (window.location.pathname.includes("stock.html")) {
        displayStockData();
    }
};

// Función para mostrar el stock de productos en stock.html
function displayStockData() {
    const stockContainer = document.getElementById("stockContainer");
    productsData.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("stock-item");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productInfo = document.createElement("p");
        productInfo.textContent = `${product.name} - Cantidad disponible: ${product.stock}`;

        productItem.appendChild(productImage);
        productItem.appendChild(productInfo);
        stockContainer.appendChild(productItem);
    });
}

