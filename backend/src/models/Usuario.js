const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Buscar usuario por correo
function buscarPorCorreo(correo) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Crear usuario administrador por defecto si no existe
async function crearAdminSiNoExiste() {
  const correo = 'admin@covers.com';
  const password = 'admin123'; // Cámbiala por una segura
  const existente = await buscarPorCorreo(correo);
  if (!existente) {
    const hash = bcrypt.hashSync(password, 10);
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO usuarios (correo, password_hash) VALUES (?, ?)', [correo, hash], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = { buscarPorCorreo, crearAdminSiNoExiste };