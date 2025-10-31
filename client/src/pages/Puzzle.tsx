import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, Share2, CheckCircle } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PuzzleGrid } from "@/components/PuzzleGrid";
import { PuzzleKeyboard } from "@/components/PuzzleKeyboard";
import { LoginModal } from "@/components/LoginModal";
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
import { useAuth } from "@/contexts/AuthContext";
import { calculatePuzzlePoints } from "@/lib/points";
import { savePuzzleAttempt, getPuzzleAttempts } from "@/lib/localStorage";
import { puzzleOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";
import { PuzzleAttempt } from "@shared/schema";

export default function Puzzle() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { profile, addPoints } = useUserProfile();
  const { status, solvePuzzle } = useDailyStatus();
  const { user, isAuthenticated } = useAuth();
  
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [evaluation, setEvaluation] = useState<Array<Array<"correct" | "present" | "absent" | "empty">>>([]);
  const [letterStatus, setLetterStatus] = useState<Record<string, "correct" | "present" | "absent" | "unused">>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [puzzleNumber, setPuzzleNumber] = useState<number>(0);
  const [dailyWord, setDailyWord] = useState<string>("");

  const currentRow = guesses.length;
  const totalPoints = profile?.totalPoints || 0;
  const workoutCompleted = status?.workoutCompleted || false;
  const puzzleSolved = status?.puzzleSolved || false;

  useEffect(() => {
    fetch("/api/puzzle")
      .then(res => res.json())
      .then(data => {
        setPuzzleNumber(data.puzzleNumber);
      })
      .catch(error => {
        console.error("Failed to load puzzle:", error);
        toast({
          title: "Error",
          description: "Failed to load today's puzzle",
          variant: "destructive",
        });
      });
  }, [toast]);

  useEffect(() => {
    if (puzzleSolved) {
      const today = new Date().toISOString().split('T')[0];
      const todayAttempts = getPuzzleAttempts().filter(a => a.date === today);
      if (todayAttempts.length > 0) {
        const attempt = todayAttempts[0];
        setGuesses(attempt.guesses);
        setWon(attempt.solved);
        setGameOver(true);
        setDailyWord(attempt.word);
        
        Promise.all(
          attempt.guesses.map(guess => 
            fetch("/api/puzzle/guess", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ guess }),
            }).then(res => res.json())
          )
        ).then(results => {
          const evals = results.map(r => r.result);
          setEvaluation(evals);
          
          results.forEach((r, i) => {
            if (r.result) {
              updateLetterStatus(attempt.guesses[i], r.result);
            }
          });
        }).catch(error => {
          console.error("Failed to load previous attempts:", error);
        });
      }
    }
  }, [puzzleSolved]);

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

  const handleEnter = async () => {
    if (currentGuess.length !== 5) {
      toast({
        title: "Not enough letters",
        description: "Please enter a 5-letter word",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/puzzle/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: currentGuess }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to validate guess",
          variant: "destructive",
        });
        return;
      }

      const { result, isCorrect, word } = data;
      const newGuesses = [...guesses, currentGuess];
      const newEvaluation = [...evaluation, result];
      
      setGuesses(newGuesses);
      setEvaluation(newEvaluation);
      updateLetterStatus(currentGuess, result);
      setCurrentGuess("");

      if (isCorrect) {
        setDailyWord(word);
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
            word: word,
            guesses: newGuesses,
            solved: true,
            attempts: newGuesses.length,
            pointsEarned: totalPoints,
            completedAt: new Date().toISOString(),
          };
          
          savePuzzleAttempt(attempt);
          solvePuzzle(totalPoints);
          addPoints(totalPoints);

          if (isFirebaseReady() && isAuthenticated && user) {
            try {
              await puzzleOperations.addAttempt({
                userId: user.uid,
                puzzleId: `puzzle_${puzzleNumber}`,
                date: new Date().toISOString().split('T')[0],
                word: word,
                guesses: newGuesses,
                solved: true,
                attempts: newGuesses.length,
                pointsEarned: totalPoints,
              });
            } catch (error) {
              console.error("Error syncing puzzle attempt to Firestore:", error);
            }
          }
        }

        setWon(true);
        setGameOver(true);
        setShowSuccess(true);
        
        if (!isAuthenticated) {
          const skipCount = parseInt(localStorage.getItem("fitword_login_skip_count") || "0");
          if (skipCount < 2) {
            setTimeout(() => setShowLoginModal(true), 2000);
          }
        }
      } else if (newGuesses.length >= 6) {
        if (profile) {
          const attempt: PuzzleAttempt = {
            id: `puzzle_${Date.now()}`,
            userId: profile.id,
            date: new Date().toISOString().split('T')[0],
            word: "",
            guesses: newGuesses,
            solved: false,
            attempts: newGuesses.length,
            pointsEarned: 0,
            completedAt: new Date().toISOString(),
          };
          
          savePuzzleAttempt(attempt);

          if (isFirebaseReady() && isAuthenticated && user) {
            try {
              await puzzleOperations.addAttempt({
                userId: user.uid,
                puzzleId: `puzzle_${puzzleNumber}`,
                date: new Date().toISOString().split('T')[0],
                word: "",
                guesses: newGuesses,
                solved: false,
                attempts: newGuesses.length,
                pointsEarned: 0,
              });
            } catch (error) {
              console.error("Error syncing failed puzzle attempt to Firestore:", error);
            }
          }
        }

        setGameOver(true);
        toast({
          title: "Game Over",
          description: "Better luck tomorrow! The word remains a mystery.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit guess:", error);
      toast({
        title: "Error",
        description: "Failed to submit guess. Please try again.",
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

    const shareText = `Fit with LaMaria - Brain Game #${puzzleNumber}\n${attempts}/6\n\n${emojiGrid}`;

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
              Brain Game Locked
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              Move your body first to unlock today's brain game. Your wellness routine starts with movement.
            </p>
            <Button
              onClick={() => navigate("/workouts")}
              size="lg"
              className="h-16 text-body-lg font-semibold"
              data-testid="button-go-to-workouts"
            >
              Begin Movement
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
          <h2 className="text-h1 font-bold text-secondary mb-2">
            Brain Game #{puzzleNumber}
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

        <div className="mt-12 p-6 bg-card rounded-lg max-w-2xl mx-auto border-2 border-secondary">
          <h3 className="text-h3 font-semibold text-foreground mb-3">
            How to Play
          </h3>
          <ul className="space-y-2 text-body-md text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">🟩</span>
              <span>Green: Letter is correct and in the right spot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-1">🟨</span>
              <span>Yellow: Letter is in the word, wrong spot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1">⬜</span>
              <span>Gray: Letter is not in the word</span>
            </li>
          </ul>
        </div>
      </main>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-32 h-32 text-secondary" />
            </div>
            <DialogTitle className="text-h2 text-center">
              Excellent Focus!
            </DialogTitle>
            <DialogDescription className="text-body-lg text-center">
              You solved today's brain game in {guesses.length} {guesses.length === 1 ? "try" : "tries"}. You're keeping your mind sharp.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-card rounded-lg p-6 text-center border-2 border-secondary">
            <p className="text-body-md text-muted-foreground mb-2">Points Earned</p>
            <p className="text-stat font-bold text-secondary">+{pointsEarned}</p>
            {guesses.length <= 4 && (
              <p className="text-body-md text-secondary mt-2">Impressive! Bonus for 4 tries or fewer</p>
            )}
            {workoutCompleted && (
              <p className="text-body-sm text-warning mt-2">+10 streak bonus for completing both today!</p>
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

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        trigger="puzzle"
      />

      <BottomNav />
    </div>
  );
}
