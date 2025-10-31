import { Router } from "express";

const router = Router();

// GET /api/puzzletype - Get today's puzzle type
router.get("/", (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  
  // Alternate: even days = wordle, odd days = word search
  const puzzleType = daysSinceEpoch % 2 === 0 ? "wordle" : "wordsearch";
  
  res.json({
    puzzleType,
    puzzleNumber: daysSinceEpoch,
    date: today.toISOString().split('T')[0],
  });
});

export default router;
