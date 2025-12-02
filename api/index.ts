import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, type Response } from "express";

import puzzleRouter from "../server/routes/puzzle.js";
import wordsearchRouter from "../server/routes/wordsearch.js";
import crosswordRouter from "../server/routes/crossword.js";
import puzzletypeRouter from "../server/routes/puzzletype.js";
import stripeRouter from "../server/routes/stripe.js";

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

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", routes: ["puzzle", "wordsearch", "crossword", "puzzletype", "stripe"] });
});

// Register all puzzle routes
app.use("/api/puzzle", puzzleRouter);
app.use("/api/wordsearch", wordsearchRouter);
app.use("/api/crossword", crosswordRouter);
app.use("/api/puzzletype", puzzletypeRouter);

// Payment
app.use("/api/stripe", stripeRouter);

// Error handler (must have 4 parameters for Express to recognize it)
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Vercel entrypoint
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
