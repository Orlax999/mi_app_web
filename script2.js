let productos = [];

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
let numerito = document.querySelector("#numerito");

// Función para cargar y mostrar productos en el contenedor
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="productos-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>`;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

// Fetch para obtener productos del backend
fetch("http://localhost:3000/api/productos")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })
    .catch(error => console.error("Error cargando productos:", error));

// Filtrado por categorías
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productosBoton[0]?.categoria.nombre ?? "Productos";
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    if (index !== -1) {
        const cantidadActual = productosEnCarrito[index].cantidad;

        // Validar stock antes de incrementar
        if (cantidadActual >= productoAgregado.stock) {
            Swal.fire({
                icon: 'warning',
                title: '¡Sin stock!',
                text: `No hay más unidades disponibles de "${productoAgregado.titulo}".`,
                confirmButtonColor: '#000',
                background: '#f4f4f4'
            });
            return;
        }

        productosEnCarrito[index].cantidad++;
    } else {
        // Verificar si al menos hay una unidad en stock
        if (productoAgregado.stock <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Producto agotado',
                text: `"${productoAgregado.titulo}" no tiene unidades disponibles.`,
                confirmButtonColor: '#000',
                background: '#f4f4f4'
            });
            return;
        }

        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #0d0d0d, #e2e2e2)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' },
        onClick: function () { }
    }).showToast();

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}


function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

actualizarNumerito();
