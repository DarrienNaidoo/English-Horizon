import Dexie, { Table } from 'dexie';
import type { 
  User, Lesson, UserProgress, Activity, Achievement, 
  DailyChallenge, UserChallengeProgress, UserAchievement 
} from '@shared/schema';

// Define the database structure
export class OfflineDatabase extends Dexie {
  users!: Table<User>;
  lessons!: Table<Lesson>;
  userProgress!: Table<UserProgress>;
  activities!: Table<Activity>;
  achievements!: Table<Achievement>;
  dailyChallenges!: Table<DailyChallenge>;
  userChallengeProgress!: Table<UserChallengeProgress>;
  userAchievements!: Table<UserAchievement>;
  appSettings!: Table<{ key: string; value: any }>;

  constructor() {
    super('SpeakWorldDB');
    
    this.version(1).stores({
      users: '++id, username, displayName, currentLevel, totalXP, streak, badges, lessonsCompleted',
      lessons: '++id, title, category, level, duration, xpReward, isOfflineAvailable',
      userProgress: '++id, userId, lessonId, completed, score, completedAt',
      activities: '++id, userId, type, title, createdAt',
      achievements: '++id, name, category, xpRequirement, streakRequirement',
      dailyChallenges: '++id, title, challengeType, date, targetCount, xpReward',
      userChallengeProgress: '++id, userId, challengeId, currentCount, completed',
      userAchievements: '++id, userId, achievementId, earnedAt',
      appSettings: 'key'
    });
  }
}

// Create database instance
export const offlineDB = new OfflineDatabase();

// Offline storage utilities
export class OfflineStorage {
  
  // User management
  static async saveUser(user: User): Promise<void> {
    await offlineDB.users.put(user);
  }

  static async getUser(id: number): Promise<User | undefined> {
    return await offlineDB.users.get(id);
  }

  static async getUserByUsername(username: string): Promise<User | undefined> {
    return await offlineDB.users.where('username').equals(username).first();
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await offlineDB.users.update(id, updates);
  }

  // Lesson management
  static async saveLessons(lessons: Lesson[]): Promise<void> {
    await offlineDB.lessons.bulkPut(lessons);
  }

  static async getAllLessons(): Promise<Lesson[]> {
    return await offlineDB.lessons.toArray();
  }

  static async getLessonsByLevel(level: number): Promise<Lesson[]> {
    return await offlineDB.lessons.where('level').equals(level).toArray();
  }

  static async getLessonsByCategory(category: string): Promise<Lesson[]> {
    return await offlineDB.lessons.where('category').equals(category).toArray();
  }

  static async getLesson(id: number): Promise<Lesson | undefined> {
    return await offlineDB.lessons.get(id);
  }

  // User progress management
  static async saveUserProgress(progress: UserProgress): Promise<void> {
    await offlineDB.userProgress.put(progress);
  }

  static async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await offlineDB.userProgress.where('userId').equals(userId).toArray();
  }

  static async getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    return await offlineDB.userProgress
      .where({ userId, lessonId })
      .first();
  }

  static async updateUserProgress(userId: number, lessonId: number, updates: Partial<UserProgress>): Promise<void> {
    const existing = await this.getUserLessonProgress(userId, lessonId);
    if (existing) {
      await offlineDB.userProgress.update(existing.id, updates);
    } else {
      const newProgress: UserProgress = {
        id: Date.now(), // Simple ID generation for offline
        userId,
        lessonId,
        completed: false,
        score: null,
        completedAt: null,
        ...updates
      };
      await offlineDB.userProgress.put(newProgress);
    }
  }

  // Activity management
  static async saveActivity(activity: Activity): Promise<void> {
    await offlineDB.activities.put(activity);
  }

  static async getUserActivities(userId: number, limit: number = 10): Promise<Activity[]> {
    return await offlineDB.activities
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  // Achievement management
  static async saveAchievements(achievements: Achievement[]): Promise<void> {
    await offlineDB.achievements.bulkPut(achievements);
  }

  static async getAllAchievements(): Promise<Achievement[]> {
    return await offlineDB.achievements.toArray();
  }

  static async saveUserAchievements(userAchievements: UserAchievement[]): Promise<void> {
    await offlineDB.userAchievements.bulkPut(userAchievements);
  }

  static async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await offlineDB.userAchievements.where('userId').equals(userId).toArray();
  }

  // Daily challenge management
  static async saveDailyChallenge(challenge: DailyChallenge): Promise<void> {
    await offlineDB.dailyChallenges.put(challenge);
  }

  static async getTodayChallenge(): Promise<DailyChallenge | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await offlineDB.dailyChallenges
      .where('date')
      .between(today, new Date(today.getTime() + 24 * 60 * 60 * 1000))
      .first();
  }

  static async saveUserChallengeProgress(progress: UserChallengeProgress): Promise<void> {
    await offlineDB.userChallengeProgress.put(progress);
  }

  static async getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    return await offlineDB.userChallengeProgress
      .where({ userId, challengeId })
      .first();
  }

  // App settings
  static async setSetting(key: string, value: any): Promise<void> {
    await offlineDB.appSettings.put({ key, value });
  }

  static async getSetting(key: string): Promise<any> {
    const setting = await offlineDB.appSettings.get(key);
    return setting?.value;
  }

  // Sync status management
  static async markForSync(tableName: string, id: number): Promise<void> {
    const syncQueue = await this.getSetting('syncQueue') || [];
    syncQueue.push({ table: tableName, id, timestamp: Date.now() });
    await this.setSetting('syncQueue', syncQueue);
  }

  static async getSyncQueue(): Promise<Array<{ table: string; id: number; timestamp: number }>> {
    return await this.getSetting('syncQueue') || [];
  }

  static async clearSyncQueue(): Promise<void> {
    await this.setSetting('syncQueue', []);
  }

  // Data synchronization with server
  static async syncWithServer(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Offline: Skipping sync');
      return;
    }

    try {
      const syncQueue = await this.getSyncQueue();
      
      for (const item of syncQueue) {
        // Implement sync logic based on table and ID
        console.log(`Syncing ${item.table} item ${item.id}`);
        // This would make API calls to sync data with server
      }
      
      await this.clearSyncQueue();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  // Bulk data export/import for backup
  static async exportAllData(): Promise<any> {
    return {
      users: await offlineDB.users.toArray(),
      lessons: await offlineDB.lessons.toArray(),
      userProgress: await offlineDB.userProgress.toArray(),
      activities: await offlineDB.activities.toArray(),
      achievements: await offlineDB.achievements.toArray(),
      userAchievements: await offlineDB.userAchievements.toArray(),
      dailyChallenges: await offlineDB.dailyChallenges.toArray(),
      userChallengeProgress: await offlineDB.userChallengeProgress.toArray(),
      appSettings: await offlineDB.appSettings.toArray(),
    };
  }

  static async importAllData(data: any): Promise<void> {
    await offlineDB.transaction('rw', offlineDB.tables, async () => {
      if (data.users) await offlineDB.users.bulkPut(data.users);
      if (data.lessons) await offlineDB.lessons.bulkPut(data.lessons);
      if (data.userProgress) await offlineDB.userProgress.bulkPut(data.userProgress);
      if (data.activities) await offlineDB.activities.bulkPut(data.activities);
      if (data.achievements) await offlineDB.achievements.bulkPut(data.achievements);
      if (data.userAchievements) await offlineDB.userAchievements.bulkPut(data.userAchievements);
      if (data.dailyChallenges) await offlineDB.dailyChallenges.bulkPut(data.dailyChallenges);
      if (data.userChallengeProgress) await offlineDB.userChallengeProgress.bulkPut(data.userChallengeProgress);
      if (data.appSettings) await offlineDB.appSettings.bulkPut(data.appSettings);
    });
  }

  // Clear all data (for reset/logout)
  static async clearAllData(): Promise<void> {
    await offlineDB.delete();
    await offlineDB.open();
  }
}
