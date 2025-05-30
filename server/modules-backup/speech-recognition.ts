// Advanced speech recognition and accent training system
export interface SpeechAnalysis {
  transcription: string;
  confidenceScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  phonemeAnalysis: PhonemeAnalysis[];
  prosodyAnalysis: ProsodyAnalysis;
  recommendations: string[];
  detectedAccent?: string;
}

export interface PhonemeAnalysis {
  phoneme: string;
  expected: string;
  actual: string;
  accuracy: number;
  position: number;
  feedback: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ProsodyAnalysis {
  rhythm: {
    score: number;
    feedback: string;
    issues: string[];
  };
  stress: {
    score: number;
    feedback: string;
    wordStressErrors: WordStressError[];
  };
  intonation: {
    score: number;
    feedback: string;
    patterns: IntonationPattern[];
  };
  pace: {
    wordsPerMinute: number;
    score: number;
    feedback: string;
  };
}

export interface WordStressError {
  word: string;
  expectedStress: number[];
  actualStress: number[];
  severity: 'minor' | 'major';
}

export interface IntonationPattern {
  type: 'rising' | 'falling' | 'flat';
  expected: 'rising' | 'falling' | 'flat';
  position: { start: number; end: number };
  accuracy: number;
}

export interface AccentTrainingExercise {
  id: string;
  targetAccent: 'american' | 'british' | 'australian' | 'neutral';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'vowels' | 'consonants' | 'rhythm' | 'intonation' | 'connected_speech';
  title: string;
  description: string;
  instructions: string[];
  targetPhonemes: string[];
  practiceWords: PracticeWord[];
  sentences: PracticeSentence[];
  audioUrl?: string;
  tips: string[];
}

export interface PracticeWord {
  word: string;
  phonetic: string;
  difficulty: number;
  commonMistakes: string[];
  tips: string[];
  exampleSentence: string;
}

export interface PracticeSentence {
  text: string;
  phonetic: string;
  focus: string[];
  stressPattern: number[];
  intonationPattern: string;
  difficulty: number;
}

export interface FluencyTest {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  prompt: string;
  criteria: FluencyCriteria;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

export interface FluencyCriteria {
  minWordsPerMinute: number;
  maxPauses: number;
  minCoherence: number;
  vocabularyDiversity: number;
  grammarAccuracy: number;
}

export interface FluencyResult {
  testId: string;
  userId: number;
  duration: number;
  wordCount: number;
  wordsPerMinute: number;
  pauseCount: number;
  pauseDuration: number;
  coherenceScore: number;
  vocabularyScore: number;
  grammarScore: number;
  overallScore: number;
  feedback: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface VoiceJournalEntry {
  id: string;
  userId: number;
  title: string;
  audioData: ArrayBuffer;
  transcription: string;
  duration: number;
  topics: string[];
  mood?: string;
  analysis?: SpeechAnalysis;
  date: Date;
  isPrivate: boolean;
}

export class SpeechRecognitionSystem {
  private accentExercises: Map<string, AccentTrainingExercise[]> = new Map();
  private fluencyTests: Map<string, FluencyTest> = new Map();
  private fluencyResults: Map<string, FluencyResult[]> = new Map();
  private voiceJournals: Map<string, VoiceJournalEntry[]> = new Map();

  constructor() {
    this.initializeAccentExercises();
    this.initializeFluencyTests();
  }

  private initializeAccentExercises(): void {
    // American accent exercises
    const americanExercises: AccentTrainingExercise[] = [
      {
        id: 'american-r-sounds',
        targetAccent: 'american',
        difficulty: 'intermediate',
        category: 'consonants',
        title: 'American R-Sounds',
        description: 'Master the retroflex R sound characteristic of American English',
        instructions: [
          'Curl your tongue tip slightly backward',
          'Don\'t let your tongue touch the roof of your mouth',
          'The sound should be strong and clear'
        ],
        targetPhonemes: ['ɹ', 'ɚ', 'ɝ'],
        practiceWords: [
          {
            word: 'red',
            phonetic: '/ɹɛd/',
            difficulty: 3,
            commonMistakes: ['sounding like /l/', 'too weak'],
            tips: ['Start with tongue curl before making sound'],
            exampleSentence: 'The red car is parked over there.'
          },
          {
            word: 'car',
            phonetic: '/kɑɹ/',
            difficulty: 4,
            commonMistakes: ['dropping the R', 'too soft'],
            tips: ['Hold the R sound longer'],
            exampleSentence: 'I drive my car to work every day.'
          },
          {
            word: 'teacher',
            phonetic: '/ˈtiːtʃɚ/',
            difficulty: 5,
            commonMistakes: ['unclear ending', 'schwa instead of R'],
            tips: ['Emphasize the final R-colored vowel'],
            exampleSentence: 'My teacher helps me learn English.'
          }
        ],
        sentences: [
          {
            text: 'Robert drove his car over the river.',
            phonetic: '/ˈɹɑbɚt dɹoʊv hɪz kɑɹ ˈoʊvɚ ðə ˈɹɪvɚ/',
            focus: ['ɹ', 'ɚ'],
            stressPattern: [1, 0, 1, 0, 1, 0, 1, 0],
            intonationPattern: 'falling',
            difficulty: 6
          }
        ],
        tips: [
          'Practice in front of a mirror',
          'Record yourself and compare',
          'Start slowly and increase speed'
        ]
      },
      {
        id: 'american-vowels',
        targetAccent: 'american',
        difficulty: 'beginner',
        category: 'vowels',
        title: 'American Vowel Sounds',
        description: 'Practice key American English vowel distinctions',
        instructions: [
          'Focus on mouth position for each vowel',
          'Pay attention to vowel length',
          'Practice minimal pairs'
        ],
        targetPhonemes: ['æ', 'ɑ', 'ɔ', 'ʌ'],
        practiceWords: [
          {
            word: 'cat',
            phonetic: '/kæt/',
            difficulty: 2,
            commonMistakes: ['too close to /e/', 'not open enough'],
            tips: ['Open mouth more, lower jaw'],
            exampleSentence: 'The cat sits on the mat.'
          },
          {
            word: 'cut',
            phonetic: '/kʌt/',
            difficulty: 3,
            commonMistakes: ['confused with /ɑ/', 'too tense'],
            tips: ['Relax tongue, mid-central position'],
            exampleSentence: 'Please cut the paper carefully.'
          }
        ],
        sentences: [
          {
            text: 'The black cat ran fast past the car.',
            phonetic: '/ðə blæk kæt ɹæn fæst pæst ðə kɑɹ/',
            focus: ['æ', 'ɑ'],
            stressPattern: [0, 1, 1, 1, 1, 1, 0, 1],
            intonationPattern: 'falling',
            difficulty: 4
          }
        ],
        tips: [
          'Use a vowel chart for reference',
          'Practice with minimal pairs',
          'Listen to native speakers carefully'
        ]
      }
    ];

    // British accent exercises
    const britishExercises: AccentTrainingExercise[] = [
      {
        id: 'british-received-pronunciation',
        targetAccent: 'british',
        difficulty: 'advanced',
        category: 'vowels',
        title: 'Received Pronunciation Vowels',
        description: 'Master the vowel system of Standard British English',
        instructions: [
          'Focus on crisp, clear vowel distinctions',
          'Avoid rhotic R sounds',
          'Pay attention to vowel length differences'
        ],
        targetPhonemes: ['ɑː', 'ɔː', 'ɜː', 'ɪ', 'ʊ'],
        practiceWords: [
          {
            word: 'bath',
            phonetic: '/bɑːθ/',
            difficulty: 4,
            commonMistakes: ['using /æ/ like American', 'too short'],
            tips: ['Long, open back vowel'],
            exampleSentence: 'I take a bath every evening.'
          },
          {
            word: 'bird',
            phonetic: '/bɜːd/',
            difficulty: 5,
            commonMistakes: ['adding R sound', 'wrong vowel quality'],
            tips: ['Central vowel, no R coloring'],
            exampleSentence: 'The bird flew away quickly.'
          }
        ],
        sentences: [
          {
            text: 'The car park is rather far from here.',
            phonetic: '/ðə kɑː pɑːk ɪz ˈɹɑːðə fɑː frəm hɪə/',
            focus: ['ɑː', 'ə'],
            stressPattern: [0, 1, 1, 1, 1, 0, 1, 0, 1],
            intonationPattern: 'falling',
            difficulty: 7
          }
        ],
        tips: [
          'Listen to BBC pronunciation',
          'Practice without R sounds',
          'Focus on vowel length'
        ]
      }
    ];

    this.accentExercises.set('american', americanExercises);
    this.accentExercises.set('british', britishExercises);
  }

  private initializeFluencyTests(): void {
    const tests: FluencyTest[] = [
      {
        id: 'daily-routine',
        title: 'Describe Your Daily Routine',
        description: 'Speak about your typical day from morning to evening',
        duration: 120,
        prompt: 'Describe what you do during a typical day. Include details about your morning routine, work or school activities, and evening activities.',
        criteria: {
          minWordsPerMinute: 120,
          maxPauses: 10,
          minCoherence: 70,
          vocabularyDiversity: 60,
          grammarAccuracy: 75
        },
        level: 'beginner',
        topics: ['daily life', 'routines', 'time expressions']
      },
      {
        id: 'future-plans',
        title: 'Future Plans and Goals',
        description: 'Discuss your plans for the next year and long-term goals',
        duration: 180,
        prompt: 'Talk about your plans for the next year and your long-term goals. Explain why these goals are important to you and how you plan to achieve them.',
        criteria: {
          minWordsPerMinute: 140,
          maxPauses: 8,
          minCoherence: 75,
          vocabularyDiversity: 70,
          grammarAccuracy: 80
        },
        level: 'intermediate',
        topics: ['future tenses', 'goals', 'planning', 'motivation']
      },
      {
        id: 'social-issue',
        title: 'Social Issue Discussion',
        description: 'Present your views on a current social issue',
        duration: 240,
        prompt: 'Choose a social issue that you care about and present your perspective. Explain the problem, its causes, and potential solutions.',
        criteria: {
          minWordsPerMinute: 150,
          maxPauses: 6,
          minCoherence: 80,
          vocabularyDiversity: 80,
          grammarAccuracy: 85
        },
        level: 'advanced',
        topics: ['social issues', 'argumentation', 'complex grammar', 'formal language']
      }
    ];

    tests.forEach(test => {
      this.fluencyTests.set(test.id, test);
    });
  }

  // Speech analysis methods
  async analyzeSpeech(audioData: ArrayBuffer, targetText?: string): Promise<SpeechAnalysis> {
    // This would integrate with a real speech recognition API
    // For now, we'll simulate the analysis
    
    const simulatedTranscription = targetText || "Hello, how are you today?";
    const wordCount = simulatedTranscription.split(/\s+/).length;
    
    // Simulate analysis scores
    const confidenceScore = 0.85 + Math.random() * 0.1;
    const pronunciationScore = 0.75 + Math.random() * 0.2;
    const fluencyScore = 0.8 + Math.random() * 0.15;
    const accuracyScore = 0.78 + Math.random() * 0.17;

    // Simulate phoneme analysis
    const phonemeAnalysis: PhonemeAnalysis[] = [
      {
        phoneme: 'θ',
        expected: 'θ',
        actual: 's',
        accuracy: 0.3,
        position: 15,
        feedback: 'Place tongue between teeth for "th" sound',
        difficulty: 'hard'
      },
      {
        phoneme: 'ɹ',
        expected: 'ɹ',
        actual: 'ɹ',
        accuracy: 0.9,
        position: 8,
        feedback: 'Excellent R pronunciation!',
        difficulty: 'medium'
      }
    ];

    // Simulate prosody analysis
    const prosodyAnalysis: ProsodyAnalysis = {
      rhythm: {
        score: 0.82,
        feedback: 'Good rhythm overall, work on stressed syllables',
        issues: ['Some unstressed syllables too prominent']
      },
      stress: {
        score: 0.75,
        feedback: 'Word stress needs improvement',
        wordStressErrors: [
          {
            word: 'important',
            expectedStress: [0, 1, 0, 0],
            actualStress: [1, 0, 0, 0],
            severity: 'major'
          }
        ]
      },
      intonation: {
        score: 0.88,
        feedback: 'Natural intonation patterns',
        patterns: [
          {
            type: 'falling',
            expected: 'falling',
            position: { start: 0, end: 10 },
            accuracy: 0.9
          }
        ]
      },
      pace: {
        wordsPerMinute: 145,
        score: 0.85,
        feedback: 'Good speaking pace'
      }
    };

    const recommendations = this.generateRecommendations(pronunciationScore, fluencyScore, phonemeAnalysis);

    return {
      transcription: simulatedTranscription,
      confidenceScore,
      pronunciationScore,
      fluencyScore,
      accuracyScore,
      phonemeAnalysis,
      prosodyAnalysis,
      recommendations,
      detectedAccent: 'mixed'
    };
  }

  private generateRecommendations(pronunciationScore: number, fluencyScore: number, phonemeAnalysis: PhonemeAnalysis[]): string[] {
    const recommendations: string[] = [];

    if (pronunciationScore < 0.7) {
      recommendations.push('Focus on individual phoneme practice');
      recommendations.push('Use pronunciation exercises daily');
    }

    if (fluencyScore < 0.75) {
      recommendations.push('Practice speaking longer passages');
      recommendations.push('Work on reducing hesitations');
    }

    // Add specific phoneme recommendations
    const difficultPhonemes = phonemeAnalysis.filter(p => p.accuracy < 0.6);
    if (difficultPhonemes.length > 0) {
      recommendations.push(`Focus on these sounds: ${difficultPhonemes.map(p => p.phoneme).join(', ')}`);
    }

    return recommendations;
  }

  // Fluency testing methods
  async conductFluencyTest(testId: string, userId: number, audioData: ArrayBuffer): Promise<FluencyResult> {
    const test = this.fluencyTests.get(testId);
    if (!test) {
      throw new Error('Fluency test not found');
    }

    // Simulate analysis
    const analysis = await this.analyzeSpeech(audioData);
    const duration = test.duration;
    const wordCount = Math.floor(analysis.prosodyAnalysis.pace.wordsPerMinute * (duration / 60));
    
    // Calculate scores based on criteria
    const wordsPerMinute = analysis.prosodyAnalysis.pace.wordsPerMinute;
    const wpmScore = Math.min(1, wordsPerMinute / test.criteria.minWordsPerMinute);
    
    const pauseCount = Math.floor(Math.random() * 12); // Simulated
    const pauseScore = Math.max(0, 1 - (pauseCount / test.criteria.maxPauses));
    
    const coherenceScore = 0.7 + Math.random() * 0.25;
    const vocabularyScore = 0.65 + Math.random() * 0.3;
    const grammarScore = analysis.accuracyScore;
    
    const overallScore = (wpmScore * 0.2 + pauseScore * 0.2 + coherenceScore * 0.2 + 
                         vocabularyScore * 0.2 + grammarScore * 0.2) * 100;

    const result: FluencyResult = {
      testId,
      userId,
      duration,
      wordCount,
      wordsPerMinute,
      pauseCount,
      pauseDuration: pauseCount * 0.8,
      coherenceScore: coherenceScore * 100,
      vocabularyScore: vocabularyScore * 100,
      grammarScore: grammarScore * 100,
      overallScore,
      feedback: this.generateFluencyFeedback(overallScore, test.level),
      recommendations: analysis.recommendations,
      timestamp: new Date()
    };

    // Store result
    const userResults = this.fluencyResults.get(userId.toString()) || [];
    userResults.push(result);
    this.fluencyResults.set(userId.toString(), userResults);

    return result;
  }

  private generateFluencyFeedback(score: number, level: string): string[] {
    const feedback: string[] = [];

    if (score >= 85) {
      feedback.push('Excellent fluency! You speak naturally and confidently.');
      feedback.push('Your pace and rhythm are very good.');
    } else if (score >= 70) {
      feedback.push('Good fluency with minor areas for improvement.');
      feedback.push('Continue practicing to increase confidence.');
    } else if (score >= 55) {
      feedback.push('Developing fluency. Focus on speaking more smoothly.');
      feedback.push('Practice reducing pauses and hesitations.');
    } else {
      feedback.push('Fluency needs significant improvement.');
      feedback.push('Practice speaking daily to build confidence.');
    }

    return feedback;
  }

  // Voice journal methods
  createVoiceJournalEntry(
    userId: number,
    title: string,
    audioData: ArrayBuffer,
    topics: string[],
    isPrivate: boolean = true
  ): Promise<VoiceJournalEntry> {
    return new Promise(async (resolve) => {
      const entryId = `journal-${Date.now()}-${userId}`;
      
      // Simulate transcription
      const analysis = await this.analyzeSpeech(audioData);
      
      const entry: VoiceJournalEntry = {
        id: entryId,
        userId,
        title,
        audioData,
        transcription: analysis.transcription,
        duration: 60 + Math.random() * 120, // Simulated duration
        topics,
        analysis,
        date: new Date(),
        isPrivate
      };

      // Store entry
      const userJournals = this.voiceJournals.get(userId.toString()) || [];
      userJournals.push(entry);
      this.voiceJournals.set(userId.toString(), userJournals);

      resolve(entry);
    });
  }

  // Public methods
  getAccentExercises(accent: string, category?: string, difficulty?: string): AccentTrainingExercise[] {
    const exercises = this.accentExercises.get(accent) || [];
    
    return exercises.filter(exercise => {
      if (category && exercise.category !== category) return false;
      if (difficulty && exercise.difficulty !== difficulty) return false;
      return true;
    });
  }

  getFluencyTests(level?: string): FluencyTest[] {
    let tests = Array.from(this.fluencyTests.values());
    
    if (level) {
      tests = tests.filter(test => test.level === level);
    }
    
    return tests;
  }

  getUserFluencyResults(userId: number): FluencyResult[] {
    return this.fluencyResults.get(userId.toString()) || [];
  }

  getUserVoiceJournal(userId: number): VoiceJournalEntry[] {
    return this.voiceJournals.get(userId.toString()) || [];
  }

  getProgressStats(userId: number): {
    totalRecordings: number;
    averagePronunciationScore: number;
    averageFluencyScore: number;
    improvementTrend: number;
    weakestPhonemes: string[];
    strongestSkills: string[];
  } {
    const fluencyResults = this.getUserFluencyResults(userId);
    const journalEntries = this.getUserVoiceJournal(userId);
    
    const totalRecordings = fluencyResults.length + journalEntries.length;
    
    if (totalRecordings === 0) {
      return {
        totalRecordings: 0,
        averagePronunciationScore: 0,
        averageFluencyScore: 0,
        improvementTrend: 0,
        weakestPhonemes: [],
        strongestSkills: []
      };
    }

    // Calculate averages from journal entries
    const journalAnalyses = journalEntries
      .filter(entry => entry.analysis)
      .map(entry => entry.analysis!);

    const avgPronunciation = journalAnalyses.length > 0 
      ? journalAnalyses.reduce((sum, analysis) => sum + analysis.pronunciationScore, 0) / journalAnalyses.length
      : 0;

    const avgFluency = fluencyResults.length > 0
      ? fluencyResults.reduce((sum, result) => sum + result.overallScore, 0) / fluencyResults.length
      : 0;

    // Calculate improvement trend (simplified)
    const improvementTrend = fluencyResults.length >= 2
      ? fluencyResults[fluencyResults.length - 1].overallScore - fluencyResults[0].overallScore
      : 0;

    return {
      totalRecordings,
      averagePronunciationScore: avgPronunciation * 100,
      averageFluencyScore: avgFluency,
      improvementTrend,
      weakestPhonemes: ['θ', 'ð', 'ɹ'], // Simplified
      strongestSkills: ['intonation', 'rhythm']
    };
  }
}

export const speechRecognitionSystem = new SpeechRecognitionSystem();