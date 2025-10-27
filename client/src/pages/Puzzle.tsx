import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, Share2, CheckCircle } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PuzzleGrid } from "@/components/PuzzleGrid";
import { PuzzleKeyboard } from "@/components/PuzzleKeyboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDailyStatus } from "@/hooks/useDailyStatus";
import { getDailyWord, getPuzzleNumber } from "@/lib/wordList";
import { calculatePuzzlePoints } from "@/lib/points";
import { savePuzzleAttempt, getPuzzleAttempts } from "@/lib/localStorage";
import { PuzzleAttempt } from "@shared/schema";

export default function Puzzle() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { profile, addPoints } = useUserProfile();
  const { status, solvePuzzle } = useDailyStatus();
  
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [evaluation, setEvaluation] = useState<Array<Array<"correct" | "present" | "absent" | "empty">>>([]);
  const [letterStatus, setLetterStatus] = useState<Record<string, "correct" | "present" | "absent" | "unused">>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const dailyWord = getDailyWord();
  const puzzleNumber = getPuzzleNumber();
  const currentRow = guesses.length;
  const totalPoints = profile?.totalPoints || 0;
  const workoutCompleted = status?.workoutCompleted || false;
  const puzzleSolved = status?.puzzleSolved || false;

  useEffect(() => {
    if (puzzleSolved) {
      const today = new Date().toISOString().split('T')[0];
      const todayAttempts = getPuzzleAttempts().filter(a => a.date === today);
      if (todayAttempts.length > 0) {
        const attempt = todayAttempts[0];
        setGuesses(attempt.guesses);
        setWon(attempt.solved);
        setGameOver(true);
        
        const evals = attempt.guesses.map(guess => evaluateGuess(guess));
        setEvaluation(evals);
      }
    }
  }, [puzzleSolved]);

  const evaluateGuess = (guess: string): Array<"correct" | "present" | "absent"> => {
    const result: Array<"correct" | "present" | "absent"> = Array(5).fill("absent");
    const wordArray = dailyWord.split("");
    const guessArray = guess.split("");

    guessArray.forEach((letter, i) => {
      if (letter === wordArray[i]) {
        result[i] = "correct";
      } else if (wordArray.includes(letter)) {
        result[i] = "present";
      }
    });

    return result;
  };

  const updateLetterStatus = (guess: string, result: Array<"correct" | "present" | "absent">) => {
    const newStatus = { ...letterStatus };
    guess.split("").forEach((letter, i) => {
      const status = result[i];
      if (!newStatus[letter] || status === "correct" || (status === "present" && newStatus[letter] !== "correct")) {
        newStatus[letter] = status;
      }
    });
    setLetterStatus(newStatus);
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || currentGuess.length >= 5) return;
    setCurrentGuess(currentGuess + key);
  };

  const handleDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleEnter = () => {
    if (currentGuess.length !== 5) {
      toast({
        title: "Not enough letters",
        description: "Please enter a 5-letter word",
        variant: "destructive",
      });
      return;
    }

    const result = evaluateGuess(currentGuess);
    const newGuesses = [...guesses, currentGuess];
    const newEvaluation = [...evaluation, result];
    
    setGuesses(newGuesses);
    setEvaluation(newEvaluation);
    updateLetterStatus(currentGuess, result);
    setCurrentGuess("");

    if (currentGuess === dailyWord) {
      let totalPoints = calculatePuzzlePoints(newGuesses.length, true);
      
      if (profile && workoutCompleted) {
        const streakBonus = 10;
        totalPoints += streakBonus;
      }
      
      if (profile) {
        const attempt: PuzzleAttempt = {
          id: `puzzle_${Date.now()}`,
          userId: profile.id,
          date: new Date().toISOString().split('T')[0],
          word: dailyWord,
          guesses: newGuesses,
          solved: true,
          attempts: newGuesses.length,
          pointsEarned: totalPoints,
          completedAt: new Date().toISOString(),
        };
        
        savePuzzleAttempt(attempt);
        solvePuzzle(totalPoints);
        addPoints(totalPoints);
      }

      setWon(true);
      setGameOver(true);
      setShowSuccess(true);
    } else if (newGuesses.length >= 6) {
      if (profile) {
        const attempt: PuzzleAttempt = {
          id: `puzzle_${Date.now()}`,
          userId: profile.id,
          date: new Date().toISOString().split('T')[0],
          word: dailyWord,
          guesses: newGuesses,
          solved: false,
          attempts: newGuesses.length,
          pointsEarned: 0,
          completedAt: new Date().toISOString(),
        };
        
        savePuzzleAttempt(attempt);
      }

      setGameOver(true);
      toast({
        title: "Game Over",
        description: `The word was ${dailyWord}`,
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const attempts = won ? guesses.length : "X";
    const emojiGrid = evaluation.map(row => 
      row.map(status => {
        if (status === "correct") return "🟩";
        if (status === "present") return "🟨";
        return "⬜";
      }).join("")
    ).join("\n");

    const shareText = `FitWord #${puzzleNumber}\n${attempts}/6\n\n${emojiGrid}`;

    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your results with friends",
      });
    }
  };

  let pointsEarned = won ? calculatePuzzlePoints(guesses.length, true) : 0;
  if (won && workoutCompleted) {
    pointsEarned += 10;
  }

  if (!workoutCompleted) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar points={totalPoints} />
        
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Lock className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-h1 font-bold text-foreground mb-4">
              Puzzle Locked
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Complete a workout to unlock today's brain game
            </p>
            <Button
              onClick={() => navigate("/workouts")}
              size="lg"
              className="h-16 text-body-lg font-semibold"
              data-testid="button-go-to-workouts"
            >
              Go to Workouts
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar points={totalPoints} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-h1 font-bold text-foreground mb-2">
            FitWord #{puzzleNumber}
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Guess the 5-letter word in 6 tries
          </p>
          <p className="text-body-md text-muted-foreground mt-2">
            Tries: {guesses.length}/6
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <PuzzleGrid
            guesses={guesses}
            currentGuess={currentGuess}
            currentRow={currentRow}
            evaluation={evaluation}
          />
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <PuzzleKeyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onEnter={handleEnter}
            letterStatus={letterStatus}
            disabled={gameOver}
          />
        </div>

        {gameOver && (
          <div className="max-w-md mx-auto mt-8">
            <Button
              onClick={handleShare}
              size="lg"
              variant="outline"
              className="w-full h-16 text-body-lg font-semibold"
              data-testid="button-share"
            >
              <Share2 className="w-6 h-6 mr-2" />
              Share Results
            </Button>
          </div>
        )}

        <div className="mt-12 p-6 bg-accent/50 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-h3 font-semibold text-foreground mb-3">
            How to play
          </h3>
          <ul className="space-y-2 text-body-md text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">🟩</span>
              <span>Green = Letter is correct and in the right position</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">🟨</span>
              <span>Yellow = Letter is in the word but wrong position</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">⬜</span>
              <span>Gray = Letter is not in the word</span>
            </li>
          </ul>
        </div>
      </main>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-32 h-32 text-success" />
            </div>
            <DialogTitle className="text-h2 text-center">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-body-lg text-center">
              You solved today's puzzle in {guesses.length} {guesses.length === 1 ? "try" : "tries"}!
            </DialogDescription>
          </DialogHeader>
          <div className="bg-success/10 rounded-lg p-6 text-center">
            <p className="text-body-md text-muted-foreground mb-2">Points Earned</p>
            <p className="text-stat font-bold text-success">+{pointsEarned}</p>
            {guesses.length <= 4 && (
              <p className="text-body-md text-success mt-2">Bonus for solving in 4 or fewer tries!</p>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 h-14 text-body-md"
              data-testid="button-share-success"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="flex-1 h-14 text-body-md"
              data-testid="button-done"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
