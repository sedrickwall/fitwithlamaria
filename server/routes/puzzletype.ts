import { Router } from "express";

const router = Router();

// GET /api/puzzletype?index=0 - Get puzzle type for a specific puzzle index
router.get("/", (req, res) => {
  // Get puzzle index from query parameter (default to 0)
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  
  // Rotate between 3 puzzle types: wordle -> wordsearch -> crossword
  const puzzleTypes = ["wordle", "wordsearch", "crossword"];
  const puzzleType = puzzleTypes[puzzleIndex % 3];
  
  // Calculate difficulty based on puzzle index
  // Every 3 puzzles increases difficulty
  const difficultyLevel = Math.floor(puzzleIndex / 3);
  
  res.json({
    puzzleType,
    puzzleIndex,
    difficultyLevel,
    date: new Date().toISOString().split('T')[0],
  });
});

export default router;
