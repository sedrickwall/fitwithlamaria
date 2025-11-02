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

// Helper function to get word list for a specific puzzle index
function getPuzzleWords(puzzleIndex: number, isPremium: boolean = false): string[] {
  if (isPremium) {
    // Random selection for premium users
    const randomIndex = Math.floor(Math.random() * WORD_LISTS.length);
    return WORD_LISTS[randomIndex];
  } else {
    // Deterministic selection for free users
    const index = puzzleIndex % WORD_LISTS.length;
    return WORD_LISTS[index];
  }
}

// Calculate grid size based on difficulty level
function getGridSize(difficultyLevel: number): number {
  // Start at 10x10, increase by 2 for each difficulty level (max 16x16)
  return Math.min(10 + (difficultyLevel * 2), 16);
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

// GET /api/wordsearch?index=0&premium=false - Get word search puzzle for specific index
router.get("/", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const isPremium = req.query.premium === 'true';
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const gridSize = getGridSize(difficultyLevel);
  
  const words = getPuzzleWords(puzzleIndex, isPremium);
  // Use random seed for premium users to get different grids
  const seed = isPremium ? Date.now() : puzzleIndex;
  const { grid, placements } = generateWordSearchGrid(words, gridSize, seed);

  res.json({
    grid,
    words,
    size: grid.length,
    puzzleIndex,
    puzzleNumber: puzzleIndex,
    difficultyLevel,
    isPremium,
  });
});

// POST /api/wordsearch/validate - Validate found word
router.post("/validate", (req, res) => {
  const { word, coordinates, puzzleIndex = 0, isPremium = false, words: puzzleWords, grid } = req.body;

  if (!word || !coordinates) {
    return res.status(400).json({ error: "Word and coordinates required" });
  }

  const wordUpper = word.toUpperCase();

  // For premium users, validate against the provided words and grid
  if (isPremium && puzzleWords && grid) {
    const isValid = puzzleWords.includes(wordUpper);
    
    // For premium, we trust the client's grid since it's random
    // Just verify the word is in the puzzle word list
    res.json({
      valid: isValid,
      word: wordUpper,
    });
  } else {
    // For free users, regenerate the grid to validate
    const difficultyLevel = Math.floor(puzzleIndex / 2);
    const gridSize = getGridSize(difficultyLevel);
    
    const words = getPuzzleWords(puzzleIndex, false);
    const { placements } = generateWordSearchGrid(words, gridSize, puzzleIndex);
    
    const isValid = words.includes(wordUpper);
    
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
  }
});

export default router;
