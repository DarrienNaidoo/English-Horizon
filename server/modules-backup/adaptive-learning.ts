// Advanced Adaptive Learning Engine
import { User, UserProgress, Lesson, Vocabulary } from "@shared/schema";

export interface LearningProfile {
  userId: number;
  currentLevel: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number; // 0.1 to 1.0
  averageSessionTime: number;
  preferredTopics: string[];
  masteryLevels: Record<string, number>; // topic -> mastery percentage
  lastUpdated: Date;
}

export interface AdaptiveRecommendation {
  type: 'lesson' | 'review' | 'challenge' | 'practice';
  content: any;
  reasoning: string;
  difficulty: number;
  estimatedTime: number;
  priority: number;
}

export class AdaptiveLearningEngine {
  
  // Analyze user performance and update learning profile
  analyzeUserPerformance(
    user: User, 
    progressHistory: UserProgress[], 
    lessons: Lesson[]
  ): LearningProfile {
    const recentProgress = progressHistory
      .filter(p => p.completedAt && 
        new Date(p.completedAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    // Calculate mastery levels by topic
    const masteryLevels = this.calculateMasteryLevels(recentProgress, lessons);
    
    // Identify strengths and weaknesses
    const { strengths, weaknesses } = this.identifyStrengthsWeaknesses(masteryLevels);
    
    // Detect learning style based on performance patterns
    const learningStyle = this.detectLearningStyle(recentProgress, lessons);
    
    // Calculate preferred difficulty
    const difficultyPreference = this.calculateOptimalDifficulty(recentProgress);
    
    // Analyze session patterns
    const averageSessionTime = this.calculateAverageSessionTime(recentProgress);
    
    // Identify preferred topics
    const preferredTopics = this.identifyPreferredTopics(recentProgress, lessons);

    return {
      userId: user.id,
      currentLevel: user.level,
      strengths,
      weaknesses,
      learningStyle,
      difficultyPreference,
      averageSessionTime,
      preferredTopics,
      masteryLevels,
      lastUpdated: new Date()
    };
  }

  // Generate personalized recommendations
  generateRecommendations(
    profile: LearningProfile, 
    availableLessons: Lesson[],
    progressHistory: UserProgress[]
  ): AdaptiveRecommendation[] {
    const recommendations: AdaptiveRecommendation[] = [];

    // 1. Address weaknesses with targeted practice
    for (const weakness of profile.weaknesses.slice(0, 2)) {
      const weaknessLessons = availableLessons.filter(lesson => 
        lesson.topic === weakness && 
        this.getDifficultyScore(lesson) <= profile.difficultyPreference + 0.2
      );
      
      if (weaknessLessons.length > 0) {
        const lesson = this.selectOptimalLesson(weaknessLessons, profile);
        recommendations.push({
          type: 'lesson',
          content: lesson,
          reasoning: `Targeted practice for ${weakness} - identified as area for improvement`,
          difficulty: this.getDifficultyScore(lesson),
          estimatedTime: lesson.estimatedMinutes,
          priority: 0.9
        });
      }
    }

    // 2. Spaced repetition for review content
    const reviewContent = this.identifyReviewContent(progressHistory, availableLessons);
    for (const content of reviewContent.slice(0, 3)) {
      recommendations.push({
        type: 'review',
        content,
        reasoning: 'Spaced repetition - optimal time for review based on forgetting curve',
        difficulty: this.getDifficultyScore(content),
        estimatedTime: Math.ceil(content.estimatedMinutes * 0.6), // Review takes less time
        priority: 0.7
      });
    }

    // 3. Progressive difficulty advancement
    const nextLevelContent = this.getNextLevelContent(profile, availableLessons);
    if (nextLevelContent) {
      recommendations.push({
        type: 'challenge',
        content: nextLevelContent,
        reasoning: 'Ready for next difficulty level based on recent performance',
        difficulty: this.getDifficultyScore(nextLevelContent),
        estimatedTime: nextLevelContent.estimatedMinutes,
        priority: 0.8
      });
    }

    // 4. Leverage strengths for confidence building
    for (const strength of profile.strengths.slice(0, 1)) {
      const strengthLessons = availableLessons.filter(lesson => 
        lesson.topic === strength &&
        this.getDifficultyScore(lesson) >= profile.difficultyPreference - 0.1
      );
      
      if (strengthLessons.length > 0) {
        const lesson = this.selectOptimalLesson(strengthLessons, profile);
        recommendations.push({
          type: 'practice',
          content: lesson,
          reasoning: `Building on ${strength} strength - maintaining momentum`,
          difficulty: this.getDifficultyScore(lesson),
          estimatedTime: lesson.estimatedMinutes,
          priority: 0.6
        });
      }
    }

    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }

  // Calculate optimal difficulty for next lesson
  calculateOptimalDifficulty(progressHistory: UserProgress[]): number {
    if (progressHistory.length === 0) return 0.3; // Start with easy content

    const recentScores = progressHistory
      .filter(p => p.score !== null)
      .slice(0, 10)
      .map(p => p.score! / 100);

    if (recentScores.length === 0) return 0.3;

    const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const successRate = recentScores.filter(score => score >= 0.7).length / recentScores.length;

    // Adjust difficulty based on performance
    if (successRate > 0.8 && averageScore > 0.85) {
      return Math.min(1.0, averageScore + 0.1); // Increase difficulty
    } else if (successRate < 0.6 || averageScore < 0.6) {
      return Math.max(0.1, averageScore - 0.1); // Decrease difficulty
    }
    
    return averageScore;
  }

  // Detect learning style based on performance patterns
  private detectLearningStyle(
    progressHistory: UserProgress[], 
    lessons: Lesson[]
  ): 'visual' | 'auditory' | 'kinesthetic' | 'mixed' {
    const lessonMap = new Map(lessons.map(l => [l.id, l]));
    const styleScores = { visual: 0, auditory: 0, kinesthetic: 0 };

    for (const progress of progressHistory) {
      const lesson = lessonMap.get(progress.lessonId);
      if (!lesson || !progress.score) continue;

      const score = progress.score / 100;
      const content = lesson.content as any;

      // Analyze content type preferences
      if (content.hasImages || content.hasCharts) {
        styleScores.visual += score;
      }
      if (content.hasAudio || content.hasSpeaking) {
        styleScores.auditory += score;
      }
      if (content.hasInteraction || content.hasGames) {
        styleScores.kinesthetic += score;
      }
    }

    const maxScore = Math.max(...Object.values(styleScores));
    const dominantStyles = Object.entries(styleScores)
      .filter(([_, score]) => score > maxScore * 0.8)
      .map(([style, _]) => style);

    if (dominantStyles.length > 1) return 'mixed';
    return (dominantStyles[0] as any) || 'mixed';
  }

  // Calculate mastery levels for different topics
  private calculateMasteryLevels(
    progressHistory: UserProgress[], 
    lessons: Lesson[]
  ): Record<string, number> {
    const lessonMap = new Map(lessons.map(l => [l.id, l]));
    const topicScores: Record<string, number[]> = {};

    for (const progress of progressHistory) {
      const lesson = lessonMap.get(progress.lessonId);
      if (!lesson || !progress.score) continue;

      if (!topicScores[lesson.topic]) {
        topicScores[lesson.topic] = [];
      }
      topicScores[lesson.topic].push(progress.score);
    }

    const masteryLevels: Record<string, number> = {};
    for (const [topic, scores] of Object.entries(topicScores)) {
      // Use weighted average with more recent scores having higher weight
      const weightedSum = scores.reduce((sum, score, index) => {
        const weight = Math.pow(1.1, index); // More recent = higher weight
        return sum + (score * weight);
      }, 0);
      
      const totalWeight = scores.reduce((sum, _, index) => sum + Math.pow(1.1, index), 0);
      masteryLevels[topic] = weightedSum / totalWeight;
    }

    return masteryLevels;
  }

  // Identify strengths and weaknesses
  private identifyStrengthsWeaknesses(masteryLevels: Record<string, number>) {
    const entries = Object.entries(masteryLevels);
    if (entries.length === 0) return { strengths: [], weaknesses: [] };

    const averageMastery = entries.reduce((sum, [_, level]) => sum + level, 0) / entries.length;
    
    const strengths = entries
      .filter(([_, level]) => level > averageMastery + 10)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([topic, _]) => topic);

    const weaknesses = entries
      .filter(([_, level]) => level < averageMastery - 10)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 3)
      .map(([topic, _]) => topic);

    return { strengths, weaknesses };
  }

  // Calculate average session time
  private calculateAverageSessionTime(progressHistory: UserProgress[]): number {
    const sessionTimes = progressHistory
      .filter(p => p.timeSpent && p.timeSpent > 0)
      .map(p => p.timeSpent!);

    if (sessionTimes.length === 0) return 15; // Default 15 minutes

    return sessionTimes.reduce((sum, time) => sum + time, 0) / sessionTimes.length;
  }

  // Identify preferred topics
  private identifyPreferredTopics(
    progressHistory: UserProgress[], 
    lessons: Lesson[]
  ): string[] {
    const lessonMap = new Map(lessons.map(l => [l.id, l]));
    const topicEngagement: Record<string, number> = {};

    for (const progress of progressHistory) {
      const lesson = lessonMap.get(progress.lessonId);
      if (!lesson) continue;

      const engagementScore = (
        (progress.score || 0) * 0.4 +
        (progress.timeSpent || 0) * 0.3 +
        (progress.completed ? 100 : 0) * 0.3
      );

      topicEngagement[lesson.topic] = (topicEngagement[lesson.topic] || 0) + engagementScore;
    }

    return Object.entries(topicEngagement)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([topic, _]) => topic);
  }

  // Identify content that needs review based on spaced repetition
  private identifyReviewContent(
    progressHistory: UserProgress[], 
    lessons: Lesson[]
  ): Lesson[] {
    const now = Date.now();
    const lessonMap = new Map(lessons.map(l => [l.id, l]));
    const reviewCandidates: Array<{ lesson: Lesson; score: number; daysSince: number }> = [];

    for (const progress of progressHistory) {
      if (!progress.completedAt || !progress.score) continue;

      const lesson = lessonMap.get(progress.lessonId);
      if (!lesson) continue;

      const daysSince = (now - new Date(progress.completedAt).getTime()) / (1000 * 60 * 60 * 24);
      const score = progress.score;

      // Spaced repetition intervals based on performance
      let reviewInterval = 1; // days
      if (score >= 90) reviewInterval = 7;
      else if (score >= 80) reviewInterval = 5;
      else if (score >= 70) reviewInterval = 3;
      else reviewInterval = 1;

      if (daysSince >= reviewInterval) {
        reviewCandidates.push({ lesson, score, daysSince });
      }
    }

    // Prioritize by lower scores and longer time since completion
    return reviewCandidates
      .sort((a, b) => (a.score - b.score) + (b.daysSince - a.daysSince))
      .slice(0, 10)
      .map(candidate => candidate.lesson);
  }

  // Get content for the next difficulty level
  private getNextLevelContent(profile: LearningProfile, lessons: Lesson[]): Lesson | null {
    const currentDifficulty = profile.difficultyPreference;
    const targetDifficulty = Math.min(1.0, currentDifficulty + 0.1);

    const candidates = lessons.filter(lesson => {
      const difficulty = this.getDifficultyScore(lesson);
      return difficulty >= targetDifficulty - 0.05 && difficulty <= targetDifficulty + 0.05;
    });

    if (candidates.length === 0) return null;

    // Prefer topics the user is strong in for confidence building
    const preferredCandidates = candidates.filter(lesson => 
      profile.strengths.includes(lesson.topic)
    );

    return preferredCandidates.length > 0 ? preferredCandidates[0] : candidates[0];
  }

  // Select optimal lesson from a set of candidates
  private selectOptimalLesson(lessons: Lesson[], profile: LearningProfile): Lesson {
    // Score lessons based on multiple factors
    const scoredLessons = lessons.map(lesson => {
      let score = 0;

      // Prefer lessons matching user's learning style
      const content = lesson.content as any;
      if (profile.learningStyle === 'visual' && (content.hasImages || content.hasCharts)) score += 2;
      if (profile.learningStyle === 'auditory' && (content.hasAudio || content.hasSpeaking)) score += 2;
      if (profile.learningStyle === 'kinesthetic' && (content.hasInteraction || content.hasGames)) score += 2;

      // Prefer lessons with appropriate duration
      const timeDiff = Math.abs(lesson.estimatedMinutes - profile.averageSessionTime);
      score += Math.max(0, 3 - timeDiff / 5); // Penalty for time mismatch

      // Prefer topics user is interested in
      if (profile.preferredTopics.includes(lesson.topic)) score += 1;

      return { lesson, score };
    });

    // Return lesson with highest score
    const best = scoredLessons.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return best.lesson;
  }

  // Calculate difficulty score for a lesson
  private getDifficultyScore(lesson: Lesson): number {
    const levelScores = {
      'beginner': 0.2,
      'intermediate': 0.5,
      'advanced': 0.8,
      'expert': 1.0
    };

    const baseScore = levelScores[lesson.level as keyof typeof levelScores] || 0.5;
    
    // Adjust based on lesson characteristics
    const content = lesson.content as any;
    let adjustedScore = baseScore;

    if (content.complexity === 'high') adjustedScore += 0.1;
    if (content.vocabulary?.length > 20) adjustedScore += 0.05;
    if (lesson.estimatedMinutes > 30) adjustedScore += 0.05;

    return Math.min(1.0, Math.max(0.1, adjustedScore));
  }
}

export const adaptiveLearningEngine = new AdaptiveLearningEngine();