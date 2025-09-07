// Ultra-aggressive Service Worker for instant Spline preloading
const CACHE_NAME = 'spline-cache-v2';
const SPLINE_URLS = [
  'https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode',
  'https://unpkg.com/@splinetool/runtime@0.9.508/build/spline-runtime.js',
  'https://unpkg.com/@splinetool/react-spline@2.2.6/lib/index.js'
];

// Install event - preload Spline resources immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Preload all Spline resources immediately
      return Promise.all(
        SPLINE_URLS.map(url => 
          fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'force-cache'
          }).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(() => {
            // Silently handle errors
          })
        )
      );
    })
  );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached Spline resources instantly
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Check if this is a Spline-related request
  if (SPLINE_URLS.some(splineUrl => url.includes(splineUrl) || url.includes('spline'))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached version instantly if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch and cache
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Message event - handle preload requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRELOAD_SPLINE') {
    // Preload Spline resources on demand
    caches.open(CACHE_NAME).then((cache) => {
      SPLINE_URLS.forEach(url => {
        fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'force-cache'
        }).then(response => {
          if (response.ok) {
            return cache.put(url, response);
          }
        }).catch(() => {});
      });
    });
  }
});
