const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

async function login(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }
  const usuario = await Usuario.buscarPorCorreo(correo);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const valido = bcrypt.compareSync(password, usuario.password_hash);
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token });
}

module.exports = { login };