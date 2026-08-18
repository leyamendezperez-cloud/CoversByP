// auth.js
import { apiFetch, guardarToken, eliminarToken, obtenerToken } from './api.js';

/**
 * Inicia sesión con correo y contraseña.
 */
export async function login(correo, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password })
  });
  guardarToken(data.token);
  return data;
}

/**
 * Cierra sesión.
 */
export function logout() {
  eliminarToken();
  // Opcional: redirigir a login.html
  window.location.href = 'login.html';
}

/**
 * Verifica si hay un usuario autenticado (token presente).
 */
export function estaAutenticado() {
  return !!obtenerToken();
}