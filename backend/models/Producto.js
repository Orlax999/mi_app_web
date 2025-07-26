const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    id: String,
    titulo: String,
    imagen: String,
    categoria: {
        nombre: String,
        id: String
    },
    precio: Number,
    stock: Number
});

module.exports = mongoose.model('Producto', productoSchema);
