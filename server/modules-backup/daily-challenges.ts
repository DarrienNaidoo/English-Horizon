// Daily Smart Challenges System
export interface DailyChallenge {
  id: string;
  date: Date;
  type: 'word_of_day' | 'quick_quiz' | 'picture_sentence' | 'listening_snippet' | 'grammar_fix' | 'pronunciation_drill';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // seconds
  content: ChallengeContent;
  rewards: ChallengeReward[];
  completionCriteria: CompletionCriteria;
  hints: string[];
  streak: boolean; // Can contribute to streak
  category: string;
}

export interface ChallengeContent {
  prompt: string;
  data: any; // Challenge-specific data
  expectedAnswers: string[];
  acceptableVariations: string[];
  mediaUrl?: string;
  visualAid?: string;
  context: string;
}

export interface ChallengeReward {
  type: 'xp' | 'coins' | 'badge' | 'unlock' | 'boost';
  amount: number;
  description: string;
  special?: boolean;
}

export interface CompletionCriteria {
  minScore: number;
  timeLimit?: number;
  attemptsAllowed: number;
  perfectRequired: boolean;
}

export interface UserChallengeAttempt {
  userId: number;
  challengeId: string;
  attemptNumber: number;
  startTime: Date;
  endTime: Date;
  userAnswer: string;
  score: number;
  timeSpent: number;
  hintsUsed: number;
  completed: boolean;
  perfect: boolean;
  feedback: string;
  mistakes: ChallengeMistake[];
}

export interface ChallengeMistake {
  type: string;
  description: string;
  correction: string;
  tip: string;
}

export interface UserChallengeStreak {
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date;
  totalCompleted: number;
  perfectDays: number;
  streakRewards: StreakReward[];
}

export interface StreakReward {
  day: number;
  reward: ChallengeReward;
  claimed: boolean;
  claimedAt?: Date;
}

export interface ChallengeLeaderboard {
  period: 'daily' | 'weekly' | 'monthly';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  userId: number;
  userName: string;
  score: number;
  streak: number;
  perfectDays: number;
  rank: number;
  change: number; // Position change from previous period
}

export class DailyChallengeSystem {
  private challenges: Map<string, DailyChallenge> = new Map();
  private userAttempts: Map<string, UserChallengeAttempt[]> = new Map();
  private userStreaks: Map<number, UserChallengeStreak> = new Map();
  private leaderboards: Map<string, ChallengeLeaderboard> = new Map();
  private challengeTemplates: Map<string, any> = new Map();

  constructor() {
    this.initializeChallengeTemplates();
    this.generateDailyChallenges();
    this.initializeSampleData();
  }

  private initializeChallengeTemplates(): void {
    // Word of the Day templates
    this.challengeTemplates.set('word_of_day', {
      words: [
        {
          word: 'serendipity',
          definition: 'A pleasant surprise or fortunate accident',
          pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
          examples: [
            'Finding this book was pure serendipity.',
            'Their meeting was a wonderful serendipity.'
          ],
          difficulty: 'hard',
          category: 'advanced_vocabulary'
        },
        {
          word: 'resilient',
          definition: 'Able to recover quickly from difficulties',
          pronunciation: '/rɪˈzɪl.i.ənt/',
          examples: [
            'She is very resilient and bounces back from setbacks.',
            'The resilient community rebuilt after the storm.'
          ],
          difficulty: 'medium',
          category: 'character_traits'
        },
        {
          word: 'collaborate',
          definition: 'To work together on a project',
          pronunciation: '/kəˈlæb.ə.reɪt/',
          examples: [
            'We need to collaborate to finish this project.',
            'The two companies will collaborate on the research.'
          ],
          difficulty: 'medium',
          category: 'business_english'
        }
      ]
    });

    // Quick Quiz templates
    this.challengeTemplates.set('quick_quiz', {
      questions: [
        {
          question: 'Which word means "very tired"?',
          options: ['exhausted', 'confused', 'excited', 'worried'],
          correct: 0,
          explanation: 'Exhausted means extremely tired.',
          difficulty: 'easy'
        },
        {
          question: 'Complete: "I _____ to the store yesterday."',
          options: ['go', 'went', 'going', 'gone'],
          correct: 1,
          explanation: 'Use past tense "went" for yesterday.',
          difficulty: 'easy'
        },
        {
          question: 'What is the opposite of "ancient"?',
          options: ['old', 'modern', 'historic', 'traditional'],
          correct: 1,
          explanation: 'Modern is the opposite of ancient.',
          difficulty: 'medium'
        }
      ]
    });

    // Picture Sentence templates
    this.challengeTemplates.set('picture_sentence', {
      scenarios: [
        {
          image: 'park_scene',
          description: 'A family having a picnic in the park',
          targetSentences: [
            'The family is having a picnic in the park.',
            'Children are playing on the grass.',
            'The weather looks beautiful and sunny.'
          ],
          vocabulary: ['family', 'picnic', 'park', 'playing', 'sunny'],
          difficulty: 'easy'
        },
        {
          image: 'restaurant_scene',
          description: 'A busy restaurant with waiters serving customers',
          targetSentences: [
            'The restaurant is very busy tonight.',
            'Waiters are serving delicious food to customers.',
            'People are enjoying their meals and conversation.'
          ],
          vocabulary: ['restaurant', 'busy', 'waiters', 'serving', 'customers'],
          difficulty: 'medium'
        }
      ]
    });

    // Grammar Fix templates
    this.challengeTemplates.set('grammar_fix', {
      sentences: [
        {
          incorrect: 'She don\'t like coffee.',
          correct: 'She doesn\'t like coffee.',
          explanation: 'Use "doesn\'t" with third person singular (she, he, it).',
          rule: 'subject_verb_agreement',
          difficulty: 'easy'
        },
        {
          incorrect: 'I have went to the store.',
          correct: 'I have gone to the store.',
          explanation: 'Use "gone" with "have" in present perfect tense.',
          rule: 'present_perfect',
          difficulty: 'medium'
        },
        {
          incorrect: 'If I would have money, I would buy it.',
          correct: 'If I had money, I would buy it.',
          explanation: 'Don\'t use "would" in the if-clause of conditional sentences.',
          rule: 'conditionals',
          difficulty: 'hard'
        }
      ]
    });

    // Pronunciation Drill templates
    this.challengeTemplates.set('pronunciation_drill', {
      drills: [
        {
          word: 'thought',
          phonetic: '/θɔːt/',
          difficulty: 'th_sound',
          tips: 'Put your tongue between your teeth for the "th" sound.',
          practice: ['think', 'thank', 'three', 'through'],
          difficulty: 'medium'
        },
        {
          word: 'world',
          phonetic: '/wɜːrld/',
          difficulty: 'r_and_l',
          tips: 'Curl your tongue back for the "r" sound, then touch the roof of your mouth for "l".',
          practice: ['work', 'word', 'world', 'wonderful'],
          difficulty: 'hard'
        }
      ]
    });
  }

  private generateDailyChallenges(): void {
    const today = new Date();
    const challengeTypes = ['word_of_day', 'quick_quiz', 'picture_sentence', 'grammar_fix', 'pronunciation_drill'];
    
    // Generate challenges for the next 7 days
    for (let i = 0; i < 7; i++) {
      const challengeDate = new Date(today);
      challengeDate.setDate(today.getDate() + i);
      
      const challengeType = challengeTypes[i % challengeTypes.length];
      const challenge = this.createDailyChallenge(challengeDate, challengeType);
      
      this.challenges.set(challenge.id, challenge);
    }
  }

  private createDailyChallenge(date: Date, type: string): DailyChallenge {
    const dateStr = date.toISOString().split('T')[0];
    const challengeId = `${type}_${dateStr}`;

    switch (type) {
      case 'word_of_day':
        return this.createWordOfDayChallenge(challengeId, date);
      case 'quick_quiz':
        return this.createQuickQuizChallenge(challengeId, date);
      case 'picture_sentence':
        return this.createPictureSentenceChallenge(challengeId, date);
      case 'grammar_fix':
        return this.createGrammarFixChallenge(challengeId, date);
      case 'pronunciation_drill':
        return this.createPronunciationDrillChallenge(challengeId, date);
      default:
        return this.createWordOfDayChallenge(challengeId, date);
    }
  }

  private createWordOfDayChallenge(id: string, date: Date): DailyChallenge {
    const words = this.challengeTemplates.get('word_of_day').words;
    const word = words[Math.floor(Math.random() * words.length)];

    return {
      id,
      date,
      type: 'word_of_day',
      title: `Word of the Day: ${word.word}`,
      description: `Learn and use today's featured word: "${word.word}"`,
      difficulty: word.difficulty,
      estimatedTime: 180, // 3 minutes
      content: {
        prompt: `Today's word is "${word.word}" (${word.pronunciation}). It means: ${word.definition}`,
        data: word,
        expectedAnswers: word.examples,
        acceptableVariations: [],
        context: 'vocabulary_learning'
      },
      rewards: [
        { type: 'xp', amount: 50, description: 'Daily word XP' },
        { type: 'coins', amount: 10, description: 'Word mastery coins' }
      ],
      completionCriteria: {
        minScore: 70,
        attemptsAllowed: 3,
        perfectRequired: false
      },
      hints: [
        `Try using "${word.word}" in a sentence about your daily life`,
        `Remember: ${word.definition}`,
        `Example: ${word.examples[0]}`
      ],
      streak: true,
      category: 'vocabulary'
    };
  }

  private createQuickQuizChallenge(id: string, date: Date): DailyChallenge {
    const questions = this.challengeTemplates.get('quick_quiz').questions;
    const question = questions[Math.floor(Math.random() * questions.length)];

    return {
      id,
      date,
      type: 'quick_quiz',
      title: 'Quick Knowledge Check',
      description: 'Test your English knowledge with today\'s quick quiz',
      difficulty: question.difficulty,
      estimatedTime: 120, // 2 minutes
      content: {
        prompt: question.question,
        data: {
          options: question.options,
          correct: question.correct,
          explanation: question.explanation
        },
        expectedAnswers: [question.options[question.correct]],
        acceptableVariations: [],
        context: 'quiz_challenge'
      },
      rewards: [
        { type: 'xp', amount: 30, description: 'Quiz completion XP' },
        { type: 'coins', amount: 5, description: 'Quick thinking coins' }
      ],
      completionCriteria: {
        minScore: 100,
        timeLimit: 60,
        attemptsAllowed: 2,
        perfectRequired: true
      },
      hints: [
        'Think about the grammar rule or vocabulary meaning',
        'Eliminate obviously wrong answers first',
        question.explanation
      ],
      streak: true,
      category: 'mixed_skills'
    };
  }

  private createPictureSentenceChallenge(id: string, date: Date): DailyChallenge {
    const scenarios = this.challengeTemplates.get('picture_sentence').scenarios;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      id,
      date,
      type: 'picture_sentence',
      title: 'Picture Description Challenge',
      description: 'Create sentences describing what you see in the picture',
      difficulty: scenario.difficulty,
      estimatedTime: 240, // 4 minutes
      content: {
        prompt: 'Look at the picture and write 2-3 sentences describing what you see.',
        data: scenario,
        expectedAnswers: scenario.targetSentences,
        acceptableVariations: [
          'Alternative descriptions with same vocabulary',
          'Different sentence structures with correct grammar'
        ],
        visualAid: scenario.image,
        context: 'picture_description'
      },
      rewards: [
        { type: 'xp', amount: 40, description: 'Creative writing XP' },
        { type: 'coins', amount: 8, description: 'Description coins' }
      ],
      completionCriteria: {
        minScore: 75,
        attemptsAllowed: 3,
        perfectRequired: false
      },
      hints: [
        `Use these words: ${scenario.vocabulary.join(', ')}`,
        'Describe what people are doing',
        'Mention the setting and atmosphere'
      ],
      streak: true,
      category: 'writing'
    };
  }

  private createGrammarFixChallenge(id: string, date: Date): DailyChallenge {
    const sentences = this.challengeTemplates.get('grammar_fix').sentences;
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];

    return {
      id,
      date,
      type: 'grammar_fix',
      title: 'Grammar Detective',
      description: 'Find and fix the grammar mistake in today\'s sentence',
      difficulty: sentence.difficulty,
      estimatedTime: 150, // 2.5 minutes
      content: {
        prompt: `Fix the grammar mistake in this sentence: "${sentence.incorrect}"`,
        data: sentence,
        expectedAnswers: [sentence.correct],
        acceptableVariations: [],
        context: 'grammar_correction'
      },
      rewards: [
        { type: 'xp', amount: 35, description: 'Grammar mastery XP' },
        { type: 'coins', amount: 7, description: 'Detective coins' }
      ],
      completionCriteria: {
        minScore: 90,
        attemptsAllowed: 3,
        perfectRequired: false
      },
      hints: [
        `This is about: ${sentence.rule.replace('_', ' ')}`,
        'Look carefully at verb forms and subject-verb agreement',
        sentence.explanation
      ],
      streak: true,
      category: 'grammar'
    };
  }

  private createPronunciationDrillChallenge(id: string, date: Date): DailyChallenge {
    const drills = this.challengeTemplates.get('pronunciation_drill').drills;
    const drill = drills[Math.floor(Math.random() * drills.length)];

    return {
      id,
      date,
      type: 'pronunciation_drill',
      title: 'Pronunciation Practice',
      description: `Master the pronunciation of "${drill.word}" and similar sounds`,
      difficulty: drill.difficulty,
      estimatedTime: 300, // 5 minutes
      content: {
        prompt: `Practice pronouncing "${drill.word}" correctly. Say it clearly 3 times.`,
        data: drill,
        expectedAnswers: [drill.word],
        acceptableVariations: drill.practice,
        context: 'pronunciation_practice'
      },
      rewards: [
        { type: 'xp', amount: 45, description: 'Pronunciation XP' },
        { type: 'coins', amount: 9, description: 'Clear speech coins' }
      ],
      completionCriteria: {
        minScore: 80,
        attemptsAllowed: 5,
        perfectRequired: false
      },
      hints: [
        drill.tips,
        `Practice these similar words: ${drill.practice.join(', ')}`,
        'Record yourself and listen back'
      ],
      streak: true,
      category: 'pronunciation'
    };
  }

  private initializeSampleData(): void {
    // Initialize sample user streak
    const sampleStreak: UserChallengeStreak = {
      userId: 1,
      currentStreak: 5,
      longestStreak: 12,
      lastCompletedDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      totalCompleted: 45,
      perfectDays: 8,
      streakRewards: [
        {
          day: 7,
          reward: { type: 'badge', amount: 1, description: 'Week Warrior Badge' },
          claimed: true,
          claimedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          day: 30,
          reward: { type: 'xp', amount: 500, description: 'Monthly Dedication Bonus', special: true },
          claimed: false
        }
      ]
    };

    this.userStreaks.set(1, sampleStreak);

    // Sample leaderboard
    const dailyLeaderboard: ChallengeLeaderboard = {
      period: 'daily',
      entries: [
        { userId: 1, userName: 'Alex', score: 280, streak: 5, perfectDays: 2, rank: 1, change: 0 },
        { userId: 2, userName: 'Sarah', score: 265, streak: 3, perfectDays: 1, rank: 2, change: 1 },
        { userId: 3, userName: 'Mike', score: 240, streak: 8, perfectDays: 3, rank: 3, change: -1 }
      ],
      lastUpdated: new Date()
    };

    this.leaderboards.set('daily', dailyLeaderboard);
  }

  // Challenge attempt methods
  startChallenge(userId: number, challengeId: string): UserChallengeAttempt {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const userAttempts = this.userAttempts.get(`${userId}_${challengeId}`) || [];
    const attemptNumber = userAttempts.length + 1;

    if (attemptNumber > challenge.completionCriteria.attemptsAllowed) {
      throw new Error('Maximum attempts exceeded');
    }

    const attempt: UserChallengeAttempt = {
      userId,
      challengeId,
      attemptNumber,
      startTime: new Date(),
      endTime: new Date(), // Will be updated on completion
      userAnswer: '',
      score: 0,
      timeSpent: 0,
      hintsUsed: 0,
      completed: false,
      perfect: false,
      feedback: '',
      mistakes: []
    };

    return attempt;
  }

  submitChallengeAnswer(
    userId: number,
    challengeId: string,
    userAnswer: string,
    hintsUsed: number = 0
  ): UserChallengeAttempt {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const userAttempts = this.userAttempts.get(`${userId}_${challengeId}`) || [];
    const currentAttempt = userAttempts[userAttempts.length - 1];
    
    if (!currentAttempt) {
      throw new Error('No active attempt found');
    }

    currentAttempt.endTime = new Date();
    currentAttempt.timeSpent = currentAttempt.endTime.getTime() - currentAttempt.startTime.getTime();
    currentAttempt.userAnswer = userAnswer;
    currentAttempt.hintsUsed = hintsUsed;

    // Evaluate the answer
    const evaluation = this.evaluateAnswer(challenge, userAnswer);
    currentAttempt.score = evaluation.score;
    currentAttempt.completed = evaluation.score >= challenge.completionCriteria.minScore;
    currentAttempt.perfect = evaluation.score === 100;
    currentAttempt.feedback = evaluation.feedback;
    currentAttempt.mistakes = evaluation.mistakes;

    // Store the attempt
    userAttempts.push(currentAttempt);
    this.userAttempts.set(`${userId}_${challengeId}`, userAttempts);

    // Update streak if completed
    if (currentAttempt.completed && challenge.streak) {
      this.updateUserStreak(userId, challenge.date);
    }

    // Award rewards if completed
    if (currentAttempt.completed) {
      this.awardChallengeRewards(userId, challenge, currentAttempt);
    }

    return currentAttempt;
  }

  private evaluateAnswer(challenge: DailyChallenge, userAnswer: string): {
    score: number;
    feedback: string;
    mistakes: ChallengeMistake[];
  } {
    const mistakes: ChallengeMistake[] = [];
    let score = 0;
    let feedback = '';

    switch (challenge.type) {
      case 'word_of_day':
        score = this.evaluateWordOfDay(challenge, userAnswer, mistakes);
        break;
      case 'quick_quiz':
        score = this.evaluateQuickQuiz(challenge, userAnswer, mistakes);
        break;
      case 'picture_sentence':
        score = this.evaluatePictureSentence(challenge, userAnswer, mistakes);
        break;
      case 'grammar_fix':
        score = this.evaluateGrammarFix(challenge, userAnswer, mistakes);
        break;
      case 'pronunciation_drill':
        score = this.evaluatePronunciationDrill(challenge, userAnswer, mistakes);
        break;
    }

    // Generate feedback based on score
    if (score >= 90) {
      feedback = 'Excellent work! You\'ve mastered today\'s challenge.';
    } else if (score >= 75) {
      feedback = 'Great job! You have a good understanding.';
    } else if (score >= 60) {
      feedback = 'Good effort! Keep practicing to improve.';
    } else {
      feedback = 'Keep trying! Review the hints and try again.';
    }

    return { score, feedback, mistakes };
  }

  private evaluateWordOfDay(challenge: DailyChallenge, userAnswer: string, mistakes: ChallengeMistake[]): number {
    const wordData = challenge.content.data;
    const answer = userAnswer.toLowerCase().trim();
    
    // Check if the word is used correctly in a sentence
    if (answer.includes(wordData.word.toLowerCase())) {
      // Basic sentence structure check
      if (answer.length > wordData.word.length + 5 && (answer.includes('.') || answer.includes('!'))) {
        return 100;
      } else {
        mistakes.push({
          type: 'sentence_structure',
          description: 'Try to use the word in a complete sentence',
          correction: 'Add more context and proper punctuation',
          tip: 'Example: ' + wordData.examples[0]
        });
        return 70;
      }
    } else {
      mistakes.push({
        type: 'word_usage',
        description: 'The target word was not found in your sentence',
        correction: `Make sure to include "${wordData.word}" in your response`,
        tip: 'Use the word in context like the examples shown'
      });
      return 30;
    }
  }

  private evaluateQuickQuiz(challenge: DailyChallenge, userAnswer: string, mistakes: ChallengeMistake[]): number {
    const quizData = challenge.content.data;
    const correctAnswer = quizData.options[quizData.correct].toLowerCase();
    const userAnswerClean = userAnswer.toLowerCase().trim();

    if (userAnswerClean === correctAnswer) {
      return 100;
    } else {
      mistakes.push({
        type: 'incorrect_answer',
        description: 'That\'s not the correct answer',
        correction: `The correct answer is: ${quizData.options[quizData.correct]}`,
        tip: quizData.explanation
      });
      return 0;
    }
  }

  private evaluatePictureSentence(challenge: DailyChallenge, userAnswer: string, mistakes: ChallengeMistake[]): number {
    const scenarioData = challenge.content.data;
    const answer = userAnswer.toLowerCase();
    let score = 0;

    // Check for target vocabulary usage
    const vocabUsed = scenarioData.vocabulary.filter((word: string) => 
      answer.includes(word.toLowerCase())
    );
    score += (vocabUsed.length / scenarioData.vocabulary.length) * 40;

    // Check sentence structure (basic)
    const sentences = userAnswer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 2) {
      score += 30;
    } else {
      mistakes.push({
        type: 'sentence_count',
        description: 'Try to write at least 2-3 sentences',
        correction: 'Describe more details about what you see',
        tip: 'Include actions, objects, and settings'
      });
    }

    // Check for descriptive content
    const descriptiveWords = ['is', 'are', 'playing', 'eating', 'sitting', 'walking', 'beautiful', 'busy'];
    const descriptiveUsed = descriptiveWords.filter(word => answer.includes(word));
    score += Math.min(30, descriptiveUsed.length * 10);

    if (vocabUsed.length < scenarioData.vocabulary.length / 2) {
      mistakes.push({
        type: 'vocabulary_usage',
        description: 'Try to use more of the suggested vocabulary',
        correction: `Include words like: ${scenarioData.vocabulary.join(', ')}`,
        tip: 'Use the vocabulary to describe what you see'
      });
    }

    return Math.round(score);
  }

  private evaluateGrammarFix(challenge: DailyChallenge, userAnswer: string, mistakes: ChallengeMistake[]): number {
    const grammarData = challenge.content.data;
    const correctAnswer = grammarData.correct.toLowerCase().trim();
    const userAnswerClean = userAnswer.toLowerCase().trim();

    // Direct match
    if (userAnswerClean === correctAnswer) {
      return 100;
    }

    // Partial credit for getting the key correction
    const keyWord = this.extractKeyDifference(grammarData.incorrect, grammarData.correct);
    if (keyWord && userAnswer.toLowerCase().includes(keyWord.toLowerCase())) {
      mistakes.push({
        type: 'partial_correction',
        description: 'You found the key issue but the full sentence needs adjustment',
        correction: grammarData.correct,
        tip: grammarData.explanation
      });
      return 75;
    }

    mistakes.push({
      type: 'grammar_error',
      description: 'The grammar correction is not quite right',
      correction: grammarData.correct,
      tip: grammarData.explanation
    });
    return 40;
  }

  private extractKeyDifference(incorrect: string, correct: string): string | null {
    const incorrectWords = incorrect.toLowerCase().split(/\s+/);
    const correctWords = correct.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < Math.max(incorrectWords.length, correctWords.length); i++) {
      if (incorrectWords[i] !== correctWords[i]) {
        return correctWords[i] || '';
      }
    }
    return null;
  }

  private evaluatePronunciationDrill(challenge: DailyChallenge, userAnswer: string, mistakes: ChallengeMistake[]): number {
    // In a real implementation, this would use speech recognition
    // For now, we'll give a base score and check for effort
    const drillData = challenge.content.data;
    const targetWord = drillData.word.toLowerCase();
    const answer = userAnswer.toLowerCase();

    if (answer.includes(targetWord)) {
      return 85; // Good effort, would be refined with actual audio analysis
    } else {
      mistakes.push({
        type: 'pronunciation_attempt',
        description: 'Make sure to pronounce the target word clearly',
        correction: `Focus on "${drillData.word}" (${drillData.phonetic})`,
        tip: drillData.tips
      });
      return 60;
    }
  }

  private updateUserStreak(userId: number, challengeDate: Date): void {
    let streak = this.userStreaks.get(userId);
    
    if (!streak) {
      streak = {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: new Date(0),
        totalCompleted: 0,
        perfectDays: 0,
        streakRewards: []
      };
    }

    const today = new Date(challengeDate);
    const lastCompleted = new Date(streak.lastCompletedDate);
    const daysDiff = Math.floor((today.getTime() - lastCompleted.getTime()) / (24 * 60 * 60 * 1000));

    if (daysDiff === 1) {
      // Consecutive day
      streak.currentStreak += 1;
    } else if (daysDiff === 0) {
      // Same day, don't break streak
      return;
    } else {
      // Streak broken
      streak.currentStreak = 1;
    }

    streak.lastCompletedDate = today;
    streak.totalCompleted += 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

    // Check for streak rewards
    this.checkStreakRewards(streak);

    this.userStreaks.set(userId, streak);
  }

  private checkStreakRewards(streak: UserChallengeStreak): void {
    const rewardDays = [3, 7, 14, 30, 50, 100];
    
    rewardDays.forEach(day => {
      if (streak.currentStreak >= day) {
        const existingReward = streak.streakRewards.find(r => r.day === day);
        if (!existingReward) {
          const reward: StreakReward = {
            day,
            reward: this.generateStreakReward(day),
            claimed: false
          };
          streak.streakRewards.push(reward);
        }
      }
    });
  }

  private generateStreakReward(day: number): ChallengeReward {
    if (day <= 7) {
      return { type: 'xp', amount: day * 20, description: `${day}-day streak bonus` };
    } else if (day <= 30) {
      return { type: 'coins', amount: day * 5, description: `${day}-day streak coins`, special: true };
    } else {
      return { type: 'badge', amount: 1, description: `${day}-day dedication badge`, special: true };
    }
  }

  private awardChallengeRewards(userId: number, challenge: DailyChallenge, attempt: UserChallengeAttempt): void {
    // Implementation would integrate with user profile/reward system
    console.log(`Awarding rewards to user ${userId}:`, challenge.rewards);
  }

  // Public methods
  getTodaysChallenge(): DailyChallenge | null {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    for (const challenge of this.challenges.values()) {
      const challengeDateStr = challenge.date.toISOString().split('T')[0];
      if (challengeDateStr === todayStr) {
        return challenge;
      }
    }
    return null;
  }

  getUserChallengeHistory(userId: number, limit: number = 10): UserChallengeAttempt[] {
    const allAttempts: UserChallengeAttempt[] = [];
    
    for (const attempts of this.userAttempts.values()) {
      allAttempts.push(...attempts.filter(a => a.userId === userId));
    }
    
    return allAttempts
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  getUserStreak(userId: number): UserChallengeStreak | null {
    return this.userStreaks.get(userId) || null;
  }

  getChallengeLeaderboard(period: 'daily' | 'weekly' | 'monthly'): ChallengeLeaderboard | null {
    return this.leaderboards.get(period) || null;
  }

  getAvailableChallenges(): DailyChallenge[] {
    return Array.from(this.challenges.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getChallengeById(challengeId: string): DailyChallenge | null {
    return this.challenges.get(challengeId) || null;
  }

  hasCompletedTodaysChallenge(userId: number): boolean {
    const todaysChallenge = this.getTodaysChallenge();
    if (!todaysChallenge) return false;

    const attempts = this.userAttempts.get(`${userId}_${todaysChallenge.id}`) || [];
    return attempts.some(attempt => attempt.completed);
  }

  claimStreakReward(userId: number, day: number): boolean {
    const streak = this.userStreaks.get(userId);
    if (!streak) return false;

    const reward = streak.streakRewards.find(r => r.day === day && !r.claimed);
    if (!reward) return false;

    reward.claimed = true;
    reward.claimedAt = new Date();
    
    // Award the reward (integrate with reward system)
    console.log(`Claiming streak reward for user ${userId}:`, reward.reward);
    
    return true;
  }
}

export const dailyChallengeSystem = new DailyChallengeSystem();