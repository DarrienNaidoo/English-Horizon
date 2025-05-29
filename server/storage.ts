import { 
  users, lessons, userProgress, achievements, userAchievements, 
  dailyChallenges, userChallengeProgress, activities,
  type User, type InsertUser, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type Achievement,
  type UserAchievement, type DailyChallenge, type UserChallengeProgress,
  type Activity, type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Lessons
  getAllLessons(): Promise<Lesson[]>;
  getLessonsByLevel(level: number): Promise<Lesson[]>;
  getLessonsByCategory(category: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, lessonId: number, progress: Partial<UserProgress>): Promise<UserProgress>;

  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  addUserAchievement(userId: number, achievementId: number): Promise<UserAchievement>;

  // Daily Challenges
  getTodayChallenge(): Promise<DailyChallenge | undefined>;
  getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined>;
  updateChallengeProgress(userId: number, challengeId: number, progress: Partial<UserChallengeProgress>): Promise<UserChallengeProgress>;

  // Activities
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  addActivity(activity: InsertActivity): Promise<Activity>;

  // Adaptive Learning
  getUserAnalytics(userId: number): Promise<LearningAnalytics | undefined>;
  updateUserAnalytics(userId: number, analytics: InsertLearningAnalytics): Promise<LearningAnalytics>;
  getUserRecommendations(userId: number): Promise<PersonalizedRecommendation[]>;
  addRecommendation(recommendation: InsertPersonalizedRecommendation): Promise<PersonalizedRecommendation>;
  markRecommendationCompleted(recommendationId: number): Promise<void>;
  getUserFeedback(userId: number, limit?: number): Promise<AdaptiveFeedback[]>;
  addFeedback(feedback: InsertAdaptiveFeedback): Promise<AdaptiveFeedback>;
  markFeedbackRead(feedbackId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private dailyChallenges: Map<number, DailyChallenge> = new Map();
  private userChallengeProgress: Map<string, UserChallengeProgress> = new Map();
  private activities: Map<number, Activity> = new Map();
  
  private currentUserId = 1;
  private currentLessonId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  private currentChallengeId = 1;
  private currentUserChallengeProgressId = 1;
  private currentActivityId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "liming",
      displayName: "李明 (Li Ming)",
      currentLevel: 3,
      totalXP: 1250,
      streak: 7,
      badges: 12,
      lessonsCompleted: 28,
      role: "student",
      preferredLanguage: "both",
      createdAt: new Date(),
    };
    this.users.set(1, sampleUser);

    // Create sample lessons
    const sampleLessons: Lesson[] = [
      {
        id: 1,
        title: "Chinese New Year Traditions",
        description: "Learn to describe traditional Chinese festivals in English. Practice cultural vocabulary and storytelling.",
        content: {
          vocabulary: ["celebration", "tradition", "festival", "family", "reunion"],
          exercises: [
            { type: "vocabulary", words: ["红包", "春联", "团圆饭"] },
            { type: "speaking", prompt: "Describe your favorite Chinese New Year tradition" }
          ]
        },
        duration: 15,
        xpReward: 50,
        level: 3,
        category: "Cultural",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3",
        isOfflineAvailable: true,
      },
      {
        id: 2,
        title: "Food & Cooking Vocabulary",
        description: "Master essential cooking and food vocabulary through interactive exercises.",
        content: {
          vocabulary: ["ingredient", "recipe", "delicious", "spicy", "sweet"],
          exercises: [
            { type: "matching", pairs: [["rice", "米饭"], ["noodles", "面条"]] },
            { type: "speaking", prompt: "Describe your favorite Chinese dish" }
          ]
        },
        duration: 20,
        xpReward: 30,
        level: 2,
        category: "Vocabulary",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58e637e7e5e8?ixlib=rb-4.0.3",
        isOfflineAvailable: true,
      },
      {
        id: 3,
        title: "School Life Conversations",
        description: "Practice everyday school conversations and academic vocabulary.",
        content: {
          vocabulary: ["homework", "classmate", "teacher", "study", "exam"],
          exercises: [
            { type: "dialogue", scenario: "Asking for help with homework" },
            { type: "role-play", situation: "Introducing yourself to new classmates" }
          ]
        },
        duration: 25,
        xpReward: 40,
        level: 2,
        category: "Conversation",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3",
        isOfflineAvailable: true,
      }
    ];

    sampleLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Create sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: 1,
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "fas fa-baby",
        category: "milestone",
        xpRequirement: null,
        streakRequirement: null,
      },
      {
        id: 2,
        name: "Pronunciation Pro",
        description: "Achieve 90% accuracy in speaking exercises",
        icon: "fas fa-microphone",
        category: "speaking",
        xpRequirement: null,
        streakRequirement: null,
      },
      {
        id: 3,
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        icon: "fas fa-fire",
        category: "streak",
        xpRequirement: null,
        streakRequirement: 7,
      }
    ];

    sampleAchievements.forEach(achievement => this.achievements.set(achievement.id, achievement));

    // Create today's challenge
    const todayChallenge: DailyChallenge = {
      id: 1,
      title: "Speaking Champion",
      description: "Complete 3 speaking exercises to earn bonus XP!",
      targetCount: 3,
      xpReward: 100,
      challengeType: "speaking",
      date: new Date(),
    };
    this.dailyChallenges.set(1, todayChallenge);

    // Create sample activities
    const sampleActivities: Activity[] = [
      {
        id: 1,
        userId: 1,
        type: "lesson_completed",
        title: 'Completed "Food & Cooking" lesson',
        description: "+30 XP • 2 hours ago",
        xpGained: 30,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        userId: 1,
        type: "badge_earned",
        title: 'Earned "Pronunciation Pro" badge',
        description: "Speaking accuracy > 90%",
        xpGained: 0,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: 3,
        userId: 1,
        type: "group_activity",
        title: "Joined group debate session",
        description: "Topic: Social Media Impact",
        xpGained: 0,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      }
    ];

    sampleActivities.forEach(activity => this.activities.set(activity.id, activity));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      currentLevel: insertUser.currentLevel ?? 1,
      totalXP: insertUser.totalXP ?? 0,
      streak: insertUser.streak ?? 0,
      badges: insertUser.badges ?? 0,
      lessonsCompleted: insertUser.lessonsCompleted ?? 0,
      role: insertUser.role ?? "student",
      preferredLanguage: insertUser.preferredLanguage ?? "en"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async getLessonsByLevel(level: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(lesson => lesson.level === level);
  }

  async getLessonsByCategory(category: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(lesson => lesson.category === category);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      imageUrl: insertLesson.imageUrl ?? null,
      isOfflineAvailable: insertLesson.isOfflineAvailable ?? true
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${lessonId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(userId: number, lessonId: number, progress: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${lessonId}`;
    const existing = this.userProgress.get(key);
    
    const updated: UserProgress = {
      id: existing?.id || this.currentProgressId++,
      userId,
      lessonId,
      completed: false,
      score: null,
      completedAt: null,
      ...existing,
      ...progress,
    };
    
    if (progress.completed && !existing?.completed) {
      updated.completedAt = new Date();
    }
    
    this.userProgress.set(key, updated);
    return updated;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(ua => ua.userId === userId);
  }

  async addUserAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      earnedAt: new Date(),
    };
    
    const key = `${userId}-${achievementId}`;
    this.userAchievements.set(key, userAchievement);
    return userAchievement;
  }

  async getTodayChallenge(): Promise<DailyChallenge | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.dailyChallenges.values()).find(challenge => {
      const challengeDate = new Date(challenge.date);
      challengeDate.setHours(0, 0, 0, 0);
      return challengeDate.getTime() === today.getTime();
    });
  }

  async getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    const key = `${userId}-${challengeId}`;
    return this.userChallengeProgress.get(key);
  }

  async updateChallengeProgress(userId: number, challengeId: number, progress: Partial<UserChallengeProgress>): Promise<UserChallengeProgress> {
    const key = `${userId}-${challengeId}`;
    const existing = this.userChallengeProgress.get(key);
    
    const updated: UserChallengeProgress = {
      id: existing?.id || this.currentUserChallengeProgressId++,
      userId,
      challengeId,
      currentCount: 0,
      completed: false,
      completedAt: null,
      ...existing,
      ...progress,
    };
    
    if (progress.completed && !existing?.completed) {
      updated.completedAt = new Date();
    }
    
    this.userChallengeProgress.set(key, updated);
    return updated;
  }

  async getUserActivities(userId: number, limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async addActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
      description: insertActivity.description ?? null,
      xpGained: insertActivity.xpGained ?? null,
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Adaptive Learning Methods
  async getUserAnalytics(userId: number): Promise<LearningAnalytics | undefined> {
    return Array.from(this.learningAnalytics.values()).find(analytics => analytics.userId === userId);
  }

  async updateUserAnalytics(userId: number, insertAnalytics: InsertLearningAnalytics): Promise<LearningAnalytics> {
    const existing = await this.getUserAnalytics(userId);
    
    if (existing) {
      const updated: LearningAnalytics = {
        ...existing,
        ...insertAnalytics,
        lastAnalysis: new Date(),
      };
      this.learningAnalytics.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentAnalyticsId++;
      const analytics: LearningAnalytics = {
        ...insertAnalytics,
        id,
        lastAnalysis: new Date(),
        createdAt: new Date(),
      };
      this.learningAnalytics.set(id, analytics);
      return analytics;
    }
  }

  async getUserRecommendations(userId: number): Promise<PersonalizedRecommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.userId === userId && !rec.isCompleted)
      .sort((a, b) => b.priority - a.priority);
  }

  async addRecommendation(insertRecommendation: InsertPersonalizedRecommendation): Promise<PersonalizedRecommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: PersonalizedRecommendation = {
      ...insertRecommendation,
      id,
      isCompleted: false,
      createdAt: new Date(),
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async markRecommendationCompleted(recommendationId: number): Promise<void> {
    const recommendation = this.recommendations.get(recommendationId);
    if (recommendation) {
      recommendation.isCompleted = true;
      this.recommendations.set(recommendationId, recommendation);
    }
  }

  async getUserFeedback(userId: number, limit = 10): Promise<AdaptiveFeedback[]> {
    return Array.from(this.adaptiveFeedback.values())
      .filter(feedback => feedback.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async addFeedback(insertFeedback: InsertAdaptiveFeedback): Promise<AdaptiveFeedback> {
    const id = this.currentFeedbackId++;
    const feedback: AdaptiveFeedback = {
      ...insertFeedback,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.adaptiveFeedback.set(id, feedback);
    return feedback;
  }

  async markFeedbackRead(feedbackId: number): Promise<void> {
    const feedback = this.adaptiveFeedback.get(feedbackId);
    if (feedback) {
      feedback.isRead = true;
      this.adaptiveFeedback.set(feedbackId, feedback);
    }
  }
}

export const storage = new MemStorage();
