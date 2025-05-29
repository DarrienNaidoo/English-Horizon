const CACHE_NAME = 'speakworld-v1.0.0';
const API_CACHE_NAME = 'speakworld-api-v1.0.0';
const STATIC_CACHE_NAME = 'speakworld-static-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  // Add other critical assets
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/lessons',
  '/api/vocabulary',
  '/api/achievements',
  '/api/daily-challenge'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache shell for offline functionality
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll([
          '/',
          '/learning-paths',
          '/speaking-zone',
          '/games',
          '/group-activities',
          '/cultural-content',
          '/progress',
          '/profile'
        ]);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests (SPA routing)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical endpoints
    if (request.url.includes('/api/lessons') || 
        request.url.includes('/api/vocabulary')) {
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'This content is not available offline. Please check your internet connection.',
          offline: true
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to load static asset', request.url);
    throw error;
  }
}

// Handle navigation with app shell pattern
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Navigation offline, serving app shell');
    
    // Fallback to app shell
    const cachedResponse = await cache.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback - offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpeakWorld - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #F8FAFC;
            color: #1E293B;
          }
          .container {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
          }
          .logo {
            width: 64px;
            height: 64px;
            background: #3B82F6;
            border-radius: 16px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
          }
          h1 {
            margin: 0 0 1rem;
            color: #1E293B;
          }
          p {
            color: #64748B;
            margin-bottom: 2rem;
          }
          button {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
          }
          button:hover {
            background: #2563EB;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🌐</div>
          <h1>You're offline</h1>
          <p>SpeakWorld is available offline, but some features require an internet connection.</p>
          <button onclick="window.location.reload()">Try again</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Helper function to check if request is for static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncUserProgress());
  }
  
  if (event.tag === 'background-sync-lessons') {
    event.waitUntil(syncLessonData());
  }
});

// Sync user progress when back online
async function syncUserProgress() {
  try {
    console.log('Service Worker: Syncing user progress...');
    
    // Get pending progress from IndexedDB
    const pendingProgress = await getPendingProgress();
    
    if (pendingProgress.length > 0) {
      for (const progress of pendingProgress) {
        try {
          const response = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progress)
          });
          
          if (response.ok) {
            await removePendingProgress(progress.id);
            console.log('Service Worker: Progress synced successfully');
          }
        } catch (error) {
          console.error('Service Worker: Failed to sync progress item', error);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Sync lesson data
async function syncLessonData() {
  try {
    console.log('Service Worker: Syncing lesson data...');
    
    // Fetch and cache latest lessons
    const response = await fetch('/api/lessons');
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put('/api/lessons', response.clone());
      console.log('Service Worker: Lesson data synced');
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync lesson data', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingProgress() {
  // In a real implementation, this would interact with IndexedDB
  // For now, return empty array
  return [];
}

async function removePendingProgress(id) {
  // In a real implementation, this would remove the item from IndexedDB
  console.log('Service Worker: Removing pending progress', id);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Time for your daily English practice!',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/manifest-icon-192.png'
      },
      {
        action: 'close',
        title: 'Later',
        icon: '/manifest-icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SpeakWorld Daily Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app to the learning paths page
    event.waitUntil(
      self.clients.openWindow('/learning-paths')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_LESSONS') {
    event.waitUntil(cacheLessons(event.data.lessons));
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
});

// Cache lessons for offline use
async function cacheLessons(lessons) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    
    for (const lesson of lessons) {
      const request = new Request(`/api/lessons/${lesson.id}`);
      const response = new Response(JSON.stringify(lesson), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      await cache.put(request, response);
    }
    
    console.log('Service Worker: Lessons cached for offline use');
  } catch (error) {
    console.error('Service Worker: Failed to cache lessons', error);
  }
}

// Get total cache size
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        try {
          const response = await cache.match(request);
          if (response) {
            const responseClone = response.clone();
            const buffer = await responseClone.arrayBuffer();
            totalSize += buffer.byteLength;
          }
        } catch (error) {
          // Skip errored responses
          console.warn('Service Worker: Error calculating size for', request.url);
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Service Worker: Error calculating cache size', error);
    return 0;
  }
}

// Periodic background sync for lesson updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'lesson-updates') {
    event.waitUntil(syncLessonData());
  }
});

console.log('Service Worker: Script loaded successfully');
