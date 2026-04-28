 const CACHE_NAME = 'montcode-glucose-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png.jpg' 
];

// Instalación: Almacenar archivos y forzar activación
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('MontCode™ Glucose: Archivos en caché');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpieza de versiones viejas y control de clientes
self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      })
    ])
  );
});

// Estrategia: Network First (Priorizar datos reales de Firebase)
self.addEventListener('fetch', (e) => {
  // Solo interceptar peticiones GET (estándar para assets estáticos)
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
