const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // <-- agrega esto
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar:", err));

// Rutas API
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

// Para servir los archivos que ya tienes en raíz:
app.use(express.static(path.join(__dirname, '..')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Puerto dinámico para Render o local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
