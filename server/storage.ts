import { users, userPreferences, jobUrls, applications, type User, type InsertUser, type UserPreferences, type InsertUserPreferences, type JobUrl, type InsertJobUrl, type Application, type InsertApplication } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Job URLs methods
  getJobUrls(userId: number): Promise<JobUrl[]>;
  createJobUrl(jobUrl: InsertJobUrl): Promise<JobUrl>;
  updateJobUrlStatus(id: number, status: string): Promise<JobUrl | undefined>;
  deleteJobUrl(id: number): Promise<boolean>;
  
  // Applications methods
  getApplications(userId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;
  
  // Stats methods
  getStats(userId: number): Promise<{
    totalApplications: number;
    pendingUrls: number;
    interviews: number;
    successRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userPreferences: Map<number, UserPreferences>;
  private jobUrls: Map<number, JobUrl>;
  private applications: Map<number, Application>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.userPreferences = new Map();
    this.jobUrls = new Map();
    this.applications = new Map();
    this.currentId = 1;
    
    // Initialize with default user and data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "demo@jobflow.com",
      password: "password123"
    };
    this.users.set(1, defaultUser);
    
    // Create default preferences
    const defaultPreferences: UserPreferences = {
      id: 1,
      userId: 1,
      qualifications: "Bachelor's in Computer Science, 5+ years experience in web development, proficient in React, Node.js, and cloud technologies.",
      workExperience: "Senior Frontend Developer at TechCorp (2021-2024), Full-stack Developer at StartupXYZ (2019-2021), developed 20+ web applications with 99.9% uptime.",
      jobPreferences: "Remote or hybrid work, salary range $80k-120k, focus on React/Frontend roles, open to leadership opportunities, prefer companies with good work-life balance.",
      updatedAt: new Date()
    };
    this.userPreferences.set(1, defaultPreferences);
    
    this.currentId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId);
    
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        ...preferences,
        qualifications: preferences.qualifications ?? existing.qualifications,
        workExperience: preferences.workExperience ?? existing.workExperience,
        jobPreferences: preferences.jobPreferences ?? existing.jobPreferences,
        updatedAt: new Date()
      };
      this.userPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const newPrefs: UserPreferences = {
        ...preferences,
        id,
        qualifications: preferences.qualifications ?? null,
        workExperience: preferences.workExperience ?? null,
        jobPreferences: preferences.jobPreferences ?? null,
        updatedAt: new Date()
      };
      this.userPreferences.set(id, newPrefs);
      return newPrefs;
    }
  }

  async getJobUrls(userId: number): Promise<JobUrl[]> {
    return Array.from(this.jobUrls.values()).filter(
      (url) => url.userId === userId
    );
  }

  async createJobUrl(jobUrl: InsertJobUrl): Promise<JobUrl> {
    const id = this.currentId++;
    const newJobUrl: JobUrl = {
      ...jobUrl,
      id,
      status: jobUrl.status ?? "pending",
      company: jobUrl.company ?? null,
      position: jobUrl.position ?? null,
      location: jobUrl.location ?? null,
      dateAdded: new Date()
    };
    this.jobUrls.set(id, newJobUrl);
    return newJobUrl;
  }

  async updateJobUrlStatus(id: number, status: string): Promise<JobUrl | undefined> {
    const jobUrl = this.jobUrls.get(id);
    if (jobUrl) {
      const updated = { ...jobUrl, status };
      this.jobUrls.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteJobUrl(id: number): Promise<boolean> {
    return this.jobUrls.delete(id);
  }

  async getApplications(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.userId === userId
    );
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.currentId++;
    const newApplication: Application = {
      ...application,
      id,
      status: application.status ?? "pending",
      location: application.location ?? null,
      jobType: application.jobType ?? null,
      workType: application.workType ?? null,
      notes: application.notes ?? null,
      jobUrl: application.jobUrl ?? null,
      appliedDate: new Date(),
      lastUpdate: new Date()
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (application) {
      const updated = {
        ...application,
        ...updates,
        lastUpdate: new Date()
      };
      this.applications.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteApplication(id: number): Promise<boolean> {
    return this.applications.delete(id);
  }

  async getStats(userId: number): Promise<{
    totalApplications: number;
    pendingUrls: number;
    interviews: number;
    successRate: number;
  }> {
    const applications = await this.getApplications(userId);
    const urls = await this.getJobUrls(userId);
    
    const totalApplications = applications.length;
    const pendingUrls = urls.filter(url => url.status === 'pending').length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
    const successRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;
    
    return {
      totalApplications,
      pendingUrls,
      interviews,
      successRate
    };
  }
}

export const storage = new MemStorage();
