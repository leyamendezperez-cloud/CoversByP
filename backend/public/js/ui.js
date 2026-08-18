// ui.js
import { estaAutenticado, logout } from "./auth.js";
import {
  cargarMarcas,
  crearMarca,
  editarMarca,
  eliminarMarca
} from "./db.js";

// Variables internas del módulo (estado)
let marcasActuales = [];
let editando = false;

// Referencias a elementos del DOM (se capturan una vez al inicializar)
let elementos;

/**
 * Inicializa el panel de administración:
 * - Verifica autenticación mediante token.
 * - Configura eventos del formulario y botones.
 * - Carga y muestra las marcas.
 */
export function inicializarPanel() {
  // Verificar autenticación
  if (!estaAutenticado()) {
    window.location.href = "login.html";
    return;
  }

  // Obtener referencias a los elementos del DOM
  elementos = {
    logoutBtn: document.getElementById("logoutBtn"),
    form: document.getElementById("marcaForm"),
    editId: document.getElementById("editId"),
    nombre: document.getElementById("nombre"),
    caja: document.getElementById("caja"),
    stock: document.getElementById("stock"),
    semejantes: document.getElementById("semejantes"),
    saveBtn: document.getElementById("saveBtn"),
    cancelBtn: document.getElementById("cancelEditBtn"),
    formTitle: document.getElementById("formTitle"),
    tablaBody: document.getElementById("tablaBody")
  };

  // Configurar eventos
  configurarEventos();

  // Cargar marcas iniciales
  refrescarMarcas();
}

/**
 * Asigna los event listeners a botones y formulario.
 */
function configurarEventos() {
  // Cerrar sesión
  elementos.logoutBtn.addEventListener("click", () => {
    logout(); // Elimina el token y redirige a login.html
  });

  // Envío del formulario (crear o actualizar)
  elementos.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nombre: elementos.nombre.value.trim(),
      caja: elementos.caja.value.trim(),
      stock: parseInt(elementos.stock.value) || 0,
      semejantes: elementos.semejantes.value
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "")
    };

    try {
      if (editando) {
        await editarMarca(elementos.editId.value, data);
      } else {
        await crearMarca(data);
      }
      resetFormulario();
      await refrescarMarcas();
    } catch (error) {
      manejarError(error);
    }
  });

  // Cancelar edición
  elementos.cancelBtn.addEventListener("click", () => {
    resetFormulario();
  });
}

/**
 * Vuelve a cargar las marcas desde el backend y actualiza la tabla.
 */
async function refrescarMarcas() {
  try {
    marcasActuales = await cargarMarcas();
    mostrarMarcas(marcasActuales);
  } catch (error) {
    manejarError(error);
  }
}

/**
 * Renderiza la tabla con las marcas dadas.
 * @param {Array} lista - Array de objetos marca con { id, nombre, caja, stock, semejantes }
 */
function mostrarMarcas(lista) {
  if (!elementos.tablaBody) return;

  elementos.tablaBody.innerHTML = "";
  lista.forEach(marca => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${marca.nombre}</td>
      <td>${marca.caja}</td>
      <td>${marca.stock}</td>
      <td>${(marca.semejantes || []).join(", ")}</td>
      <td class="container-btn-table">
        <button class="editBtn" data-id="${marca.id}"><i class="ri-pencil-line"></i></button>
        <button class="deleteBtn" data-id="${marca.id}"><i class="ri-delete-bin-5-line"></i></button>
      </td>
    `;
    elementos.tablaBody.appendChild(tr);
  });

  // Asignar eventos a los botones generados dinámicamente
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest("button").getAttribute("data-id");
      cargarFormularioParaEditar(id);
    });
  });

  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.closest("button").getAttribute("data-id");
      if (confirm("¿Eliminar esta marca?")) {
        try {
          await eliminarMarca(id);
          await refrescarMarcas();
        } catch (error) {
          manejarError(error);
        }
      }
    });
  });
}

/**
 * Carga los datos de una marca en el formulario para editar.
 * @param {string} id - ID del documento a editar.
 */
function cargarFormularioParaEditar(id) {
  const marca = marcasActuales.find(m => m.id == id); // Usamos == por si id es numérico
  if (!marca) return;

  editando = true;
  elementos.editId.value = id;
  elementos.nombre.value = marca.nombre || "";
  elementos.caja.value = marca.caja || "";
  elementos.stock.value = marca.stock || 0;
  elementos.semejantes.value = (marca.semejantes || []).join(", ");
  elementos.formTitle.textContent = "Editar Marca";
  elementos.saveBtn.textContent = "Actualizar";
  elementos.cancelBtn.style.display = "inline-block";
}

/**
 * Restablece el formulario al estado de "nueva marca".
 */
function resetFormulario() {
  editando = false;
  elementos.form.reset();
  elementos.editId.value = "";
  elementos.formTitle.textContent = "Nueva Marca";
  elementos.saveBtn.textContent = "Guardar";
  elementos.cancelBtn.style.display = "none";
}

/**
 * Maneja errores de las peticiones.
 * Si el error es 401 (no autorizado), cierra sesión y redirige al login.
 * De lo contrario, muestra el mensaje de error.
 */
function manejarError(error) {
  console.error("Error:", error);
  if (error.message && error.message.includes("401")) {
    alert("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
    logout();
  } else {
    alert("Error: " + error.message);
  }
}