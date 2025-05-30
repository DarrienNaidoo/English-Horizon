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
  res.json([
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn essential greeting phrases",
      category: "speaking",
      level: "beginner",
      xpReward: 25,
      estimatedMinutes: 15
    },
    {
      id: 2,
      title: "Food & Dining",
      description: "Vocabulary for restaurants and meals",
      category: "vocabulary",
      level: "intermediate",
      xpReward: 30,
      estimatedMinutes: 20
    },
    {
      id: 3,
      title: "Travel Conversations",
      description: "Essential phrases for travel situations",
      category: "speaking",
      level: "intermediate",
      xpReward: 35,
      estimatedMinutes: 25
    }
  ]);
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