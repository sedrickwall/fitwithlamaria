import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const WORD_LIST = [
  "HAPPY", "SMILE", "PEACE", "LIGHT", "BRAVE",
  "FAITH", "GRACE", "HEART", "DREAM", "TRUST",
  "POWER", "MUSIC", "DANCE", "LAUGH", "ENJOY",
  "CHARM", "PRIDE", "WORTH", "NOBLE", "HONOR",
  "GLORY", "CHEER", "MIRTH", "JOLLY", "BLISS",
  "LUCKY", "SUNNY", "GRAND", "SWEET", "FRESH",
  "CLEAR", "TRUTH", "SMART", "SHARP", "QUICK",
  "AGILE", "FOCUS", "ALERT", "AWARE", "AWAKE",
  "ALIVE", "VITAL", "SPARK", "SHINE", "BRING",
  "RELAX", "QUIET", "STILL", "GIFTS", "LOVED",
  "SHARE", "HELPS", "GUIDE", "TEACH", "LEARN",
  "THINK", "WALKS", "BUILD", "REACH", "CLIMB",
];

function getDailyWord(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % WORD_LIST.length;
  return WORD_LIST[index];
}

function getPuzzleNumber(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Puzzle API Routes
  
  // Get today's puzzle info (without revealing the word)
  app.get("/api/puzzle", (req, res) => {
    const puzzleNumber = getPuzzleNumber();
    res.json({
      puzzleNumber,
      wordLength: 5,
      maxAttempts: 6
    });
  });

  // Validate a guess
  app.post("/api/puzzle/guess", (req, res) => {
    const { guess } = req.body;
    
    if (!guess || typeof guess !== "string") {
      return res.status(400).json({ error: "Guess is required" });
    }

    const normalizedGuess = guess.toUpperCase();
    
    if (normalizedGuess.length !== 5) {
      return res.status(400).json({ error: "Guess must be 5 letters" });
    }

    const dailyWord = getDailyWord();
    const result: Array<"correct" | "present" | "absent"> = Array(5).fill("absent");
    const wordArray = dailyWord.split("");
    const guessArray = normalizedGuess.split("");

    guessArray.forEach((letter, i) => {
      if (letter === wordArray[i]) {
        result[i] = "correct";
      } else if (wordArray.includes(letter)) {
        result[i] = "present";
      }
    });

    const isCorrect = normalizedGuess === dailyWord;

    res.json({
      result,
      isCorrect,
      word: isCorrect ? dailyWord : undefined
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
