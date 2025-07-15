import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserPreferencesSchema, insertJobUrlSchema, insertApplicationSchema } from "@shared/schema";
import { getServerSession } from "./lib/auth";
import { r2Storage } from "./lib/storage";
import { z } from "zod";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to get user ID from session or use demo user
  const getUserId = async (req: any): Promise<string> => {
    try {
      const session = await getServerSession();
      return session?.user?.id || 'demo-user-123'; // Fallback to demo user
    } catch {
      return 'demo-user-123'; // Fallback to demo user if auth fails
    }
  };
  
  // User preferences routes
  app.get("/api/user-preferences", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {
        qualifications: "",
        workExperience: "",
        jobPreferences: ""
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/user-preferences", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const validatedData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId: userId
      });
      const preferences = await storage.createOrUpdateUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save user preferences" });
      }
    }
  });

  // Resume upload route
  app.post("/api/upload-resume", upload.single('resume'), async (req, res) => {
    try {
      const userId = await getUserId(req);
      const file = req.file;
      
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      // Generate unique key and upload to R2
      const key = r2Storage.generateResumeKey(userId, file.originalname);
      const url = await r2Storage.uploadFile(file.buffer, key, file.mimetype);
      
      res.json({ url, key });
    } catch (error) {
      console.error("Error uploading resume:", error);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  // Job URLs routes
  app.get("/api/job-urls", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const urls = await storage.getJobUrls(userId);
      res.json(urls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job URLs" });
    }
  });

  app.post("/api/job-urls", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const validatedData = insertJobUrlSchema.parse({
        ...req.body,
        userId: userId
      });
      const jobUrl = await storage.createJobUrl(validatedData);
      res.json(jobUrl);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create job URL" });
      }
    }
  });

  app.patch("/api/job-urls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "applied", "duplicate"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updated = await storage.updateJobUrlStatus(id, status);
      if (!updated) {
        return res.status(404).json({ message: "Job URL not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update job URL" });
    }
  });

  app.delete("/api/job-urls/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteJobUrl(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Job URL not found" });
      }
      
      res.json({ message: "Job URL deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job URL" });
    }
  });

  // Applications routes
  app.get("/api/applications", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const applications = await storage.getApplications(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        userId: userId
      });
      const application = await storage.createApplication(validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updated = await storage.updateApplication(id, updates);
      if (!updated) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteApplication(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = await getUserId(req);
      const stats = await storage.getStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
