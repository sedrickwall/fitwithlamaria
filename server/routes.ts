import type { Express } from "express";
import { createServer, type Server } from "http";
import puzzleRouter from "./routes/puzzle";
import wordsearchRouter from "./routes/wordsearch";
import puzzletypeRouter from "./routes/puzzletype";

// ============================================================
// ROUTE REGISTRATION
// ============================================================
// This function registers all API routes for the application.
// Routes are organized by feature domain for better scalability.
// 
// Current routes:
// - /api/puzzle - Daily word puzzle game (secure, server-validated)
// 
// Future routes can be added here:
// - /api/auth - User authentication and session management
// - /api/leaderboard - Global and friend leaderboards
// - /api/profile - User profile and settings
// - /api/workouts - Workout library and completion tracking
// - /api/admin - Admin panel for content management
// ============================================================

export async function registerRoutes(app: Express): Promise<Server> {
  // Register puzzle routes under /api/puzzle
  app.use("/api/puzzle", puzzleRouter);
  
  // Register word search routes under /api/wordsearch
  app.use("/api/wordsearch", wordsearchRouter);
  
  // Register puzzle type detection under /api/puzzletype
  app.use("/api/puzzletype", puzzletypeRouter);

  // Additional routes can be registered here as the app grows
  // Example:
  // app.use("/api/auth", authRouter);
  // app.use("/api/leaderboard", leaderboardRouter);

  const httpServer = createServer(app);

  return httpServer;
}
