import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, type Response } from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let initError: Error | null = null;
let puzzleRouter: any;
let wordsearchRouter: any;
let crosswordRouter: any;
let puzzletypeRouter: any;
let stripeRouter: any;

try {
  puzzleRouter = require("../server/routes/puzzle").default;
  wordsearchRouter = require("../server/routes/wordsearch").default;
  crosswordRouter = require("../server/routes/crossword").default;
  puzzletypeRouter = require("../server/routes/puzzletype").default;
  stripeRouter = require("../server/routes/stripe").default;
} catch (err: any) {
  initError = err;
  console.error("Failed to load routes:", err);
}

const app = express();

// Support raw body for Stripe
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Health check endpoint to debug initialization
app.get("/api/health", (_req, res) => {
  if (initError) {
    return res.status(500).json({ 
      status: "error", 
      error: initError.message,
      stack: initError.stack 
    });
  }
  res.json({ status: "ok", routes: ["puzzle", "wordsearch", "crossword", "puzzletype", "stripe"] });
});

// Check if routes loaded successfully before registering
if (initError) {
  app.use("/api", (_req, res) => {
    res.status(500).json({ 
      error: "Server initialization failed", 
      message: initError?.message 
    });
  });
} else {
  // Register all puzzle routes
  app.use("/api/puzzle", puzzleRouter);
  app.use("/api/wordsearch", wordsearchRouter);
  app.use("/api/crossword", crosswordRouter);
  app.use("/api/puzzletype", puzzletypeRouter);

  // Payment
  app.use("/api/stripe", stripeRouter);
}

// Error handler (must have 4 parameters for Express to recognize it)
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Vercel entrypoint
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
