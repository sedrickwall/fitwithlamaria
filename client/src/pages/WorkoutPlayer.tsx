import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Share2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { SocialShareModal } from "@/components/SocialShareModal";
import { Workout, WorkoutCompletion } from "@shared/schema";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDailyStatus } from "@/hooks/useDailyStatus";
import { useAuth } from "@/contexts/AuthContext";
import { saveWorkoutCompletion, getWorkoutCompletions } from "@/lib/localStorage";
import { calculateWorkoutPoints } from "@/lib/points";
import { createWorkoutPost } from "@/lib/communityPosts";

const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: "1",
    title: "Gentle Seated Stretches",
    category: "seated",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/4pKly2JojMw",
  },
  {
    id: "2",
    title: "Chair Yoga Flow",
    category: "seated",
    duration: 15,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/KLGkCOMMbSs",
  },
  {
    id: "3",
    title: "Seated Cardio Workout",
    category: "seated",
    duration: 15,
    difficulty: "medium",
    videoUrl: "https://player.vimeo.com/video/1132983491?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    id: "4",
    title: "Standing Balance & Strength",
    category: "standing",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/GFwk8FTp864",
  },
  {
    id: "5",
    title: "Low Impact Cardio",
    category: "standing",
    duration: 10,
    difficulty: "medium",
    videoUrl: "https://player.vimeo.com/video/1132984878?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    id: "6",
    title: "Full Body Standing Workout",
    category: "standing",
    duration: 20,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/dtGAcoOwkfI",
  },
  {
    id: "7",
    title: "Simple Balance Exercises",
    category: "balance",
    duration: 5,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/1ogJBXcDAbA",
  },
  {
    id: "8",
    title: "Balance & Flexibility",
    category: "balance",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/qs3FQ0z7zUc",
  },
  {
    id: "9",
    title: "Gentle Stretching Routine",
    category: "balance",
    duration: 15,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/gZoMmI_dNmk",
  },
  {
    id: "10",
    title: "Full Body Stretch",
    category: "balance",
    duration: 20,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/L_xrDAtykMI",
  },
];

export default function WorkoutPlayer() {
  const [, params] = useRoute("/workout/:id");
  const [, navigate] = useLocation();
  const [completed, setCompleted] = useState(false);
  const [isRepeatCompletion, setIsRepeatCompletion] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { profile, addPoints } = useUserProfile();
  const { completeWorkout } = useDailyStatus();
  const { isAuthenticated, user } = useAuth();

  const workout = SAMPLE_WORKOUTS.find(w => w.id === params?.id);
  const totalPoints = profile?.totalPoints || 0;

  useEffect(() => {
    if (!workout) {
      navigate("/workouts");
    }
  }, [workout, navigate]);

  if (!workout) {
    return null;
  }

  const handleComplete = async () => {
    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const existingCompletions = getWorkoutCompletions();
    const alreadyCompleted = existingCompletions.some(
      c => c.date === today && c.workoutId === workout.id
    );

    if (alreadyCompleted) {
      setIsRepeatCompletion(true);
      setCompleted(true);
      return;
    }

    const points = calculateWorkoutPoints();
    const completion: WorkoutCompletion = {
      id: `completion_${Date.now()}`,
      userId: profile.id,
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      date: today,
      pointsEarned: points,
    };

    saveWorkoutCompletion(completion);
    completeWorkout();
    addPoints(points);

    // Create community post for premium users
    if (isAuthenticated && user) {
      await createWorkoutPost(user.uid, user.displayName || "Member", workout.title, workout.category);
    }

    setCompleted(true);
  };

  const handleShareModalClose = () => {
    setShowShareModal(false);
  };

  const handleContinueToPuzzle = () => {
    if (!isAuthenticated) {
      const skipCount = parseInt(localStorage.getItem("fitword_login_skip_count") || "0");
      if (skipCount < 2) {
        setShowLoginModal(true);
        return;
      }
    }
    navigate("/puzzle");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar points={totalPoints} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/workouts")}
          className="mb-6 h-14 text-body-md"
          data-testid="button-back"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to Workouts
        </Button>

        <div className="mb-6">
          <h2 className="text-h1 font-bold text-foreground mb-2">
            {workout.title}
          </h2>
          <p className="text-body-lg text-muted-foreground">
            {workout.duration} minutes • {workout.difficulty} difficulty
          </p>
        </div>

        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl mb-8 bg-black">
          <iframe
            src={workout.videoUrl}
            title={workout.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full"
            data-testid="video-player"
          />
        </div>

        {completed ? (
          <div className="bg-card border-2 border-success rounded-lg p-8 text-center animate-fade-in">
            <CheckCircle className="w-24 h-24 text-success mx-auto mb-4" />
            <h3 className="text-h2 font-bold text-success mb-2">
              Wonderful Work!
            </h3>
            <p className="text-body-lg text-foreground mb-4">
              {isRepeatCompletion 
                ? "Workout already logged today—share your win or continue to the puzzle!"
                : `You earned ${calculateWorkoutPoints()} points!`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
              <Button
                onClick={handleContinueToPuzzle}
                size="lg"
                className="h-16 text-body-lg font-bold gap-2 w-full sm:w-auto min-w-[240px]"
                data-testid="button-continue-puzzle"
              >
                Continue to Puzzle
              </Button>
              <Button
                onClick={() => setShowShareModal(true)}
                size="lg"
                variant="outline"
                className="h-14 text-body-md font-semibold gap-2 w-full sm:w-auto"
                data-testid="button-share-achievement"
              >
                <Share2 className="w-5 h-5" />
                Share Your Achievement
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full max-w-md mx-auto h-16 text-body-lg font-semibold shadow-lg block"
            data-testid="button-complete-workout"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Mark as Complete
          </Button>
        )}

        <div className="mt-8 p-6 bg-card rounded-lg border-2 border-primary">
          <h3 className="text-h3 font-semibold text-foreground mb-3">
            Wellness Reminders
          </h3>
          <ul className="space-y-2 text-body-md text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Honor your body—rest when you need to</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Keep water nearby to stay hydrated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Move at your own pace, there's no rush</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Finish to unlock today's brain game</span>
            </li>
          </ul>
        </div>
      </main>
      
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        trigger="workout"
      />
      
      <SocialShareModal
        open={showShareModal}
        onOpenChange={handleShareModalClose}
        achievement={`You completed ${workout.title}!`}
        shareText={`Just completed ${workout.title} on Fit with LaMaria! 💪 Staying active and sharp at any age! #FitWithLaMaria #SeniorFitness`}
      />
    </div>
  );
}
