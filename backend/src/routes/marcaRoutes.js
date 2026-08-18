const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');
const verificarToken = require('../middleware/auth');

router.get('/', marcaController.listar);
router.post('/', verificarToken, marcaController.crear);
router.put('/:id', verificarToken, marcaController.editar);
router.delete('/:id', verificarToken, marcaController.eliminar);

module.exports = router;