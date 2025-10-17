const CACHE_NAME = 'embermate-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add your CSS and JS files here
  // '/css/style.css',
  // '/js/app.js',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        return caches.match('/offline.html');
      })
  );
});

// Background sync for offline medication tracking
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  // Sync any pending health data when back online
  const pendingData = await getPendingData();
  if (pendingData.length > 0) {
    // Send to your backend if you have one
    console.log('Syncing pending health data:', pendingData);
  }
}

async function getPendingData() {
  // Get data from IndexedDB or localStorage
  return [];
}

// Push notifications for medication reminders
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body || 'Time to take your medication',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'medication-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'taken',
        title: 'Mark as Taken',
        icon: '/icons/check.png'
      },
      {
        action: 'snooze',
        title: 'Snooze 15 min',
        icon: '/icons/snooze.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Medication Reminder', options)
  );
});

// Handle notification actions
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'taken') {
    // Mark medication as taken
    event.waitUntil(
      clients.openWindow('/?action=mark-taken&id=' + event.notification.tag)
    );
  } else if (event.action === 'snooze') {
    // Snooze reminder
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + event.notification.tag)
    );
  } else {
    // Open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
