const Marca = require('../models/Marca');

// GET /api/marcas
async function listar(req, res) {
  try {
    const marcas = await Marca.obtenerTodas();
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /api/marcas
async function crear(req, res) {
  try {
    const nueva = await Marca.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /api/marcas/:id
async function editar(req, res) {
  try {
    await Marca.actualizar(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// DELETE /api/marcas/:id
async function eliminar(req, res) {
  try {
    await Marca.eliminar(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { listar, crear, editar, eliminar };