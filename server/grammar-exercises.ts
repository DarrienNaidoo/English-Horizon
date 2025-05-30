// Comprehensive grammar exercise system
export interface GrammarRule {
  id: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  examples: string[];
  commonMistakes: string[];
  tips: string[];
}

export interface GrammarExercise {
  id: string;
  ruleId: string;
  type: 'fill-blank' | 'multiple-choice' | 'error-correction' | 'sentence-transformation' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number; // 1-10
  points: number;
  hints?: string[];
}

export interface GrammarProgress {
  userId: number;
  ruleId: string;
  accuracy: number;
  totalAttempts: number;
  lastPracticed: Date;
  masteryLevel: number; // 0-100%
}

export class GrammarExerciseSystem {
  private grammarRules: Map<string, GrammarRule> = new Map();
  private exercises: Map<string, GrammarExercise[]> = new Map();
  private userProgress: Map<string, GrammarProgress> = new Map();

  constructor() {
    this.initializeGrammarRules();
    this.initializeExercises();
  }

  private initializeGrammarRules(): void {
    const rules: GrammarRule[] = [
      // Present Tenses
      {
        id: 'present-simple',
        topic: 'Present Simple',
        level: 'beginner',
        explanation: 'Used for habits, facts, and general truths. Form: Subject + base verb (add -s/-es for third person singular)',
        examples: [
          'I work in an office.',
          'She plays tennis every Monday.',
          'The sun rises in the east.',
          'Water boils at 100°C.'
        ],
        commonMistakes: [
          'Forgetting -s/-es for third person: "He work" instead of "He works"',
          'Using do/does in positive statements: "He does work" instead of "He works"',
          'Wrong word order in questions: "Where you work?" instead of "Where do you work?"'
        ],
        tips: [
          'Remember: I/You/We/They + base verb, He/She/It + verb+s/es',
          'Use time expressions: always, usually, often, sometimes, never',
          'Questions: Do/Does + subject + base verb?'
        ]
      },
      {
        id: 'present-continuous',
        topic: 'Present Continuous',
        level: 'beginner',
        explanation: 'Used for actions happening now or temporary situations. Form: Subject + am/is/are + verb+ing',
        examples: [
          'I am working right now.',
          'She is studying English this semester.',
          'They are building a new house.',
          'The weather is getting warmer.'
        ],
        commonMistakes: [
          'Wrong auxiliary verb: "I are working" instead of "I am working"',
          'Forgetting -ing: "She is work" instead of "She is working"',
          'Using with stative verbs: "I am knowing" instead of "I know"'
        ],
        tips: [
          'Use time expressions: now, at the moment, currently, these days',
          'Don\'t use with stative verbs (know, like, want, need)',
          'Form: am/is/are + verb+ing'
        ]
      },
      {
        id: 'present-perfect',
        topic: 'Present Perfect',
        level: 'intermediate',
        explanation: 'Connects past and present. Used for experiences, recent actions, and unfinished time periods. Form: Subject + have/has + past participle',
        examples: [
          'I have lived in three countries.',
          'She has just finished her homework.',
          'We have been friends for ten years.',
          'Have you ever been to Japan?'
        ],
        commonMistakes: [
          'Using with specific past time: "I have visited Paris last year"',
          'Wrong auxiliary: "I has done" instead of "I have done"',
          'Confusing past simple and present perfect'
        ],
        tips: [
          'Use with: ever, never, just, already, yet, since, for',
          'Don\'t use with specific past times (yesterday, last week)',
          'Focus on the result, not when it happened'
        ]
      },

      // Past Tenses
      {
        id: 'past-simple',
        topic: 'Past Simple',
        level: 'beginner',
        explanation: 'Used for completed actions in the past. Form: Subject + past tense verb (regular: verb+ed, irregular: special forms)',
        examples: [
          'I visited London last month.',
          'She studied English for five years.',
          'They went to the cinema yesterday.',
          'We didn\'t see the movie.'
        ],
        commonMistakes: [
          'Wrong irregular forms: "I goed" instead of "I went"',
          'Using did with positive statements: "I did went"',
          'Mixing tenses: "Yesterday I go to the store"'
        ],
        tips: [
          'Regular verbs: add -ed (work → worked)',
          'Irregular verbs must be memorized (go → went, see → saw)',
          'Questions: Did + subject + base verb?'
        ]
      },
      {
        id: 'past-continuous',
        topic: 'Past Continuous',
        level: 'intermediate',
        explanation: 'Used for ongoing actions in the past or interrupted actions. Form: Subject + was/were + verb+ing',
        examples: [
          'I was reading when you called.',
          'They were watching TV all evening.',
          'She was cooking while he was cleaning.',
          'What were you doing at 8pm yesterday?'
        ],
        commonMistakes: [
          'Wrong auxiliary: "I were working" instead of "I was working"',
          'Using with stative verbs: "I was knowing" instead of "I knew"',
          'Confusing with past simple for completed actions'
        ],
        tips: [
          'Use for interrupted actions: "I was sleeping when the phone rang"',
          'Use for parallel actions: "While I was cooking, she was studying"',
          'Often combined with past simple for storytelling'
        ]
      },

      // Future Tenses
      {
        id: 'future-will',
        topic: 'Future with Will',
        level: 'intermediate',
        explanation: 'Used for predictions, spontaneous decisions, and promises. Form: Subject + will + base verb',
        examples: [
          'I will help you with your homework.',
          'It will rain tomorrow.',
          'She will be a great doctor.',
          'We won\'t be late.'
        ],
        commonMistakes: [
          'Using with time clauses: "When I will arrive" instead of "When I arrive"',
          'Adding to after will: "I will to go" instead of "I will go"',
          'Using for planned future: "I will meet John at 3pm" (use going to)'
        ],
        tips: [
          'Use for predictions based on opinion: "I think it will rain"',
          'Use for spontaneous decisions: "I\'ll answer the phone"',
          'Use for promises and offers: "I will help you"'
        ]
      },
      {
        id: 'future-going-to',
        topic: 'Future with Going To',
        level: 'intermediate',
        explanation: 'Used for plans and predictions based on evidence. Form: Subject + am/is/are + going to + base verb',
        examples: [
          'I am going to study medicine next year.',
          'Look at those clouds! It\'s going to rain.',
          'They are going to move to Canada.',
          'She isn\'t going to come to the party.'
        ],
        commonMistakes: [
          'Forgetting "to": "I am going study" instead of "I am going to study"',
          'Wrong auxiliary: "I are going to" instead of "I am going to"',
          'Using for spontaneous decisions'
        ],
        tips: [
          'Use for plans: "I\'m going to visit my grandmother"',
          'Use for predictions with evidence: "She\'s going to win" (she\'s leading)',
          'More common in spoken English than "will"'
        ]
      },

      // Conditionals
      {
        id: 'conditional-zero',
        topic: 'Zero Conditional',
        level: 'intermediate',
        explanation: 'Used for general truths and scientific facts. Form: If + present simple, present simple',
        examples: [
          'If you heat water to 100°C, it boils.',
          'If I don\'t sleep enough, I feel tired.',
          'Plants die if they don\'t get water.',
          'If you mix blue and yellow, you get green.'
        ],
        commonMistakes: [
          'Using will: "If you heat water, it will boils"',
          'Wrong tense combination',
          'Confusing with first conditional'
        ],
        tips: [
          'Both clauses use present simple',
          'Can use "when" instead of "if"',
          'Expresses facts that are always true'
        ]
      },
      {
        id: 'conditional-first',
        topic: 'First Conditional',
        level: 'intermediate',
        explanation: 'Used for real possibilities in the future. Form: If + present simple, will + base verb',
        examples: [
          'If it rains tomorrow, I will stay home.',
          'If you study hard, you will pass the exam.',
          'She will be angry if you are late.',
          'If I have time, I\'ll call you.'
        ],
        commonMistakes: [
          'Using will in if-clause: "If it will rain" instead of "If it rains"',
          'Using present simple in result clause: "If it rains, I stay home"',
          'Confusing with zero conditional'
        ],
        tips: [
          'If-clause: present simple, Main clause: will + base verb',
          'Can use unless (= if not): "Unless you hurry, you\'ll be late"',
          'Expresses real possibilities'
        ]
      },
      {
        id: 'conditional-second',
        topic: 'Second Conditional',
        level: 'advanced',
        explanation: 'Used for hypothetical situations in the present/future. Form: If + past simple, would + base verb',
        examples: [
          'If I won the lottery, I would buy a house.',
          'If she spoke Chinese, she would get the job.',
          'What would you do if you were me?',
          'If I were you, I would apologize.'
        ],
        commonMistakes: [
          'Using would in if-clause: "If I would win" instead of "If I won"',
          'Using will instead of would: "If I won, I will buy"',
          'Using was instead of were with I/he/she: "If I was you"'
        ],
        tips: [
          'Use "were" for all persons with "be": "If I were rich..."',
          'Expresses unreal or unlikely situations',
          'Result is imaginary, not real'
        ]
      },

      // Modal Verbs
      {
        id: 'modal-can-could',
        topic: 'Can and Could',
        level: 'beginner',
        explanation: 'Can: present ability, permission, requests. Could: past ability, polite requests, possibility',
        examples: [
          'I can speak three languages.',
          'Can I use your phone?',
          'Could you help me, please?',
          'She could swim when she was five.'
        ],
        commonMistakes: [
          'Adding to: "I can to swim" instead of "I can swim"',
          'Using with other modals: "I can will go"',
          'Wrong question form: "Can you to help me?"'
        ],
        tips: [
          'Never use "to" after modal verbs',
          'Could is more polite than can for requests',
          'Use could for past ability that no longer exists'
        ]
      },
      {
        id: 'modal-must-have-to',
        topic: 'Must and Have To',
        level: 'intermediate',
        explanation: 'Must: strong obligation/necessity (speaker\'s opinion). Have to: external obligation/necessity',
        examples: [
          'I must finish this project today.',
          'You have to wear a seatbelt in the car.',
          'She must be tired after working 12 hours.',
          'Do you have to work on weekends?'
        ],
        commonMistakes: [
          'Using must for external rules: "I must wear uniform" (use have to)',
          'Wrong question form with must: "Must you work?"',
          'Confusing mustn\'t and don\'t have to'
        ],
        tips: [
          'Must: internal obligation (I think it\'s necessary)',
          'Have to: external obligation (the rule says)',
          'Mustn\'t = prohibition, Don\'t have to = not necessary'
        ]
      },

      // Passive Voice
      {
        id: 'passive-voice',
        topic: 'Passive Voice',
        level: 'advanced',
        explanation: 'Used when the action is more important than who does it. Form: Subject + be + past participle',
        examples: [
          'The house was built in 1995.',
          'English is spoken all over the world.',
          'The report will be finished tomorrow.',
          'The car is being repaired right now.'
        ],
        commonMistakes: [
          'Wrong auxiliary verb: "The house were built"',
          'Forgetting past participle: "The house was build"',
          'Using when active is better: "Mistakes were made by me"'
        ],
        tips: [
          'Use when the doer is unknown, unimportant, or obvious',
          'Various tenses: am/is/are + past participle (present)',
          'Add "by" only when the doer is important'
        ]
      }
    ];

    rules.forEach(rule => {
      this.grammarRules.set(rule.id, rule);
    });
  }

  private initializeExercises(): void {
    // Present Simple Exercises
    const presentSimpleExercises: GrammarExercise[] = [
      {
        id: 'ps-1',
        ruleId: 'present-simple',
        type: 'fill-blank',
        question: 'She _____ (work) in a hospital.',
        correctAnswer: 'works',
        explanation: 'Third person singular (she) requires -s ending: work → works',
        difficulty: 2,
        points: 1,
        hints: ['Remember to add -s for he/she/it']
      },
      {
        id: 'ps-2',
        ruleId: 'present-simple',
        type: 'multiple-choice',
        question: 'How often _____ you exercise?',
        options: ['do', 'does', 'are', 'is'],
        correctAnswer: 'do',
        explanation: 'Use "do" with I, you, we, they in questions',
        difficulty: 3,
        points: 2
      },
      {
        id: 'ps-3',
        ruleId: 'present-simple',
        type: 'error-correction',
        question: 'He don\'t like coffee.',
        correctAnswer: 'He doesn\'t like coffee.',
        explanation: 'Third person singular uses "doesn\'t", not "don\'t"',
        difficulty: 3,
        points: 2
      },
      {
        id: 'ps-4',
        ruleId: 'present-simple',
        type: 'sentence-transformation',
        question: 'Transform to negative: "They play football every Sunday."',
        correctAnswer: 'They don\'t play football every Sunday.',
        explanation: 'For I/you/we/they, use "don\'t" + base verb',
        difficulty: 4,
        points: 3
      }
    ];

    // Present Continuous Exercises
    const presentContinuousExercises: GrammarExercise[] = [
      {
        id: 'pc-1',
        ruleId: 'present-continuous',
        type: 'fill-blank',
        question: 'I _____ (read) a very interesting book right now.',
        correctAnswer: 'am reading',
        explanation: 'Present continuous: am/is/are + verb+ing. With "I" use "am"',
        difficulty: 2,
        points: 1
      },
      {
        id: 'pc-2',
        ruleId: 'present-continuous',
        type: 'multiple-choice',
        question: 'What _____ you _____ tomorrow evening?',
        options: ['are / doing', 'do / do', 'are / do', 'do / doing'],
        correctAnswer: 'are / doing',
        explanation: 'Future arrangements use present continuous: are + doing',
        difficulty: 4,
        points: 2
      },
      {
        id: 'pc-3',
        ruleId: 'present-continuous',
        type: 'error-correction',
        question: 'She is knowing the answer.',
        correctAnswer: 'She knows the answer.',
        explanation: '"Know" is a stative verb and doesn\'t use continuous form',
        difficulty: 5,
        points: 3
      }
    ];

    // Present Perfect Exercises
    const presentPerfectExercises: GrammarExercise[] = [
      {
        id: 'pp-1',
        ruleId: 'present-perfect',
        type: 'fill-blank',
        question: 'I _____ (never/be) to Australia.',
        correctAnswer: 'have never been',
        explanation: 'Present perfect: have/has + past participle. "Never" goes between auxiliary and main verb',
        difficulty: 4,
        points: 2
      },
      {
        id: 'pp-2',
        ruleId: 'present-perfect',
        type: 'multiple-choice',
        question: '_____ you _____ your homework yet?',
        options: ['Did / finish', 'Have / finished', 'Are / finishing', 'Do / finish'],
        correctAnswer: 'Have / finished',
        explanation: '"Yet" indicates present perfect is needed for unfinished time period',
        difficulty: 5,
        points: 3
      },
      {
        id: 'pp-3',
        ruleId: 'present-perfect',
        type: 'error-correction',
        question: 'I have visited Paris last year.',
        correctAnswer: 'I visited Paris last year.',
        explanation: 'Don\'t use present perfect with specific past time expressions',
        difficulty: 6,
        points: 3
      }
    ];

    // Add exercises to the map
    this.exercises.set('present-simple', presentSimpleExercises);
    this.exercises.set('present-continuous', presentContinuousExercises);
    this.exercises.set('present-perfect', presentPerfectExercises);

    // Continue with more exercises for other grammar rules...
    this.addMoreExercises();
  }

  private addMoreExercises(): void {
    // Past Simple Exercises
    const pastSimpleExercises: GrammarExercise[] = [
      {
        id: 'pst-1',
        ruleId: 'past-simple',
        type: 'fill-blank',
        question: 'Yesterday, I _____ (go) to the cinema with my friends.',
        correctAnswer: 'went',
        explanation: 'Irregular verb: go → went in past simple',
        difficulty: 3,
        points: 2
      },
      {
        id: 'pst-2',
        ruleId: 'past-simple',
        type: 'multiple-choice',
        question: 'She _____ her keys in the car.',
        options: ['left', 'leaved', 'leaves', 'leaving'],
        correctAnswer: 'left',
        explanation: 'Irregular verb: leave → left',
        difficulty: 4,
        points: 2
      },
      {
        id: 'pst-3',
        ruleId: 'past-simple',
        type: 'sentence-transformation',
        question: 'Transform to question: "They arrived at 6 o\'clock."',
        correctAnswer: 'Did they arrive at 6 o\'clock?',
        explanation: 'Past simple questions: Did + subject + base verb',
        difficulty: 4,
        points: 3
      }
    ];

    // Conditional Exercises
    const conditionalExercises: GrammarExercise[] = [
      {
        id: 'cond-1',
        ruleId: 'conditional-first',
        type: 'fill-blank',
        question: 'If it _____ (rain) tomorrow, we _____ (stay) at home.',
        correctAnswer: 'rains, will stay',
        explanation: 'First conditional: If + present simple, will + base verb',
        difficulty: 5,
        points: 3
      },
      {
        id: 'cond-2',
        ruleId: 'conditional-second',
        type: 'multiple-choice',
        question: 'If I _____ you, I _____ that job.',
        options: ['was / would take', 'were / would take', 'am / will take', 'were / will take'],
        correctAnswer: 'were / would take',
        explanation: 'Second conditional uses "were" for all persons and "would"',
        difficulty: 7,
        points: 4
      },
      {
        id: 'cond-3',
        ruleId: 'conditional-zero',
        type: 'error-correction',
        question: 'If you will heat ice, it melts.',
        correctAnswer: 'If you heat ice, it melts.',
        explanation: 'Zero conditional uses present simple in both clauses',
        difficulty: 6,
        points: 3
      }
    ];

    // Modal Verb Exercises
    const modalExercises: GrammarExercise[] = [
      {
        id: 'mod-1',
        ruleId: 'modal-can-could',
        type: 'fill-blank',
        question: '_____ you help me with this problem, please?',
        correctAnswer: 'Could',
        explanation: '"Could" is more polite than "can" for requests',
        difficulty: 3,
        points: 2
      },
      {
        id: 'mod-2',
        ruleId: 'modal-must-have-to',
        type: 'multiple-choice',
        question: 'You _____ wear a helmet when riding a motorcycle. It\'s the law.',
        options: ['must', 'have to', 'should', 'can'],
        correctAnswer: 'have to',
        explanation: 'External obligation (law) uses "have to"',
        difficulty: 6,
        points: 3
      },
      {
        id: 'mod-3',
        ruleId: 'modal-must-have-to',
        type: 'error-correction',
        question: 'You mustn\'t to wear a tie.',
        correctAnswer: 'You mustn\'t wear a tie.',
        explanation: 'Modal verbs are never followed by "to"',
        difficulty: 4,
        points: 2
      }
    ];

    // Add all exercise sets
    this.exercises.set('past-simple', pastSimpleExercises);
    this.exercises.set('conditional-first', conditionalExercises);
    this.exercises.set('modal-can-could', modalExercises);
  }

  // Public methods
  getGrammarRules(level?: string): GrammarRule[] {
    const rules = Array.from(this.grammarRules.values());
    if (level) {
      return rules.filter(rule => rule.level === level);
    }
    return rules;
  }

  getGrammarRule(id: string): GrammarRule | undefined {
    return this.grammarRules.get(id);
  }

  getExercisesByRule(ruleId: string, difficulty?: number): GrammarExercise[] {
    const exercises = this.exercises.get(ruleId) || [];
    if (difficulty) {
      return exercises.filter(ex => ex.difficulty <= difficulty);
    }
    return exercises;
  }

  checkAnswer(exerciseId: string, userAnswer: string): { correct: boolean; explanation: string; points: number } {
    // Find exercise
    let exercise: GrammarExercise | undefined;
    for (const exercises of this.exercises.values()) {
      exercise = exercises.find(ex => ex.id === exerciseId);
      if (exercise) break;
    }

    if (!exercise) {
      return { correct: false, explanation: 'Exercise not found', points: 0 };
    }

    const correct = Array.isArray(exercise.correctAnswer) 
      ? exercise.correctAnswer.includes(userAnswer.toLowerCase().trim())
      : exercise.correctAnswer.toLowerCase() === userAnswer.toLowerCase().trim();

    return {
      correct,
      explanation: exercise.explanation,
      points: correct ? exercise.points : 0
    };
  }

  updateUserProgress(userId: number, ruleId: string, correct: boolean): void {
    const key = `${userId}-${ruleId}`;
    let progress = this.userProgress.get(key);

    if (!progress) {
      progress = {
        userId,
        ruleId,
        accuracy: 0,
        totalAttempts: 0,
        lastPracticed: new Date(),
        masteryLevel: 0
      };
    }

    progress.totalAttempts += 1;
    progress.lastPracticed = new Date();

    if (correct) {
      progress.accuracy = ((progress.accuracy * (progress.totalAttempts - 1)) + 100) / progress.totalAttempts;
    } else {
      progress.accuracy = (progress.accuracy * (progress.totalAttempts - 1)) / progress.totalAttempts;
    }

    // Calculate mastery level based on accuracy and attempts
    progress.masteryLevel = Math.min(100, (progress.accuracy * Math.min(progress.totalAttempts / 10, 1)));

    this.userProgress.set(key, progress);
  }

  getUserProgress(userId: number): GrammarProgress[] {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId)
      .sort((a, b) => b.lastPracticed.getTime() - a.lastPracticed.getTime());
  }

  getWeakAreas(userId: number): GrammarProgress[] {
    return this.getUserProgress(userId)
      .filter(progress => progress.masteryLevel < 70)
      .sort((a, b) => a.masteryLevel - b.masteryLevel);
  }

  getRecommendedExercises(userId: number, count: number = 5): GrammarExercise[] {
    const weakAreas = this.getWeakAreas(userId);
    const recommended: GrammarExercise[] = [];

    for (const area of weakAreas) {
      const exercises = this.getExercisesByRule(area.ruleId);
      if (exercises.length > 0) {
        recommended.push(exercises[Math.floor(Math.random() * exercises.length)]);
      }
      if (recommended.length >= count) break;
    }

    return recommended;
  }
}

export const grammarExerciseSystem = new GrammarExerciseSystem();