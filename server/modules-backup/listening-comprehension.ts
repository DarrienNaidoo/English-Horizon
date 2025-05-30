// Advanced listening comprehension system with multiple accents and audio content
export interface AudioContent {
  id: string;
  title: string;
  type: 'podcast' | 'news' | 'conversation' | 'lecture' | 'drama' | 'interview';
  description: string;
  audioUrl: string;
  transcript: string;
  duration: number; // seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accent: 'american' | 'british' | 'australian' | 'canadian' | 'mixed';
  speed: 'slow' | 'normal' | 'fast';
  topics: string[];
  vocabulary: AudioVocabulary[];
  comprehensionQuestions: ComprehensionQuestion[];
  culturalNotes: string[];
  listeningSkills: string[];
}

export interface AudioVocabulary {
  word: string;
  definition: string;
  timestamp: number;
  pronunciation: string;
  context: string;
  difficulty: number;
}

export interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  timestamp?: number;
  skillTested: string;
  difficulty: number;
}

export interface AudioDrama {
  id: string;
  title: string;
  series: string;
  episode: number;
  description: string;
  setting: string;
  characters: DramaCharacter[];
  scenes: DramaScene[];
  duration: number;
  difficulty: string;
  learningObjectives: string[];
  culturalContext: string[];
}

export interface DramaCharacter {
  name: string;
  role: string;
  accent: string;
  personality: string;
  backgroundInfo: string;
}

export interface DramaScene {
  id: string;
  title: string;
  setting: string;
  duration: number;
  dialogue: DialogueLine[];
  comprehensionTasks: SceneTask[];
  vocabulary: string[];
  culturalNotes: string[];
}

export interface DialogueLine {
  character: string;
  text: string;
  emotion: string;
  timestamp: number;
  pronunciation: string;
  culturalNote?: string;
}

export interface SceneTask {
  type: 'prediction' | 'emotion_recognition' | 'context_clues' | 'inference';
  instruction: string;
  expectedResponse: string;
  hints: string[];
}

export interface ListeningSession {
  id: string;
  userId: number;
  contentId: string;
  startTime: Date;
  endTime?: Date;
  playbackSpeed: number;
  pauseCount: number;
  rewindCount: number;
  answers: SessionAnswer[];
  comprehensionScore: number;
  timeSpent: number;
  completed: boolean;
}

export interface SessionAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
}

export interface AccentTraining {
  id: string;
  targetAccent: string;
  sourceAccent: string;
  title: string;
  description: string;
  exercises: AccentExercise[];
  progressionPath: string[];
  assessments: AccentAssessment[];
}

export interface AccentExercise {
  id: string;
  type: 'minimal_pairs' | 'shadowing' | 'rhythm' | 'intonation';
  title: string;
  instructions: string[];
  audioSamples: AudioSample[];
  practiceItems: PracticeItem[];
  difficulty: number;
}

export interface AudioSample {
  id: string;
  text: string;
  audioUrl: string;
  accent: string;
  speaker: string;
  notes: string[];
}

export interface PracticeItem {
  text: string;
  targetPronunciation: string;
  commonMistakes: string[];
  tips: string[];
  difficulty: number;
}

export interface AccentAssessment {
  id: string;
  title: string;
  description: string;
  tasks: AssessmentTask[];
  passingScore: number;
  maxAttempts: number;
}

export interface AssessmentTask {
  type: 'recognition' | 'production' | 'discrimination';
  instruction: string;
  items: string[];
  expectedResponses: string[];
  scoring: ScoringCriteria;
}

export interface ScoringCriteria {
  accuracy: number;
  fluency: number;
  pronunciation: number;
  comprehension: number;
}

export class ListeningComprehensionSystem {
  private audioContent: Map<string, AudioContent> = new Map();
  private audioDramas: Map<string, AudioDrama> = new Map();
  private accentTraining: Map<string, AccentTraining> = new Map();
  private listeningSessions: Map<string, ListeningSession[]> = new Map();

  constructor() {
    this.initializeAudioContent();
    this.initializeAudioDramas();
    this.initializeAccentTraining();
  }

  private initializeAudioContent(): void {
    const content: AudioContent[] = [
      {
        id: 'tech-podcast-1',
        title: 'Future of Artificial Intelligence',
        type: 'podcast',
        description: 'Expert discussion on AI developments and their impact on society',
        audioUrl: '/audio/tech-podcast-ai.mp3',
        transcript: `Host: Welcome to Tech Talk. Today we're discussing artificial intelligence with Dr. Sarah Chen, a leading researcher in machine learning. Dr. Chen, what do you see as the most significant development in AI this year?\n\nDr. Chen: Thank you for having me. I think the most remarkable advancement has been in large language models. They're becoming increasingly sophisticated in their ability to understand and generate human-like text.\n\nHost: That's fascinating. How do you think this will affect everyday life?\n\nDr. Chen: Well, we're already seeing AI assistants becoming more helpful in various tasks. But I believe the real transformation will be in education and healthcare, where AI can provide personalized support.`,
        duration: 480,
        difficulty: 'intermediate',
        accent: 'american',
        speed: 'normal',
        topics: ['technology', 'artificial intelligence', 'future trends'],
        vocabulary: [
          {
            word: 'sophisticated',
            definition: 'highly developed or complex',
            timestamp: 145,
            pronunciation: '/səˈfɪstɪkeɪtɪd/',
            context: 'describing AI capabilities',
            difficulty: 6
          },
          {
            word: 'transformation',
            definition: 'a thorough or dramatic change',
            timestamp: 320,
            pronunciation: '/ˌtrænsfərˈmeɪʃən/',
            context: 'describing societal change',
            difficulty: 7
          }
        ],
        comprehensionQuestions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'What does Dr. Chen consider the most significant AI development?',
            options: [
              'Robotic automation',
              'Large language models',
              'Computer vision',
              'Voice recognition'
            ],
            correctAnswer: 'Large language models',
            explanation: 'Dr. Chen specifically mentions large language models as the most remarkable advancement.',
            timestamp: 145,
            skillTested: 'detail comprehension',
            difficulty: 4
          },
          {
            id: 'q2',
            type: 'short-answer',
            question: 'In which two sectors does Dr. Chen believe AI will have the most transformative impact?',
            correctAnswer: ['education', 'healthcare'],
            explanation: 'She specifically mentions education and healthcare as areas for real transformation.',
            timestamp: 350,
            skillTested: 'specific information',
            difficulty: 5
          }
        ],
        culturalNotes: [
          'American podcasts often feature expert interviews',
          'Casual but professional tone is typical',
          'Questions are direct and focused'
        ],
        listeningSkills: ['main idea identification', 'detail recognition', 'prediction']
      },
      {
        id: 'bbc-news-1',
        title: 'Climate Summit Outcomes',
        type: 'news',
        description: 'BBC news report on international climate agreement',
        audioUrl: '/audio/bbc-climate-news.mp3',
        transcript: `This is BBC News. I'm James Richardson. World leaders have reached a historic agreement at the climate summit in Glasgow. The accord includes commitments to reduce carbon emissions by fifty percent within the next decade. Environmental groups have welcomed the decision, though some argue the measures don't go far enough. Our environmental correspondent, Emma Thompson, reports from Glasgow.`,
        duration: 240,
        difficulty: 'advanced',
        accent: 'british',
        speed: 'normal',
        topics: ['environment', 'politics', 'international news'],
        vocabulary: [
          {
            word: 'accord',
            definition: 'an official agreement or treaty',
            timestamp: 45,
            pronunciation: '/əˈkɔːd/',
            context: 'international agreement',
            difficulty: 8
          },
          {
            word: 'correspondent',
            definition: 'a journalist who reports on a particular subject',
            timestamp: 180,
            pronunciation: '/ˌkɒrɪˈspɒndənt/',
            context: 'news reporting',
            difficulty: 7
          }
        ],
        comprehensionQuestions: [
          {
            id: 'q1',
            type: 'true-false',
            question: 'All environmental groups are completely satisfied with the agreement.',
            correctAnswer: 'false',
            explanation: 'Some groups argue the measures don\'t go far enough.',
            skillTested: 'inference',
            difficulty: 6
          }
        ],
        culturalNotes: [
          'BBC follows formal news presentation style',
          'British pronunciation patterns',
          'Structured reporting format'
        ],
        listeningSkills: ['formal register comprehension', 'news format understanding']
      },
      {
        id: 'aussie-interview-1',
        title: 'Wildlife Conservation in Australia',
        type: 'interview',
        description: 'Interview with Australian wildlife conservationist',
        audioUrl: '/audio/aussie-wildlife.mp3',
        transcript: `Interviewer: G'day, I'm here with Dr. Michael Barnes, who's been working to protect Australia's unique wildlife for over twenty years. Dr. Barnes, what's the biggest challenge facing our native animals today?\n\nDr. Barnes: Thanks, mate. Look, the biggest issue is definitely habitat loss. As cities expand and agriculture grows, our wildlife is losing the places they call home. It's particularly tough for species like the koala and the bilby.`,
        duration: 360,
        difficulty: 'intermediate',
        accent: 'australian',
        speed: 'normal',
        topics: ['wildlife', 'conservation', 'Australia'],
        vocabulary: [
          {
            word: 'habitat',
            definition: 'the natural environment where an animal lives',
            timestamp: 95,
            pronunciation: '/ˈhæbɪtæt/',
            context: 'wildlife conservation',
            difficulty: 5
          }
        ],
        comprehensionQuestions: [
          {
            id: 'q1',
            type: 'fill-blank',
            question: 'Dr. Barnes says the biggest issue is _______ _______.',
            correctAnswer: ['habitat loss'],
            explanation: 'He clearly states that habitat loss is the biggest challenge.',
            skillTested: 'key information extraction',
            difficulty: 4
          }
        ],
        culturalNotes: [
          'Australian informal greetings like "G\'day" and "mate"',
          'Direct, friendly communication style',
          'Environmental consciousness is prominent'
        ],
        listeningSkills: ['accent recognition', 'informal register']
      }
    ];

    content.forEach(item => {
      this.audioContent.set(item.id, item);
    });
  }

  private initializeAudioDramas(): void {
    const dramas: AudioDrama[] = [
      {
        id: 'workplace-drama-1',
        title: 'The Office Dilemma',
        series: 'Workplace English',
        episode: 1,
        description: 'A workplace conflict resolution scenario',
        setting: 'Modern corporate office',
        characters: [
          {
            name: 'Sarah',
            role: 'Project Manager',
            accent: 'American',
            personality: 'Assertive, diplomatic',
            backgroundInfo: 'Five years experience, leads a team of six'
          },
          {
            name: 'David',
            role: 'Software Developer',
            accent: 'British',
            personality: 'Analytical, introverted',
            backgroundInfo: 'Recent graduate, perfectionist'
          },
          {
            name: 'Maria',
            role: 'Marketing Specialist',
            accent: 'Canadian',
            personality: 'Creative, collaborative',
            backgroundInfo: 'Ten years experience, team player'
          }
        ],
        scenes: [
          {
            id: 'scene-1',
            title: 'The Conflict Emerges',
            setting: 'Conference room',
            duration: 180,
            dialogue: [
              {
                character: 'Sarah',
                text: 'Thanks everyone for coming. We need to discuss the timeline for the Johnson project.',
                emotion: 'professional',
                timestamp: 5,
                pronunciation: '/θæŋks ˈevriˌwʌn fər ˈkʌmɪŋ/',
                culturalNote: 'American business meetings often start with thanks'
              },
              {
                character: 'David',
                text: 'I\'m afraid the current timeline is rather unrealistic. We need at least two more weeks.',
                emotion: 'concerned',
                timestamp: 15,
                pronunciation: '/aɪm əˈfreɪd ðə ˈkɜrənt ˈtaɪmˌlaɪn ɪz ˈræðər ʌnˌriəˈlɪstɪk/',
                culturalNote: 'British tendency to use "I\'m afraid" to soften disagreement'
              },
              {
                character: 'Maria',
                text: 'Could we perhaps compromise? Maybe we could deliver a basic version first?',
                emotion: 'diplomatic',
                timestamp: 25,
                pronunciation: '/kʊd wi pərˈhæps ˈkɑmprəˌmaɪz/',
                culturalNote: 'Canadian diplomatic approach with tentative language'
              }
            ],
            comprehensionTasks: [
              {
                type: 'prediction',
                instruction: 'What do you think Sarah will say next?',
                expectedResponse: 'She might ask for more details or suggest alternatives',
                hints: ['Consider her role as project manager', 'Think about compromise solutions']
              },
              {
                type: 'emotion_recognition',
                instruction: 'How does David feel about the timeline?',
                expectedResponse: 'Concerned, worried, stressed',
                hints: ['Listen to his tone of voice', 'Notice his word choice']
              }
            ],
            vocabulary: ['timeline', 'unrealistic', 'compromise', 'deliver'],
            culturalNotes: [
              'Different nationalities use different politeness strategies',
              'British speakers often use indirect language',
              'Canadians tend to seek diplomatic solutions'
            ]
          }
        ],
        duration: 600,
        difficulty: 'intermediate',
        learningObjectives: [
          'Understand workplace communication styles',
          'Recognize different English accents',
          'Learn conflict resolution vocabulary'
        ],
        culturalContext: [
          'Multinational workplace dynamics',
          'Professional communication norms',
          'Cultural differences in directness'
        ]
      }
    ];

    dramas.forEach(drama => {
      this.audioDramas.set(drama.id, drama);
    });
  }

  private initializeAccentTraining(): void {
    const training: AccentTraining[] = [
      {
        id: 'american-accent-basics',
        targetAccent: 'american',
        sourceAccent: 'general',
        title: 'American English Fundamentals',
        description: 'Master the key features of American English pronunciation',
        exercises: [
          {
            id: 'r-sounds',
            type: 'minimal_pairs',
            title: 'American R-Sounds',
            instructions: [
              'Listen to each pair of words',
              'Notice the strong R sound in American English',
              'Practice repeating each word'
            ],
            audioSamples: [
              {
                id: 'sample-1',
                text: 'car - care',
                audioUrl: '/audio/american-r-1.mp3',
                accent: 'american',
                speaker: 'Native speaker from California',
                notes: ['Strong retroflex R', 'R-colored vowels']
              }
            ],
            practiceItems: [
              {
                text: 'The red car is parked over there.',
                targetPronunciation: '/ðə rɛd kɑr ɪz pɑrkt ˈoʊvər ðɛr/',
                commonMistakes: ['Weak R sounds', 'Dropping final R'],
                tips: ['Curl tongue tip back', 'Make R sound throughout'],
                difficulty: 5
              }
            ],
            difficulty: 4
          }
        ],
        progressionPath: ['r-sounds', 'vowel-system', 'stress-patterns', 'intonation'],
        assessments: [
          {
            id: 'american-assessment-1',
            title: 'Basic American Pronunciation Test',
            description: 'Assess your American accent progress',
            tasks: [
              {
                type: 'production',
                instruction: 'Read the following sentences with American pronunciation',
                items: [
                  'The weather in New York is warmer than last year.',
                  'I bought a large coffee at the corner store.'
                ],
                expectedResponses: ['Clear R sounds', 'American vowel system'],
                scoring: {
                  accuracy: 0.7,
                  fluency: 0.6,
                  pronunciation: 0.8,
                  comprehension: 0.9
                }
              }
            ],
            passingScore: 75,
            maxAttempts: 3
          }
        ]
      }
    ];

    training.forEach(item => {
      this.accentTraining.set(item.id, item);
    });
  }

  // Public methods
  getAudioContent(type?: string, difficulty?: string, accent?: string): AudioContent[] {
    let content = Array.from(this.audioContent.values());

    if (type) {
      content = content.filter(c => c.type === type);
    }
    if (difficulty) {
      content = content.filter(c => c.difficulty === difficulty);
    }
    if (accent) {
      content = content.filter(c => c.accent === accent);
    }

    return content;
  }

  getAudioDramas(difficulty?: string): AudioDrama[] {
    let dramas = Array.from(this.audioDramas.values());

    if (difficulty) {
      dramas = dramas.filter(d => d.difficulty === difficulty);
    }

    return dramas;
  }

  getAccentTraining(targetAccent?: string): AccentTraining[] {
    let training = Array.from(this.accentTraining.values());

    if (targetAccent) {
      training = training.filter(t => t.targetAccent === targetAccent);
    }

    return training;
  }

  startListeningSession(contentId: string, userId: number): ListeningSession {
    const sessionId = `session-${Date.now()}-${userId}`;
    
    const session: ListeningSession = {
      id: sessionId,
      userId,
      contentId,
      startTime: new Date(),
      playbackSpeed: 1.0,
      pauseCount: 0,
      rewindCount: 0,
      answers: [],
      comprehensionScore: 0,
      timeSpent: 0,
      completed: false
    };

    const userSessions = this.listeningSessions.get(userId.toString()) || [];
    userSessions.push(session);
    this.listeningSessions.set(userId.toString(), userSessions);

    return session;
  }

  submitComprehensionAnswer(
    sessionId: string,
    questionId: string,
    userAnswer: string | string[],
    timeSpent: number
  ): { correct: boolean; explanation: string; score: number } {
    // Find the session
    let session: ListeningSession | undefined;
    for (const userSessions of this.listeningSessions.values()) {
      session = userSessions.find(s => s.id === sessionId);
      if (session) break;
    }

    if (!session) {
      throw new Error('Session not found');
    }

    // Find the content and question
    const content = this.audioContent.get(session.contentId);
    if (!content) {
      throw new Error('Content not found');
    }

    const question = content.comprehensionQuestions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Check answer
    const correct = this.checkAnswer(question, userAnswer);
    
    // Update session
    const answerRecord: SessionAnswer = {
      questionId,
      userAnswer,
      isCorrect: correct,
      timeSpent,
      attempts: 1
    };

    session.answers.push(answerRecord);

    return {
      correct,
      explanation: question.explanation,
      score: correct ? 10 : 0
    };
  }

  private checkAnswer(question: ComprehensionQuestion, userAnswer: string | string[]): boolean {
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return question.correctAnswer.every(ans => 
          userAnswer.some(ua => ua.toLowerCase().trim() === ans.toLowerCase())
        );
      } else {
        return question.correctAnswer.some(ans => 
          userAnswer.toLowerCase().trim() === ans.toLowerCase()
        );
      }
    } else {
      if (Array.isArray(userAnswer)) {
        return userAnswer.some(ua => ua.toLowerCase().trim() === question.correctAnswer.toLowerCase());
      } else {
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase();
      }
    }
  }

  getListeningSessions(userId: number): ListeningSession[] {
    return this.listeningSessions.get(userId.toString()) || [];
  }

  updatePlaybackSettings(sessionId: string, speed: number, pauseCount?: number, rewindCount?: number): void {
    for (const userSessions of this.listeningSessions.values()) {
      const session = userSessions.find(s => s.id === sessionId);
      if (session) {
        session.playbackSpeed = speed;
        if (pauseCount !== undefined) session.pauseCount += pauseCount;
        if (rewindCount !== undefined) session.rewindCount += rewindCount;
        break;
      }
    }
  }

  completeSession(sessionId: string): ListeningSession | null {
    for (const userSessions of this.listeningSessions.values()) {
      const session = userSessions.find(s => s.id === sessionId);
      if (session) {
        session.endTime = new Date();
        session.completed = true;
        session.timeSpent = session.endTime.getTime() - session.startTime.getTime();
        
        // Calculate comprehension score
        const correctAnswers = session.answers.filter(a => a.isCorrect).length;
        session.comprehensionScore = session.answers.length > 0 
          ? (correctAnswers / session.answers.length) * 100 
          : 0;

        return session;
      }
    }
    return null;
  }

  getProgressStats(userId: number): {
    totalListeningTime: number;
    averageComprehension: number;
    accentExposure: string[];
    improvementTrend: number;
    preferredSpeed: number;
    skillAreas: { [skill: string]: number };
  } {
    const sessions = this.getListeningSessions(userId);
    
    if (sessions.length === 0) {
      return {
        totalListeningTime: 0,
        averageComprehension: 0,
        accentExposure: [],
        improvementTrend: 0,
        preferredSpeed: 1.0,
        skillAreas: {}
      };
    }

    const completedSessions = sessions.filter(s => s.completed);
    const totalTime = completedSessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const avgComprehension = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + s.comprehensionScore, 0) / completedSessions.length
      : 0;

    // Get accent exposure
    const accents = new Set<string>();
    completedSessions.forEach(session => {
      const content = this.audioContent.get(session.contentId);
      if (content) accents.add(content.accent);
    });

    // Calculate improvement trend
    const recentSessions = completedSessions.slice(-5);
    const oldSessions = completedSessions.slice(0, 5);
    const recentAvg = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + s.comprehensionScore, 0) / recentSessions.length
      : 0;
    const oldAvg = oldSessions.length > 0
      ? oldSessions.reduce((sum, s) => sum + s.comprehensionScore, 0) / oldSessions.length
      : 0;

    return {
      totalListeningTime: Math.round(totalTime / 1000 / 60), // minutes
      averageComprehension: Math.round(avgComprehension),
      accentExposure: Array.from(accents),
      improvementTrend: recentAvg - oldAvg,
      preferredSpeed: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.playbackSpeed, 0) / sessions.length 
        : 1.0,
      skillAreas: {
        'detail_comprehension': avgComprehension * 0.9,
        'main_idea': avgComprehension * 1.1,
        'inference': avgComprehension * 0.8
      }
    };
  }
}

export const listeningComprehensionSystem = new ListeningComprehensionSystem();