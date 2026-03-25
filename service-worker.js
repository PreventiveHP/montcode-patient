const CACHE_NAME = 'montcode-v2.6-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',      // Asegúrate que sea .html
  './glucose.html',
  './food.html',
  './feedback.html',
  './manifest.json',
  './logo.png.jpg'     // ¡Importante! Si el logo no está en caché, la app no abre offline
];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('MontCode™ Rescue: Archivos blindados localmente.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN (Limpieza)
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

// 3. ESTRATEGIA: Cache First
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
