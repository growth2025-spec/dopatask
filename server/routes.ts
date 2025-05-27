import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTaskSchema, insertPomodoroSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las tareas" });
    }
  });

  app.post("/api/tasks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData, userId);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos de tarea inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al crear la tarea" });
      }
    }
  });

  app.patch("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de tarea inválido" });
      }

      const updates = req.body;
      const task = await storage.updateTask(id, updates, userId);
      
      if (!task) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la tarea" });
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID de tarea inválido" });
      }

      const deleted = await storage.deleteTask(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la tarea" });
    }
  });

  // Pomodoro sessions routes
  app.get("/api/pomodoro/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getPomodoroSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las sesiones de pomodoro" });
    }
  });

  app.get("/api/pomodoro/sessions/today", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getTodaysPomodoroSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las sesiones de hoy" });
    }
  });

  app.post("/api/pomodoro/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertPomodoroSessionSchema.parse(req.body);
      const session = await storage.createPomodoroSession(sessionData, userId);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos de sesión inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al crear la sesión de pomodoro" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
