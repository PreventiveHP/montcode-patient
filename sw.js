 const CACHE_NAME = 'montcode-glucose-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo_192.png',
  './logo_512.png'
];

// Instalación: Crea el caché con el nombre de la unidad
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[MontCode™ SW] Caching tactical assets');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpia cachés antiguos
self.addEventListener('activate', (e) => {
  console.log('[MontCode™ SW] System Active');
});

// Fetch: Permite que la app cargue rápido
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
