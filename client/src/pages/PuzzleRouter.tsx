import { useState, useEffect } from "react";
import Puzzle from "@/pages/Puzzle";
import WordSearch from "@/pages/WordSearch";

export default function PuzzleRouter() {
  const [puzzleType, setPuzzleType] = useState<"wordle" | "wordsearch" | null>(null);

  useEffect(() => {
    fetch("/api/puzzletype")
      .then(res => res.json())
      .then(data => {
        setPuzzleType(data.puzzleType);
        console.log(`Today's puzzle type (server): ${data.puzzleType}`);
      })
      .catch(error => {
        console.error("Failed to load puzzle type:", error);
        // Fallback to client-side detection
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        setPuzzleType(daysSinceEpoch % 2 === 0 ? "wordle" : "wordsearch");
      });
  }, []);

  if (puzzleType === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-lg text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (puzzleType === "wordsearch") {
    return <WordSearch />;
  }

  return <Puzzle />;
}
