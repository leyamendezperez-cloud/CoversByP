// db.js
import { apiFetch } from './api.js';

/**
 * Carga todas las marcas desde el backend.
 */
export async function cargarMarcas() {
  return await apiFetch('/marcas');
}

/**
 * Busca marcas localmente (sin backend).
 */
export function buscarLocal(termino, listaMarcas) {
  if (!termino.trim()) return listaMarcas;
  const term = termino.toLowerCase().trim();
  return listaMarcas.filter((marca) => {
    const coincideNombre = marca.nombre.toLowerCase().includes(term);
    const coincideSemejante =
      Array.isArray(marca.semejantes) &&
      marca.semejantes.some((s) => s.toLowerCase().includes(term));
    return coincideNombre || coincideSemejante;
  });
}

/**
 * Crea una nueva marca (requiere token).
 */
export async function crearMarca(data) {
  return await apiFetch('/marcas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * Actualiza una marca existente (requiere token).
 */
export async function editarMarca(id, nuevosDatos) {
  return await apiFetch(`/marcas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(nuevosDatos)
  });
}

/**
 * Elimina una marca (requiere token).
 */
export async function eliminarMarca(id) {
  return await apiFetch(`/marcas/${id}`, {
    method: 'DELETE'
  });
}