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
      },
      {
        id: 'modern-workplace',
        title: 'The Evolution of the Modern Workplace',
        content: `The concept of work has undergone dramatic transformation in recent decades. Traditional office environments with rigid schedules and hierarchical structures are giving way to flexible, collaborative workspaces that prioritize employee well-being and productivity.

Remote work, once considered an unconventional arrangement, has become mainstream. The global shift toward telecommuting has demonstrated that many jobs can be performed effectively from anywhere with reliable internet access. This flexibility allows employees to achieve better work-life balance while companies can access talent from a broader geographic pool.

Technology plays a pivotal role in this evolution. Video conferencing platforms, cloud-based collaboration tools, and project management software have made distributed teams as effective as those working in the same physical location. Artificial intelligence and automation are increasingly handling routine tasks, freeing human workers to focus on creative problem-solving and strategic thinking.

The physical office space itself is being reimagined. Open floor plans encourage collaboration and communication, while quiet zones provide spaces for concentrated work. Wellness features such as natural lighting, ergonomic furniture, and recreational areas recognize the connection between employee health and performance.

Companies are also embracing new approaches to career development. Traditional linear career paths are being replaced by more fluid structures that allow for lateral movement and skill diversification. Continuous learning has become essential, with many organizations investing heavily in employee training and development programs to keep pace with rapidly changing industry demands.`,
        level: 'intermediate',
        category: 'business',
        wordCount: 248,
        estimatedReadingTime: 3,
        vocabulary: [
          {
            word: 'hierarchical',
            definition: 'arranged in order of rank or authority',
            pronunciation: '/ˌhaɪəˈrɑrkɪkəl/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The company has a hierarchical management structure.',
            difficulty: 'medium'
          },
          {
            word: 'telecommuting',
            definition: 'working from home using computer and telecommunications technology',
            pronunciation: '/ˈtɛləkəˌmjutɪŋ/',
            partOfSpeech: 'noun',
            exampleSentence: 'Telecommuting has become popular among tech workers.',
            difficulty: 'medium'
          },
          {
            word: 'ergonomic',
            definition: 'designed for efficiency and comfort in the working environment',
            pronunciation: '/ˌɜrɡəˈnɑmɪk/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The ergonomic chair reduced back pain for office workers.',
            difficulty: 'hard'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'mw-q1',
            type: 'multiple-choice',
            question: 'What has made remote work possible?',
            options: ['Better office designs', 'Technology and internet access', 'Government policies', 'Reduced working hours'],
            correctAnswer: 'Technology and internet access',
            explanation: 'The passage mentions reliable internet access and various technologies enabling remote work.',
            points: 2
          },
          {
            id: 'mw-q2',
            type: 'true-false',
            question: 'Traditional linear career paths are still the most common approach.',
            correctAnswer: 'false',
            explanation: 'The passage states that traditional linear career paths are being replaced by more fluid structures.',
            points: 2
          }
        ],
        keyPhrases: ['work-life balance', 'distributed teams', 'collaboration tools', 'career development'],
        culturalNotes: [
          'The concept of work-life balance varies significantly across different cultures',
          'Some countries have laws mandating remote work options for eligible employees'
        ]
      },
      {
        id: 'ocean-exploration',
        title: 'Mysteries of Deep Ocean Exploration',
        content: `The deep ocean remains one of Earth's final frontiers, with less than 5% of our planet's underwater realm thoroughly explored. This vast underwater wilderness holds secrets that could revolutionize our understanding of life, climate, and planetary history.

Recent technological advances have opened new possibilities for deep-sea research. Remotely operated vehicles (ROVs) equipped with high-definition cameras and sophisticated sensors can dive to depths previously unreachable by human explorers. These robotic ambassadors have discovered thriving ecosystems around hydrothermal vents, where unique organisms survive in extreme conditions without sunlight.

Marine biologists have identified countless new species in these deep-sea environments. Giant tube worms, bioluminescent jellyfish, and bacteria that derive energy from chemical processes rather than photosynthesis challenge our fundamental assumptions about life's requirements. Some of these organisms possess unique properties that could lead to breakthroughs in medicine, biotechnology, and materials science.

The deep ocean also serves as a crucial component of Earth's climate system. Ocean currents transport heat around the globe, while the deep sea absorbs significant amounts of carbon dioxide from the atmosphere. Understanding these processes is essential for predicting climate change impacts and developing mitigation strategies.

Commercial interests in deep-sea mining have sparked important debates about conservation versus resource extraction. The ocean floor contains valuable minerals including rare earth elements crucial for modern technology. However, scientists warn that mining activities could damage fragile ecosystems that took millions of years to develop, potentially eliminating species before they are even discovered.`,
        level: 'advanced',
        category: 'science',
        wordCount: 278,
        estimatedReadingTime: 3,
        vocabulary: [
          {
            word: 'hydrothermal',
            definition: 'relating to hot water, especially in the context of underwater volcanic vents',
            pronunciation: '/ˌhaɪdroʊˈθɜrməl/',
            partOfSpeech: 'adjective',
            exampleSentence: 'Hydrothermal vents support unique ecosystems on the ocean floor.',
            difficulty: 'hard'
          },
          {
            word: 'bioluminescent',
            definition: 'producing light through chemical reactions within living organisms',
            pronunciation: '/ˌbaɪoʊˌluməˈnɛsənt/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The bioluminescent plankton made the water glow at night.',
            difficulty: 'hard'
          },
          {
            word: 'photosynthesis',
            definition: 'the process by which plants use sunlight to synthesize nutrients from carbon dioxide and water',
            pronunciation: '/ˌfoʊtoʊˈsɪnθəsɪs/',
            partOfSpeech: 'noun',
            exampleSentence: 'Photosynthesis is essential for plant growth and oxygen production.',
            difficulty: 'medium'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'oe-q1',
            type: 'multiple-choice',
            question: 'What percentage of the ocean has been thoroughly explored?',
            options: ['Less than 5%', 'About 25%', 'Approximately 50%', 'More than 75%'],
            correctAnswer: 'Less than 5%',
            explanation: 'The passage states that less than 5% of the underwater realm has been thoroughly explored.',
            points: 2
          },
          {
            id: 'oe-q2',
            type: 'short-answer',
            question: 'What role does the deep ocean play in climate regulation?',
            correctAnswer: ['transports heat', 'absorbs carbon dioxide', 'ocean currents'],
            explanation: 'The deep ocean transports heat through currents and absorbs carbon dioxide from the atmosphere.',
            points: 3
          }
        ],
        keyPhrases: ['deep-sea research', 'hydrothermal vents', 'climate system', 'resource extraction'],
        culturalNotes: [
          'Many cultures have myths and legends about sea monsters that may have been inspired by deep-sea creatures',
          'International waters governance makes deep-sea mining regulation complex'
        ]
      },
      {
        id: 'digital-citizenship',
        title: 'Digital Citizenship in the 21st Century',
        content: `As digital technology becomes increasingly integrated into daily life, the concept of digital citizenship has emerged as a crucial skill for navigating the modern world. Digital citizenship encompasses the responsible and ethical use of technology, including understanding online rights, responsibilities, and digital etiquette.

Privacy protection represents one of the most important aspects of digital citizenship. Personal information shared online can be permanent and far-reaching, affecting future opportunities and relationships. Understanding privacy settings, recognizing data collection practices, and making informed decisions about information sharing are essential skills for maintaining digital autonomy.

The spread of misinformation poses significant challenges to informed democratic participation. Digital citizens must develop critical thinking skills to evaluate online sources, verify information accuracy, and understand how algorithms influence the content they see. Media literacy education helps individuals distinguish between reliable journalism and opinion, advertising, or propaganda.

Cyberbullying and online harassment have serious psychological and social consequences. Digital citizenship education emphasizes empathy, respect, and constructive communication in online spaces. Understanding the human impact of digital interactions encourages more thoughtful and compassionate online behavior.

The digital divide highlights inequalities in technology access and digital skills. Socioeconomic factors, geographic location, and educational opportunities can create disparities in digital participation. Promoting digital inclusion requires addressing both infrastructure limitations and providing comprehensive digital literacy training for all community members.`,
        level: 'intermediate',
        category: 'daily-life',
        wordCount: 235,
        estimatedReadingTime: 3,
        vocabulary: [
          {
            word: 'encompasses',
            definition: 'includes or contains as a part or whole',
            pronunciation: '/ɪnˈkʌmpəsɪz/',
            partOfSpeech: 'verb',
            exampleSentence: 'The course encompasses both theory and practical applications.',
            difficulty: 'medium'
          },
          {
            word: 'algorithms',
            definition: 'sets of rules or instructions for solving problems or completing tasks',
            pronunciation: '/ˈælɡəˌrɪðəmz/',
            partOfSpeech: 'noun',
            exampleSentence: 'Social media algorithms determine what content users see.',
            difficulty: 'medium'
          },
          {
            word: 'disparities',
            definition: 'notable differences or inequalities between groups',
            pronunciation: '/dɪˈspærɪtiz/',
            partOfSpeech: 'noun',
            exampleSentence: 'Educational disparities exist between urban and rural areas.',
            difficulty: 'medium'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'dc-q1',
            type: 'multiple-choice',
            question: 'What does digital citizenship primarily focus on?',
            options: ['Using the latest technology', 'Responsible and ethical technology use', 'Increasing internet speed', 'Buying digital products'],
            correctAnswer: 'Responsible and ethical technology use',
            explanation: 'Digital citizenship encompasses responsible and ethical use of technology.',
            points: 2
          },
          {
            id: 'dc-q2',
            type: 'true-false',
            question: 'The digital divide only affects people in developing countries.',
            correctAnswer: 'false',
            explanation: 'The passage mentions that socioeconomic factors and geographic location create disparities, indicating it affects various communities.',
            points: 2
          }
        ],
        keyPhrases: ['digital etiquette', 'privacy protection', 'media literacy', 'digital inclusion'],
        culturalNotes: [
          'Privacy expectations vary significantly across different cultures and legal systems',
          'Digital citizenship education is becoming mandatory in many school curricula worldwide'
        ]
      },
      {
        id: 'food-sustainability',
        title: 'Sustainable Food Systems: Feeding the Future',
        content: `Global food production faces unprecedented challenges as the world population approaches 10 billion people by 2050. Traditional agricultural methods, while having fed humanity for millennia, are increasingly unsustainable due to climate change, soil degradation, and resource scarcity.

Vertical farming represents one innovative solution to these challenges. By growing crops in stacked layers within controlled environments, vertical farms can produce food year-round while using 95% less water than conventional agriculture. LED lighting systems optimized for plant growth eliminate weather dependency and enable farming in urban areas close to consumers.

Plant-based protein alternatives are gaining traction as sustainable substitutes for resource-intensive animal agriculture. Legumes, nuts, and innovative products made from algae or fungi provide essential nutrients while requiring significantly less land, water, and energy to produce. Some companies are even developing laboratory-grown meat that could revolutionize protein production.

Food waste reduction presents another critical opportunity for sustainability. Approximately one-third of all food produced globally is lost or wasted along the supply chain. Smart packaging technologies, improved distribution networks, and consumer education about proper food storage can significantly reduce this waste.

Regenerative agriculture practices focus on rebuilding soil health through diverse crop rotations, cover crops, and minimal tillage. These methods can sequester carbon in soil, improve biodiversity, and create more resilient farming systems that adapt better to climate variability while maintaining productivity.`,
        level: 'intermediate',
        category: 'science',
        wordCount: 245,
        estimatedReadingTime: 3,
        vocabulary: [
          {
            word: 'unprecedented',
            definition: 'never having been done or experienced before',
            pronunciation: '/ʌnˈprɛsɪˌdɛntɪd/',
            partOfSpeech: 'adjective',
            exampleSentence: 'The pandemic created unprecedented challenges for healthcare systems.',
            difficulty: 'medium'
          },
          {
            word: 'sequester',
            definition: 'to isolate or store something, especially carbon, in a natural reservoir',
            pronunciation: '/sɪˈkwɛstər/',
            partOfSpeech: 'verb',
            exampleSentence: 'Forests sequester carbon dioxide from the atmosphere.',
            difficulty: 'hard'
          },
          {
            word: 'resilient',
            definition: 'able to recover quickly from difficulties or adapt to change',
            pronunciation: '/rɪˈzɪljənt/',
            partOfSpeech: 'adjective',
            exampleSentence: 'Resilient communities bounce back faster from natural disasters.',
            difficulty: 'medium'
          }
        ],
        comprehensionQuestions: [
          {
            id: 'fs-q1',
            type: 'multiple-choice',
            question: 'How much water can vertical farming save compared to conventional agriculture?',
            options: ['50%', '75%', '85%', '95%'],
            correctAnswer: '95%',
            explanation: 'The passage states that vertical farms use 95% less water than conventional agriculture.',
            points: 2
          },
          {
            id: 'fs-q2',
            type: 'short-answer',
            question: 'What percentage of global food production is lost or wasted?',
            correctAnswer: ['one-third', '33%', 'about one-third'],
            explanation: 'The passage mentions that approximately one-third of all food produced globally is lost or wasted.',
            points: 2
          }
        ],
        keyPhrases: ['vertical farming', 'plant-based protein', 'regenerative agriculture', 'food waste reduction'],
        culturalNotes: [
          'Food waste patterns vary greatly between developed and developing countries',
          'Traditional farming practices in many cultures already incorporate sustainable principles'
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