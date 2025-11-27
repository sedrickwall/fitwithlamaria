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
  const isPremium = req.query.premium === 'true';
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const wordLength = Math.min(5 + difficultyLevel, 7);
  const maxAttempts = 6 + Math.floor(difficultyLevel / 2);
  
  return res.json({
    puzzleNumber: puzzleIndex,
    puzzleIndex,
    wordLength,
    maxAttempts,
    difficultyLevel,
    isPremium,
  });
}
