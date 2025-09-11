import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bilets = pgTable("bilets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: integer("number").notNull().unique(),
  title: text("title").notNull(), // Legacy field
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  titleUzC: text("title_uzc").notNull(),
  description: text("description"), // Legacy field
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionUzC: text("description_uzc"),
  questionCount: integer("question_count").notNull().default(20),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  biletId: varchar("bilet_id").references(() => bilets.id),
  topicId: varchar("topic_id").references(() => topics.id),
  questionText: text("question_text").notNull(), // Legacy field
  questionTextUz: text("question_text_uz").notNull(),
  questionTextRu: text("question_text_ru").notNull(),
  questionTextUzC: text("question_text_uzc").notNull(),
  options: json("options").$type<string[]>().notNull(), // Legacy field
  optionsUz: json("options_uz").$type<string[]>().notNull(),
  optionsRu: json("options_ru").$type<string[]>().notNull(),
  optionsUzC: json("options_uzc").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  explanationUz: text("explanation_uz"),
  explanationRu: text("explanation_ru"),
  explanationUzC: text("explanation_uzc"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // Legacy field
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  nameUzC: text("name_uzc").notNull(),
  description: text("description"), // Legacy field
  descriptionUz: text("description_uz"),
  descriptionRu: text("description_ru"),
  descriptionUzC: text("description_uzc"),
  questionCount: integer("question_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  testType: text("test_type").notNull(), // 'bilet', 'topic', 'real'
  testId: varchar("test_id").notNull(), // bilet/topic id
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  answers: json("answers").$type<Record<string, number>>().notNull(),
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  phone: true,
  password: true,
});

export const insertBiletSchema = createInsertSchema(bilets).pick({
  number: true,
  title: true,
  description: true,
  questionCount: true,
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  biletId: true,
  topicId: true,
  questionText: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  imageUrl: true,
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  name: true,
  description: true,
  questionCount: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).pick({
  userId: true,
  testType: true,
  testId: true,
  score: true,
  totalQuestions: true,
  correctAnswers: true,
  timeSpent: true,
  answers: true,
  passed: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBilet = z.infer<typeof insertBiletSchema>;
export type Bilet = typeof bilets.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;
