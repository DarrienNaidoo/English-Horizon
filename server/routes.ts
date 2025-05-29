import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import { adaptiveLearningEngine } from "./adaptive-learning";
import { translationService } from "./translation-service";
import { conversationAI } from "./conversation-ai";
import { vocabularyGameEngine } from "./vocabulary-game";
import { writingAssistant } from "./writing-assistant";
import { virtualClassroom } from "./virtual-classroom";
import { pronunciationAnalyzer } from "./pronunciation-analyzer";
import { personalizedDashboard } from "./personalized-dashboard";
import { readingComprehensionSystem } from "./reading-comprehension";
import { speakingPracticeSystem } from "./speaking-practice";
import { socialLearningSystem } from "./social-learning";
import { contentCreationSystem } from "./content-creation";
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

      const result = await translationService.translate(text, sourceLanguage, targetLanguage);
      
      res.json({
        translatedText: result.translatedText,
        confidence: result.confidence,
        provider: result.provider,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      
      // Check if it's a missing phrase error for demo provider
      if (errorMessage.includes("Translation not available")) {
        return res.status(503).json({
          message: "For full translation capabilities, external API keys are needed",
          error: "LIMITED_DEMO_MODE",
          details: errorMessage,
          availableProviders: translationService.getAvailableProviders(),
          configurationStatus: translationService.getConfigurationStatus()
        });
      }
      
      res.status(500).json({ 
        message: "Translation failed", 
        error: errorMessage,
        availableProviders: translationService.getAvailableProviders() 
      });
    }
  });

  // Translation service status endpoint
  app.get("/api/translation/status", async (req, res) => {
    try {
      res.json({
        availableProviders: translationService.getAvailableProviders(),
        configurationStatus: translationService.getConfigurationStatus(),
        supportedLanguages: [
          { code: "en", name: "English" },
          { code: "zh", name: "Chinese (Mandarin)" },
          { code: "es", name: "Spanish" },
          { code: "fr", name: "French" },
          { code: "de", name: "German" },
          { code: "ja", name: "Japanese" },
          { code: "ko", name: "Korean" },
          { code: "it", name: "Italian" }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get translation status", error });
    }
  });

  // AI Conversation Practice API
  app.get("/api/conversation/scenarios", async (req, res) => {
    try {
      const scenarios = conversationAI.getScenarios();
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scenarios", error });
    }
  });

  app.post("/api/conversation/:scenarioId/chat", async (req, res) => {
    try {
      const { scenarioId } = req.params;
      const { message, history } = req.body;
      
      const response = await conversationAI.generateResponse(scenarioId, history || [], message);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate conversation response", error });
    }
  });

  // Vocabulary Game API
  app.get("/api/vocabulary/words", async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      const words = vocabularyGameEngine.getVocabularyByCategory(
        category as string, 
        difficulty as string
      );
      res.json(words);
    } catch (error) {
      res.status(500).json({ message: "Failed to get vocabulary", error });
    }
  });

  app.post("/api/vocabulary/game/start", async (req, res) => {
    try {
      const { userId, gameType, difficulty } = req.body;
      const session = vocabularyGameEngine.startGameSession(userId, gameType, difficulty);
      const questions = vocabularyGameEngine.generateGameQuestions(gameType, userId, difficulty);
      
      res.json({ session, questions });
    } catch (error) {
      res.status(500).json({ message: "Failed to start vocabulary game", error });
    }
  });

  app.post("/api/vocabulary/game/:sessionId/answer", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, timeSpent } = req.body;
      
      const result = vocabularyGameEngine.submitAnswer(sessionId, questionId, answer, timeSpent);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit answer", error });
    }
  });

  app.get("/api/vocabulary/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = vocabularyGameEngine.getUserProgress(userId);
      const stats = vocabularyGameEngine.getGameStats(userId);
      
      res.json({ progress, stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to get vocabulary progress", error });
    }
  });

  // Writing Assistant API
  app.post("/api/writing/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      const analysis = await writingAssistant.analyzeText(text);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze text", error });
    }
  });

  app.post("/api/writing/improve", async (req, res) => {
    try {
      const { text, focus } = req.body;
      const improvement = await writingAssistant.improveText(text, focus);
      res.json(improvement);
    } catch (error) {
      res.status(500).json({ message: "Failed to improve text", error });
    }
  });

  app.get("/api/writing/templates", async (req, res) => {
    try {
      const { type, level } = req.query;
      const templates = writingAssistant.getTemplates(type as string, level as string);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get writing templates", error });
    }
  });

  // Virtual Classroom API
  app.post("/api/classroom/sessions", async (req, res) => {
    try {
      const { teacherId, title, description, maxStudents } = req.body;
      const session = virtualClassroom.createSession(teacherId, title, description, maxStudents);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to create classroom session", error });
    }
  });

  app.post("/api/classroom/sessions/:sessionId/join", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { studentId } = req.body;
      
      const success = virtualClassroom.joinSession(sessionId, studentId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to join session", error });
    }
  });

  app.get("/api/classroom/sessions", async (req, res) => {
    try {
      const { teacherId } = req.query;
      const sessions = virtualClassroom.getSessions(teacherId ? parseInt(teacherId as string) : undefined);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sessions", error });
    }
  });

  app.post("/api/classroom/study-groups", async (req, res) => {
    try {
      const { ownerId, name, description, focusTopics, isPublic, maxMembers } = req.body;
      const group = virtualClassroom.createStudyGroup(
        ownerId, name, description, focusTopics, isPublic, maxMembers
      );
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to create study group", error });
    }
  });

  app.get("/api/classroom/study-groups", async (req, res) => {
    try {
      const { isPublic, userId } = req.query;
      
      let groups;
      if (userId) {
        groups = virtualClassroom.getUserStudyGroups(parseInt(userId as string));
      } else {
        groups = virtualClassroom.getStudyGroups(
          isPublic !== undefined ? isPublic === 'true' : undefined
        );
      }
      
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study groups", error });
    }
  });

  app.post("/api/classroom/projects", async (req, res) => {
    try {
      const { leaderId, title, description, groupMembers, deadline } = req.body;
      const project = virtualClassroom.createGroupProject(
        leaderId, title, description, groupMembers, new Date(deadline)
      );
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create group project", error });
    }
  });

  app.get("/api/classroom/projects", async (req, res) => {
    try {
      const { userId } = req.query;
      const projects = virtualClassroom.getGroupProjects(
        userId ? parseInt(userId as string) : undefined
      );
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get group projects", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
