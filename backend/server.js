const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar:", err));

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

app.listen(3000, () => {
    console.log("🚀 Servidor en http://localhost:3000");
});
