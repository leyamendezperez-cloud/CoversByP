const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './marcas.db';
const db = new sqlite3.Database(path.resolve(dbPath));

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS marcas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    caja TEXT,
    stock INTEGER DEFAULT 0,
    semejantes TEXT DEFAULT '[]'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correo TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )`);
});

module.exports = db;