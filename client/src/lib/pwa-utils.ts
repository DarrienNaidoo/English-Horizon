interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export class PWAUtils {
  private static deferredPrompt: BeforeInstallPromptEvent | null = null;
  private static isInstalled = false;

  // Initialize PWA functionality
  static init(): void {
    this.setupInstallPrompt();
    this.detectInstallation();
    this.setupServiceWorker();
  }

  // Setup install prompt handling
  private static setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      console.log('PWA install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('PWA installed successfully');
    });
  }

  // Detect if app is already installed
  private static detectInstallation(): void {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Check if running in browser but with PWA capabilities
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('PWA capabilities detected');
    }
  }

  // Setup service worker
  private static setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, prompt user to reload
                  this.showUpdateNotification();
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    }
  }

  // Show app install prompt
  static async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      
      console.log(`Install prompt outcome: ${outcome}`);
      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  // Check if install prompt is available
  static isInstallable(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  // Check if app is installed
  static isAppInstalled(): boolean {
    return this.isInstalled;
  }

  // Show update notification
  private static showUpdateNotification(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SpeakWorld Update Available', {
        body: 'A new version of SpeakWorld is available. Refresh to update.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'app-update'
      });
    } else {
      // Fallback: show in-app notification
      console.log('New app version available');
    }
  }

  // Request notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Show notification
  static showNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    }
  }

  // Check if device is online
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Setup online/offline event listeners
  static setupConnectivityListeners(
    onOnline: () => void,
    onOffline: () => void
  ): () => void {
    const handleOnline = () => {
      console.log('App is online');
      onOnline();
    };

    const handleOffline = () => {
      console.log('App is offline');
      onOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  // Get device info
  static getDeviceInfo(): {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    platform: string;
  } {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
      isMobile,
      isTablet,
      isDesktop,
      platform: navigator.platform
    };
  }

  // Share functionality
  static async shareContent(data: {
    title: string;
    text: string;
    url?: string;
  }): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(data.url || data.text);
        return true;
      } catch (error) {
        console.error('Clipboard copy failed:', error);
        return false;
      }
    }
  }

  // Wake lock (keep screen on during lessons)
  static async requestWakeLock(): Promise<WakeLockSentinel | null> {
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake lock acquired');
        return wakeLock;
      } catch (error) {
        console.error('Wake lock failed:', error);
        return null;
      }
    }
    return null;
  }

  // Check storage quota
  static async getStorageEstimate(): Promise<{
    quota: number;
    usage: number;
    available: number;
    usagePercentage: number;
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota || 0;
      const usage = estimate.usage || 0;
      const available = quota - usage;
      const usagePercentage = quota > 0 ? (usage / quota) * 100 : 0;

      return { quota, usage, available, usagePercentage };
    }

    return { quota: 0, usage: 0, available: 0, usagePercentage: 0 };
  }

  // Clear app cache
  static async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared');
    }
  }
}
