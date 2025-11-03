import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Lock, Share2, CheckCircle, SkipForward, AlertCircle, Crown, Dumbbell, Lightbulb } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PuzzleGrid } from "@/components/PuzzleGrid";
import { PuzzleKeyboard } from "@/components/PuzzleKeyboard";
import { LoginModal } from "@/components/LoginModal";
import { PremiumBadge } from "@/components/PremiumBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDailyStatus } from "@/hooks/useDailyStatus";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePuzzlePoints } from "@/lib/points";
import { savePuzzleAttempt, getPuzzleAttempts } from "@/lib/localStorage";
import { puzzleOperations, userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";
import { PuzzleAttempt } from "@shared/schema";
import { createPuzzlePost } from "@/lib/communityPosts";

interface PuzzleProps {
  puzzleIndex: number;
  difficultyLevel: number;
}

export default function Puzzle({ puzzleIndex, difficultyLevel }: PuzzleProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { profile, addPoints } = useUserProfile();
  const { status, solveWordle, isPuzzleCompleted, getPuzzleIndexForTier, canStartNewPuzzle } = useDailyStatus();
  const { user, isAuthenticated } = useAuth();
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
  
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [evaluation, setEvaluation] = useState<Array<Array<"correct" | "present" | "absent" | "empty">>>([]);
  const [letterStatus, setLetterStatus] = useState<Record<string, "correct" | "present" | "absent" | "unused">>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showFailureDialog, setShowFailureDialog] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [puzzleNumber, setPuzzleNumber] = useState<number>(0);
  const [dailyWord, setDailyWord] = useState<string>("");
  const [wordLength, setWordLength] = useState<number>(5); // Dynamic word length based on difficulty
  const [maxAttempts, setMaxAttempts] = useState<number>(6); // Dynamic max attempts
  const [premiumWord, setPremiumWord] = useState<string>("");
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintCategory, setHintCategory] = useState<string>("");
  const [hintText, setHintText] = useState<string>("");

  const currentRow = guesses.length;
  const totalPoints = profile?.totalPoints || 0;
  const workoutCompleted = status?.workoutCompleted || false;
  
  // Compute actual puzzle index based on user tier
  const actualPuzzleIndex = isPremium ? getPuzzleIndexForTier(isPremium) : puzzleIndex;
  const puzzleSolved = isPuzzleCompleted(actualPuzzleIndex); // Check if THIS specific puzzle is completed

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        // Load puzzle metadata
        const puzzleRes = await fetch(`/api/puzzle?index=${actualPuzzleIndex}`);
        const puzzleData = await puzzleRes.json();
        setPuzzleNumber(puzzleData.puzzleNumber);
        setWordLength(puzzleData.wordLength);
        setMaxAttempts(puzzleData.maxAttempts);

        // For premium users, fetch random word
        if (isPremium) {
          const today = new Date().toISOString().split('T')[0];
          const storageKey = `puzzle-word-${today}-${actualPuzzleIndex}`;
          
          // Check sessionStorage first
          const storedWord = sessionStorage.getItem(storageKey);
          if (storedWord) {
            setPremiumWord(storedWord);
          } else {
            // Fetch new random word
            const wordRes = await fetch(`/api/puzzle/word?index=${actualPuzzleIndex}`);
            const wordData = await wordRes.json();
            if (wordData.word) {
              setPremiumWord(wordData.word);
              sessionStorage.setItem(storageKey, wordData.word);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load puzzle:", error);
        toast({
          title: "Error",
          description: "Failed to load puzzle",
          variant: "destructive",
        });
      }
    };

    loadPuzzle();
  }, [actualPuzzleIndex, isPremium, toast]);

  // Load hint for the puzzle
  useEffect(() => {
    const loadHint = async () => {
      try {
        const res = await fetch(`/api/puzzle/hint?index=${actualPuzzleIndex}`);
        const data = await res.json();
        setHintCategory(data.category);
        setHintText(data.hint);
      } catch (error) {
        console.error("Failed to load hint:", error);
      }
    };

    loadHint();
  }, [actualPuzzleIndex]);

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
              body: JSON.stringify({ 
                guess, 
                puzzleIndex: actualPuzzleIndex,
                isPremium,
                word: isPremium ? premiumWord : undefined
              }),
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
    if (gameOver || currentGuess.length >= wordLength) return;
    setCurrentGuess(currentGuess + key);
  };

  const handleDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleEnter = async () => {
    if (currentGuess.length !== wordLength) {
      toast({
        title: "Not enough letters",
        description: `Please enter a ${wordLength}-letter word`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/puzzle/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          guess: currentGuess, 
          puzzleIndex: actualPuzzleIndex,
          isPremium,
          word: isPremium ? premiumWord : undefined
        }),
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
          solveWordle(actualPuzzleIndex, totalPoints);
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
              
              // Create community post for premium users
              await createPuzzlePost(user.uid, user.displayName || "Member", "wordle", newGuesses.length, true);
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
      } else if (newGuesses.length >= maxAttempts) {
        setDailyWord(word);
        
        if (profile) {
          const attempt: PuzzleAttempt = {
            id: `puzzle_${Date.now()}`,
            userId: profile.id,
            date: new Date().toISOString().split('T')[0],
            word: word,
            guesses: newGuesses,
            solved: false,
            attempts: newGuesses.length,
            pointsEarned: 0,
            completedAt: new Date().toISOString(),
          };
          
          savePuzzleAttempt(attempt);
          solveWordle(actualPuzzleIndex, 0);

          if (isFirebaseReady() && isAuthenticated && user) {
            try {
              await puzzleOperations.addAttempt({
                userId: user.uid,
                puzzleId: `puzzle_${puzzleNumber}`,
                date: new Date().toISOString().split('T')[0],
                word: word,
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

        setWasSkipped(false);
        setGameOver(true);
        setShowFailureDialog(true);
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

  const handleSkip = async () => {
    setShowSkipConfirm(false);
    
    try {
      const response = await fetch(`/api/puzzle?index=${actualPuzzleIndex}`);
      const data = await response.json();
      const word = data.word;
      
      setDailyWord(word);
      
      if (profile) {
        const attempt: PuzzleAttempt = {
          id: `puzzle_${Date.now()}`,
          userId: profile.id,
          date: new Date().toISOString().split('T')[0],
          word: word,
          guesses: guesses,
          solved: false,
          attempts: guesses.length,
          pointsEarned: 0,
          completedAt: new Date().toISOString(),
        };
        
        savePuzzleAttempt(attempt);
        solveWordle(actualPuzzleIndex, 0);

        if (isFirebaseReady() && isAuthenticated && user) {
          try {
            await puzzleOperations.addAttempt({
              userId: user.uid,
              puzzleId: `puzzle_${puzzleNumber}`,
              date: new Date().toISOString().split('T')[0],
              word: word,
              guesses: guesses,
              solved: false,
              attempts: guesses.length,
              pointsEarned: 0,
            });
          } catch (error) {
            console.error("Error syncing skipped puzzle to Firestore:", error);
          }
        }
      }

      setWasSkipped(true);
      setGameOver(true);
      setShowFailureDialog(true);
    } catch (error) {
      console.error("Failed to skip puzzle:", error);
      toast({
        title: "Error",
        description: "Failed to skip puzzle. Please try again.",
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-h1 font-bold text-secondary mb-1 sm:mb-2">
            Brain Game #{puzzleIndex}
          </h2>
          {isPremium && (
            <div className="flex justify-center mb-2 sm:mb-4">
              <PremiumBadge />
            </div>
          )}
          <p className="text-sm sm:text-body-lg text-muted-foreground">
            Guess any {wordLength}-letter word
          </p>
          
          {/* Instructions */}
          <div className="mt-3 sm:mt-4 max-w-md mx-auto bg-secondary/5 border border-secondary/20 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">
              How to Play:
            </p>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 text-left">
              <li>• <strong>Type:</strong> Use the keyboard to enter letters</li>
              <li>• <strong>Green:</strong> Letter is correct and in the right spot</li>
              <li>• <strong>Yellow:</strong> Letter is in the word but wrong spot</li>
              <li>• <strong>Gray:</strong> Letter is not in the word</li>
              <li>• You have {maxAttempts} tries to guess the word</li>
            </ul>
          </div>
          
          <p className="text-xs sm:text-body-md text-muted-foreground mt-3 sm:mt-4">
            Tries: {guesses.length}/{maxAttempts}
          </p>
          
          {!gameOver && (
            <div className="mt-3 sm:mt-4">
              <Button
                onClick={() => setShowHintModal(true)}
                variant="outline"
                size="sm"
                className="h-10 text-sm font-medium border-2"
                data-testid="button-show-hint"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get a Hint
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
          <PuzzleGrid
            guesses={guesses}
            currentGuess={currentGuess}
            currentRow={currentRow}
            evaluation={evaluation}
            wordLength={wordLength}
            maxAttempts={maxAttempts}
          />
        </div>

        <div className="max-w-3xl mx-auto mb-4 sm:mb-6">
          <PuzzleKeyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onEnter={handleEnter}
            letterStatus={letterStatus}
            disabled={gameOver}
          />
        </div>

        {!gameOver && (
          <div className="max-w-md mx-auto mt-6">
            <Button
              onClick={() => setShowSkipConfirm(true)}
              size="lg"
              variant="outline"
              className="w-full h-14 text-body-md font-medium border-2"
              data-testid="button-skip-puzzle"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Skip This Puzzle
            </Button>
          </div>
        )}

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

      <Dialog open={showSuccess} onOpenChange={(open) => {
        setShowSuccess(open);
        if (!open) {
          // Clear the workout completion flag when dialog closes
          localStorage.removeItem("justCompletedWorkout");
          localStorage.removeItem("workoutPointsEarned");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-32 h-32 text-secondary" />
            </div>
            <DialogTitle className="text-h2 text-center">
              {localStorage.getItem("justCompletedWorkout") === "true" 
                ? "Wonderful Work!" 
                : "Excellent Focus!"}
            </DialogTitle>
            <DialogDescription className="text-body-lg text-center">
              {localStorage.getItem("justCompletedWorkout") === "true" 
                ? `You completed your workout and solved the puzzle in ${guesses.length} ${guesses.length === 1 ? "try" : "tries"}! You're building strength and keeping your mind sharp.`
                : `You solved today's brain game in ${guesses.length} ${guesses.length === 1 ? "try" : "tries"}. You're keeping your mind sharp.`}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-card rounded-lg p-6 text-center border-2 border-secondary">
            <p className="text-body-md text-muted-foreground mb-2">Points Earned</p>
            <p className="text-stat font-bold text-secondary">
              +{(() => {
                const workoutPoints = parseInt(localStorage.getItem("workoutPointsEarned") || "0");
                const justCompletedWorkout = localStorage.getItem("justCompletedWorkout") === "true";
                return justCompletedWorkout ? workoutPoints + pointsEarned : pointsEarned;
              })()}
            </p>
            {guesses.length <= 4 && (
              <p className="text-body-md text-secondary mt-2">Impressive! Bonus for 4 tries or fewer</p>
            )}
            {workoutCompleted && (
              <p className="text-body-sm text-warning mt-2">+10 streak bonus for completing both today!</p>
            )}
          </div>
          
          {isPremium ? (
            <>
              <p className="text-body-md text-center text-muted-foreground">
                You're on a roll! Ready for another round?
              </p>
              <div className="flex flex-col gap-3">
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
            </>
          ) : (
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
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSkipConfirm} onOpenChange={setShowSkipConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-h3">Skip This Puzzle?</AlertDialogTitle>
            <AlertDialogDescription className="text-body-md">
              It's okay to take a break! The correct answer will be revealed, and you can try a fresh puzzle tomorrow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-body-md" data-testid="button-cancel-skip">
              Keep Playing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkip}
              className="h-12 text-body-md bg-muted hover:bg-muted/80"
              data-testid="button-confirm-skip"
            >
              Skip Puzzle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-32 h-32 text-muted-foreground" />
            </div>
            <DialogTitle className="text-h2 text-center">
              {wasSkipped ? "That's Okay!" : "Nice Try!"}
            </DialogTitle>
            <DialogDescription className="text-body-lg text-center">
              {wasSkipped 
                ? "Take your time. Every puzzle is a chance to learn and grow. Come back tomorrow for a new challenge!"
                : "You gave it your best effort! Every puzzle helps keep your mind active and sharp."}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-card rounded-lg p-6 text-center border-2 border-muted">
            <p className="text-body-md text-muted-foreground mb-3">The word was</p>
            <p className="text-4xl font-bold text-foreground uppercase tracking-wider">{dailyWord}</p>
          </div>
          <div className="flex gap-4">
            {!wasSkipped && (
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 h-14 text-body-md"
                data-testid="button-share-failure"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            )}
            <Button
              onClick={() => navigate("/")}
              className={`${wasSkipped ? 'w-full' : 'flex-1'} h-14 text-body-md`}
              data-testid="button-done-failure"
            >
              {wasSkipped ? "Back to Dashboard" : "Done"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHintModal} onOpenChange={setShowHintModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Lightbulb className="w-20 h-20 text-warning" />
            </div>
            <DialogTitle className="text-h2 text-center">
              Health Hint
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-secondary/10 rounded-lg p-4 border-2 border-secondary">
              <p className="text-sm font-semibold text-secondary mb-2">CATEGORY</p>
              <p className="text-h3 font-bold text-foreground">{hintCategory}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border-2 border-border">
              <p className="text-sm font-semibold text-muted-foreground mb-2">DID YOU KNOW?</p>
              <p className="text-body-md text-foreground leading-relaxed">{hintText}</p>
            </div>
            <p className="text-xs text-muted-foreground text-center italic">
              This hint relates to today's puzzle word. Use it to help you guess!
            </p>
          </div>
          <Button
            onClick={() => setShowHintModal(false)}
            size="lg"
            className="w-full h-14 text-body-md"
            data-testid="button-close-hint"
          >
            Got It!
          </Button>
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
