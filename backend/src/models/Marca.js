const db = require('../config/database');

// Obtener todas las marcas
function obtenerTodas() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM marcas', [], (err, rows) => {
      if (err) reject(err);
      else {
        const marcas = rows.map(row => ({
          id: row.id,
          nombre: row.nombre,
          caja: row.caja,
          stock: row.stock,
          semejantes: JSON.parse(row.semejantes || '[]')
        }));
        resolve(marcas);
      }
    });
  });
}

// Crear una nueva marca
function crear(data) {
  return new Promise((resolve, reject) => {
    const { nombre, caja, stock, semejantes } = data;
    const semejantesStr = JSON.stringify(semejantes || []);
    db.run(
      'INSERT INTO marcas (nombre, caja, stock, semejantes) VALUES (?, ?, ?, ?)',
      [nombre, caja, stock, semejantesStr],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

// Actualizar una marca
function actualizar(id, data) {
  return new Promise((resolve, reject) => {
    const { nombre, caja, stock, semejantes } = data;
    const semejantesStr = JSON.stringify(semejantes || []);
    db.run(
      'UPDATE marcas SET nombre = ?, caja = ?, stock = ?, semejantes = ? WHERE id = ?',
      [nombre, caja, stock, semejantesStr, id],
      (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      }
    );
  });
}

// Eliminar una marca
function eliminar(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM marcas WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      else resolve({ success: true });
    });
  });
}

module.exports = { obtenerTodas, crear, actualizar, eliminar };