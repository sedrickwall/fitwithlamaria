import { Clock, TrendingUp } from "lucide-react";
import { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
}

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const categoryLabels = {
    seated: "Seated",
    standing: "Standing",
    balance: "Balance",
  };

  const difficultyColors = {
    low: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground",
  };

  return (
    <button
      onClick={onClick}
      data-testid={`workout-card-${workout.id}`}
      className="w-full bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-ring group"
      aria-label={`${workout.title} - ${workout.duration} minute ${workout.difficulty} workout`}
    >
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent overflow-hidden">
        {workout.thumbnail ? (
          <img 
            src={workout.thumbnail} 
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-body-sm font-medium ${difficultyColors[workout.difficulty]} backdrop-blur-sm`}>
            {workout.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-body-sm font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
            <Clock className="w-4 h-4" aria-hidden="true" />
            {workout.duration} min
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-h3 font-semibold text-card-foreground mb-2">
          {workout.title}
        </h3>
        <p className="text-body-md text-muted-foreground">
          {categoryLabels[workout.category]} • {workout.duration} minutes
        </p>
      </div>
    </button>
  );
}
