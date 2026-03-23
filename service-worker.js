const CACHE_NAME = 'montcode-v2.6-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.htm',
  '/glucose.html',
  '/food.html',
  '/feedback.html',
  '/manifest.json'
  // Si tienes iconos, añádelos aquí: '/icon-192.png'
];

// 1. INSTALACIÓN: Guarda los archivos en el caché del teléfono
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('MontCode™ Cache: Archivos blindados localmente.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpia cachés antiguos si actualizas la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. ESTRATEGIA DE CARGA: "Cache First" (Velocidad táctica)
// Busca primero en el teléfono, si no hay internet, sirve lo guardado.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
