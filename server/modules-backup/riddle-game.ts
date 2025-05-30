// Riddle and puzzle game system for English learning
export interface Riddle {
  id: string;
  question: string;
  answer: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'vocabulary' | 'wordplay' | 'logic' | 'grammar' | 'idioms';
  explanation: string;
  points: number;
  timeLimit?: number; // seconds
}

export interface WordPuzzle {
  id: string;
  type: 'anagram' | 'crossword' | 'word-search' | 'scramble' | 'rhyme';
  title: string;
  instructions: string;
  puzzle: any;
  solution: any;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

export interface GameSession {
  id: string;
  userId: number;
  gameType: 'riddle' | 'puzzle';
  startTime: Date;
  endTime?: Date;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
  timeBonus: number;
}

export class RiddleGameSystem {
  private riddles: Map<string, Riddle> = new Map();
  private puzzles: Map<string, WordPuzzle> = new Map();
  private sessions: Map<string, GameSession> = new Map();

  constructor() {
    this.initializeRiddles();
    this.initializePuzzles();
  }

  private initializeRiddles(): void {
    const riddles: Riddle[] = [
      // Easy Vocabulary Riddles
      {
        id: 'r1',
        question: 'I am something you wear on your head to protect from sun or rain. What am I?',
        answer: 'hat',
        hints: ['I can be made of fabric or straw', 'Baseball players wear me', 'I have a brim'],
        difficulty: 'easy',
        category: 'vocabulary',
        explanation: 'A hat is worn on the head for protection or fashion',
        points: 10
      },
      {
        id: 'r2',
        question: 'I have keys but no locks. I have space but no room. You can enter but not go inside. What am I?',
        answer: 'keyboard',
        hints: ['I help you type', 'I work with computers', 'I have letters and numbers'],
        difficulty: 'easy',
        category: 'vocabulary',
        explanation: 'A keyboard has keys for typing, space bar, and enter key',
        points: 15
      },
      {
        id: 'r3',
        question: 'I am tall when young and short when old. What am I?',
        answer: 'candle',
        hints: ['I give light', 'I melt', 'I have a wick'],
        difficulty: 'easy',
        category: 'vocabulary',
        explanation: 'A candle burns down and becomes shorter over time',
        points: 10
      },

      // Medium Wordplay Riddles
      {
        id: 'r4',
        question: 'What 8-letter word can have a letter taken away and it still makes a word? Take another letter away and it still makes a word. Keep on doing that until you have one letter left. What is the word?',
        answer: 'starting',
        hints: ['Think about words that end in -ing', 'Try removing letters from the end', 'Start with "starting"'],
        difficulty: 'medium',
        category: 'wordplay',
        explanation: 'Starting → Startin → Staring → String → Sting → Sing → Sin → In → I',
        points: 25
      },
      {
        id: 'r5',
        question: 'I am a word of letters three, add two and fewer there will be. What am I?',
        answer: 'few',
        hints: ['Think about the meaning of the word', 'Adding letters changes the meaning', 'The word describes quantity'],
        difficulty: 'medium',
        category: 'wordplay',
        explanation: 'Few (3 letters) + er = Fewer (meaning less in quantity)',
        points: 20
      },
      {
        id: 'r6',
        question: 'What word becomes shorter when you add two letters to it?',
        answer: 'short',
        hints: ['Think literally about the word meaning', 'Add "er" to make it comparative', 'The answer is in the question'],
        difficulty: 'medium',
        category: 'wordplay',
        explanation: 'Short + er = Shorter (but "shorter" means more short)',
        points: 20
      },

      // Hard Logic Riddles
      {
        id: 'r7',
        question: 'The more you take, the more you leave behind. What am I?',
        answer: 'footsteps',
        hints: ['Think about walking', 'They mark where you\'ve been', 'You create them by moving'],
        difficulty: 'hard',
        category: 'logic',
        explanation: 'Each step you take leaves a footprint behind you',
        points: 30
      },
      {
        id: 'r8',
        question: 'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
        answer: 'echo',
        hints: ['I repeat what you say', 'You hear me in mountains or empty rooms', 'Sound bounces to create me'],
        difficulty: 'hard',
        category: 'logic',
        explanation: 'An echo repeats sounds and is carried by air/wind',
        points: 35
      },

      // Grammar Riddles
      {
        id: 'r9',
        question: 'I am a part of speech that shows action or being. I can be past, present, or future. What am I?',
        answer: 'verb',
        hints: ['I describe what someone does', 'I can change tense', 'Run, jump, think are examples'],
        difficulty: 'medium',
        category: 'grammar',
        explanation: 'Verbs express actions or states of being and have different tenses',
        points: 20
      },
      {
        id: 'r10',
        question: 'I come before a noun to give more information. I can be definite or indefinite. What am I?',
        answer: 'article',
        hints: ['There are only three of me in English', 'A, an, and the', 'I help specify nouns'],
        difficulty: 'medium',
        category: 'grammar',
        explanation: 'Articles (a, an, the) modify nouns to show definiteness',
        points: 20
      },

      // Idiom Riddles
      {
        id: 'r11',
        question: 'When someone tells you to "break a leg," they don\'t want you to get hurt. What do they really mean?',
        answer: 'good luck',
        hints: ['It\'s said before performances', 'It\'s the opposite of what it sounds like', 'Theater people say this'],
        difficulty: 'hard',
        category: 'idioms',
        explanation: '"Break a leg" is a theatrical way to wish someone good luck',
        points: 25
      },
      {
        id: 'r12',
        question: 'If it\'s "raining cats and dogs," what\'s really happening?',
        answer: 'heavy rain',
        hints: ['No animals are falling', 'It\'s about weather', 'Very intense precipitation'],
        difficulty: 'medium',
        category: 'idioms',
        explanation: 'This idiom means it\'s raining very heavily',
        points: 20
      },

      // Advanced Wordplay
      {
        id: 'r13',
        question: 'What word is spelled incorrectly in every dictionary?',
        answer: 'incorrectly',
        hints: ['Think about the question literally', 'The answer is in the question', 'It\'s a play on words'],
        difficulty: 'hard',
        category: 'wordplay',
        explanation: 'The word "incorrectly" is always spelled "incorrectly" - that\'s its correct spelling',
        points: 30
      },
      {
        id: 'r14',
        question: 'I am the beginning of everything, the end of everywhere. I\'m the beginning of eternity, the end of time and space. What am I?',
        answer: 'e',
        hints: ['Think about letters', 'Look at the first and last letters', 'It\'s a single character'],
        difficulty: 'hard',
        category: 'wordplay',
        explanation: 'The letter "e" begins "everything" and "eternity" and ends "everywhere," "time," and "space"',
        points: 35
      },

      // Cultural/Vocabulary
      {
        id: 'r15',
        question: 'I am a meal that\'s eaten in the middle of the day. In Britain, I might be called dinner, but in America, I\'m usually lighter. What am I?',
        answer: 'lunch',
        hints: ['Between breakfast and dinner', 'Often eaten at work or school', 'Around noon time'],
        difficulty: 'easy',
        category: 'vocabulary',
        explanation: 'Lunch is the midday meal, though customs vary by country',
        points: 10
      }
    ];

    riddles.forEach(riddle => {
      this.riddles.set(riddle.id, riddle);
    });
  }

  private initializePuzzles(): void {
    const puzzles: WordPuzzle[] = [
      // Anagram Puzzles
      {
        id: 'p1',
        type: 'anagram',
        title: 'Animal Anagrams',
        instructions: 'Unscramble these letters to find animal names',
        puzzle: {
          words: [
            { scrambled: 'GOD', answer: 'DOG', hints: ['Man\'s best friend'] },
            { scrambled: 'TAC', answer: 'CAT', hints: ['Meows and has whiskers'] },
            { scrambled: 'NOIL', answer: 'LION', hints: ['King of the jungle'] },
            { scrambled: 'RETTIG', answer: 'TIGER', hints: ['Has black and orange stripes'] },
            { scrambled: 'TNAHELPE', answer: 'ELEPHANT', hints: ['Largest land animal'] }
          ]
        },
        solution: ['DOG', 'CAT', 'LION', 'TIGER', 'ELEPHANT'],
        difficulty: 'easy',
        category: 'animals',
        points: 50
      },
      {
        id: 'p2',
        type: 'anagram',
        title: 'Food Anagrams',
        instructions: 'Rearrange letters to discover food items',
        puzzle: {
          words: [
            { scrambled: 'ZZAPI', answer: 'PIZZA', hints: ['Italian dish with cheese'] },
            { scrambled: 'DEARB', answer: 'BREAD', hints: ['Made from flour and baked'] },
            { scrambled: 'TELOCH', answer: 'CHEESE', hints: ['Made from milk'] },
            { scrambled: 'TUFIR', answer: 'FRUIT', hints: ['Healthy sweet snacks'] }
          ]
        },
        solution: ['PIZZA', 'BREAD', 'CHEESE', 'FRUIT'],
        difficulty: 'easy',
        category: 'food',
        points: 40
      },

      // Word Scramble
      {
        id: 'p3',
        type: 'scramble',
        title: 'Profession Scramble',
        instructions: 'Unscramble to find different job titles',
        puzzle: {
          words: [
            { scrambled: 'ROTCOD', answer: 'DOCTOR', hints: ['Works in a hospital'] },
            { scrambled: 'REHCAET', answer: 'TEACHER', hints: ['Works in a school'] },
            { scrambled: 'REWLAY', answer: 'LAWYER', hints: ['Works with legal cases'] },
            { scrambled: 'GINNEERE', answer: 'ENGINEER', hints: ['Designs and builds things'] },
            { scrambled: 'TRESINTU', answer: 'SCIENTIST', hints: ['Studies natural phenomena'] }
          ]
        },
        solution: ['DOCTOR', 'TEACHER', 'LAWYER', 'ENGINEER', 'SCIENTIST'],
        difficulty: 'medium',
        category: 'professions',
        points: 60
      },

      // Rhyme Puzzles
      {
        id: 'p4',
        type: 'rhyme',
        title: 'Find the Rhyme',
        instructions: 'Complete each pair with a rhyming word',
        puzzle: {
          pairs: [
            { word: 'CAT', rhyme: '___', answer: 'HAT', hints: ['Worn on head'] },
            { word: 'TREE', rhyme: '___', answer: 'SEE', hints: ['Use your eyes'] },
            { word: 'NIGHT', rhyme: '___', answer: 'LIGHT', hints: ['Opposite of dark'] },
            { word: 'PLAY', rhyme: '___', answer: 'DAY', hints: ['24 hours'] },
            { word: 'BOOK', rhyme: '___', answer: 'LOOK', hints: ['Use your eyes to observe'] }
          ]
        },
        solution: ['HAT', 'SEE', 'LIGHT', 'DAY', 'LOOK'],
        difficulty: 'easy',
        category: 'phonics',
        points: 45
      },

      // Word Search Style
      {
        id: 'p5',
        type: 'word-search',
        title: 'Color Hunt',
        instructions: 'Find all the color words hidden in the grid',
        puzzle: {
          grid: [
            ['R', 'E', 'D', 'B', 'L', 'U', 'E'],
            ['G', 'R', 'A', 'Y', 'E', 'L', 'O'],
            ['R', 'E', 'P', 'U', 'R', 'P', 'L'],
            ['E', 'E', 'N', 'K', 'C', 'A', 'E'],
            ['E', 'N', 'I', 'N', 'A', 'L', 'B'],
            ['N', 'G', 'P', 'O', 'R', 'B', 'R'],
            ['W', 'H', 'I', 'T', 'E', 'O', 'O'],
            ['B', 'L', 'A', 'C', 'K', 'W', 'W']
          ],
          words: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'WHITE', 'BLACK', 'PINK', 'GRAY', 'BROWN']
        },
        solution: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'WHITE', 'BLACK', 'PINK', 'GRAY', 'BROWN'],
        difficulty: 'medium',
        category: 'colors',
        points: 70
      },

      // Advanced Anagrams
      {
        id: 'p6',
        type: 'anagram',
        title: 'Academic Subjects',
        instructions: 'Unscramble to find school subjects',
        puzzle: {
          words: [
            { scrambled: 'HTAM', answer: 'MATH', hints: ['Numbers and calculations'] },
            { scrambled: 'YRTSIHOY', answer: 'HISTORY', hints: ['Study of the past'] },
            { scrambled: 'YHPARGOGE', answer: 'GEOGRAPHY', hints: ['Study of Earth and places'] },
            { scrambled: 'ECNEICS', answer: 'SCIENCE', hints: ['Study of natural world'] },
            { scrambled: 'TRA', answer: 'ART', hints: ['Creative expression'] }
          ]
        },
        solution: ['MATH', 'HISTORY', 'GEOGRAPHY', 'SCIENCE', 'ART'],
        difficulty: 'medium',
        category: 'education',
        points: 55
      }
    ];

    puzzles.forEach(puzzle => {
      this.puzzles.set(puzzle.id, puzzle);
    });
  }

  // Public methods
  getRiddles(difficulty?: string, category?: string): Riddle[] {
    let riddles = Array.from(this.riddles.values());

    if (difficulty) {
      riddles = riddles.filter(r => r.difficulty === difficulty);
    }

    if (category) {
      riddles = riddles.filter(r => r.category === category);
    }

    return riddles.sort(() => Math.random() - 0.5); // Shuffle
  }

  getPuzzles(difficulty?: string, type?: string): WordPuzzle[] {
    let puzzles = Array.from(this.puzzles.values());

    if (difficulty) {
      puzzles = puzzles.filter(p => p.difficulty === difficulty);
    }

    if (type) {
      puzzles = puzzles.filter(p => p.type === type);
    }

    return puzzles.sort(() => Math.random() - 0.5); // Shuffle
  }

  startGameSession(userId: number, gameType: 'riddle' | 'puzzle'): GameSession {
    const sessionId = `game-${Date.now()}-${userId}`;
    const session: GameSession = {
      id: sessionId,
      userId,
      gameType,
      startTime: new Date(),
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      hintsUsed: 0,
      timeBonus: 0
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  checkRiddleAnswer(riddleId: string, userAnswer: string, sessionId: string): {
    correct: boolean;
    explanation: string;
    points: number;
    timeBonus: number;
  } {
    const riddle = this.riddles.get(riddleId);
    const session = this.sessions.get(sessionId);

    if (!riddle || !session) {
      return { correct: false, explanation: 'Invalid riddle or session', points: 0, timeBonus: 0 };
    }

    const correct = riddle.answer.toLowerCase() === userAnswer.toLowerCase().trim();
    
    // Calculate time bonus (if answered quickly)
    const timeElapsed = (Date.now() - session.startTime.getTime()) / 1000;
    const timeBonus = correct && timeElapsed < 30 ? Math.max(0, 10 - Math.floor(timeElapsed / 3)) : 0;

    // Update session
    session.totalQuestions += 1;
    if (correct) {
      session.correctAnswers += 1;
      session.score += riddle.points + timeBonus;
      session.timeBonus += timeBonus;
    }

    return {
      correct,
      explanation: riddle.explanation,
      points: correct ? riddle.points : 0,
      timeBonus
    };
  }

  getHint(riddleId: string, sessionId: string): string | null {
    const riddle = this.riddles.get(riddleId);
    const session = this.sessions.get(sessionId);

    if (!riddle || !session) return null;

    session.hintsUsed += 1;
    
    // Return hints progressively
    const hintIndex = Math.min(session.hintsUsed - 1, riddle.hints.length - 1);
    return riddle.hints[hintIndex] || 'No more hints available';
  }

  endGameSession(sessionId: string): GameSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    return session;
  }

  getLeaderboard(gameType: 'riddle' | 'puzzle', limit: number = 10): any[] {
    const sessions = Array.from(this.sessions.values())
      .filter(s => s.gameType === gameType && s.endTime)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return sessions.map((session, index) => ({
      rank: index + 1,
      userId: session.userId,
      score: session.score,
      accuracy: session.totalQuestions > 0 ? (session.correctAnswers / session.totalQuestions) * 100 : 0,
      timeBonus: session.timeBonus,
      hintsUsed: session.hintsUsed
    }));
  }

  getUserStats(userId: number): {
    totalGames: number;
    averageScore: number;
    bestScore: number;
    favoriteCategory: string;
    accuracy: number;
  } {
    const userSessions = Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.endTime);

    if (userSessions.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        bestScore: 0,
        favoriteCategory: 'none',
        accuracy: 0
      };
    }

    const totalScore = userSessions.reduce((sum, s) => sum + s.score, 0);
    const totalCorrect = userSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalQuestions = userSessions.reduce((sum, s) => sum + s.totalQuestions, 0);

    return {
      totalGames: userSessions.length,
      averageScore: Math.round(totalScore / userSessions.length),
      bestScore: Math.max(...userSessions.map(s => s.score)),
      favoriteCategory: 'mixed', // Could be calculated from riddle categories
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    };
  }
}

export const riddleGameSystem = new RiddleGameSystem();