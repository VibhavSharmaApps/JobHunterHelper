import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Auth tables for NextAuth
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull(),
  expires: timestamp("expires").notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  qualifications: text("qualifications"),
  workExperience: text("work_experience"),
  jobPreferences: text("job_preferences"),
  resumeUrl: text("resume_url"), // Cloudflare R2 URL
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobUrls = pgTable("job_urls", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  company: text("company"),
  position: text("position"),
  location: text("location"),
  status: text("status").notNull().default("pending"), // pending, applied, duplicate
  dateAdded: timestamp("date_added").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  location: text("location"),
  jobType: text("job_type"), // full-time, part-time, contract, etc.
  workType: text("work_type"), // remote, hybrid, on-site
  status: text("status").notNull().default("pending"), // pending, interview, rejected, accepted
  appliedDate: timestamp("applied_date").defaultNow(),
  lastUpdate: timestamp("last_update").defaultNow(),
  notes: text("notes"),
  jobUrl: text("job_url"),
  resumeUsed: text("resume_used"), // Cloudflare R2 URL of resume used
});

// Insert schemas
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true,
});

export const insertJobUrlSchema = createInsertSchema(jobUrls).omit({
  id: true,
  dateAdded: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedDate: true,
  lastUpdate: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  emailVerified: true,
});

// Types
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertJobUrl = z.infer<typeof insertJobUrlSchema>;
export type JobUrl = typeof jobUrls.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Auth types
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
