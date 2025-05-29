// Real-time pronunciation feedback system
export interface PronunciationAnalysis {
  word: string;
  userPronunciation: string;
  targetPronunciation: string;
  accuracy: number;
  phonemeAccuracy: PhonemeScore[];
  overallScore: number;
  feedback: string[];
  improvementTips: string[];
}

export interface PhonemeScore {
  phoneme: string;
  accuracy: number;
  position: number;
  feedback: string;
}

export interface PronunciationExercise {
  id: string;
  word: string;
  phonetic: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  commonMistakes: string[];
  tips: string[];
}

export interface PronunciationProgress {
  userId: number;
  phoneme: string;
  accuracy: number;
  attempts: number;
  lastPracticed: Date;
  improvement: number;
}

export class PronunciationAnalyzer {
  private exercises: PronunciationExercise[] = [
    {
      id: 'th-sound',
      word: 'think',
      phonetic: '/θɪŋk/',
      difficulty: 'medium',
      category: 'consonants',
      commonMistakes: ['sink', 'fink'],
      tips: [
        'Place tongue between teeth',
        'Blow air gently through teeth',
        'Practice with "thumb" and "thick"'
      ]
    },
    {
      id: 'r-sound',
      word: 'right',
      phonetic: '/raɪt/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['light', 'wright'],
      tips: [
        'Curl tongue tip slightly back',
        'Don\'t touch roof of mouth',
        'Practice with "red" and "run"'
      ]
    },
    {
      id: 'vowel-ae',
      word: 'cat',
      phonetic: '/kæt/',
      difficulty: 'easy',
      category: 'vowels',
      commonMistakes: ['cut', 'cot'],
      tips: [
        'Open mouth wider',
        'Tongue low and front',
        'Practice with "bat" and "hat"'
      ]
    },
    {
      id: 'vowel-schwa',
      word: 'about',
      phonetic: '/əˈbaʊt/',
      difficulty: 'medium',
      category: 'vowels',
      commonMistakes: ['aboot', 'abowt'],
      tips: [
        'Relax mouth for first syllable',
        'Use neutral vowel sound',
        'Practice unstressed syllables'
      ]
    }
  ];

  private progressData: Map<string, PronunciationProgress> = new Map();

  async analyzeAudio(
    audioData: ArrayBuffer, 
    targetWord: string, 
    userId: number
  ): Promise<PronunciationAnalysis> {
    // In a real implementation, this would use speech recognition APIs
    // For now, we'll simulate the analysis
    return this.simulateAnalysis(targetWord, userId);
  }

  private simulateAnalysis(targetWord: string, userId: number): PronunciationAnalysis {
    const exercise = this.exercises.find(e => e.word === targetWord);
    if (!exercise) {
      throw new Error('Word not found in exercise database');
    }

    // Simulate realistic pronunciation analysis
    const baseAccuracy = 70 + Math.random() * 25; // 70-95% accuracy
    const phonemes = this.extractPhonemes(exercise.phonetic);
    
    const phonemeAccuracy: PhonemeScore[] = phonemes.map((phoneme, index) => ({
      phoneme,
      accuracy: Math.max(60, baseAccuracy + (Math.random() - 0.5) * 20),
      position: index,
      feedback: this.generatePhonemeFeedback(phoneme, baseAccuracy)
    }));

    const overallScore = phonemeAccuracy.reduce((sum, p) => sum + p.accuracy, 0) / phonemeAccuracy.length;
    
    // Update user progress
    this.updatePronunciationProgress(userId, phonemes, phonemeAccuracy);

    return {
      word: targetWord,
      userPronunciation: this.generateUserPronunciation(exercise.phonetic, overallScore),
      targetPronunciation: exercise.phonetic,
      accuracy: overallScore,
      phonemeAccuracy,
      overallScore,
      feedback: this.generateFeedback(overallScore, exercise),
      improvementTips: this.generateImprovementTips(phonemeAccuracy, exercise)
    };
  }

  private extractPhonemes(phoneticString: string): string[] {
    // Simple phoneme extraction (in real implementation, use proper IPA parser)
    return phoneticString
      .replace(/[\/\[\]]/g, '')
      .split('')
      .filter(char => char.trim().length > 0);
  }

  private generatePhonemeFeedback(phoneme: string, accuracy: number): string {
    if (accuracy > 85) return 'Excellent pronunciation';
    if (accuracy > 70) return 'Good, slight adjustment needed';
    if (accuracy > 60) return 'Needs practice';
    return 'Requires significant improvement';
  }

  private generateUserPronunciation(target: string, accuracy: number): string {
    // Simulate user pronunciation based on accuracy
    if (accuracy > 85) return target;
    if (accuracy > 70) return target.replace('θ', 'f'); // Common th->f mistake
    return target.replace('r', 'l'); // Common r->l mistake
  }

  private generateFeedback(score: number, exercise: PronunciationExercise): string[] {
    const feedback: string[] = [];
    
    if (score > 90) {
      feedback.push('Excellent pronunciation! Your accent is very clear.');
    } else if (score > 80) {
      feedback.push('Good pronunciation with minor areas for improvement.');
    } else if (score > 70) {
      feedback.push('Decent pronunciation, but practice will help clarity.');
    } else {
      feedback.push('Needs improvement. Focus on the specific sounds highlighted.');
    }

    if (score < 80) {
      feedback.push(`Common mistake: Avoid saying "${exercise.commonMistakes[0]}"`);
    }

    return feedback;
  }

  private generateImprovementTips(
    phonemeAccuracy: PhonemeScore[], 
    exercise: PronunciationExercise
  ): string[] {
    const tips: string[] = [];
    
    const weakPhonemes = phonemeAccuracy.filter(p => p.accuracy < 75);
    
    if (weakPhonemes.length > 0) {
      tips.push(...exercise.tips);
      tips.push('Practice with similar words to build muscle memory');
      tips.push('Record yourself and compare with native speakers');
    }

    if (phonemeAccuracy.some(p => p.accuracy < 60)) {
      tips.push('Consider slowing down your speech initially');
      tips.push('Focus on mouth position and tongue placement');
    }

    return tips.slice(0, 3); // Return top 3 tips
  }

  private updatePronunciationProgress(
    userId: number, 
    phonemes: string[], 
    accuracy: PhonemeScore[]
  ): void {
    phonemes.forEach((phoneme, index) => {
      const key = `${userId}-${phoneme}`;
      const existing = this.progressData.get(key);
      const currentAccuracy = accuracy[index]?.accuracy || 70;
      
      if (existing) {
        existing.accuracy = (existing.accuracy * existing.attempts + currentAccuracy) / (existing.attempts + 1);
        existing.attempts += 1;
        existing.improvement = currentAccuracy - existing.accuracy;
        existing.lastPracticed = new Date();
      } else {
        this.progressData.set(key, {
          userId,
          phoneme,
          accuracy: currentAccuracy,
          attempts: 1,
          lastPracticed: new Date(),
          improvement: 0
        });
      }
    });
  }

  getExercises(difficulty?: string, category?: string): PronunciationExercise[] {
    let filtered = this.exercises;
    
    if (difficulty) {
      filtered = filtered.filter(e => e.difficulty === difficulty);
    }
    
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
    
    return filtered;
  }

  getUserProgress(userId: number): PronunciationProgress[] {
    return Array.from(this.progressData.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.lastPracticed.getTime() - a.lastPracticed.getTime());
  }

  getWeakestPhonemes(userId: number, limit: number = 5): PronunciationProgress[] {
    return this.getUserProgress(userId)
      .filter(p => p.attempts >= 3) // Only include phonemes with multiple attempts
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }

  generatePersonalizedExercises(userId: number): PronunciationExercise[] {
    const weakPhonemes = this.getWeakestPhonemes(userId, 3);
    
    return this.exercises.filter(exercise => 
      weakPhonemes.some(weak => 
        exercise.phonetic.includes(weak.phoneme)
      )
    );
  }
}

export const pronunciationAnalyzer = new PronunciationAnalyzer();