import { useState, useEffect } from "react";
import Puzzle from "@/pages/Puzzle";
import WordSearch from "@/pages/WordSearch";
import Crossword from "@/pages/Crossword";
import { useDailyStatus } from "@/hooks/useDailyStatus";

export default function PuzzleRouter() {
  const { status, getCurrentPuzzleIndex, isPuzzleUnlocked } = useDailyStatus();
  const [puzzleType, setPuzzleType] = useState<"wordle" | "wordsearch" | "crossword" | null>(null);
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(0);

  useEffect(() => {
    if (!status) return;
    
    // Get the current puzzle index from daily status
    const currentPuzzleIndex = getCurrentPuzzleIndex();
    setPuzzleIndex(currentPuzzleIndex);
    
    // Fetch puzzle type from server based on puzzle index
    fetch(`/api/puzzletype?index=${currentPuzzleIndex}`)
      .then(res => res.json())
      .then(data => {
        setPuzzleType(data.puzzleType);
        setDifficultyLevel(data.difficultyLevel);
        console.log(`Puzzle ${currentPuzzleIndex} type: ${data.puzzleType}, difficulty: ${data.difficultyLevel}`);
      })
      .catch(error => {
        console.error("Failed to load puzzle type:", error);
        // Fallback to client-side detection based on puzzle index
        const types: ("wordle" | "wordsearch" | "crossword")[] = ["wordle", "wordsearch", "crossword"];
        setPuzzleType(types[currentPuzzleIndex % 3]);
        setDifficultyLevel(Math.floor(currentPuzzleIndex / 3));
      });
  }, [status, getCurrentPuzzleIndex]);

  if (puzzleType === null || !status) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-lg text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  // Check if puzzle is unlocked
  if (!isPuzzleUnlocked()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-heading-2 mb-4">Complete a Workout First!</h2>
          <p className="text-body-lg text-muted-foreground">
            Puzzles unlock after completing a workout. Head to the workouts page to get started!
          </p>
        </div>
      </div>
    );
  }

  if (puzzleType === "wordsearch") {
    return <WordSearch puzzleIndex={puzzleIndex} difficultyLevel={difficultyLevel} />;
  }

  if (puzzleType === "crossword") {
    return <Crossword />;
  }

  return <Puzzle puzzleIndex={puzzleIndex} difficultyLevel={difficultyLevel} />;
}
