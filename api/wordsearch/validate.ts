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

function getPuzzleWords(puzzleIndex: number): string[] {
  const index = puzzleIndex % WORD_LISTS.length;
  return WORD_LISTS[index];
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { word, coordinates, puzzleIndex = 0, isPremium = false, words: puzzleWords } = req.body;

  if (!word || !coordinates) {
    return res.status(400).json({ error: "Word and coordinates required" });
  }

  const wordUpper = word.toUpperCase();

  if (isPremium && puzzleWords) {
    const isValid = puzzleWords.includes(wordUpper);
    return res.json({ valid: isValid, word: wordUpper });
  } else {
    const words = getPuzzleWords(puzzleIndex);
    const isValid = words.includes(wordUpper);
    return res.json({ valid: isValid, word: wordUpper });
  }
}
