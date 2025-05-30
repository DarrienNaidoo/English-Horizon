// Content creation tools for user-generated lessons and vocabulary
export interface UserLesson {
  id: string;
  creatorId: number;
  title: string;
  description: string;
  content: LessonContent;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  isPublic: boolean;
  language: string;
  estimatedDuration: number;
  difficulty: number; // 1-10
  likes: number;
  shares: number;
  views: number;
  rating: number;
  reviews: LessonReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonContent {
  sections: LessonSection[];
  objectives: string[];
  prerequisites: string[];
  resources: LessonResource[];
  exercises: Exercise[];
  assessments: Assessment[];
}

export interface LessonSection {
  id: string;
  title: string;
  type: 'text' | 'audio' | 'video' | 'interactive' | 'quiz';
  content: string;
  mediaUrl?: string;
  notes?: string[];
  duration?: number;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'link' | 'document' | 'audio' | 'video' | 'image';
  url: string;
  description: string;
}

export interface Exercise {
  id: string;
  type: 'fill-blank' | 'multiple-choice' | 'matching' | 'ordering' | 'speaking' | 'writing';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  hints?: string[];
}

export interface Assessment {
  id: string;
  title: string;
  questions: Exercise[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

export interface LessonReview {
  id: string;
  userId: number;
  rating: number; // 1-5
  comment: string;
  helpfulVotes: number;
  timestamp: Date;
}

export interface CustomVocabularyList {
  id: string;
  creatorId: number;
  title: string;
  description: string;
  words: VocabularyWord[];
  category: string;
  level: string;
  isPublic: boolean;
  isSpacedRepetition: boolean;
  reviewIntervals: number[]; // days between reviews
  subscribers: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation?: string;
  audioUrl?: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  difficulty: number; // 1-10
  frequency: number; // usage frequency
  mnemonics?: string[];
  images?: string[];
  culturalNotes?: string[];
}

export interface SpacedRepetitionCard {
  id: string;
  userId: number;
  wordId: string;
  interval: number; // days until next review
  repetition: number; // number of successful reviews
  easeFactor: number; // difficulty multiplier
  nextReviewDate: Date;
  lastReviewDate: Date;
  correctStreak: number;
  totalReviews: number;
  averageResponseTime: number;
}

export interface UserStory {
  id: string;
  authorId: number;
  title: string;
  content: string;
  level: string;
  genre: 'adventure' | 'mystery' | 'romance' | 'sci-fi' | 'slice-of-life' | 'educational';
  wordCount: number;
  readingTime: number;
  vocabulary: string[]; // highlighted vocabulary words
  grammar: string[]; // grammar points featured
  culturalElements: string[];
  isPublic: boolean;
  allowComments: boolean;
  likes: number;
  bookmarks: number;
  comments: StoryComment[];
  chapters: StoryChapter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  publishedAt?: Date;
}

export interface StoryComment {
  id: string;
  userId: number;
  content: string;
  isHighlight: boolean;
  position?: number; // character position for inline comments
  replies: StoryReply[];
  likes: number;
  timestamp: Date;
}

export interface StoryReply {
  id: string;
  userId: number;
  content: string;
  likes: number;
  timestamp: Date;
}

export interface VideoLesson {
  id: string;
  creatorId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  level: string;
  category: string;
  tags: string[];
  transcript: string;
  subtitles: Subtitle[];
  chapters: VideoChapter[];
  exercises: Exercise[];
  resources: LessonResource[];
  views: number;
  likes: number;
  rating: number;
  comments: VideoComment[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
  language: string;
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface VideoComment {
  id: string;
  userId: number;
  content: string;
  timestamp: number; // video timestamp
  likes: number;
  replies: VideoReply[];
  createdAt: Date;
}

export interface VideoReply {
  id: string;
  userId: number;
  content: string;
  likes: number;
  timestamp: Date;
}

export class ContentCreationSystem {
  private userLessons: Map<string, UserLesson> = new Map();
  private vocabularyLists: Map<string, CustomVocabularyList> = new Map();
  private spacedRepetitionCards: Map<string, SpacedRepetitionCard[]> = new Map();
  private userStories: Map<string, UserStory> = new Map();
  private videoLessons: Map<string, VideoLesson> = new Map();

  constructor() {
    this.initializeSampleContent();
  }

  private initializeSampleContent(): void {
    // Initialize with some sample user-generated content
    const sampleLesson: UserLesson = {
      id: 'lesson-1',
      creatorId: 101,
      title: 'Everyday English Conversations',
      description: 'Learn common phrases for daily situations like shopping, dining, and social interactions',
      content: {
        sections: [
          {
            id: 'section-1',
            title: 'Introduction',
            type: 'text',
            content: 'In this lesson, we will explore essential phrases for everyday conversations in English-speaking countries.',
            duration: 5
          },
          {
            id: 'section-2',
            title: 'Restaurant Conversations',
            type: 'interactive',
            content: 'Practice ordering food and making requests at restaurants',
            duration: 15
          }
        ],
        objectives: [
          'Master basic restaurant vocabulary',
          'Practice polite request forms',
          'Understand cultural dining etiquette'
        ],
        prerequisites: ['Basic English grammar', 'Elementary vocabulary'],
        resources: [
          {
            id: 'resource-1',
            title: 'Common Restaurant Phrases PDF',
            type: 'document',
            url: '/resources/restaurant-phrases.pdf',
            description: 'Downloadable reference guide'
          }
        ],
        exercises: [
          {
            id: 'exercise-1',
            type: 'multiple-choice',
            question: 'What do you say when you want to order food?',
            options: ['I want food', 'Could I have...', 'Give me food', 'Food please'],
            correctAnswer: 'Could I have...',
            explanation: 'Using "Could I have..." is polite and appropriate',
            points: 2
          }
        ],
        assessments: [
          {
            id: 'assessment-1',
            title: 'Restaurant Role-play',
            questions: [],
            passingScore: 70,
            timeLimit: 300,
            attempts: 3
          }
        ]
      },
      level: 'intermediate',
      category: 'conversation',
      tags: ['restaurant', 'daily-life', 'politeness'],
      isPublic: true,
      language: 'English',
      estimatedDuration: 30,
      difficulty: 6,
      likes: 45,
      shares: 12,
      views: 234,
      rating: 4.7,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userLessons.set(sampleLesson.id, sampleLesson);

    const sampleVocabList: CustomVocabularyList = {
      id: 'vocab-1',
      creatorId: 101,
      title: 'Business English Essentials',
      description: 'Key vocabulary for professional communication and business meetings',
      words: [
        {
          id: 'word-1',
          word: 'collaborate',
          definition: 'to work jointly on an activity or project',
          partOfSpeech: 'verb',
          pronunciation: '/kəˈlæbəreɪt/',
          examples: [
            'We need to collaborate on this project to meet the deadline.',
            'The teams collaborated effectively to solve the problem.'
          ],
          synonyms: ['cooperate', 'work together', 'partner'],
          antonyms: ['compete', 'oppose'],
          difficulty: 6,
          frequency: 8,
          mnemonics: ['Co-labor-ate = work together with labor'],
          culturalNotes: ['Highly valued in Western business culture']
        },
        {
          id: 'word-2',
          word: 'stakeholder',
          definition: 'a person with an interest or concern in something',
          partOfSpeech: 'noun',
          pronunciation: '/ˈsteɪkˌhoʊldər/',
          examples: [
            'All stakeholders must approve the new policy.',
            'We consulted with key stakeholders before making the decision.'
          ],
          synonyms: ['interested party', 'participant'],
          antonyms: [],
          difficulty: 7,
          frequency: 9,
          mnemonics: ['Someone who holds a stake (interest) in the outcome']
        }
      ],
      category: 'business',
      level: 'advanced',
      isPublic: true,
      isSpacedRepetition: true,
      reviewIntervals: [1, 3, 7, 14, 30, 90],
      subscribers: 156,
      rating: 4.8,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vocabularyLists.set(sampleVocabList.id, sampleVocabList);
  }

  // Lesson Creation
  createLesson(creatorId: number, lessonData: Omit<UserLesson, 'id' | 'creatorId' | 'likes' | 'shares' | 'views' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'>): UserLesson {
    const lessonId = `lesson-${Date.now()}-${creatorId}`;
    const lesson: UserLesson = {
      ...lessonData,
      id: lessonId,
      creatorId,
      likes: 0,
      shares: 0,
      views: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userLessons.set(lessonId, lesson);
    return lesson;
  }

  updateLesson(lessonId: string, updates: Partial<UserLesson>): UserLesson | null {
    const lesson = this.userLessons.get(lessonId);
    if (!lesson) return null;

    Object.assign(lesson, updates);
    lesson.updatedAt = new Date();
    return lesson;
  }

  getLessons(creatorId?: number, category?: string, level?: string, isPublic?: boolean): UserLesson[] {
    let filtered = Array.from(this.userLessons.values());

    if (creatorId) {
      filtered = filtered.filter(lesson => lesson.creatorId === creatorId);
    }

    if (category) {
      filtered = filtered.filter(lesson => lesson.category === category);
    }

    if (level) {
      filtered = filtered.filter(lesson => lesson.level === level);
    }

    if (isPublic !== undefined) {
      filtered = filtered.filter(lesson => lesson.isPublic === isPublic);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Vocabulary List Creation
  createVocabularyList(creatorId: number, listData: Omit<CustomVocabularyList, 'id' | 'creatorId' | 'subscribers' | 'rating' | 'createdAt' | 'updatedAt'>): CustomVocabularyList {
    const listId = `vocab-${Date.now()}-${creatorId}`;
    const vocabularyList: CustomVocabularyList = {
      ...listData,
      id: listId,
      creatorId,
      subscribers: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vocabularyLists.set(listId, vocabularyList);
    return vocabularyList;
  }

  addWordToList(listId: string, word: Omit<VocabularyWord, 'id'>): VocabularyWord | null {
    const list = this.vocabularyLists.get(listId);
    if (!list) return null;

    const wordId = `word-${Date.now()}`;
    const vocabularyWord: VocabularyWord = {
      ...word,
      id: wordId
    };

    list.words.push(vocabularyWord);
    list.updatedAt = new Date();
    return vocabularyWord;
  }

  // Spaced Repetition System
  createSpacedRepetitionCard(userId: number, wordId: string): SpacedRepetitionCard {
    const card: SpacedRepetitionCard = {
      id: `card-${Date.now()}-${userId}`,
      userId,
      wordId,
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      lastReviewDate: new Date(),
      correctStreak: 0,
      totalReviews: 0,
      averageResponseTime: 0
    };

    const userCards = this.spacedRepetitionCards.get(userId.toString()) || [];
    userCards.push(card);
    this.spacedRepetitionCards.set(userId.toString(), userCards);

    return card;
  }

  reviewSpacedRepetitionCard(cardId: string, userId: number, correct: boolean, responseTime: number): SpacedRepetitionCard | null {
    const userCards = this.spacedRepetitionCards.get(userId.toString()) || [];
    const card = userCards.find(c => c.id === cardId);
    if (!card) return null;

    card.totalReviews += 1;
    card.lastReviewDate = new Date();
    card.averageResponseTime = (card.averageResponseTime * (card.totalReviews - 1) + responseTime) / card.totalReviews;

    if (correct) {
      card.correctStreak += 1;
      card.repetition += 1;
      
      // SM-2 algorithm for spaced repetition
      if (card.repetition === 1) {
        card.interval = 1;
      } else if (card.repetition === 2) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }

      card.easeFactor = card.easeFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02));
      card.easeFactor = Math.max(1.3, card.easeFactor);
    } else {
      card.correctStreak = 0;
      card.repetition = 0;
      card.interval = 1;
    }

    card.nextReviewDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
    return card;
  }

  getDueCards(userId: number): SpacedRepetitionCard[] {
    const userCards = this.spacedRepetitionCards.get(userId.toString()) || [];
    const now = new Date();
    
    return userCards
      .filter(card => card.nextReviewDate <= now)
      .sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());
  }

  // Story Creation
  createStory(authorId: number, storyData: Omit<UserStory, 'id' | 'authorId' | 'likes' | 'bookmarks' | 'comments' | 'createdAt' | 'updatedAt'>): UserStory {
    const storyId = `story-${Date.now()}-${authorId}`;
    const story: UserStory = {
      ...storyData,
      id: storyId,
      authorId,
      likes: 0,
      bookmarks: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userStories.set(storyId, story);
    return story;
  }

  addStoryComment(storyId: string, userId: number, content: string, position?: number): StoryComment | null {
    const story = this.userStories.get(storyId);
    if (!story || !story.allowComments) return null;

    const comment: StoryComment = {
      id: `comment-${Date.now()}`,
      userId,
      content,
      isHighlight: false,
      position,
      replies: [],
      likes: 0,
      timestamp: new Date()
    };

    story.comments.push(comment);
    return comment;
  }

  getStories(authorId?: number, genre?: string, level?: string, isPublic?: boolean): UserStory[] {
    let filtered = Array.from(this.userStories.values());

    if (authorId) {
      filtered = filtered.filter(story => story.authorId === authorId);
    }

    if (genre) {
      filtered = filtered.filter(story => story.genre === genre);
    }

    if (level) {
      filtered = filtered.filter(story => story.level === level);
    }

    if (isPublic !== undefined) {
      filtered = filtered.filter(story => story.isPublic === isPublic);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Video Lesson Creation
  createVideoLesson(creatorId: number, videoData: Omit<VideoLesson, 'id' | 'creatorId' | 'views' | 'likes' | 'rating' | 'comments' | 'createdAt' | 'updatedAt'>): VideoLesson {
    const videoId = `video-${Date.now()}-${creatorId}`;
    const video: VideoLesson = {
      ...videoData,
      id: videoId,
      creatorId,
      views: 0,
      likes: 0,
      rating: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.videoLessons.set(videoId, video);
    return video;
  }

  addVideoComment(videoId: string, userId: number, content: string, timestamp: number): VideoComment | null {
    const video = this.videoLessons.get(videoId);
    if (!video) return null;

    const comment: VideoComment = {
      id: `vcomment-${Date.now()}`,
      userId,
      content,
      timestamp,
      likes: 0,
      replies: [],
      createdAt: new Date()
    };

    video.comments.push(comment);
    return comment;
  }

  getVideoLessons(creatorId?: number, category?: string, level?: string): VideoLesson[] {
    let filtered = Array.from(this.videoLessons.values());

    if (creatorId) {
      filtered = filtered.filter(video => video.creatorId === creatorId);
    }

    if (category) {
      filtered = filtered.filter(video => video.category === category);
    }

    if (level) {
      filtered = filtered.filter(video => video.level === level);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Analytics and Discovery
  getPopularContent(type: 'lessons' | 'vocabulary' | 'stories' | 'videos', limit: number = 10): any[] {
    let content: any[] = [];

    switch (type) {
      case 'lessons':
        content = Array.from(this.userLessons.values())
          .filter(lesson => lesson.isPublic)
          .sort((a, b) => (b.likes + b.shares + b.views) - (a.likes + a.shares + a.views));
        break;
      case 'vocabulary':
        content = Array.from(this.vocabularyLists.values())
          .filter(list => list.isPublic)
          .sort((a, b) => (b.subscribers + b.rating * 20) - (a.subscribers + a.rating * 20));
        break;
      case 'stories':
        content = Array.from(this.userStories.values())
          .filter(story => story.isPublic)
          .sort((a, b) => (b.likes + b.bookmarks) - (a.likes + a.bookmarks));
        break;
      case 'videos':
        content = Array.from(this.videoLessons.values())
          .filter(video => video.isPublic)
          .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10));
        break;
    }

    return content.slice(0, limit);
  }

  searchContent(query: string, type?: string): any[] {
    const results: any[] = [];
    const searchTerm = query.toLowerCase();

    // Search lessons
    if (!type || type === 'lessons') {
      const lessonResults = Array.from(this.userLessons.values())
        .filter(lesson => 
          lesson.isPublic && (
            lesson.title.toLowerCase().includes(searchTerm) ||
            lesson.description.toLowerCase().includes(searchTerm) ||
            lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          )
        );
      results.push(...lessonResults);
    }

    // Search vocabulary lists
    if (!type || type === 'vocabulary') {
      const vocabResults = Array.from(this.vocabularyLists.values())
        .filter(list =>
          list.isPublic && (
            list.title.toLowerCase().includes(searchTerm) ||
            list.description.toLowerCase().includes(searchTerm) ||
            list.words.some(word => word.word.toLowerCase().includes(searchTerm))
          )
        );
      results.push(...vocabResults);
    }

    return results;
  }
}

export const contentCreationSystem = new ContentCreationSystem();