// Personalized learning dashboard with AI-powered recommendations
export interface LearningGoal {
  id: string;
  userId: number;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'writing' | 'listening';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export interface StudyStreak {
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface DailyRecommendation {
  id: string;
  userId: number;
  type: 'lesson' | 'exercise' | 'review' | 'practice';
  title: string;
  description: string;
  estimatedTime: number;
  priority: number;
  reasoning: string;
  content: any;
  generatedAt: Date;
}

export interface WeaknessAnalysis {
  skill: string;
  confidence: number;
  lastPracticed: Date;
  improvementRate: number;
  recommendedActions: string[];
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'trend' | 'achievement';
  title: string;
  description: string;
  actionable: boolean;
  suggestions: string[];
  dataPoints: any[];
}

export class PersonalizedDashboard {
  private goals: Map<string, LearningGoal> = new Map();
  private streaks: Map<number, StudyStreak> = new Map();
  private recommendations: Map<string, DailyRecommendation[]> = new Map();
  private insights: Map<number, LearningInsight[]> = new Map();

  // Goal Management
  createGoal(
    userId: number,
    type: string,
    title: string,
    description: string,
    targetValue: number,
    deadline: Date,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): LearningGoal {
    const goalId = `goal-${Date.now()}-${userId}`;
    const goal: LearningGoal = {
      id: goalId,
      userId,
      type: type as any,
      title,
      description,
      targetValue,
      currentValue: 0,
      deadline,
      priority,
      status: 'active',
      createdAt: new Date()
    };

    this.goals.set(goalId, goal);
    return goal;
  }

  updateGoalProgress(goalId: string, progress: number): LearningGoal | null {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    goal.currentValue = Math.min(goal.targetValue, progress);
    
    if (goal.currentValue >= goal.targetValue) {
      goal.status = 'completed';
    }

    return goal;
  }

  getUserGoals(userId: number): LearningGoal[] {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'active' ? -1 : 1;
        }
        return b.priority.localeCompare(a.priority);
      });
  }

  // Streak Management
  updateStudyStreak(userId: number): StudyStreak {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = this.streaks.get(userId);
    
    if (!streak) {
      streak = {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: today,
        weeklyGoal: 5,
        weeklyProgress: 1
      };
    } else {
      const lastStudy = new Date(streak.lastStudyDate);
      lastStudy.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already studied today, no change to streak
        return streak;
      } else if (daysDiff === 1) {
        // Consecutive day
        streak.currentStreak += 1;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      } else {
        // Streak broken
        streak.currentStreak = 1;
      }
      
      streak.lastStudyDate = today;
      
      // Update weekly progress
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      if (lastStudy < weekStart) {
        streak.weeklyProgress = 1;
      } else {
        streak.weeklyProgress += 1;
      }
    }
    
    this.streaks.set(userId, streak);
    return streak;
  }

  getStudyStreak(userId: number): StudyStreak | null {
    return this.streaks.get(userId) || null;
  }

  // AI-Powered Recommendations
  generateDailyRecommendations(userId: number): DailyRecommendation[] {
    const userWeaknesses = this.analyzeWeaknesses(userId);
    const recentProgress = this.getRecentProgress(userId);
    const goals = this.getUserGoals(userId).filter(g => g.status === 'active');
    
    const recommendations: DailyRecommendation[] = [];

    // Weakness-based recommendations
    userWeaknesses.slice(0, 2).forEach((weakness, index) => {
      recommendations.push({
        id: `rec-${Date.now()}-${index}`,
        userId,
        type: 'practice',
        title: `Improve ${weakness.skill}`,
        description: `Focus on ${weakness.skill} to address identified gaps`,
        estimatedTime: 15,
        priority: 0.9 - (index * 0.1),
        reasoning: `Your ${weakness.skill} needs attention based on recent performance`,
        content: { skill: weakness.skill, exercises: weakness.recommendedActions },
        generatedAt: new Date()
      });
    });

    // Goal-based recommendations
    goals.slice(0, 2).forEach((goal, index) => {
      const progressPercent = (goal.currentValue / goal.targetValue) * 100;
      const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      recommendations.push({
        id: `rec-goal-${Date.now()}-${index}`,
        userId,
        type: 'lesson',
        title: `Work towards: ${goal.title}`,
        description: `Continue progress on your ${goal.type} goal`,
        estimatedTime: 20,
        priority: 0.8 - (index * 0.1),
        reasoning: `${progressPercent.toFixed(0)}% complete with ${daysLeft} days remaining`,
        content: { goalId: goal.id, type: goal.type },
        generatedAt: new Date()
      });
    });

    // Spaced repetition recommendations
    const reviewItems = this.getItemsForReview(userId);
    if (reviewItems.length > 0) {
      recommendations.push({
        id: `rec-review-${Date.now()}`,
        userId,
        type: 'review',
        title: 'Review Previous Content',
        description: `Review ${reviewItems.length} items to strengthen memory`,
        estimatedTime: 10,
        priority: 0.7,
        reasoning: 'Spaced repetition improves long-term retention',
        content: { items: reviewItems },
        generatedAt: new Date()
      });
    }

    // Sort by priority and limit to top 5
    const sortedRecommendations = recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);

    this.recommendations.set(userId.toString(), sortedRecommendations);
    return sortedRecommendations;
  }

  private analyzeWeaknesses(userId: number): WeaknessAnalysis[] {
    // Mock analysis - in real app, this would analyze user performance data
    return [
      {
        skill: 'pronunciation',
        confidence: 0.65,
        lastPracticed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        improvementRate: 0.05,
        recommendedActions: ['Practice th sounds', 'Record pronunciation', 'Shadow native speakers']
      },
      {
        skill: 'grammar',
        confidence: 0.72,
        lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        improvementRate: 0.08,
        recommendedActions: ['Review present perfect', 'Practice conditionals', 'Do grammar exercises']
      }
    ];
  }

  private getRecentProgress(userId: number): any[] {
    // Mock recent progress data
    return [
      { type: 'vocabulary', score: 85, date: new Date() },
      { type: 'writing', score: 78, date: new Date() }
    ];
  }

  private getItemsForReview(userId: number): any[] {
    // Mock items that need review based on spaced repetition
    return [
      { type: 'vocabulary', word: 'magnificent', lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { type: 'grammar', concept: 'present perfect', lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
    ];
  }

  // Learning Insights
  generateLearningInsights(userId: number): LearningInsight[] {
    const insights: LearningInsight[] = [];
    const streak = this.getStudyStreak(userId);
    const goals = this.getUserGoals(userId);
    const weaknesses = this.analyzeWeaknesses(userId);

    // Streak insights
    if (streak && streak.currentStreak >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Great Study Streak!',
        description: `You've maintained a ${streak.currentStreak}-day study streak`,
        actionable: true,
        suggestions: ['Keep the momentum going', 'Set a higher weekly goal'],
        dataPoints: [{ streak: streak.currentStreak }]
      });
    }

    // Goal progress insights
    const completedGoals = goals.filter(g => g.status === 'completed');
    if (completedGoals.length > 0) {
      insights.push({
        type: 'achievement',
        title: 'Goals Achieved',
        description: `You've completed ${completedGoals.length} learning goals`,
        actionable: true,
        suggestions: ['Set new challenging goals', 'Celebrate your progress'],
        dataPoints: completedGoals
      });
    }

    // Weakness insights
    const improvingWeaknesses = weaknesses.filter(w => w.improvementRate > 0.05);
    if (improvingWeaknesses.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Skills Improving',
        description: `Your ${improvingWeaknesses.map(w => w.skill).join(' and ')} are getting better`,
        actionable: true,
        suggestions: ['Continue focused practice', 'Track your improvement'],
        dataPoints: improvingWeaknesses
      });
    }

    // Areas needing attention
    const needsAttention = weaknesses.filter(w => w.confidence < 0.7);
    if (needsAttention.length > 0) {
      insights.push({
        type: 'weakness',
        title: 'Areas for Focus',
        description: `Consider spending more time on ${needsAttention.map(w => w.skill).join(' and ')}`,
        actionable: true,
        suggestions: needsAttention.flatMap(w => w.recommendedActions),
        dataPoints: needsAttention
      });
    }

    this.insights.set(userId, insights);
    return insights;
  }

  getDailyRecommendations(userId: number): DailyRecommendation[] {
    const existing = this.recommendations.get(userId.toString());
    if (existing && existing.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const generatedToday = existing.some(rec => {
        const recDate = new Date(rec.generatedAt);
        recDate.setHours(0, 0, 0, 0);
        return recDate.getTime() === today.getTime();
      });
      
      if (generatedToday) {
        return existing;
      }
    }
    
    return this.generateDailyRecommendations(userId);
  }

  getLearningInsights(userId: number): LearningInsight[] {
    const existing = this.insights.get(userId);
    if (existing) {
      return existing;
    }
    
    return this.generateLearningInsights(userId);
  }

  // Achievement System
  checkAchievements(userId: number): any[] {
    const achievements = [];
    const streak = this.getStudyStreak(userId);
    const goals = this.getUserGoals(userId);

    // Streak achievements
    if (streak) {
      if (streak.currentStreak === 7) {
        achievements.push({
          id: 'week-streak',
          title: 'Week Warrior',
          description: 'Studied for 7 consecutive days',
          type: 'streak',
          xpReward: 100
        });
      }
      
      if (streak.currentStreak === 30) {
        achievements.push({
          id: 'month-streak',
          title: 'Monthly Master',
          description: 'Studied for 30 consecutive days',
          type: 'streak',
          xpReward: 500
        });
      }
    }

    // Goal achievements
    const completedGoals = goals.filter(g => g.status === 'completed');
    if (completedGoals.length >= 5) {
      achievements.push({
        id: 'goal-achiever',
        title: 'Goal Crusher',
        description: 'Completed 5 learning goals',
        type: 'goals',
        xpReward: 250
      });
    }

    return achievements;
  }
}

export const personalizedDashboard = new PersonalizedDashboard();