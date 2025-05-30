// Advanced writing tools and assessment system
export interface WritingTemplate {
  id: string;
  type: 'argumentative' | 'descriptive' | 'narrative' | 'expository' | 'business';
  title: string;
  description: string;
  structure: WritingSection[];
  wordCountTarget: { min: number; max: number };
  timeLimit?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gradeLevel: string;
}

export interface WritingSection {
  id: string;
  title: string;
  description: string;
  wordCount: { min: number; max: number };
  tips: string[];
  examples: string[];
  requiredElements?: string[];
}

export interface WritingAssignment {
  id: string;
  templateId: string;
  title: string;
  prompt: string;
  instructions: string[];
  resources: WritingResource[];
  rubric: GradingRubric;
  dueDate?: Date;
  allowCollaboration: boolean;
}

export interface WritingResource {
  id: string;
  type: 'article' | 'video' | 'example' | 'grammar' | 'vocabulary';
  title: string;
  url?: string;
  content?: string;
  description: string;
}

export interface GradingRubric {
  criteria: GradingCriterion[];
  maxScore: number;
  passingScore: number;
}

export interface GradingCriterion {
  name: string;
  description: string;
  weight: number; // percentage
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
}

export interface WritingSubmission {
  id: string;
  assignmentId: string;
  userId: number;
  content: string;
  wordCount: number;
  submissionTime: Date;
  isDraft: boolean;
  feedback?: WritingFeedback;
  score?: number;
  peerReviews: PeerReview[];
}

export interface WritingFeedback {
  id: string;
  overallScore: number;
  criteriaScores: { [criterion: string]: number };
  strengths: string[];
  areasForImprovement: string[];
  specificComments: Comment[];
  grammarErrors: GrammarError[];
  vocabularyFeedback: VocabularyFeedback[];
  suggestions: string[];
  nextSteps: string[];
}

export interface Comment {
  id: string;
  position: { start: number; end: number };
  type: 'positive' | 'suggestion' | 'correction' | 'question';
  text: string;
  category: 'content' | 'organization' | 'language' | 'mechanics';
}

export interface GrammarError {
  position: { start: number; end: number };
  type: string;
  description: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface VocabularyFeedback {
  word: string;
  position: number;
  type: 'advanced' | 'repetitive' | 'inappropriate' | 'suggestion';
  feedback: string;
  alternatives?: string[];
}

export interface PeerReview {
  id: string;
  reviewerId: number;
  submissionId: string;
  feedback: string;
  score: number;
  criteriaScores: { [criterion: string]: number };
  isHelpful: boolean;
  timestamp: Date;
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  type: 'group_essay' | 'story_chain' | 'debate' | 'research';
  participants: number[];
  sections: ProjectSection[];
  deadline: Date;
  status: 'planning' | 'writing' | 'reviewing' | 'completed';
  chat: ChatMessage[];
}

export interface ProjectSection {
  id: string;
  title: string;
  assignedTo: number;
  content: string;
  status: 'assigned' | 'writing' | 'review' | 'approved';
  wordCount: number;
  feedback: string[];
}

export interface ChatMessage {
  id: string;
  userId: number;
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'suggestion';
}

export class AdvancedWritingSystem {
  private templates: Map<string, WritingTemplate> = new Map();
  private assignments: Map<string, WritingAssignment> = new Map();
  private submissions: Map<string, WritingSubmission> = new Map();
  private collaborativeProjects: Map<string, CollaborativeProject> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeAssignments();
  }

  private initializeTemplates(): void {
    const templates: WritingTemplate[] = [
      {
        id: 'argumentative-essay',
        type: 'argumentative',
        title: 'Argumentative Essay',
        description: 'Present and defend a position on a controversial topic',
        structure: [
          {
            id: 'intro',
            title: 'Introduction',
            description: 'Hook, background, and thesis statement',
            wordCount: { min: 100, max: 150 },
            tips: [
              'Start with an attention-grabbing hook',
              'Provide necessary background information',
              'End with a clear thesis statement'
            ],
            examples: [
              'In an age where technology dominates our daily lives...',
              'The debate over climate change has reached a critical point...'
            ],
            requiredElements: ['hook', 'thesis statement']
          },
          {
            id: 'body1',
            title: 'First Supporting Argument',
            description: 'Present your strongest argument with evidence',
            wordCount: { min: 150, max: 200 },
            tips: [
              'Start with a clear topic sentence',
              'Provide specific evidence',
              'Explain how evidence supports your thesis'
            ],
            examples: [
              'First and foremost, statistics show that...',
              'The primary reason for this position is...'
            ]
          },
          {
            id: 'body2',
            title: 'Second Supporting Argument',
            description: 'Present additional evidence and reasoning',
            wordCount: { min: 150, max: 200 },
            tips: [
              'Use transitional phrases to connect ideas',
              'Include expert opinions or studies',
              'Address potential counterarguments'
            ],
            examples: [
              'Furthermore, research conducted by...',
              'Additionally, experts in the field argue...'
            ]
          },
          {
            id: 'counterargument',
            title: 'Counterargument and Rebuttal',
            description: 'Address opposing views and refute them',
            wordCount: { min: 100, max: 150 },
            tips: [
              'Acknowledge the strongest opposing argument',
              'Provide evidence to refute it',
              'Show why your position is stronger'
            ],
            examples: [
              'Critics may argue that..., however...',
              'While some believe..., the evidence suggests...'
            ]
          },
          {
            id: 'conclusion',
            title: 'Conclusion',
            description: 'Restate thesis and provide final thoughts',
            wordCount: { min: 100, max: 150 },
            tips: [
              'Restate your thesis in new words',
              'Summarize main arguments',
              'End with a call to action or thought-provoking statement'
            ],
            examples: [
              'In conclusion, the evidence clearly demonstrates...',
              'As we move forward, it is essential that...'
            ]
          }
        ],
        wordCountTarget: { min: 600, max: 850 },
        timeLimit: 90,
        difficulty: 'intermediate',
        gradeLevel: 'High School'
      },
      {
        id: 'business-email',
        type: 'business',
        title: 'Professional Business Email',
        description: 'Compose clear and professional business correspondence',
        structure: [
          {
            id: 'subject',
            title: 'Subject Line',
            description: 'Clear, specific subject that summarizes the email purpose',
            wordCount: { min: 3, max: 10 },
            tips: [
              'Be specific and action-oriented',
              'Avoid vague subjects like "Hi" or "Question"',
              'Include deadlines if relevant'
            ],
            examples: [
              'Meeting Request: Marketing Strategy Discussion',
              'Action Required: Project Deadline Extension'
            ]
          },
          {
            id: 'greeting',
            title: 'Professional Greeting',
            description: 'Appropriate salutation based on relationship',
            wordCount: { min: 2, max: 8 },
            tips: [
              'Use "Dear" for formal relationships',
              'Use "Hello" for semi-formal relationships',
              'Include proper titles when appropriate'
            ],
            examples: [
              'Dear Mr. Johnson,',
              'Hello Sarah,'
            ]
          },
          {
            id: 'body',
            title: 'Email Body',
            description: 'Clear, concise message with purpose and details',
            wordCount: { min: 50, max: 200 },
            tips: [
              'State your purpose in the first sentence',
              'Use bullet points for multiple items',
              'Be specific about next steps'
            ],
            examples: [
              'I am writing to request a meeting to discuss...',
              'Please find attached the documents you requested...'
            ]
          },
          {
            id: 'closing',
            title: 'Professional Closing',
            description: 'Appropriate sign-off with contact information',
            wordCount: { min: 5, max: 20 },
            tips: [
              'Match formality level to the greeting',
              'Include your full name and title',
              'Add contact information if needed'
            ],
            examples: [
              'Best regards,\nJohn Smith\nMarketing Manager',
              'Sincerely,\nSarah Johnson'
            ]
          }
        ],
        wordCountTarget: { min: 80, max: 250 },
        difficulty: 'intermediate',
        gradeLevel: 'Professional'
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeAssignments(): void {
    const rubric: GradingRubric = {
      criteria: [
        {
          name: 'Content & Ideas',
          description: 'Quality and relevance of ideas, evidence, and arguments',
          weight: 30,
          levels: [
            { score: 4, label: 'Excellent', description: 'Exceptional ideas with strong evidence' },
            { score: 3, label: 'Good', description: 'Clear ideas with adequate evidence' },
            { score: 2, label: 'Fair', description: 'Basic ideas with limited evidence' },
            { score: 1, label: 'Poor', description: 'Unclear ideas with little evidence' }
          ]
        },
        {
          name: 'Organization',
          description: 'Structure, flow, and logical progression of ideas',
          weight: 25,
          levels: [
            { score: 4, label: 'Excellent', description: 'Clear, logical structure with smooth transitions' },
            { score: 3, label: 'Good', description: 'Generally well-organized with some transitions' },
            { score: 2, label: 'Fair', description: 'Basic organization with unclear transitions' },
            { score: 1, label: 'Poor', description: 'Poor organization with no clear structure' }
          ]
        },
        {
          name: 'Language Use',
          description: 'Grammar, vocabulary, and sentence structure',
          weight: 25,
          levels: [
            { score: 4, label: 'Excellent', description: 'Varied vocabulary with few grammar errors' },
            { score: 3, label: 'Good', description: 'Good vocabulary with minor grammar errors' },
            { score: 2, label: 'Fair', description: 'Limited vocabulary with some grammar errors' },
            { score: 1, label: 'Poor', description: 'Poor vocabulary with frequent grammar errors' }
          ]
        },
        {
          name: 'Mechanics',
          description: 'Spelling, punctuation, and formatting',
          weight: 20,
          levels: [
            { score: 4, label: 'Excellent', description: 'Virtually no mechanical errors' },
            { score: 3, label: 'Good', description: 'Few mechanical errors that don\'t interfere' },
            { score: 2, label: 'Fair', description: 'Some mechanical errors that may interfere' },
            { score: 1, label: 'Poor', description: 'Many mechanical errors that interfere significantly' }
          ]
        }
      ],
      maxScore: 16,
      passingScore: 10
    };

    const assignments: WritingAssignment[] = [
      {
        id: 'climate-change-essay',
        templateId: 'argumentative-essay',
        title: 'Climate Change Action Essay',
        prompt: 'Should governments implement stricter environmental regulations to combat climate change, even if it means higher costs for businesses and consumers?',
        instructions: [
          'Take a clear position on the topic',
          'Support your argument with at least 3 pieces of evidence',
          'Address at least one counterargument',
          'Use formal academic language',
          'Cite your sources properly'
        ],
        resources: [
          {
            id: 'res1',
            type: 'article',
            title: 'Understanding Climate Change Economics',
            description: 'Research on the economic impact of environmental policies',
            content: 'Climate policies can stimulate economic growth through green innovation...'
          },
          {
            id: 'res2',
            type: 'example',
            title: 'Sample Argumentative Essay',
            description: 'Example of well-structured argumentative writing',
            content: 'Example essay demonstrating proper structure and evidence use...'
          }
        ],
        rubric,
        allowCollaboration: false
      }
    ];

    assignments.forEach(assignment => {
      this.assignments.set(assignment.id, assignment);
    });
  }

  // Writing assessment and feedback methods
  analyzeWriting(content: string, assignmentId: string): WritingFeedback {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Simulate advanced writing analysis
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = wordCount / sentences.length;

    // Grammar analysis (simplified)
    const grammarErrors = this.detectGrammarErrors(content);
    
    // Vocabulary analysis
    const vocabularyFeedback = this.analyzeVocabulary(content);

    // Content analysis
    const overallScore = this.calculateOverallScore(content, assignment);

    const feedback: WritingFeedback = {
      id: `feedback-${Date.now()}`,
      overallScore,
      criteriaScores: {
        'Content & Ideas': Math.floor(overallScore * 0.3 * 4),
        'Organization': Math.floor(overallScore * 0.25 * 4),
        'Language Use': Math.floor(overallScore * 0.25 * 4),
        'Mechanics': Math.floor(overallScore * 0.20 * 4)
      },
      strengths: this.identifyStrengths(content, avgSentenceLength, grammarErrors.length),
      areasForImprovement: this.identifyWeaknesses(content, grammarErrors),
      specificComments: [],
      grammarErrors,
      vocabularyFeedback,
      suggestions: this.generateSuggestions(content, assignment),
      nextSteps: this.generateNextSteps(overallScore)
    };

    return feedback;
  }

  private detectGrammarErrors(content: string): GrammarError[] {
    const errors: GrammarError[] = [];
    
    // Simulate grammar error detection
    const commonErrors = [
      { pattern: /\bi\s/gi, replacement: 'I ', type: 'Capitalization' },
      { pattern: /\bthere\s+is\s+\w+s\b/gi, replacement: 'there are', type: 'Subject-verb agreement' },
      { pattern: /\bits\s/gi, replacement: "it's or its", type: 'Possessive vs. contraction' }
    ];

    commonErrors.forEach(error => {
      const matches = Array.from(content.matchAll(error.pattern));
      matches.forEach(match => {
        if (match.index !== undefined) {
          errors.push({
            position: { start: match.index, end: match.index + match[0].length },
            type: error.type,
            description: `Possible ${error.type.toLowerCase()} error`,
            suggestion: error.replacement,
            severity: 'medium'
          });
        }
      });
    });

    return errors.slice(0, 5); // Limit to 5 errors for demo
  }

  private analyzeVocabulary(content: string): VocabularyFeedback[] {
    const words = content.toLowerCase().split(/\W+/);
    const feedback: VocabularyFeedback[] = [];
    
    // Check for repetitive words
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 4) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    wordCount.forEach((count, word) => {
      if (count > 3) {
        feedback.push({
          word,
          position: content.toLowerCase().indexOf(word),
          type: 'repetitive',
          feedback: `The word "${word}" appears ${count} times. Consider using synonyms.`,
          alternatives: this.getSynonyms(word)
        });
      }
    });

    return feedback.slice(0, 3); // Limit for demo
  }

  private getSynonyms(word: string): string[] {
    const synonymMap: { [key: string]: string[] } = {
      'good': ['excellent', 'outstanding', 'superior', 'remarkable'],
      'bad': ['poor', 'inadequate', 'inferior', 'unacceptable'],
      'big': ['large', 'enormous', 'massive', 'substantial'],
      'small': ['tiny', 'miniature', 'compact', 'minute'],
      'important': ['crucial', 'vital', 'significant', 'essential']
    };

    return synonymMap[word] || [];
  }

  private calculateOverallScore(content: string, assignment: WritingAssignment): number {
    const wordCount = content.split(/\s+/).length;
    const template = this.templates.get(assignment.templateId);
    
    if (!template) return 0.5;

    // Score based on word count
    const targetMin = template.wordCountTarget.min;
    const targetMax = template.wordCountTarget.max;
    let wordCountScore = 1.0;

    if (wordCount < targetMin) {
      wordCountScore = wordCount / targetMin;
    } else if (wordCount > targetMax * 1.2) {
      wordCountScore = 0.8;
    }

    // Score based on structure (simplified)
    const hasIntroduction = content.toLowerCase().includes('introduction') || 
                           content.toLowerCase().includes('firstly') ||
                           content.toLowerCase().includes('to begin');
    const hasConclusion = content.toLowerCase().includes('conclusion') ||
                         content.toLowerCase().includes('in summary') ||
                         content.toLowerCase().includes('to conclude');
    
    const structureScore = (hasIntroduction ? 0.5 : 0) + (hasConclusion ? 0.5 : 0);

    // Overall score calculation
    return Math.min(1.0, (wordCountScore * 0.4 + structureScore * 0.6));
  }

  private identifyStrengths(content: string, avgSentenceLength: number, errorCount: number): string[] {
    const strengths: string[] = [];

    if (avgSentenceLength > 15 && avgSentenceLength < 25) {
      strengths.push('Good sentence variety and length');
    }

    if (errorCount < 3) {
      strengths.push('Strong grammar and mechanics');
    }

    if (content.includes('however') || content.includes('furthermore') || content.includes('therefore')) {
      strengths.push('Effective use of transitional words');
    }

    return strengths.slice(0, 3);
  }

  private identifyWeaknesses(content: string, errors: GrammarError[]): string[] {
    const weaknesses: string[] = [];

    if (errors.length > 5) {
      weaknesses.push('Focus on grammar and mechanics');
    }

    if (!content.includes('evidence') && !content.includes('research') && !content.includes('study')) {
      weaknesses.push('Include more evidence to support arguments');
    }

    return weaknesses;
  }

  private generateSuggestions(content: string, assignment: WritingAssignment): string[] {
    return [
      'Consider adding more specific examples to support your arguments',
      'Try varying your sentence structure for better flow',
      'Include transitional phrases to improve coherence',
      'Proofread for grammar and spelling errors before submitting'
    ];
  }

  private generateNextSteps(score: number): string[] {
    if (score > 0.8) {
      return [
        'Practice more advanced writing techniques',
        'Focus on sophisticated vocabulary usage',
        'Try more challenging writing assignments'
      ];
    } else if (score > 0.6) {
      return [
        'Work on paragraph organization',
        'Practice using evidence effectively',
        'Review grammar fundamentals'
      ];
    } else {
      return [
        'Focus on basic paragraph structure',
        'Practice simple sentence construction',
        'Review fundamental grammar rules'
      ];
    }
  }

  // Public methods
  getTemplates(type?: string, difficulty?: string): WritingTemplate[] {
    let templates = Array.from(this.templates.values());

    if (type) {
      templates = templates.filter(t => t.type === type);
    }

    if (difficulty) {
      templates = templates.filter(t => t.difficulty === difficulty);
    }

    return templates;
  }

  getAssignments(templateId?: string): WritingAssignment[] {
    let assignments = Array.from(this.assignments.values());

    if (templateId) {
      assignments = assignments.filter(a => a.templateId === templateId);
    }

    return assignments;
  }

  submitWriting(assignmentId: string, userId: number, content: string, isDraft: boolean = false): WritingSubmission {
    const submissionId = `submission-${Date.now()}-${userId}`;
    const wordCount = content.split(/\s+/).length;

    const submission: WritingSubmission = {
      id: submissionId,
      assignmentId,
      userId,
      content,
      wordCount,
      submissionTime: new Date(),
      isDraft,
      peerReviews: []
    };

    // Generate feedback if not a draft
    if (!isDraft) {
      submission.feedback = this.analyzeWriting(content, assignmentId);
      submission.score = submission.feedback.overallScore * 100;
    }

    this.submissions.set(submissionId, submission);
    return submission;
  }

  getUserSubmissions(userId: number): WritingSubmission[] {
    return Array.from(this.submissions.values())
      .filter(submission => submission.userId === userId)
      .sort((a, b) => b.submissionTime.getTime() - a.submissionTime.getTime());
  }

  createCollaborativeProject(
    title: string,
    description: string,
    type: 'group_essay' | 'story_chain' | 'debate' | 'research',
    participants: number[]
  ): CollaborativeProject {
    const projectId = `project-${Date.now()}`;
    
    const project: CollaborativeProject = {
      id: projectId,
      title,
      description,
      type,
      participants,
      sections: [],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'planning',
      chat: []
    };

    this.collaborativeProjects.set(projectId, project);
    return project;
  }

  addProjectSection(projectId: string, title: string, assignedTo: number): ProjectSection {
    const project = this.collaborativeProjects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const section: ProjectSection = {
      id: `section-${Date.now()}`,
      title,
      assignedTo,
      content: '',
      status: 'assigned',
      wordCount: 0,
      feedback: []
    };

    project.sections.push(section);
    return section;
  }
}

export const advancedWritingSystem = new AdvancedWritingSystem();