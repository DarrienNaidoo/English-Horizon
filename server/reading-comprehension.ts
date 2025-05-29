// Interactive reading comprehension system
export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'culture' | 'science' | 'history' | 'daily-life' | 'business';
  wordCount: number;
  estimatedReadingTime: number;
  vocabulary: VocabularyItem[];
  comprehensionQuestions: ComprehensionQuestion[];
  keyPhrases: string[];
  culturalNotes?: string[];
}

export interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleSentence: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface ReadingSession {
  id: string;
  userId: number;
  passageId: string;
  startTime: Date;
  endTime?: Date;
  readingSpeed: number; // words per minute
  comprehensionScore: number;
  questionsAnswered: AnsweredQuestion[];
  highlights: TextHighlight[];
  notes: UserNote[];
  lookupHistory: VocabularyLookup[];
}

export interface AnsweredQuestion {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

export interface TextHighlight {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  color: string;
  note?: string;
  timestamp: Date;
}

export interface UserNote {
  id: string;
  text: string;
  position: number;
  timestamp: Date;
}

export interface VocabularyLookup {
  word: string;
  timestamp: Date;
  context: string;
}

export interface ReadingAnalytics {
  userId: number;
  totalReadingTime: number;
  averageReadingSpeed: number;
  comprehensionTrend: number[];
  vocabularyGrowth: number;
  preferredTopics: string[];
  strugglingAreas: string[];
}

export class ReadingComprehensionSystem {
  private passages: Map<string, ReadingPassage> = new Map();
  private sessions: Map<string, ReadingSession> = new Map();
  private userAnalytics: Map<number, ReadingAnalytics> = new Map();

  constructor() {
    this.initializePassages();
  }

  private initializePassages(): void {
    const passages: ReadingPassage[] = [
      {
        id: 'chinese-new-year',
        title: 'Chinese New Year Traditions',
        content: `Chinese New Year, also known as Spring Festival, is the most important traditional holiday in China. The celebration lasts for fifteen days, beginning on the first day of the lunar calendar and ending with the Lantern Festival.

During this time, families gather together to share elaborate meals, exchange red envelopes filled with money, and participate in various cultural activities. The color red is prominently featured throughout the celebration, as it symbolizes good luck and prosperity in Chinese culture.

One of the most fascinating traditions is the lion dance, performed by skilled dancers who manipulate large, colorful lion costumes. The dance is believed to ward off evil spirits and bring good fortune for the coming year. Fireworks and firecrackers are also essential elements, creating a spectacular display of light and sound that fills the night sky.

Traditional foods play a crucial role in the celebration. Dumplings, shaped like ancient Chinese gold ingots, represent wealth and prosperity. Fish is served whole to symbolize abundance, while noodles represent longevity. Each dish carries special meaning and contributes to the overall significance of the feast.

The preparation for Chinese New Year begins weeks in advance. Homes are thoroughly cleaned to sweep away bad luck from the previous year, and decorations featuring auspicious symbols are hung throughout the house. Couplets with poetic phrases expressing hopes for the new year are placed on doorframes, written in elegant calligraphy on red paper.`,
        level: 'intermediate',
        category: 'culture',
        wordCount: 234,
        estimatedReadingTime: 2,
        vocabulary: [
          {
            word: 'elaborate',
            definition: 'involving many carefully arranged parts or details; detailed and complicated',
            pronunciation: '/ɪˈlæbərət/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The wedding had an elaborate ceremony with hundreds of guests.',
            difficulty: 'medium'
          },
          {
            word: 'auspicious',
            definition: 'conducive to success; favorable',
            pronunciation: '/ɔːˈspɪʃəs/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The sunny weather was an auspicious start to their vacation.',
            difficulty: 'hard'
          },
          {
            word: 'ingots',
            definition: 'lumps of metal, especially iron, steel, or cast iron, cast in a mold',
            pronunciation: '/ˈɪŋɡəts/',
            partOfSpeech: 'noun',
            exampleSentence: 'The factory produced gold ingots for the jewelry industry.',
            difficulty: 'hard'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'cny-q1',
            type: 'multiple-choice',
            question: 'How long does the Chinese New Year celebration last?',
            options: ['Seven days', 'Ten days', 'Fifteen days', 'One month'],
            correctAnswer: 'Fifteen days',
            explanation: 'The passage states that the celebration lasts for fifteen days.',
            points: 2
          },
          {
            id: 'cny-q2',
            type: 'true-false',
            question: 'Red color symbolizes good luck in Chinese culture.',
            correctAnswer: 'true',
            explanation: 'The passage mentions that red symbolizes good luck and prosperity.',
            points: 1
          },
          {
            id: 'cny-q3',
            type: 'short-answer',
            question: 'What do dumplings represent during Chinese New Year?',
            correctAnswer: ['wealth', 'prosperity', 'wealth and prosperity'],
            explanation: 'Dumplings represent wealth and prosperity because they are shaped like ancient Chinese gold ingots.',
            points: 3
          }
        ],
        keyPhrases: ['Spring Festival', 'lunar calendar', 'red envelopes', 'lion dance', 'good fortune'],
        culturalNotes: [
          'The lunar calendar is different from the Western calendar, so Chinese New Year falls on different dates each year',
          'Red envelopes (hongbao) traditionally contain money and are given by elders to younger family members',
          'The number of firecrackers used is believed to correlate with the amount of bad luck driven away'
        ]
      },
      {
        id: 'sustainable-cities',
        title: 'Building Sustainable Cities for the Future',
        content: `As urban populations continue to grow rapidly worldwide, the concept of sustainable cities has become increasingly important. These innovative urban environments aim to minimize environmental impact while maximizing quality of life for residents.

Sustainable cities incorporate renewable energy sources such as solar panels and wind turbines to reduce dependence on fossil fuels. Green building practices, including the use of recycled materials and energy-efficient designs, are standard throughout these communities. Vertical gardens and rooftop farms not only provide fresh produce but also help purify the air and reduce urban heat islands.

Transportation systems in sustainable cities prioritize public transit, cycling, and walking over private vehicle ownership. Electric buses, bike-sharing programs, and pedestrian-friendly infrastructure create networks that are both environmentally friendly and accessible to all residents regardless of economic status.

Water management plays a crucial role in sustainability efforts. Rainwater harvesting systems collect and store precipitation for later use, while advanced filtration technologies ensure clean drinking water for all citizens. Greywater recycling systems treat and reuse water from sinks and showers for irrigation and other non-potable purposes.

Smart technology integration helps optimize resource usage throughout the city. Sensors monitor air quality, traffic patterns, and energy consumption in real-time, allowing city planners to make data-driven decisions that improve efficiency and reduce waste. These technological solutions demonstrate how innovation can address environmental challenges while enhancing urban living.`,
        level: 'advanced',
        category: 'science',
        wordCount: 267,
        estimatedReadingTime: 3,
        vocabulary: [
          {
            word: 'precipitation',
            definition: 'rain, snow, sleet, or hail that falls to the ground',
            pronunciation: '/prɪˌsɪpɪˈteɪʃən/',
            partOfSpeech: 'noun',
            exampleSentence: 'The weather forecast predicts heavy precipitation this weekend.',
            difficulty: 'medium'
          },
          {
            word: 'non-potable',
            definition: 'not suitable for drinking',
            pronunciation: '/ˌnɑːn ˈpoʊtəbəl/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The sign warned that the water was non-potable and unsafe to drink.',
            difficulty: 'hard'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'sc-q1',
            type: 'multiple-choice',
            question: 'What is the main purpose of sustainable cities?',
            options: [
              'To increase population density',
              'To minimize environmental impact while maximizing quality of life',
              'To reduce construction costs',
              'To promote private vehicle ownership'
            ],
            correctAnswer: 'To minimize environmental impact while maximizing quality of life',
            explanation: 'The passage clearly states this as the main aim of sustainable cities.',
            points: 3
          },
          {
            id: 'sc-q2',
            type: 'essay',
            question: 'Explain how smart technology helps sustainable cities optimize resource usage.',
            correctAnswer: ['Sensors monitor air quality, traffic patterns, and energy consumption in real-time, allowing city planners to make data-driven decisions that improve efficiency and reduce waste'],
            explanation: 'Smart technology provides real-time monitoring and data analysis capabilities.',
            points: 5
          }
        ],
        keyPhrases: ['renewable energy', 'green building', 'urban heat islands', 'greywater recycling', 'smart technology'],
        culturalNotes: [
          'Many sustainable city concepts originated in Northern European countries like Denmark and Sweden',
          'Singapore is often cited as a leading example of sustainable urban planning in Asia'
        ]
      }
    ];

    passages.forEach(passage => {
      this.passages.set(passage.id, passage);
    });
  }

  getPassages(level?: string, category?: string): ReadingPassage[] {
    let filtered = Array.from(this.passages.values());
    
    if (level) {
      filtered = filtered.filter(p => p.level === level);
    }
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  getPassage(id: string): ReadingPassage | undefined {
    return this.passages.get(id);
  }

  startReadingSession(userId: number, passageId: string): ReadingSession {
    const sessionId = `session-${Date.now()}-${userId}`;
    const session: ReadingSession = {
      id: sessionId,
      userId,
      passageId,
      startTime: new Date(),
      readingSpeed: 0,
      comprehensionScore: 0,
      questionsAnswered: [],
      highlights: [],
      notes: [],
      lookupHistory: []
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  endReadingSession(sessionId: string): ReadingSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    
    // Calculate reading speed
    const passage = this.passages.get(session.passageId);
    if (passage && session.endTime) {
      const timeInMinutes = (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
      session.readingSpeed = Math.round(passage.wordCount / timeInMinutes);
    }

    this.updateUserAnalytics(session);
    return session;
  }

  addHighlight(sessionId: string, highlight: Omit<TextHighlight, 'id' | 'timestamp'>): TextHighlight | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const newHighlight: TextHighlight = {
      ...highlight,
      id: `highlight-${Date.now()}`,
      timestamp: new Date()
    };

    session.highlights.push(newHighlight);
    return newHighlight;
  }

  addNote(sessionId: string, note: Omit<UserNote, 'id' | 'timestamp'>): UserNote | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const newNote: UserNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date()
    };

    session.notes.push(newNote);
    return newNote;
  }

  recordVocabularyLookup(sessionId: string, word: string, context: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.lookupHistory.push({
      word,
      timestamp: new Date(),
      context
    });
  }

  submitAnswer(sessionId: string, questionId: string, answer: string | string[], timeSpent: number): AnsweredQuestion | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const passage = this.passages.get(session.passageId);
    if (!passage) return null;

    const question = passage.comprehensionQuestions.find(q => q.id === questionId);
    if (!question) return null;

    const isCorrect = this.checkAnswer(question, answer);
    const pointsEarned = isCorrect ? question.points : 0;

    const answeredQuestion: AnsweredQuestion = {
      questionId,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      pointsEarned
    };

    session.questionsAnswered.push(answeredQuestion);
    
    // Update comprehension score
    const totalPoints = session.questionsAnswered.reduce((sum, aq) => sum + aq.pointsEarned, 0);
    const maxPoints = passage.comprehensionQuestions.reduce((sum, q) => sum + q.points, 0);
    session.comprehensionScore = Math.round((totalPoints / maxPoints) * 100);

    return answeredQuestion;
  }

  private checkAnswer(question: ComprehensionQuestion, userAnswer: string | string[]): boolean {
    const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    const user = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

    if (question.type === 'true-false') {
      return user[0].toLowerCase() === correct[0].toLowerCase();
    }

    if (question.type === 'multiple-choice') {
      return user[0] === correct[0];
    }

    if (question.type === 'short-answer') {
      return correct.some(c => 
        user.some(u => 
          u.toLowerCase().includes(c.toLowerCase()) || 
          c.toLowerCase().includes(u.toLowerCase())
        )
      );
    }

    return false; // Essay questions require manual grading
  }

  private updateUserAnalytics(session: ReadingSession): void {
    let analytics = this.userAnalytics.get(session.userId);
    
    if (!analytics) {
      analytics = {
        userId: session.userId,
        totalReadingTime: 0,
        averageReadingSpeed: 0,
        comprehensionTrend: [],
        vocabularyGrowth: 0,
        preferredTopics: [],
        strugglingAreas: []
      };
    }

    // Update reading time
    if (session.endTime) {
      const sessionTime = (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
      analytics.totalReadingTime += sessionTime;
    }

    // Update reading speed average
    if (session.readingSpeed > 0) {
      const speeds = [analytics.averageReadingSpeed, session.readingSpeed].filter(s => s > 0);
      analytics.averageReadingSpeed = Math.round(speeds.reduce((sum, s) => sum + s, 0) / speeds.length);
    }

    // Update comprehension trend
    analytics.comprehensionTrend.push(session.comprehensionScore);
    if (analytics.comprehensionTrend.length > 10) {
      analytics.comprehensionTrend = analytics.comprehensionTrend.slice(-10);
    }

    // Update vocabulary growth
    analytics.vocabularyGrowth += session.lookupHistory.length;

    this.userAnalytics.set(session.userId, analytics);
  }

  getUserAnalytics(userId: number): ReadingAnalytics | null {
    return this.userAnalytics.get(userId) || null;
  }

  getReadingSessions(userId: number): ReadingSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  getRecommendedPassages(userId: number, limit: number = 3): ReadingPassage[] {
    const analytics = this.getUserAnalytics(userId);
    const allPassages = Array.from(this.passages.values());
    
    if (!analytics) {
      return allPassages.slice(0, limit);
    }

    // Simple recommendation based on comprehension trend
    const avgComprehension = analytics.comprehensionTrend.length > 0 
      ? analytics.comprehensionTrend.reduce((sum, score) => sum + score, 0) / analytics.comprehensionTrend.length 
      : 75;

    let recommendedLevel: string;
    if (avgComprehension >= 85) {
      recommendedLevel = 'advanced';
    } else if (avgComprehension >= 70) {
      recommendedLevel = 'intermediate';
    } else {
      recommendedLevel = 'beginner';
    }

    return allPassages
      .filter(passage => passage.level === recommendedLevel)
      .slice(0, limit);
  }
}

export const readingComprehensionSystem = new ReadingComprehensionSystem();