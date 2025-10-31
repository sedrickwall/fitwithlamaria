import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Lock, Trophy, SkipForward } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { WordSearchGrid } from "@/components/WordSearchGrid";
import { LoginModal } from "@/components/LoginModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDailyStatus } from "@/hooks/useDailyStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { savePuzzleAttempt } from "@/lib/localStorage";

interface WordSearchProps {
  puzzleIndex: number;
  difficultyLevel: number;
}

export default function WordSearch({ puzzleIndex, difficultyLevel }: WordSearchProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { profile, addPoints } = useUserProfile();
  const { status, solveWordSearch, isPuzzleCompleted } = useDailyStatus();
  const { user, isAuthenticated } = useAuth();
  
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const totalPoints = profile?.totalPoints || 0;
  const workoutCompleted = status?.workoutCompleted || false;
  const puzzleSolved = isPuzzleCompleted(puzzleIndex); // Check if THIS specific puzzle is completed

  useEffect(() => {
    fetch(`/api/wordsearch?index=${puzzleIndex}`)
      .then(res => res.json())
      .then(data => {
        setGrid(data.grid);
        setWords(data.words);
      })
      .catch(error => {
        console.error("Failed to load word search:", error);
        toast({
          title: "Error",
          description: "Failed to load word search",
          variant: "destructive",
        });
      });
  }, [puzzleIndex, toast]);

  useEffect(() => {
    if (puzzleSolved) {
      setGameOver(true);
      setShowSuccess(false);
      
      const today = new Date().toISOString().split('T')[0];
      const savedAttempts = JSON.parse(localStorage.getItem("puzzleAttempts") || "[]");
      const todayAttempt = savedAttempts.find((a: any) => a.date === today);
      
      if (todayAttempt && todayAttempt.guesses) {
        setFoundWords(todayAttempt.guesses);
      } else {
        // If puzzleSolved but no local data, mark all words as found
        setFoundWords(words);
      }
    }
  }, [puzzleSolved, words]);

  const handleWordFound = async (word: string, coordinates: number[][]) => {
    // Prevent interaction if puzzle already solved
    if (foundWords.includes(word) || puzzleSolved || gameOver) return;

    try {
      const response = await fetch("/api/wordsearch/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, coordinates, puzzleIndex }),
      });

      const data = await response.json();

      if (data.valid) {
        const newFoundWords = [...foundWords, word];
        setFoundWords(newFoundWords);

        toast({
          title: "Word Found!",
          description: `You found "${word}"!`,
        });

        if (newFoundWords.length === words.length) {
          await handlePuzzleComplete(newFoundWords);
        }
      }
    } catch (error) {
      console.error("Error validating word:", error);
    }
  };

  const handlePuzzleComplete = async (allFoundWords: string[]) => {
    // Prevent duplicate completion if already solved
    if (puzzleSolved || gameOver) {
      return;
    }

    setGameOver(true);
    setShowSuccess(true);

    const pointsEarned = 50;
    addPoints(pointsEarned);
    await solveWordSearch(puzzleIndex, pointsEarned);

    const today = new Date().toISOString().split('T')[0];
    savePuzzleAttempt({
      id: `${Date.now()}`,
      userId: profile?.id || "anonymous",
      date: today,
      word: "WORDSEARCH",
      guesses: allFoundWords,
      solved: true,
      attempts: allFoundWords.length,
      pointsEarned,
    });

    setTimeout(() => {
      setShowSuccess(false);
      if (!isAuthenticated) {
        setShowLoginModal(true);
      }
    }, 3000);
  };

  const handleSkip = async () => {
    setShowSkipConfirm(false);
    setGameOver(true);

    const today = new Date().toISOString().split('T')[0];
    savePuzzleAttempt({
      id: `${Date.now()}`,
      userId: profile?.id || "anonymous",
      date: today,
      word: "WORDSEARCH",
      guesses: foundWords,
      solved: false,
      attempts: foundWords.length,
      pointsEarned: 0,
    });

    await solveWordSearch(puzzleIndex, 0);

    toast({
      title: "Puzzle Skipped",
      description: "You can try again with tomorrow's puzzle.",
    });
  };

  if (!workoutCompleted && !puzzleSolved) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar points={totalPoints} />
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <Lock className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-h1 font-bold text-foreground mb-4">
                Word Search Locked
              </h2>
              <p className="text-body-lg text-muted-foreground mb-8">
                Complete today's workout to unlock this brain game
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/workouts")}
              className="h-16 text-body-lg font-semibold"
              data-testid="button-go-to-workouts"
            >
              Start Your Workout
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-h1 font-bold text-foreground mb-2">
              Word Search Puzzle
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Find all the wellness words hidden in the grid
            </p>
            <p className="text-body-md text-muted-foreground mt-2">
              Click and drag to select words
            </p>
          </div>

          {showSuccess && (
            <div className="mb-8 p-6 bg-success/10 border-2 border-success rounded-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
              <h3 className="text-h2 font-bold text-success mb-2">
                Puzzle Complete!
              </h3>
              <p className="text-body-lg text-foreground mb-2">
                You found all the words!
              </p>
              <div className="flex items-center justify-center gap-2 text-warning font-semibold text-h3">
                <Trophy className="w-6 h-6" />
                +50 points
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            {grid.length > 0 && (
              <WordSearchGrid
                grid={grid}
                words={words}
                foundWords={foundWords}
                onWordFound={handleWordFound}
                disabled={gameOver || puzzleSolved}
              />
            )}
          </div>

          {!gameOver && !puzzleSolved && (
            <div className="max-w-md mx-auto mt-6 mb-8">
              <Button
                onClick={() => setShowSkipConfirm(true)}
                size="lg"
                variant="outline"
                className="w-full h-14 text-body-md font-medium border-2"
                data-testid="button-skip-wordsearch"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip This Puzzle
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="h-16 text-body-lg font-semibold"
                data-testid="button-back-to-dashboard"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      
      <AlertDialog open={showSkipConfirm} onOpenChange={setShowSkipConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-h3">Skip This Puzzle?</AlertDialogTitle>
            <AlertDialogDescription className="text-body-md">
              Skipping won't earn you any points, but you'll be able to move on to the next puzzle. You've found {foundWords.length} out of {words.length} words.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-body-md" data-testid="button-cancel-skip-wordsearch">
              Keep Playing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkip}
              className="h-12 text-body-md bg-muted hover:bg-muted/80"
              data-testid="button-confirm-skip-wordsearch"
            >
              Skip Puzzle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        trigger="puzzle"
      />
    </div>
  );
}
