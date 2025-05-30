// AI-Powered Personalized Learning Path
export interface LearningPathData {
  userId: number;
  currentLevel: string;
  skillAssessment: SkillAssessment;
  learningHistory: LearningActivity[];
  preferences: LearningPreferences;
  recommendations: LearningRecommendation[];
  progressGoals: LearningGoal[];
  weaknessAreas: string[];
  strengthAreas: string[];
  lastUpdated: Date;
}

export interface SkillAssessment {
  vocabulary: SkillLevel;
  grammar: SkillLevel;
  speaking: SkillLevel;
  listening: SkillLevel;
  reading: SkillLevel;
  writing: SkillLevel;
  pronunciation: SkillLevel;
  overallScore: number;
  lastAssessed: Date;
}

export interface SkillLevel {
  level: number; // 1-100
  confidence: number; // 0-1
  recentPerformance: number[];
  timeSpent: number; // minutes
  exercisesCompleted: number;
  accuracy: number;
  improvement: number;
  masteredTopics: string[];
  strugglingTopics: string[];
}

export interface LearningActivity {
  id: string;
  type: 'lesson' | 'exercise' | 'quiz' | 'game' | 'assessment';
  topic: string;
  skillArea: string;
  difficulty: number;
  timeSpent: number;
  score: number;
  accuracy: number;
  completedAt: Date;
  mistakes: ActivityMistake[];
  insights: string[];
}

export interface ActivityMistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  category: string;
  timestamp: Date;
}

export interface LearningPreferences {
  preferredLearningTime: string;
  sessionDuration: number;
  difficultyPreference: 'adaptive' | 'challenging' | 'comfortable';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  focusAreas: string[];
  motivationFactors: string[];
  avoidanceTopics: string[];
}

export interface LearningRecommendation {
  id: string;
  type: 'lesson' | 'review' | 'practice' | 'assessment' | 'game';
  title: string;
  description: string;
  reasoning: string;
  targetSkill: string;
  difficulty: number;
  estimatedTime: number;
  priority: number;
  prerequisites: string[];
  expectedOutcome: string;
  confidenceLevel: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetSkill: string;
  targetLevel: number;
  currentLevel: number;
  deadline: Date;
  milestones: GoalMilestone[];
  progress: number;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface GoalMilestone {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
}

export interface AIInsight {
  type: 'strength' | 'weakness' | 'pattern' | 'recommendation' | 'warning';
  category: string;
  message: string;
  confidence: number;
  actionable: boolean;
  supportingData: any;
  createdAt: Date;
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
  examples: string[];
}

export class AILearningPathSystem {
  private learningPaths: Map<number, LearningPathData> = new Map();
  private activities: Map<string, LearningActivity> = new Map();
  private insights: Map<number, AIInsight[]> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const samplePath: LearningPathData = {
      userId: 1,
      currentLevel: 'intermediate',
      skillAssessment: {
        vocabulary: {
          level: 65,
          confidence: 0.8,
          recentPerformance: [85, 78, 92, 88, 75],
          timeSpent: 180,
          exercisesCompleted: 24,
          accuracy: 83.5,
          improvement: 12,
          masteredTopics: ['family', 'food', 'daily_routines'],
          strugglingTopics: ['business_vocabulary', 'academic_terms']
        },
        grammar: {
          level: 58,
          confidence: 0.65,
          recentPerformance: [72, 65, 78, 70, 69],
          timeSpent: 140,
          exercisesCompleted: 18,
          accuracy: 70.8,
          improvement: 5,
          masteredTopics: ['present_tense', 'basic_questions'],
          strugglingTopics: ['past_perfect', 'conditional_sentences', 'passive_voice']
        },
        speaking: {
          level: 72,
          confidence: 0.85,
          recentPerformance: [88, 92, 85, 90, 87],
          timeSpent: 95,
          exercisesCompleted: 12,
          accuracy: 88.4,
          improvement: 18,
          masteredTopics: ['greetings', 'introductions', 'simple_conversations'],
          strugglingTopics: ['formal_presentations', 'debate_skills']
        },
        listening: {
          level: 68,
          confidence: 0.75,
          recentPerformance: [78, 82, 75, 85, 79],
          timeSpent: 120,
          exercisesCompleted: 15,
          accuracy: 79.8,
          improvement: 8,
          masteredTopics: ['casual_conversations', 'news_clips'],
          strugglingTopics: ['accents', 'fast_speech', 'technical_content']
        },
        reading: {
          level: 70,
          confidence: 0.82,
          recentPerformance: [85, 89, 82, 87, 91],
          timeSpent: 200,
          exercisesCompleted: 22,
          accuracy: 86.8,
          improvement: 15,
          masteredTopics: ['articles', 'short_stories', 'instructions'],
          strugglingTopics: ['academic_texts', 'complex_fiction']
        },
        writing: {
          level: 55,
          confidence: 0.6,
          recentPerformance: [68, 62, 75, 70, 65],
          timeSpent: 85,
          exercisesCompleted: 10,
          accuracy: 68.0,
          improvement: 3,
          masteredTopics: ['simple_sentences', 'personal_letters'],
          strugglingTopics: ['essays', 'formal_writing', 'complex_structures']
        },
        pronunciation: {
          level: 75,
          confidence: 0.88,
          recentPerformance: [92, 88, 95, 90, 87],
          timeSpent: 60,
          exercisesCompleted: 8,
          accuracy: 90.4,
          improvement: 22,
          masteredTopics: ['vowel_sounds', 'basic_consonants'],
          strugglingTopics: ['th_sounds', 'r_sounds', 'stress_patterns']
        },
        overallScore: 66.1,
        lastAssessed: new Date()
      },
      learningHistory: [],
      preferences: {
        preferredLearningTime: 'evening',
        sessionDuration: 30,
        difficultyPreference: 'adaptive',
        learningStyle: 'mixed',
        focusAreas: ['grammar', 'writing'],
        motivationFactors: ['achievements', 'progress_tracking', 'social_features'],
        avoidanceTopics: ['business_english']
      },
      recommendations: [],
      progressGoals: [
        {
          id: 'grammar_goal_1',
          title: 'Master Past Tense Forms',
          description: 'Achieve 85% accuracy in past tense exercises',
          targetSkill: 'grammar',
          targetLevel: 85,
          currentLevel: 58,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          milestones: [
            {
              id: 'past_simple',
              title: 'Past Simple Mastery',
              target: 90,
              current: 75,
              completed: false
            },
            {
              id: 'past_continuous',
              title: 'Past Continuous Mastery',
              target: 85,
              current: 45,
              completed: false
            }
          ],
          progress: 62,
          isActive: true,
          priority: 'high'
        }
      ],
      weaknessAreas: ['grammar', 'writing'],
      strengthAreas: ['speaking', 'pronunciation'],
      lastUpdated: new Date()
    };

    this.learningPaths.set(1, samplePath);
  }

  // AI recommendation engine
  generatePersonalizedRecommendations(userId: number): LearningRecommendation[] {
    const path = this.learningPaths.get(userId);
    if (!path) return [];

    const recommendations: LearningRecommendation[] = [];

    // Analyze weakness areas and suggest targeted practice
    path.weaknessAreas.forEach(skill => {
      const skillData = path.skillAssessment[skill as keyof SkillAssessment] as SkillLevel;
      if (typeof skillData === 'object' && skillData.level) {
        
        // Recommend review for struggling topics
        skillData.strugglingTopics.forEach(topic => {
          recommendations.push({
            id: `review_${skill}_${topic}`,
            type: 'review',
            title: `Review ${topic.replace('_', ' ')} in ${skill}`,
            description: `Targeted practice for ${topic.replace('_', ' ')} to improve your ${skill} skills`,
            reasoning: `Your accuracy in ${topic} is below your average. Focused review will help strengthen this area.`,
            targetSkill: skill,
            difficulty: Math.max(1, skillData.level - 10),
            estimatedTime: 15,
            priority: this.calculatePriority(skillData.level, skillData.confidence),
            prerequisites: [],
            expectedOutcome: `Improve ${topic} understanding by 15-20%`,
            confidenceLevel: 0.85,
            createdAt: new Date()
          });
        });

        // Suggest progressive practice
        if (skillData.level < 75) {
          recommendations.push({
            id: `practice_${skill}`,
            type: 'practice',
            title: `Progressive ${skill.charAt(0).toUpperCase() + skill.slice(1)} Practice`,
            description: `Structured practice exercises to build your ${skill} skills`,
            reasoning: `Your ${skill} level (${skillData.level}) indicates room for improvement with focused practice.`,
            targetSkill: skill,
            difficulty: skillData.level + 5,
            estimatedTime: 25,
            priority: this.calculatePriority(skillData.level, skillData.confidence),
            prerequisites: skillData.masteredTopics,
            expectedOutcome: `Increase ${skill} level by 5-10 points`,
            confidenceLevel: 0.9,
            createdAt: new Date()
          });
        }
      }
    });

    // Recommend building on strengths
    path.strengthAreas.forEach(skill => {
      const skillData = path.skillAssessment[skill as keyof SkillAssessment] as SkillLevel;
      if (typeof skillData === 'object' && skillData.level > 70) {
        recommendations.push({
          id: `advanced_${skill}`,
          type: 'lesson',
          title: `Advanced ${skill.charAt(0).toUpperCase() + skill.slice(1)} Challenges`,
          description: `Take your strong ${skill} skills to the next level`,
          reasoning: `Your excellent ${skill} performance (${skillData.level}) suggests you're ready for advanced content.`,
          targetSkill: skill,
          difficulty: skillData.level + 10,
          estimatedTime: 30,
          priority: 3,
          prerequisites: skillData.masteredTopics,
          expectedOutcome: `Master advanced ${skill} concepts`,
          confidenceLevel: 0.75,
          createdAt: new Date()
        });
      }
    });

    // Balanced skill development
    const skillGaps = this.identifySkillGaps(path.skillAssessment);
    skillGaps.forEach(gap => {
      recommendations.push({
        id: `balance_${gap.skill}`,
        type: 'lesson',
        title: `Balanced Development: ${gap.skill.charAt(0).toUpperCase() + gap.skill.slice(1)}`,
        description: `Bring your ${gap.skill} skills in line with your other abilities`,
        reasoning: `Your ${gap.skill} level (${gap.currentLevel}) is ${gap.difference} points below your average. Balancing skills improves overall fluency.`,
        targetSkill: gap.skill,
        difficulty: gap.currentLevel + 3,
        estimatedTime: 20,
        priority: 4,
        prerequisites: [],
        expectedOutcome: `Close the skill gap and improve overall balance`,
        confidenceLevel: 0.8,
        createdAt: new Date()
      });
    });

    // Sort by priority and confidence
    recommendations.sort((a, b) => (b.priority * b.confidenceLevel) - (a.priority * a.confidenceLevel));

    path.recommendations = recommendations.slice(0, 10); // Keep top 10
    return path.recommendations;
  }

  private calculatePriority(level: number, confidence: number): number {
    // Higher priority for lower levels and confidence
    const levelScore = Math.max(1, (100 - level) / 20);
    const confidenceScore = Math.max(1, (1 - confidence) * 5);
    return Math.round(levelScore + confidenceScore);
  }

  private identifySkillGaps(assessment: SkillAssessment): Array<{skill: string, currentLevel: number, difference: number}> {
    const skills = ['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing', 'pronunciation'];
    const levels = skills.map(skill => {
      const skillData = assessment[skill as keyof SkillAssessment] as SkillLevel;
      return typeof skillData === 'object' ? skillData.level : 0;
    });
    
    const averageLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length;
    
    return skills
      .map((skill, index) => ({
        skill,
        currentLevel: levels[index],
        difference: averageLevel - levels[index]
      }))
      .filter(gap => gap.difference > 10)
      .sort((a, b) => b.difference - a.difference);
  }

  // Learning activity tracking
  recordLearningActivity(userId: number, activity: Omit<LearningActivity, 'id'>): LearningActivity {
    const activityId = `activity_${Date.now()}_${userId}`;
    const fullActivity: LearningActivity = {
      id: activityId,
      ...activity
    };

    this.activities.set(activityId, fullActivity);

    // Update learning path
    const path = this.learningPaths.get(userId);
    if (path) {
      path.learningHistory.push(fullActivity);
      this.updateSkillAssessment(path, fullActivity);
      path.lastUpdated = new Date();
    }

    return fullActivity;
  }

  private updateSkillAssessment(path: LearningPathData, activity: LearningActivity): void {
    const skillData = path.skillAssessment[activity.skillArea as keyof SkillAssessment] as SkillLevel;
    if (typeof skillData === 'object') {
      // Update performance history
      skillData.recentPerformance.push(activity.score);
      if (skillData.recentPerformance.length > 10) {
        skillData.recentPerformance.shift();
      }

      // Update metrics
      skillData.timeSpent += activity.timeSpent;
      skillData.exercisesCompleted += 1;
      
      // Recalculate accuracy
      const totalAccuracy = skillData.accuracy * (skillData.exercisesCompleted - 1) + activity.accuracy;
      skillData.accuracy = totalAccuracy / skillData.exercisesCompleted;

      // Update level based on recent performance
      const recentAverage = skillData.recentPerformance.reduce((sum, score) => sum + score, 0) / skillData.recentPerformance.length;
      const levelAdjustment = (recentAverage - skillData.level) * 0.1;
      skillData.level = Math.max(1, Math.min(100, skillData.level + levelAdjustment));

      // Update confidence based on consistency
      const variance = this.calculateVariance(skillData.recentPerformance);
      skillData.confidence = Math.max(0.1, Math.min(1, 1 - (variance / 1000)));

      // Analyze mistakes for topic classification
      this.analyzeMistakesForTopics(activity.mistakes, skillData);
    }

    // Update overall score
    this.recalculateOverallScore(path.skillAssessment);
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  private analyzeMistakesForTopics(mistakes: ActivityMistake[], skillData: SkillLevel): void {
    const mistakeCategories = mistakes.map(m => m.category);
    
    mistakeCategories.forEach(category => {
      if (!skillData.strugglingTopics.includes(category)) {
        const mistakeCount = mistakeCategories.filter(c => c === category).length;
        if (mistakeCount >= 2) { // Threshold for struggling topic
          skillData.strugglingTopics.push(category);
        }
      }
    });

    // Remove from mastered topics if mistakes occur
    skillData.masteredTopics = skillData.masteredTopics.filter(topic => 
      !mistakeCategories.includes(topic)
    );
  }

  private recalculateOverallScore(assessment: SkillAssessment): void {
    const skills = ['vocabulary', 'grammar', 'speaking', 'listening', 'reading', 'writing', 'pronunciation'];
    const levels = skills.map(skill => {
      const skillData = assessment[skill as keyof SkillAssessment] as SkillLevel;
      return typeof skillData === 'object' ? skillData.level : 0;
    });
    
    assessment.overallScore = levels.reduce((sum, level) => sum + level, 0) / levels.length;
  }

  // AI insights generation
  generateAIInsights(userId: number): AIInsight[] {
    const path = this.learningPaths.get(userId);
    if (!path) return [];

    const insights: AIInsight[] = [];

    // Learning patterns
    const patterns = this.detectLearningPatterns(path);
    patterns.forEach(pattern => {
      insights.push({
        type: pattern.impact === 'positive' ? 'strength' : 'weakness',
        category: 'learning_pattern',
        message: `Pattern detected: ${pattern.pattern}. ${pattern.recommendation}`,
        confidence: 0.8,
        actionable: true,
        supportingData: pattern.examples,
        createdAt: new Date()
      });
    });

    // Progress analysis
    const progressInsights = this.analyzeProgress(path);
    insights.push(...progressInsights);

    // Goal recommendations
    const goalInsights = this.analyzeGoals(path);
    insights.push(...goalInsights);

    this.insights.set(userId, insights);
    return insights;
  }

  private detectLearningPatterns(path: LearningPathData): LearningPattern[] {
    const patterns: LearningPattern[] = [];
    const recentActivities = path.learningHistory.slice(-20);

    // Time-based patterns
    const timePattern = this.analyzeTimePatterns(recentActivities);
    if (timePattern) patterns.push(timePattern);

    // Difficulty progression patterns
    const difficultyPattern = this.analyzeDifficultyProgression(recentActivities);
    if (difficultyPattern) patterns.push(difficultyPattern);

    // Accuracy patterns
    const accuracyPattern = this.analyzeAccuracyPatterns(recentActivities);
    if (accuracyPattern) patterns.push(accuracyPattern);

    return patterns;
  }

  private analyzeTimePatterns(activities: LearningActivity[]): LearningPattern | null {
    const averageTime = activities.reduce((sum, a) => sum + a.timeSpent, 0) / activities.length;
    const recentAverage = activities.slice(-5).reduce((sum, a) => sum + a.timeSpent, 0) / 5;
    
    if (recentAverage > averageTime * 1.3) {
      return {
        pattern: 'Increased study time',
        frequency: 5,
        impact: 'positive',
        recommendation: 'Maintain this excellent study commitment! Consider breaking longer sessions into smaller chunks for better retention.',
        examples: ['Recent sessions averaging 20% longer than usual']
      };
    }
    
    if (recentAverage < averageTime * 0.7) {
      return {
        pattern: 'Decreased study time',
        frequency: 5,
        impact: 'negative',
        recommendation: 'Try to maintain consistent study duration. Even short 10-15 minute sessions can be effective.',
        examples: ['Recent sessions significantly shorter than usual']
      };
    }

    return null;
  }

  private analyzeDifficultyProgression(activities: LearningActivity[]): LearningPattern | null {
    const difficulties = activities.map(a => a.difficulty);
    const isProgressing = difficulties.every((diff, index) => 
      index === 0 || diff >= difficulties[index - 1] - 1
    );

    if (isProgressing && difficulties.length > 3) {
      return {
        pattern: 'Steady difficulty progression',
        frequency: difficulties.length,
        impact: 'positive',
        recommendation: 'Excellent progression! You\'re challenging yourself appropriately.',
        examples: ['Difficulty levels: ' + difficulties.join(' → ')]
      };
    }

    return null;
  }

  private analyzeAccuracyPatterns(activities: LearningActivity[]): LearningPattern | null {
    const accuracies = activities.map(a => a.accuracy);
    const trend = this.calculateTrend(accuracies);

    if (trend > 5) {
      return {
        pattern: 'Improving accuracy',
        frequency: accuracies.length,
        impact: 'positive',
        recommendation: 'Great improvement in accuracy! Keep up the focused practice.',
        examples: [`Accuracy improved by ${trend.toFixed(1)}% over recent activities`]
      };
    }

    if (trend < -5) {
      return {
        pattern: 'Declining accuracy',
        frequency: accuracies.length,
        impact: 'negative',
        recommendation: 'Consider reviewing fundamentals or slowing down to focus on accuracy.',
        examples: [`Accuracy declined by ${Math.abs(trend).toFixed(1)}% over recent activities`]
      };
    }

    return null;
  }

  private calculateTrend(numbers: number[]): number {
    if (numbers.length < 2) return 0;
    
    const firstHalf = numbers.slice(0, Math.floor(numbers.length / 2));
    const secondHalf = numbers.slice(Math.floor(numbers.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, n) => sum + n, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, n) => sum + n, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  }

  private analyzeProgress(path: LearningPathData): AIInsight[] {
    const insights: AIInsight[] = [];

    // Overall progress insight
    if (path.skillAssessment.overallScore > 70) {
      insights.push({
        type: 'strength',
        category: 'overall_progress',
        message: 'You\'re making excellent progress! Your overall skill level is strong.',
        confidence: 0.9,
        actionable: false,
        supportingData: { overallScore: path.skillAssessment.overallScore },
        createdAt: new Date()
      });
    }

    // Skill balance insight
    const skillGaps = this.identifySkillGaps(path.skillAssessment);
    if (skillGaps.length > 0) {
      insights.push({
        type: 'recommendation',
        category: 'skill_balance',
        message: `Focus on improving ${skillGaps[0].skill} to balance your skills better.`,
        confidence: 0.85,
        actionable: true,
        supportingData: skillGaps,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private analyzeGoals(path: LearningPathData): AIInsight[] {
    const insights: AIInsight[] = [];

    path.progressGoals.forEach(goal => {
      if (goal.isActive) {
        const timeLeft = goal.deadline.getTime() - Date.now();
        const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
        
        if (daysLeft < 7 && goal.progress < 80) {
          insights.push({
            type: 'warning',
            category: 'goal_deadline',
            message: `Goal "${goal.title}" needs attention - ${daysLeft} days left with ${goal.progress}% progress.`,
            confidence: 0.95,
            actionable: true,
            supportingData: goal,
            createdAt: new Date()
          });
        }
      }
    });

    return insights;
  }

  // Public methods
  getLearningPath(userId: number): LearningPathData | undefined {
    return this.learningPaths.get(userId);
  }

  updateLearningPreferences(userId: number, preferences: Partial<LearningPreferences>): boolean {
    const path = this.learningPaths.get(userId);
    if (!path) return false;

    path.preferences = { ...path.preferences, ...preferences };
    path.lastUpdated = new Date();
    return true;
  }

  createLearningGoal(userId: number, goal: Omit<LearningGoal, 'id' | 'progress'>): LearningGoal | null {
    const path = this.learningPaths.get(userId);
    if (!path) return null;

    const newGoal: LearningGoal = {
      id: `goal_${Date.now()}_${userId}`,
      progress: 0,
      ...goal
    };

    path.progressGoals.push(newGoal);
    return newGoal;
  }

  getNextRecommendation(userId: number): LearningRecommendation | null {
    const recommendations = this.generatePersonalizedRecommendations(userId);
    return recommendations.length > 0 ? recommendations[0] : null;
  }

  assessSkillLevel(userId: number, skillArea: string, score: number): SkillLevel | null {
    const path = this.learningPaths.get(userId);
    if (!path) return null;

    const skillData = path.skillAssessment[skillArea as keyof SkillAssessment] as SkillLevel;
    if (typeof skillData === 'object') {
      skillData.level = Math.round((skillData.level + score) / 2);
      skillData.lastAssessed = new Date();
      this.recalculateOverallScore(path.skillAssessment);
      return skillData;
    }

    return null;
  }
}

export const aiLearningPathSystem = new AILearningPathSystem();