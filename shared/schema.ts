import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  level: text("level").notNull().default("beginner"), // beginner, intermediate, advanced
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  preferences: json("preferences").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // learning-paths, speaking, games, cultural, etc.
  level: text("level").notNull(), // beginner, intermediate, advanced
  topic: text("topic").notNull(), // food, travel, technology, etc.
  content: json("content").notNull(), // lesson content structure
  xpReward: integer("xp_reward").notNull().default(25),
  estimatedMinutes: integer("estimated_minutes").notNull().default(15),
  isOfflineAvailable: boolean("is_offline_available").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"), // percentage score if applicable
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // in minutes
  attempts: integer("attempts").notNull().default(1),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // speaking, vocabulary, streak, etc.
  requirement: json("requirement").notNull(), // criteria for earning
  xpReward: integer("xp_reward").notNull().default(50),
  isSecret: boolean("is_secret").notNull().default(false),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const vocabulary = pgTable("vocabulary", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  pronunciation: text("pronunciation"),
  level: text("level").notNull(),
  topic: text("topic").notNull(),
  exampleSentence: text("example_sentence"),
  translation: text("translation"), // Chinese translation
});

export const userVocabulary = pgTable("user_vocabulary", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vocabularyId: integer("vocabulary_id").notNull(),
  mastered: boolean("mastered").notNull().default(false),
  lastPracticed: timestamp("last_practiced"),
  practiceCount: integer("practice_count").notNull().default(0),
});

export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  content: json("content").notNull(),
  xpReward: integer("xp_reward").notNull().default(50),
  completionRequirement: json("completion_requirement").notNull(),
});

export const userDailyChallenges = pgTable("user_daily_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeId: integer("challenge_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActiveDate: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertVocabularySchema = createInsertSchema(vocabulary).omit({
  id: true,
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Vocabulary = typeof vocabulary.$inferSelect;
export type InsertVocabulary = z.infer<typeof insertVocabularySchema>;
export type UserVocabulary = typeof userVocabulary.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;
export type UserDailyChallenge = typeof userDailyChallenges.$inferSelect;
