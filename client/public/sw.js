const CACHE_NAME = 'speakworld-v1.0.0';
const STATIC_CACHE_NAME = 'speakworld-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'speakworld-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  // Core app files
  '/src/App.tsx',
  '/src/pages/dashboard.tsx',
  '/src/pages/learning-paths.tsx',
  '/src/pages/speaking-zone.tsx',
  '/src/pages/games.tsx',
  '/src/pages/progress.tsx',
  '/src/components/navigation.tsx',
  '/src/components/bottom-navigation.tsx',
  '/src/components/offline-indicator.tsx',
  // Lib files
  '/src/lib/queryClient.ts',
  '/src/lib/utils.ts',
  '/src/lib/offline-storage.ts',
  '/src/lib/pwa-utils.ts',
  // Hooks
  '/src/hooks/use-offline.ts',
  '/src/hooks/use-local-storage.ts',
  '/src/hooks/use-mobile.tsx',
  '/src/hooks/use-toast.ts'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/user\//,
  /^\/api\/lessons/,
  /^\/api\/achievements/,
  /^\/api\/challenge\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content and implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API requests - Network First strategy
      event.respondWith(handleApiRequest(request));
    } else if (isStaticAsset(url.pathname)) {
      // Static assets - Cache First strategy
      event.respondWith(handleStaticAsset(request));
    } else {
      // HTML pages - Network First with fallback
      event.respondWith(handlePageRequest(request));
    }
  }
});

// Handle API requests with Network First strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses for offline use
      if (shouldCacheApiResponse(url.pathname)) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Network failed, try cache
    console.log('API network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for specific endpoints
    return createOfflineFallback(url.pathname);
  }
}

// Handle static assets with Cache First strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Not in cache, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle page requests with Network First strategy
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page fallback
    const offlineResponse = await caches.match('/');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Last resort fallback
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>SpeakWorld - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #F9FAFB;
            color: #1F2937;
          }
          .offline-icon { 
            font-size: 64px; 
            margin-bottom: 20px; 
          }
          .offline-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px; 
          }
          .offline-message { 
            font-size: 16px; 
            color: #6B7280; 
            margin-bottom: 30px; 
          }
          .retry-button {
            background: #2563EB;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="offline-icon">📱</div>
        <div class="offline-title">You're Offline</div>
        <div class="offline-message">
          SpeakWorld is running in offline mode.<br>
          Some features may be limited until you're back online.
        </div>
        <button class="retry-button" onclick="window.location.reload()">
          Try Again
        </button>
      </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Check if a path is a static asset
function isStaticAsset(pathname) {
  return pathname.includes('/src/') || 
         pathname.includes('/assets/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.tsx') ||
         pathname.endsWith('.ts') ||
         pathname.endsWith('.json');
}

// Check if API response should be cached
function shouldCacheApiResponse(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

// Create offline fallback responses for API endpoints
function createOfflineFallback(pathname) {
  if (pathname.includes('/api/user/')) {
    return new Response(JSON.stringify({
      message: 'Offline mode - user data unavailable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (pathname.includes('/api/lessons')) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    message: 'This content is not available offline'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-user-progress') {
    event.waitUntil(syncUserProgress());
  } else if (event.tag === 'sync-activities') {
    event.waitUntil(syncActivities());
  }
});

// Sync user progress when back online
async function syncUserProgress() {
  try {
    console.log('Syncing user progress...');
    // Implementation would read from IndexedDB and sync with server
    // This is handled by the OfflineStorage class in the main app
  } catch (error) {
    console.error('Failed to sync user progress:', error);
  }
}

// Sync activities when back online
async function syncActivities() {
  try {
    console.log('Syncing activities...');
    // Implementation would read from IndexedDB and sync with server
  } catch (error) {
    console.error('Failed to sync activities:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: 'Time for your daily English practice!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-reminder',
    data: {
      action: 'open-app',
      url: '/'
    },
    actions: [
      {
        action: 'start-lesson',
        title: 'Start Lesson',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Later',
        icon: '/icon-192.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification('SpeakWorld', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'start-lesson') {
    event.waitUntil(
      clients.openWindow('/?notification=lesson')
    );
  } else if (event.action !== 'dismiss') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Handle periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  if (event.tag === 'daily-sync') {
    event.waitUntil(performDailySync());
  }
});

// Perform daily sync operations
async function performDailySync() {
  try {
    console.log('Performing daily sync...');
    // Sync lesson progress, download new content, etc.
  } catch (error) {
    console.error('Daily sync failed:', error);
  }
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_LESSON') {
    // Cache specific lesson data
    event.waitUntil(cacheLessonData(event.data.lessonId));
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    // Clear all caches
    event.waitUntil(clearAllCaches());
  }
});

// Cache specific lesson data
async function cacheLessonData(lessonId) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const lessonUrl = `/api/lessons/${lessonId}`;
    
    const response = await fetch(lessonUrl);
    if (response.ok) {
      await cache.put(lessonUrl, response);
      console.log(`Cached lesson ${lessonId} for offline use`);
    }
  } catch (error) {
    console.error(`Failed to cache lesson ${lessonId}:`, error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}
