import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, Response } from "express";
import puzzleRouter from "../server/routes/puzzle";
import wordsearchRouter from "../server/routes/wordsearch";
import crosswordRouter from "../server/routes/crossword";
import puzzletypeRouter from "../server/routes/puzzletype";
import stripeRouter from "../server/routes/stripe";

const app = express();

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

app.use("/api/puzzle", puzzleRouter);
app.use("/api/wordsearch", wordsearchRouter);
app.use("/api/crossword", crosswordRouter);
app.use("/api/puzzletype", puzzletypeRouter);
app.use("/api/stripe", stripeRouter);

app.use((err: any, _req: Request, res: Response) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
