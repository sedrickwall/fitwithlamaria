import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORD_LISTS = [
  ["HAPPY", "JOY", "SMILE", "PEACE", "CALM"],
  ["STRONG", "BRAVE", "POWER", "FOCUS", "SHARP"],
  ["HEALTH", "VITAL", "ENERGY", "ALIVE", "FIT"],
  ["TRUST", "FAITH", "HOPE", "LOVE", "GRACE"],
  ["BRIGHT", "SHINE", "LIGHT", "SPARK", "GLOW"],
  ["MUSIC", "DANCE", "LAUGH", "CHEER", "PLAY"],
  ["QUIET", "STILL", "REST", "RELAX", "EASE"],
];

function getPuzzleWords(puzzleIndex: number, isPremium: boolean = false): string[] {
  if (isPremium) {
    const randomIndex = Math.floor(Math.random() * WORD_LISTS.length);
    return WORD_LISTS[randomIndex];
  } else {
    const index = puzzleIndex % WORD_LISTS.length;
    return WORD_LISTS[index];
  }
}

function getGridSize(difficultyLevel: number): number {
  return Math.min(10 + (difficultyLevel * 2), 16);
}

function seededRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function generateWordSearchGrid(words: string[], size: number = 10, seed: number): { grid: string[][], placements: Record<string, number[][]> } {
  const random = seededRandom(seed);
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(""));
  const placements: Record<string, number[][]> = {};

  const directions = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  const path = req.url?.split('?')[0] || '';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method === 'GET' && (path === '/api/wordsearch' || path === '/api/wordsearch/')) {
    const puzzleIndex = parseInt(req.query.index as string) || 0;
    const isPremium = req.query.premium === 'true';
    const difficultyLevel = Math.floor(puzzleIndex / 2);
    const gridSize = getGridSize(difficultyLevel);
    
    const words = getPuzzleWords(puzzleIndex, isPremium);
    const seed = isPremium ? Date.now() : puzzleIndex;
    const { grid } = generateWordSearchGrid(words, gridSize, seed);

    return res.json({
      grid,
      words,
      size: grid.length,
      puzzleIndex,
      puzzleNumber: puzzleIndex,
      difficultyLevel,
      isPremium,
    });
  }

  if (method === 'POST' && path === '/api/wordsearch/validate') {
    const { word, coordinates, puzzleIndex = 0, isPremium = false, words: puzzleWords, grid } = req.body;

    if (!word || !coordinates) {
      return res.status(400).json({ error: "Word and coordinates required" });
    }

    const wordUpper = word.toUpperCase();

    if (isPremium && puzzleWords && grid) {
      const isValid = puzzleWords.includes(wordUpper);
      return res.json({ valid: isValid, word: wordUpper });
    } else {
      const difficultyLevel = Math.floor(puzzleIndex / 2);
      const gridSize = getGridSize(difficultyLevel);
      
      const words = getPuzzleWords(puzzleIndex, false);
      const { placements } = generateWordSearchGrid(words, gridSize, puzzleIndex);
      
      const isValid = words.includes(wordUpper);
      
      let coordinatesValid = false;
      if (isValid && placements[wordUpper]) {
        const expectedCoords = placements[wordUpper];
        coordinatesValid = JSON.stringify(coordinates) === JSON.stringify(expectedCoords) ||
                           JSON.stringify(coordinates) === JSON.stringify(expectedCoords.reverse());
      }

      return res.json({ valid: isValid && coordinatesValid, word: wordUpper });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
