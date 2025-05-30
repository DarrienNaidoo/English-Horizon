// Social sharing of learning milestones with badges
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'achievement' | 'streak' | 'skill' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  unlockCondition: string;
  pointsRequired?: number;
  streakRequired?: number;
  skillLevel?: string;
  isShareable: boolean;
  socialTemplate: SocialTemplate;
  visualDesign: BadgeDesign;
}

export interface BadgeDesign {
  shape: 'circle' | 'shield' | 'star' | 'hexagon' | 'diamond';
  backgroundGradient: string[];
  borderStyle: string;
  iconStyle: string;
  textColor: string;
  effects: VisualEffect[];
  animation?: BadgeAnimation;
}

export interface BadgeAnimation {
  type: 'glow' | 'pulse' | 'rotate' | 'bounce' | 'sparkle';
  duration: number;
  intensity: number;
  triggerEvents: string[];
}

export interface VisualEffect {
  type: 'sparkles' | 'glow' | 'shine' | 'particles' | 'border_glow';
  color: string;
  opacity: number;
  size: number;
  duration: number;
}

export interface SocialTemplate {
  title: string;
  description: string;
  hashtags: string[];
  shareText: string;
  imageTemplate: string;
  platforms: SocialPlatform[];
}

export interface SocialPlatform {
  name: string;
  enabled: boolean;
  customMessage?: string;
  characterLimit: number;
  imageSize: { width: number; height: number };
  supportedFormats: string[];
}

export interface UserBadge {
  userId: number;
  badgeId: string;
  earnedAt: Date;
  isDisplayed: boolean;
  shareCount: number;
  lastShared?: Date;
  celebrationViewed: boolean;
  progressToEarn?: number;
  metadata: BadgeMetadata;
}

export interface BadgeMetadata {
  earnedThrough: string;
  contextData: { [key: string]: any };
  milestoneData?: MilestoneData;
  witnessUsers?: number[];
  achievementPath: string[];
}

export interface MilestoneData {
  previousValue: number;
  newValue: number;
  improvement: number;
  timeToAchieve: number;
  difficulty: string;
  relatedSkills: string[];
}

export interface SocialShare {
  id: string;
  userId: number;
  badgeId: string;
  platform: string;
  shareType: 'milestone' | 'achievement' | 'streak' | 'group_achievement';
  content: ShareContent;
  recipients: ShareRecipient[];
  visibility: 'public' | 'friends' | 'class' | 'private';
  timestamp: Date;
  reactions: SocialReaction[];
  comments: SocialComment[];
  shareStats: ShareStats;
}

export interface ShareContent {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  badgePreview: BadgePreview;
  milestoneDetails: MilestoneDetails;
  encouragementMessage?: string;
}

export interface BadgePreview {
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  rarity: string;
  earnedDate: Date;
  description: string;
}

export interface MilestoneDetails {
  type: string;
  achievement: string;
  progressData: any;
  timeframe: string;
  skillsInvolved: string[];
  difficultyLevel: string;
}

export interface ShareRecipient {
  type: 'user' | 'class' | 'friend_group' | 'public';
  targetId?: string;
  notified: boolean;
  reaction?: string;
}

export interface SocialReaction {
  userId: number;
  userName: string;
  reactionType: 'like' | 'love' | 'wow' | 'clap' | 'fire' | 'star';
  timestamp: Date;
  message?: string;
}

export interface SocialComment {
  id: string;
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
  replies: SocialComment[];
  reactions: SocialReaction[];
}

export interface ShareStats {
  totalViews: number;
  totalReactions: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  reachCount: number;
  platformBreakdown: { [platform: string]: number };
}

export interface SocialFeed {
  userId: number;
  feedType: 'personal' | 'friends' | 'class' | 'global';
  posts: SocialPost[];
  filters: FeedFilter[];
  lastUpdated: Date;
}

export interface SocialPost {
  id: string;
  authorId: number;
  authorName: string;
  content: ShareContent;
  timestamp: Date;
  engagement: PostEngagement;
  isPromoted: boolean;
  tags: string[];
}

export interface PostEngagement {
  reactions: SocialReaction[];
  comments: SocialComment[];
  shares: number;
  views: number;
  saveCount: number;
}

export interface FeedFilter {
  type: 'badge_rarity' | 'achievement_type' | 'time_range' | 'user_relationship';
  value: string;
  enabled: boolean;
}

export interface SocialChallenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: ChallengeParticipant[];
  prizes: ChallengePrize[];
  rules: string[];
  shareRequirement: boolean;
  badgeReward?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeParticipant {
  userId: number;
  joinedAt: Date;
  progress: number;
  currentRank: number;
  achievements: string[];
  shareCount: number;
}

export interface ChallengePrize {
  rank: number;
  badge: string;
  description: string;
  additionalRewards: string[];
}

export interface UserSocialProfile {
  userId: number;
  displayName: string;
  avatar: string;
  bio: string;
  badges: UserBadge[];
  totalShares: number;
  followers: number;
  following: number;
  privacySettings: PrivacySettings;
  sharingPreferences: SharingPreferences;
  socialStats: SocialStats;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  badgeVisibility: 'all' | 'selected' | 'none';
  shareByDefault: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  notificationLevel: 'all' | 'important' | 'none';
}

export interface SharingPreferences {
  defaultPlatforms: string[];
  autoShare: boolean;
  customMessages: { [badgeType: string]: string };
  shareToClass: boolean;
  shareToFriends: boolean;
  includeProgress: boolean;
}

export interface SocialStats {
  totalPosts: number;
  totalEngagement: number;
  averageReactions: number;
  mostPopularBadge: string;
  sharingStreak: number;
  influenceScore: number;
}

export class SocialSharingSystem {
  private badges: Map<string, Badge> = new Map();
  private userBadges: Map<string, UserBadge[]> = new Map();
  private socialShares: Map<string, SocialShare> = new Map();
  private socialFeeds: Map<string, SocialFeed> = new Map();
  private socialChallenges: Map<string, SocialChallenge> = new Map();
  private userProfiles: Map<number, UserSocialProfile> = new Map();

  constructor() {
    this.initializeBadges();
    this.initializeSampleProfiles();
    this.initializeSocialChallenges();
  }

  private initializeBadges(): void {
    const badges: Badge[] = [
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Completed your very first English lesson',
        category: 'milestone',
        rarity: 'common',
        icon: 'baby-steps',
        color: '#4CAF50',
        unlockCondition: 'Complete 1 lesson',
        isShareable: true,
        socialTemplate: {
          title: 'Started my English learning journey! 🌟',
          description: 'Just completed my first lesson on SpeakWorld!',
          hashtags: ['#EnglishLearning', '#FirstStep', '#SpeakWorld'],
          shareText: 'Taking the first step in my English learning adventure! Every expert was once a beginner. 💪',
          imageTemplate: 'first_lesson_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'circle',
          backgroundGradient: ['#4CAF50', '#81C784'],
          borderStyle: 'solid',
          iconStyle: 'filled',
          textColor: '#FFFFFF',
          effects: [
            {
              type: 'glow',
              color: '#4CAF50',
              opacity: 0.6,
              size: 8,
              duration: 2000
            }
          ],
          animation: {
            type: 'glow',
            duration: 2000,
            intensity: 0.8,
            triggerEvents: ['earn', 'view']
          }
        }
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Studied English for 7 consecutive days',
        category: 'streak',
        rarity: 'uncommon',
        icon: 'calendar-check',
        color: '#FF9800',
        unlockCondition: 'Study for 7 consecutive days',
        streakRequired: 7,
        isShareable: true,
        socialTemplate: {
          title: 'One week of consistent English learning! 🔥',
          description: 'Maintained a 7-day learning streak on SpeakWorld!',
          hashtags: ['#LearningStreak', '#Consistency', '#EnglishDaily'],
          shareText: 'Consistency is key! Just hit my 7-day English learning streak. Small daily efforts lead to big results! 📚✨',
          imageTemplate: 'streak_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'shield',
          backgroundGradient: ['#FF9800', '#FFB74D'],
          borderStyle: 'glowing',
          iconStyle: 'outlined',
          textColor: '#FFFFFF',
          effects: [
            {
              type: 'sparkles',
              color: '#FFD54F',
              opacity: 0.8,
              size: 4,
              duration: 1500
            }
          ],
          animation: {
            type: 'pulse',
            duration: 1500,
            intensity: 0.9,
            triggerEvents: ['earn', 'share']
          }
        }
      },
      {
        id: 'grammar_master',
        name: 'Grammar Guardian',
        description: 'Achieved 95% accuracy in grammar exercises',
        category: 'skill',
        rarity: 'rare',
        icon: 'shield-check',
        color: '#9C27B0',
        unlockCondition: 'Achieve 95% accuracy in 20 grammar exercises',
        skillLevel: 'advanced',
        isShareable: true,
        socialTemplate: {
          title: 'Grammar mastery achieved! 🎯',
          description: 'Reached 95% accuracy in English grammar exercises!',
          hashtags: ['#GrammarMaster', '#EnglishSkills', '#Accuracy'],
          shareText: 'Grammar ninja mode activated! 🥷 Achieved 95% accuracy in English grammar. Practice makes perfect!',
          imageTemplate: 'grammar_master_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'star',
          backgroundGradient: ['#9C27B0', '#BA68C8'],
          borderStyle: 'ornate',
          iconStyle: 'gradient',
          textColor: '#FFFFFF',
          effects: [
            {
              type: 'shine',
              color: '#E1BEE7',
              opacity: 0.7,
              size: 6,
              duration: 2500
            }
          ],
          animation: {
            type: 'sparkle',
            duration: 2500,
            intensity: 1.0,
            triggerEvents: ['earn', 'view', 'share']
          }
        }
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Helped 10 classmates with their learning',
        category: 'social',
        rarity: 'uncommon',
        icon: 'users-helping',
        color: '#2196F3',
        unlockCondition: 'Help 10 different classmates',
        isShareable: true,
        socialTemplate: {
          title: 'Spreading the learning love! 💙',
          description: 'Helped 10 classmates with their English learning journey!',
          hashtags: ['#LearningTogether', '#Helping', '#Community'],
          shareText: 'Learning is better together! Just helped my 10th classmate on their English journey. Sharing knowledge makes us all stronger! 🤝',
          imageTemplate: 'social_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'hexagon',
          backgroundGradient: ['#2196F3', '#64B5F6'],
          borderStyle: 'double',
          iconStyle: 'filled',
          textColor: '#FFFFFF',
          effects: [
            {
              type: 'particles',
              color: '#81D4FA',
              opacity: 0.6,
              size: 3,
              duration: 3000
            }
          ]
        }
      },
      {
        id: 'pronunciation_pro',
        name: 'Pronunciation Pro',
        description: 'Perfect pronunciation score in 15 exercises',
        category: 'skill',
        rarity: 'epic',
        icon: 'microphone-perfect',
        color: '#E91E63',
        unlockCondition: 'Perfect scores in 15 pronunciation exercises',
        skillLevel: 'expert',
        isShareable: true,
        socialTemplate: {
          title: 'Pronunciation perfection achieved! 🎤',
          description: 'Mastered English pronunciation with perfect scores!',
          hashtags: ['#PronunciationPro', '#SpeakingSkills', '#Perfect'],
          shareText: 'Nailed it! 🎯 Perfect pronunciation scores in 15 exercises. My English speaking is getting stronger every day!',
          imageTemplate: 'pronunciation_master_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'diamond',
          backgroundGradient: ['#E91E63', '#F06292'],
          borderStyle: 'animated',
          iconStyle: 'premium',
          textColor: '#FFFFFF',
          effects: [
            {
              type: 'border_glow',
              color: '#FCE4EC',
              opacity: 0.9,
              size: 10,
              duration: 2000
            }
          ],
          animation: {
            type: 'rotate',
            duration: 3000,
            intensity: 0.7,
            triggerEvents: ['earn', 'share']
          }
        }
      },
      {
        id: 'century_club',
        name: 'Century Club',
        description: 'Completed 100 lessons',
        category: 'milestone',
        rarity: 'legendary',
        icon: 'trophy-diamond',
        color: '#FFD700',
        unlockCondition: 'Complete 100 lessons',
        isShareable: true,
        socialTemplate: {
          title: 'Century milestone reached! 🏆',
          description: 'Completed 100 English lessons on SpeakWorld!',
          hashtags: ['#CenturyClub', '#Milestone', '#Dedication'],
          shareText: '100 lessons down! 🎉 This journey has been incredible. Every lesson brings me closer to English fluency!',
          imageTemplate: 'century_milestone_badge',
          platforms: [
            {
              name: 'classroom',
              enabled: true,
              characterLimit: 280,
              imageSize: { width: 400, height: 300 },
              supportedFormats: ['png', 'jpg']
            }
          ]
        },
        visualDesign: {
          shape: 'circle',
          backgroundGradient: ['#FFD700', '#FFF176'],
          borderStyle: 'legendary',
          iconStyle: 'elite',
          textColor: '#1B5E20',
          effects: [
            {
              type: 'sparkles',
              color: '#FFEB3B',
              opacity: 1.0,
              size: 8,
              duration: 4000
            },
            {
              type: 'glow',
              color: '#FFD700',
              opacity: 0.8,
              size: 15,
              duration: 4000
            }
          ],
          animation: {
            type: 'bounce',
            duration: 2000,
            intensity: 1.2,
            triggerEvents: ['earn', 'view', 'share']
          }
        }
      }
    ];

    badges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserSocialProfile = {
      userId: 1,
      displayName: 'Alex Chen',
      avatar: 'student_avatar_1',
      bio: 'Passionate English learner from Beijing. Love connecting with fellow students!',
      badges: [
        {
          userId: 1,
          badgeId: 'first_lesson',
          earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isDisplayed: true,
          shareCount: 1,
          lastShared: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          celebrationViewed: true,
          metadata: {
            earnedThrough: 'lesson_completion',
            contextData: { lessonId: 'intro_001' },
            achievementPath: ['first_login', 'first_lesson']
          }
        },
        {
          userId: 1,
          badgeId: 'week_warrior',
          earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isDisplayed: true,
          shareCount: 2,
          lastShared: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          celebrationViewed: true,
          metadata: {
            earnedThrough: 'streak_achievement',
            contextData: { streakLength: 7 },
            milestoneData: {
              previousValue: 6,
              newValue: 7,
              improvement: 1,
              timeToAchieve: 7 * 24 * 60 * 60 * 1000,
              difficulty: 'medium',
              relatedSkills: ['consistency', 'habit_building']
            },
            achievementPath: ['daily_study', 'week_warrior']
          }
        }
      ],
      totalShares: 3,
      followers: 12,
      following: 8,
      privacySettings: {
        profileVisibility: 'friends',
        badgeVisibility: 'all',
        shareByDefault: true,
        allowComments: true,
        allowReactions: true,
        notificationLevel: 'important'
      },
      sharingPreferences: {
        defaultPlatforms: ['classroom'],
        autoShare: false,
        customMessages: {},
        shareToClass: true,
        shareToFriends: true,
        includeProgress: true
      },
      socialStats: {
        totalPosts: 3,
        totalEngagement: 25,
        averageReactions: 8.3,
        mostPopularBadge: 'week_warrior',
        sharingStreak: 2,
        influenceScore: 67
      }
    };

    this.userProfiles.set(1, sampleProfile);
    this.userBadges.set('1', sampleProfile.badges);
  }

  private initializeSocialChallenges(): void {
    const challenges: SocialChallenge[] = [
      {
        id: 'share_streak_challenge',
        title: 'Share Your Success',
        description: 'Share 5 achievements within a month and inspire your classmates!',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        participants: [
          {
            userId: 1,
            joinedAt: new Date(),
            progress: 2,
            currentRank: 1,
            achievements: ['week_warrior', 'first_lesson'],
            shareCount: 2
          }
        ],
        prizes: [
          {
            rank: 1,
            badge: 'share_champion',
            description: 'Champion badge for most inspiring shares',
            additionalRewards: ['Special celebration animation', 'Profile highlight']
          }
        ],
        rules: [
          'Share at least 5 different achievements',
          'Include encouraging message with each share',
          'React to at least 10 classmates\' shares'
        ],
        shareRequirement: true,
        badgeReward: 'share_champion',
        status: 'active'
      }
    ];

    challenges.forEach(challenge => {
      this.socialChallenges.set(challenge.id, challenge);
    });
  }

  // Badge management methods
  awardBadge(userId: number, badgeId: string, context: any = {}): UserBadge | null {
    const badge = this.badges.get(badgeId);
    if (!badge) return null;

    const userBadges = this.userBadges.get(userId.toString()) || [];
    
    // Check if user already has this badge
    if (userBadges.some(ub => ub.badgeId === badgeId)) {
      return null;
    }

    const userBadge: UserBadge = {
      userId,
      badgeId,
      earnedAt: new Date(),
      isDisplayed: true,
      shareCount: 0,
      celebrationViewed: false,
      metadata: {
        earnedThrough: context.source || 'system',
        contextData: context,
        achievementPath: context.path || [badgeId]
      }
    };

    userBadges.push(userBadge);
    this.userBadges.set(userId.toString(), userBadges);

    // Update user profile
    const profile = this.userProfiles.get(userId);
    if (profile) {
      profile.badges = userBadges;
    }

    return userBadge;
  }

  // Social sharing methods
  shareBadge(
    userId: number,
    badgeId: string,
    platform: string,
    visibility: 'public' | 'friends' | 'class' | 'private' = 'class',
    customMessage?: string
  ): SocialShare {
    const badge = this.badges.get(badgeId);
    const userBadge = this.getUserBadge(userId, badgeId);
    
    if (!badge || !userBadge) {
      throw new Error('Badge not found or not earned by user');
    }

    const shareId = `share-${Date.now()}-${userId}`;
    const shareText = customMessage || badge.socialTemplate.shareText;

    const socialShare: SocialShare = {
      id: shareId,
      userId,
      badgeId,
      platform,
      shareType: 'achievement',
      content: {
        text: shareText,
        badgePreview: {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeIcon: badge.icon,
          rarity: badge.rarity,
          earnedDate: userBadge.earnedAt,
          description: badge.description
        },
        milestoneDetails: {
          type: badge.category,
          achievement: badge.name,
          progressData: userBadge.metadata.milestoneData,
          timeframe: this.calculateTimeframe(userBadge.earnedAt),
          skillsInvolved: userBadge.metadata.milestoneData?.relatedSkills || [],
          difficultyLevel: userBadge.metadata.milestoneData?.difficulty || 'medium'
        }
      },
      recipients: [
        {
          type: visibility,
          notified: false
        }
      ],
      visibility,
      timestamp: new Date(),
      reactions: [],
      comments: [],
      shareStats: {
        totalViews: 0,
        totalReactions: 0,
        totalComments: 0,
        totalShares: 0,
        engagementRate: 0,
        reachCount: 0,
        platformBreakdown: { [platform]: 1 }
      }
    };

    this.socialShares.set(shareId, socialShare);
    
    // Update user badge share count
    userBadge.shareCount += 1;
    userBadge.lastShared = new Date();

    // Update user social stats
    const profile = this.userProfiles.get(userId);
    if (profile) {
      profile.totalShares += 1;
      profile.socialStats.totalPosts += 1;
      profile.socialStats.sharingStreak += 1;
    }

    return socialShare;
  }

  private calculateTimeframe(earnedAt: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - earnedAt.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  // Social interaction methods
  reactToShare(userId: number, shareId: string, reactionType: string, message?: string): boolean {
    const share = this.socialShares.get(shareId);
    if (!share) return false;

    const existingReactionIndex = share.reactions.findIndex(r => r.userId === userId);
    
    if (existingReactionIndex >= 0) {
      // Update existing reaction
      share.reactions[existingReactionIndex].reactionType = reactionType as any;
      share.reactions[existingReactionIndex].message = message;
    } else {
      // Add new reaction
      const reaction: SocialReaction = {
        userId,
        userName: this.getUserName(userId),
        reactionType: reactionType as any,
        timestamp: new Date(),
        message
      };
      share.reactions.push(reaction);
    }

    // Update share stats
    share.shareStats.totalReactions = share.reactions.length;
    this.updateEngagementRate(share);

    return true;
  }

  commentOnShare(userId: number, shareId: string, content: string, replyToId?: string): SocialComment | null {
    const share = this.socialShares.get(shareId);
    if (!share) return null;

    const commentId = `comment-${Date.now()}-${userId}`;
    const comment: SocialComment = {
      id: commentId,
      userId,
      userName: this.getUserName(userId),
      content,
      timestamp: new Date(),
      replies: [],
      reactions: []
    };

    if (replyToId) {
      // Find parent comment and add as reply
      const parentComment = share.comments.find(c => c.id === replyToId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    } else {
      share.comments.push(comment);
    }

    // Update share stats
    share.shareStats.totalComments = this.countTotalComments(share.comments);
    this.updateEngagementRate(share);

    return comment;
  }

  private countTotalComments(comments: SocialComment[]): number {
    return comments.reduce((total, comment) => {
      return total + 1 + this.countTotalComments(comment.replies);
    }, 0);
  }

  private updateEngagementRate(share: SocialShare): void {
    const totalEngagement = share.shareStats.totalReactions + share.shareStats.totalComments + share.shareStats.totalShares;
    const views = Math.max(share.shareStats.totalViews, 1);
    share.shareStats.engagementRate = (totalEngagement / views) * 100;
  }

  private getUserName(userId: number): string {
    const profile = this.userProfiles.get(userId);
    return profile?.displayName || `User ${userId}`;
  }

  // Feed generation methods
  generateSocialFeed(userId: number, feedType: 'personal' | 'friends' | 'class' | 'global' = 'class'): SocialFeed {
    const shares = Array.from(this.socialShares.values())
      .filter(share => this.shouldIncludeInFeed(share, userId, feedType))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50);

    const posts: SocialPost[] = shares.map(share => ({
      id: share.id,
      authorId: share.userId,
      authorName: this.getUserName(share.userId),
      content: share.content,
      timestamp: share.timestamp,
      engagement: {
        reactions: share.reactions,
        comments: share.comments,
        shares: share.shareStats.totalShares,
        views: share.shareStats.totalViews,
        saveCount: 0
      },
      isPromoted: false,
      tags: this.extractTags(share.content.text)
    }));

    const feed: SocialFeed = {
      userId,
      feedType,
      posts,
      filters: [],
      lastUpdated: new Date()
    };

    this.socialFeeds.set(`${userId}-${feedType}`, feed);
    return feed;
  }

  private shouldIncludeInFeed(share: SocialShare, userId: number, feedType: string): boolean {
    if (feedType === 'personal') {
      return share.userId === userId;
    }
    
    if (feedType === 'class') {
      return share.visibility === 'public' || share.visibility === 'class';
    }
    
    return share.visibility === 'public';
  }

  private extractTags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.substring(1));
  }

  // Public methods
  getUserBadges(userId: number): UserBadge[] {
    return this.userBadges.get(userId.toString()) || [];
  }

  getUserBadge(userId: number, badgeId: string): UserBadge | undefined {
    const userBadges = this.userBadges.get(userId.toString()) || [];
    return userBadges.find(ub => ub.badgeId === badgeId);
  }

  getAvailableBadges(): Badge[] {
    return Array.from(this.badges.values());
  }

  getBadgeById(badgeId: string): Badge | undefined {
    return this.badges.get(badgeId);
  }

  getUserSocialProfile(userId: number): UserSocialProfile | undefined {
    return this.userProfiles.get(userId);
  }

  getSocialShare(shareId: string): SocialShare | undefined {
    return this.socialShares.get(shareId);
  }

  getRecentShares(userId: number, limit: number = 10): SocialShare[] {
    return Array.from(this.socialShares.values())
      .filter(share => share.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getActiveChallenges(): SocialChallenge[] {
    return Array.from(this.socialChallenges.values())
      .filter(challenge => challenge.status === 'active');
  }

  joinChallenge(userId: number, challengeId: string): boolean {
    const challenge = this.socialChallenges.get(challengeId);
    if (!challenge || challenge.status !== 'active') return false;

    const existingParticipant = challenge.participants.find(p => p.userId === userId);
    if (existingParticipant) return false;

    const participant: ChallengeParticipant = {
      userId,
      joinedAt: new Date(),
      progress: 0,
      currentRank: challenge.participants.length + 1,
      achievements: [],
      shareCount: 0
    };

    challenge.participants.push(participant);
    return true;
  }

  updateSharingPreferences(userId: number, preferences: Partial<SharingPreferences>): boolean {
    const profile = this.userProfiles.get(userId);
    if (!profile) return false;

    profile.sharingPreferences = { ...profile.sharingPreferences, ...preferences };
    return true;
  }
}

export const socialSharingSystem = new SocialSharingSystem();