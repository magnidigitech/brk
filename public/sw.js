const CACHE_NAME = 'brk-mp-cache-v2';
const ASSETS = [
  '/',
  '/manifest.json',
  '/images/telugudesamlogo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests and ignore non-http/extensions URLs
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  const url = new URL(event.request.url);
  const isNavigate = event.request.mode === 'navigate';
  const isApi = url.pathname.startsWith('/api/');

  // Network-First strategy for documents (navigation) and API requests
  if (isNavigate || isApi) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If it is a navigate request and cache misses, return index fallback
            if (isNavigate) {
              return caches.match('/');
            }
          });
        })
    );
    return;
  }

  // Cache-First (with network fallback & cache populate) for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse && 
            networkResponse.status === 200 && 
            (networkResponse.type === 'basic' || url.origin === self.location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return null;
        });
    })
  );
});
