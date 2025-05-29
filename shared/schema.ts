import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  currentLevel: integer("current_level").notNull().default(1),
  totalXP: integer("total_xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  badges: integer("badges").notNull().default(0),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  role: text("role").notNull().default("student"), // student, teacher
  preferredLanguage: text("preferred_language").notNull().default("en"), // en, zh, both
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").notNull(),
  duration: integer("duration").notNull(), // in minutes
  xpReward: integer("xp_reward").notNull(),
  level: integer("level").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isOfflineAvailable: boolean("is_offline_available").default(true),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  xpRequirement: integer("xp_requirement"),
  streakRequirement: integer("streak_requirement"),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetCount: integer("target_count").notNull(),
  xpReward: integer("xp_reward").notNull(),
  challengeType: text("challenge_type").notNull(), // speaking, vocabulary, lesson, etc.
  date: timestamp("date").notNull(),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  currentCount: integer("current_count").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // lesson_completed, badge_earned, challenge_completed, etc.
  title: text("title").notNull(),
  description: text("description"),
  xpGained: integer("xp_gained"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classGroups = pgTable("class_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  teacherId: integer("teacher_id").notNull(),
  code: text("code").notNull().unique(), // Join code for students
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  userId: integer("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const groupActivities = pgTable("group_activities", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // quiz, debate, group_lesson, speaking_practice
  content: jsonb("content").notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  englishText: text("english_text").notNull(),
  chineseText: text("chinese_text").notNull(),
  category: text("category").notNull(), // vocabulary, instruction, general
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const learningAnalytics = pgTable("learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  skillArea: text("skill_area").notNull(), // speaking, reading, writing, listening, vocabulary, grammar
  proficiencyLevel: integer("proficiency_level").notNull(), // 1-5 scale
  strugglingTopics: text("struggling_topics").array(),
  strongTopics: text("strong_topics").array(),
  recommendedDifficulty: text("recommended_difficulty").notNull(), // beginner, intermediate, advanced
  learningStyle: text("learning_style").notNull(), // visual, auditory, kinesthetic, mixed
  adaptiveMetrics: jsonb("adaptive_metrics").notNull(),
  lastAnalysis: timestamp("last_analysis").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const personalizedRecommendations = pgTable("personalized_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id"),
  recommendationType: text("recommendation_type").notNull(), // lesson, exercise, review, challenge
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  priority: integer("priority").notNull(), // 1-5, 5 being highest
  reasoning: text("reasoning").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adaptiveFeedback = pgTable("adaptive_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityId: integer("activity_id"),
  feedbackType: text("feedback_type").notNull(), // encouragement, correction, guidance, achievement
  message: text("message").notNull(),
  chineseTranslation: text("chinese_translation"),
  tone: text("tone").notNull(), // positive, constructive, celebratory, motivational
  triggers: text("triggers").array(), // what caused this feedback
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
});

export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress).omit({
  id: true,
  completedAt: true,
});

export const insertClassGroupSchema = createInsertSchema(classGroups).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertGroupActivitySchema = createInsertSchema(groupActivities).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const insertLearningAnalyticsSchema = createInsertSchema(learningAnalytics).omit({
  id: true,
  lastAnalysis: true,
  createdAt: true,
});

export const insertPersonalizedRecommendationSchema = createInsertSchema(personalizedRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertAdaptiveFeedbackSchema = createInsertSchema(adaptiveFeedback).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ClassGroup = typeof classGroups.$inferSelect;
export type InsertClassGroup = z.infer<typeof insertClassGroupSchema>;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type GroupActivity = typeof groupActivities.$inferSelect;
export type InsertGroupActivity = z.infer<typeof insertGroupActivitySchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type LearningAnalytics = typeof learningAnalytics.$inferSelect;
export type InsertLearningAnalytics = z.infer<typeof insertLearningAnalyticsSchema>;
export type PersonalizedRecommendation = typeof personalizedRecommendations.$inferSelect;
export type InsertPersonalizedRecommendation = z.infer<typeof insertPersonalizedRecommendationSchema>;
export type AdaptiveFeedback = typeof adaptiveFeedback.$inferSelect;
export type InsertAdaptiveFeedback = z.infer<typeof insertAdaptiveFeedbackSchema>;
