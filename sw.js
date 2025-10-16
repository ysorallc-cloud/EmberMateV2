/**
 * EmberMate Service Worker
 * Enables offline functionality and app-like experience
 * Version: 2.0.0
 */

const CACHE_NAME = 'embermate-v2.0.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/gamification.js',
  '/gamification.css',
  '/encryption.js',
  '/encryption.css',
  '/manifest.json',
  // Add Chart.js from CDN
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js',
  // Add Crypto-JS from CDN
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'
];

// Install event - cache all resources
self.addEventListener('install', (event) => {
  console.log('EmberMate Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('EmberMate Service Worker: Caching app resources');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('EmberMate Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('EmberMate Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('EmberMate Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('EmberMate Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('EmberMate Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          console.log('EmberMate Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        console.log('EmberMate Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response (can only be consumed once)
            const responseToCache = response.clone();
            
            // Cache successful responses
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('EmberMate Service Worker: Fetch failed:', error);
            
            // Return offline page if available
            return caches.match('/offline.html')
              .then((offlineResponse) => {
                return offlineResponse || new Response(
                  'EmberMate is offline. Please check your connection.',
                  {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                      'Content-Type': 'text/plain'
                    })
                  }
                );
              });
          });
      })
  );
});

// Message event - handle commands from the app
self.addEventListener('message', (event) => {
  console.log('EmberMate Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('EmberMate Service Worker: Cache cleared');
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        console.error('EmberMate Service Worker: Cache clear failed', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// Background sync for future features
self.addEventListener('sync', (event) => {
  console.log('EmberMate Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-health-data') {
    event.waitUntil(
      // Future: sync data to user's cloud storage if configured
      Promise.resolve()
    );
  }
});

// Push notification support for future features
self.addEventListener('push', (event) => {
  console.log('EmberMate Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'EmberMate notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'embermate-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('EmberMate', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('EmberMate Service Worker: Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('EmberMate Service Worker: Loaded successfully');
