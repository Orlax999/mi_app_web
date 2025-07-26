const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
});


// Obtener producto por id (para validar stock desde frontend)
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findOne({ id: req.params.id });
        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error del servidor" });
    }
});


// Actualizar stock (descontar al comprar)
router.post('/actualizar-stock', async (req, res) => {
    const { id, cantidad } = req.body;

    const producto = await Producto.findOne({ id: id });

    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (producto.stock < cantidad) {
        return res.status(400).json({ mensaje: "Stock insuficiente" });
    }

    producto.stock -= cantidad;
    await producto.save();

    res.json({ mensaje: "Stock actualizado", producto });
});

module.exports = router;


