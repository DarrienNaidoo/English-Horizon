import { useState, useEffect, useCallback } from 'react';
import { PWAUtils } from '@/lib/pwa-utils';
import { OfflineStorage } from '@/lib/offline-storage';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Initialize PWA utilities
    PWAUtils.init();
    
    // Check initial install state
    setIsInstalled(PWAUtils.isAppInstalled());
    setIsInstallable(PWAUtils.isInstallable());

    // Setup connectivity listeners
    const cleanup = PWAUtils.setupConnectivityListeners(
      () => {
        setIsOffline(false);
        // Sync data when coming back online
        syncWithServer();
      },
      () => {
        setIsOffline(true);
      }
    );

    // Check for install prompt availability
    const checkInstallability = () => {
      setIsInstallable(PWAUtils.isInstallable());
    };

    window.addEventListener('beforeinstallprompt', checkInstallability);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      cleanup();
      window.removeEventListener('beforeinstallprompt', checkInstallability);
    };
  }, []);

  const syncWithServer = useCallback(async () => {
    if (!navigator.onLine) return;
    
    try {
      await OfflineStorage.syncWithServer();
      console.log('Data synced with server');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }, []);

  const installApp = useCallback(async () => {
    const success = await PWAUtils.showInstallPrompt();
    if (success) {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    return success;
  }, []);

  const shareApp = useCallback(async (lessonTitle?: string) => {
    const shareData = {
      title: 'SpeakWorld: English for Life',
      text: lessonTitle 
        ? `Check out this English lesson: ${lessonTitle} on SpeakWorld!`
        : 'Learn English with SpeakWorld - Interactive lessons for Chinese students',
      url: window.location.origin
    };

    return await PWAUtils.shareContent(shareData);
  }, []);

  const requestNotifications = useCallback(async () => {
    return await PWAUtils.requestNotificationPermission();
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    PWAUtils.showNotification(title, { body });
  }, []);

  const getStorageInfo = useCallback(async () => {
    return await PWAUtils.getStorageEstimate();
  }, []);

  const clearAppData = useCallback(async () => {
    await OfflineStorage.clearAllData();
    await PWAUtils.clearCache();
  }, []);

  const registerSW = useCallback(() => {
    // Service worker registration is handled by PWAUtils.init()
    console.log('Service worker registration initiated');
  }, []);

  const requestWakeLock = useCallback(async () => {
    return await PWAUtils.requestWakeLock();
  }, []);

  return {
    isOffline,
    isInstallable,
    isInstalled,
    installApp,
    shareApp,
    requestNotifications,
    showNotification,
    getStorageInfo,
    clearAppData,
    syncWithServer,
    registerSW,
    requestWakeLock,
    deviceInfo: PWAUtils.getDeviceInfo()
  };
}
