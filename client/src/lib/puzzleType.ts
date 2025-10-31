// Determine which puzzle type to show based on the day
export type PuzzleType = "wordle" | "wordsearch";

export function getTodaysPuzzleType(): PuzzleType {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  
  // Alternate: even days = wordle, odd days = word search
  return daysSinceEpoch % 2 === 0 ? "wordle" : "wordsearch";
}

export function getPuzzleTypeName(type: PuzzleType): string {
  return type === "wordle" ? "Word Puzzle" : "Word Search";
}
