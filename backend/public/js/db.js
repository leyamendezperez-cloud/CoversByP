// public/js/db.js
import { apiFetch } from './api.js';
import { 
  initDB, 
  cargarMarcas as cargarLocal, 
  crearMarca as crearLocal, 
  editarMarca as editarLocal, 
  eliminarMarca as eliminarLocal,
  syncLocalDB,
  buscarLocal 
} from './local-db.js';

// Variable de estado de conexión
let isOnline = navigator.onLine;

// Escuchar cambios de conectividad
window.addEventListener('online', () => {
  isOnline = true;
  sincronizarCambiosPendientes();
});
window.addEventListener('offline', () => {
  isOnline = false;
});

// Inicializar BD local al cargar
initDB();

// --- FUNCIONES CRUD (misma interfaz que antes) ---

// Cargar marcas (intenta online, fallback a local)
export async function cargarMarcas() {
  if (isOnline) {
    try {
      const data = await apiFetch('/api/marcas');
      // Guardar en local para futuro offline
      await syncLocalDB(data);
      return data;
    } catch (error) {
      console.warn('Error al cargar desde servidor, usando local', error);
      return await cargarLocal();
    }
  } else {
    return await cargarLocal();
  }
}

// Crear marca
export async function crearMarca(data) {
  if (isOnline) {
    try {
      const result = await apiFetch('/api/marcas', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      // Guardar en local también
      await crearLocal({ ...data, id: result.id });
      return result;
    } catch (error) {
      console.warn('Error al crear en servidor, guardando local', error);
      const tempId = -Date.now();
      await crearLocal({ ...data, id: tempId });
      guardarPendiente('crear', { ...data, id: tempId });
      return { id: tempId };
    }
  } else {
    const tempId = -Date.now();
    await crearLocal({ ...data, id: tempId });
    guardarPendiente('crear', { ...data, id: tempId });
    return { id: tempId };
  }
}

// Editar marca
export async function editarMarca(id, data) {
  if (isOnline) {
    try {
      await apiFetch(`/api/marcas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      await editarLocal(id, data);
    } catch (error) {
      console.warn('Error al editar en servidor, guardando local', error);
      await editarLocal(id, data);
      guardarPendiente('editar', { id, ...data });
    }
  } else {
    await editarLocal(id, data);
    guardarPendiente('editar', { id, ...data });
  }
}

// Eliminar marca
export async function eliminarMarca(id) {
  if (isOnline) {
    try {
      await apiFetch(`/api/marcas/${id}`, {
        method: 'DELETE'
      });
      await eliminarLocal(id);
      eliminarPendiente(id);
    } catch (error) {
      console.warn('Error al eliminar en servidor, guardando local', error);
      await eliminarLocal(id);
      guardarPendiente('eliminar', { id });
    }
  } else {
    await eliminarLocal(id);
    guardarPendiente('eliminar', { id });
  }
}

// --- FUNCIONES DE SINCRONIZACIÓN ---

// Guardar operaciones pendientes en localStorage
function guardarPendiente(tipo, datos) {
  let pendientes = JSON.parse(localStorage.getItem('pendientes') || '[]');
  pendientes.push({ tipo, datos, timestamp: Date.now() });
  localStorage.setItem('pendientes', JSON.stringify(pendientes));
}

function eliminarPendiente(id) {
  let pendientes = JSON.parse(localStorage.getItem('pendientes') || '[]');
  pendientes = pendientes.filter(p => p.datos.id !== id);
  localStorage.setItem('pendientes', JSON.stringify(pendientes));
}

// Sincronizar todos los cambios pendientes con el servidor
export async function sincronizarCambiosPendientes() {
  if (!isOnline) {
    console.log('Sin conexión, no se puede sincronizar');
    return;
  }

  const pendientes = JSON.parse(localStorage.getItem('pendientes') || '[]');
  if (pendientes.length === 0) return;

  console.log(`Sincronizando ${pendientes.length} cambios pendientes...`);

  for (const p of pendientes) {
    try {
      if (p.tipo === 'crear') {
        const { id, ...data } = p.datos;
        const result = await apiFetch('/api/marcas', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        // Reemplazar ID temporal por real
        await eliminarLocal(id);
        await crearLocal({ ...data, id: result.id });
      } else if (p.tipo === 'editar') {
        await apiFetch(`/api/marcas/${p.datos.id}`, {
          method: 'PUT',
          body: JSON.stringify(p.datos)
        });
      } else if (p.tipo === 'eliminar') {
        await apiFetch(`/api/marcas/${p.datos.id}`, {
          method: 'DELETE'
        });
      }
      eliminarPendiente(p.datos.id);
    } catch (error) {
      console.error('Error al sincronizar operación:', p, error);
    }
  }

  // Recargar datos del servidor para actualizar locales
  try {
    const marcas = await apiFetch('/api/marcas');
    await syncLocalDB(marcas);
  } catch (e) {
    console.warn('No se pudo recargar datos del servidor', e);
  }

  console.log('Sincronización completada');
}

// Exportar también la búsqueda local (ya existente)
export { buscarLocal };