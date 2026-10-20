/* ==========================================================================
   ANIME NAVIGATOR - PROGRESSIVE WEB APP SERVICE WORKER
   Version: 1.0.0
   Features: Offline App Shell, Stale-While-Revalidate, Image Caching,
             Safe Fallback, Immediate Activation on Update
   ========================================================================== */

const CACHE_VERSION = 'anime-nav-v1.6.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Core App Shell Resources to Pre-cache
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './anibot.css',
  './app.js',
  './scripts/anibot-mascot.js',
  './scripts/anibot-knowledge.js',
  './scripts/anibot-service.js',
  './scripts/anibot-ui.js',
  './manifest.webmanifest',
  './manifest.json',
  './sitemap.xml',
  './robots.txt',
  './favicon.ico',
  './assets/icons/favicon.svg',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/Screenshot 2026-08-28 210335.png',
  './assets/Screenshot 2026-08-28 210417.png',
  './assets/Screenshot 2026-08-28 210444.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Helper: Determine if request is an image
function isImageRequest(request) {
  return (
    request.destination === 'image' ||
    request.url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/i)
  );
}

// Helper: Determine if request is a font
function isFontRequest(request) {
  return (
    request.destination === 'font' ||
    request.url.includes('fonts.gstatic.com') ||
    request.url.match(/\.(woff|woff2|ttf|otf|eot)(\?.*)?$/i)
  );
}

// -------------------------------------------------------------
// INSTALL EVENT: Pre-cache App Shell with Resilient AddAll
// -------------------------------------------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      // Use individual caching so one external CDN failure does not abort installation
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn(`[PWA SW] Pre-cache skipped for: ${url}`, err);
          }
        })
      );
    })
  );
});

// -------------------------------------------------------------
// ACTIVATE EVENT: Clean Up Old Caches & Claim Clients
// -------------------------------------------------------------
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log(`[PWA SW] Deleting obsolete cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// -------------------------------------------------------------
// FETCH EVENT: Multi-Strategy Caching Engine
// -------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) return;

  // 1. Navigation requests (User loading/reloading pages)
  // Strategy: Network-first with cache fallback to index.html for full offline support
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put('./index.html', clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match('./index.html');
          if (cached) return cached;
          return caches.match('./');
        })
    );
    return;
  }

  // 2. Images (Anime Posters & Icons)
  // Strategy: Cache-first with Network background revalidation and cache update
  if (isImageRequest(request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request, { mode: 'cors' })
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Fonts & Stylesheets (Google Fonts, Font Awesome, local CSS)
  if (isFontRequest(request)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. Same-origin Core Assets (app.js, style.css, local files)
  // Strategy: Network-First with Cache Fallback (Always fresh when online, 100% functional offline)
  const requestUrl = new URL(request.url);
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 5. Default Fallback
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// -------------------------------------------------------------
// MESSAGE EVENT: Skip Waiting & Version Queries
// -------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
