// Social learning features with study buddy matching and peer feedback
export interface StudyBuddy {
  id: string;
  userId: number;
  partnerUserId: number;
  status: 'pending' | 'active' | 'completed' | 'inactive';
  sharedGoals: string[];
  preferredSchedule: string[];
  communicationStyle: 'formal' | 'casual' | 'structured';
  matchScore: number;
  createdAt: Date;
  lastActivity: Date;
}

export interface PeerFeedback {
  id: string;
  fromUserId: number;
  toUserId: number;
  contentType: 'writing' | 'speaking' | 'pronunciation' | 'conversation';
  contentId: string;
  rating: number; // 1-5 stars
  feedback: string;
  suggestions: string[];
  strengths: string[];
  isHelpful: boolean | null;
  timestamp: Date;
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'writing' | 'reading';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in days
  participants: ChallengeParticipant[];
  startDate: Date;
  endDate: Date;
  rewards: ChallengeReward[];
  rules: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeParticipant {
  userId: number;
  joinedAt: Date;
  progress: number; // 0-100%
  score: number;
  rank: number;
  achievements: string[];
  isActive: boolean;
}

export interface ChallengeReward {
  type: 'xp' | 'badge' | 'title' | 'feature-unlock';
  value: string | number;
  requirement: string;
  description: string;
}

export interface UserAchievement {
  id: string;
  userId: number;
  title: string;
  description: string;
  category: 'streak' | 'social' | 'skill' | 'challenge' | 'milestone';
  iconUrl?: string;
  earnedAt: Date;
  isVisible: boolean;
  shareCount: number;
}

export interface Leaderboard {
  id: string;
  type: 'weekly' | 'monthly' | 'all-time' | 'challenge-specific';
  category: 'xp' | 'streak' | 'accuracy' | 'participation';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  score: number;
  badge?: string;
  trend: 'up' | 'down' | 'same';
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: number;
  members: GroupMember[];
  isPublic: boolean;
  maxMembers: number;
  focusAreas: string[];
  meetingSchedule?: string;
  language: string;
  level: string;
  tags: string[];
  createdAt: Date;
  activity: GroupActivity[];
}

export interface GroupMember {
  userId: number;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  contributionScore: number;
  isActive: boolean;
}

export interface GroupActivity {
  id: string;
  type: 'message' | 'resource-share' | 'challenge' | 'meeting' | 'achievement';
  userId: number;
  content: string;
  metadata?: any;
  timestamp: Date;
  reactions: ActivityReaction[];
}

export interface ActivityReaction {
  userId: number;
  type: 'like' | 'helpful' | 'inspiring' | 'question';
  timestamp: Date;
}

export class SocialLearningSystem {
  private studyBuddies: Map<string, StudyBuddy> = new Map();
  private peerFeedback: Map<string, PeerFeedback> = new Map();
  private challenges: Map<string, LearningChallenge> = new Map();
  private achievements: Map<string, UserAchievement> = new Map();
  private leaderboards: Map<string, Leaderboard> = new Map();
  private studyGroups: Map<string, StudyGroup> = new Map();

  constructor() {
    this.initializeChallenges();
    this.initializeLeaderboards();
    this.initializeStudyGroups();
  }

  // Study Buddy System
  findStudyBuddy(userId: number, preferences: {
    goals: string[];
    schedule: string[];
    style: string;
    level: string;
  }): StudyBuddy[] {
    // Simple matching algorithm based on preferences
    const potentialMatches: StudyBuddy[] = [];
    
    // In a real system, this would analyze user profiles and learning patterns
    const mockMatches = [
      {
        id: `buddy-${Date.now()}-1`,
        userId,
        partnerUserId: 101,
        status: 'pending' as const,
        sharedGoals: preferences.goals.slice(0, 2),
        preferredSchedule: preferences.schedule,
        communicationStyle: preferences.style as any,
        matchScore: 0.85,
        createdAt: new Date(),
        lastActivity: new Date()
      },
      {
        id: `buddy-${Date.now()}-2`,
        userId,
        partnerUserId: 102,
        status: 'pending' as const,
        sharedGoals: preferences.goals.slice(1, 3),
        preferredSchedule: preferences.schedule,
        communicationStyle: preferences.style as any,
        matchScore: 0.78,
        createdAt: new Date(),
        lastActivity: new Date()
      }
    ];

    mockMatches.forEach(match => {
      this.studyBuddies.set(match.id, match);
      potentialMatches.push(match);
    });

    return potentialMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  acceptStudyBuddy(buddyId: string): StudyBuddy | null {
    const buddy = this.studyBuddies.get(buddyId);
    if (!buddy) return null;

    buddy.status = 'active';
    buddy.lastActivity = new Date();
    return buddy;
  }

  // Peer Feedback System
  submitPeerFeedback(feedback: Omit<PeerFeedback, 'id' | 'timestamp' | 'isHelpful'>): PeerFeedback {
    const peerFeedback: PeerFeedback = {
      ...feedback,
      id: `feedback-${Date.now()}`,
      timestamp: new Date(),
      isHelpful: null
    };

    this.peerFeedback.set(peerFeedback.id, peerFeedback);
    return peerFeedback;
  }

  rateFeedbackHelpfulness(feedbackId: string, isHelpful: boolean): boolean {
    const feedback = this.peerFeedback.get(feedbackId);
    if (!feedback) return false;

    feedback.isHelpful = isHelpful;
    return true;
  }

  getUserFeedback(userId: number): PeerFeedback[] {
    return Array.from(this.peerFeedback.values())
      .filter(feedback => feedback.toUserId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Learning Challenges
  private initializeChallenges(): void {
    const challenges: LearningChallenge[] = [
      {
        id: 'vocab-sprint-weekly',
        title: '7-Day Vocabulary Sprint',
        description: 'Learn 50 new words in 7 days with daily practice sessions',
        type: 'vocabulary',
        difficulty: 'medium',
        duration: 7,
        participants: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rewards: [
          {
            type: 'xp',
            value: 500,
            requirement: 'Complete all 7 days',
            description: 'Consistency Bonus'
          },
          {
            type: 'badge',
            value: 'Word Master',
            requirement: 'Score 90%+ accuracy',
            description: 'High accuracy achievement'
          }
        ],
        rules: [
          'Practice minimum 15 minutes daily',
          'Complete daily vocabulary quiz',
          'Use new words in sentences'
        ],
        status: 'active'
      },
      {
        id: 'pronunciation-perfect',
        title: 'Perfect Pronunciation Month',
        description: 'Master 20 difficult sounds with daily pronunciation practice',
        type: 'speaking',
        difficulty: 'hard',
        duration: 30,
        participants: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        rewards: [
          {
            type: 'title',
            value: 'Pronunciation Pro',
            requirement: 'Complete 25+ days',
            description: 'Special user title'
          },
          {
            type: 'feature-unlock',
            value: 'Advanced Voice Analytics',
            requirement: 'Maintain 80%+ accuracy',
            description: 'Unlock premium features'
          }
        ],
        rules: [
          'Record daily pronunciation exercises',
          'Get peer feedback on recordings',
          'Practice target sounds for 20+ minutes'
        ],
        status: 'active'
      }
    ];

    challenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  joinChallenge(challengeId: string, userId: number): boolean {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || challenge.status !== 'active') return false;

    const participant: ChallengeParticipant = {
      userId,
      joinedAt: new Date(),
      progress: 0,
      score: 0,
      rank: challenge.participants.length + 1,
      achievements: [],
      isActive: true
    };

    challenge.participants.push(participant);
    return true;
  }

  updateChallengeProgress(challengeId: string, userId: number, progress: number, score: number): boolean {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return false;

    const participant = challenge.participants.find(p => p.userId === userId);
    if (!participant) return false;

    participant.progress = progress;
    participant.score = score;

    // Update rankings
    challenge.participants.sort((a, b) => b.score - a.score);
    challenge.participants.forEach((p, index) => {
      p.rank = index + 1;
    });

    return true;
  }

  getChallenges(status?: string, type?: string): LearningChallenge[] {
    let filtered = Array.from(this.challenges.values());
    
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    
    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }
    
    return filtered.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  // Achievement System
  awardAchievement(userId: number, title: string, description: string, category: string): UserAchievement {
    const achievement: UserAchievement = {
      id: `achievement-${Date.now()}-${userId}`,
      userId,
      title,
      description,
      category: category as any,
      earnedAt: new Date(),
      isVisible: true,
      shareCount: 0
    };

    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  shareAchievement(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return false;

    achievement.shareCount += 1;
    return true;
  }

  getUserAchievements(userId: number): UserAchievement[] {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }

  // Leaderboards
  private initializeLeaderboards(): void {
    const leaderboards: Leaderboard[] = [
      {
        id: 'weekly-xp',
        type: 'weekly',
        category: 'xp',
        entries: [
          { rank: 1, userId: 101, username: 'StudyMaster', score: 2450, badge: 'Top Learner', trend: 'up' },
          { rank: 2, userId: 102, username: 'WordNinja', score: 2380, badge: 'Vocabulary King', trend: 'same' },
          { rank: 3, userId: 103, username: 'GrammarGuru', score: 2290, badge: 'Grammar Expert', trend: 'down' },
          { rank: 4, userId: 104, username: 'PronounceBot', score: 2150, trend: 'up' },
          { rank: 5, userId: 105, username: 'FluentFox', score: 2080, trend: 'up' }
        ],
        lastUpdated: new Date()
      },
      {
        id: 'monthly-streak',
        type: 'monthly',
        category: 'streak',
        entries: [
          { rank: 1, userId: 106, username: 'StreakKing', score: 45, badge: 'Consistency Master', trend: 'up' },
          { rank: 2, userId: 107, username: 'DailyLearner', score: 42, badge: 'Study Warrior', trend: 'same' },
          { rank: 3, userId: 108, username: 'NeverGiveUp', score: 38, trend: 'up' }
        ],
        lastUpdated: new Date()
      }
    ];

    leaderboards.forEach(leaderboard => {
      this.leaderboards.set(leaderboard.id, leaderboard);
    });
  }

  getLeaderboard(type: string, category: string): Leaderboard | null {
    const key = `${type}-${category}`;
    return this.leaderboards.get(key) || null;
  }

  updateLeaderboard(userId: number, category: string, score: number): void {
    const weeklyKey = `weekly-${category}`;
    const monthlyKey = `monthly-${category}`;
    
    [weeklyKey, monthlyKey].forEach(key => {
      const leaderboard = this.leaderboards.get(key);
      if (!leaderboard) return;

      const existingEntry = leaderboard.entries.find(entry => entry.userId === userId);
      
      if (existingEntry) {
        const oldScore = existingEntry.score;
        existingEntry.score = score;
        existingEntry.trend = score > oldScore ? 'up' : score < oldScore ? 'down' : 'same';
      } else if (leaderboard.entries.length < 10) {
        leaderboard.entries.push({
          rank: leaderboard.entries.length + 1,
          userId,
          username: `User${userId}`,
          score,
          trend: 'up'
        });
      }

      // Re-rank entries
      leaderboard.entries.sort((a, b) => b.score - a.score);
      leaderboard.entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      leaderboard.lastUpdated = new Date();
    });
  }

  // Study Groups
  private initializeStudyGroups(): void {
    const groups: StudyGroup[] = [
      {
        id: 'business-english-pros',
        name: 'Business English Professionals',
        description: 'Advanced learners focusing on business communication and presentation skills',
        creatorId: 101,
        members: [
          { userId: 101, role: 'owner', joinedAt: new Date(), contributionScore: 95, isActive: true },
          { userId: 102, role: 'moderator', joinedAt: new Date(), contributionScore: 87, isActive: true },
          { userId: 103, role: 'member', joinedAt: new Date(), contributionScore: 72, isActive: true }
        ],
        isPublic: true,
        maxMembers: 20,
        focusAreas: ['business communication', 'presentations', 'networking'],
        meetingSchedule: 'Thursdays 7PM UTC',
        language: 'English',
        level: 'Advanced',
        tags: ['business', 'professional', 'networking'],
        createdAt: new Date(),
        activity: [
          {
            id: 'activity-1',
            type: 'message',
            userId: 101,
            content: 'Welcome everyone! Let\'s start with practicing elevator pitches.',
            timestamp: new Date(),
            reactions: [
              { userId: 102, type: 'like', timestamp: new Date() },
              { userId: 103, type: 'helpful', timestamp: new Date() }
            ]
          }
        ]
      },
      {
        id: 'daily-conversation',
        name: 'Daily Conversation Practice',
        description: 'Casual group for daily English conversation practice and cultural exchange',
        creatorId: 104,
        members: [
          { userId: 104, role: 'owner', joinedAt: new Date(), contributionScore: 88, isActive: true },
          { userId: 105, role: 'member', joinedAt: new Date(), contributionScore: 65, isActive: true },
          { userId: 106, role: 'member', joinedAt: new Date(), contributionScore: 59, isActive: true }
        ],
        isPublic: true,
        maxMembers: 15,
        focusAreas: ['daily conversation', 'cultural exchange', 'idioms'],
        language: 'English',
        level: 'Intermediate',
        tags: ['conversation', 'culture', 'daily-life'],
        createdAt: new Date(),
        activity: []
      }
    ];

    groups.forEach(group => {
      this.studyGroups.set(group.id, group);
    });
  }

  createStudyGroup(creatorId: number, groupData: Omit<StudyGroup, 'id' | 'creatorId' | 'members' | 'createdAt' | 'activity'>): StudyGroup {
    const groupId = `group-${Date.now()}-${creatorId}`;
    const group: StudyGroup = {
      ...groupData,
      id: groupId,
      creatorId,
      members: [{
        userId: creatorId,
        role: 'owner',
        joinedAt: new Date(),
        contributionScore: 0,
        isActive: true
      }],
      createdAt: new Date(),
      activity: []
    };

    this.studyGroups.set(groupId, group);
    return group;
  }

  joinStudyGroup(groupId: string, userId: number): boolean {
    const group = this.studyGroups.get(groupId);
    if (!group || group.members.length >= group.maxMembers) return false;

    const isMember = group.members.some(member => member.userId === userId);
    if (isMember) return false;

    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date(),
      contributionScore: 0,
      isActive: true
    });

    return true;
  }

  addGroupActivity(groupId: string, activity: Omit<GroupActivity, 'id' | 'timestamp' | 'reactions'>): GroupActivity | null {
    const group = this.studyGroups.get(groupId);
    if (!group) return null;

    const newActivity: GroupActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
      reactions: []
    };

    group.activity.unshift(newActivity);
    
    // Update contributor score
    const member = group.members.find(m => m.userId === activity.userId);
    if (member) {
      member.contributionScore += 5;
    }

    return newActivity;
  }

  getStudyGroups(isPublic?: boolean, focusArea?: string): StudyGroup[] {
    let filtered = Array.from(this.studyGroups.values());
    
    if (isPublic !== undefined) {
      filtered = filtered.filter(group => group.isPublic === isPublic);
    }
    
    if (focusArea) {
      filtered = filtered.filter(group => 
        group.focusAreas.some(area => 
          area.toLowerCase().includes(focusArea.toLowerCase())
        )
      );
    }
    
    return filtered.sort((a, b) => b.members.length - a.members.length);
  }

  getUserGroups(userId: number): StudyGroup[] {
    return Array.from(this.studyGroups.values())
      .filter(group => group.members.some(member => member.userId === userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const socialLearningSystem = new SocialLearningSystem();