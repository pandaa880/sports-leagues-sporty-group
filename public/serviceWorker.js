// Service Worker for caching API responses and images
const CACHE_NAME = 'sports-league-cache-v1';
const IMAGE_CACHE_NAME = 'sports-league-images-v1';

// Resources to pre-cache
const PRE_CACHED_RESOURCES = ['/', '/index.html'];

// Install event - pre-cache important resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRE_CACHED_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);

  // Check if it's a TheSportsDB image
  const isTheSportsDBImage =
    url.hostname === 'www.thesportsdb.com' &&
    url.pathname.includes('/images/media/league/badgearchive/');

  return (
    request.destination === 'image' ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    isTheSportsDBImage
  );
}

// Helper to determine if a request is for API data
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.hostname === 'www.thesportsdb.com' && url.pathname.includes('/api/');
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle image requests with a cache-first strategy
  if (isImageRequest(request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise fetch from network

          // Use no-cors for TheSportsDB images to handle CORS issues
          const fetchOptions = request.url.includes('thesportsdb.com') ? { mode: 'no-cors' } : {};

          return fetch(request, fetchOptions)
            .then((networkResponse) => {
              // Cache a copy of the response (both ok and opaque responses)
              if (networkResponse.ok || networkResponse.type === 'opaque') {
                cache
                  .put(request, networkResponse.clone())
                  .catch((err) => console.error('Failed to cache:', request.url, err));
              }

              return networkResponse;
            })
            .catch((error) => {
              return new Response('Image not available', { status: 404 });
            });
        });
      })
    );
    return;
  }

  // Handle API requests with a network-first strategy
  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache a fresh copy
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return networkResponse;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(request);
        })
    );
    return;
  }

  // For all other requests, use a stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            // If fetch fails and we don't have a cached response, return offline fallback
            if (!cachedResponse) {
              return caches.match('/offline.html');
            }
          });

        // Return the cached response immediately if we have it
        return cachedResponse || fetchPromise;
      });
    })
  );
});
