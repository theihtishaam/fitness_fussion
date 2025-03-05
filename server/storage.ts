import { IStorage } from "./storage";
import createMemoryStore from "memorystore";
import session from "express-session";
import { User, Workout, NutritionLog, InsertUser } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private nutritionLogs: Map<number, NutritionLog>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.nutritionLogs = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
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
    const user: User = { ...insertUser, id, isPremium: false };
    this.users.set(id, user);
    return user;
  }

  async getWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId,
    );
  }

  async createWorkout(userId: number, workout: Omit<Workout, "id" | "userId">): Promise<Workout> {
    const id = this.currentId++;
    const newWorkout = { ...workout, id, userId };
    this.workouts.set(id, newWorkout);
    return newWorkout;
  }

  async getNutritionLogs(userId: number): Promise<NutritionLog[]> {
    return Array.from(this.nutritionLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }

  async createNutritionLog(userId: number, log: Omit<NutritionLog, "id" | "userId">): Promise<NutritionLog> {
    const id = this.currentId++;
    const newLog = { ...log, id, userId };
    this.nutritionLogs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
