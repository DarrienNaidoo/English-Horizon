import { 
  users, lessons, userProgress, achievements, userAchievements, 
  vocabulary, userVocabulary, dailyChallenges, userDailyChallenges,
  type User, type InsertUser, type Lesson, type InsertLesson,
  type UserProgress, type InsertUserProgress, type Achievement,
  type UserAchievement, type Vocabulary, type DailyChallenge
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Lessons
  getLessons(category?: string, level?: string): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  awardAchievement(userId: number, achievementId: number): Promise<UserAchievement>;

  // Vocabulary
  getVocabulary(level?: string, topic?: string): Promise<Vocabulary[]>;
  getUserVocabulary(userId: number): Promise<any[]>;

  // Daily Challenges
  getDailyChallenge(date: string): Promise<DailyChallenge | undefined>;
  getUserDailyChallenge(userId: number, challengeId: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private lessons: Map<number, Lesson> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private vocabulary: Map<number, Vocabulary> = new Map();
  private userVocabulary: Map<string, any> = new Map();
  private dailyChallenges: Map<string, DailyChallenge> = new Map();
  private userDailyChallenges: Map<string, any> = new Map();
  
  private currentUserId = 1;
  private currentLessonId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentVocabId = 1;
  private currentChallengeId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
        title: "Speaking Master",
        description: "Complete 50 speaking exercises",
        icon: "fas fa-microphone",
        category: "speaking",
        requirement: { type: "speaking_exercises", count: 50 },
        xpReward: 100,
        isSecret: false,
      },
      {
        id: this.currentAchievementId++,
        title: "Culture Explorer",
        description: "Complete all cultural content lessons",
        icon: "fas fa-pagoda",
        category: "cultural",
        requirement: { type: "cultural_lessons", count: 20 },
        xpReward: 150,
        isSecret: false,
      },
      {
        id: this.currentAchievementId++,
        title: "Vocabulary Champion",
        description: "Master 500 vocabulary words",
        icon: "fas fa-book",
        category: "vocabulary",
        requirement: { type: "vocabulary_mastered", count: 500 },
        xpReward: 200,
        isSecret: false,
      },
    ];

    sampleAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Initialize sample lessons
    const sampleLessons: Lesson[] = [
      {
        id: this.currentLessonId++,
        title: "Chinese New Year Traditions",
        description: "Learn about Chinese New Year celebrations in English",
        category: "cultural",
        level: "intermediate",
        topic: "chinese-culture",
        content: {
          type: "reading",
          text: "Chinese New Year, also known as Spring Festival, is the most important traditional holiday in China...",
          vocabulary: ["tradition", "celebration", "festival", "lunar", "reunion"],
          exercises: [
            {
              type: "multiple-choice",
              question: "When is Chinese New Year celebrated?",
              options: ["January 1st", "Based on lunar calendar", "December 25th", "May 1st"],
              correct: 1
            }
          ]
        },
        xpReward: 25,
        estimatedMinutes: 15,
        isOfflineAvailable: true,
        createdAt: new Date(),
      },
      {
        id: this.currentLessonId++,
        title: "Food and Cooking Vocabulary",
        description: "Essential cooking terms and food descriptions",
        category: "learning-paths",
        level: "beginner",
        topic: "food",
        content: {
          type: "vocabulary",
          words: [
            { word: "stir-fry", definition: "Cook quickly over high heat while stirring", pronunciation: "/ˈstɜːr fraɪ/" },
            { word: "steam", definition: "Cook with steam from boiling water", pronunciation: "/stiːm/" },
            { word: "dumpling", definition: "Small ball of dough cooked in liquid", pronunciation: "/ˈdʌmplɪŋ/" }
          ],
          exercises: [
            {
              type: "matching",
              pairs: [
                { word: "stir-fry", definition: "Cook quickly over high heat" },
                { word: "steam", definition: "Cook with steam" }
              ]
            }
          ]
        },
        xpReward: 20,
        estimatedMinutes: 10,
        isOfflineAvailable: true,
        createdAt: new Date(),
      },
      {
        id: this.currentLessonId++,
        title: "Travel Conversations",
        description: "Practice speaking about travel plans and experiences",
        category: "speaking",
        level: "intermediate",
        topic: "travel",
        content: {
          type: "speaking",
          dialogues: [
            {
              speaker: "A",
              text: "Where are you planning to go for your vacation?",
              translation: "你计划去哪里度假？"
            },
            {
              speaker: "B",
              text: "I'm thinking about visiting Beijing to see the Great Wall.",
              translation: "我在考虑去北京看长城。"
            }
          ],
          pronunciationTargets: ["vacation", "planning", "Beijing", "Great Wall"],
          exercises: [
            {
              type: "pronunciation",
              words: ["vacation", "planning", "Beijing"]
            }
          ]
        },
        xpReward: 30,
        estimatedMinutes: 20,
        isOfflineAvailable: true,
        createdAt: new Date(),
      }
    ];

    sampleLessons.forEach(lesson => {
      this.lessons.set(lesson.id, lesson);
    });

    // Initialize sample vocabulary
    const sampleVocabulary: Vocabulary[] = [
      {
        id: this.currentVocabId++,
        word: "tradition",
        definition: "A belief or custom passed down through generations",
        pronunciation: "/trəˈdɪʃən/",
        level: "intermediate",
        topic: "culture",
        exampleSentence: "Chinese New Year is an important tradition.",
        translation: "传统"
      },
      {
        id: this.currentVocabId++,
        word: "celebration",
        definition: "A special event to mark an important occasion",
        pronunciation: "/ˌseləˈbreɪʃən/",
        level: "beginner",
        topic: "culture",
        exampleSentence: "The celebration lasted for three days.",
        translation: "庆祝"
      }
    ];

    sampleVocabulary.forEach(vocab => {
      this.vocabulary.set(vocab.id, vocab);
    });

    // Initialize today's daily challenge
    const today = new Date().toISOString().split('T')[0];
    const todayChallenge: DailyChallenge = {
      id: this.currentChallengeId++,
      title: "Describe the Mid-Autumn Festival",
      description: "Use 5 new vocabulary words to describe the Mid-Autumn Festival in English",
      date: new Date(),
      content: {
        type: "writing",
        prompt: "Write a short paragraph about the Mid-Autumn Festival using these words: tradition, family, moon, celebrate, reunion",
        requiredWords: ["tradition", "family", "moon", "celebrate", "reunion"],
        minLength: 100
      },
      xpReward: 50,
      completionRequirement: { type: "writing", wordCount: 100, requiredWords: 5 }
    };

    this.dailyChallenges.set(today, todayChallenge);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      level: insertUser.level || "beginner",
      xp: insertUser.xp || 0,
      streak: insertUser.streak || 0,
      preferences: insertUser.preferences || {},
      createdAt: new Date(),
      lastActiveDate: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, lastActiveDate: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLessons(category?: string, level?: string): Promise<Lesson[]> {
    let lessons = Array.from(this.lessons.values());
    
    if (category) {
      lessons = lessons.filter(lesson => lesson.category === category);
    }
    
    if (level) {
      lessons = lessons.filter(lesson => lesson.level === level);
    }
    
    return lessons;
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const lesson: Lesson = {
      ...insertLesson,
      id: this.currentLessonId++,
      xpReward: insertLesson.xpReward || 10,
      estimatedMinutes: insertLesson.estimatedMinutes || 5,
      isOfflineAvailable: insertLesson.isOfflineAvailable || true,
      createdAt: new Date(),
    };
    this.lessons.set(lesson.id, lesson);
    return lesson;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => 
      progress.userId === userId
    );
  }

  async getUserLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${lessonId}`;
    return this.userProgress.get(key);
  }

  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const key = `${insertProgress.userId}-${insertProgress.lessonId}`;
    const existing = this.userProgress.get(key);
    
    const progress: UserProgress = {
      id: existing?.id || this.currentProgressId++,
      ...insertProgress,
      completed: insertProgress.completed || false,
      attempts: insertProgress.attempts || 1,
      score: insertProgress.score || null,
      completedAt: insertProgress.completedAt || null,
      timeSpent: insertProgress.timeSpent || null,
    };
    
    this.userProgress.set(key, progress);
    return progress;
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(ua => 
      ua.userId === userId
    );
  }

  async awardAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const key = `${userId}-${achievementId}`;
    const userAchievement: UserAchievement = {
      id: this.currentAchievementId++,
      userId,
      achievementId,
      earnedAt: new Date(),
    };
    
    this.userAchievements.set(key, userAchievement);
    return userAchievement;
  }

  async getVocabulary(level?: string, topic?: string): Promise<Vocabulary[]> {
    let vocab = Array.from(this.vocabulary.values());
    
    if (level) {
      vocab = vocab.filter(v => v.level === level);
    }
    
    if (topic) {
      vocab = vocab.filter(v => v.topic === topic);
    }
    
    return vocab;
  }

  async getUserVocabulary(userId: number): Promise<any[]> {
    return Array.from(this.userVocabulary.values()).filter(uv => 
      uv.userId === userId
    );
  }

  async getDailyChallenge(date: string): Promise<DailyChallenge | undefined> {
    return this.dailyChallenges.get(date);
  }

  async getUserDailyChallenge(userId: number, challengeId: number): Promise<any> {
    const key = `${userId}-${challengeId}`;
    return this.userDailyChallenges.get(key);
  }
}

export const storage = new MemStorage();
