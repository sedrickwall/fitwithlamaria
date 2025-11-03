import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, CheckCircle2, Trophy, SkipForward, Dumbbell } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { CrosswordGrid } from "@/components/CrosswordGrid";
import { PremiumBadge } from "@/components/PremiumBadge";
import { Button } from "@/components/ui/button";
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
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export default function Crossword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { profile, addPoints } = useUserProfile();
  const { status, solvePuzzle } = useDailyStatus();
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [puzzleSize, setPuzzleSize] = useState<number>(7);
  const [gameOver, setGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  const totalPoints = profile?.totalPoints || 0;
  const workoutCompleted = status?.workoutCompleted || false;
  const puzzleSolved = status?.puzzleSolved || false;

  // Load crossword data
  useEffect(() => {
    const loadCrossword = async () => {
      try {
        const res = await fetch(`/api/crossword?index=${puzzleIndex}`);
        const data = await res.json();
        setClues(data.clues);
        setPuzzleSize(data.size);
      } catch (error) {
        console.error("Failed to load crossword:", error);
        toast({
          title: "Error",
          description: "Failed to load crossword puzzle",
          variant: "destructive",
        });
      }
    };

    loadCrossword();
  }, [puzzleIndex, toast]);

  const handleAnswerChange = (clueNumber: number, value: string) => {
    setAnswers(prev => ({ ...prev, [clueNumber]: value }));
    setResults(prev => ({ ...prev, [clueNumber]: undefined as any }));
  };

  const handleCheckAnswers = async () => {
    try {
      const res = await fetch("/api/crossword/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          puzzleIndex,
          answers,
        }),
      });

      const data = await res.json();
      setResults(data.results);

      if (data.isComplete) {
        // Puzzle solved!
        setGameOver(true);
        setShowSuccess(true);

        const pointsEarned = 50;
        addPoints(pointsEarned);
        solvePuzzle(puzzleIndex, pointsEarned);

        // Check if just completed workout
        const justCompletedWorkout = localStorage.getItem("justCompletedWorkout") === "true";
        
        toast({
          title: justCompletedWorkout ? "Wonderful Work!" : "Puzzle Complete!",
          description: `You earned ${pointsEarned} points!`,
        });
      } else {
        toast({
          title: "Keep Going!",
          description: `${data.correctCount} of ${data.totalClues} correct. Try the remaining clues!`,
        });
      }
    } catch (error) {
      console.error("Failed to check answers:", error);
      toast({
        title: "Error",
        description: "Failed to check answers",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    setShowSkipConfirm(false);
    solvePuzzle(puzzleIndex, 0);
    setGameOver(true);
    
    toast({
      title: "Puzzle Skipped",
      description: "Come back tomorrow for a new challenge!",
    });

    setTimeout(() => navigate("/"), 1000);
  };

  // Show locked state if workout not completed
  if (!workoutCompleted && !isPremium && !puzzleSolved) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar points={totalPoints} />
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-8">
              <Lock className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-h1 font-bold text-foreground mb-4">
                Crossword Locked
              </h2>
              <p className="text-body-lg text-muted-foreground mb-8">
                Complete a workout to unlock this brain game
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-2xl sm:text-h1 font-bold text-foreground mb-1 sm:mb-2">
              Health Crossword
            </h2>
            <p className="text-sm sm:text-body-lg text-muted-foreground">
              Solve health and fitness clues to complete the puzzle
            </p>
            
            {isPremium && (
              <div className="mt-2 sm:mt-4 flex justify-center">
                <PremiumBadge />
              </div>
            )}
          </div>

          {showSuccess && (
            <div className="mb-6 p-6 bg-success/10 border-2 border-success rounded-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
              <h3 className="text-h2 font-bold text-success mb-2">
                {localStorage.getItem("justCompletedWorkout") === "true" 
                  ? "Wonderful Work!" 
                  : "Crossword Complete!"}
              </h3>
              <p className="text-body-lg text-foreground mb-2">
                {localStorage.getItem("justCompletedWorkout") === "true" 
                  ? "You completed your workout and solved the crossword! You're building strength and keeping your mind sharp."
                  : "You solved all the clues!"}
              </p>
              <div className="flex items-center justify-center gap-2 text-warning font-semibold text-h3">
                <Trophy className="w-6 h-6" />
                +{(() => {
                  const workoutPoints = parseInt(localStorage.getItem("workoutPointsEarned") || "0");
                  const justCompletedWorkout = localStorage.getItem("justCompletedWorkout") === "true";
                  const puzzlePoints = 50;
                  if (justCompletedWorkout) {
                    setTimeout(() => {
                      localStorage.removeItem("justCompletedWorkout");
                      localStorage.removeItem("workoutPointsEarned");
                    }, 100);
                    return workoutPoints + puzzlePoints;
                  }
                  return puzzlePoints;
                })()} points
              </div>
            </div>
          )}

          <CrosswordGrid
            size={puzzleSize}
            clues={clues}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            results={results}
            disabled={gameOver}
          />

          {!gameOver && (
            <div className="mt-6 flex flex-col gap-3 max-w-md mx-auto">
              <Button
                onClick={handleCheckAnswers}
                size="lg"
                className="w-full h-16 text-body-lg font-semibold bg-gradient-to-br from-primary-start to-primary-end hover:opacity-90"
                data-testid="button-check-answers"
              >
                Check My Answers
              </Button>
              <Button
                onClick={() => setShowSkipConfirm(true)}
                size="lg"
                variant="outline"
                className="w-full h-14 text-body-md font-medium border-2"
                data-testid="button-skip-crossword"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip This Puzzle
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="mt-6 text-center">
              {isPremium ? (
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <Button
                    onClick={() => navigate("/workouts")}
                    size="lg"
                    className="h-16 text-body-lg font-semibold bg-gradient-to-br from-primary-start to-primary-end hover:opacity-90"
                    data-testid="button-start-another-workout"
                  >
                    <Dumbbell className="w-6 h-6 mr-2" />
                    Start Another Workout
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    size="lg"
                    className="h-14 text-body-md"
                    data-testid="button-back-dashboard"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate("/")}
                  className="h-16 text-body-lg font-semibold"
                  data-testid="button-back-to-dashboard"
                >
                  Back to Dashboard
                </Button>
              )}
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
              Skipping won't earn you any points, but you'll be able to move on to the next puzzle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-body-md" data-testid="button-cancel-skip-crossword">
              Keep Playing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkip}
              className="h-12 text-body-md bg-muted hover:bg-muted/80"
              data-testid="button-confirm-skip-crossword"
            >
              Skip Puzzle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
