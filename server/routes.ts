import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertWorkoutSchema, insertNutritionLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const workouts = await storage.getWorkouts(req.user.id);
    res.json(workouts);
  });

  app.post("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertWorkoutSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    
    const workout = await storage.createWorkout(req.user.id, parsed.data);
    res.status(201).json(workout);
  });

  // Nutrition routes
  app.get("/api/nutrition", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getNutritionLogs(req.user.id);
    res.json(logs);
  });

  app.post("/api/nutrition", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertNutritionLogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const log = await storage.createNutritionLog(req.user.id, parsed.data);
    res.status(201).json(log);
  });

  const httpServer = createServer(app);
  return httpServer;
}
