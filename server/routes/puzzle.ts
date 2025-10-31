import { Router } from "express";

const router = Router();

// ============================================================
// WORD BANK - Wellness & Faith-Themed Words
// ============================================================
// These positive, uplifting words align with the FitWithLaMaria
// brand values and are appropriate for the target audience (65+)
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

// ============================================================
// DAILY WORD SELECTION LOGIC
// ============================================================
// Deterministic selection based on days since epoch
// Ensures all users see the same word on the same day
function getDailyWord(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % WORD_LIST.length;
  return WORD_LIST[index];
}

// ============================================================
// PUZZLE NUMBER CALCULATION
// ============================================================
// Used for display purposes and sharing (e.g., "Puzzle #20392")
function getPuzzleNumber(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
}

// ============================================================
// ROUTE: GET /api/puzzle
// ============================================================
// Returns puzzle metadata without revealing the answer
// Response: { puzzleNumber, wordLength, maxAttempts }
router.get("/", (req, res) => {
  const puzzleNumber = getPuzzleNumber();
  res.json({
    puzzleNumber,
    wordLength: 5,
    maxAttempts: 6
  });
});

// ============================================================
// ROUTE: POST /api/puzzle/guess
// ============================================================
// Validates a user's guess and returns letter-by-letter feedback
// Security: Daily word never sent to client unless guess is correct
// Request: { guess: string }
// Response: { result: Array<"correct"|"present"|"absent">, isCorrect: boolean, word?: string }
router.post("/guess", (req, res) => {
  const { guess } = req.body;
  
  // Validate input
  if (!guess || typeof guess !== "string") {
    return res.status(400).json({ error: "Guess is required" });
  }

  const normalizedGuess = guess.toUpperCase();
  
  if (normalizedGuess.length !== 5) {
    return res.status(400).json({ error: "Guess must be 5 letters" });
  }

  // Get today's word (server-side only)
  const dailyWord = getDailyWord();
  
  // Evaluate each letter in the guess
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

  // Only reveal the word if the guess is correct
  res.json({
    result,
    isCorrect,
    word: isCorrect ? dailyWord : undefined
  });
});

export default router;
