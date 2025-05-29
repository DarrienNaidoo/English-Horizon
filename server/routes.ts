import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/user/username/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const { level, category } = req.query;
      let lessons;
      
      if (level) {
        lessons = await storage.getLessonsByLevel(parseInt(level as string));
      } else if (category) {
        lessons = await storage.getLessonsByCategory(category as string);
      } else {
        lessons = await storage.getAllLessons();
      }
      
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lessons" });
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
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // User progress routes
  app.get("/api/user/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  app.get("/api/user/:userId/progress/:lessonId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getUserLessonProgress(userId, lessonId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lesson progress" });
    }
  });

  app.post("/api/user/:userId/progress/:lessonId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const lessonId = parseInt(req.params.lessonId);
      
      const progress = await storage.updateUserProgress(userId, lessonId, req.body);
      
      // Update user stats if lesson completed
      if (req.body.completed) {
        const user = await storage.getUser(userId);
        if (user) {
          const lesson = await storage.getLesson(lessonId);
          if (lesson) {
            await storage.updateUser(userId, {
              totalXP: user.totalXP + lesson.xpReward,
              lessonsCompleted: user.lessonsCompleted + 1,
            });
            
            // Add activity
            await storage.addActivity({
              userId,
              type: "lesson_completed",
              title: `Completed "${lesson.title}" lesson`,
              description: `+${lesson.xpReward} XP`,
              xpGained: lesson.xpReward,
            });
          }
        }
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  // Daily challenge routes
  app.get("/api/challenge/today", async (req, res) => {
    try {
      const challenge = await storage.getTodayChallenge();
      res.json(challenge || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get today's challenge" });
    }
  });

  app.get("/api/user/:userId/challenge/:challengeId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const challengeId = parseInt(req.params.challengeId);
      const progress = await storage.getUserChallengeProgress(userId, challengeId);
      res.json(progress || { currentCount: 0, completed: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to get challenge progress" });
    }
  });

  app.post("/api/user/:userId/challenge/:challengeId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const challengeId = parseInt(req.params.challengeId);
      const progress = await storage.updateChallengeProgress(userId, challengeId, req.body);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update challenge progress" });
    }
  });

  // Activity routes
  app.get("/api/user/:userId/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.addActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
