import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORD_HINTS: Record<number, Array<{ word: string; category: string; hint: string }>> = {
  5: [
    { word: "WALKS", category: "Exercise", hint: "Walking 30 minutes daily is one of the best exercises for seniors" },
    { word: "WATER", category: "Hydration", hint: "Seniors need 6-8 glasses daily" },
    { word: "FIBER", category: "Nutrition", hint: "Fiber helps digestion and heart health" },
    { word: "SLEEP", category: "Rest", hint: "Older adults need 7-9 hours of sleep" },
    { word: "BONES", category: "Health", hint: "Weight-bearing exercises strengthen bones" },
    { word: "BRAIN", category: "Mental Health", hint: "Puzzles and learning keep your mind sharp" },
    { word: "POSIT", category: "Mindset", hint: "Positive thinking boosts your immune system" },
    { word: "DANCE", category: "Activity", hint: "Dancing combines cardio, balance, and fun" },
    { word: "VITAL", category: "Health", hint: "Vitamin D from sunlight helps bones and mood" },
    { word: "YOGA", category: "Exercise", hint: "Chair yoga improves flexibility and balance" },
  ],
  6: [
    { word: "SENIOR", category: "Aging", hint: "You're never too old to start exercising" },
    { word: "CALCIUM", category: "Nutrition", hint: "Adults 65+ need 1,200mg calcium daily" },
    { word: "MUSCLE", category: "Strength", hint: "You can build muscle at any age" },
    { word: "STEADY", category: "Balance", hint: "Balance exercises prevent falls" },
    { word: "JOINTS", category: "Mobility", hint: "Movement lubricates joints" },
    { word: "ENERGY", category: "Vitality", hint: "Regular exercise boosts energy levels" },
    { word: "SOCIAL", category: "Wellness", hint: "Social connections are important for longevity" },
    { word: "STRETCH", category: "Flexibility", hint: "Daily stretching maintains flexibility" },
    { word: "VISION", category: "Health", hint: "Regular eye exams catch issues early" },
    { word: "PROTEIN", category: "Nutrition", hint: "Seniors need more protein for muscle mass" },
  ],
  7: [
    { word: "BALANCE", category: "Safety", hint: "Balance training reduces fall risk by 23%" },
    { word: "POSTURE", category: "Alignment", hint: "Good posture prevents pain" },
    { word: "WALKING", category: "Exercise", hint: "Walking is the #1 recommended exercise for seniors" },
    { word: "HEALTHY", category: "Lifestyle", hint: "Small daily choices add up" },
    { word: "VITAMIN", category: "Nutrition", hint: "B12 absorption decreases with age" },
    { word: "MINDFUL", category: "Mental Health", hint: "Mindfulness reduces stress" },
    { word: "HYDRATE", category: "Wellness", hint: "Dehydration causes fatigue and confusion" },
    { word: "CARDIAC", category: "Heart Health", hint: "Heart disease risk decreases with exercise" },
    { word: "STAMINA", category: "Endurance", hint: "Build stamina gradually" },
    { word: "PREVENT", category: "Proactive", hint: "Prevention beats treatment" },
  ],
};

const WORD_LISTS: Record<number, string[]> = {
  5: WORD_HINTS[5].map(h => h.word),
  6: WORD_HINTS[6].map(h => h.word),
  7: WORD_HINTS[7].map(h => h.word),
};

function getPuzzleWord(puzzleIndex: number, difficultyLevel: number, isPremium: boolean = false): string {
  const wordLength = Math.min(5 + difficultyLevel, 7);
  const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
  
  if (isPremium) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  } else {
    const index = puzzleIndex % wordList.length;
    return wordList[index];
  }
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

  const { guess, puzzleIndex = 0, isPremium = false, word } = req.body;

  if (!guess || typeof guess !== "string") {
    return res.status(400).json({ error: "Guess is required" });
  }

  const normalizedGuess = guess.toUpperCase();
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const expectedLength = Math.min(5 + difficultyLevel, 7);

  if (normalizedGuess.length !== expectedLength) {
    return res.status(400).json({ error: `Guess must be ${expectedLength} letters` });
  }

  let puzzleWord: string;
  if (isPremium && word) {
    const wordLength = Math.min(5 + difficultyLevel, 7);
    const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
    if (wordList.includes(word.toUpperCase())) {
      puzzleWord = word.toUpperCase();
    } else {
      return res.status(400).json({ error: "Invalid puzzle word" });
    }
  } else {
    puzzleWord = getPuzzleWord(puzzleIndex, difficultyLevel, false);
  }

  const result: Array<"correct" | "present" | "absent"> = Array(expectedLength).fill("absent");
  const wordArray = puzzleWord.split("");
  const guessArray = normalizedGuess.split("");

  guessArray.forEach((letter, i) => {
    if (letter === wordArray[i]) {
      result[i] = "correct";
    } else if (wordArray.includes(letter)) {
      result[i] = "present";
    }
  });

  const isCorrect = normalizedGuess === puzzleWord;

  res.json({
    result,
    isCorrect,
    word: puzzleWord
  });
}
