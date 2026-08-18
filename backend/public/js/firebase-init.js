/*  Inicialización de Firebase (config y servicios) */
// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvQW_anwHkPq5-wlJRRPTuccmIvhdStoY",
  authDomain: "coversbyp-f8487.firebaseapp.com",
  projectId: "coversbyp-f8487",
  storageBucket: "coversbyp-f8487.firebasestorage.app",
  messagingSenderId: "412444192242",
  appId: "1:412444192242:web:11fa496571b153fc3f4f6b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Habilita la persistencia offline (cache en IndexedDB)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("La persistencia offline no pudo activarse: múltiples pestañas abiertas.");
    } else if (err.code === 'unimplemented') {
      console.warn("El navegador no soporta persistencia offline.");
    }
  });

// Exporta las instancias para usarlas en otros módulos
export { db, auth };