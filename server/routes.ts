import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserPreferencesSchema, insertJobUrlSchema, insertApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = 1; // For demo purposes, using a fixed user ID
  
  // User preferences routes
  app.get("/api/user-preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(DEFAULT_USER_ID);
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
      const validatedData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
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

  // Job URLs routes
  app.get("/api/job-urls", async (req, res) => {
    try {
      const urls = await storage.getJobUrls(DEFAULT_USER_ID);
      res.json(urls);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job URLs" });
    }
  });

  app.post("/api/job-urls", async (req, res) => {
    try {
      const validatedData = insertJobUrlSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
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
      const applications = await storage.getApplications(DEFAULT_USER_ID);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
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
      const stats = await storage.getStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
