// PWA utilities and service worker management

export const pwaUtils = {
  // Check if app is installed
  isInstalled: (): boolean => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  },

  // Check if service worker is supported
  isServiceWorkerSupported: (): boolean => {
    return 'serviceWorker' in navigator;
  },

  // Register service worker
  registerServiceWorker: async (swUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> => {
    if (!pwaUtils.isServiceWorkerSupported()) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('SW registered: ', registration);
      return registration;
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
      return null;
    }
  },

  // Unregister service worker
  unregisterServiceWorker: async (): Promise<boolean> => {
    if (!pwaUtils.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('SW unregistered');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unregistering SW:', error);
      return false;
    }
  },

  // Update service worker
  updateServiceWorker: async (): Promise<boolean> => {
    if (!pwaUtils.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('SW updated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating SW:', error);
      return false;
    }
  },

  // Check for updates
  checkForUpdates: async (): Promise<boolean> => {
    if (!pwaUtils.isServiceWorkerSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                console.log('New content is available; please refresh.');
                return true;
              }
            });
          }
        });
      }
      return false;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  },

  // Get cache size
  getCacheSize: async (): Promise<number> => {
    if (!('caches' in window)) {
      return 0;
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const clone = response.clone();
            const buffer = await clone.arrayBuffer();
            totalSize += buffer.byteLength;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  },

  // Clear all caches
  clearCaches: async (): Promise<boolean> => {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }
};

// Offline status management
export const offlineUtils = {
  // Check if online
  isOnline: (): boolean => navigator.onLine,

  // Add online/offline listeners
  addNetworkListeners: (
    onOnline: () => void,
    onOffline: () => void
  ): (() => void) => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  },

  // Queue actions for when online
  queueForOnline: (action: () => Promise<void>): void => {
    if (offlineUtils.isOnline()) {
      action();
    } else {
      const handleOnline = () => {
        action();
        window.removeEventListener('online', handleOnline);
      };
      window.addEventListener('online', handleOnline);
    }
  }
};
