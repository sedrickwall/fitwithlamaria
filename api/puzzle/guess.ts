import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORD_LISTS: Record<number, string[]> = {
  5: ["WALKS", "WATER", "FIBER", "SLEEP", "BONES", "BRAIN", "POSIT", "DANCE", "VITAL", "YOGA"],
  6: ["SENIOR", "CALCIUM", "MUSCLE", "STEADY", "JOINTS", "ENERGY", "SOCIAL", "STRETCH", "VISION", "PROTEIN"],
  7: ["BALANCE", "POSTURE", "WALKING", "HEALTHY", "VITAMIN", "MINDFUL", "HYDRATE", "CARDIAC", "STAMINA", "PREVENT"],
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

  return res.json({
    result,
    isCorrect,
    word: puzzleWord
  });
}
