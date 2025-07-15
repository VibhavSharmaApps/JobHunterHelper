import { eq, count } from 'drizzle-orm';
import { users, userPreferences, jobUrls, applications, type User, type InsertUser, type UserPreferences, type InsertUserPreferences, type JobUrl, type InsertJobUrl, type Application, type InsertApplication } from "@shared/schema";
import { db } from './lib/supabase';

export interface IStorage {
  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Job URLs methods
  getJobUrls(userId: string): Promise<JobUrl[]>;
  createJobUrl(jobUrl: InsertJobUrl): Promise<JobUrl>;
  updateJobUrlStatus(id: number, status: string): Promise<JobUrl | undefined>;
  deleteJobUrl(id: number): Promise<boolean>;
  
  // Applications methods
  getApplications(userId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;
  
  // Stats methods
  getStats(userId: string): Promise<{
    totalApplications: number;
    pendingUrls: number;
    interviews: number;
    successRate: number;
  }>;
}

export class SupabaseStorage implements IStorage {
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    if (!db) {
      // Fallback to demo data when database is not available
      return {
        id: 1,
        userId: userId,
        qualifications: "Bachelor's in Computer Science, 5+ years experience in web development, proficient in React, Node.js, and cloud technologies.",
        workExperience: "Senior Frontend Developer at TechCorp (2021-2024), Full-stack Developer at StartupXYZ (2019-2021), developed 20+ web applications with 99.9% uptime.",
        jobPreferences: "Remote or hybrid work, salary range $80k-120k, focus on React/Frontend roles, open to leadership opportunities, prefer companies with good work-life balance.",
        resumeUrl: null,
        updatedAt: new Date()
      };
    }
    
    const result = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    
    return result[0];
  }

  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    if (!db) {
      // Fallback response for demo
      return {
        id: 1,
        userId: preferences.userId,
        qualifications: preferences.qualifications || null,
        workExperience: preferences.workExperience || null,
        jobPreferences: preferences.jobPreferences || null,
        resumeUrl: null,
        updatedAt: new Date()
      };
    }
    
    const existing = await this.getUserPreferences(preferences.userId);
    
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.id, existing.id))
        .returning();
      
      return updated;
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values({
          ...preferences,
          updatedAt: new Date()
        })
        .returning();
      
      return created;
    }
  }

  async getJobUrls(userId: string): Promise<JobUrl[]> {
    if (!db) {
      // Fallback to empty array for demo
      return [];
    }
    
    return await db
      .select()
      .from(jobUrls)
      .where(eq(jobUrls.userId, userId))
      .orderBy(jobUrls.dateAdded);
  }

  async createJobUrl(jobUrl: InsertJobUrl): Promise<JobUrl> {
    if (!db) {
      // Fallback response for demo
      return {
        id: 1,
        userId: jobUrl.userId,
        url: jobUrl.url,
        company: jobUrl.company || null,
        position: jobUrl.position || null,
        location: jobUrl.location || null,
        status: jobUrl.status || "pending",
        dateAdded: new Date()
      };
    }
    
    const [created] = await db
      .insert(jobUrls)
      .values({
        ...jobUrl,
        dateAdded: new Date()
      })
      .returning();
    
    return created;
  }

  async updateJobUrlStatus(id: number, status: string): Promise<JobUrl | undefined> {
    if (!db) {
      return undefined;
    }
    
    const [updated] = await db
      .update(jobUrls)
      .set({ status })
      .where(eq(jobUrls.id, id))
      .returning();
    
    return updated;
  }

  async deleteJobUrl(id: number): Promise<boolean> {
    if (!db) {
      return true; // Fallback success for demo
    }
    
    const result = await db
      .delete(jobUrls)
      .where(eq(jobUrls.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getApplications(userId: string): Promise<Application[]> {
    if (!db) {
      // Fallback to empty array for demo
      return [];
    }
    
    return await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(applications.appliedDate);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    if (!db) {
      // Fallback response for demo
      return {
        id: 1,
        userId: application.userId,
        company: application.company,
        position: application.position,
        location: application.location || null,
        jobType: application.jobType || null,
        workType: application.workType || null,
        status: application.status || "pending",
        appliedDate: new Date(),
        lastUpdate: new Date(),
        notes: application.notes || null,
        jobUrl: application.jobUrl || null,
        resumeUsed: null
      };
    }
    
    const [created] = await db
      .insert(applications)
      .values({
        ...application,
        appliedDate: new Date(),
        lastUpdate: new Date()
      })
      .returning();
    
    return created;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    if (!db) {
      return undefined;
    }
    
    const [updated] = await db
      .update(applications)
      .set({
        ...updates,
        lastUpdate: new Date()
      })
      .where(eq(applications.id, id))
      .returning();
    
    return updated;
  }

  async deleteApplication(id: number): Promise<boolean> {
    if (!db) {
      return true; // Fallback success for demo
    }
    
    const result = await db
      .delete(applications)
      .where(eq(applications.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getStats(userId: string): Promise<{
    totalApplications: number;
    pendingUrls: number;
    interviews: number;
    successRate: number;
  }> {
    if (!db) {
      // Fallback stats for demo
      return {
        totalApplications: 0,
        pendingUrls: 0,
        interviews: 0,
        successRate: 0
      };
    }
    
    const [totalApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.userId, userId));

    const [pendingUrlsCount] = await db
      .select({ count: count() })
      .from(jobUrls)
      .where(eq(jobUrls.userId, userId))
      .where(eq(jobUrls.status, 'pending'));

    const [interviewsCount] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.userId, userId))
      .where(eq(applications.status, 'interview'));

    const [acceptedCount] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.userId, userId))
      .where(eq(applications.status, 'accepted'));

    const totalApplications = totalApps.count;
    const pendingUrls = pendingUrlsCount.count;
    const interviews = interviewsCount.count;
    const successRate = totalApplications > 0 ? Math.round((acceptedCount.count / totalApplications) * 100) : 0;
    
    return {
      totalApplications,
      pendingUrls,
      interviews,
      successRate
    };
  }
}

export const storage = new SupabaseStorage();
