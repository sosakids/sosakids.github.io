// Datos simulados de usuarios
const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'user', password: 'userpass', role: 'user' }
];

let cart = [];
let totalAmount = 0;

// Inventario inicial de productos
let inventory = [
    { name: 'Chaqueta de More Love enguatada', stock: 10, price: 69999 },
    { name: 'Sudadera de Mario Bros', stock: 8, price: 59999 },
    { name: 'Chaqueta Top Gun', stock: 5, price: 79999 },
    { name: 'Chaqueta de Capitan America', stock: 7, price: 74999 },
    { name: 'Chaqueta de pompon', stock: 6, price: 64999 },
    { name: 'Chaqueta de Cars', stock: 9, price: 67999 },
    { name: 'Chaqueta de Minnie', stock: 12, price: 65999 },
    { name: 'Beisbolera en cuerina', stock: 4, price: 69999 },
    { name: 'Sudadera de Minnie', stock: 10, price: 58999 },
    { name: 'Chaqueta de Top Gun forrada en ovejero', stock: 5, price: 78999 },
    { name: 'Chaqueta estampada de corazones', stock: 7, price: 71999 }
];

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

// Función para mostrar el inventario solo al administrador
function displayInventory() {
    const inventoryContainer = document.getElementById("inventoryContainer");
    inventoryContainer.style.display = "block";
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = ""; // Limpia la lista antes de agregar productos

    // Crea un elemento para cada producto en el inventario
    inventory.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${item.name} - Stock: </span>
            <input type="number" value="${item.stock}" min="0" onchange="updateStock(${index}, this.value)" />
        `;
        inventoryList.appendChild(listItem);
    });
}

// Actualiza manualmente el stock de un producto
function updateStock(index, newStock) {
    inventory[index].stock = parseInt(newStock);
}

// Añade producto al carrito solo si hay stock disponible
function addToCart(productName, price) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.role !== 'admin') {
        const product = inventory.find(item => item.name === productName);

        if (product && product.stock > 0) {
            cart.push({ name: productName, price: price });
            totalAmount += price;
            product.stock -= 1; // Reduce el stock en 1
            displayCart();
            displayInventory(); // Actualiza la vista del inventario en tiempo real
        } else {
            alert("Este producto no está disponible en stock.");
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
    const product = cart[index];
    totalAmount -= product.price;
    const inventoryItem = inventory.find(item => item.name === product.name);
    if (inventoryItem) {
        inventoryItem.stock += 1; // Devuelve el stock al inventario
    }
    cart.splice(index, 1); // Elimina el producto del carrito
    displayCart();
    displayInventory(); // Actualiza la vista del inventario en tiempo real
}

// Maneja el pedido
function checkout() {
    if (cart.length > 0) {
        alert("¡Gracias por su compra!");
        cart = [];
        totalAmount = 0;
        displayCart();
        displayInventory(); // Actualiza el inventario después de la compra
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Ejecuta esta función cuando la página esté cargada
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

        // Muestra el inventario si el usuario es administrador
        if (loggedInUser.role === 'admin') {
            displayInventory();
        }
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
