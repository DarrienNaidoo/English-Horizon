import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import { adaptiveLearningEngine } from "./adaptive-learning";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const { category, level } = req.query;
      const lessons = await storage.getLessons(
        category as string,
        level as string
      );
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lessons", error });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lesson", error });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress", error });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements", error });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements", error });
    }
  });

  // Vocabulary routes
  app.get("/api/vocabulary", async (req, res) => {
    try {
      const { level, topic } = req.query;
      const vocabulary = await storage.getVocabulary(
        level as string,
        topic as string
      );
      res.json(vocabulary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get vocabulary", error });
    }
  });

  app.get("/api/users/:userId/vocabulary", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userVocabulary = await storage.getUserVocabulary(userId);
      res.json(userVocabulary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user vocabulary", error });
    }
  });

  // Daily challenge routes
  app.get("/api/daily-challenge", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const challenge = await storage.getDailyChallenge(today);
      if (!challenge) {
        return res.status(404).json({ message: "No daily challenge found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily challenge", error });
    }
  });

  // Statistics endpoint
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      const progress = await storage.getUserProgress(userId);
      const achievements = await storage.getUserAchievements(userId);
      const vocabulary = await storage.getUserVocabulary(userId);

      const stats = {
        level: user?.level || "beginner",
        xp: user?.xp || 0,
        streak: user?.streak || 0,
        lessonsCompleted: progress.filter(p => p.completed).length,
        achievementsEarned: achievements.length,
        vocabularyMastered: vocabulary.filter(v => v.mastered).length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats", error });
    }
  });

  // Adaptive Learning API endpoints
  app.get("/api/users/:userId/learning-profile", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progressHistory = await storage.getUserProgress(userId);
      const lessons = await storage.getLessons();
      
      const profile = adaptiveLearningEngine.analyzeUserPerformance(user, progressHistory, lessons);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze learning profile", error });
    }
  });

  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progressHistory = await storage.getUserProgress(userId);
      const lessons = await storage.getLessons();
      
      const profile = adaptiveLearningEngine.analyzeUserPerformance(user, progressHistory, lessons);
      const recommendations = adaptiveLearningEngine.generateRecommendations(profile, lessons, progressHistory);
      
      res.json({
        profile,
        recommendations,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations", error });
    }
  });

  app.post("/api/users/:userId/adaptive-difficulty", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progressHistory = await storage.getUserProgress(userId);
      
      const optimalDifficulty = adaptiveLearningEngine.calculateOptimalDifficulty(progressHistory);
      
      res.json({
        userId,
        optimalDifficulty,
        calculatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate optimal difficulty", error });
    }
  });

  // Translation API endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;
      
      if (!text || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ 
          message: "Missing required fields: text, sourceLanguage, targetLanguage" 
        });
      }

      // For now, provide a simple fallback translation system
      // In production, this would integrate with external APIs like Google Translate
      const translations: Record<string, Record<string, string>> = {
        "hello": {
          "zh": "你好",
          "es": "hola",
          "fr": "bonjour",
          "de": "hallo",
          "ja": "こんにちは",
          "ko": "안녕하세요",
          "it": "ciao"
        },
        "good morning": {
          "zh": "早上好",
          "es": "buenos días",
          "fr": "bonjour",
          "de": "guten Morgen",
          "ja": "おはようございます",
          "ko": "좋은 아침",
          "it": "buongiorno"
        },
        "thank you": {
          "zh": "谢谢",
          "es": "gracias",
          "fr": "merci",
          "de": "danke",
          "ja": "ありがとう",
          "ko": "감사합니다",
          "it": "grazie"
        },
        "how are you": {
          "zh": "你好吗",
          "es": "¿cómo estás?",
          "fr": "comment allez-vous?",
          "de": "wie geht es dir?",
          "ja": "元気ですか？",
          "ko": "어떻게 지내세요?",
          "it": "come stai?"
        }
      };

      const lowerText = text.toLowerCase().trim();
      let translatedText = translations[lowerText]?.[targetLanguage];
      
      if (!translatedText) {
        // If no translation found, return a message indicating external service needed
        return res.status(503).json({
          message: "Translation service requires external API key",
          error: "EXTERNAL_SERVICE_NEEDED",
          supportedPhrases: Object.keys(translations)
        });
      }

      res.json({
        translatedText,
        confidence: 0.95,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({ message: "Translation failed", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
