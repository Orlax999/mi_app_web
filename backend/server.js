const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI) // Cambiado aquí
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar:", err));

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 3000;  // Puerto dinámico para Render
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
