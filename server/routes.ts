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
import { grammarExerciseSystem } from "./grammar-exercises";
import { riddleGameSystem } from "./riddle-game";
import { advancedWritingSystem } from "./advanced-writing";
import { speechRecognitionSystem } from "./speech-recognition";
import { aiTutoringSystem } from "./ai-tutoring";
import { culturalImmersionSystem } from "./cultural-immersion";
import { classroomManagementSystem } from "./classroom-management";
import { listeningComprehensionSystem } from "./listening-comprehension";
import { peerLearningSystem } from "./peer-learning";
import { achievementSystem } from "./achievement-system";
import { learningSoundtrackSystem } from "./learning-soundtrack";
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

  // Pronunciation Analysis API
  app.post("/api/pronunciation/analyze", async (req, res) => {
    try {
      const { audioData, targetWord, userId } = req.body;
      const analysis = await pronunciationAnalyzer.analyzeAudio(
        Buffer.from(audioData, 'base64'), 
        targetWord, 
        userId
      );
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze pronunciation", error });
    }
  });

  app.get("/api/pronunciation/exercises", async (req, res) => {
    try {
      const { difficulty, category } = req.query;
      const exercises = pronunciationAnalyzer.getExercises(
        difficulty as string, 
        category as string
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pronunciation exercises", error });
    }
  });

  app.get("/api/pronunciation/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = pronunciationAnalyzer.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pronunciation progress", error });
    }
  });

  // Personalized Dashboard API
  app.post("/api/dashboard/goals", async (req, res) => {
    try {
      const { userId, type, title, description, targetValue, deadline, priority } = req.body;
      const goal = personalizedDashboard.createGoal(
        userId, type, title, description, targetValue, new Date(deadline), priority
      );
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create goal", error });
    }
  });

  app.get("/api/dashboard/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = personalizedDashboard.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user goals", error });
    }
  });

  app.get("/api/dashboard/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = personalizedDashboard.getDailyRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations", error });
    }
  });

  app.get("/api/dashboard/insights/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = personalizedDashboard.getLearningInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning insights", error });
    }
  });

  app.post("/api/dashboard/streak/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streak = personalizedDashboard.updateStudyStreak(userId);
      res.json(streak);
    } catch (error) {
      res.status(500).json({ message: "Failed to update study streak", error });
    }
  });

  // Reading Comprehension API
  app.get("/api/reading/passages", async (req, res) => {
    try {
      const { level, category } = req.query;
      const passages = readingComprehensionSystem.getPassages(
        level as string, 
        category as string
      );
      res.json(passages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reading passages", error });
    }
  });

  app.get("/api/reading/passages/:id", async (req, res) => {
    try {
      const passage = readingComprehensionSystem.getPassage(req.params.id);
      if (!passage) {
        return res.status(404).json({ message: "Passage not found" });
      }
      res.json(passage);
    } catch (error) {
      res.status(500).json({ message: "Failed to get passage", error });
    }
  });

  app.post("/api/reading/sessions", async (req, res) => {
    try {
      const { userId, passageId } = req.body;
      const session = readingComprehensionSystem.startReadingSession(userId, passageId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start reading session", error });
    }
  });

  app.post("/api/reading/sessions/:sessionId/highlights", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const highlight = readingComprehensionSystem.addHighlight(sessionId, req.body);
      res.json(highlight);
    } catch (error) {
      res.status(500).json({ message: "Failed to add highlight", error });
    }
  });

  app.post("/api/reading/sessions/:sessionId/answers", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { questionId, answer, timeSpent } = req.body;
      const result = readingComprehensionSystem.submitAnswer(sessionId, questionId, answer, timeSpent);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit answer", error });
    }
  });

  // Speaking Practice API
  app.get("/api/speaking/exercises", async (req, res) => {
    try {
      const { type, level, accent } = req.query;
      const exercises = speakingPracticeSystem.getExercises(
        type as string, 
        level as string, 
        accent as string
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to get speaking exercises", error });
    }
  });

  app.get("/api/speaking/conversations", async (req, res) => {
    try {
      const conversations = speakingPracticeSystem.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversations", error });
    }
  });

  app.post("/api/speaking/sessions", async (req, res) => {
    try {
      const { userId, exerciseId } = req.body;
      const session = speakingPracticeSystem.startSpeakingSession(userId, exerciseId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start speaking session", error });
    }
  });

  app.post("/api/speaking/sessions/:sessionId/record", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { segment, duration } = req.body;
      const recording = speakingPracticeSystem.recordAudio(sessionId, segment, duration);
      res.json(recording);
    } catch (error) {
      res.status(500).json({ message: "Failed to record audio", error });
    }
  });

  app.get("/api/speaking/sessions/:sessionId/feedback", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const feedback = speakingPracticeSystem.generateFeedback(sessionId);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate feedback", error });
    }
  });

  // Social Learning API
  app.post("/api/social/study-buddy/find", async (req, res) => {
    try {
      const { userId, preferences } = req.body;
      const matches = socialLearningSystem.findStudyBuddy(userId, preferences);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to find study buddy", error });
    }
  });

  app.get("/api/social/challenges", async (req, res) => {
    try {
      const { status, type } = req.query;
      const challenges = socialLearningSystem.getChallenges(status as string, type as string);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to get challenges", error });
    }
  });

  app.post("/api/social/challenges/:challengeId/join", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userId } = req.body;
      const success = socialLearningSystem.joinChallenge(challengeId, userId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to join challenge", error });
    }
  });

  app.get("/api/social/leaderboard/:type/:category", async (req, res) => {
    try {
      const { type, category } = req.params;
      const leaderboard = socialLearningSystem.getLeaderboard(type, category);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard", error });
    }
  });

  app.post("/api/social/feedback", async (req, res) => {
    try {
      const feedback = socialLearningSystem.submitPeerFeedback(req.body);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit feedback", error });
    }
  });

  app.get("/api/social/groups", async (req, res) => {
    try {
      const { isPublic, focusArea } = req.query;
      const groups = socialLearningSystem.getStudyGroups(
        isPublic === 'true', 
        focusArea as string
      );
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study groups", error });
    }
  });

  // Content Creation API
  app.post("/api/content/lessons", async (req, res) => {
    try {
      const { creatorId, ...lessonData } = req.body;
      const lesson = contentCreationSystem.createLesson(creatorId, lessonData);
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to create lesson", error });
    }
  });

  app.get("/api/content/lessons", async (req, res) => {
    try {
      const { creatorId, category, level, isPublic } = req.query;
      const lessons = contentCreationSystem.getLessons(
        creatorId ? parseInt(creatorId as string) : undefined,
        category as string,
        level as string,
        isPublic === 'true'
      );
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get lessons", error });
    }
  });

  app.post("/api/content/vocabulary", async (req, res) => {
    try {
      const { creatorId, ...listData } = req.body;
      const vocabularyList = contentCreationSystem.createVocabularyList(creatorId, listData);
      res.json(vocabularyList);
    } catch (error) {
      res.status(500).json({ message: "Failed to create vocabulary list", error });
    }
  });

  app.post("/api/content/stories", async (req, res) => {
    try {
      const { authorId, ...storyData } = req.body;
      const story = contentCreationSystem.createStory(authorId, storyData);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to create story", error });
    }
  });

  app.get("/api/content/stories", async (req, res) => {
    try {
      const { authorId, genre, level, isPublic } = req.query;
      const stories = contentCreationSystem.getStories(
        authorId ? parseInt(authorId as string) : undefined,
        genre as string,
        level as string,
        isPublic === 'true'
      );
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stories", error });
    }
  });

  app.get("/api/content/popular/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const { limit } = req.query;
      const content = contentCreationSystem.getPopularContent(
        type as any, 
        limit ? parseInt(limit as string) : 10
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get popular content", error });
    }
  });

  app.get("/api/content/search", async (req, res) => {
    try {
      const { query, type } = req.query;
      const results = contentCreationSystem.searchContent(query as string, type as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search content", error });
    }
  });

  // Grammar Exercises API
  app.get("/api/grammar/rules", async (req, res) => {
    try {
      const { level } = req.query;
      const rules = grammarExerciseSystem.getGrammarRules(level as string);
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grammar rules", error });
    }
  });

  app.get("/api/grammar/rules/:id", async (req, res) => {
    try {
      const rule = grammarExerciseSystem.getGrammarRule(req.params.id);
      if (!rule) {
        return res.status(404).json({ message: "Grammar rule not found" });
      }
      res.json(rule);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grammar rule", error });
    }
  });

  app.get("/api/grammar/exercises/:ruleId", async (req, res) => {
    try {
      const { ruleId } = req.params;
      const { difficulty } = req.query;
      const exercises = grammarExerciseSystem.getExercisesByRule(
        ruleId, 
        difficulty ? parseInt(difficulty as string) : undefined
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grammar exercises", error });
    }
  });

  app.post("/api/grammar/check", async (req, res) => {
    try {
      const { exerciseId, userAnswer, userId, ruleId } = req.body;
      const result = grammarExerciseSystem.checkAnswer(exerciseId, userAnswer);
      
      // Update user progress
      grammarExerciseSystem.updateUserProgress(userId, ruleId, result.correct);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to check grammar answer", error });
    }
  });

  app.get("/api/grammar/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = grammarExerciseSystem.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grammar progress", error });
    }
  });

  app.get("/api/grammar/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { count } = req.query;
      const recommendations = grammarExerciseSystem.getRecommendedExercises(
        userId, 
        count ? parseInt(count as string) : 5
      );
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get grammar recommendations", error });
    }
  });

  // Riddle Game API
  app.get("/api/riddles", async (req, res) => {
    try {
      const { difficulty, category } = req.query;
      const riddles = riddleGameSystem.getRiddles(
        difficulty as string, 
        category as string
      );
      res.json(riddles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get riddles", error });
    }
  });

  app.get("/api/puzzles", async (req, res) => {
    try {
      const { difficulty, type } = req.query;
      const puzzles = riddleGameSystem.getPuzzles(
        difficulty as string, 
        type as string
      );
      res.json(puzzles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get puzzles", error });
    }
  });

  app.post("/api/riddles/session", async (req, res) => {
    try {
      const { userId, gameType } = req.body;
      const session = riddleGameSystem.startGameSession(userId, gameType);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start riddle session", error });
    }
  });

  app.post("/api/riddles/check", async (req, res) => {
    try {
      const { riddleId, userAnswer, sessionId } = req.body;
      const result = riddleGameSystem.checkRiddleAnswer(riddleId, userAnswer, sessionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to check riddle answer", error });
    }
  });

  app.get("/api/riddles/hint/:riddleId/:sessionId", async (req, res) => {
    try {
      const { riddleId, sessionId } = req.params;
      const hint = riddleGameSystem.getHint(riddleId, sessionId);
      res.json({ hint });
    } catch (error) {
      res.status(500).json({ message: "Failed to get hint", error });
    }
  });

  app.post("/api/riddles/session/:sessionId/end", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = riddleGameSystem.endGameSession(sessionId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to end riddle session", error });
    }
  });

  app.get("/api/riddles/leaderboard/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const { limit } = req.query;
      const leaderboard = riddleGameSystem.getLeaderboard(
        gameType as 'riddle' | 'puzzle',
        limit ? parseInt(limit as string) : 10
      );
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard", error });
    }
  });

  app.get("/api/riddles/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = riddleGameSystem.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats", error });
    }
  });

  // Advanced Writing API
  app.get("/api/writing/templates", async (req, res) => {
    try {
      const { type, difficulty } = req.query;
      const templates = advancedWritingSystem.getTemplates(type as string, difficulty as string);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get writing templates", error });
    }
  });

  app.get("/api/writing/assignments", async (req, res) => {
    try {
      const { templateId } = req.query;
      const assignments = advancedWritingSystem.getAssignments(templateId as string);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get writing assignments", error });
    }
  });

  app.post("/api/writing/submit", async (req, res) => {
    try {
      const { assignmentId, userId, content, isDraft } = req.body;
      const submission = advancedWritingSystem.submitWriting(assignmentId, userId, content, isDraft);
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit writing", error });
    }
  });

  app.get("/api/writing/submissions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const submissions = advancedWritingSystem.getUserSubmissions(userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user submissions", error });
    }
  });

  app.post("/api/writing/collaborative", async (req, res) => {
    try {
      const { title, description, type, participants } = req.body;
      const project = advancedWritingSystem.createCollaborativeProject(title, description, type, participants);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create collaborative project", error });
    }
  });

  // Speech Recognition API
  app.get("/api/speech/accent-exercises", async (req, res) => {
    try {
      const { accent, category, difficulty } = req.query;
      const exercises = speechRecognitionSystem.getAccentExercises(
        accent as string, 
        category as string, 
        difficulty as string
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to get accent exercises", error });
    }
  });

  app.get("/api/speech/fluency-tests", async (req, res) => {
    try {
      const { level } = req.query;
      const tests = speechRecognitionSystem.getFluencyTests(level as string);
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get fluency tests", error });
    }
  });

  app.post("/api/speech/analyze", async (req, res) => {
    try {
      const { audioData, targetText } = req.body;
      const analysis = await speechRecognitionSystem.analyzeSpeech(audioData, targetText);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze speech", error });
    }
  });

  app.post("/api/speech/fluency-test", async (req, res) => {
    try {
      const { testId, userId, audioData } = req.body;
      const result = await speechRecognitionSystem.conductFluencyTest(testId, userId, audioData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to conduct fluency test", error });
    }
  });

  app.get("/api/speech/fluency-results/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const results = speechRecognitionSystem.getUserFluencyResults(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get fluency results", error });
    }
  });

  app.post("/api/speech/voice-journal", async (req, res) => {
    try {
      const { userId, title, audioData, topics, isPrivate } = req.body;
      const entry = await speechRecognitionSystem.createVoiceJournalEntry(
        userId, title, audioData, topics, isPrivate
      );
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to create voice journal entry", error });
    }
  });

  app.get("/api/speech/voice-journal/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const journal = speechRecognitionSystem.getUserVoiceJournal(userId);
      res.json(journal);
    } catch (error) {
      res.status(500).json({ message: "Failed to get voice journal", error });
    }
  });

  app.get("/api/speech/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = speechRecognitionSystem.getProgressStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get speech progress", error });
    }
  });

  // AI Tutoring API
  app.get("/api/ai-tutor/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = aiTutoringSystem.getLearningProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get learning profile", error });
    }
  });

  app.put("/api/ai-tutor/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const profile = aiTutoringSystem.updateLearningProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update learning profile", error });
    }
  });

  app.post("/api/ai-tutor/study-plan", async (req, res) => {
    try {
      const { userId, goals, timeAvailable } = req.body;
      const plan = await aiTutoringSystem.generatePersonalizedPlan(userId, goals, timeAvailable);
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate study plan", error });
    }
  });

  app.get("/api/ai-tutor/study-plans/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const plans = aiTutoringSystem.getUserStudyPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study plans", error });
    }
  });

  app.post("/api/ai-tutor/session", async (req, res) => {
    try {
      const { userId, topic, message } = req.body;
      const session = await aiTutoringSystem.conductAISession(userId, topic, message);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to conduct AI session", error });
    }
  });

  app.get("/api/ai-tutor/sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = aiTutoringSystem.getUserTutorSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tutor sessions", error });
    }
  });

  app.get("/api/ai-tutor/assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessments = aiTutoringSystem.getAvailableAssessments(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get assessments", error });
    }
  });

  // Cultural Immersion API
  app.get("/api/cultural/scenarios", async (req, res) => {
    try {
      const { country, category, difficulty } = req.query;
      const scenarios = culturalImmersionSystem.getCulturalScenarios(
        country as string, 
        category as string, 
        difficulty as string
      );
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cultural scenarios", error });
    }
  });

  app.get("/api/cultural/current-events", async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      const events = culturalImmersionSystem.getCurrentEvents(
        category as string, 
        difficulty ? parseInt(difficulty as string) : undefined
      );
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current events", error });
    }
  });

  app.get("/api/cultural/pop-culture", async (req, res) => {
    try {
      const { type, ageGroup } = req.query;
      const content = culturalImmersionSystem.getPopCultureContent(
        type as string, 
        ageGroup as string
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get pop culture content", error });
    }
  });

  app.get("/api/cultural/virtual-trips", async (req, res) => {
    try {
      const { type, difficulty } = req.query;
      const trips = culturalImmersionSystem.getVirtualTrips(
        type as string, 
        difficulty as string
      );
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get virtual trips", error });
    }
  });

  app.post("/api/cultural/practice", async (req, res) => {
    try {
      const { scenarioId, userId } = req.body;
      const practice = culturalImmersionSystem.startCulturalPractice(scenarioId, userId);
      res.json(practice);
    } catch (error) {
      res.status(500).json({ message: "Failed to start cultural practice", error });
    }
  });

  app.post("/api/cultural/response", async (req, res) => {
    try {
      const { scenarioId, interactionId, userResponse } = req.body;
      const feedback = culturalImmersionSystem.submitCulturalResponse(
        scenarioId, 
        interactionId, 
        userResponse
      );
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit cultural response", error });
    }
  });

  // Classroom Management API
  app.post("/api/classroom/teacher", async (req, res) => {
    try {
      const { userId, schoolName, certification, experience, specializations } = req.body;
      const profile = classroomManagementSystem.createTeacherProfile(
        userId, schoolName, certification, experience, specializations
      );
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to create teacher profile", error });
    }
  });

  app.get("/api/classroom/teacher/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = classroomManagementSystem.getTeacherProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teacher profile", error });
    }
  });

  app.post("/api/classroom/create", async (req, res) => {
    try {
      const { teacherId, name, description, subject, gradeLevel, maxStudents } = req.body;
      const classroom = classroomManagementSystem.createClassroom(
        teacherId, name, description, subject, gradeLevel, maxStudents
      );
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ message: "Failed to create classroom", error });
    }
  });

  app.post("/api/classroom/join", async (req, res) => {
    try {
      const { userId, inviteCode, displayName } = req.body;
      const success = classroomManagementSystem.joinClassroomByCode(userId, inviteCode, displayName);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to join classroom", error });
    }
  });

  app.get("/api/classroom/teacher/:teacherId/classrooms", async (req, res) => {
    try {
      const teacherId = parseInt(req.params.teacherId);
      const classrooms = classroomManagementSystem.getTeacherClassrooms(teacherId);
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teacher classrooms", error });
    }
  });

  app.get("/api/classroom/student/:userId/classrooms", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const classrooms = classroomManagementSystem.getStudentClassrooms(userId);
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get student classrooms", error });
    }
  });

  app.post("/api/classroom/:classroomId/assignment", async (req, res) => {
    try {
      const { classroomId } = req.params;
      const { teacherId, ...assignmentData } = req.body;
      const assignment = classroomManagementSystem.createAssignment(classroomId, teacherId, assignmentData);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create assignment", error });
    }
  });

  app.get("/api/classroom/:classroomId/assignments", async (req, res) => {
    try {
      const { classroomId } = req.params;
      const assignments = classroomManagementSystem.getClassroomAssignments(classroomId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get classroom assignments", error });
    }
  });

  app.get("/api/classroom/student/:userId/assignments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assignments = classroomManagementSystem.getStudentAssignments(userId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get student assignments", error });
    }
  });

  app.post("/api/classroom/assignment/:assignmentId/submit", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { studentId, content, attachments } = req.body;
      const submission = classroomManagementSystem.submitAssignment(assignmentId, studentId, content, attachments);
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit assignment", error });
    }
  });

  app.get("/api/classroom/teacher/:teacherId/dashboard", async (req, res) => {
    try {
      const teacherId = parseInt(req.params.teacherId);
      const dashboard = classroomManagementSystem.getTeacherDashboard(teacherId);
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teacher dashboard", error });
    }
  });

  app.post("/api/classroom/:classroomId/projection/enable", async (req, res) => {
    try {
      const { classroomId } = req.params;
      const { teacherId } = req.body;
      const projectionMode = classroomManagementSystem.enableProjectionMode(classroomId, teacherId);
      res.json(projectionMode);
    } catch (error) {
      res.status(500).json({ message: "Failed to enable projection mode", error });
    }
  });

  // Listening Comprehension API
  app.get("/api/listening/content", async (req, res) => {
    try {
      const { type, difficulty, accent } = req.query;
      const content = listeningComprehensionSystem.getAudioContent(
        type as string, difficulty as string, accent as string
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to get listening content", error });
    }
  });

  app.get("/api/listening/dramas", async (req, res) => {
    try {
      const { difficulty } = req.query;
      const dramas = listeningComprehensionSystem.getAudioDramas(difficulty as string);
      res.json(dramas);
    } catch (error) {
      res.status(500).json({ message: "Failed to get audio dramas", error });
    }
  });

  app.post("/api/listening/session/start", async (req, res) => {
    try {
      const { contentId, userId } = req.body;
      const session = listeningComprehensionSystem.startListeningSession(contentId, userId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start listening session", error });
    }
  });

  app.post("/api/listening/session/answer", async (req, res) => {
    try {
      const { sessionId, questionId, userAnswer, timeSpent } = req.body;
      const result = listeningComprehensionSystem.submitComprehensionAnswer(
        sessionId, questionId, userAnswer, timeSpent
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit answer", error });
    }
  });

  // Peer Learning API
  app.get("/api/peer/profiles", async (req, res) => {
    try {
      const { targetLanguage, proficiencyLevel } = req.query;
      const profiles = peerLearningSystem.getPeerProfiles(
        targetLanguage as string, proficiencyLevel as string
      );
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get peer profiles", error });
    }
  });

  app.get("/api/peer/forums", async (req, res) => {
    try {
      const { category, level } = req.query;
      const forums = peerLearningSystem.getDiscussionForums(category as string, level as string);
      res.json(forums);
    } catch (error) {
      res.status(500).json({ message: "Failed to get discussion forums", error });
    }
  });

  app.post("/api/peer/forum/:forumId/topic", async (req, res) => {
    try {
      const { forumId } = req.params;
      const { authorId, title, content, tags } = req.body;
      const topic = peerLearningSystem.createForumTopic(forumId, authorId, title, content, tags);
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to create forum topic", error });
    }
  });

  app.get("/api/peer/mentorship", async (req, res) => {
    try {
      const { focus, status } = req.query;
      const programs = peerLearningSystem.getMentorshipPrograms(focus as string, status as string);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get mentorship programs", error });
    }
  });

  // Achievement System API
  app.get("/api/achievements/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = achievementSystem.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements", error });
    }
  });

  app.get("/api/achievements/available/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = achievementSystem.getAvailableAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get available achievements", error });
    }
  });

  app.get("/api/achievements/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = achievementSystem.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile", error });
    }
  });

  app.get("/api/achievements/leaderboard/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const { timeframe, limit } = req.query;
      const leaderboard = achievementSystem.getLeaderboard(
        category, timeframe as string, limit ? parseInt(limit as string) : 50
      );
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard", error });
    }
  });

  app.post("/api/achievements/check/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { activityData } = req.body;
      const unlocked = achievementSystem.checkAndUnlockAchievements(userId, activityData);
      res.json(unlocked);
    } catch (error) {
      res.status(500).json({ message: "Failed to check achievements", error });
    }
  });

  app.post("/api/achievements/streak/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { activityDate } = req.body;
      const streak = achievementSystem.updateLearningStreak(userId, activityDate ? new Date(activityDate) : new Date());
      res.json(streak);
    } catch (error) {
      res.status(500).json({ message: "Failed to update learning streak", error });
    }
  });

  // Learning Soundtrack API
  app.get("/api/soundtrack/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = learningSoundtrackSystem.getUserMusicProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music profile", error });
    }
  });

  app.post("/api/soundtrack/profile", async (req, res) => {
    try {
      const { userId, ...preferences } = req.body;
      const profile = learningSoundtrackSystem.createUserMusicProfile(userId, preferences);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to create music profile", error });
    }
  });

  app.put("/api/soundtrack/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const profile = learningSoundtrackSystem.updateUserPreferences(userId, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update music profile", error });
    }
  });

  app.post("/api/soundtrack/playlist/generate", async (req, res) => {
    try {
      const { userId, learningActivity, duration, timeOfDay } = req.body;
      const playlist = learningSoundtrackSystem.generatePersonalizedPlaylist(
        userId, learningActivity, duration, timeOfDay
      );
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate playlist", error });
    }
  });

  app.get("/api/soundtrack/playlists/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const playlists = learningSoundtrackSystem.getUserPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user playlists", error });
    }
  });

  app.get("/api/soundtrack/playlist/:playlistId", async (req, res) => {
    try {
      const { playlistId } = req.params;
      const playlist = learningSoundtrackSystem.getPlaylistById(playlistId);
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to get playlist", error });
    }
  });

  app.get("/api/soundtrack/tracks", async (req, res) => {
    try {
      const { genre, mood, focusLevel, learningType } = req.query;
      const tracks = learningSoundtrackSystem.getMusicTracks({
        genre: genre as string,
        mood: mood as string,
        focusLevel: focusLevel as string,
        learningType: learningType as string
      });
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music tracks", error });
    }
  });

  app.post("/api/soundtrack/session/start", async (req, res) => {
    try {
      const { userId, playlistId, learningActivity, plannedDuration } = req.body;
      const session = learningSoundtrackSystem.startStudySession(
        userId, playlistId, learningActivity, plannedDuration
      );
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start study session", error });
    }
  });

  app.post("/api/soundtrack/track/play", async (req, res) => {
    try {
      const { userId, trackId, duration, skipped, learningActivity } = req.body;
      learningSoundtrackSystem.trackPlayback(userId, trackId, duration, skipped, learningActivity);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track playback", error });
    }
  });

  app.post("/api/soundtrack/track/rate", async (req, res) => {
    try {
      const { 
        userId, trackId, learningActivity, focusImprovement, 
        taskCompletion, overallSatisfaction, studyDuration, distractionLevel 
      } = req.body;
      learningSoundtrackSystem.rateTrackEffectiveness(
        userId, trackId, learningActivity, focusImprovement,
        taskCompletion, overallSatisfaction, studyDuration, distractionLevel
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to rate track effectiveness", error });
    }
  });

  app.get("/api/soundtrack/insights/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = learningSoundtrackSystem.generatePersonalizationInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get personalization insights", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
