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
    // TH Sounds
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
      id: 'th-sound-2',
      word: 'mother',
      phonetic: '/ˈmʌðər/',
      difficulty: 'medium',
      category: 'consonants',
      commonMistakes: ['mudder', 'mozzer'],
      tips: [
        'Voiced TH - vocal cords vibrate',
        'Touch teeth with tongue tip',
        'Practice with "father" and "brother"'
      ]
    },
    {
      id: 'th-sound-3',
      word: 'birthday',
      phonetic: '/ˈbɜrθdeɪ/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['birfday', 'birthday'],
      tips: [
        'Two TH sounds in one word',
        'First TH is voiceless',
        'Practice slowly then speed up'
      ]
    },

    // R Sounds
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
      id: 'r-sound-2',
      word: 'restaurant',
      phonetic: '/ˈrɛstərɑnt/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['westaurant', 'lestaurant'],
      tips: [
        'Strong R at beginning',
        'Weak R in middle',
        'Practice each syllable separately'
      ]
    },
    {
      id: 'r-sound-3',
      word: 'refrigerator',
      phonetic: '/rɪˈfrɪdʒəreɪtər/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['lefrigerator', 'frigerator'],
      tips: [
        'Multiple R sounds',
        'Focus on initial R',
        'Break into syllables: re-fri-ge-ra-tor'
      ]
    },

    // L Sounds
    {
      id: 'l-sound',
      word: 'love',
      phonetic: '/lʌv/',
      difficulty: 'medium',
      category: 'consonants',
      commonMistakes: ['rove', 'wove'],
      tips: [
        'Touch tip of tongue to roof of mouth',
        'Keep tongue sides down',
        'Practice with "light" and "like"'
      ]
    },
    {
      id: 'l-sound-2',
      word: 'parallel',
      phonetic: '/ˈpærəlɛl/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['parawel', 'paralwel'],
      tips: [
        'Two L sounds with different qualities',
        'First L is clear, second is dark',
        'Practice slowly with emphasis on Ls'
      ]
    },
    {
      id: 'l-sound-3',
      word: 'literally',
      phonetic: '/ˈlɪtərəli/',
      difficulty: 'hard',
      category: 'consonants',
      commonMistakes: ['riterally', 'literawry'],
      tips: [
        'Initial L followed by T sound',
        'End with clear L sound',
        'Practice: LIT-er-al-ly'
      ]
    },

    // Vowel Sounds
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
    },
    {
      id: 'vowel-ee',
      word: 'receive',
      phonetic: '/rɪˈsiv/',
      difficulty: 'medium',
      category: 'vowels',
      commonMistakes: ['recieve', 'receeve'],
      tips: [
        'Long E sound at the end',
        'Don\'t diphthongize',
        'Keep tongue high and front'
      ]
    },
    {
      id: 'vowel-oo',
      word: 'through',
      phonetic: '/θru/',
      difficulty: 'hard',
      category: 'vowels',
      commonMistakes: ['trew', 'fru'],
      tips: [
        'Combines TH and long U sound',
        'Round lips for U',
        'Practice TH first, then add U'
      ]
    },

    // Diphthongs
    {
      id: 'diphthong-ay',
      word: 'exercise',
      phonetic: '/ˈɛksərˌsaɪz/',
      difficulty: 'medium',
      category: 'vowels',
      commonMistakes: ['exersise', 'excersise'],
      tips: [
        'AI diphthong in last syllable',
        'Start with AH, glide to EE',
        'Practice: EX-er-SIZE'
      ]
    },
    {
      id: 'diphthong-ow',
      word: 'mountain',
      phonetic: '/ˈmaʊntən/',
      difficulty: 'medium',
      category: 'vowels',
      commonMistakes: ['mounten', 'muntin'],
      tips: [
        'AW diphthong in first syllable',
        'Start with AH, glide to OO',
        'Weak schwa in final syllable'
      ]
    },

    // Word Stress
    {
      id: 'stress-1',
      word: 'photograph',
      phonetic: '/ˈfoʊtəˌɡræf/',
      difficulty: 'medium',
      category: 'stress',
      commonMistakes: ['photoGRAPH', 'PHOtograph'],
      tips: [
        'Stress on first syllable: PHO-to-graph',
        'Secondary stress on last syllable',
        'Reduce middle vowel to schwa'
      ]
    },
    {
      id: 'stress-2',
      word: 'photographer',
      phonetic: '/fəˈtɑɡrəfər/',
      difficulty: 'hard',
      category: 'stress',
      commonMistakes: ['PHOtographer', 'photoGRAPHer'],
      tips: [
        'Stress shifts to second syllable: pho-TOG-ra-pher',
        'First syllable becomes schwa',
        'Compare with "photograph"'
      ]
    },
    {
      id: 'stress-3',
      word: 'comfortable',
      phonetic: '/ˈkʌmftərbəl/',
      difficulty: 'hard',
      category: 'stress',
      commonMistakes: ['comfortABLE', 'comFORTable'],
      tips: [
        'Stress on first syllable: COM-fort-a-ble',
        'Often pronounced as 3 syllables: COMF-ter-ble',
        'Reduce unstressed vowels'
      ]
    },

    // Connected Speech
    {
      id: 'connected-1',
      word: 'What are you doing?',
      phonetic: '/wʌdər ju ˈduɪŋ/',
      difficulty: 'hard',
      category: 'connected',
      commonMistakes: ['What are you doing', 'Wot ar yu doing'],
      tips: [
        'Link words together smoothly',
        '"What are" becomes "whadder"',
        'Practice natural rhythm and flow'
      ]
    },
    {
      id: 'connected-2',
      word: 'I\'m going to',
      phonetic: '/aɪm ˈɡoʊnə/',
      difficulty: 'medium',
      category: 'connected',
      commonMistakes: ['I am going to', 'Im gonna'],
      tips: [
        'Reduce "going to" to "gonna"',
        'Contract "I am" to "I\'m"',
        'Natural fast speech pattern'
      ]
    },

    // Minimal Pairs
    {
      id: 'minimal-1',
      word: 'ship',
      phonetic: '/ʃɪp/',
      difficulty: 'medium',
      category: 'minimal-pairs',
      commonMistakes: ['sheep', 'chip'],
      tips: [
        'Short I sound, not long EE',
        'Compare with "sheep" /ʃip/',
        'Practice: ship-sheep, ship-sheep'
      ]
    },
    {
      id: 'minimal-2',
      word: 'beach',
      phonetic: '/bitʃ/',
      difficulty: 'medium',
      category: 'minimal-pairs',
      commonMistakes: ['bitch', 'beech'],
      tips: [
        'Long EE sound followed by CH',
        'Be careful of vowel length',
        'Compare with similar words'
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