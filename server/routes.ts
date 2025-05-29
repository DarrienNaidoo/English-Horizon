import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
