// Mini-game breaks between learning modules
export interface MiniGame {
  id: string;
  name: string;
  type: 'word_puzzle' | 'memory_match' | 'quick_quiz' | 'word_search' | 'typing_race' | 'pronunciation_challenge';
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'spelling' | 'listening' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // seconds
  description: string;
  instructions: string[];
  rewards: GameReward[];
  unlockCondition: string;
  isTimedChallenge: boolean;
  allowReplay: boolean;
  gameData: GameData;
  visualTheme: GameTheme;
}

export interface GameData {
  content: any; // Game-specific content
  objectives: GameObjective[];
  scoring: ScoringSystem;
  powerUps: PowerUp[];
  achievements: GameAchievement[];
}

export interface GameObjective {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  reward: string;
}

export interface ScoringSystem {
  basePoints: number;
  timeBonus: boolean;
  accuracyMultiplier: number;
  streakBonus: number;
  perfectBonus: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: string;
  duration: number;
  rarity: 'common' | 'rare' | 'epic';
  unlockCondition: string;
}

export interface GameAchievement {
  id: string;
  title: string;
  description: string;
  condition: string;
  badge: string;
  points: number;
}

export interface GameReward {
  type: 'points' | 'badge' | 'unlock' | 'boost' | 'streak_protect';
  value: number | string;
  description: string;
}

export interface GameTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  animations: ThemeAnimation[];
  sounds: GameSound[];
}

export interface ThemeAnimation {
  name: string;
  type: 'entrance' | 'success' | 'failure' | 'transition';
  duration: number;
  easing: string;
}

export interface GameSound {
  event: string;
  soundFile: string;
  volume: number;
}

export interface GameSession {
  id: string;
  userId: number;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  accuracy: number;
  timeElapsed: number;
  objectivesCompleted: string[];
  powerUpsUsed: string[];
  mistakes: GameMistake[];
  performance: GamePerformance;
  rewards: GameReward[];
  nextGameSuggestion?: string;
}

export interface GameMistake {
  timestamp: Date;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  category: string;
}

export interface GamePerformance {
  speed: number; // WPM or actions per minute
  consistency: number; // Score variance
  improvement: number; // Compared to previous sessions
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: string[];
}

export interface UserGameProfile {
  userId: number;
  gamesPlayed: number;
  totalScore: number;
  averageAccuracy: number;
  favoriteGameType: string;
  currentStreak: number;
  longestStreak: number;
  unlockedGames: string[];
  gamePreferences: GamePreferences;
  statistics: GameStatistics;
  achievements: UserGameAchievement[];
}

export interface GamePreferences {
  preferredDifficulty: string;
  preferredDuration: number;
  autoSuggestions: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
  showHints: boolean;
  competitiveMode: boolean;
}

export interface GameStatistics {
  gamesPerCategory: { [category: string]: number };
  averageScorePerGame: { [gameId: string]: number };
  bestStreaks: { [gameId: string]: number };
  timeSpentGaming: number;
  improvementTrend: number;
  skillProgression: { [skill: string]: number };
}

export interface UserGameAchievement {
  achievementId: string;
  unlockedAt: Date;
  gameId: string;
  context: string;
}

export interface WordPuzzleGame extends GameData {
  words: PuzzleWord[];
  gridSize: { width: number; height: number };
  timeLimit: number;
  hintsAvailable: number;
}

export interface PuzzleWord {
  word: string;
  definition: string;
  difficulty: number;
  category: string;
  position?: WordPosition;
  found: boolean;
}

export interface WordPosition {
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

export interface MemoryMatchGame extends GameData {
  cards: MemoryCard[];
  pairs: number;
  maxFlips: number;
  timeBonus: number;
}

export interface MemoryCard {
  id: string;
  frontText: string;
  backText: string;
  category: string;
  difficulty: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface QuickQuizGame extends GameData {
  questions: QuizQuestion[];
  timePerQuestion: number;
  allowSkip: boolean;
  randomizeOrder: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  category: string;
  timeLimit: number;
}

export interface TypingRaceGame extends GameData {
  text: string;
  targetWPM: number;
  accuracy: number;
  allowMistakes: number;
}

export interface GameBreakScheduler {
  userId: number;
  lastBreakTime: Date;
  breakInterval: number; // minutes
  sessionLength: number; // minutes
  gameRotation: string[];
  adaptiveScheduling: boolean;
  breakPreferences: BreakPreferences;
}

export interface BreakPreferences {
  duration: number;
  gameTypes: string[];
  difficulty: string;
  skipOption: boolean;
  reminderStyle: 'gentle' | 'assertive' | 'gamified';
}

export class MiniGameSystem {
  private games: Map<string, MiniGame> = new Map();
  private gameSessions: Map<string, GameSession> = new Map();
  private userProfiles: Map<number, UserGameProfile> = new Map();
  private breakSchedulers: Map<number, GameBreakScheduler> = new Map();

  constructor() {
    this.initializeGames();
    this.initializeSampleProfiles();
  }

  private initializeGames(): void {
    const games: MiniGame[] = [
      {
        id: 'word_search_beginner',
        name: 'Word Detective',
        type: 'word_search',
        category: 'vocabulary',
        difficulty: 'easy',
        duration: 180,
        description: 'Find hidden English words in a letter grid',
        instructions: [
          'Look for words hidden in the grid',
          'Words can be horizontal, vertical, or diagonal',
          'Tap and drag to select words',
          'Find all words before time runs out!'
        ],
        rewards: [
          { type: 'points', value: 50, description: 'Base completion reward' },
          { type: 'boost', value: 'vocabulary_boost', description: '10% vocabulary learning boost' }
        ],
        unlockCondition: 'Complete first lesson',
        isTimedChallenge: true,
        allowReplay: true,
        gameData: {
          content: {
            words: [
              { word: 'HELLO', definition: 'A greeting', difficulty: 1, category: 'greetings', found: false },
              { word: 'BOOK', definition: 'Reading material', difficulty: 1, category: 'objects', found: false },
              { word: 'WATER', definition: 'Clear liquid', difficulty: 1, category: 'nature', found: false },
              { word: 'HAPPY', definition: 'Feeling joy', difficulty: 2, category: 'emotions', found: false },
              { word: 'FRIEND', definition: 'Close companion', difficulty: 2, category: 'relationships', found: false }
            ],
            gridSize: { width: 10, height: 10 },
            timeLimit: 180,
            hintsAvailable: 3
          },
          objectives: [
            {
              id: 'find_all_words',
              description: 'Find all hidden words',
              targetValue: 5,
              currentValue: 0,
              completed: false,
              reward: 'completion_badge'
            },
            {
              id: 'time_bonus',
              description: 'Complete in under 2 minutes',
              targetValue: 120,
              currentValue: 0,
              completed: false,
              reward: 'speed_demon_badge'
            }
          ],
          scoring: {
            basePoints: 10,
            timeBonus: true,
            accuracyMultiplier: 1.5,
            streakBonus: 5,
            perfectBonus: 25
          },
          powerUps: [
            {
              id: 'hint_revealer',
              name: 'Word Hint',
              description: 'Reveals the first letter of an unfound word',
              effect: 'reveal_hint',
              duration: 0,
              rarity: 'common',
              unlockCondition: 'always'
            }
          ],
          achievements: [
            {
              id: 'word_master',
              title: 'Word Master',
              description: 'Find all words without using hints',
              condition: 'perfect_no_hints',
              badge: 'word_master_badge',
              points: 100
            }
          ]
        },
        visualTheme: {
          backgroundColor: '#E8F5E8',
          primaryColor: '#4CAF50',
          accentColor: '#FFC107',
          fontFamily: 'Comic Sans MS, cursive',
          animations: [
            {
              name: 'word_found',
              type: 'success',
              duration: 500,
              easing: 'ease-out'
            }
          ],
          sounds: [
            {
              event: 'word_found',
              soundFile: 'success_chime.mp3',
              volume: 0.7
            }
          ]
        }
      },
      {
        id: 'memory_match_animals',
        name: 'Animal Memory Match',
        type: 'memory_match',
        category: 'vocabulary',
        difficulty: 'easy',
        duration: 240,
        description: 'Match animal names with their pictures',
        instructions: [
          'Flip cards to reveal animals and names',
          'Match each animal with its English name',
          'Remember card positions to make matches',
          'Complete all pairs to win!'
        ],
        rewards: [
          { type: 'points', value: 75, description: 'Memory challenge reward' },
          { type: 'unlock', value: 'memory_expert_badge', description: 'Unlock memory expert status' }
        ],
        unlockCondition: 'Complete 3 vocabulary lessons',
        isTimedChallenge: true,
        allowReplay: true,
        gameData: {
          content: {
            cards: [
              { id: '1a', frontText: '🐶', backText: 'DOG', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false },
              { id: '1b', frontText: 'DOG', backText: '🐶', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false },
              { id: '2a', frontText: '🐱', backText: 'CAT', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false },
              { id: '2b', frontText: 'CAT', backText: '🐱', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false },
              { id: '3a', frontText: '🐦', backText: 'BIRD', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false },
              { id: '3b', frontText: 'BIRD', backText: '🐦', category: 'animals', difficulty: 1, isFlipped: false, isMatched: false }
            ],
            pairs: 3,
            maxFlips: 20,
            timeBonus: 30
          },
          objectives: [
            {
              id: 'match_all_pairs',
              description: 'Match all animal pairs',
              targetValue: 3,
              currentValue: 0,
              completed: false,
              reward: 'animal_expert'
            }
          ],
          scoring: {
            basePoints: 15,
            timeBonus: true,
            accuracyMultiplier: 2.0,
            streakBonus: 10,
            perfectBonus: 50
          },
          powerUps: [],
          achievements: []
        },
        visualTheme: {
          backgroundColor: '#FFF3E0',
          primaryColor: '#FF9800',
          accentColor: '#4CAF50',
          fontFamily: 'Arial, sans-serif',
          animations: [
            {
              name: 'card_flip',
              type: 'transition',
              duration: 300,
              easing: 'ease-in-out'
            }
          ],
          sounds: [
            {
              event: 'card_flip',
              soundFile: 'card_flip.mp3',
              volume: 0.5
            }
          ]
        }
      },
      {
        id: 'quick_quiz_grammar',
        name: 'Grammar Lightning',
        type: 'quick_quiz',
        category: 'grammar',
        difficulty: 'medium',
        duration: 120,
        description: 'Quick-fire grammar questions',
        instructions: [
          'Answer grammar questions as quickly as possible',
          'You have limited time per question',
          'Wrong answers reduce your score',
          'Aim for speed and accuracy!'
        ],
        rewards: [
          { type: 'points', value: 100, description: 'Grammar mastery points' },
          { type: 'boost', value: 'grammar_boost', description: '15% grammar learning boost' }
        ],
        unlockCondition: 'Complete 5 grammar exercises',
        isTimedChallenge: true,
        allowReplay: true,
        gameData: {
          content: {
            questions: [
              {
                id: 'q1',
                question: 'Choose the correct form: "I ___ to school every day."',
                options: ['go', 'goes', 'going', 'gone'],
                correctAnswer: 0,
                explanation: 'Use "go" with "I" in present tense',
                difficulty: 1,
                category: 'verb_forms',
                timeLimit: 10
              },
              {
                id: 'q2',
                question: 'Which is correct? "She ___ a doctor."',
                options: ['am', 'is', 'are', 'be'],
                correctAnswer: 1,
                explanation: 'Use "is" with third person singular',
                difficulty: 1,
                category: 'verb_to_be',
                timeLimit: 8
              }
            ],
            timePerQuestion: 10,
            allowSkip: false,
            randomizeOrder: true
          },
          objectives: [
            {
              id: 'answer_all',
              description: 'Answer all questions',
              targetValue: 2,
              currentValue: 0,
              completed: false,
              reward: 'quiz_complete'
            }
          ],
          scoring: {
            basePoints: 25,
            timeBonus: true,
            accuracyMultiplier: 3.0,
            streakBonus: 15,
            perfectBonus: 75
          },
          powerUps: [
            {
              id: 'time_extend',
              name: 'Extra Time',
              description: 'Adds 5 seconds to current question',
              effect: 'extend_time',
              duration: 5,
              rarity: 'rare',
              unlockCondition: 'streak_5'
            }
          ],
          achievements: []
        },
        visualTheme: {
          backgroundColor: '#E3F2FD',
          primaryColor: '#2196F3',
          accentColor: '#FF5722',
          fontFamily: 'Roboto, sans-serif',
          animations: [
            {
              name: 'correct_answer',
              type: 'success',
              duration: 600,
              easing: 'bounce'
            }
          ],
          sounds: [
            {
              event: 'correct_answer',
              soundFile: 'correct_ding.mp3',
              volume: 0.8
            }
          ]
        }
      },
      {
        id: 'typing_race_basic',
        name: 'Type Master',
        type: 'typing_race',
        category: 'spelling',
        difficulty: 'medium',
        duration: 300,
        description: 'Type English sentences as fast and accurately as possible',
        instructions: [
          'Type the displayed text as quickly as possible',
          'Focus on accuracy - mistakes slow you down',
          'Try to maintain a steady rhythm',
          'Beat your personal best WPM!'
        ],
        rewards: [
          { type: 'points', value: 125, description: 'Typing proficiency reward' },
          { type: 'badge', value: 'speed_typist', description: 'Speed typing badge' }
        ],
        unlockCondition: 'Complete 10 lessons',
        isTimedChallenge: true,
        allowReplay: true,
        gameData: {
          content: {
            text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for typing practice.',
            targetWPM: 30,
            accuracy: 95,
            allowMistakes: 5
          },
          objectives: [
            {
              id: 'complete_text',
              description: 'Type the complete text',
              targetValue: 100,
              currentValue: 0,
              completed: false,
              reward: 'typing_complete'
            },
            {
              id: 'speed_goal',
              description: 'Achieve 30 WPM',
              targetValue: 30,
              currentValue: 0,
              completed: false,
              reward: 'speed_demon'
            }
          ],
          scoring: {
            basePoints: 2,
            timeBonus: false,
            accuracyMultiplier: 2.5,
            streakBonus: 1,
            perfectBonus: 100
          },
          powerUps: [],
          achievements: [
            {
              id: 'perfect_typist',
              title: 'Perfect Typist',
              description: 'Complete without any mistakes',
              condition: 'zero_mistakes',
              badge: 'perfect_typist_badge',
              points: 200
            }
          ]
        },
        visualTheme: {
          backgroundColor: '#F3E5F5',
          primaryColor: '#9C27B0',
          accentColor: '#4CAF50',
          fontFamily: 'Courier New, monospace',
          animations: [
            {
              name: 'typing_feedback',
              type: 'transition',
              duration: 200,
              easing: 'linear'
            }
          ],
          sounds: [
            {
              event: 'keystroke',
              soundFile: 'typewriter_click.mp3',
              volume: 0.3
            }
          ]
        }
      }
    ];

    games.forEach(game => {
      this.games.set(game.id, game);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserGameProfile = {
      userId: 1,
      gamesPlayed: 12,
      totalScore: 1420,
      averageAccuracy: 87.5,
      favoriteGameType: 'word_search',
      currentStreak: 3,
      longestStreak: 7,
      unlockedGames: ['word_search_beginner', 'memory_match_animals'],
      gamePreferences: {
        preferredDifficulty: 'medium',
        preferredDuration: 180,
        autoSuggestions: true,
        soundEnabled: true,
        hapticFeedback: true,
        showHints: true,
        competitiveMode: false
      },
      statistics: {
        gamesPerCategory: {
          'vocabulary': 8,
          'grammar': 3,
          'spelling': 1
        },
        averageScorePerGame: {
          'word_search_beginner': 145,
          'memory_match_animals': 98
        },
        bestStreaks: {
          'word_search_beginner': 5,
          'memory_match_animals': 3
        },
        timeSpentGaming: 2340, // seconds
        improvementTrend: 12.5,
        skillProgression: {
          'vocabulary': 75,
          'memory': 68,
          'speed': 45
        }
      },
      achievements: [
        {
          achievementId: 'first_game',
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          gameId: 'word_search_beginner',
          context: 'first_completion'
        }
      ]
    };

    this.userProfiles.set(1, sampleProfile);

    const breakScheduler: GameBreakScheduler = {
      userId: 1,
      lastBreakTime: new Date(Date.now() - 25 * 60 * 1000),
      breakInterval: 25,
      sessionLength: 3,
      gameRotation: ['word_search_beginner', 'memory_match_animals', 'quick_quiz_grammar'],
      adaptiveScheduling: true,
      breakPreferences: {
        duration: 180,
        gameTypes: ['vocabulary', 'grammar'],
        difficulty: 'medium',
        skipOption: true,
        reminderStyle: 'gamified'
      }
    };

    this.breakSchedulers.set(1, breakScheduler);
  }

  // Game session management
  startGameSession(userId: number, gameId: string): GameSession {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const sessionId = `session-${Date.now()}-${userId}`;
    const session: GameSession = {
      id: sessionId,
      userId,
      gameId,
      startTime: new Date(),
      score: 0,
      accuracy: 0,
      timeElapsed: 0,
      objectivesCompleted: [],
      powerUpsUsed: [],
      mistakes: [],
      performance: {
        speed: 0,
        consistency: 0,
        improvement: 0,
        strengths: [],
        weaknesses: [],
        recommendedFocus: []
      },
      rewards: []
    };

    this.gameSessions.set(sessionId, session);
    return session;
  }

  completeGameSession(
    sessionId: string,
    finalScore: number,
    accuracy: number,
    mistakes: GameMistake[] = []
  ): GameSession {
    const session = this.gameSessions.get(sessionId);
    if (!session) {
      throw new Error('Game session not found');
    }

    session.endTime = new Date();
    session.score = finalScore;
    session.accuracy = accuracy;
    session.timeElapsed = session.endTime.getTime() - session.startTime.getTime();
    session.mistakes = mistakes;

    // Calculate performance metrics
    this.calculatePerformance(session);

    // Award rewards
    session.rewards = this.calculateRewards(session);

    // Update user profile
    this.updateUserProfile(session.userId, session);

    return session;
  }

  private calculatePerformance(session: GameSession): void {
    const game = this.games.get(session.gameId);
    if (!game) return;

    const timeInMinutes = session.timeElapsed / (1000 * 60);
    const baseSpeed = session.score / timeInMinutes;
    
    session.performance.speed = Math.round(baseSpeed);
    session.performance.consistency = this.calculateConsistency(session);
    session.performance.improvement = this.calculateImprovement(session);
    
    // Identify strengths and weaknesses
    if (session.accuracy > 90) {
      session.performance.strengths.push('High Accuracy');
    }
    if (session.timeElapsed < game.duration * 1000 * 0.8) {
      session.performance.strengths.push('Fast Completion');
    }
    if (session.mistakes.length === 0) {
      session.performance.strengths.push('Error-Free Performance');
    }

    if (session.accuracy < 70) {
      session.performance.weaknesses.push('Accuracy Needs Improvement');
      session.performance.recommendedFocus.push('Practice similar exercises');
    }
    if (session.score < game.gameData.scoring.basePoints * 5) {
      session.performance.weaknesses.push('Score Below Average');
      session.performance.recommendedFocus.push('Focus on game objectives');
    }
  }

  private calculateConsistency(session: GameSession): number {
    // Simple consistency calculation based on mistake distribution
    if (session.mistakes.length === 0) return 100;
    
    const mistakeTimings = session.mistakes.map(m => 
      m.timestamp.getTime() - session.startTime.getTime()
    );
    
    const avgInterval = mistakeTimings.reduce((sum, time, index) => {
      if (index === 0) return 0;
      return sum + (time - mistakeTimings[index - 1]);
    }, 0) / (mistakeTimings.length - 1);
    
    const variance = mistakeTimings.reduce((sum, time, index) => {
      if (index === 0) return 0;
      const interval = time - mistakeTimings[index - 1];
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / (mistakeTimings.length - 1);
    
    return Math.max(0, 100 - (Math.sqrt(variance) / 1000));
  }

  private calculateImprovement(session: GameSession): number {
    const profile = this.userProfiles.get(session.userId);
    if (!profile) return 0;

    const gameAverage = profile.statistics.averageScorePerGame[session.gameId];
    if (!gameAverage) return 0;

    return ((session.score - gameAverage) / gameAverage) * 100;
  }

  private calculateRewards(session: GameSession): GameReward[] {
    const game = this.games.get(session.gameId);
    if (!game) return [];

    const rewards: GameReward[] = [...game.rewards];

    // Performance-based bonus rewards
    if (session.accuracy >= 95) {
      rewards.push({
        type: 'points',
        value: 50,
        description: 'Perfect accuracy bonus'
      });
    }

    if (session.mistakes.length === 0) {
      rewards.push({
        type: 'badge',
        value: 'flawless_performance',
        description: 'Flawless performance badge'
      });
    }

    return rewards;
  }

  private updateUserProfile(userId: number, session: GameSession): void {
    const profile = this.userProfiles.get(userId) || this.createDefaultProfile(userId);
    
    profile.gamesPlayed += 1;
    profile.totalScore += session.score;
    profile.averageAccuracy = ((profile.averageAccuracy * (profile.gamesPlayed - 1)) + session.accuracy) / profile.gamesPlayed;
    
    // Update game-specific statistics
    const gameCategory = this.games.get(session.gameId)?.category || 'general';
    profile.statistics.gamesPerCategory[gameCategory] = (profile.statistics.gamesPerCategory[gameCategory] || 0) + 1;
    profile.statistics.averageScorePerGame[session.gameId] = 
      ((profile.statistics.averageScorePerGame[session.gameId] || 0) + session.score) / 2;

    // Update streaks
    if (session.accuracy >= 80) {
      profile.currentStreak += 1;
      profile.longestStreak = Math.max(profile.longestStreak, profile.currentStreak);
    } else {
      profile.currentStreak = 0;
    }

    this.userProfiles.set(userId, profile);
  }

  private createDefaultProfile(userId: number): UserGameProfile {
    return {
      userId,
      gamesPlayed: 0,
      totalScore: 0,
      averageAccuracy: 0,
      favoriteGameType: 'word_search',
      currentStreak: 0,
      longestStreak: 0,
      unlockedGames: ['word_search_beginner'],
      gamePreferences: {
        preferredDifficulty: 'easy',
        preferredDuration: 180,
        autoSuggestions: true,
        soundEnabled: true,
        hapticFeedback: true,
        showHints: true,
        competitiveMode: false
      },
      statistics: {
        gamesPerCategory: {},
        averageScorePerGame: {},
        bestStreaks: {},
        timeSpentGaming: 0,
        improvementTrend: 0,
        skillProgression: {}
      },
      achievements: []
    };
  }

  // Break scheduling methods
  checkBreakNeeded(userId: number): boolean {
    const scheduler = this.breakSchedulers.get(userId);
    if (!scheduler) return false;

    const timeSinceLastBreak = Date.now() - scheduler.lastBreakTime.getTime();
    const breakIntervalMs = scheduler.breakInterval * 60 * 1000;

    return timeSinceLastBreak >= breakIntervalMs;
  }

  suggestBreakGame(userId: number): MiniGame | null {
    const scheduler = this.breakSchedulers.get(userId);
    if (!scheduler) return null;

    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    // Get games matching user preferences
    const suitableGames = Array.from(this.games.values()).filter(game => {
      return scheduler.breakPreferences.gameTypes.includes(game.category) &&
             game.difficulty === scheduler.breakPreferences.difficulty &&
             game.duration <= scheduler.breakPreferences.duration &&
             profile.unlockedGames.includes(game.id);
    });

    if (suitableGames.length === 0) {
      return Array.from(this.games.values())[0]; // Fallback to first game
    }

    // Rotate through games
    const lastPlayedIndex = scheduler.gameRotation.findIndex(gameId => 
      suitableGames.some(g => g.id === gameId)
    );
    
    const nextIndex = (lastPlayedIndex + 1) % suitableGames.length;
    return suitableGames[nextIndex];
  }

  scheduleBreak(userId: number): void {
    const scheduler = this.breakSchedulers.get(userId);
    if (scheduler) {
      scheduler.lastBreakTime = new Date();
    }
  }

  // Public methods
  getAvailableGames(userId: number): MiniGame[] {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    return Array.from(this.games.values()).filter(game => 
      profile.unlockedGames.includes(game.id)
    );
  }

  getGameById(gameId: string): MiniGame | undefined {
    return this.games.get(gameId);
  }

  getUserGameProfile(userId: number): UserGameProfile | undefined {
    return this.userProfiles.get(userId);
  }

  getGameSession(sessionId: string): GameSession | undefined {
    return this.gameSessions.get(sessionId);
  }

  getRecentSessions(userId: number, limit: number = 10): GameSession[] {
    return Array.from(this.gameSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  unlockGame(userId: number, gameId: string): boolean {
    const profile = this.userProfiles.get(userId);
    if (!profile) return false;

    if (!profile.unlockedGames.includes(gameId)) {
      profile.unlockedGames.push(gameId);
      return true;
    }
    
    return false;
  }

  updateGamePreferences(userId: number, preferences: Partial<GamePreferences>): boolean {
    const profile = this.userProfiles.get(userId);
    if (!profile) return false;

    profile.gamePreferences = { ...profile.gamePreferences, ...preferences };
    return true;
  }

  getGameLeaderboard(gameId: string, limit: number = 10): Array<{userId: number, score: number, accuracy: number}> {
    const sessions = Array.from(this.gameSessions.values())
      .filter(session => session.gameId === gameId && session.endTime)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return sessions.map(session => ({
      userId: session.userId,
      score: session.score,
      accuracy: session.accuracy
    }));
  }
}

export const miniGameSystem = new MiniGameSystem();