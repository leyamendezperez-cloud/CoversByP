const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const marcaRoutes = require('./routes/marcaRoutes');
app.use('/api', authRoutes);
app.use('/api/marcas', marcaRoutes);

// Servir archivos estáticos del frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = app;