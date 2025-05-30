import express from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Core API routes with all features
app.get("/api/users", (req, res) => {
  res.json([{
    id: 1,
    username: "liwei",
    firstName: "Li",
    lastName: "Wei",
    level: "intermediate",
    xp: 1250,
    streak: 12,
    lastActiveDate: new Date(),
    preferences: {},
    createdAt: new Date()
  }]);
});

app.get("/api/daily-challenge", (req, res) => {
  res.json({
    id: 1,
    title: "Describe the Mid-Autumn Festival",
    description: "Practice describing traditional festivals and their cultural significance",
    date: new Date(),
    content: {
      type: "speaking",
      prompt: "Describe the Mid-Autumn Festival celebrations in your culture",
      difficulty: "intermediate"
    },
    xpReward: 50,
    completionRequirement: {
      minWords: 100,
      timeLimit: 300
    }
  });
});

app.get("/api/lessons", (req, res) => {
  const { level, unit } = req.query;
  
  const lessons = [
    // Unit 1: My Daily Life
    {
      id: 1,
      title: "Morning Routine",
      description: "Describe your daily morning activities in English",
      unit: 1,
      unitName: "My Daily Life",
      level: "beginner",
      category: "speaking",
      xpReward: 25,
      estimatedMinutes: 15,
      components: {
        listening: "Dialogue: What time do you wake up?",
        vocabulary: ["wake up", "breakfast", "brush teeth", "uniform", "school bus"],
        grammar: "Present simple tense: I wake up at 7 AM",
        writing: "Reorder sentences about morning routines",
        speaking: "Record yourself describing your morning",
        game: "Match time with daily activities",
        quiz: "5 questions about daily routines"
      },
      chineseContext: "Compare Chinese and Western breakfast habits"
    },
    {
      id: 2,
      title: "School Life",
      description: "Talk about your school day and subjects",
      unit: 1,
      unitName: "My Daily Life",
      level: "beginner",
      category: "vocabulary",
      xpReward: 30,
      estimatedMinutes: 20,
      components: {
        listening: "Student talking about favorite subjects",
        vocabulary: ["mathematics", "Chinese class", "PE", "homework", "teacher"],
        grammar: "Expressing preferences: I like... / I don't like...",
        writing: "Write 3 sentences about your school subjects",
        speaking: "Describe your favorite school subject",
        game: "School subject matching game",
        quiz: "Quiz about school vocabulary"
      },
      chineseContext: "Differences between Chinese and international schools"
    },

    // Unit 2: Food & Culture
    {
      id: 3,
      title: "Chinese Dishes in English",
      description: "Learn to describe traditional Chinese food",
      unit: 2,
      unitName: "Food & Culture",
      level: "intermediate",
      category: "vocabulary",
      xpReward: 35,
      estimatedMinutes: 25,
      components: {
        listening: "Ordering food at a Chinese restaurant in English",
        vocabulary: ["dumplings", "hot pot", "kung pao chicken", "sweet and sour", "stir-fry"],
        grammar: "Food adjectives: spicy, sweet, sour, crispy",
        writing: "Describe your favorite Chinese dish to a foreign friend",
        speaking: "Explain how to eat with chopsticks",
        game: "Match Chinese dishes with descriptions",
        quiz: "Food culture comparison quiz"
      },
      chineseContext: "Introducing Chinese cuisine to international friends"
    },
    {
      id: 4,
      title: "Restaurant Conversations",
      description: "Order food and interact with staff in English",
      unit: 2,
      unitName: "Food & Culture",
      level: "intermediate",
      category: "speaking",
      xpReward: 40,
      estimatedMinutes: 30,
      components: {
        listening: "Dialogue between customer and waiter",
        vocabulary: ["menu", "recommendation", "appetizer", "main course", "bill"],
        grammar: "Polite requests: Could I have... / Would you recommend...",
        writing: "Write a restaurant review",
        speaking: "Role-play ordering food in a restaurant",
        game: "Restaurant scenario simulation",
        quiz: "Restaurant etiquette quiz"
      },
      chineseContext: "Dining customs in China vs. Western countries"
    },

    // Unit 3: Technology & Me
    {
      id: 5,
      title: "My Digital Life",
      description: "Talk about apps, games, and online activities",
      unit: 3,
      unitName: "Technology & Me",
      level: "beginner",
      category: "vocabulary",
      xpReward: 30,
      estimatedMinutes: 20,
      components: {
        listening: "Teenagers discussing favorite apps",
        vocabulary: ["smartphone", "WeChat", "TikTok", "gaming", "livestream"],
        grammar: "Frequency adverbs: always, often, sometimes, never",
        writing: "Describe your phone usage habits",
        speaking: "Talk about your favorite app",
        game: "Tech vocabulary matching",
        quiz: "Digital habits survey"
      },
      chineseContext: "Popular Chinese apps vs. international apps"
    },

    // Unit 4: Future Dreams
    {
      id: 6,
      title: "Career Aspirations",
      description: "Express your future goals and dream job",
      unit: 4,
      unitName: "Future Dreams",
      level: "intermediate",
      category: "speaking",
      xpReward: 45,
      estimatedMinutes: 35,
      components: {
        listening: "Professionals talking about their careers",
        vocabulary: ["engineer", "doctor", "entrepreneur", "programmer", "designer"],
        grammar: "Future tense: I want to become... / I will...",
        writing: "Write about your 10-year plan",
        speaking: "Present your dream career",
        game: "Career path decision game",
        quiz: "Future goals discussion"
      },
      chineseContext: "Popular careers in modern China"
    },

    // Unit 5: Famous People
    {
      id: 7,
      title: "Chinese Innovators",
      description: "Learn about famous Chinese entrepreneurs and inventors",
      unit: 5,
      unitName: "Famous People",
      level: "advanced",
      category: "reading",
      xpReward: 50,
      estimatedMinutes: 40,
      components: {
        listening: "Biography of Jack Ma or other Chinese innovators",
        vocabulary: ["innovation", "entrepreneur", "achievement", "influence", "legacy"],
        grammar: "Past tense storytelling and achievements",
        writing: "Write a short biography of someone you admire",
        speaking: "Present about a Chinese historical figure",
        game: "Famous people timeline game",
        quiz: "Chinese innovators knowledge test"
      },
      chineseContext: "China's contribution to global technology and culture"
    },

    // Unit 6: Travel & Places
    {
      id: 8,
      title: "Exploring China",
      description: "Describe famous Chinese landmarks and cities",
      unit: 6,
      unitName: "Travel & Places",
      level: "intermediate",
      category: "vocabulary",
      xpReward: 40,
      estimatedMinutes: 30,
      components: {
        listening: "Travel guide describing Beijing attractions",
        vocabulary: ["Great Wall", "Forbidden City", "Temple of Heaven", "hutong", "high-speed train"],
        grammar: "Describing locations: located in, famous for, built in",
        writing: "Create a travel itinerary for foreign visitors",
        speaking: "Be a tour guide for your hometown",
        game: "Chinese landmarks quiz",
        quiz: "Geography and culture knowledge"
      },
      chineseContext: "Promoting Chinese tourism to international visitors"
    },

    // Unit 7: Emotions & Opinions
    {
      id: 9,
      title: "Expressing Feelings",
      description: "Learn to express emotions and opinions clearly",
      unit: 7,
      unitName: "Emotions & Opinions",
      level: "intermediate",
      category: "speaking",
      xpReward: 35,
      estimatedMinutes: 25,
      components: {
        listening: "Students sharing opinions about school policies",
        vocabulary: ["excited", "frustrated", "confident", "anxious", "optimistic"],
        grammar: "Opinion expressions: I think... / In my opinion... / I believe...",
        writing: "Write your opinion on a current topic",
        speaking: "Debate a school-related topic",
        game: "Emotion charades",
        quiz: "Opinion and feeling expressions"
      },
      chineseContext: "Cultural differences in expressing emotions"
    },

    // Unit 8: Social Media World
    {
      id: 10,
      title: "Online Communication",
      description: "Navigate social media and digital communication",
      unit: 8,
      unitName: "Social Media World",
      level: "beginner",
      category: "writing",
      xpReward: 30,
      estimatedMinutes: 20,
      components: {
        listening: "Teens discussing social media trends",
        vocabulary: ["post", "like", "share", "comment", "follower", "hashtag"],
        grammar: "Internet slang and abbreviations: LOL, BRB, ASAP",
        writing: "Write social media posts in English",
        speaking: "Discuss social media impact",
        game: "Social media vocabulary game",
        quiz: "Digital communication quiz"
      },
      chineseContext: "Differences between Chinese and Western social media"
    },

    // Unit 9: Chinese Festivals in English
    {
      id: 11,
      title: "Spring Festival Traditions",
      description: "Explain Chinese New Year to international friends",
      unit: 9,
      unitName: "Chinese Festivals in English",
      level: "intermediate",
      category: "cultural",
      xpReward: 45,
      estimatedMinutes: 35,
      components: {
        listening: "Family discussing Spring Festival preparations",
        vocabulary: ["red envelope", "fireworks", "family reunion", "zodiac", "lion dance"],
        grammar: "Cultural explanation patterns: We celebrate... / It's a tradition to...",
        writing: "Write an invitation to Spring Festival celebration",
        speaking: "Explain Spring Festival customs",
        game: "Festival traditions matching",
        quiz: "Chinese festivals knowledge"
      },
      chineseContext: "Authentic Chinese cultural content"
    },
    {
      id: 12,
      title: "Mid-Autumn Festival",
      description: "Share the beauty of moon festival traditions",
      unit: 9,
      unitName: "Chinese Festivals in English",
      level: "intermediate",
      category: "cultural",
      xpReward: 40,
      estimatedMinutes: 30,
      components: {
        listening: "Story of Chang'e and the moon",
        vocabulary: ["mooncake", "full moon", "family gathering", "legend", "harvest"],
        grammar: "Storytelling past tense and narrative structure",
        writing: "Retell a Chinese legend in English",
        speaking: "Describe festival foods and activities",
        game: "Moon festival story game",
        quiz: "Festival legends and customs"
      },
      chineseContext: "Traditional Chinese stories and values"
    },

    // Unit 10: Problems & Solutions
    {
      id: 13,
      title: "Environmental Challenges",
      description: "Discuss environmental issues and solutions",
      unit: 10,
      unitName: "Problems & Solutions",
      level: "advanced",
      category: "debate",
      xpReward: 55,
      estimatedMinutes: 45,
      components: {
        listening: "Environmental expert discussing climate change",
        vocabulary: ["pollution", "renewable energy", "carbon footprint", "sustainability", "conservation"],
        grammar: "Problem-solution structure: The issue is... / We could solve this by...",
        writing: "Propose solutions to local environmental problems",
        speaking: "Debate environmental policies",
        game: "Environmental solutions strategy game",
        quiz: "Global environmental awareness"
      },
      chineseContext: "China's role in global environmental efforts"
    },
    {
      id: 14,
      title: "Academic Stress",
      description: "Discuss school pressure and healthy study habits",
      unit: 10,
      unitName: "Problems & Solutions",
      level: "intermediate",
      category: "discussion",
      xpReward: 40,
      estimatedMinutes: 30,
      components: {
        listening: "Students sharing stress management tips",
        vocabulary: ["pressure", "balance", "time management", "mental health", "relaxation"],
        grammar: "Giving advice: You should... / It's important to... / I recommend...",
        writing: "Write advice for stressed students",
        speaking: "Share your study strategies",
        game: "Stress-busting activity game",
        quiz: "Healthy study habits assessment"
      },
      chineseContext: "Academic pressure in Chinese education system"
    }
  ];

  let filteredLessons = lessons;
  
  if (level) {
    filteredLessons = filteredLessons.filter(lesson => lesson.level === level);
  }
  
  if (unit) {
    filteredLessons = filteredLessons.filter(lesson => lesson.unit === parseInt(unit));
  }

  res.json(filteredLessons);
});

// Get learning units overview
app.get("/api/units", (req, res) => {
  const units = [
    {
      id: 1,
      title: "My Daily Life",
      description: "Routines, school, family - familiar and personal",
      level: "beginner",
      lessonsCount: 2,
      estimatedHours: 1,
      topics: ["morning routine", "school life", "family time"],
      chineseContext: "Compare daily life in China and other countries"
    },
    {
      id: 2,
      title: "Food & Culture",
      description: "Describing Chinese dishes, comparing cultures",
      level: "intermediate",
      lessonsCount: 2,
      estimatedHours: 1.5,
      topics: ["Chinese cuisine", "restaurant conversations", "food culture"],
      chineseContext: "Traditional Chinese food and dining customs"
    },
    {
      id: 3,
      title: "Technology & Me",
      description: "Phones, apps, gaming vocabulary",
      level: "beginner",
      lessonsCount: 1,
      estimatedHours: 0.5,
      topics: ["digital life", "popular apps", "online communication"],
      chineseContext: "Chinese tech platforms vs international platforms"
    },
    {
      id: 4,
      title: "Future Dreams",
      description: "Jobs, goals, ambitions - great for speaking",
      level: "intermediate",
      lessonsCount: 1,
      estimatedHours: 1,
      topics: ["career goals", "life planning", "professional development"],
      chineseContext: "Career opportunities in modern China"
    },
    {
      id: 5,
      title: "Famous People",
      description: "Celebrities, inventors, historical figures",
      level: "advanced",
      lessonsCount: 1,
      estimatedHours: 1,
      topics: ["biographies", "achievements", "historical impact"],
      chineseContext: "Chinese innovators and cultural figures"
    },
    {
      id: 6,
      title: "Travel & Places",
      description: "Locations, directions, sightseeing",
      level: "intermediate",
      lessonsCount: 1,
      estimatedHours: 1,
      topics: ["landmarks", "travel planning", "cultural sites"],
      chineseContext: "Promoting Chinese tourism and culture"
    },
    {
      id: 7,
      title: "Emotions & Opinions",
      description: "Debates, feelings, reactions",
      level: "intermediate",
      lessonsCount: 1,
      estimatedHours: 0.5,
      topics: ["expressing feelings", "sharing opinions", "cultural perspectives"],
      chineseContext: "Cultural differences in emotional expression"
    },
    {
      id: 8,
      title: "Social Media World",
      description: "Likes, trends, digital communication",
      level: "beginner",
      lessonsCount: 1,
      estimatedHours: 0.5,
      topics: ["online platforms", "digital trends", "social networking"],
      chineseContext: "Chinese social media vs global platforms"
    },
    {
      id: 9,
      title: "Chinese Festivals in English",
      description: "Culturally specific and authentic content",
      level: "intermediate",
      lessonsCount: 2,
      estimatedHours: 2,
      topics: ["Spring Festival", "Mid-Autumn Festival", "traditional customs"],
      chineseContext: "Authentic Chinese cultural traditions"
    },
    {
      id: 10,
      title: "Problems & Solutions",
      description: "Environment, school stress, global issues",
      level: "advanced",
      lessonsCount: 2,
      estimatedHours: 2.5,
      topics: ["environmental issues", "academic pressure", "social challenges"],
      chineseContext: "China's role in addressing global challenges"
    }
  ];
  
  res.json(units);
});

// Get vocabulary by level and unit
app.get("/api/vocabulary", (req, res) => {
  const { level, unit } = req.query;
  
  const vocabularyData = {
    beginner: [
      {
        unit: 1,
        unitName: "My Daily Life",
        words: [
          { word: "wake up", chinese: "起床", pronunciation: "/weɪk ʌp/", example: "I wake up at 7 AM every day." },
          { word: "breakfast", chinese: "早餐", pronunciation: "/ˈbrekfəst/", example: "I eat breakfast with my family." },
          { word: "brush teeth", chinese: "刷牙", pronunciation: "/brʌʃ tiːθ/", example: "Don't forget to brush your teeth!" },
          { word: "uniform", chinese: "校服", pronunciation: "/ˈjuːnɪfɔːrm/", example: "We wear uniforms to school." },
          { word: "homework", chinese: "作业", pronunciation: "/ˈhoʊmwɜːrk/", example: "I finish my homework after dinner." }
        ]
      },
      {
        unit: 3,
        unitName: "Technology & Me", 
        words: [
          { word: "smartphone", chinese: "智能手机", pronunciation: "/ˈsmɑːrtfoʊn/", example: "Everyone has a smartphone now." },
          { word: "WeChat", chinese: "微信", pronunciation: "/ˈwiːtʃæt/", example: "We use WeChat to communicate." },
          { word: "gaming", chinese: "游戏", pronunciation: "/ˈɡeɪmɪŋ/", example: "Gaming is very popular among teenagers." },
          { word: "livestream", chinese: "直播", pronunciation: "/ˈlaɪvstriːm/", example: "Many people livestream their daily activities." }
        ]
      }
    ],
    intermediate: [
      {
        unit: 2,
        unitName: "Food & Culture",
        words: [
          { word: "dumplings", chinese: "饺子", pronunciation: "/ˈdʌmplɪŋz/", example: "We make dumplings for Chinese New Year." },
          { word: "hot pot", chinese: "火锅", pronunciation: "/hɑːt pɑːt/", example: "Hot pot is perfect for cold weather." },
          { word: "stir-fry", chinese: "炒菜", pronunciation: "/stɜːr fraɪ/", example: "My mom can stir-fry vegetables quickly." },
          { word: "chopsticks", chinese: "筷子", pronunciation: "/ˈtʃɑːpstɪks/", example: "Learning to use chopsticks takes practice." }
        ]
      },
      {
        unit: 9,
        unitName: "Chinese Festivals",
        words: [
          { word: "red envelope", chinese: "红包", pronunciation: "/red ˈenvəloʊp/", example: "Children receive red envelopes during Spring Festival." },
          { word: "fireworks", chinese: "烟花", pronunciation: "/ˈfaɪərwɜːrks/", example: "We watch fireworks at midnight." },
          { word: "mooncake", chinese: "月饼", pronunciation: "/muːnkeɪk/", example: "Mooncakes are traditional Mid-Autumn Festival food." },
          { word: "family reunion", chinese: "家庭团聚", pronunciation: "/ˈfæməli riˈjuːnjən/", example: "Spring Festival is time for family reunion." }
        ]
      }
    ],
    advanced: [
      {
        unit: 5,
        unitName: "Famous People",
        words: [
          { word: "innovation", chinese: "创新", pronunciation: "/ˌɪnəˈveɪʃən/", example: "China leads in technological innovation." },
          { word: "entrepreneur", chinese: "企业家", pronunciation: "/ˌɑːntrəprəˈnɜːr/", example: "Many young entrepreneurs start tech companies." },
          { word: "achievement", chinese: "成就", pronunciation: "/əˈtʃiːvmənt/", example: "His scientific achievements changed the world." },
          { word: "legacy", chinese: "遗产", pronunciation: "/ˈleɡəsi/", example: "Great leaders leave a lasting legacy." }
        ]
      }
    ]
  };

  let result = vocabularyData;
  
  if (level) {
    result = { [level]: vocabularyData[level] || [] };
  }
  
  if (unit && level) {
    const levelData = vocabularyData[level] || [];
    const unitData = levelData.find(u => u.unit === parseInt(unit));
    result = unitData ? { [level]: [unitData] } : { [level]: [] };
  }

  res.json(result);
});

app.get("/api/learning-path/:userId", (req, res) => {
  res.json({
    currentLevel: "intermediate",
    recommendedLessons: [1, 2, 3],
    skillAreas: ["speaking", "vocabulary", "grammar"],
    progress: 65,
    adaptiveRecommendations: [
      {
        type: "lesson",
        title: "Advanced Conversations",
        reasoning: "Based on your progress in speaking exercises",
        difficulty: 0.7,
        estimatedTime: 20
      }
    ]
  });
});

app.get("/api/speaking-practice", (req, res) => {
  res.json({
    scenario: "Restaurant Ordering",
    difficulty: "intermediate",
    context: "You are at a restaurant and want to order food",
    prompts: [
      "What would you like to drink?",
      "Are you ready to order?",
      "How would you like your steak prepared?"
    ],
    vocabulary: ["menu", "order", "recommendation", "appetizer"],
    culturalTips: "In many cultures, it's polite to thank the server"
  });
});

app.get("/api/progress/:userId", (req, res) => {
  res.json({
    totalLessons: 50,
    completedLessons: 23,
    currentStreak: 12,
    totalXP: 1250,
    level: "intermediate",
    achievements: [
      { id: 1, title: "First Steps", earned: true, category: "milestone" },
      { id: 2, title: "Week Warrior", earned: true, category: "streak" },
      { id: 3, title: "Speaking Star", earned: false, category: "skill" }
    ],
    weeklyProgress: {
      monday: 45,
      tuesday: 60,
      wednesday: 30,
      thursday: 75,
      friday: 40,
      saturday: 20,
      sunday: 55
    }
  });
});

app.get("/api/vocabulary-games", (req, res) => {
  res.json({
    games: [
      {
        id: 1,
        name: "Word Match",
        description: "Match words with their meanings",
        difficulty: "easy",
        timeLimit: 60,
        category: "vocabulary"
      },
      {
        id: 2,
        name: "Spelling Challenge",
        description: "Test your spelling skills",
        difficulty: "medium",
        timeLimit: 90,
        category: "writing"
      },
      {
        id: 3,
        name: "Definition Quiz",
        description: "Choose the correct definition",
        difficulty: "hard",
        timeLimit: 120,
        category: "comprehension"
      }
    ]
  });
});

app.get("/api/cultural-content", (req, res) => {
  res.json({
    articles: [
      {
        id: 1,
        title: "Mid-Autumn Festival",
        region: "East Asia",
        difficulty: "intermediate",
        content: "The Mid-Autumn Festival is a harvest festival celebrated in Chinese culture...",
        vocabulary: ["festival", "celebration", "tradition", "family"]
      },
      {
        id: 2,
        title: "Holiday Traditions",
        region: "Global",
        difficulty: "beginner",
        content: "Different cultures celebrate holidays in unique ways...",
        vocabulary: ["holiday", "tradition", "custom", "celebrate"]
      },
      {
        id: 3,
        title: "Business Etiquette",
        region: "International",
        difficulty: "advanced",
        content: "Professional communication varies across cultures...",
        vocabulary: ["etiquette", "professional", "communication", "respect"]
      }
    ]
  });
});

// Advanced Speech Recognition
app.get("/api/speech-recognition/exercises", (req, res) => {
  res.json({
    exercises: [
      {
        id: 1,
        title: "Pronunciation Practice",
        targetWords: ["pronunciation", "vocabulary", "conversation"],
        difficulty: "intermediate",
        nativeAudio: "/audio/native-pronunciation.mp3",
        phonetics: ["prəˌnʌnsiˈeɪʃən", "voʊˈkæbjəˌleri", "ˌkɑnvərˈseɪʃən"]
      },
      {
        id: 2,
        title: "Accent Training",
        targetSentences: ["How are you today?", "I would like to order coffee"],
        accentType: "American",
        difficulty: "beginner"
      }
    ]
  });
});

app.post("/api/speech-recognition/analyze", (req, res) => {
  const { audioData, targetText } = req.body;
  res.json({
    accuracy: 85,
    feedback: {
      overallScore: 85,
      pronunciation: {
        score: 82,
        issues: ["The 'th' sound needs improvement", "Stress the second syllable more"]
      },
      fluency: {
        score: 88,
        paceScore: 90,
        pauseScore: 85
      },
      suggestions: [
        "Practice tongue placement for 'th' sounds",
        "Listen to native speakers for rhythm patterns"
      ]
    },
    detailedAnalysis: {
      wordScores: [
        { word: "pronunciation", score: 80, issues: ["stress pattern"] },
        { word: "vocabulary", score: 90, issues: [] }
      ]
    }
  });
});

// Interactive Language Games
app.get("/api/games/word-puzzles", (req, res) => {
  res.json({
    puzzles: [
      {
        id: 1,
        type: "crossword",
        title: "Daily Vocabulary",
        difficulty: "medium",
        clues: [
          { number: 1, direction: "across", clue: "A place to buy food", answer: "store" },
          { number: 2, direction: "down", clue: "Past tense of 'go'", answer: "went" }
        ],
        timeLimit: 300
      },
      {
        id: 2,
        type: "word_match",
        title: "Synonym Challenge",
        pairs: [
          { word: "happy", match: "joyful" },
          { word: "big", match: "large" },
          { word: "fast", match: "quick" }
        ]
      }
    ]
  });
});

app.get("/api/games/cultural-quiz", (req, res) => {
  res.json({
    quizzes: [
      {
        id: 1,
        title: "Global Festivals",
        questions: [
          {
            question: "Which festival celebrates the Chinese New Year?",
            options: ["Spring Festival", "Mid-Autumn Festival", "Dragon Boat Festival"],
            correct: 0,
            explanation: "Spring Festival is the traditional Chinese New Year celebration"
          },
          {
            question: "What do people eat during Thanksgiving in the US?",
            options: ["Pizza", "Turkey", "Sushi"],
            correct: 1,
            explanation: "Turkey is the traditional centerpiece of Thanksgiving dinner"
          }
        ],
        culturalTips: ["Learn about local customs before traveling", "Food is often central to cultural celebrations"]
      }
    ]
  });
});

// Social Learning Features
app.get("/api/social/friends", (req, res) => {
  res.json({
    friends: [
      {
        id: 2,
        username: "maria_spain",
        firstName: "Maria",
        country: "Spain",
        level: "advanced",
        languages: ["Spanish", "English"],
        mutualFriends: 3,
        status: "online",
        profileImage: "/avatars/maria.jpg"
      },
      {
        id: 3,
        username: "jean_france",
        firstName: "Jean",
        country: "France", 
        level: "intermediate",
        languages: ["French", "English"],
        mutualFriends: 1,
        status: "offline",
        profileImage: "/avatars/jean.jpg"
      }
    ]
  });
});

app.get("/api/social/group-challenges", (req, res) => {
  res.json({
    challenges: [
      {
        id: 1,
        title: "Weekly Vocabulary Challenge",
        description: "Learn 50 new words with your friends",
        participants: 12,
        maxParticipants: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        prize: "Achievement Badge + 500 XP",
        difficulty: "intermediate"
      },
      {
        id: 2,
        title: "Cultural Exchange Stories",
        description: "Share stories about your culture",
        participants: 8,
        maxParticipants: 15,
        type: "writing",
        language: "English"
      }
    ]
  });
});

// Writing Assistant
app.post("/api/writing/analyze", (req, res) => {
  const { text, type } = req.body;
  res.json({
    grammarScore: 88,
    styleScore: 82,
    clarityScore: 90,
    issues: [
      {
        type: "grammar",
        position: { start: 45, end: 52 },
        message: "Subject-verb disagreement",
        suggestion: "Change 'are' to 'is'",
        severity: "high"
      },
      {
        type: "style",
        position: { start: 120, end: 135 },
        message: "Consider using a more formal tone",
        suggestion: "Replace 'really good' with 'excellent'",
        severity: "medium"
      }
    ],
    suggestions: [
      "Use more varied sentence structures",
      "Consider adding transition words",
      "The conclusion could be stronger"
    ],
    vocabularyEnhancements: [
      { original: "good", suggestions: ["excellent", "outstanding", "remarkable"] },
      { original: "very", suggestions: ["extremely", "particularly", "notably"] }
    ]
  });
});

app.get("/api/writing/templates", (req, res) => {
  res.json({
    templates: [
      {
        id: 1,
        type: "essay",
        title: "Argumentative Essay",
        structure: ["Introduction", "Body Paragraph 1", "Body Paragraph 2", "Conclusion"],
        guidelines: ["State your thesis clearly", "Support with evidence", "Address counterarguments"],
        wordCount: { min: 300, max: 500 }
      },
      {
        id: 2,
        type: "email",
        title: "Formal Business Email",
        structure: ["Subject Line", "Greeting", "Purpose", "Details", "Closing"],
        tone: "professional",
        commonPhrases: ["I hope this email finds you well", "Please let me know if you need any clarification"]
      }
    ]
  });
});

// Virtual Classroom Mode
app.get("/api/classroom/assignments", (req, res) => {
  res.json({
    assignments: [
      {
        id: 1,
        title: "Descriptive Writing Assignment",
        description: "Write a 200-word description of your hometown",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        subject: "Writing",
        difficulty: "intermediate",
        submissions: 15,
        totalStudents: 20,
        averageScore: 82
      },
      {
        id: 2,
        title: "Pronunciation Practice",
        description: "Record yourself reading the provided text",
        type: "speaking",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        submissions: 8,
        totalStudents: 20
      }
    ]
  });
});

app.get("/api/classroom/student-progress", (req, res) => {
  res.json({
    students: [
      {
        id: 1,
        name: "Li Wei",
        level: "intermediate",
        completedAssignments: 12,
        totalAssignments: 15,
        averageScore: 85,
        strengths: ["vocabulary", "reading"],
        weaknesses: ["pronunciation", "grammar"],
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        name: "Maria Garcia",
        level: "advanced",
        completedAssignments: 14,
        totalAssignments: 15,
        averageScore: 92,
        strengths: ["speaking", "cultural awareness"],
        weaknesses: ["formal writing"],
        lastActive: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  });
});

// Cultural Immersion Content
app.get("/api/cultural/stories", (req, res) => {
  res.json({
    stories: [
      {
        id: 1,
        title: "A Day at the Tokyo Fish Market",
        region: "Japan",
        difficulty: "intermediate",
        type: "interactive",
        duration: 15,
        chapters: [
          {
            id: 1,
            title: "Early Morning Arrival",
            content: "You arrive at Tsukiji Market at 5 AM...",
            vocabulary: ["market", "fresh", "vendor", "auction"],
            culturalNotes: "Japanese fish markets start very early to ensure freshness"
          }
        ],
        choices: [
          { text: "Go to the tuna auction", consequence: "Learn about bidding culture" },
          { text: "Visit the knife shops", consequence: "Discover traditional craftsmanship" }
        ]
      },
      {
        id: 2,
        title: "Spanish Siesta Tradition",
        region: "Spain",
        difficulty: "beginner",
        type: "documentary",
        culturalContext: "Understanding work-life balance in Spanish culture"
      }
    ]
  });
});

app.get("/api/cultural/exchange", (req, res) => {
  res.json({
    exchanges: [
      {
        id: 1,
        type: "language_exchange",
        title: "English-Spanish Exchange",
        participants: [
          { name: "Mike", teaches: "English", learns: "Spanish", timezone: "EST" },
          { name: "Carlos", teaches: "Spanish", learns: "English", timezone: "CET" }
        ],
        nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 60,
        topics: ["daily life", "hobbies", "culture"]
      },
      {
        id: 2,
        type: "cultural_discussion",
        title: "Festival Traditions Around the World",
        openSlots: 3,
        maxParticipants: 8,
        language: "English",
        hostingCountry: "International"
      }
    ]
  });
});

// Achievement System
app.get("/api/achievements", (req, res) => {
  res.json({
    available: [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first lesson",
        category: "milestone",
        icon: "🎯",
        points: 50,
        rarity: "common",
        earned: true,
        earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        category: "streak",
        icon: "🔥",
        points: 100,
        rarity: "uncommon",
        earned: true,
        earnedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: "Cultural Explorer",
        description: "Complete 5 cultural immersion stories",
        category: "exploration",
        icon: "🌍",
        points: 200,
        rarity: "rare",
        earned: false,
        progress: 3,
        required: 5
      },
      {
        id: 4,
        title: "Social Butterfly",
        description: "Make 10 friends on the platform",
        category: "social",
        icon: "🦋",
        points: 150,
        rarity: "uncommon",
        earned: false,
        progress: 6,
        required: 10
      }
    ],
    leaderboard: [
      { rank: 1, name: "Maria Garcia", points: 2850, country: "Spain" },
      { rank: 2, name: "Jean Dubois", points: 2640, country: "France" },
      { rank: 3, name: "Li Wei", points: 2430, country: "China" },
      { rank: 4, name: "You", points: 1250, country: "Your Country" }
    ],
    userStats: {
      totalPoints: 1250,
      level: 12,
      rank: 4,
      achievementsEarned: 15,
      currentStreak: 12,
      longestStreak: 18
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

(async () => {
  try {
    const server = createServer(app);

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const PORT = 5000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();