import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (method === 'GET') {
    const puzzleIndex = parseInt(req.query.index as string) || 0;
    
    const puzzleTypes = ["wordle", "wordsearch", "crossword"];
    const puzzleType = puzzleTypes[puzzleIndex % 3];
    
    const difficultyLevel = Math.floor(puzzleIndex / 3);
    
    return res.json({
      puzzleType,
      puzzleIndex,
      difficultyLevel,
      date: new Date().toISOString().split('T')[0],
    });
  }

  return res.status(404).json({ error: 'Not found' });
}
