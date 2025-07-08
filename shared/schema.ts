import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  qualifications: text("qualifications"),
  workExperience: text("work_experience"),
  jobPreferences: text("job_preferences"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobUrls = pgTable("job_urls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  url: text("url").notNull(),
  company: text("company"),
  position: text("position"),
  location: text("location"),
  status: text("status").notNull().default("pending"), // pending, applied, duplicate
  dateAdded: timestamp("date_added").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
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

// Types
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertJobUrl = z.infer<typeof insertJobUrlSchema>;
export type JobUrl = typeof jobUrls.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
