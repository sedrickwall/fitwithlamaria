import { Router } from "express";

const router = Router();

// Word lists for word search puzzles
const WORD_LISTS = [
  ["HAPPY", "JOY", "SMILE", "PEACE", "CALM"],
  ["STRONG", "BRAVE", "POWER", "FOCUS", "SHARP"],
  ["HEALTH", "VITAL", "ENERGY", "ALIVE", "FIT"],
  ["TRUST", "FAITH", "HOPE", "LOVE", "GRACE"],
  ["BRIGHT", "SHINE", "LIGHT", "SPARK", "GLOW"],
  ["MUSIC", "DANCE", "LAUGH", "CHEER", "PLAY"],
  ["QUIET", "STILL", "REST", "RELAX", "EASE"],
];

// Helper function to get word list for a specific day
function getDailyWords(): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const index = daysSinceEpoch % WORD_LISTS.length;
  return WORD_LISTS[index];
}

// Deterministic random number generator using date as seed
function seededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Generate word search grid deterministically based on date
function generateWordSearchGrid(words: string[], size: number = 10, seed: number): { grid: string[][], placements: Record<string, number[][]> } {
  const random = seededRandom(seed);
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(""));
  const placements: Record<string, number[][]> = {};

  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1],  // diagonal down-left
    [-1, 1],  // diagonal up-right
  ];

  const canPlaceWord = (word: string, row: number, col: number, dir: number[]): boolean => {
    const [dRow, dCol] = dir;
    const endRow = row + dRow * (word.length - 1);
    const endCol = col + dCol * (word.length - 1);

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const r = row + dRow * i;
      const c = col + dCol * i;
      if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (word: string, row: number, col: number, dir: number[]): number[][] => {
    const [dRow, dCol] = dir;
    const coords: number[][] = [];

    for (let i = 0; i < word.length; i++) {
      const r = row + dRow * i;
      const c = col + dCol * i;
      grid[r][c] = word[i];
      coords.push([r, c]);
    }

    return coords;
  };

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const row = Math.floor(random() * size);
      const col = Math.floor(random() * size);
      const dir = directions[Math.floor(random() * directions.length)];

      if (canPlaceWord(word, row, col, dir)) {
        const coords = placeWord(word, row, col, dir);
        placements[word] = coords;
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = letters[Math.floor(random() * letters.length)];
      }
    }
  }

  return { grid, placements };
}

// GET /api/wordsearch - Get daily word search puzzle
router.get("/", (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  
  const words = getDailyWords();
  const { grid, placements } = generateWordSearchGrid(words, 10, daysSinceEpoch);

  res.json({
    grid,
    words,
    size: grid.length,
    puzzleNumber: daysSinceEpoch,
  });
});

// POST /api/wordsearch/validate - Validate found word
router.post("/validate", (req, res) => {
  const { word, coordinates } = req.body;

  if (!word || !coordinates) {
    return res.status(400).json({ error: "Word and coordinates required" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

  const dailyWords = getDailyWords();
  const { placements } = generateWordSearchGrid(dailyWords, 10, daysSinceEpoch);
  
  const wordUpper = word.toUpperCase();
  const isValid = dailyWords.includes(wordUpper);
  
  // Verify coordinates match the actual word placement
  let coordinatesValid = false;
  if (isValid && placements[wordUpper]) {
    const expectedCoords = placements[wordUpper];
    coordinatesValid = JSON.stringify(coordinates) === JSON.stringify(expectedCoords) ||
                       JSON.stringify(coordinates) === JSON.stringify(expectedCoords.reverse());
  }

  res.json({
    valid: isValid && coordinatesValid,
    word: wordUpper,
  });
});

export default router;
