// Advanced writing assistant with grammar correction
export interface GrammarError {
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary';
  message: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  severity: 'low' | 'medium' | 'high';
}

export interface WritingAnalysis {
  text: string;
  errors: GrammarError[];
  readabilityScore: number;
  wordCount: number;
  sentenceCount: number;
  suggestions: WritingSuggestion[];
  vocabulary: VocabularyAnalysis;
}

export interface WritingSuggestion {
  type: 'clarity' | 'conciseness' | 'tone' | 'structure';
  message: string;
  example?: string;
}

export interface VocabularyAnalysis {
  level: 'beginner' | 'intermediate' | 'advanced';
  complexWords: string[];
  suggestedAlternatives: Array<{ word: string; alternatives: string[] }>;
  diversityScore: number;
}

export interface WritingTemplate {
  id: string;
  title: string;
  type: 'email' | 'essay' | 'report' | 'letter' | 'story';
  level: 'beginner' | 'intermediate' | 'advanced';
  structure: string[];
  example: string;
  keyPhrases: string[];
}

export class WritingAssistant {
  private templates: WritingTemplate[] = [
    {
      id: 'business-email',
      title: 'Business Email',
      type: 'email',
      level: 'intermediate',
      structure: [
        'Subject line',
        'Greeting',
        'Purpose statement',
        'Main content',
        'Call to action',
        'Professional closing'
      ],
      example: `Subject: Meeting Request for Project Discussion

Dear Mr. Smith,

I hope this email finds you well. I am writing to request a meeting to discuss the upcoming project timeline.

Would you be available next Tuesday at 2:00 PM? I believe this discussion will help us align our goals and ensure project success.

Please let me know if this time works for you, or suggest an alternative.

Best regards,
[Your name]`,
      keyPhrases: ['I hope this email finds you well', 'I am writing to', 'Would you be available', 'Please let me know']
    },
    {
      id: 'persuasive-essay',
      title: 'Persuasive Essay',
      type: 'essay',
      level: 'advanced',
      structure: [
        'Hook and thesis statement',
        'Background information',
        'Supporting argument 1',
        'Supporting argument 2',
        'Counter-argument and rebuttal',
        'Conclusion and call to action'
      ],
      example: `The Benefits of Reading Daily

Reading for just 30 minutes daily can transform your life in remarkable ways. Despite our busy schedules, incorporating daily reading habits provides cognitive, emotional, and social benefits that far outweigh the time investment.

Research consistently shows that regular reading improves vocabulary, enhances critical thinking skills, and reduces stress levels. Furthermore, readers demonstrate better empathy and communication abilities.

While some argue that digital media provides sufficient information, books offer deeper engagement and sustained focus that social media cannot match.

Therefore, committing to daily reading is one of the most valuable investments you can make in your personal development.`,
      keyPhrases: ['Research shows', 'Furthermore', 'While some argue', 'Therefore']
    }
  ];

  private grammarRules = [
    {
      pattern: /\bi\b/g,
      type: 'grammar' as const,
      message: 'Always capitalize "I"',
      suggestion: 'I',
      severity: 'high' as const
    },
    {
      pattern: /\b(there|their|they're)\b/g,
      type: 'grammar' as const,
      message: 'Check usage of there/their/they\'re',
      suggestion: 'Use "there" for location, "their" for possession, "they\'re" for "they are"',
      severity: 'medium' as const
    },
    {
      pattern: /\b(your|you're)\b/g,
      type: 'grammar' as const,
      message: 'Check usage of your/you\'re',
      suggestion: 'Use "your" for possession, "you\'re" for "you are"',
      severity: 'medium' as const
    },
    {
      pattern: /\b(its|it's)\b/g,
      type: 'grammar' as const,
      message: 'Check usage of its/it\'s',
      suggestion: 'Use "its" for possession, "it\'s" for "it is"',
      severity: 'medium' as const
    }
  ];

  private commonMistakes = [
    { incorrect: 'alot', correct: 'a lot' },
    { incorrect: 'recieve', correct: 'receive' },
    { incorrect: 'definately', correct: 'definitely' },
    { incorrect: 'seperate', correct: 'separate' },
    { incorrect: 'occured', correct: 'occurred' },
    { incorrect: 'accomodate', correct: 'accommodate' },
    { incorrect: 'embarass', correct: 'embarrass' },
    { incorrect: 'neccessary', correct: 'necessary' }
  ];

  async analyzeText(text: string): Promise<WritingAnalysis> {
    const errors = this.findGrammarErrors(text);
    const readabilityScore = this.calculateReadability(text);
    const wordCount = this.countWords(text);
    const sentenceCount = this.countSentences(text);
    const suggestions = this.generateSuggestions(text);
    const vocabulary = this.analyzeVocabulary(text);

    return {
      text,
      errors,
      readabilityScore,
      wordCount,
      sentenceCount,
      suggestions,
      vocabulary
    };
  }

  private findGrammarErrors(text: string): GrammarError[] {
    const errors: GrammarError[] = [];

    // Check spelling mistakes
    this.commonMistakes.forEach(mistake => {
      const regex = new RegExp(`\\b${mistake.incorrect}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        errors.push({
          type: 'spelling',
          message: `Possible spelling error: "${mistake.incorrect}"`,
          suggestion: mistake.correct,
          startIndex: match.index,
          endIndex: match.index + mistake.incorrect.length,
          severity: 'high'
        });
      }
    });

    // Check for lowercase "i"
    const iRegex = /\bi\b/g;
    let match;
    while ((match = iRegex.exec(text)) !== null) {
      errors.push({
        type: 'grammar',
        message: 'Always capitalize "I"',
        suggestion: 'I',
        startIndex: match.index,
        endIndex: match.index + 1,
        severity: 'high'
      });
    }

    // Check for double spaces
    const doubleSpaceRegex = /  +/g;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
      errors.push({
        type: 'style',
        message: 'Remove extra spaces',
        suggestion: ' ',
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        severity: 'low'
      });
    }

    // Check for missing punctuation at end of sentences
    const sentences = text.split(/[.!?]+/);
    sentences.forEach((sentence, index) => {
      if (index < sentences.length - 1) {
        const trimmed = sentence.trim();
        if (trimmed.length > 0 && !trimmed.match(/[.!?]$/)) {
          const sentenceEnd = text.indexOf(sentence) + sentence.length;
          errors.push({
            type: 'punctuation',
            message: 'Add punctuation at end of sentence',
            suggestion: '.',
            startIndex: sentenceEnd,
            endIndex: sentenceEnd,
            severity: 'medium'
          });
        }
      }
    });

    return errors;
  }

  private calculateReadability(text: string): number {
    const words = this.countWords(text);
    const sentences = this.countSentences(text);
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((total, word) => {
      // Simple syllable counting heuristic
      let syllables = word.match(/[aeiouy]+/g)?.length || 1;
      if (word.endsWith('e')) syllables--;
      if (word.endsWith('le')) syllables++;
      return total + Math.max(1, syllables);
    }, 0);
  }

  private generateSuggestions(text: string): WritingSuggestion[] {
    const suggestions: WritingSuggestion[] = [];
    const words = this.countWords(text);
    const sentences = this.countSentences(text);

    // Check sentence length
    if (words / sentences > 25) {
      suggestions.push({
        type: 'clarity',
        message: 'Consider breaking up long sentences for better readability',
        example: 'Split complex sentences into shorter, clearer ones'
      });
    }

    // Check for passive voice (simplified detection)
    if (text.includes('was') || text.includes('were') || text.includes('been')) {
      suggestions.push({
        type: 'style',
        message: 'Consider using active voice instead of passive voice',
        example: 'Change "The ball was thrown by John" to "John threw the ball"'
      });
    }

    // Check for repetitive words
    const wordFreq = this.analyzeWordFrequency(text);
    const repetitiveWords = Object.entries(wordFreq)
      .filter(([word, count]) => count > 3 && word.length > 4)
      .map(([word]) => word);

    if (repetitiveWords.length > 0) {
      suggestions.push({
        type: 'vocabulary',
        message: `Consider varying your vocabulary. Repeated words: ${repetitiveWords.join(', ')}`,
        example: 'Use synonyms to avoid repetition'
      });
    }

    return suggestions;
  }

  private analyzeVocabulary(text: string): VocabularyAnalysis {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const diversityScore = Math.round((uniqueWords.size / words.length) * 100);

    // Simple complexity analysis
    const complexWords = words.filter(word => word.length > 6);
    const complexWordSet = [...new Set(complexWords)];

    // Determine level based on vocabulary complexity
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    let level: 'beginner' | 'intermediate' | 'advanced';
    
    if (avgWordLength < 4.5) {
      level = 'beginner';
    } else if (avgWordLength < 5.5) {
      level = 'intermediate';
    } else {
      level = 'advanced';
    }

    // Suggest alternatives for complex words
    const suggestedAlternatives = complexWordSet.slice(0, 5).map(word => ({
      word,
      alternatives: this.getSimplerAlternatives(word)
    }));

    return {
      level,
      complexWords: complexWordSet,
      suggestedAlternatives,
      diversityScore
    };
  }

  private analyzeWordFrequency(text: string): Record<string, number> {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 3) { // Ignore very short words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    return frequency;
  }

  private getSimplerAlternatives(word: string): string[] {
    const alternatives: Record<string, string[]> = {
      'utilize': ['use'],
      'demonstrate': ['show'],
      'facilitate': ['help', 'enable'],
      'subsequent': ['next', 'following'],
      'commence': ['start', 'begin'],
      'terminate': ['end', 'stop'],
      'insufficient': ['not enough'],
      'approximately': ['about', 'around'],
      'immediately': ['right away', 'now'],
      'significantly': ['greatly', 'much']
    };
    
    return alternatives[word.toLowerCase()] || [];
  }

  getTemplates(type?: string, level?: string): WritingTemplate[] {
    let filtered = this.templates;
    
    if (type) {
      filtered = filtered.filter(t => t.type === type);
    }
    
    if (level) {
      filtered = filtered.filter(t => t.level === level);
    }
    
    return filtered;
  }

  getTemplate(id: string): WritingTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }

  async improveText(text: string, focus?: string): Promise<{
    improvedText: string;
    changes: Array<{ original: string; improved: string; reason: string }>;
  }> {
    const analysis = await this.analyzeText(text);
    let improvedText = text;
    const changes: Array<{ original: string; improved: string; reason: string }> = [];

    // Apply grammar corrections
    analysis.errors.forEach(error => {
      if (error.severity === 'high') {
        const original = text.substring(error.startIndex, error.endIndex);
        improvedText = improvedText.replace(original, error.suggestion);
        changes.push({
          original,
          improved: error.suggestion,
          reason: error.message
        });
      }
    });

    return {
      improvedText,
      changes
    };
  }
}

export const writingAssistant = new WritingAssistant();