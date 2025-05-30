// Gamified vocabulary building system
export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  exampleSentence: string;
  translation?: string;
}

export interface GameSession {
  id: string;
  userId: number;
  gameType: 'flashcards' | 'matching' | 'spelling' | 'context' | 'pronunciation';
  wordsStudied: string[];
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface VocabularyProgress {
  userId: number;
  wordId: string;
  masteryLevel: number; // 0-100
  timesReviewed: number;
  lastReviewedAt: Date;
  streakCount: number;
  nextReviewAt: Date;
}

export interface GameQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'match-definition' | 'pronunciation';
  word: VocabularyWord;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

export class VocabularyGameEngine {
  private vocabularyBank: VocabularyWord[] = [
    {
      id: 'amazing',
      word: 'amazing',
      definition: 'causing great surprise or wonder; astonishing',
      pronunciation: '/əˈmeɪzɪŋ/',
      partOfSpeech: 'adjective',
      difficulty: 'easy',
      category: 'emotions',
      exampleSentence: 'The view from the mountain was amazing.',
      translation: '令人惊叹的'
    },
    {
      id: 'entrepreneur',
      word: 'entrepreneur',
      definition: 'a person who organizes and operates a business',
      pronunciation: '/ˌɑːntrəprəˈnɜːr/',
      partOfSpeech: 'noun',
      difficulty: 'hard',
      category: 'business',
      exampleSentence: 'She became a successful entrepreneur at age 25.',
      translation: '企业家'
    },
    {
      id: 'collaborate',
      word: 'collaborate',
      definition: 'work jointly on an activity or project',
      pronunciation: '/kəˈlæbəreɪt/',
      partOfSpeech: 'verb',
      difficulty: 'medium',
      category: 'work',
      exampleSentence: 'The teams collaborate to complete the project.',
      translation: '合作'
    },
    {
      id: 'magnificent',
      word: 'magnificent',
      definition: 'extremely beautiful, elaborate, or impressive',
      pronunciation: '/mæɡˈnɪfɪsnt/',
      partOfSpeech: 'adjective',
      difficulty: 'medium',
      category: 'descriptive',
      exampleSentence: 'The palace was a magnificent example of architecture.',
      translation: '壮丽的'
    },
    {
      id: 'perseverance',
      word: 'perseverance',
      definition: 'persistence in doing something despite difficulty',
      pronunciation: '/ˌpɜːrsəˈvɪrəns/',
      partOfSpeech: 'noun',
      difficulty: 'hard',
      category: 'character',
      exampleSentence: 'Her perseverance helped her overcome many challenges.',
      translation: '毅力'
    },
    {
      id: 'efficient',
      word: 'efficient',
      definition: 'achieving maximum productivity with minimum effort',
      pronunciation: '/ɪˈfɪʃnt/',
      partOfSpeech: 'adjective',
      difficulty: 'medium',
      category: 'work',
      exampleSentence: 'The new software made the process more efficient.',
      translation: '高效的'
    }
  ];

  private sessions: Map<string, GameSession> = new Map();
  private progress: Map<string, VocabularyProgress> = new Map();

  getVocabularyByCategory(category?: string, difficulty?: string): VocabularyWord[] {
    let words = this.vocabularyBank;
    
    if (category) {
      words = words.filter(w => w.category === category);
    }
    
    if (difficulty) {
      words = words.filter(w => w.difficulty === difficulty);
    }
    
    return words;
  }

  generateGameQuestions(
    gameType: string, 
    userId: number, 
    difficulty?: string, 
    count: number = 10
  ): GameQuestion[] {
    const availableWords = this.getVocabularyByCategory(undefined, difficulty);
    const selectedWords = this.selectWordsForUser(userId, availableWords, count);
    
    return selectedWords.map(word => this.createQuestion(gameType, word));
  }

  private selectWordsForUser(userId: number, words: VocabularyWord[], count: number): VocabularyWord[] {
    // Prioritize words that need review or haven't been studied
    const userProgress = Array.from(this.progress.values())
      .filter(p => p.userId === userId);
    
    const progressMap = new Map(userProgress.map(p => [p.wordId, p]));
    
    // Sort words by priority (least mastered first, then new words)
    const sortedWords = words.sort((a, b) => {
      const progressA = progressMap.get(a.id);
      const progressB = progressMap.get(b.id);
      
      if (!progressA && !progressB) return 0;
      if (!progressA) return -1;
      if (!progressB) return 1;
      
      return progressA.masteryLevel - progressB.masteryLevel;
    });
    
    return sortedWords.slice(0, count);
  }

  private createQuestion(gameType: string, word: VocabularyWord): GameQuestion {
    switch (gameType) {
      case 'multiple-choice':
        return this.createMultipleChoiceQuestion(word);
      case 'fill-blank':
        return this.createFillBlankQuestion(word);
      case 'match-definition':
        return this.createMatchDefinitionQuestion(word);
      default:
        return this.createMultipleChoiceQuestion(word);
    }
  }

  private createMultipleChoiceQuestion(word: VocabularyWord): GameQuestion {
    const wrongOptions = this.vocabularyBank
      .filter(w => w.id !== word.id && w.difficulty === word.difficulty)
      .slice(0, 3)
      .map(w => w.definition);
    
    const options = [word.definition, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    return {
      id: `mc-${word.id}`,
      type: 'multiple-choice',
      word,
      question: `What does "${word.word}" mean?`,
      options,
      correctAnswer: word.definition,
      hint: `Part of speech: ${word.partOfSpeech}`
    };
  }

  private createFillBlankQuestion(word: VocabularyWord): GameQuestion {
    const sentence = word.exampleSentence.replace(
      new RegExp(word.word, 'gi'), 
      '_____'
    );
    
    return {
      id: `fb-${word.id}`,
      type: 'fill-blank',
      word,
      question: `Fill in the blank: ${sentence}`,
      correctAnswer: word.word,
      hint: `${word.partOfSpeech}: ${word.definition}`
    };
  }

  private createMatchDefinitionQuestion(word: VocabularyWord): GameQuestion {
    return {
      id: `md-${word.id}`,
      type: 'match-definition',
      word,
      question: `Match the word with its definition: "${word.word}"`,
      correctAnswer: word.definition,
      hint: `Pronunciation: ${word.pronunciation}`
    };
  }

  startGameSession(userId: number, gameType: string, difficulty?: string): GameSession {
    const sessionId = `session-${Date.now()}-${userId}`;
    const session: GameSession = {
      id: sessionId,
      userId,
      gameType: gameType as any,
      wordsStudied: [],
      correctAnswers: 0,
      incorrectAnswers: 0,
      timeSpent: 0,
      xpEarned: 0,
      startedAt: new Date()
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  submitAnswer(
    sessionId: string, 
    questionId: string, 
    userAnswer: string, 
    timeSpent: number
  ): {
    correct: boolean;
    correctAnswer: string;
    explanation: string;
    xpEarned: number;
  } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Find the question and word
    const word = this.vocabularyBank.find(w => questionId.includes(w.id));
    if (!word) {
      throw new Error('Word not found');
    }

    const correct = this.checkAnswer(questionId, userAnswer, word);
    const xpEarned = this.calculateXP(correct, word.difficulty, timeSpent);
    
    // Update session
    session.timeSpent += timeSpent;
    session.xpEarned += xpEarned;
    
    if (correct) {
      session.correctAnswers++;
    } else {
      session.incorrectAnswers++;
    }
    
    if (!session.wordsStudied.includes(word.id)) {
      session.wordsStudied.push(word.id);
    }

    // Update user progress
    this.updateWordProgress(session.userId, word.id, correct);

    return {
      correct,
      correctAnswer: word.definition,
      explanation: `"${word.word}" means ${word.definition}. Example: ${word.exampleSentence}`,
      xpEarned
    };
  }

  private checkAnswer(questionId: string, userAnswer: string, word: VocabularyWord): boolean {
    if (questionId.startsWith('mc-') || questionId.startsWith('md-')) {
      return userAnswer.toLowerCase().trim() === word.definition.toLowerCase().trim();
    }
    
    if (questionId.startsWith('fb-')) {
      return userAnswer.toLowerCase().trim() === word.word.toLowerCase().trim();
    }
    
    return false;
  }

  private calculateXP(correct: boolean, difficulty: string, timeSpent: number): number {
    if (!correct) return 5; // Participation points
    
    const baseXP = {
      'easy': 10,
      'medium': 15,
      'hard': 25
    }[difficulty] || 10;
    
    // Bonus for quick answers (under 10 seconds)
    const speedBonus = timeSpent < 10000 ? 5 : 0;
    
    return baseXP + speedBonus;
  }

  private updateWordProgress(userId: number, wordId: string, correct: boolean): void {
    const key = `${userId}-${wordId}`;
    let progress = this.progress.get(key);
    
    if (!progress) {
      progress = {
        userId,
        wordId,
        masteryLevel: 0,
        timesReviewed: 0,
        lastReviewedAt: new Date(),
        streakCount: 0,
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
      };
    }
    
    progress.timesReviewed++;
    progress.lastReviewedAt = new Date();
    
    if (correct) {
      progress.masteryLevel = Math.min(100, progress.masteryLevel + 10);
      progress.streakCount++;
      
      // Spaced repetition: increase interval based on mastery
      const intervalDays = Math.min(30, Math.pow(2, Math.floor(progress.masteryLevel / 20)));
      progress.nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
    } else {
      progress.masteryLevel = Math.max(0, progress.masteryLevel - 5);
      progress.streakCount = 0;
      
      // Review sooner if incorrect
      progress.nextReviewAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
    }
    
    this.progress.set(key, progress);
  }

  completeGameSession(sessionId: string): GameSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.completedAt = new Date();
    return session;
  }

  getUserProgress(userId: number): VocabularyProgress[] {
    return Array.from(this.progress.values())
      .filter(p => p.userId === userId);
  }

  getGameStats(userId: number): {
    totalWordsStudied: number;
    averageMastery: number;
    totalXPEarned: number;
    gamesPlayed: number;
    currentStreak: number;
  } {
    const userProgress = this.getUserProgress(userId);
    const userSessions = Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.completedAt);
    
    const totalWordsStudied = userProgress.length;
    const averageMastery = userProgress.length > 0 
      ? userProgress.reduce((sum, p) => sum + p.masteryLevel, 0) / userProgress.length 
      : 0;
    const totalXPEarned = userSessions.reduce((sum, s) => sum + s.xpEarned, 0);
    const gamesPlayed = userSessions.length;
    const currentStreak = Math.max(...userProgress.map(p => p.streakCount), 0);
    
    return {
      totalWordsStudied,
      averageMastery: Math.round(averageMastery),
      totalXPEarned,
      gamesPlayed,
      currentStreak
    };
  }
}

export const vocabularyGameEngine = new VocabularyGameEngine();