/**
 * Aviator Predictor Pro Service Worker
 * Enables ultra-fast startup and true offline capability for PWA/APK wrappers.
 */

const CACHE_NAME = "aviator-pro-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/icon-maskable.svg"
];

// Install Event - Pre-cache minimal critical shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline gate shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up any old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Cleaning old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first with network-fallback strategy for cached assets,
// network-first for index.html/main streams
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Serve static UI assets from cache first, then fetch from network if missing
  if (ASSETS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // For other files, default to network first
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback to cache index.html for navigation when offline
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
        return caches.match(event.request);
      })
    );
  }
});
