// backend/public/sw.js

const CACHE_NAME = "coversbyp-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/admin.html",
    "/login.html",
    "/css/index.css",
    "/css/login.css",
    "/css/admin.css",
    "/js/ui.js",
    "/js/api.js",
    "/js/db.js",
    "/js/auth.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
];

// Evento 'install': guarda en caché los recursos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache abierta");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error("Error al cachear recursos:", err)),
  );
});

// Evento 'activate': elimina cachés antiguas
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Evento 'fetch': sirve desde caché o desde red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devuelve
      if (response) {
        return response;
      }
      // Si no, intenta obtenerlo de la red
      return fetch(event.request)
        .then((response) => {
          // Clona la respuesta para guardarla en caché
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Guarda solo respuestas exitosas
            if (response.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
          return response;
        })
        .catch((error) => {
          // Si falla la red y no está en caché, podrías mostrar una página offline
          console.error("Fetch falló:", error);
          // Opcional: devolver una respuesta de fallback
          // return caches.match('/offline.html');
        });
    }),
  );
});
