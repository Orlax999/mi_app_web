let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const contenedorTotal = document.querySelector("#total");

fetch("http://localhost:3000/api/productos")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductosCarrito(); // ahora sí con el stock disponible
    })
    .catch(error => {
        console.error("Error cargando productos:", error);
    });

function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-nombre">
                    <small>${producto.categoria.nombre}</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <div class="iconos">
                <button class="carrito-producto-agregar" id="${producto.id}"><i class="bi bi-plus"></i></button>
                ${producto.cantidad > 1 ? 
                    `<button class="carrito-producto-quitar" id="${producto.id}"><i class="bi bi-dash"></i></button>`
                    : ''
                }
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                </div>     
            `;
            contenedorProductos.append(div);
        });
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

    actualizarBotonesAgregar();
    actualizarBotonesQuitar();
    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".carrito-producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", aumentarCantidad);
    });
}

function actualizarBotonesQuitar(){
    const botonesQuitar = document.querySelectorAll(".carrito-producto-quitar");
    botonesQuitar.forEach(boton => {
        boton.addEventListener("click",quitarDelCarrito)
    })
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function aumentarCantidad(e) {
    const idBoton = e.currentTarget.id;
    const productoEnCarrito = productosEnCarrito.find(p => p.id === idBoton);
    const productoCatalogo = productos.find(p => p.id === idBoton);

    if (!productoCatalogo) {
        console.error("Producto no encontrado en el catálogo.");
        return;
    }

    if (productoEnCarrito.cantidad >= productoCatalogo.stock) {
        Swal.fire({
            icon: 'warning',
            title: '¡Sin stock!',
            text: `No hay más unidades disponibles de "${productoCatalogo.titulo}".`,
            confirmButtonColor: '#000',
            background: '#f4f4f4'
        });
        return;
    }

    productoEnCarrito.cantidad++;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

function quitarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const producto = productosEnCarrito.find(producto => producto.id === idBoton);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito(); 
    }
}




function eliminarDelCarrito(e) {
        Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #0d0d0d, #e2e2e2)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
     Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}
