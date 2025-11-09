import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { canStartNewWorkout } from "@/lib/localStorage";
import { SAMPLE_WORKOUTS } from "@/data/workouts";
import { Workout } from "@shared/schema";

export default function Workouts() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { profile } = useUserProfile();
  const { isPremium } = usePremiumStatus();
  const totalPoints = profile?.totalPoints || 0;

  const filteredWorkouts = selectedCategory === "all"
    ? SAMPLE_WORKOUTS
    : SAMPLE_WORKOUTS.filter(w => w.category === selectedCategory);

  const canStart = canStartNewWorkout();

  const getWorkoutLockState = (workout: Workout): { isLocked: boolean; lockReason?: "premium" | "wait24hr" } => {
    // Premium-only workouts
    if (workout.requiresPremium && !isPremium) {
      return { isLocked: true, lockReason: "premium" };
    }
    
    // Free users can only do 1 workout per 24 hours
    if (!isPremium && !canStart) {
      return { isLocked: true, lockReason: "wait24hr" };
    }
    
    return { isLocked: false };
  };

  const handleWorkoutClick = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar points={totalPoints} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-h1 font-bold text-foreground mb-2">
            Workout Library
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Choose a workout to get started
          </p>
        </div>

        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap gap-2 bg-transparent">
              <TabsTrigger 
                value="all" 
                className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="filter-all"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="seated" 
                className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="filter-seated"
              >
                Seated
              </TabsTrigger>
              <TabsTrigger 
                value="standing" 
                className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="filter-standing"
              >
                Standing
              </TabsTrigger>
              <TabsTrigger 
                value="balance" 
                className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid="filter-balance"
              >
                Balance
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => {
            const { isLocked, lockReason } = getWorkoutLockState(workout);
            return (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onClick={() => handleWorkoutClick(workout.id)}
                isLocked={isLocked}
                lockReason={lockReason}
              />
            );
          })}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-body-lg text-muted-foreground">
              No workouts found in this category
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
