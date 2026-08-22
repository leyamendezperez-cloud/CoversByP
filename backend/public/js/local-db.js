// public/js/local-db.js
import { Database } from 'sqlocal';

// Crear la instancia de la base de datos (se almacena en OPFS)
const db = new Database('covers-db');

// Inicializar la tabla (solo si no existe)
export async function initDB() {
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS marcas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        caja TEXT,
        stock INTEGER DEFAULT 0,
        semejantes TEXT DEFAULT '[]'
      )
    `;
    console.log('Base de datos local inicializada');
    return true;
  } catch (error) {
    console.error('Error al inicializar la BD local:', error);
    return false;
  }
}

// Función para cargar todas las marcas
export async function cargarMarcas() {
  try {
    const rows = await db.sql`SELECT * FROM marcas ORDER BY nombre`;
    // Convertir el campo semejantes de JSON string a array
    return rows.map(row => ({
      ...row,
      semejantes: JSON.parse(row.semejantes || '[]')
    }));
  } catch (error) {
    console.error('Error al cargar marcas:', error);
    return [];
  }
}

// Función para crear una nueva marca
export async function crearMarca(data) {
  const { nombre, caja, stock, semejantes } = data;
  try {
    const result = await db.sql`
      INSERT INTO marcas (nombre, caja, stock, semejantes)
      VALUES (${nombre}, ${caja}, ${stock}, ${JSON.stringify(semejantes || [])})
    `;
    // Devolver el objeto creado con el id generado
    return {
      id: result.lastInsertRowid,
      nombre,
      caja,
      stock,
      semejantes: semejantes || []
    };
  } catch (error) {
    console.error('Error al crear marca:', error);
    throw error;
  }
}

// Función para editar una marca existente
export async function editarMarca(id, data) {
  const { nombre, caja, stock, semejantes } = data;
  try {
    await db.sql`
      UPDATE marcas
      SET nombre = ${nombre},
          caja = ${caja},
          stock = ${stock},
          semejantes = ${JSON.stringify(semejantes || [])}
      WHERE id = ${id}
    `;
    return { id, nombre, caja, stock, semejantes: semejantes || [] };
  } catch (error) {
    console.error('Error al editar marca:', error);
    throw error;
  }
}

// Función para eliminar una marca
export async function eliminarMarca(id) {
  try {
    await db.sql`DELETE FROM marcas WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    throw error;
  }
}

// Función para buscar marcas localmente (ya existente en db.js)
export function buscarLocal(texto, marcas) {
  if (!texto || texto.trim() === '') return marcas;
  const busqueda = texto.toLowerCase().trim();
  return marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(busqueda)
  );
}

// (Opcional) Función para limpiar la base de datos (para pruebas)
export async function limpiarDB() {
  try {
    await db.sql`DELETE FROM marcas`;
    console.log('Base de datos limpiada');
  } catch (error) {
    console.error('Error al limpiar BD:', error);
  }
}