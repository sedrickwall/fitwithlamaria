import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORD_HINTS: Record<number, Array<{ word: string; category: string; hint: string }>> = {
  5: [
    { word: "WALKS", category: "Exercise", hint: "Walking 30 minutes daily" },
    { word: "WATER", category: "Hydration", hint: "Seniors need 6-8 glasses daily" },
    { word: "FIBER", category: "Nutrition", hint: "Fiber helps digestion" },
    { word: "SLEEP", category: "Rest", hint: "7-9 hours of sleep" },
    { word: "BONES", category: "Health", hint: "Weight-bearing exercises" },
    { word: "BRAIN", category: "Mental Health", hint: "Puzzles keep your mind sharp" },
    { word: "POSIT", category: "Mindset", hint: "Positive thinking" },
    { word: "DANCE", category: "Activity", hint: "Cardio, balance, and fun" },
    { word: "VITAL", category: "Health", hint: "Vitamin D from sunlight" },
    { word: "YOGA", category: "Exercise", hint: "Chair yoga improves flexibility" },
  ],
  6: [
    { word: "SENIOR", category: "Aging", hint: "Never too old to exercise" },
    { word: "CALCIUM", category: "Nutrition", hint: "1,200mg calcium daily" },
    { word: "MUSCLE", category: "Strength", hint: "Build muscle at any age" },
    { word: "STEADY", category: "Balance", hint: "Balance exercises" },
    { word: "JOINTS", category: "Mobility", hint: "Movement lubricates joints" },
    { word: "ENERGY", category: "Vitality", hint: "Exercise boosts energy" },
    { word: "SOCIAL", category: "Wellness", hint: "Social connections" },
    { word: "STRETCH", category: "Flexibility", hint: "Daily stretching" },
    { word: "VISION", category: "Health", hint: "Regular eye exams" },
    { word: "PROTEIN", category: "Nutrition", hint: "More protein for muscle" },
  ],
  7: [
    { word: "BALANCE", category: "Safety", hint: "Balance training" },
    { word: "POSTURE", category: "Alignment", hint: "Good posture" },
    { word: "WALKING", category: "Exercise", hint: "#1 recommended exercise" },
    { word: "HEALTHY", category: "Lifestyle", hint: "Small daily choices" },
    { word: "VITAMIN", category: "Nutrition", hint: "B12 absorption" },
    { word: "MINDFUL", category: "Mental Health", hint: "Mindfulness" },
    { word: "HYDRATE", category: "Wellness", hint: "Stay hydrated" },
    { word: "CARDIAC", category: "Heart Health", hint: "Heart exercise" },
    { word: "STAMINA", category: "Endurance", hint: "Build stamina" },
    { word: "PREVENT", category: "Proactive", hint: "Prevention" },
  ],
};

const WORD_LISTS: Record<number, string[]> = {
  5: WORD_HINTS[5].map(h => h.word),
  6: WORD_HINTS[6].map(h => h.word),
  7: WORD_HINTS[7].map(h => h.word),
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

  res.json({ word });
}
