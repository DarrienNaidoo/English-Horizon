import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      // Return sample user data for now
      const users = [
        {
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
        }
      ];
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  });

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
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  // Daily Challenge routes
  app.get("/api/daily-challenge", async (req, res) => {
    try {
      // Simple daily challenge data
      const challenge = {
        id: 1,
        title: "Describe the Mid-Autumn Festival",
        description: "Practice describing traditional festivals and their cultural significance",
        date: new Date().toISOString(),
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
      };
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily challenge", error });
    }
  });

  // Learning progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      // Simple progress data
      const progress = {
        totalLessons: 50,
        completedLessons: 23,
        currentStreak: 12,
        totalXP: 1250,
        level: "intermediate",
        achievements: [
          { id: 1, title: "First Steps", earned: true },
          { id: 2, title: "Week Warrior", earned: true },
          { id: 3, title: "Speaking Star", earned: false }
        ]
      };
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress", error });
    }
  });

  // Lessons routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = [
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
        }
      ];
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons", error });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}