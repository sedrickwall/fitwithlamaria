import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORD_LISTS: Record<number, string[]> = {
  5: ["WALKS", "WATER", "FIBER", "SLEEP", "BONES", "BRAIN", "POSIT", "DANCE", "VITAL", "YOGA"],
  6: ["SENIOR", "CALCIUM", "MUSCLE", "STEADY", "JOINTS", "ENERGY", "SOCIAL", "STRETCH", "VISION", "PROTEIN"],
  7: ["BALANCE", "POSTURE", "WALKING", "HEALTHY", "VITAMIN", "MINDFUL", "HYDRATE", "CARDIAC", "STAMINA", "PREVENT"],
};

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
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const wordLength = Math.min(5 + difficultyLevel, 7);
  
  const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex];
  
  return res.json({ word });
}
