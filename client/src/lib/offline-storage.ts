// Offline storage system for classroom data and gamification features
// Works with IndexedDB for persistent local storage

interface ClassroomData {
  classrooms: any[];
  competitions: any[];
  rewards: any[];
  studentProgress: any[];
  lastSync: Date;
}

class OfflineClassroomStorage {
  private dbName = 'speakworld-classroom';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('classrooms')) {
          db.createObjectStore('classrooms', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('competitions')) {
          db.createObjectStore('competitions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('rewards')) {
          db.createObjectStore('rewards', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveClassrooms(classrooms: any[]): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['classrooms'], 'readwrite');
    const store = transaction.objectStore('classrooms');
    
    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(void 0);
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    
    // Save new data
    for (const classroom of classrooms) {
      await new Promise((resolve, reject) => {
        const request = store.add(classroom);
        request.onsuccess = () => resolve(void 0);
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getClassrooms(): Promise<any[]> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['classrooms'], 'readonly');
      const store = transaction.objectStore('classrooms');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCompetitions(competitions: any[]): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['competitions'], 'readwrite');
    const store = transaction.objectStore('competitions');
    
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(void 0);
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    
    for (const competition of competitions) {
      await new Promise((resolve, reject) => {
        const request = store.add(competition);
        request.onsuccess = () => resolve(void 0);
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getCompetitions(): Promise<any[]> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['competitions'], 'readonly');
      const store = transaction.objectStore('competitions');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateStudentProgress(studentId: string, progress: any): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    const progressData = {
      id: studentId,
      ...progress,
      lastUpdated: new Date()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(progressData);
      request.onsuccess = () => resolve(void 0);
      request.onerror = () => reject(request.error);
    });
  }

  async getStudentProgress(studentId: string): Promise<any | null> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get(studentId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async setLastSync(date: Date): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ key: 'lastSync', value: date });
      request.onsuccess = () => resolve(void 0);
      request.onerror = () => reject(request.error);
    });
  }

  async getLastSync(): Promise<Date | null> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('lastSync');
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? new Date(result.value) : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Sync with server when online
  async syncWithServer(): Promise<void> {
    if (navigator.onLine) {
      try {
        // This would sync with your actual server
        console.log('Syncing classroom data with server...');
        await this.setLastSync(new Date());
      } catch (error) {
        console.warn('Sync failed, continuing offline:', error);
      }
    }
  }

  // Check if we're in offline mode
  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Get cached data with fallback
  async getCachedOrFetch<T>(
    cacheKey: 'classrooms' | 'competitions',
    fetchFn: () => Promise<T[]>
  ): Promise<T[]> {
    try {
      if (this.isOffline()) {
        // Return cached data if offline
        if (cacheKey === 'classrooms') {
          return await this.getClassrooms() as T[];
        } else if (cacheKey === 'competitions') {
          return await this.getCompetitions() as T[];
        }
      } else {
        // Try to fetch fresh data if online
        const freshData = await fetchFn();
        
        // Cache the fresh data
        if (cacheKey === 'classrooms') {
          await this.saveClassrooms(freshData);
        } else if (cacheKey === 'competitions') {
          await this.saveCompetitions(freshData);
        }
        
        return freshData;
      }
    } catch (error) {
      console.warn(`Failed to fetch ${cacheKey}, using cached data:`, error);
      
      // Fallback to cached data
      if (cacheKey === 'classrooms') {
        return await this.getClassrooms() as T[];
      } else if (cacheKey === 'competitions') {
        return await this.getCompetitions() as T[];
      }
    }
    
    return [];
  }
}

export const offlineStorage = new OfflineClassroomStorage();

// Initialize offline storage when module loads
offlineStorage.initialize().catch(console.error);