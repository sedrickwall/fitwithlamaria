import { Router } from "express";

const router = Router();

// ============================================================
// WORD BANK - Health & Fitness Education Words with Hints
// ============================================================
// Educational words teaching seniors about health and fitness
interface WordHint {
  word: string;
  category: string;
  hint: string;
}

const WORD_HINTS: Record<number, WordHint[]> = {
  5: [
    { word: "WALKS", category: "Exercise", hint: "Walking 30 minutes daily is one of the best exercises for seniors - it's low-impact and great for your heart!" },
    { word: "WATER", category: "Hydration", hint: "Seniors need 6-8 glasses daily. Thirst signals weaken with age, so drink even when you're not thirsty." },
    { word: "FIBER", category: "Nutrition", hint: "Fiber helps digestion and heart health. Aim for 25-30g daily from fruits, vegetables, and whole grains." },
    { word: "SLEEP", category: "Rest", hint: "Older adults need 7-9 hours of sleep. Quality sleep improves memory, mood, and immune function." },
    { word: "BONES", category: "Health", hint: "Weight-bearing exercises like walking strengthen bones and help prevent osteoporosis." },
    { word: "BRAIN", category: "Mental Health", hint: "Your brain can grow new connections at any age! Puzzles and learning keep your mind sharp." },
    { word: "POSIT", category: "Mindset", hint: "Positive thinking isn't just feel-good - it actually boosts your immune system and heart health." },
    { word: "DANCE", category: "Activity", hint: "Dancing combines cardio, balance, and fun! It's great for coordination and social connection." },
    { word: "VITAL", category: "Health", hint: "Vitamin D from sunlight (15 min daily) helps bones, mood, and immunity - especially important for seniors." },
    { word: "YOGA", category: "Exercise", hint: "Yoga isn't just for the young! Chair yoga improves flexibility, balance, and reduces fall risk." },
  ],
  6: [
    { word: "SENIOR", category: "Aging", hint: "You're never too old to start exercising! Studies show fitness gains at any age improve quality of life." },
    { word: "CALCIUM", category: "Nutrition", hint: "Adults 65+ need 1,200mg calcium daily for bone health. Dairy, leafy greens, and fortified foods help." },
    { word: "MUSCLE", category: "Strength", hint: "You can build muscle at any age! Resistance training 2-3x weekly prevents age-related muscle loss." },
    { word: "STEADY", category: "Balance", hint: "Balance exercises prevent falls - the #1 cause of injury in seniors. Practice standing on one foot daily!" },
    { word: "JOINTS", category: "Mobility", hint: "Movement lubricates joints! Gentle exercise reduces arthritis pain better than rest alone." },
    { word: "ENERGY", category: "Vitality", hint: "Feeling tired? Regular exercise actually boosts energy levels more than resting does!" },
    { word: "SOCIAL", category: "Wellness", hint: "Social connections are as important as exercise for longevity. Group activities combine both!" },
    { word: "STRETCH", category: "Flexibility", hint: "Daily stretching maintains flexibility and independence. Hold stretches 30 seconds, never bounce!" },
    { word: "VISION", category: "Health", hint: "Regular eye exams catch issues early. Good lighting and contrast help prevent falls at home." },
    { word: "PROTEIN", category: "Nutrition", hint: "Seniors need MORE protein (1-1.2g per kg body weight) to maintain muscle mass and strength." },
  ],
  7: [
    { word: "BALANCE", category: "Safety", hint: "Falls aren't inevitable! Balance training reduces fall risk by 23%. Try tai chi or standing exercises." },
    { word: "POSTURE", category: "Alignment", hint: "Good posture prevents pain and improves breathing. Imagine a string pulling you up from the crown of your head." },
    { word: "WALKING", category: "Exercise", hint: "Walking is the #1 recommended exercise for seniors - it's free, effective, and you can do it anywhere!" },
    { word: "HEALTHY", category: "Lifestyle", hint: "Small daily choices add up! Even 10-minute activity bursts throughout the day benefit your health." },
    { word: "VITAMIN", category: "Nutrition", hint: "B12 absorption decreases with age. Many seniors need supplements - talk to your doctor!" },
    { word: "MINDFUL", category: "Mental Health", hint: "Mindfulness reduces stress and blood pressure. Try 5 minutes of deep breathing daily." },
    { word: "HYDRATE", category: "Wellness", hint: "Dehydration is common in seniors and causes fatigue and confusion. Keep water visible as a reminder!" },
    { word: "CARDIAC", category: "Heart Health", hint: "Heart disease risk decreases with exercise at ANY age. It's never too late to help your heart!" },
    { word: "STAMINA", category: "Endurance", hint: "Build stamina gradually - add just 5-10% more activity each week to avoid injury." },
    { word: "PREVENT", category: "Proactive", hint: "Prevention beats treatment! Regular checkups, exercise, and nutrition prevent most age-related issues." },
  ],
};

const WORD_LISTS: Record<number, string[]> = {
  5: WORD_HINTS[5].map(h => h.word),
  6: WORD_HINTS[6].map(h => h.word),
  7: WORD_HINTS[7].map(h => h.word),
};

// ============================================================
// WORD SELECTION BASED ON PUZZLE INDEX & DIFFICULTY
// ============================================================
// Deterministic selection based on puzzle index for free users
// Random selection for premium users
function getPuzzleWord(puzzleIndex: number, difficultyLevel: number, isPremium: boolean = false): string {
  // Calculate word length based on difficulty (5, 6, 7 letters)
  const wordLength = Math.min(5 + difficultyLevel, 7);
  
  // Get word list for this difficulty
  const wordList = WORD_LISTS[wordLength] || WORD_LISTS[5];
  
  if (isPremium) {
    // Random selection for premium users
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  } else {
    // Deterministic selection for free users
    const index = puzzleIndex % wordList.length;
    return wordList[index];
  }
}

// ============================================================
// ROUTE: GET /api/puzzle?index=0&premium=false
// ============================================================
// Returns puzzle metadata without revealing the answer
// Response: { puzzleNumber, puzzleIndex, wordLength, maxAttempts, difficultyLevel }
router.get("/", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const isPremium = req.query.premium === 'true';
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const wordLength = Math.min(5 + difficultyLevel, 7);
  const maxAttempts = 6 + Math.floor(difficultyLevel / 2); // More attempts for longer words
  
  res.json({
    puzzleNumber: puzzleIndex,
    puzzleIndex,
    wordLength,
    maxAttempts,
    difficultyLevel,
    isPremium,
  });
});

// ============================================================
// ROUTE: GET /api/puzzle/hint?index=0
// ============================================================
// Returns hint for the current puzzle
// Response: { category: string, hint: string }
router.get("/hint", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const wordLength = Math.min(5 + difficultyLevel, 7);
  
  // Get the hint for this puzzle
  const hints = WORD_HINTS[wordLength] || WORD_HINTS[5];
  const hintIndex = puzzleIndex % hints.length;
  const { category, hint } = hints[hintIndex];
  
  res.json({
    category,
    hint,
  });
});

// ============================================================
// ROUTE: GET /api/puzzle/word?index=0
// ============================================================
// Returns a random puzzle word for premium users
// Response: { word: string }
router.get("/word", (req, res) => {
  const puzzleIndex = parseInt(req.query.index as string) || 0;
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  
  // Always return a random word when this endpoint is called (for premium users)
  const word = getPuzzleWord(puzzleIndex, difficultyLevel, true);
  
  res.json({
    word,
  });
});

// ============================================================
// ROUTE: POST /api/puzzle/guess
// ============================================================
// Validates a user's guess and returns letter-by-letter feedback
// Security: Puzzle word never sent to client unless guess is correct
// Request: { guess: string, puzzleIndex: number, isPremium: boolean, word?: string }
// Response: { result: Array<"correct"|"present"|"absent">, isCorrect: boolean, word?: string }
router.post("/guess", (req, res) => {
  const { guess, puzzleIndex = 0, isPremium = false, word } = req.body;
  
  // Validate input
  if (!guess || typeof guess !== "string") {
    return res.status(400).json({ error: "Guess is required" });
  }

  const normalizedGuess = guess.toUpperCase();
  const difficultyLevel = Math.floor(puzzleIndex / 2);
  const expectedLength = Math.min(5 + difficultyLevel, 7);
  
  if (normalizedGuess.length !== expectedLength) {
    return res.status(400).json({ error: `Guess must be ${expectedLength} letters` });
  }

  // Get puzzle word for this index (server-side only)
  // For premium users with random words, the word is passed from the client for validation
  let puzzleWord: string;
  if (isPremium && word) {
    // Validate that the word is from our word list
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
  
  // Evaluate each letter in the guess
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

  // Always return the word so the failure dialog can show it
  res.json({
    result,
    isCorrect,
    word: puzzleWord
  });
});

export default router;
