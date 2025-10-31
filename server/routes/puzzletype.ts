import { Router } from "express";

const router = Router();

// GET /api/puzzletype?index=0 - Get puzzle type for a specific puzzle index
router.get("/", (req, res) => {
  // Get puzzle index from query parameter (default to 0)
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  
  // Alternate based on puzzle index: even index = wordle, odd index = word search
  const puzzleType = puzzleIndex % 2 === 0 ? "wordle" : "wordsearch";
  
  // Calculate difficulty based on puzzle index
  // Every 2 puzzles increases difficulty
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  
  res.json({
    puzzleType,
    puzzleIndex,
    difficultyLevel,
    date: new Date().toISOString().split('T')[0],
  });
});

export default router;
