// Cargar usuarios desde localStorage o utilizar datos simulados si no hay usuarios almacenados
let users = JSON.parse(localStorage.getItem("users")) || [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

let cart = [];
let totalAmount = 0;

// Definir el stock de los productos
const stock = {
    "Sudadera de Mario Bros": 10,
    "Chaqueta de More Love": 5,
    "Chaqueta de Capitán América": 7,
    "Chaqueta de pompon": 6,
    "Chaqueta de Cars": 3,
    "Beisbolera en cuerina": 8,
    "Sudadera de Minnie": 9,
    "Chaqueta de Top Gun": 4,
    "Chaqueta de corazones": 2
};

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

// Muestra el stock de productos si el usuario es administrador
function displayStock() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role === 'admin') {
        const stockContainer = document.getElementById("stockContainer");
        stockContainer.innerHTML = "<h3>Stock de Productos</h3>";
        for (const productName in stock) {
            const stockInfo = document.createElement("p");
            stockInfo.textContent = `${productName}: ${stock[productName]} unidades`;
            stockContainer.appendChild(stockInfo);
        }
    }
}

// Guarda un nuevo usuario en el registro
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
            saveUsers();
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
        if (stock[productName] > 0) {
            cart.push({ name: productName, price: price });
            totalAmount += price;
            stock[productName]--; // Reduce el stock del producto
            displayCart();
        } else {
            alert("Lo sentimos, este producto está agotado.");
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

        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.classList.add("remove-button");
        removeButton.onclick = () => removeFromCart(index);

        listItem.appendChild(removeButton);
        cartItems.appendChild(listItem);
    });
}

// Función para mostrar y ocultar el carrito
function toggleCart() {
    const cartContainer = document.getElementById("cartContainer");
    cartContainer.style.display = cartContainer.style.display === "block" ? "none" : "block";
}

// Elimina un producto del carrito según su índice
function removeFromCart(index) {
    totalAmount -= cart[index].price;
    stock[cart[index].name]++; // Restaura el stock al eliminar el producto
    cart.splice(index, 1);
    displayCart();
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        alert("Gracias por su compra");
        cart = [];
        totalAmount = 0;
        displayCart();
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Filtrar productos por palabras clave en la descripción
function searchProducts(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(product => {
            const description1 = product.querySelector(".description1")?.textContent.toLowerCase() || "";
            const description2 = product.querySelector(".description2")?.textContent.toLowerCase() || "";
            product.style.display = description1.includes(searchTerm) || description2.includes(searchTerm) ? "block" : "none";
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
        profileContainer.style.display = "block";
    }

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

    // Muestra el stock para el administrador
    displayStock();
};
