import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const puzzleTypes = ["wordle", "wordsearch", "crossword"];
  const puzzleType = puzzleTypes[puzzleIndex % 3];
  const difficultyLevel = Math.floor(puzzleIndex / 3);

  res.json({
    puzzleType,
    puzzleIndex,
    difficultyLevel,
    date: new Date().toISOString().split('T')[0],
  });
}
