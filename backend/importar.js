const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const productos = require('./productos.json');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        await Producto.deleteMany(); // limpiar
        await Producto.insertMany(productos); // insertar
        console.log("✅ Productos insertados en MongoDB");
        process.exit();
    })
    .catch(err => console.error(err));
