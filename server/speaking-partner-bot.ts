// Speaking Partner Bot (Role-Play Conversations)
export interface SpeakingBot {
  id: string;
  name: string;
  role: 'waiter' | 'teacher' | 'friend' | 'tourist' | 'shopkeeper' | 'doctor' | 'colleague' | 'interviewer';
  personality: string;
  avatar: string;
  voiceSettings: VoiceSettings;
  conversationTemplates: ConversationTemplate[];
  responsePatterns: ResponsePattern[];
  vocabulary: BotVocabulary;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context: ConversationContext;
}

export interface VoiceSettings {
  accent: 'american' | 'british' | 'australian' | 'neutral';
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
  voiceType: 'male' | 'female' | 'neutral';
  emotionalTone: 'friendly' | 'professional' | 'casual' | 'enthusiastic';
}

export interface ConversationTemplate {
  id: string;
  scenario: string;
  objective: string;
  estimatedDuration: number;
  phases: ConversationPhase[];
  successCriteria: string[];
  commonMistakes: string[];
  targetVocabulary: string[];
}

export interface ConversationPhase {
  phaseNumber: number;
  name: string;
  description: string;
  botPrompts: string[];
  expectedUserResponses: string[];
  transitionTriggers: string[];
  helpHints: string[];
  maxAttempts: number;
}

export interface ResponsePattern {
  trigger: string;
  responseType: 'clarification' | 'encouragement' | 'correction' | 'progression' | 'repetition';
  responses: string[];
  conditions: string[];
  followUpActions: string[];
}

export interface BotVocabulary {
  keyPhrases: string[];
  synonyms: { [word: string]: string[] };
  culturalExpressions: CulturalExpression[];
  formalAlternatives: { [casual: string]: string };
  corrections: GrammarCorrection[];
}

export interface CulturalExpression {
  phrase: string;
  meaning: string;
  usage: string;
  formality: 'casual' | 'formal' | 'both';
  region: string;
}

export interface GrammarCorrection {
  incorrectPattern: string;
  correctPattern: string;
  explanation: string;
  examples: string[];
}

export interface ConversationContext {
  setting: string;
  timeOfDay: string;
  purpose: string;
  culturalNotes: string[];
  etiquettePoints: string[];
  backgroundInfo: string;
}

export interface ConversationSession {
  id: string;
  userId: number;
  botId: string;
  templateId: string;
  startTime: Date;
  endTime?: Date;
  currentPhase: number;
  exchanges: ConversationExchange[];
  performance: SessionPerformance;
  feedback: SessionFeedback;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

export interface ConversationExchange {
  id: string;
  timestamp: Date;
  speaker: 'user' | 'bot';
  content: string;
  audioUrl?: string;
  transcription?: string;
  confidence: number;
  analysis: UtteranceAnalysis;
  botResponse?: BotResponse;
}

export interface UtteranceAnalysis {
  grammar: GrammarAnalysis;
  pronunciation: PronunciationAnalysis;
  vocabulary: VocabularyAnalysis;
  fluency: FluencyAnalysis;
  appropriateness: AppropriatenessAnalysis;
  overallScore: number;
}

export interface GrammarAnalysis {
  correctness: number;
  complexity: number;
  errors: GrammarError[];
  suggestions: string[];
}

export interface GrammarError {
  type: string;
  position: number;
  incorrect: string;
  correct: string;
  explanation: string;
}

export interface PronunciationAnalysis {
  clarity: number;
  accuracy: number;
  stress: number;
  intonation: number;
  problematicSounds: string[];
  suggestions: string[];
}

export interface VocabularyAnalysis {
  appropriateness: number;
  variety: number;
  sophistication: number;
  contextualFit: number;
  suggestions: string[];
}

export interface FluencyAnalysis {
  speed: number;
  pausePatterns: number;
  hesitations: number;
  naturalness: number;
  confidence: number;
}

export interface AppropriatenessAnalysis {
  formality: number;
  politeness: number;
  culturalSensitivity: number;
  contextualFit: number;
  suggestions: string[];
}

export interface BotResponse {
  content: string;
  audioUrl?: string;
  responseType: string;
  confidence: number;
  processingTime: number;
  adaptations: ResponseAdaptation[];
}

export interface ResponseAdaptation {
  type: 'vocabulary_simplification' | 'grammar_adjustment' | 'pace_modification' | 'emotional_adjustment';
  originalContent: string;
  adaptedContent: string;
  reason: string;
}

export interface SessionPerformance {
  overallScore: number;
  grammarScore: number;
  pronunciationScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  participationLevel: number;
  objectivesCompleted: string[];
  improvementAreas: string[];
  strengths: string[];
}

export interface SessionFeedback {
  summary: string;
  detailedAnalysis: string[];
  specificSuggestions: string[];
  practiceRecommendations: string[];
  nextSessionFocus: string[];
  encouragementMessage: string;
  skillProgression: { [skill: string]: number };
}

export interface UserSpeakingProfile {
  userId: number;
  currentLevel: string;
  preferredAccent: string;
  conversationHistory: ConversationSession[];
  skillProgression: SpeakingSkillProgression;
  personalityPreferences: string[];
  practiceGoals: SpeakingGoal[];
  weaknessAreas: string[];
  strengthAreas: string[];
  confidenceLevel: number;
  totalPracticeTime: number;
  sessionsCompleted: number;
}

export interface SpeakingSkillProgression {
  pronunciation: SkillProgress;
  grammar: SkillProgress;
  vocabulary: SkillProgress;
  fluency: SkillProgress;
  confidence: SkillProgress;
  listening: SkillProgress;
}

export interface SkillProgress {
  currentLevel: number;
  progressRate: number;
  recentScores: number[];
  milestones: ProgressMilestone[];
  practiceTime: number;
  lastImprovement: Date;
}

export interface ProgressMilestone {
  level: number;
  achievedAt: Date;
  description: string;
  certificateEarned?: string;
}

export interface SpeakingGoal {
  id: string;
  title: string;
  description: string;
  targetSkill: string;
  currentProgress: number;
  targetProgress: number;
  deadline: Date;
  isActive: boolean;
}

export class SpeakingPartnerBotSystem {
  private bots: Map<string, SpeakingBot> = new Map();
  private conversationSessions: Map<string, ConversationSession> = new Map();
  private userProfiles: Map<number, UserSpeakingProfile> = new Map();
  private templates: Map<string, ConversationTemplate> = new Map();

  constructor() {
    this.initializeBots();
    this.initializeTemplates();
    this.initializeSampleProfiles();
  }

  private initializeBots(): void {
    const bots: SpeakingBot[] = [
      {
        id: 'friendly_waiter',
        name: 'Alex the Waiter',
        role: 'waiter',
        personality: 'Friendly, patient, and helpful restaurant server',
        avatar: 'waiter_avatar',
        voiceSettings: {
          accent: 'american',
          speed: 0.9,
          pitch: 1.0,
          volume: 0.8,
          voiceType: 'male',
          emotionalTone: 'friendly'
        },
        conversationTemplates: ['restaurant_ordering', 'table_service', 'bill_payment'],
        responsePatterns: [
          {
            trigger: 'greeting',
            responseType: 'progression',
            responses: [
              'Welcome to our restaurant! How can I help you today?',
              'Good evening! Table for how many?',
              'Hi there! Would you like to see our menu?'
            ],
            conditions: ['session_start'],
            followUpActions: ['present_menu', 'ask_party_size']
          },
          {
            trigger: 'unclear_order',
            responseType: 'clarification',
            responses: [
              'I\'m sorry, could you repeat that?',
              'Which dish would you like exactly?',
              'Let me make sure I understand correctly...'
            ],
            conditions: ['low_confidence'],
            followUpActions: ['repeat_options', 'provide_help']
          }
        ],
        vocabulary: {
          keyPhrases: [
            'Would you like to start with drinks?',
            'Are you ready to order?',
            'How would you like that cooked?',
            'Can I get you anything else?'
          ],
          synonyms: {
            'drink': ['beverage', 'something to drink'],
            'order': ['choose', 'select', 'have'],
            'check': ['bill', 'receipt', 'tab']
          },
          culturalExpressions: [
            {
              phrase: 'My pleasure',
              meaning: 'You\'re welcome (formal service)',
              usage: 'Response to thank you',
              formality: 'formal',
              region: 'American'
            }
          ],
          formalAlternatives: {
            'yeah': 'yes, certainly',
            'sure': 'of course',
            'nope': 'no, I\'m sorry'
          },
          corrections: [
            {
              incorrectPattern: 'I want to have',
              correctPattern: 'I would like',
              explanation: 'More polite way to order in restaurants',
              examples: ['I would like the chicken pasta', 'I would like a coffee, please']
            }
          ]
        },
        difficulty: 'beginner',
        context: {
          setting: 'Casual dining restaurant',
          timeOfDay: 'evening',
          purpose: 'Ordering food and drinks',
          culturalNotes: [
            'Tipping is customary in American restaurants',
            'It\'s polite to say please and thank you'
          ],
          etiquettePoints: [
            'Wait to be seated in formal restaurants',
            'Keep your voice at conversational level'
          ],
          backgroundInfo: 'A comfortable family restaurant with international cuisine'
        }
      },
      {
        id: 'english_teacher',
        name: 'Ms. Johnson',
        role: 'teacher',
        personality: 'Encouraging, knowledgeable, and patient educator',
        avatar: 'teacher_avatar',
        voiceSettings: {
          accent: 'british',
          speed: 0.8,
          pitch: 1.1,
          volume: 0.9,
          voiceType: 'female',
          emotionalTone: 'professional'
        },
        conversationTemplates: ['grammar_practice', 'vocabulary_expansion', 'pronunciation_training'],
        responsePatterns: [
          {
            trigger: 'grammar_mistake',
            responseType: 'correction',
            responses: [
              'Good try! Let me help you with that grammar point.',
              'Almost there! Remember to use the past tense.',
              'That\'s a common mistake. The correct form is...'
            ],
            conditions: ['learning_context'],
            followUpActions: ['provide_explanation', 'give_examples']
          }
        ],
        vocabulary: {
          keyPhrases: [
            'Let\'s practice this together',
            'Can you try that again?',
            'Excellent improvement!',
            'What do you think this means?'
          ],
          synonyms: {
            'practice': ['work on', 'rehearse', 'drill'],
            'mistake': ['error', 'slip', 'oversight'],
            'improve': ['get better', 'enhance', 'develop']
          },
          culturalExpressions: [
            {
              phrase: 'Well done!',
              meaning: 'Excellent work (British encouragement)',
              usage: 'Praising student achievement',
              formality: 'formal',
              region: 'British'
            }
          ],
          formalAlternatives: {
            'good job': 'excellent work',
            'ok': 'very well',
            'cool': 'wonderful'
          },
          corrections: []
        },
        difficulty: 'intermediate',
        context: {
          setting: 'English classroom',
          timeOfDay: 'morning',
          purpose: 'Language instruction and practice',
          culturalNotes: [
            'British educational etiquette is more formal',
            'Students typically raise hands to speak'
          ],
          etiquettePoints: [
            'Address teacher as Ms. or Mr.',
            'Ask permission before leaving seat'
          ],
          backgroundInfo: 'Experienced teacher with 10 years of ESL instruction'
        }
      },
      {
        id: 'casual_friend',
        name: 'Sarah',
        role: 'friend',
        personality: 'Relaxed, supportive, and fun conversation partner',
        avatar: 'friend_avatar',
        voiceSettings: {
          accent: 'american',
          speed: 1.1,
          pitch: 1.2,
          volume: 0.8,
          voiceType: 'female',
          emotionalTone: 'casual'
        },
        conversationTemplates: ['daily_chat', 'hobby_discussion', 'weekend_plans'],
        responsePatterns: [
          {
            trigger: 'casual_greeting',
            responseType: 'progression',
            responses: [
              'Hey! How\'s it going?',
              'What\'s up? How was your day?',
              'Hi there! What have you been up to?'
            ],
            conditions: ['casual_context'],
            followUpActions: ['ask_about_day', 'share_story']
          }
        ],
        vocabulary: {
          keyPhrases: [
            'That sounds awesome!',
            'No way, really?',
            'I totally get what you mean',
            'What do you think about...?'
          ],
          synonyms: {
            'cool': ['awesome', 'amazing', 'great'],
            'fun': ['enjoyable', 'entertaining', 'exciting'],
            'tired': ['exhausted', 'worn out', 'beat']
          },
          culturalExpressions: [
            {
              phrase: 'That\'s so cool!',
              meaning: 'Expression of enthusiasm (casual American)',
              usage: 'Showing interest and excitement',
              formality: 'casual',
              region: 'American'
            }
          ],
          formalAlternatives: {},
          corrections: []
        },
        difficulty: 'beginner',
        context: {
          setting: 'Coffee shop or casual meeting place',
          timeOfDay: 'afternoon',
          purpose: 'Friendly conversation and social interaction',
          culturalNotes: [
            'American casual conversation is informal',
            'Friends often interrupt each other playfully'
          ],
          etiquettePoints: [
            'Eye contact shows interest',
            'Sharing personal stories builds friendship'
          ],
          backgroundInfo: 'College student who loves movies, music, and travel'
        }
      }
    ];

    bots.forEach(bot => {
      this.bots.set(bot.id, bot);
    });
  }

  private initializeTemplates(): void {
    const templates: ConversationTemplate[] = [
      {
        id: 'restaurant_ordering',
        scenario: 'Ordering food at a restaurant',
        objective: 'Successfully order a meal and interact with waiter',
        estimatedDuration: 300, // 5 minutes
        phases: [
          {
            phaseNumber: 1,
            name: 'Greeting and Seating',
            description: 'Initial interaction with waiter',
            botPrompts: [
              'Welcome to our restaurant! How can I help you today?',
              'Table for how many people?'
            ],
            expectedUserResponses: [
              'Table for two, please',
              'Just one person',
              'We have a reservation'
            ],
            transitionTriggers: ['table_request', 'reservation_mention'],
            helpHints: [
              'Try: "Table for [number], please"',
              'You can mention if you have a reservation'
            ],
            maxAttempts: 3
          },
          {
            phaseNumber: 2,
            name: 'Menu and Ordering',
            description: 'Looking at menu and placing order',
            botPrompts: [
              'Here\'s your menu. Can I start you with something to drink?',
              'Are you ready to order?',
              'What would you like to have today?'
            ],
            expectedUserResponses: [
              'I\'ll have the chicken pasta',
              'Could I get a coffee?',
              'What do you recommend?'
            ],
            transitionTriggers: ['drink_order', 'food_order', 'recommendation_request'],
            helpHints: [
              'Try: "I would like..." or "Could I have..."',
              'Ask for recommendations: "What do you recommend?"'
            ],
            maxAttempts: 3
          },
          {
            phaseNumber: 3,
            name: 'Payment and Farewell',
            description: 'Asking for check and saying goodbye',
            botPrompts: [
              'How was everything?',
              'Would you like the check?',
              'Thank you for dining with us!'
            ],
            expectedUserResponses: [
              'Everything was delicious',
              'Could I have the check, please?',
              'Thank you!'
            ],
            transitionTriggers: ['check_request', 'farewell'],
            helpHints: [
              'Ask politely: "Could I have the check, please?"',
              'Don\'t forget to say thank you!'
            ],
            maxAttempts: 2
          }
        ],
        successCriteria: [
          'Successfully request a table',
          'Order at least one item',
          'Ask for the check politely',
          'Use appropriate politeness markers (please, thank you)'
        ],
        commonMistakes: [
          'Forgetting to say "please"',
          'Using "I want" instead of "I would like"',
          'Not making eye contact (in real situations)'
        ],
        targetVocabulary: [
          'table', 'menu', 'order', 'check', 'bill', 'recommendation',
          'delicious', 'spicy', 'medium rare', 'to go', 'for here'
        ]
      },
      {
        id: 'daily_chat',
        scenario: 'Casual conversation with a friend',
        objective: 'Have a natural, flowing conversation about daily life',
        estimatedDuration: 240,
        phases: [
          {
            phaseNumber: 1,
            name: 'Greeting and Check-in',
            description: 'Initial greeting and asking about each other',
            botPrompts: [
              'Hey! How\'s it going?',
              'What\'s up? How was your day?'
            ],
            expectedUserResponses: [
              'Pretty good, thanks!',
              'Not bad, how about you?',
              'It was okay, kind of busy'
            ],
            transitionTriggers: ['day_description', 'reciprocal_question'],
            helpHints: [
              'Try: "Pretty good, thanks! How about you?"',
              'Share something about your day'
            ],
            maxAttempts: 3
          },
          {
            phaseNumber: 2,
            name: 'Topic Development',
            description: 'Discussing specific topics or activities',
            botPrompts: [
              'That sounds interesting! Tell me more',
              'What did you do this weekend?',
              'Have you seen any good movies lately?'
            ],
            expectedUserResponses: [
              'I went to the park',
              'I watched a really good movie',
              'Not much, just relaxed at home'
            ],
            transitionTriggers: ['activity_sharing', 'opinion_expression'],
            helpHints: [
              'Share activities: "I went to..." "I watched..."',
              'Express opinions: "It was really good" "I loved it"'
            ],
            maxAttempts: 4
          }
        ],
        successCriteria: [
          'Maintain natural conversation flow',
          'Ask follow-up questions',
          'Share personal experiences',
          'Use casual expressions appropriately'
        ],
        commonMistakes: [
          'Being too formal in casual conversation',
          'Not asking follow-up questions',
          'Using overly complex vocabulary'
        ],
        targetVocabulary: [
          'awesome', 'cool', 'pretty good', 'not bad', 'totally',
          'hang out', 'chill', 'catch up', 'what\'s up', 'no way'
        ]
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeSampleProfiles(): void {
    const sampleProfile: UserSpeakingProfile = {
      userId: 1,
      currentLevel: 'intermediate',
      preferredAccent: 'american',
      conversationHistory: [],
      skillProgression: {
        pronunciation: {
          currentLevel: 72,
          progressRate: 1.2,
          recentScores: [68, 70, 72, 75, 72],
          milestones: [
            {
              level: 70,
              achievedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              description: 'Clear pronunciation milestone',
              certificateEarned: 'pronunciation_clarity'
            }
          ],
          practiceTime: 180,
          lastImprovement: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        grammar: {
          currentLevel: 65,
          progressRate: 0.8,
          recentScores: [62, 65, 63, 67, 65],
          milestones: [],
          practiceTime: 220,
          lastImprovement: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        vocabulary: {
          currentLevel: 78,
          progressRate: 1.5,
          recentScores: [75, 77, 78, 80, 78],
          milestones: [
            {
              level: 75,
              achievedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              description: 'Advanced vocabulary milestone'
            }
          ],
          practiceTime: 150,
          lastImprovement: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        fluency: {
          currentLevel: 68,
          progressRate: 1.0,
          recentScores: [65, 67, 68, 70, 68],
          milestones: [],
          practiceTime: 200,
          lastImprovement: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        confidence: {
          currentLevel: 60,
          progressRate: 0.5,
          recentScores: [58, 59, 60, 62, 60],
          milestones: [],
          practiceTime: 100,
          lastImprovement: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        listening: {
          currentLevel: 75,
          progressRate: 1.1,
          recentScores: [72, 74, 75, 77, 75],
          milestones: [],
          practiceTime: 140,
          lastImprovement: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      personalityPreferences: ['friendly', 'patient', 'encouraging'],
      practiceGoals: [
        {
          id: 'confidence_goal',
          title: 'Build Speaking Confidence',
          description: 'Increase confidence level to 75',
          targetSkill: 'confidence',
          currentProgress: 60,
          targetProgress: 75,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true
        }
      ],
      weaknessAreas: ['grammar', 'confidence'],
      strengthAreas: ['vocabulary', 'listening'],
      confidenceLevel: 60,
      totalPracticeTime: 850,
      sessionsCompleted: 15
    };

    this.userProfiles.set(1, sampleProfile);
  }

  // Conversation management
  startConversation(
    userId: number,
    botId: string,
    templateId: string
  ): ConversationSession {
    const bot = this.bots.get(botId);
    const template = this.templates.get(templateId);
    
    if (!bot || !template) {
      throw new Error('Bot or template not found');
    }

    const sessionId = `conversation_${Date.now()}_${userId}`;
    const session: ConversationSession = {
      id: sessionId,
      userId,
      botId,
      templateId,
      startTime: new Date(),
      currentPhase: 1,
      exchanges: [],
      performance: {
        overallScore: 0,
        grammarScore: 0,
        pronunciationScore: 0,
        vocabularyScore: 0,
        fluencyScore: 0,
        participationLevel: 0,
        objectivesCompleted: [],
        improvementAreas: [],
        strengths: []
      },
      feedback: {
        summary: '',
        detailedAnalysis: [],
        specificSuggestions: [],
        practiceRecommendations: [],
        nextSessionFocus: [],
        encouragementMessage: '',
        skillProgression: {}
      },
      status: 'active'
    };

    this.conversationSessions.set(sessionId, session);

    // Generate initial bot greeting
    this.generateBotResponse(session, 'session_start');

    return session;
  }

  processUserInput(
    sessionId: string,
    userInput: string,
    audioData?: string
  ): ConversationExchange {
    const session = this.conversationSessions.get(sessionId);
    if (!session) {
      throw new Error('Conversation session not found');
    }

    const exchangeId = `exchange_${Date.now()}`;
    const analysis = this.analyzeUserUtterance(userInput, session);
    
    const exchange: ConversationExchange = {
      id: exchangeId,
      timestamp: new Date(),
      speaker: 'user',
      content: userInput,
      audioUrl: audioData,
      transcription: userInput,
      confidence: analysis.overallScore / 100,
      analysis,
      botResponse: undefined
    };

    session.exchanges.push(exchange);

    // Generate bot response
    const botResponse = this.generateBotResponse(session, 'user_input', userInput);
    exchange.botResponse = botResponse;

    // Update session performance
    this.updateSessionPerformance(session, analysis);

    return exchange;
  }

  private analyzeUserUtterance(userInput: string, session: ConversationSession): UtteranceAnalysis {
    const bot = this.bots.get(session.botId)!;
    const template = this.templates.get(session.templateId)!;
    
    // Simplified analysis - in a real implementation, this would use NLP services
    const grammarAnalysis: GrammarAnalysis = {
      correctness: this.analyzeGrammar(userInput),
      complexity: this.analyzeComplexity(userInput),
      errors: this.identifyGrammarErrors(userInput, bot.vocabulary.corrections),
      suggestions: []
    };

    const pronunciationAnalysis: PronunciationAnalysis = {
      clarity: 85, // Would be calculated from audio analysis
      accuracy: 80,
      stress: 75,
      intonation: 78,
      problematicSounds: [],
      suggestions: []
    };

    const vocabularyAnalysis: VocabularyAnalysis = {
      appropriateness: this.analyzeVocabularyAppropriateneness(userInput, bot.vocabulary),
      variety: this.analyzeVocabularyVariety(userInput),
      sophistication: this.analyzeVocabularySophistication(userInput),
      contextualFit: this.analyzeContextualFit(userInput, bot.context),
      suggestions: []
    };

    const fluencyAnalysis: FluencyAnalysis = {
      speed: 75, // Would be calculated from audio timing
      pausePatterns: 80,
      hesitations: 85,
      naturalness: 78,
      confidence: 70
    };

    const appropriatenessAnalysis: AppropriatenessAnalysis = {
      formality: this.analyzeFormalityLevel(userInput, bot.context),
      politeness: this.analyzePoliteness(userInput),
      culturalSensitivity: 90,
      contextualFit: vocabularyAnalysis.contextualFit,
      suggestions: []
    };

    const overallScore = (
      grammarAnalysis.correctness * 0.25 +
      pronunciationAnalysis.clarity * 0.2 +
      vocabularyAnalysis.appropriateness * 0.2 +
      fluencyAnalysis.naturalness * 0.2 +
      appropriatenessAnalysis.contextualFit * 0.15
    );

    return {
      grammar: grammarAnalysis,
      pronunciation: pronunciationAnalysis,
      vocabulary: vocabularyAnalysis,
      fluency: fluencyAnalysis,
      appropriateness: appropriatenessAnalysis,
      overallScore
    };
  }

  private analyzeGrammar(input: string): number {
    // Simplified grammar analysis
    const commonErrors = [
      { pattern: /\bi want\b/gi, penalty: 5 },
      { pattern: /\bcan you\b/gi, penalty: 3 },
      { pattern: /\bgoed\b/gi, penalty: 10 },
      { pattern: /\bdoed\b/gi, penalty: 10 }
    ];

    let score = 100;
    commonErrors.forEach(error => {
      const matches = input.match(error.pattern);
      if (matches) {
        score -= error.penalty * matches.length;
      }
    });

    return Math.max(0, score);
  }

  private analyzeComplexity(input: string): number {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim());
    const words = input.split(/\s+/).filter(w => w.trim());
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    
    // Complexity based on sentence length and structure
    if (avgWordsPerSentence > 12) return 90;
    if (avgWordsPerSentence > 8) return 70;
    if (avgWordsPerSentence > 5) return 50;
    return 30;
  }

  private identifyGrammarErrors(input: string, corrections: GrammarCorrection[]): GrammarError[] {
    const errors: GrammarError[] = [];
    
    corrections.forEach(correction => {
      const regex = new RegExp(correction.incorrectPattern, 'gi');
      const matches = input.match(regex);
      if (matches) {
        matches.forEach(match => {
          errors.push({
            type: 'grammar',
            position: input.indexOf(match),
            incorrect: match,
            correct: correction.correctPattern,
            explanation: correction.explanation
          });
        });
      }
    });

    return errors;
  }

  private analyzeVocabularyAppropriateneness(input: string, vocabulary: BotVocabulary): number {
    const words = input.toLowerCase().split(/\s+/);
    let appropriateWords = 0;
    
    words.forEach(word => {
      if (vocabulary.keyPhrases.some(phrase => phrase.toLowerCase().includes(word)) ||
          Object.keys(vocabulary.synonyms).includes(word)) {
        appropriateWords++;
      }
    });

    return Math.min(100, (appropriateWords / words.length) * 100 + 50);
  }

  private analyzeVocabularyVariety(input: string): number {
    const words = input.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const uniqueWords = new Set(words);
    return Math.min(100, (uniqueWords.size / words.length) * 100);
  }

  private analyzeVocabularySophistication(input: string): number {
    const sophisticatedWords = [
      'consequently', 'furthermore', 'nevertheless', 'appreciate',
      'recommend', 'particular', 'extraordinary', 'magnificent'
    ];
    
    const words = input.toLowerCase().split(/\s+/);
    const sophisticatedCount = words.filter(word => 
      sophisticatedWords.includes(word) || word.length > 8
    ).length;

    return Math.min(100, (sophisticatedCount / words.length) * 200);
  }

  private analyzeContextualFit(input: string, context: ConversationContext): number {
    // Analyze if the response fits the conversation context
    const contextKeywords = context.setting.toLowerCase().split(/\s+/);
    const inputWords = input.toLowerCase().split(/\s+/);
    
    const matchingWords = inputWords.filter(word => 
      contextKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
    );

    return Math.min(100, (matchingWords.length / inputWords.length) * 300 + 50);
  }

  private analyzeFormalityLevel(input: string, context: ConversationContext): number {
    const formalMarkers = ['please', 'thank you', 'would', 'could', 'may i'];
    const informalMarkers = ['yeah', 'cool', 'awesome', 'hey', 'what\'s up'];
    
    const formalCount = formalMarkers.filter(marker => 
      input.toLowerCase().includes(marker)
    ).length;
    
    const informalCount = informalMarkers.filter(marker => 
      input.toLowerCase().includes(marker)
    ).length;

    // Expected formality based on context
    const expectedFormality = context.setting.includes('restaurant') || 
                            context.setting.includes('classroom') ? 80 : 40;
    
    const actualFormality = formalCount > informalCount ? 80 : 40;
    
    return 100 - Math.abs(expectedFormality - actualFormality);
  }

  private analyzePoliteness(input: string): number {
    const politeMarkers = ['please', 'thank you', 'excuse me', 'sorry', 'may i'];
    const politeCount = politeMarkers.filter(marker => 
      input.toLowerCase().includes(marker)
    ).length;

    return Math.min(100, politeCount * 30 + 40);
  }

  private generateBotResponse(
    session: ConversationSession,
    trigger: string,
    userInput?: string
  ): BotResponse {
    const bot = this.bots.get(session.botId)!;
    const template = this.templates.get(session.templateId)!;
    
    let responseContent = '';
    let responseType = 'progression';
    
    if (trigger === 'session_start') {
      const phase = template.phases[0];
      responseContent = phase.botPrompts[0];
      responseType = 'greeting';
    } else if (userInput) {
      // Find appropriate response based on patterns and context
      const matchingPattern = bot.responsePatterns.find(pattern => 
        this.matchesPattern(userInput, pattern.trigger)
      );
      
      if (matchingPattern) {
        responseContent = this.selectRandomResponse(matchingPattern.responses);
        responseType = matchingPattern.responseType;
      } else {
        // Default progression response
        const currentPhase = template.phases[session.currentPhase - 1];
        if (currentPhase && currentPhase.botPrompts.length > 1) {
          responseContent = currentPhase.botPrompts[1];
        } else {
          responseContent = 'That\'s interesting! Tell me more.';
        }
      }
    }

    // Create bot exchange
    const botExchange: ConversationExchange = {
      id: `bot_${Date.now()}`,
      timestamp: new Date(),
      speaker: 'bot',
      content: responseContent,
      confidence: 0.9,
      analysis: {
        grammar: { correctness: 100, complexity: 70, errors: [], suggestions: [] },
        pronunciation: { clarity: 95, accuracy: 95, stress: 90, intonation: 90, problematicSounds: [], suggestions: [] },
        vocabulary: { appropriateness: 95, variety: 80, sophistication: 75, contextualFit: 90, suggestions: [] },
        fluency: { speed: 85, pausePatterns: 90, hesitations: 95, naturalness: 90, confidence: 95 },
        appropriateness: { formality: 85, politeness: 90, culturalSensitivity: 95, contextualFit: 90, suggestions: [] },
        overallScore: 90
      }
    };

    session.exchanges.push(botExchange);

    return {
      content: responseContent,
      responseType,
      confidence: 0.9,
      processingTime: 100,
      adaptations: []
    };
  }

  private matchesPattern(input: string, trigger: string): boolean {
    // Simple pattern matching - in real implementation would be more sophisticated
    const keywords = trigger.split('_');
    return keywords.some(keyword => 
      input.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private selectRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private updateSessionPerformance(session: ConversationSession, analysis: UtteranceAnalysis): void {
    const exchanges = session.exchanges.filter(e => e.speaker === 'user');
    const count = exchanges.length;
    
    if (count === 0) return;

    // Update running averages
    session.performance.grammarScore = this.updateAverage(session.performance.grammarScore, analysis.grammar.correctness, count);
    session.performance.pronunciationScore = this.updateAverage(session.performance.pronunciationScore, analysis.pronunciation.clarity, count);
    session.performance.vocabularyScore = this.updateAverage(session.performance.vocabularyScore, analysis.vocabulary.appropriateness, count);
    session.performance.fluencyScore = this.updateAverage(session.performance.fluencyScore, analysis.fluency.naturalness, count);
    session.performance.overallScore = this.updateAverage(session.performance.overallScore, analysis.overallScore, count);
    
    session.performance.participationLevel = Math.min(100, count * 10);
  }

  private updateAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count;
  }

  // Public methods
  getAvailableBots(difficulty?: string): SpeakingBot[] {
    const bots = Array.from(this.bots.values());
    if (difficulty) {
      return bots.filter(bot => bot.difficulty === difficulty);
    }
    return bots;
  }

  getBotById(botId: string): SpeakingBot | undefined {
    return this.bots.get(botId);
  }

  getConversationTemplates(role?: string): ConversationTemplate[] {
    const templates = Array.from(this.templates.values());
    if (role) {
      return templates.filter(template => {
        const bot = Array.from(this.bots.values()).find(b => 
          b.conversationTemplates.includes(template.id) && b.role === role
        );
        return !!bot;
      });
    }
    return templates;
  }

  getConversationSession(sessionId: string): ConversationSession | undefined {
    return this.conversationSessions.get(sessionId);
  }

  getUserSpeakingProfile(userId: number): UserSpeakingProfile | undefined {
    return this.userProfiles.get(userId);
  }

  endConversation(sessionId: string): SessionFeedback {
    const session = this.conversationSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.endTime = new Date();
    session.status = 'completed';

    // Generate comprehensive feedback
    const feedback = this.generateSessionFeedback(session);
    session.feedback = feedback;

    // Update user profile
    this.updateUserProfile(session);

    return feedback;
  }

  private generateSessionFeedback(session: ConversationSession): SessionFeedback {
    const performance = session.performance;
    
    const summary = `Great conversation! You scored ${performance.overallScore.toFixed(1)} overall. 
      Your strongest area was vocabulary (${performance.vocabularyScore.toFixed(1)}) and 
      you can improve on grammar (${performance.grammarScore.toFixed(1)}).`;

    const detailedAnalysis = [
      `Grammar: ${performance.grammarScore.toFixed(1)}/100 - ${this.getPerformanceComment(performance.grammarScore)}`,
      `Pronunciation: ${performance.pronunciationScore.toFixed(1)}/100 - ${this.getPerformanceComment(performance.pronunciationScore)}`,
      `Vocabulary: ${performance.vocabularyScore.toFixed(1)}/100 - ${this.getPerformanceComment(performance.vocabularyScore)}`,
      `Fluency: ${performance.fluencyScore.toFixed(1)}/100 - ${this.getPerformanceComment(performance.fluencyScore)}`
    ];

    const specificSuggestions = this.generateSpecificSuggestions(performance);
    const practiceRecommendations = this.generatePracticeRecommendations(performance);

    return {
      summary,
      detailedAnalysis,
      specificSuggestions,
      practiceRecommendations,
      nextSessionFocus: performance.improvementAreas,
      encouragementMessage: this.generateEncouragementMessage(performance),
      skillProgression: {
        grammar: performance.grammarScore,
        pronunciation: performance.pronunciationScore,
        vocabulary: performance.vocabularyScore,
        fluency: performance.fluencyScore
      }
    };
  }

  private getPerformanceComment(score: number): string {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Very good';
    if (score >= 70) return 'Good progress';
    if (score >= 60) return 'Keep practicing';
    return 'Needs improvement';
  }

  private generateSpecificSuggestions(performance: SessionPerformance): string[] {
    const suggestions: string[] = [];
    
    if (performance.grammarScore < 70) {
      suggestions.push('Focus on sentence structure and verb tenses');
      suggestions.push('Practice using "would like" instead of "want" in polite requests');
    }
    
    if (performance.pronunciationScore < 70) {
      suggestions.push('Work on clear pronunciation of consonant sounds');
      suggestions.push('Practice word stress patterns');
    }
    
    if (performance.vocabularyScore < 70) {
      suggestions.push('Learn more context-appropriate vocabulary');
      suggestions.push('Practice using synonyms for common words');
    }
    
    if (performance.fluencyScore < 70) {
      suggestions.push('Practice speaking at a steady pace');
      suggestions.push('Reduce hesitations by preparing common phrases');
    }

    return suggestions;
  }

  private generatePracticeRecommendations(performance: SessionPerformance): string[] {
    const recommendations: string[] = [];
    
    const weakestSkill = this.findWeakestSkill(performance);
    
    switch (weakestSkill) {
      case 'grammar':
        recommendations.push('Complete grammar exercises on past tense');
        recommendations.push('Practice role-play scenarios with polite language');
        break;
      case 'pronunciation':
        recommendations.push('Use pronunciation practice tools');
        recommendations.push('Record yourself speaking and compare with native speakers');
        break;
      case 'vocabulary':
        recommendations.push('Learn 5 new words daily in your target context');
        recommendations.push('Practice using new vocabulary in sentences');
        break;
      case 'fluency':
        recommendations.push('Practice speaking for 2 minutes without stopping');
        recommendations.push('Read aloud to improve rhythm and flow');
        break;
    }

    return recommendations;
  }

  private findWeakestSkill(performance: SessionPerformance): string {
    const skills = {
      grammar: performance.grammarScore,
      pronunciation: performance.pronunciationScore,
      vocabulary: performance.vocabularyScore,
      fluency: performance.fluencyScore
    };

    return Object.entries(skills).reduce((weakest, [skill, score]) => 
      score < skills[weakest] ? skill : weakest
    );
  }

  private generateEncouragementMessage(performance: SessionPerformance): string {
    if (performance.overallScore >= 85) {
      return 'Outstanding performance! You\'re speaking with great confidence and skill.';
    } else if (performance.overallScore >= 70) {
      return 'Great job! You\'re making excellent progress in your speaking skills.';
    } else if (performance.overallScore >= 55) {
      return 'Good effort! Keep practicing and you\'ll see continued improvement.';
    } else {
      return 'Don\'t give up! Every conversation is a step forward in your learning journey.';
    }
  }

  private updateUserProfile(session: ConversationSession): void {
    const profile = this.userProfiles.get(session.userId);
    if (!profile) return;

    profile.conversationHistory.push(session);
    profile.sessionsCompleted += 1;
    
    const sessionDuration = session.endTime!.getTime() - session.startTime.getTime();
    profile.totalPracticeTime += Math.floor(sessionDuration / 1000 / 60); // Convert to minutes

    // Update skill progression
    this.updateSkillProgression(profile, session.performance);
  }

  private updateSkillProgression(profile: UserSpeakingProfile, performance: SessionPerformance): void {
    const skills = ['pronunciation', 'grammar', 'vocabulary', 'fluency'] as const;
    
    skills.forEach(skill => {
      const skillData = profile.skillProgression[skill];
      const newScore = performance[`${skill}Score` as keyof SessionPerformance] as number;
      
      skillData.recentScores.push(newScore);
      if (skillData.recentScores.length > 10) {
        skillData.recentScores.shift();
      }
      
      // Update current level (weighted average)
      skillData.currentLevel = Math.round(
        (skillData.currentLevel * 0.8) + (newScore * 0.2)
      );
      
      // Update progress rate
      if (skillData.recentScores.length >= 2) {
        const recent = skillData.recentScores.slice(-3);
        const trend = recent[recent.length - 1] - recent[0];
        skillData.progressRate = trend / recent.length;
      }
      
      skillData.lastImprovement = new Date();
    });
  }
}

export const speakingPartnerBotSystem = new SpeakingPartnerBotSystem();