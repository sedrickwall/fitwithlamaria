import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workout } from "@shared/schema";
import { useLocation } from "wouter";
import { useUserProfile } from "@/hooks/useUserProfile";

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
    videoUrl: "https://www.youtube.com/embed/fywl19sc35Y?si=2Yl07mqNsCoGWqGY",
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

export default function Workouts() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { profile } = useUserProfile();
  const totalPoints = profile?.totalPoints || 0;

  const filteredWorkouts = selectedCategory === "all"
    ? SAMPLE_WORKOUTS
    : SAMPLE_WORKOUTS.filter(w => w.category === selectedCategory);

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
          {filteredWorkouts.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onClick={() => handleWorkoutClick(workout.id)}
            />
          ))}
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
