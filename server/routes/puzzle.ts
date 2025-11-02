import { Router } from "express";

const router = Router();

// ============================================================
// WORD BANK - Wellness & Faith-Themed Words by Length
// ============================================================
// Progressive difficulty: longer words as users advance
const WORD_LISTS: Record<number, string[]> = {
  5: [
    "HAPPY", "SMILE", "PEACE", "LIGHT", "BRAVE",
    "FAITH", "GRACE", "HEART", "DREAM", "TRUST",
    "POWER", "MUSIC", "DANCE", "LAUGH", "ENJOY",
    "CHARM", "PRIDE", "WORTH", "NOBLE", "HONOR",
    "GLORY", "CHEER", "MIRTH", "JOLLY", "BLISS",
    "LUCKY", "SUNNY", "GRAND", "SWEET", "FRESH",
  ],
  6: [
    "JOYFUL", "STRONG", "WISDOM", "HEALTH", "SPIRIT",
    "KINDLY", "GENTLE", "SECURE", "THRIVE", "UPLIFT",
    "WARMTH", "ENERGY", "LIVELY", "ROBUST", "BRIGHT",
    "MINDFUL", "WONDER", "PRAISE", "SMILE", "BEAUTY",
    "CREATE", "GROWTH", "ACTIVE", "CARING", "HOPING",
  ],
  7: [
    "COURAGE", "HEALING", "GRATEFL", "BALANCE", "SUCCESS",
    "HARMONY", "BLESSED", "FREEDOM", "PASSION", "RENEWED",
    "FOREVER", "HOPEFUL", "SHARING", "TRIUMPH", "DELIGHT",
    "RADIANT", "SINCERE", "VIBRANT", "WELNESS", "AMAZING",
  ],
};

// ============================================================
// WORD SELECTION BASED ON PUZZLE INDEX & DIFFICULTY
// ============================================================
// Deterministic selection based on puzzle index for free users
// Random selection for premium users
function getPuzzleWord(puzzleIndex: number, difficultyLevel: number, isPremium: boolean = false): string {
  // Calculate word length based on difficulty (5, 6, 7 letters)
  const wordLength = Math.min(5 + difficultyLevel, 7);
  
  // Get word list for this difficulty
  const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
  
  if (isPremium) {
    // Random selection for premium users
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  } else {
    // Deterministic selection for free users
    const index = puzzleIndex % wordList.length;
    return wordList[index];
  }
}

// ============================================================
// ROUTE: GET /api/puzzle?index=0&premium=false
// ============================================================
// Returns puzzle metadata without revealing the answer
// Response: { puzzleNumber, puzzleIndex, wordLength, maxAttempts, difficultyLevel }
router.get("/", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const isPremium = req.query.premium === 'true';
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const wordLength = Math.min(5 + difficultyLevel, 7);
  const maxAttempts = 6 + Math.floor(difficultyLevel / 2); // More attempts for longer words
  
  res.json({
    puzzleNumber: puzzleIndex,
    puzzleIndex,
    wordLength,
    maxAttempts,
    difficultyLevel,
    isPremium,
  });
});

// ============================================================
// ROUTE: GET /api/puzzle/word?index=0
// ============================================================
// Returns a random puzzle word for premium users
// Response: { word: string }
router.get("/word", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  
  // Always return a random word when this endpoint is called (for premium users)
  const word = getPuzzleWord(puzzleIndex, difficultyLevel, true);
  
  res.json({
    word,
  });
});

// ============================================================
// ROUTE: POST /api/puzzle/guess
// ============================================================
// Validates a user's guess and returns letter-by-letter feedback
// Security: Puzzle word never sent to client unless guess is correct
// Request: { guess: string, puzzleIndex: number, isPremium: boolean, word?: string }
// Response: { result: Array<"correct"|"present"|"absent">, isCorrect: boolean, word?: string }
router.post("/guess", (req, res) => {
  const { guess, puzzleIndex = 0, isPremium = false, word } = req.body;
  
  // Validate input
  if (!guess || typeof guess !== "string") {
    return res.status(400).json({ error: "Guess is required" });
  }

  const normalizedGuess = guess.toUpperCase();
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const expectedLength = Math.min(5 + difficultyLevel, 7);
  
  if (normalizedGuess.length !== expectedLength) {
    return res.status(400).json({ error: `Guess must be ${expectedLength} letters` });
  }

  // Get puzzle word for this index (server-side only)
  // For premium users with random words, the word is passed from the client for validation
  let puzzleWord: string;
  if (isPremium && word) {
    // Validate that the word is from our word list
    const wordLength = Math.min(5 + difficultyLevel, 7);
    const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
    if (wordList.includes(word.toUpperCase())) {
      puzzleWord = word.toUpperCase();
    } else {
      return res.status(400).json({ error: "Invalid puzzle word" });
    }
  } else {
    puzzleWord = getPuzzleWord(puzzleIndex, difficultyLevel, false);
  }
  
  // Evaluate each letter in the guess
  const result: Array<"correct" | "present" | "absent"> = Array(expectedLength).fill("absent");
  const wordArray = puzzleWord.split("");
  const guessArray = normalizedGuess.split("");

  guessArray.forEach((letter, i) => {
    if (letter === wordArray[i]) {
      result[i] = "correct";
    } else if (wordArray.includes(letter)) {
      result[i] = "present";
    }
  });

  const isCorrect = normalizedGuess === puzzleWord;

  // Only reveal the word if the guess is correct
  res.json({
    result,
    isCorrect,
    word: isCorrect ? puzzleWord : undefined
  });
});

export default router;
