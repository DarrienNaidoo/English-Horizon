// Advanced achievement and gamification system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'social' | 'streak' | 'skill' | 'milestone' | 'special';
  type: 'badge' | 'certificate' | 'trophy' | 'title';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  icon: string;
  points: number;
  rarity: number; // 0-100, lower = rarer
  isHidden: boolean;
  prerequisites: string[];
  expirationDate?: Date;
  seasonalEvent?: string;
}

export interface AchievementRequirement {
  type: 'activity_count' | 'score_threshold' | 'streak_length' | 'time_spent' | 'completion_rate' | 'social_interaction';
  target: number;
  metric: string;
  timeframe?: string; // 'daily', 'weekly', 'monthly', 'all_time'
  specifics?: { [key: string]: any };
}

export interface AchievementReward {
  type: 'points' | 'title' | 'avatar_item' | 'feature_unlock' | 'discount' | 'content_access';
  value: string | number;
  description: string;
  permanent: boolean;
  duration?: number; // days if not permanent
}

export interface UserAchievement {
  userId: number;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100
  isCompleted: boolean;
  notificationSent: boolean;
  shareCount: number;
  celebrationViewed: boolean;
}

export interface LearningStreak {
  userId: number;
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'weekly' | 'monthly';
  lastActivityDate: Date;
  streakStartDate: Date;
  milestones: StreakMilestone[];
  freezeCount: number; // streak savers used
  maxFreezes: number;
}

export interface StreakMilestone {
  days: number;
  reachedAt?: Date;
  rewardClaimed: boolean;
  rewardType: string;
  rewardValue: string;
}

export interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  challenges: EventChallenge[];
  leaderboards: EventLeaderboard[];
  specialRewards: Achievement[];
  participantCount: number;
  isActive: boolean;
}

export interface EventChallenge {
  id: string;
  eventId: string;
  title: string;
  description: string;
  objective: string;
  difficulty: string;
  duration: number; // days
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  participantLimit?: number;
  teamBased: boolean;
  progress: Map<number, number>; // userId -> progress
}

export interface EventLeaderboard {
  id: string;
  eventId: string;
  category: string;
  timeframe: 'daily' | 'weekly' | 'event_total';
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
  prizes: LeaderboardPrize[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  displayName: string;
  score: number;
  change: number; // rank change from previous period
  avatar?: string;
  title?: string;
  country?: string;
}

export interface LeaderboardPrize {
  rankStart: number;
  rankEnd: number;
  description: string;
  rewards: AchievementReward[];
}

export interface UserProfile {
  userId: number;
  level: number;
  totalPoints: number;
  title: string;
  avatar: string;
  badges: string[];
  displayAchievements: string[];
  socialSettings: SocialSettings;
  stats: UserStats;
  preferences: UserPreferences;
}

export interface SocialSettings {
  shareAchievements: boolean;
  showProgress: boolean;
  allowFriendRequests: boolean;
  showOnLeaderboard: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
}

export interface UserStats {
  totalStudyTime: number; // minutes
  lessonsCompleted: number;
  exercisesCompleted: number;
  averageAccuracy: number;
  streakRecord: number;
  friendsCount: number;
  helpfulContributions: number;
  teachingHours: number;
}

export interface UserPreferences {
  celebrationStyle: 'full' | 'minimal' | 'none';
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  motivationalMessages: boolean;
  competitiveMode: boolean;
  difficultyPreference: string;
}

export interface FriendConnection {
  userId1: number;
  userId2: number;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: Date;
  acceptedAt?: Date;
  mutualFriends: number;
  sharedAchievements: string[];
  competitiveStats: CompetitiveStats;
}

export interface CompetitiveStats {
  weeklyComparison: {
    user1Points: number;
    user2Points: number;
    user1Activities: number;
    user2Activities: number;
  };
  allTimeComparison: {
    user1Level: number;
    user2Level: number;
    user1Achievements: number;
    user2Achievements: number;
  };
}

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement[]> = new Map();
  private learningStreaks: Map<number, LearningStreak> = new Map();
  private seasonalEvents: Map<string, SeasonalEvent> = new Map();
  private userProfiles: Map<number, UserProfile> = new Map();
  private friendConnections: Map<string, FriendConnection> = new Map();

  constructor() {
    this.initializeAchievements();
    this.initializeSeasonalEvents();
    this.initializeSampleProfiles();
  }

  private initializeAchievements(): void {
    const achievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        category: 'learning',
        type: 'badge',
        difficulty: 'bronze',
        requirements: [
          {
            type: 'activity_count',
            target: 1,
            metric: 'lessons_completed'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 10,
            description: '10 learning points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Beginner',
            description: 'Unlock the "Beginner" title',
            permanent: true
          }
        ],
        icon: 'graduation-cap',
        points: 10,
        rarity: 95,
        isHidden: false,
        prerequisites: []
      },
      {
        id: 'vocabulary-master',
        title: 'Vocabulary Master',
        description: 'Learn 500 new vocabulary words',
        category: 'learning',
        type: 'certificate',
        difficulty: 'gold',
        requirements: [
          {
            type: 'activity_count',
            target: 500,
            metric: 'vocabulary_learned'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 250,
            description: '250 learning points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Word Wizard',
            description: 'Unlock the "Word Wizard" title',
            permanent: true
          },
          {
            type: 'feature_unlock',
            value: 'advanced_vocabulary_tools',
            description: 'Access to advanced vocabulary learning tools',
            permanent: true
          }
        ],
        icon: 'book-open',
        points: 250,
        rarity: 25,
        isHidden: false,
        prerequisites: ['first-lesson']
      },
      {
        id: 'grammar-guru',
        title: 'Grammar Guru',
        description: 'Achieve 90% accuracy in grammar exercises for 30 days',
        category: 'skill',
        type: 'trophy',
        difficulty: 'platinum',
        requirements: [
          {
            type: 'score_threshold',
            target: 90,
            metric: 'grammar_accuracy',
            timeframe: 'daily',
            specifics: { consecutive_days: 30 }
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 500,
            description: '500 learning points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Grammar Guru',
            description: 'Elite grammar mastery title',
            permanent: true
          },
          {
            type: 'avatar_item',
            value: 'golden_graduation_cap',
            description: 'Golden graduation cap avatar item',
            permanent: true
          }
        ],
        icon: 'award',
        points: 500,
        rarity: 5,
        isHidden: false,
        prerequisites: ['vocabulary-master']
      },

      // Streak Achievements
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        category: 'streak',
        type: 'badge',
        difficulty: 'bronze',
        requirements: [
          {
            type: 'streak_length',
            target: 7,
            metric: 'daily_activity'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 50,
            description: '50 streak points',
            permanent: true
          },
          {
            type: 'feature_unlock',
            value: 'streak_freeze',
            description: 'Unlock streak freeze ability',
            permanent: true
          }
        ],
        icon: 'fire',
        points: 50,
        rarity: 60,
        isHidden: false,
        prerequisites: []
      },
      {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Achieve a 100-day learning streak',
        category: 'streak',
        type: 'trophy',
        difficulty: 'legendary',
        requirements: [
          {
            type: 'streak_length',
            target: 100,
            metric: 'daily_activity'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 1000,
            description: '1000 streak points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Unstoppable',
            description: 'Legendary persistence title',
            permanent: true
          },
          {
            type: 'avatar_item',
            value: 'flame_crown',
            description: 'Legendary flame crown',
            permanent: true
          }
        ],
        icon: 'crown',
        points: 1000,
        rarity: 1,
        isHidden: true,
        prerequisites: ['week-warrior']
      },

      // Social Achievements
      {
        id: 'helpful-friend',
        title: 'Helpful Friend',
        description: 'Help 10 other learners with corrections or tips',
        category: 'social',
        type: 'badge',
        difficulty: 'silver',
        requirements: [
          {
            type: 'social_interaction',
            target: 10,
            metric: 'helpful_contributions'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 100,
            description: '100 community points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Helper',
            description: 'Community helper title',
            permanent: true
          }
        ],
        icon: 'users',
        points: 100,
        rarity: 40,
        isHidden: false,
        prerequisites: []
      },

      // Milestone Achievements
      {
        id: 'time-dedication',
        title: 'Dedicated Learner',
        description: 'Spend 100 hours learning English',
        category: 'milestone',
        type: 'certificate',
        difficulty: 'gold',
        requirements: [
          {
            type: 'time_spent',
            target: 6000, // 100 hours in minutes
            metric: 'total_study_time'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 300,
            description: '300 dedication points',
            permanent: true
          },
          {
            type: 'title',
            value: 'Dedicated Learner',
            description: 'Time dedication recognition',
            permanent: true
          }
        ],
        icon: 'clock',
        points: 300,
        rarity: 20,
        isHidden: false,
        prerequisites: []
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeSeasonalEvents(): void {
    const events: SeasonalEvent[] = [
      {
        id: 'spring-challenge-2024',
        title: 'Spring Learning Challenge',
        description: 'Celebrate spring with intensive English learning challenges',
        theme: 'nature_and_growth',
        startDate: new Date('2024-03-20'),
        endDate: new Date('2024-04-20'),
        challenges: [
          {
            id: 'spring-vocabulary',
            eventId: 'spring-challenge-2024',
            title: 'Spring Vocabulary Sprint',
            description: 'Learn 100 spring-themed vocabulary words',
            objective: 'Master seasonal vocabulary',
            difficulty: 'intermediate',
            duration: 7,
            requirements: [
              {
                type: 'activity_count',
                target: 100,
                metric: 'spring_vocabulary_learned',
                timeframe: 'weekly'
              }
            ],
            rewards: [
              {
                type: 'points',
                value: 200,
                description: 'Spring challenge points',
                permanent: true
              },
              {
                type: 'avatar_item',
                value: 'spring_flower_crown',
                description: 'Exclusive spring flower crown',
                permanent: true
              }
            ],
            teamBased: false,
            progress: new Map()
          }
        ],
        leaderboards: [
          {
            id: 'spring-daily-board',
            eventId: 'spring-challenge-2024',
            category: 'daily_progress',
            timeframe: 'daily',
            rankings: [],
            lastUpdated: new Date(),
            prizes: [
              {
                rankStart: 1,
                rankEnd: 1,
                description: 'Daily champion',
                rewards: [
                  {
                    type: 'points',
                    value: 50,
                    description: 'Daily winner bonus',
                    permanent: true
                  }
                ]
              }
            ]
          }
        ],
        specialRewards: [],
        participantCount: 0,
        isActive: false
      }
    ];

    events.forEach(event => {
      this.seasonalEvents.set(event.id, event);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserProfile = {
      userId: 1,
      level: 15,
      totalPoints: 2350,
      title: 'Grammar Enthusiast',
      avatar: 'student_avatar_1',
      badges: ['first-lesson', 'week-warrior', 'helpful-friend'],
      displayAchievements: ['grammar-guru', 'vocabulary-master'],
      socialSettings: {
        shareAchievements: true,
        showProgress: true,
        allowFriendRequests: true,
        showOnLeaderboard: true,
        profileVisibility: 'public'
      },
      stats: {
        totalStudyTime: 3600, // 60 hours
        lessonsCompleted: 145,
        exercisesCompleted: 320,
        averageAccuracy: 87,
        streakRecord: 45,
        friendsCount: 12,
        helpfulContributions: 28,
        teachingHours: 15
      },
      preferences: {
        celebrationStyle: 'full',
        notificationFrequency: 'immediate',
        motivationalMessages: true,
        competitiveMode: true,
        difficultyPreference: 'adaptive'
      }
    };

    this.userProfiles.set(1, sampleProfile);
  }

  // Achievement checking and unlocking
  checkAndUnlockAchievements(userId: number, activityData: { [metric: string]: number }): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    const userAchievements = this.userAchievements.get(userId.toString()) || [];
    const completedIds = new Set(userAchievements.filter(ua => ua.isCompleted).map(ua => ua.achievementId));

    for (const achievement of this.achievements.values()) {
      // Skip if already completed
      if (completedIds.has(achievement.id)) continue;

      // Check prerequisites
      if (!this.checkPrerequisites(achievement.prerequisites, completedIds)) continue;

      // Check requirements
      if (this.checkRequirements(achievement.requirements, activityData)) {
        this.unlockAchievement(userId, achievement.id);
        unlockedAchievements.push(achievement);
      }
    }

    return unlockedAchievements;
  }

  private checkPrerequisites(prerequisites: string[], completedIds: Set<string>): boolean {
    return prerequisites.every(prereq => completedIds.has(prereq));
  }

  private checkRequirements(requirements: AchievementRequirement[], activityData: { [metric: string]: number }): boolean {
    return requirements.every(req => {
      const userValue = activityData[req.metric] || 0;
      return userValue >= req.target;
    });
  }

  private unlockAchievement(userId: number, achievementId: string): void {
    const userAchievements = this.userAchievements.get(userId.toString()) || [];
    
    const userAchievement: UserAchievement = {
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 100,
      isCompleted: true,
      notificationSent: false,
      shareCount: 0,
      celebrationViewed: false
    };

    userAchievements.push(userAchievement);
    this.userAchievements.set(userId.toString(), userAchievements);

    // Update user profile points
    const profile = this.userProfiles.get(userId);
    const achievement = this.achievements.get(achievementId);
    
    if (profile && achievement) {
      profile.totalPoints += achievement.points;
      profile.level = this.calculateLevel(profile.totalPoints);
      
      // Add badge if it's a badge type
      if (achievement.type === 'badge' && !profile.badges.includes(achievementId)) {
        profile.badges.push(achievementId);
      }
    }
  }

  private calculateLevel(totalPoints: number): number {
    // Level calculation: 100 points per level with increasing requirements
    return Math.floor(Math.sqrt(totalPoints / 50)) + 1;
  }

  // Streak management
  updateLearningStreak(userId: number, activityDate: Date = new Date()): LearningStreak {
    let streak = this.learningStreaks.get(userId);
    
    if (!streak) {
      streak = {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        streakType: 'daily',
        lastActivityDate: activityDate,
        streakStartDate: activityDate,
        milestones: [
          { days: 7, rewardClaimed: false, rewardType: 'points', rewardValue: '50' },
          { days: 30, rewardClaimed: false, rewardType: 'badge', rewardValue: 'month_warrior' },
          { days: 100, rewardClaimed: false, rewardType: 'title', rewardValue: 'Unstoppable' }
        ],
        freezeCount: 0,
        maxFreezes: 3
      };
    } else {
      const daysDiff = Math.floor((activityDate.getTime() - streak.lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Continue streak
        streak.currentStreak += 1;
        streak.lastActivityDate = activityDate;
        
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      } else if (daysDiff > 1) {
        // Streak broken, reset
        streak.currentStreak = 1;
        streak.streakStartDate = activityDate;
        streak.lastActivityDate = activityDate;
      }
      // If daysDiff === 0, same day activity, no change to streak
    }

    this.learningStreaks.set(userId, streak);
    return streak;
  }

  useStreakFreeze(userId: number): boolean {
    const streak = this.learningStreaks.get(userId);
    if (!streak || streak.freezeCount >= streak.maxFreezes) {
      return false;
    }

    streak.freezeCount += 1;
    // Extend last activity date by one day
    streak.lastActivityDate = new Date(streak.lastActivityDate.getTime() + 24 * 60 * 60 * 1000);
    
    return true;
  }

  // Social features
  sendFriendRequest(fromUserId: number, toUserId: number): boolean {
    const connectionKey = `${Math.min(fromUserId, toUserId)}-${Math.max(fromUserId, toUserId)}`;
    
    if (this.friendConnections.has(connectionKey)) {
      return false; // Connection already exists
    }

    const connection: FriendConnection = {
      userId1: fromUserId,
      userId2: toUserId,
      status: 'pending',
      requestedAt: new Date(),
      mutualFriends: 0,
      sharedAchievements: [],
      competitiveStats: {
        weeklyComparison: {
          user1Points: 0,
          user2Points: 0,
          user1Activities: 0,
          user2Activities: 0
        },
        allTimeComparison: {
          user1Level: 0,
          user2Level: 0,
          user1Achievements: 0,
          user2Achievements: 0
        }
      }
    };

    this.friendConnections.set(connectionKey, connection);
    return true;
  }

  acceptFriendRequest(userId: number, requestorId: number): boolean {
    const connectionKey = `${Math.min(userId, requestorId)}-${Math.max(userId, requestorId)}`;
    const connection = this.friendConnections.get(connectionKey);
    
    if (!connection || connection.status !== 'pending') {
      return false;
    }

    connection.status = 'accepted';
    connection.acceptedAt = new Date();
    
    // Update friend counts in profiles
    const profile1 = this.userProfiles.get(connection.userId1);
    const profile2 = this.userProfiles.get(connection.userId2);
    
    if (profile1) profile1.stats.friendsCount += 1;
    if (profile2) profile2.stats.friendsCount += 1;

    return true;
  }

  // Public methods
  getUserAchievements(userId: number): UserAchievement[] {
    return this.userAchievements.get(userId.toString()) || [];
  }

  getAvailableAchievements(userId: number): Achievement[] {
    const userAchievements = this.getUserAchievements(userId);
    const completedIds = new Set(userAchievements.filter(ua => ua.isCompleted).map(ua => ua.achievementId));
    
    return Array.from(this.achievements.values())
      .filter(achievement => !completedIds.has(achievement.id))
      .filter(achievement => !achievement.isHidden || this.checkPrerequisites(achievement.prerequisites, completedIds));
  }

  getUserProfile(userId: number): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  getLearningStreak(userId: number): LearningStreak | undefined {
    return this.learningStreaks.get(userId);
  }

  getLeaderboard(category: string, timeframe: string, limit: number = 50): LeaderboardEntry[] {
    const profiles = Array.from(this.userProfiles.values())
      .filter(profile => profile.socialSettings.showOnLeaderboard)
      .map((profile, index) => ({
        rank: index + 1,
        userId: profile.userId,
        displayName: `User ${profile.userId}`,
        score: this.getScoreForCategory(profile, category),
        change: 0, // Would be calculated based on previous rankings
        avatar: profile.avatar,
        title: profile.title
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return profiles;
  }

  private getScoreForCategory(profile: UserProfile, category: string): number {
    switch (category) {
      case 'total_points': return profile.totalPoints;
      case 'study_time': return profile.stats.totalStudyTime;
      case 'accuracy': return profile.stats.averageAccuracy;
      case 'streak': return profile.stats.streakRecord;
      case 'lessons': return profile.stats.lessonsCompleted;
      default: return profile.totalPoints;
    }
  }

  getActiveSeasonalEvents(): SeasonalEvent[] {
    const now = new Date();
    return Array.from(this.seasonalEvents.values())
      .filter(event => event.startDate <= now && event.endDate >= now && event.isActive);
  }

  shareAchievement(userId: number, achievementId: string): boolean {
    const userAchievements = this.userAchievements.get(userId.toString()) || [];
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
    
    if (!userAchievement) return false;
    
    userAchievement.shareCount += 1;
    return true;
  }
}

export const achievementSystem = new AchievementSystem();