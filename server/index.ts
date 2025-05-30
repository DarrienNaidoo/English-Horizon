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