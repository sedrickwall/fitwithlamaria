import { CheckCircle2, Lock, Puzzle, Dumbbell } from "lucide-react";
import { Link } from "wouter";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { StatusCard } from "@/components/StatusCard";
import { StreakDisplay } from "@/components/StreakDisplay";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDailyStatus } from "@/hooks/useDailyStatus";

export default function Dashboard() {
  const { profile, loading: profileLoading } = useUserProfile();
  const { status, loading: statusLoading } = useDailyStatus();

  if (profileLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-body-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const workoutCompleted = status?.workoutCompleted || false;
  const puzzleUnlocked = status?.puzzleUnlocked || false;
  const puzzleSolved = status?.puzzleSolved || false;
  const currentStreak = profile?.currentStreak || 0;
  const totalPoints = profile?.totalPoints || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar points={totalPoints} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-h1 font-bold text-foreground mb-2">
            Good morning{profile?.name && profile.name !== "You" ? `, ${profile.name}` : ""}!
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Your daily practice nourishes body and mind
          </p>
        </div>

        <div className="mb-8">
          <StreakDisplay streak={currentStreak} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatusCard
            icon={workoutCompleted ? CheckCircle2 : Dumbbell}
            title={workoutCompleted ? "Workout Complete" : "Today's Movement"}
            description={
              workoutCompleted 
                ? "Wonderful work! You're building strength every day." 
                : "Choose a gentle workout to start your day"
            }
            status={workoutCompleted ? "complete" : "pending"}
            testId="status-workout"
          />

          <StatusCard
            icon={puzzleSolved ? CheckCircle2 : (puzzleUnlocked ? Puzzle : Lock)}
            title={
              puzzleSolved 
                ? "Brain Game Complete" 
                : (puzzleUnlocked ? "Brain Game Ready!" : "Today's Brain Game")
            }
            description={
              puzzleSolved 
                ? "Excellent focus! You're keeping your mind sharp." 
                : (puzzleUnlocked 
                  ? "You've earned today's puzzle. Ready to play?" 
                  : "Complete your workout to unlock")
            }
            status={puzzleSolved ? "complete" : (puzzleUnlocked ? "unlocked" : "locked")}
            testId="status-puzzle"
          />
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {!workoutCompleted ? (
            <Link href="/workouts">
              <Button 
                size="lg"
                className="w-full h-16 text-body-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                data-testid="button-start-workout"
              >
                <Dumbbell className="w-6 h-6 mr-2" />
                Begin Movement
              </Button>
            </Link>
          ) : !puzzleSolved && puzzleUnlocked ? (
            <Link href="/puzzle">
              <Button 
                size="lg"
                className="w-full h-16 text-body-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-secondary hover:bg-secondary/90"
                data-testid="button-play-puzzle"
              >
                <Puzzle className="w-6 h-6 mr-2" />
                Play Brain Game
              </Button>
            </Link>
          ) : puzzleSolved ? (
            <Link href="/progress">
              <Button 
                size="lg"
                variant="outline"
                className="w-full h-16 text-body-lg font-semibold"
                data-testid="button-view-progress"
              >
                See Your Progress
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg"
              disabled
              className="w-full h-16 text-body-lg font-semibold"
              data-testid="button-puzzle-locked"
            >
              <Lock className="w-6 h-6 mr-2" />
              Brain Game Locked
            </Button>
          )}
        </div>

        <div className="mt-12 p-6 bg-accent rounded-lg border border-accent-foreground/10">
          <h3 className="text-h3 font-semibold text-accent-foreground mb-3">
            How it works
          </h3>
          <ol className="space-y-3 text-body-md text-accent-foreground/80">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </span>
              <span>Choose and complete a workout from our library</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </span>
              <span>Unlock today's brain-healthy word puzzle</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </span>
              <span>Solve the puzzle to earn points and build your streak</span>
            </li>
          </ol>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
