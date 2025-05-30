// Peer learning network and collaborative features
export interface PeerProfile {
  userId: number;
  displayName: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: string[];
  timeZone: string;
  availability: AvailabilitySlot[];
  languageGoals: string[];
  teachingSkills: string[];
  preferredActivities: string[];
  rating: number;
  totalSessions: number;
  verified: boolean;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;
  timeZone: string;
}

export interface LanguageExchange {
  id: string;
  participants: number[];
  language1: string;
  language2: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  sessionHistory: ExchangeSession[];
  schedule: ExchangeSchedule;
  preferences: ExchangePreferences;
  createdAt: Date;
  lastActivity: Date;
}

export interface ExchangeSession {
  id: string;
  exchangeId: string;
  date: Date;
  duration: number; // minutes
  language1Time: number; // minutes spent on first language
  language2Time: number; // minutes spent on second language
  topics: string[];
  activities: string[];
  feedback: SessionFeedback[];
  notes: string;
  rating: number;
  completed: boolean;
}

export interface SessionFeedback {
  fromUserId: number;
  toUserId: number;
  helpfulness: number; // 1-5
  patience: number; // 1-5
  knowledge: number; // 1-5
  communication: number; // 1-5
  comments: string;
  suggestions: string[];
}

export interface ExchangeSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'flexible';
  preferredDays: number[];
  preferredTimes: string[];
  sessionDuration: number;
  timeZone: string;
}

export interface ExchangePreferences {
  sessionStructure: 'split_time' | 'alternate_languages' | 'flexible';
  focusAreas: string[];
  communicationStyle: 'formal' | 'casual' | 'mixed';
  correctionStyle: 'immediate' | 'end_of_conversation' | 'minimal';
  activities: string[];
}

export interface DiscussionForum {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  moderators: number[];
  topics: ForumTopic[];
  rules: string[];
  participants: number[];
  createdAt: Date;
  lastActivity: Date;
}

export interface ForumTopic {
  id: string;
  forumId: string;
  title: string;
  authorId: number;
  content: string;
  tags: string[];
  posts: ForumPost[];
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  lastReply: Date;
}

export interface ForumPost {
  id: string;
  topicId: string;
  authorId: number;
  content: string;
  parentPostId?: string; // for replies
  likes: number;
  reports: number;
  isModerated: boolean;
  attachments: PostAttachment[];
  corrections: PostCorrection[];
  createdAt: Date;
  editedAt?: Date;
}

export interface PostAttachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  description: string;
  size: number;
}

export interface PostCorrection {
  id: string;
  correctorId: number;
  originalText: string;
  correctedText: string;
  explanation: string;
  category: 'grammar' | 'vocabulary' | 'style' | 'spelling';
  helpful: boolean;
  timestamp: Date;
}

export interface MentorshipProgram {
  id: string;
  title: string;
  description: string;
  mentorId: number;
  mentees: number[];
  maxMentees: number;
  requirements: string[];
  focus: string[];
  duration: number; // weeks
  schedule: MentorSchedule;
  curriculum: MentorModule[];
  applications: MentorApplication[];
  status: 'recruiting' | 'active' | 'completed';
}

export interface MentorSchedule {
  groupSessions: ScheduleSlot[];
  individualSessions: boolean;
  sessionDuration: number;
  totalSessions: number;
}

export interface ScheduleSlot {
  dayOfWeek: number;
  time: string;
  duration: number;
  type: 'group' | 'individual' | 'optional';
}

export interface MentorModule {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  materials: ModuleMaterial[];
  assignments: ModuleAssignment[];
  assessments: ModuleAssessment[];
  duration: number; // weeks
  order: number;
}

export interface ModuleMaterial {
  type: 'reading' | 'video' | 'audio' | 'interactive';
  title: string;
  url?: string;
  content?: string;
  duration?: number;
  required: boolean;
}

export interface ModuleAssignment {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  deliverables: string[];
  dueDate: Date;
  submissionFormat: string;
  points: number;
}

export interface ModuleAssessment {
  id: string;
  type: 'quiz' | 'project' | 'presentation' | 'peer_review';
  title: string;
  description: string;
  criteria: AssessmentCriteria[];
  passingScore: number;
  attempts: number;
}

export interface AssessmentCriteria {
  name: string;
  description: string;
  weight: number;
  rubric: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
}

export interface MentorApplication {
  id: string;
  applicantId: number;
  programId: string;
  motivation: string;
  experience: string;
  goals: string[];
  availability: AvailabilitySlot[];
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface CollaborativeStory {
  id: string;
  title: string;
  genre: string;
  targetLength: number;
  currentLength: number;
  contributors: StoryContributor[];
  chapters: StoryChapter[];
  rules: StoryRule[];
  status: 'planning' | 'writing' | 'editing' | 'completed';
  maxContributors: number;
  level: string;
  deadline?: Date;
}

export interface StoryContributor {
  userId: number;
  role: 'author' | 'editor' | 'reviewer';
  chaptersAssigned: string[];
  wordsContributed: number;
  joinedAt: Date;
  lastContribution: Date;
}

export interface StoryChapter {
  id: string;
  title: string;
  authorId: number;
  content: string;
  wordCount: number;
  order: number;
  status: 'draft' | 'review' | 'approved' | 'published';
  feedback: ChapterFeedback[];
  edits: ChapterEdit[];
  deadline?: Date;
}

export interface ChapterFeedback {
  id: string;
  reviewerId: number;
  type: 'suggestion' | 'correction' | 'praise' | 'question';
  position: number; // character position
  originalText: string;
  suggestedText?: string;
  comment: string;
  category: string;
  resolved: boolean;
  timestamp: Date;
}

export interface ChapterEdit {
  id: string;
  editorId: number;
  originalText: string;
  editedText: string;
  reason: string;
  accepted: boolean;
  timestamp: Date;
}

export interface StoryRule {
  type: 'style' | 'content' | 'structure' | 'collaboration';
  description: string;
  mandatory: boolean;
}

export class PeerLearningSystem {
  private peerProfiles: Map<number, PeerProfile> = new Map();
  private languageExchanges: Map<string, LanguageExchange> = new Map();
  private discussionForums: Map<string, DiscussionForum> = new Map();
  private mentorshipPrograms: Map<string, MentorshipProgram> = new Map();
  private collaborativeStories: Map<string, CollaborativeStory> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample peer profiles
    const sampleProfile: PeerProfile = {
      userId: 2,
      displayName: 'Li Wei',
      nativeLanguage: 'Chinese (Mandarin)',
      targetLanguage: 'English',
      proficiencyLevel: 'Intermediate',
      interests: ['Technology', 'Travel', 'Movies', 'Cooking'],
      timeZone: 'Asia/Shanghai',
      availability: [
        {
          dayOfWeek: 1, // Monday
          startTime: '19:00',
          endTime: '21:00',
          timeZone: 'Asia/Shanghai'
        },
        {
          dayOfWeek: 3, // Wednesday
          startTime: '20:00',
          endTime: '22:00',
          timeZone: 'Asia/Shanghai'
        }
      ],
      languageGoals: ['Improve speaking fluency', 'Learn business English', 'Reduce accent'],
      teachingSkills: ['Chinese grammar', 'Pronunciation', 'Cultural context'],
      preferredActivities: ['Conversation practice', 'Role-playing', 'Current events discussion'],
      rating: 4.7,
      totalSessions: 23,
      verified: true
    };

    this.peerProfiles.set(2, sampleProfile);

    // Sample discussion forum
    const sampleForum: DiscussionForum = {
      id: 'intermediate-english',
      title: 'Intermediate English Learners',
      category: 'General Learning',
      level: 'Intermediate',
      description: 'A supportive community for intermediate English learners to practice and help each other',
      moderators: [1],
      topics: [
        {
          id: 'topic-1',
          forumId: 'intermediate-english',
          title: 'Common mistakes with prepositions',
          authorId: 2,
          content: 'I often struggle with using the right prepositions. Can anyone share tips for remembering when to use "in", "on", and "at" with time expressions?',
          tags: ['grammar', 'prepositions', 'help'],
          posts: [
            {
              id: 'post-1',
              topicId: 'topic-1',
              authorId: 3,
              content: 'Great question! I use this memory trick: "in" for longer periods (months, years), "on" for specific days, "at" for specific times. For example: "in January", "on Monday", "at 3 PM".',
              likes: 5,
              reports: 0,
              isModerated: false,
              attachments: [],
              corrections: [],
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
          ],
          views: 28,
          likes: 7,
          isPinned: false,
          isLocked: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ],
      rules: [
        'Be respectful and supportive',
        'Use English as much as possible',
        'Provide helpful corrections, not criticism',
        'Stay on topic',
        'No spam or self-promotion'
      ],
      participants: [1, 2, 3, 4, 5],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
    };

    this.discussionForums.set('intermediate-english', sampleForum);

    // Sample mentorship program
    const sampleProgram: MentorshipProgram = {
      id: 'business-english-mastery',
      title: 'Business English Mastery',
      description: 'A comprehensive 12-week program to master professional English communication',
      mentorId: 1,
      mentees: [],
      maxMentees: 8,
      requirements: [
        'Intermediate English level',
        'Commitment to attend weekly sessions',
        'Complete assignments on time',
        'Professional development goals'
      ],
      focus: ['Business writing', 'Presentation skills', 'Meeting participation', 'Networking'],
      duration: 12,
      schedule: {
        groupSessions: [
          {
            dayOfWeek: 2, // Tuesday
            time: '19:00',
            duration: 90,
            type: 'group'
          }
        ],
        individualSessions: true,
        sessionDuration: 60,
        totalSessions: 16
      },
      curriculum: [
        {
          id: 'module-1',
          title: 'Professional Email Communication',
          description: 'Master the art of clear, professional email writing',
          objectives: [
            'Write clear subject lines',
            'Structure emails professionally',
            'Use appropriate tone and formality',
            'Handle difficult communications'
          ],
          materials: [
            {
              type: 'reading',
              title: 'Email Best Practices Guide',
              content: 'Comprehensive guide to professional email writing...',
              required: true
            },
            {
              type: 'video',
              title: 'Email Tone and Style',
              url: '/videos/email-tone.mp4',
              duration: 15,
              required: true
            }
          ],
          assignments: [
            {
              id: 'assignment-1',
              title: 'Professional Email Portfolio',
              description: 'Write 5 different types of business emails',
              instructions: [
                'Include: inquiry, complaint, follow-up, thank you, and request emails',
                'Use appropriate formatting and tone',
                'Demonstrate professional vocabulary'
              ],
              deliverables: ['Email portfolio document', 'Self-reflection essay'],
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              submissionFormat: 'PDF document',
              points: 100
            }
          ],
          assessments: [
            {
              id: 'assessment-1',
              type: 'peer_review',
              title: 'Email Peer Review',
              description: 'Review and provide feedback on peer emails',
              criteria: [
                {
                  name: 'Clarity',
                  description: 'Message is clear and easy to understand',
                  weight: 30,
                  rubric: [
                    { score: 4, label: 'Excellent', description: 'Crystal clear, no ambiguity' },
                    { score: 3, label: 'Good', description: 'Generally clear with minor issues' },
                    { score: 2, label: 'Fair', description: 'Somewhat unclear, needs improvement' },
                    { score: 1, label: 'Poor', description: 'Confusing and unclear' }
                  ]
                }
              ],
              passingScore: 70,
              attempts: 1
            }
          ],
          duration: 2,
          order: 1
        }
      ],
      applications: [],
      status: 'recruiting'
    };

    this.mentorshipPrograms.set('business-english-mastery', sampleProgram);
  }

  // Peer matching methods
  findLanguagePartners(
    userId: number,
    targetLanguage: string,
    nativeLanguage: string,
    proficiencyLevel?: string
  ): PeerProfile[] {
    const userProfile = this.peerProfiles.get(userId);
    if (!userProfile) return [];

    return Array.from(this.peerProfiles.values())
      .filter(profile => {
        // Don't match with self
        if (profile.userId === userId) return false;
        
        // Partner's native language should be user's target language
        if (profile.nativeLanguage !== targetLanguage) return false;
        
        // Partner's target language should be user's native language
        if (profile.targetLanguage !== nativeLanguage) return false;
        
        // Optional: filter by proficiency level
        if (proficiencyLevel && profile.proficiencyLevel !== proficiencyLevel) return false;
        
        return true;
      })
      .sort((a, b) => b.rating - a.rating); // Sort by rating
  }

  createLanguageExchange(
    initiatorId: number,
    partnerId: number,
    preferences: ExchangePreferences
  ): LanguageExchange {
    const initiator = this.peerProfiles.get(initiatorId);
    const partner = this.peerProfiles.get(partnerId);
    
    if (!initiator || !partner) {
      throw new Error('User profiles not found');
    }

    const exchangeId = `exchange-${Date.now()}-${initiatorId}-${partnerId}`;
    
    const exchange: LanguageExchange = {
      id: exchangeId,
      participants: [initiatorId, partnerId],
      language1: initiator.nativeLanguage,
      language2: partner.nativeLanguage,
      status: 'pending',
      sessionHistory: [],
      schedule: {
        frequency: 'weekly',
        preferredDays: [1, 3], // Monday, Wednesday
        preferredTimes: ['19:00', '20:00'],
        sessionDuration: 60,
        timeZone: 'UTC'
      },
      preferences,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.languageExchanges.set(exchangeId, exchange);
    return exchange;
  }

  // Forum methods
  createForumTopic(
    forumId: string,
    authorId: number,
    title: string,
    content: string,
    tags: string[]
  ): ForumTopic {
    const forum = this.discussionForums.get(forumId);
    if (!forum) {
      throw new Error('Forum not found');
    }

    const topicId = `topic-${Date.now()}-${authorId}`;
    
    const topic: ForumTopic = {
      id: topicId,
      forumId,
      title,
      authorId,
      content,
      tags,
      posts: [],
      views: 0,
      likes: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date(),
      lastReply: new Date()
    };

    forum.topics.push(topic);
    forum.lastActivity = new Date();
    
    return topic;
  }

  addForumPost(
    topicId: string,
    authorId: number,
    content: string,
    parentPostId?: string
  ): ForumPost {
    // Find the topic
    let topic: ForumTopic | undefined;
    let forum: DiscussionForum | undefined;
    
    for (const f of this.discussionForums.values()) {
      topic = f.topics.find(t => t.id === topicId);
      if (topic) {
        forum = f;
        break;
      }
    }

    if (!topic || !forum) {
      throw new Error('Topic not found');
    }

    const postId = `post-${Date.now()}-${authorId}`;
    
    const post: ForumPost = {
      id: postId,
      topicId,
      authorId,
      content,
      parentPostId,
      likes: 0,
      reports: 0,
      isModerated: false,
      attachments: [],
      corrections: [],
      createdAt: new Date()
    };

    topic.posts.push(post);
    topic.lastReply = new Date();
    forum.lastActivity = new Date();
    
    return post;
  }

  addPostCorrection(
    postId: string,
    correctorId: number,
    originalText: string,
    correctedText: string,
    explanation: string,
    category: 'grammar' | 'vocabulary' | 'style' | 'spelling'
  ): PostCorrection {
    // Find the post
    let post: ForumPost | undefined;
    
    for (const forum of this.discussionForums.values()) {
      for (const topic of forum.topics) {
        post = topic.posts.find(p => p.id === postId);
        if (post) break;
      }
      if (post) break;
    }

    if (!post) {
      throw new Error('Post not found');
    }

    const correctionId = `correction-${Date.now()}-${correctorId}`;
    
    const correction: PostCorrection = {
      id: correctionId,
      correctorId,
      originalText,
      correctedText,
      explanation,
      category,
      helpful: false,
      timestamp: new Date()
    };

    post.corrections.push(correction);
    return correction;
  }

  // Collaborative story methods
  createCollaborativeStory(
    title: string,
    genre: string,
    creatorId: number,
    targetLength: number,
    maxContributors: number,
    level: string,
    rules: StoryRule[]
  ): CollaborativeStory {
    const storyId = `story-${Date.now()}-${creatorId}`;
    
    const story: CollaborativeStory = {
      id: storyId,
      title,
      genre,
      targetLength,
      currentLength: 0,
      contributors: [
        {
          userId: creatorId,
          role: 'author',
          chaptersAssigned: [],
          wordsContributed: 0,
          joinedAt: new Date(),
          lastContribution: new Date()
        }
      ],
      chapters: [],
      rules,
      status: 'planning',
      maxContributors,
      level,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    this.collaborativeStories.set(storyId, story);
    return story;
  }

  joinCollaborativeStory(storyId: string, userId: number, role: 'author' | 'editor' | 'reviewer'): boolean {
    const story = this.collaborativeStories.get(storyId);
    if (!story) return false;

    if (story.contributors.length >= story.maxContributors) return false;
    if (story.contributors.some(c => c.userId === userId)) return false;

    const contributor: StoryContributor = {
      userId,
      role,
      chaptersAssigned: [],
      wordsContributed: 0,
      joinedAt: new Date(),
      lastContribution: new Date()
    };

    story.contributors.push(contributor);
    return true;
  }

  // Public methods
  getPeerProfiles(targetLanguage?: string, proficiencyLevel?: string): PeerProfile[] {
    let profiles = Array.from(this.peerProfiles.values());

    if (targetLanguage) {
      profiles = profiles.filter(p => p.targetLanguage === targetLanguage);
    }
    if (proficiencyLevel) {
      profiles = profiles.filter(p => p.proficiencyLevel === proficiencyLevel);
    }

    return profiles.sort((a, b) => b.rating - a.rating);
  }

  getDiscussionForums(category?: string, level?: string): DiscussionForum[] {
    let forums = Array.from(this.discussionForums.values());

    if (category) {
      forums = forums.filter(f => f.category === category);
    }
    if (level) {
      forums = forums.filter(f => f.level === level);
    }

    return forums.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  getMentorshipPrograms(focus?: string, status?: string): MentorshipProgram[] {
    let programs = Array.from(this.mentorshipPrograms.values());

    if (focus) {
      programs = programs.filter(p => p.focus.includes(focus));
    }
    if (status) {
      programs = programs.filter(p => p.status === status);
    }

    return programs;
  }

  getCollaborativeStories(genre?: string, level?: string, status?: string): CollaborativeStory[] {
    let stories = Array.from(this.collaborativeStories.values());

    if (genre) {
      stories = stories.filter(s => s.genre === genre);
    }
    if (level) {
      stories = stories.filter(s => s.level === level);
    }
    if (status) {
      stories = stories.filter(s => s.status === status);
    }

    return stories.sort((a, b) => b.deadline!.getTime() - a.deadline!.getTime());
  }

  getUserExchanges(userId: number): LanguageExchange[] {
    return Array.from(this.languageExchanges.values())
      .filter(exchange => exchange.participants.includes(userId))
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }
}

export const peerLearningSystem = new PeerLearningSystem();