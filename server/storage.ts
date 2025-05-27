import {
  users,
  tasks,
  pomodoroSessions,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type PomodoroSession,
  type InsertPomodoroSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: number, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask, userId: string): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>, userId: string): Promise<Task | undefined>;
  deleteTask(id: number, userId: string): Promise<boolean>;
  
  // Pomodoro Sessions
  getPomodoroSessions(userId: string): Promise<PomodoroSession[]>;
  createPomodoroSession(session: InsertPomodoroSession, userId: string): Promise<PomodoroSession>;
  getTodaysPomodoroSessions(userId: string): Promise<PomodoroSession[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(tasks.completed, tasks.priority, tasks.createdAt);
  }

  async getTask(id: number, userId: string): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return task;
  }

  async createTask(insertTask: InsertTask, userId: string): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({ ...insertTask, userId })
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>, userId: string): Promise<Task | undefined> {
    const updateData: any = { ...updates };
    if (updates.completed && updates.completed === true) {
      updateData.completedAt = new Date();
    }
    
    const [task] = await db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    return task;
  }

  async deleteTask(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return result.rowCount > 0;
  }

  // Pomodoro Sessions
  async getPomodoroSessions(userId: string): Promise<PomodoroSession[]> {
    return await db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.userId, userId));
  }

  async createPomodoroSession(insertSession: InsertPomodoroSession, userId: string): Promise<PomodoroSession> {
    const [session] = await db
      .insert(pomodoroSessions)
      .values({ ...insertSession, userId })
      .returning();
    return session;
  }

  async getTodaysPomodoroSessions(userId: string): Promise<PomodoroSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(pomodoroSessions)
      .where(
        and(
          eq(pomodoroSessions.userId, userId),
          eq(pomodoroSessions.createdAt, today)
        )
      );
  }
}

export const storage = new DatabaseStorage();
