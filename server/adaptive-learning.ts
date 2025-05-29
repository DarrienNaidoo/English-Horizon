import type { 
  User, UserProgress, Activity, LearningAnalytics, PersonalizedRecommendation, 
  AdaptiveFeedback, InsertLearningAnalytics, InsertPersonalizedRecommendation, 
  InsertAdaptiveFeedback 
} from "@shared/schema";

// Adaptive Learning Engine
export class AdaptiveLearningEngine {
  
  // Analyze student performance and learning patterns
  static analyzeStudentPerformance(
    user: User, 
    progressHistory: UserProgress[], 
    activities: Activity[]
  ): InsertLearningAnalytics {
    
    // Calculate skill area proficiencies
    const skillAreas = ['speaking', 'reading', 'writing', 'listening', 'vocabulary', 'grammar'];
    const skillAnalysis: Record<string, number> = {};
    
    // Analyze completion rates and scores
    const completionRate = progressHistory.filter(p => p.completed).length / Math.max(progressHistory.length, 1);
    const averageScore = progressHistory.reduce((sum, p) => sum + (p.score || 0), 0) / Math.max(progressHistory.length, 1);
    
    // Determine struggling and strong topics
    const strugglingTopics: string[] = [];
    const strongTopics: string[] = [];
    
    // Analyze by lesson categories
    progressHistory.forEach(progress => {
      if ((progress.score || 0) < 70) {
        strugglingTopics.push('grammar'); // Example analysis
      } else if ((progress.score || 0) > 85) {
        strongTopics.push('vocabulary');
      }
    });
    
    // Calculate overall proficiency level (1-5)
    let proficiencyLevel = 1;
    if (averageScore > 90) proficiencyLevel = 5;
    else if (averageScore > 80) proficiencyLevel = 4;
    else if (averageScore > 70) proficiencyLevel = 3;
    else if (averageScore > 60) proficiencyLevel = 2;
    
    // Determine recommended difficulty
    let recommendedDifficulty = 'beginner';
    if (proficiencyLevel >= 4) recommendedDifficulty = 'advanced';
    else if (proficiencyLevel >= 3) recommendedDifficulty = 'intermediate';
    
    // Analyze learning style based on activity preferences
    let learningStyle = 'mixed';
    const activityTypes = activities.map(a => a.type);
    if (activityTypes.filter(t => t.includes('visual')).length > activityTypes.length * 0.6) {
      learningStyle = 'visual';
    } else if (activityTypes.filter(t => t.includes('audio')).length > activityTypes.length * 0.6) {
      learningStyle = 'auditory';
    } else if (activityTypes.filter(t => t.includes('practice')).length > activityTypes.length * 0.6) {
      learningStyle = 'kinesthetic';
    }
    
    return {
      userId: user.id,
      skillArea: 'general', // Overall analysis
      proficiencyLevel,
      strugglingTopics,
      strongTopics,
      recommendedDifficulty,
      learningStyle,
      adaptiveMetrics: {
        completionRate,
        averageScore,
        streakDays: user.streak,
        totalXP: user.totalXP,
        learningVelocity: activities.length / Math.max(user.streak, 1),
        difficultyPreference: recommendedDifficulty,
        timeSpentLearning: activities.length * 15 // Estimated minutes
      }
    };
  }
  
  // Generate personalized recommendations
  static generateRecommendations(
    user: User,
    analytics: LearningAnalytics,
    currentProgress: UserProgress[]
  ): InsertPersonalizedRecommendation[] {
    const recommendations: InsertPersonalizedRecommendation[] = [];
    
    // Recommendation 1: Address struggling topics
    if (analytics.strugglingTopics.length > 0) {
      recommendations.push({
        userId: user.id,
        lessonId: null,
        recommendationType: 'review',
        title: 'Grammar Review Session',
        description: 'Focus on areas where you need more practice to build confidence',
        difficulty: 'beginner',
        estimatedTime: 20,
        priority: 5,
        reasoning: 'Based on your recent performance, additional practice in grammar will help solidify your foundation'
      });
    }
    
    // Recommendation 2: Build on strong areas
    if (analytics.strongTopics.length > 0) {
      recommendations.push({
        userId: user.id,
        lessonId: null,
        recommendationType: 'challenge',
        title: 'Advanced Vocabulary Challenge',
        description: 'Take your vocabulary skills to the next level with challenging exercises',
        difficulty: 'advanced',
        estimatedTime: 15,
        priority: 3,
        reasoning: 'You excel in vocabulary - time to challenge yourself with more advanced content'
      });
    }
    
    // Recommendation 3: Adaptive difficulty
    if (analytics.proficiencyLevel >= 3) {
      recommendations.push({
        userId: user.id,
        lessonId: 1,
        recommendationType: 'lesson',
        title: 'Cultural Conversation Practice',
        description: 'Practice speaking about Chinese traditions and festivals',
        difficulty: analytics.recommendedDifficulty,
        estimatedTime: 25,
        priority: 4,
        reasoning: 'Your level suggests you\'re ready for more conversational practice with cultural context'
      });
    }
    
    // Recommendation 4: Learning style adaptation
    if (analytics.learningStyle === 'visual') {
      recommendations.push({
        userId: user.id,
        lessonId: null,
        recommendationType: 'exercise',
        title: 'Visual Learning Cards',
        description: 'Interactive flashcards with images and visual cues',
        difficulty: analytics.recommendedDifficulty,
        estimatedTime: 10,
        priority: 3,
        reasoning: 'Your learning style preference suggests visual materials will be most effective'
      });
    }
    
    // Recommendation 5: Consistency building
    if (user.streak < 7) {
      recommendations.push({
        userId: user.id,
        lessonId: null,
        recommendationType: 'exercise',
        title: 'Daily 5-Minute Practice',
        description: 'Quick daily exercises to build your learning habit',
        difficulty: 'beginner',
        estimatedTime: 5,
        priority: 4,
        reasoning: 'Building a consistent daily practice will accelerate your progress'
      });
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  }
  
  // Generate contextual feedback
  static generateAdaptiveFeedback(
    user: User,
    analytics: LearningAnalytics,
    recentActivity?: Activity
  ): InsertAdaptiveFeedback[] {
    const feedback: InsertAdaptiveFeedback[] = [];
    
    // Performance-based feedback
    if (analytics.adaptiveMetrics.averageScore > 85) {
      feedback.push({
        userId: user.id,
        activityId: recentActivity?.id || null,
        feedbackType: 'achievement',
        message: 'Excellent work! Your consistent high performance shows real mastery.',
        chineseTranslation: '做得很好！你持续的高水平表现显示了真正的掌握。',
        tone: 'celebratory',
        triggers: ['high_performance', 'consistency']
      });
    } else if (analytics.adaptiveMetrics.averageScore < 60) {
      feedback.push({
        userId: user.id,
        activityId: recentActivity?.id || null,
        feedbackType: 'encouragement',
        message: 'Learning takes time - every step forward is progress! Keep practicing.',
        chineseTranslation: '学习需要时间——每一步前进都是进步！继续练习。',
        tone: 'motivational',
        triggers: ['struggling', 'low_scores']
      });
    }
    
    // Streak-based feedback
    if (user.streak >= 7) {
      feedback.push({
        userId: user.id,
        activityId: null,
        feedbackType: 'achievement',
        message: `Amazing! You've maintained a ${user.streak}-day learning streak!`,
        chineseTranslation: `太棒了！你已经保持了${user.streak}天的学习连续记录！`,
        tone: 'celebratory',
        triggers: ['streak_achievement']
      });
    }
    
    // Learning style feedback
    if (analytics.learningStyle === 'visual') {
      feedback.push({
        userId: user.id,
        activityId: null,
        feedbackType: 'guidance',
        message: 'Try using visual study materials like charts and images to enhance your learning.',
        chineseTranslation: '尝试使用图表和图像等视觉学习材料来增强你的学习效果。',
        tone: 'constructive',
        triggers: ['learning_style_optimization']
      });
    }
    
    return feedback.slice(0, 2); // Return top 2 feedback messages
  }
  
  // Calculate adaptive difficulty for next lesson
  static calculateAdaptiveDifficulty(
    analytics: LearningAnalytics,
    recentPerformance: UserProgress[]
  ): string {
    const recentScores = recentPerformance.slice(-5).map(p => p.score || 0);
    const recentAverage = recentScores.reduce((a, b) => a + b, 0) / Math.max(recentScores.length, 1);
    
    // Adaptive difficulty adjustment
    if (recentAverage > 90 && analytics.proficiencyLevel >= 4) {
      return 'advanced';
    } else if (recentAverage > 75 && analytics.proficiencyLevel >= 3) {
      return 'intermediate';
    } else if (recentAverage < 60) {
      return 'beginner';
    }
    
    return analytics.recommendedDifficulty;
  }
  
  // Generate learning path suggestions
  static generateLearningPath(
    user: User,
    analytics: LearningAnalytics
  ): { focus: string; nextSteps: string[]; timeframe: string } {
    const { proficiencyLevel, strugglingTopics, strongTopics } = analytics;
    
    if (proficiencyLevel <= 2) {
      return {
        focus: 'Foundation Building',
        nextSteps: [
          'Complete basic vocabulary lessons',
          'Practice pronunciation with audio exercises',
          'Master fundamental grammar patterns',
          'Build daily learning habit'
        ],
        timeframe: '4-6 weeks'
      };
    } else if (proficiencyLevel === 3) {
      return {
        focus: 'Skill Integration',
        nextSteps: [
          'Practice conversational scenarios',
          'Read short cultural texts',
          'Write simple paragraphs',
          'Join speaking practice sessions'
        ],
        timeframe: '6-8 weeks'
      };
    } else {
      return {
        focus: 'Advanced Fluency',
        nextSteps: [
          'Engage in complex discussions',
          'Analyze cultural literature',
          'Practice presentation skills',
          'Mentor newer learners'
        ],
        timeframe: '8-12 weeks'
      };
    }
  }
}

// Utility functions for adaptive learning
export class AdaptiveLearningUtils {
  
  // Calculate learning efficiency score
  static calculateLearningEfficiency(
    timeSpent: number, // in minutes
    xpGained: number,
    lessonsCompleted: number
  ): number {
    const baseEfficiency = xpGained / Math.max(timeSpent, 1);
    const completionBonus = lessonsCompleted * 0.1;
    return Math.min(baseEfficiency + completionBonus, 10); // Cap at 10
  }
  
  // Predict optimal study time
  static predictOptimalStudyTime(analytics: LearningAnalytics): number {
    const { adaptiveMetrics } = analytics;
    const baseTime = 20; // minutes
    
    // Adjust based on learning velocity
    if (adaptiveMetrics.learningVelocity > 2) {
      return baseTime + 10; // High velocity learners can handle more
    } else if (adaptiveMetrics.learningVelocity < 1) {
      return baseTime - 5; // Slower learners need shorter sessions
    }
    
    return baseTime;
  }
  
  // Generate skill progression roadmap
  static generateSkillRoadmap(currentLevel: number): {
    current: string;
    next: string;
    requirements: string[];
  } {
    const roadmap = {
      1: {
        current: 'Beginner',
        next: 'Elementary',
        requirements: ['Basic vocabulary (100 words)', 'Simple sentence structure', 'Pronunciation basics']
      },
      2: {
        current: 'Elementary', 
        next: 'Intermediate',
        requirements: ['Expanded vocabulary (300 words)', 'Past/future tenses', 'Basic conversations']
      },
      3: {
        current: 'Intermediate',
        next: 'Upper Intermediate', 
        requirements: ['Complex vocabulary (500 words)', 'Cultural understanding', 'Fluent conversations']
      },
      4: {
        current: 'Upper Intermediate',
        next: 'Advanced',
        requirements: ['Academic vocabulary (700 words)', 'Nuanced expressions', 'Presentation skills']
      },
      5: {
        current: 'Advanced',
        next: 'Native-like',
        requirements: ['Specialized vocabulary (1000+ words)', 'Cultural fluency', 'Teaching ability']
      }
    };
    
    return roadmap[currentLevel as keyof typeof roadmap] || roadmap[1];
  }
}