import { Router } from "express";

const router = Router();

// ============================================================
// CROSSWORD PUZZLES - Health & Fitness Themed
// ============================================================

interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordPuzzle {
  grid: string[][];
  clues: CrosswordClue[];
  size: number;
}

// Health-themed crossword puzzles
const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  // Puzzle 1 - Basic Health (7x7)
  {
    size: 7,
    grid: [
      ["W", "A", "L", "K", "S", "", ""],
      ["", "", "", "", "L", "", ""],
      ["", "Y", "O", "G", "A", "", ""],
      ["", "", "", "", "", "", ""],
      ["F", "I", "B", "E", "R", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ],
    clues: [
      { number: 1, direction: "across", clue: "Best daily exercise for seniors (5 letters)", answer: "WALKS", row: 0, col: 0 },
      { number: 2, direction: "down", clue: "Keeps joints flexible and reduces fall risk (5 letters)", answer: "SLEEP", row: 0, col: 4 },
      { number: 3, direction: "across", clue: "Ancient practice for flexibility and balance (4 letters)", answer: "YOGA", row: 2, col: 1 },
      { number: 4, direction: "across", clue: "Nutrient in whole grains that aids digestion (5 letters)", answer: "FIBER", row: 4, col: 0 },
    ],
  },
  
  // Puzzle 2 - Nutrition (8x8)
  {
    size: 8,
    grid: [
      ["", "", "P", "R", "O", "T", "E", "I", "N"],
      ["", "", "", "", "", "", "", "", ""],
      ["C", "A", "L", "C", "I", "U", "M", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "V", "I", "T", "A", "M", "I", "N", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["W", "A", "T", "E", "R", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
    clues: [
      { number: 1, direction: "across", clue: "Seniors need MORE of this to maintain muscle (7 letters)", answer: "PROTEIN", row: 0, col: 2 },
      { number: 2, direction: "across", clue: "Essential mineral for bone health, 1200mg daily for 65+ (7 letters)", answer: "CALCIUM", row: 2, col: 0 },
      { number: 3, direction: "across", clue: "B12 and D are important types of this (7 letters)", answer: "VITAMIN", row: 4, col: 1 },
      { number: 4, direction: "across", clue: "Drink 6-8 glasses daily, thirst signals weaken with age (5 letters)", answer: "WATER", row: 6, col: 0 },
    ],
  },
  
  // Puzzle 3 - Exercise & Safety (9x9)
  {
    size: 9,
    grid: [
      ["B", "A", "L", "A", "N", "C", "E", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "M", "U", "S", "C", "L", "E", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "S", "T", "R", "E", "T", "C", "H"],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["P", "O", "S", "T", "U", "R", "E", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ],
    clues: [
      { number: 1, direction: "across", clue: "Training reduces fall risk by 23% (7 letters)", answer: "BALANCE", row: 0, col: 0 },
      { number: 2, direction: "across", clue: "You can build this at any age with resistance training (6 letters)", answer: "MUSCLE", row: 2, col: 1 },
      { number: 3, direction: "across", clue: "Hold for 30 seconds, never bounce (7 letters)", answer: "STRETCH", row: 4, col: 2 },
      { number: 4, direction: "across", clue: "Good alignment prevents pain and improves breathing (7 letters)", answer: "POSTURE", row: 7, col: 0 },
    ],
  },
];

// ============================================================
// ROUTE: GET /api/crossword?index=0
// ============================================================
// Returns crossword puzzle data
router.get("/", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const puzzleNumber = puzzleIndex % CROSSWORD_PUZZLES.length;
  const puzzle = CROSSWORD_PUZZLES[puzzleNumber];
  
  res.json({
    puzzleNumber,
    puzzleIndex,
    size: puzzle.size,
    clues: puzzle.clues,
  });
});

// ============================================================
// ROUTE: POST /api/crossword/check
// ============================================================
// Validates crossword answers
router.post("/check", (req, res) => {
  const { puzzleIndex = 0, answers } = req.body;
  
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Answers required" });
  }
  
  const puzzleNumber = puzzleIndex % CROSSWORD_PUZZLES.length;
  const puzzle = CROSSWORD_PUZZLES[puzzleNumber];
  
  // Check each answer
  const results: Record<number, boolean> = {};
  let correctCount = 0;
  
  puzzle.clues.forEach(clue => {
    const userAnswer = answers[clue.number]?.toUpperCase() || "";
    const isCorrect = userAnswer === clue.answer;
    results[clue.number] = isCorrect;
    if (isCorrect) correctCount++;
  });
  
  const isComplete = correctCount === puzzle.clues.length;
  
  res.json({
    results,
    correctCount,
    totalClues: puzzle.clues.length,
    isComplete,
    grid: isComplete ? puzzle.grid : undefined,
  });
});

export default router;
