// api.js
const API_URL = '/api'; // El backend sirve la API en /api

/**
 * Obtiene el token de autenticación guardado en localStorage.
 */
export function obtenerToken() {
  return localStorage.getItem('token');
}

/**
 * Guarda el token en localStorage.
 */
export function guardarToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Elimina el token (logout).
 */
export function eliminarToken() {
  localStorage.removeItem('token');
}

/**
 * Realiza una petición fetch con cabeceras opcionales de autenticación.
 * @param {string} url - Ruta del endpoint (ej. '/marcas')
 * @param {object} options - Opciones de fetch (method, body, etc.)
 */
export async function apiFetch(url, options = {}) {
  const token = obtenerToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export default API_URL;