// Advanced speaking practice with shadowing and conversation simulation
export interface SpeakingExercise {
  id: string;
  title: string;
  type: 'shadowing' | 'presentation' | 'debate' | 'conversation' | 'monologue';
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  accent: 'american' | 'british' | 'australian' | 'canadian';
  audioUrl?: string;
  transcript: string;
  duration: number; // in seconds
  instructions: string[];
  goals: string[];
  keyPhrases: string[];
}

export interface ShadowingExercise extends SpeakingExercise {
  type: 'shadowing';
  pausePoints: number[]; // timestamps where learner should pause
  speedVariations: number[]; // different playback speeds to practice
  focusAreas: ('pronunciation' | 'intonation' | 'rhythm' | 'stress')[];
}

export interface PresentationExercise extends SpeakingExercise {
  type: 'presentation';
  slideTopics: string[];
  timeLimit: number;
  evaluationCriteria: string[];
  audience: 'formal' | 'informal' | 'academic' | 'business';
}

export interface DebateExercise extends SpeakingExercise {
  type: 'debate';
  position: 'for' | 'against' | 'neutral';
  arguments: string[];
  counterArguments: string[];
  evidence: string[];
  timePerRound: number;
}

export interface SpeakingSession {
  id: string;
  userId: number;
  exerciseId: string;
  startTime: Date;
  endTime?: Date;
  recordings: AudioRecording[];
  feedback: SpeakingFeedback[];
  metrics: SpeakingMetrics;
  selfAssessment?: SelfAssessment;
}

export interface AudioRecording {
  id: string;
  segment: 'warmup' | 'practice' | 'performance' | 'reflection';
  duration: number;
  quality: 'good' | 'fair' | 'poor';
  timestamp: Date;
}

export interface SpeakingFeedback {
  category: 'fluency' | 'pronunciation' | 'grammar' | 'vocabulary' | 'confidence';
  score: number; // 1-10
  comments: string[];
  improvements: string[];
  strengths: string[];
}

export interface SpeakingMetrics {
  wordsPerMinute: number;
  pauseFrequency: number;
  fillerWordsCount: number;
  volumeConsistency: number;
  pronunciationAccuracy: number;
  grammarAccuracy: number;
  vocabularyVariety: number;
}

export interface SelfAssessment {
  confidence: number; // 1-10
  difficulty: number; // 1-10
  satisfaction: number; // 1-10
  areasForImprovement: string[];
  nextGoals: string[];
}

export interface ConversationSimulation {
  id: string;
  scenario: string;
  participants: ConversationParticipant[];
  turns: ConversationTurn[];
  culturalContext: string[];
  languageGoals: string[];
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: string;
  personality: string;
  accent: string;
  speakingStyle: 'formal' | 'casual' | 'enthusiastic' | 'reserved';
}

export interface ConversationTurn {
  participantId: string;
  text: string;
  audioUrl?: string;
  emotion: string;
  responseOptions?: string[];
  culturalNotes?: string[];
}

export class SpeakingPracticeSystem {
  private exercises: Map<string, SpeakingExercise> = new Map();
  private sessions: Map<string, SpeakingSession> = new Map();
  private conversations: Map<string, ConversationSimulation> = new Map();

  constructor() {
    this.initializeExercises();
    this.initializeConversations();
  }

  private initializeExercises(): void {
    const exercises: SpeakingExercise[] = [
      {
        id: 'shadow-news-american',
        title: 'Shadow News Broadcast',
        type: 'shadowing',
        level: 'intermediate',
        topic: 'current events',
        accent: 'american',
        transcript: `Good evening, I'm reporting live from the International Climate Summit where world leaders have gathered to discuss unprecedented environmental challenges. Today's sessions focused on renewable energy initiatives and carbon reduction strategies that could reshape global policy for decades to come.`,
        duration: 45,
        instructions: [
          'Listen to the audio clip first without speaking',
          'Practice shadowing at 0.8x speed to build confidence',
          'Gradually increase speed to match native pace',
          'Focus on stress patterns and intonation'
        ],
        goals: [
          'Improve pronunciation of complex vocabulary',
          'Practice natural rhythm and flow',
          'Develop news reporting tone'
        ],
        keyPhrases: ['unprecedented challenges', 'renewable energy initiatives', 'carbon reduction strategies'],
        pausePoints: [15, 30],
        speedVariations: [0.7, 0.8, 0.9, 1.0, 1.1],
        focusAreas: ['pronunciation', 'intonation', 'stress']
      } as ShadowingExercise,
      {
        id: 'presentation-business',
        title: 'Business Proposal Presentation',
        type: 'presentation',
        level: 'advanced',
        topic: 'business strategy',
        accent: 'british',
        transcript: 'Template for presenting quarterly results and future projections',
        duration: 300,
        instructions: [
          'Prepare 3-4 main points about your proposal',
          'Use professional language and clear structure',
          'Include data and evidence to support claims',
          'Practice confident body language'
        ],
        goals: [
          'Develop professional presentation skills',
          'Build confidence in formal speaking',
          'Practice persuasive language'
        ],
        keyPhrases: ['market analysis', 'projected growth', 'competitive advantage'],
        slideTopics: ['Market Overview', 'Proposal Details', 'Expected Outcomes', 'Next Steps'],
        timeLimit: 300,
        evaluationCriteria: ['Clarity', 'Organization', 'Persuasiveness', 'Professional Delivery'],
        audience: 'business'
      } as PresentationExercise,
      {
        id: 'debate-education',
        title: 'Education Technology Debate',
        type: 'debate',
        level: 'advanced',
        topic: 'technology in education',
        accent: 'american',
        transcript: 'Structured debate on the benefits and drawbacks of technology in classrooms',
        duration: 600,
        instructions: [
          'Research both sides of the argument',
          'Prepare opening statement (2 minutes)',
          'Practice rebuttal techniques',
          'Use evidence to support your position'
        ],
        goals: [
          'Develop critical thinking skills',
          'Practice formal debate structure',
          'Build argumentative vocabulary'
        ],
        keyPhrases: ['digital divide', 'educational equity', 'learning outcomes'],
        position: 'for',
        arguments: [
          'Technology enhances interactive learning',
          'Digital tools prepare students for modern workforce',
          'Online resources provide unlimited access to information'
        ],
        counterArguments: [
          'Screen time may affect concentration',
          'Technology can create distractions',
          'Not all students have equal access to devices'
        ],
        evidence: [
          'Studies showing improved engagement with interactive tools',
          'Employment statistics for digitally literate workers',
          'Research on educational app effectiveness'
        ],
        timePerRound: 120
      } as DebateExercise
    ];

    exercises.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
  }

  private initializeConversations(): void {
    const conversations: ConversationSimulation[] = [
      {
        id: 'restaurant-ordering',
        scenario: 'Ordering food at a restaurant',
        participants: [
          {
            id: 'waiter',
            name: 'Alex',
            role: 'Server',
            personality: 'Friendly and helpful',
            accent: 'american',
            speakingStyle: 'casual'
          },
          {
            id: 'customer',
            name: 'You',
            role: 'Customer',
            personality: 'Polite and curious',
            accent: 'learner',
            speakingStyle: 'formal'
          }
        ],
        turns: [
          {
            participantId: 'waiter',
            text: 'Good evening! Welcome to Bella Vista. My name is Alex, and I\'ll be your server tonight. Can I start you off with something to drink?',
            emotion: 'welcoming',
            responseOptions: [
              'I\'d like some water, please.',
              'Could I see the wine menu?',
              'What do you recommend?'
            ],
            culturalNotes: ['Servers often introduce themselves in American restaurants', 'Tipping 18-20% is expected']
          },
          {
            participantId: 'customer',
            text: 'I\'d like some water, please. Could you also tell me about today\'s specials?',
            emotion: 'polite'
          },
          {
            participantId: 'waiter',
            text: 'Of course! Tonight we have pan-seared salmon with lemon herb butter, served with roasted vegetables and wild rice. We also have a vegetarian pasta primavera with seasonal vegetables in a light cream sauce.',
            emotion: 'informative',
            culturalNotes: ['Specials are often prepared fresh and may run out', 'Asking about ingredients shows cultural awareness']
          }
        ],
        culturalContext: [
          'American dining etiquette emphasizes politeness and clear communication',
          'Servers rely on tips, so being courteous is important',
          'It\'s common to ask questions about menu items'
        ],
        languageGoals: [
          'Practice restaurant vocabulary',
          'Learn polite request forms',
          'Understand food descriptions'
        ]
      },
      {
        id: 'job-interview',
        scenario: 'Professional job interview',
        participants: [
          {
            id: 'interviewer',
            name: 'Sarah Chen',
            role: 'Hiring Manager',
            personality: 'Professional and thorough',
            accent: 'canadian',
            speakingStyle: 'formal'
          },
          {
            id: 'candidate',
            name: 'You',
            role: 'Job Candidate',
            personality: 'Confident and prepared',
            accent: 'learner',
            speakingStyle: 'formal'
          }
        ],
        turns: [
          {
            participantId: 'interviewer',
            text: 'Thank you for coming in today. I\'ve reviewed your resume, and I\'m impressed with your background. Could you start by telling me a bit about yourself and why you\'re interested in this position?',
            emotion: 'professional',
            responseOptions: [
              'I have five years of experience in...',
              'What attracted me to this role is...',
              'My background in... makes me a good fit because...'
            ],
            culturalNotes: ['Maintain eye contact', 'Prepare a 2-3 minute elevator pitch', 'Connect your experience to the job requirements']
          }
        ],
        culturalContext: [
          'North American interviews value confidence and specific examples',
          'STAR method (Situation, Task, Action, Result) is effective for answering behavioral questions',
          'Asking thoughtful questions shows genuine interest'
        ],
        languageGoals: [
          'Practice professional vocabulary',
          'Learn interview question patterns',
          'Develop confident speaking tone'
        ]
      }
    ];

    conversations.forEach(conversation => {
      this.conversations.set(conversation.id, conversation);
    });
  }

  getExercises(type?: string, level?: string, accent?: string): SpeakingExercise[] {
    let filtered = Array.from(this.exercises.values());
    
    if (type) {
      filtered = filtered.filter(e => e.type === type);
    }
    
    if (level) {
      filtered = filtered.filter(e => e.level === level);
    }
    
    if (accent) {
      filtered = filtered.filter(e => e.accent === accent);
    }
    
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  getExercise(id: string): SpeakingExercise | undefined {
    return this.exercises.get(id);
  }

  getConversations(): ConversationSimulation[] {
    return Array.from(this.conversations.values());
  }

  getConversation(id: string): ConversationSimulation | undefined {
    return this.conversations.get(id);
  }

  startSpeakingSession(userId: number, exerciseId: string): SpeakingSession {
    const sessionId = `speaking-${Date.now()}-${userId}`;
    const session: SpeakingSession = {
      id: sessionId,
      userId,
      exerciseId,
      startTime: new Date(),
      recordings: [],
      feedback: [],
      metrics: {
        wordsPerMinute: 0,
        pauseFrequency: 0,
        fillerWordsCount: 0,
        volumeConsistency: 0,
        pronunciationAccuracy: 0,
        grammarAccuracy: 0,
        vocabularyVariety: 0
      }
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  recordAudio(sessionId: string, segment: string, duration: number): AudioRecording | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const recording: AudioRecording = {
      id: `recording-${Date.now()}`,
      segment: segment as any,
      duration,
      quality: this.assessRecordingQuality(duration),
      timestamp: new Date()
    };

    session.recordings.push(recording);
    return recording;
  }

  private assessRecordingQuality(duration: number): 'good' | 'fair' | 'poor' {
    // Simple quality assessment based on duration
    if (duration < 5) return 'poor';
    if (duration < 15) return 'fair';
    return 'good';
  }

  generateFeedback(sessionId: string): SpeakingFeedback[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const exercise = this.exercises.get(session.exerciseId);
    if (!exercise) return [];

    // Simulate AI-powered feedback based on exercise type and recordings
    const feedback: SpeakingFeedback[] = [
      {
        category: 'fluency',
        score: 7 + Math.floor(Math.random() * 3),
        comments: [
          'Good overall flow and natural pace',
          'Minor hesitations in complex sentences'
        ],
        improvements: [
          'Practice transitional phrases',
          'Work on connecting ideas smoothly'
        ],
        strengths: [
          'Natural rhythm in most segments',
          'Appropriate use of pauses'
        ]
      },
      {
        category: 'pronunciation',
        score: 6 + Math.floor(Math.random() * 3),
        comments: [
          'Clear articulation of most sounds',
          'Some difficulty with consonant clusters'
        ],
        improvements: [
          'Focus on /θ/ and /ð/ sounds',
          'Practice word stress patterns'
        ],
        strengths: [
          'Good vowel pronunciation',
          'Clear consonant sounds'
        ]
      },
      {
        category: 'vocabulary',
        score: 8 + Math.floor(Math.random() * 2),
        comments: [
          'Appropriate vocabulary for the topic',
          'Good use of key phrases'
        ],
        improvements: [
          'Incorporate more advanced expressions',
          'Use more varied sentence structures'
        ],
        strengths: [
          'Accurate use of topic-specific terms',
          'Good collocation choices'
        ]
      }
    ];

    session.feedback = feedback;
    return feedback;
  }

  updateMetrics(sessionId: string, metrics: Partial<SpeakingMetrics>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.metrics = { ...session.metrics, ...metrics };
  }

  addSelfAssessment(sessionId: string, assessment: SelfAssessment): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.selfAssessment = assessment;
  }

  endSpeakingSession(sessionId: string): SpeakingSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    
    // Generate comprehensive feedback if not already done
    if (session.feedback.length === 0) {
      this.generateFeedback(sessionId);
    }

    return session;
  }

  getUserSessions(userId: number): SpeakingSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  getPersonalizedRecommendations(userId: number): SpeakingExercise[] {
    const userSessions = this.getUserSessions(userId);
    
    if (userSessions.length === 0) {
      return this.getExercises().slice(0, 3);
    }

    // Analyze user's weakest areas from recent feedback
    const recentFeedback = userSessions
      .slice(0, 5)
      .flatMap(session => session.feedback);

    const weakestAreas = recentFeedback
      .reduce((acc, feedback) => {
        if (feedback.score < 7) {
          acc[feedback.category] = (acc[feedback.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    // Recommend exercises targeting weak areas
    const allExercises = Array.from(this.exercises.values());
    
    if (weakestAreas['pronunciation']) {
      return allExercises.filter(ex => ex.type === 'shadowing').slice(0, 3);
    }
    
    if (weakestAreas['fluency']) {
      return allExercises.filter(ex => ex.type === 'conversation').slice(0, 3);
    }
    
    if (weakestAreas['vocabulary']) {
      return allExercises.filter(ex => ex.type === 'presentation').slice(0, 3);
    }

    return allExercises.slice(0, 3);
  }
}

export const speakingPracticeSystem = new SpeakingPracticeSystem();