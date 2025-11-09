import { Clock, TrendingUp, Lock } from "lucide-react";
import { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
  isLocked?: boolean;
  lockReason?: "premium" | "wait24hr";
}

export function WorkoutCard({ workout, onClick, isLocked = false, lockReason }: WorkoutCardProps) {
  const categoryLabels = {
    seated: "Seated",
    standing: "Standing",
    balance: "Balance",
  };

  const difficultyColors = {
    low: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground",
  };

  const lockMessage = lockReason === "premium" ? "Premium Only" : "Wait 24hr";

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      data-testid={`workout-card-${workout.id}`}
      disabled={isLocked}
      className={`w-full bg-card rounded-lg overflow-hidden shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-ring group flex flex-col relative ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'
      }`}
      aria-label={isLocked ? `${workout.title} - Locked - ${lockMessage}` : `${workout.title} - ${workout.duration} minute ${workout.difficulty} workout`}
    >
      <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
        {workout.thumbnail ? (
          <>
            <img 
              src={workout.thumbnail} 
              alt="" 
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isLocked ? 'grayscale' : 'group-hover:scale-105'
              }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${
              isLocked ? 'from-gray-900/60 to-gray-900/60' : 'from-primary/30 to-accent/40'
            }`} />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center ${
            isLocked ? 'from-gray-800/40 to-gray-900/40' : 'from-primary/20 to-accent'
          }`}>
            <TrendingUp className="w-16 h-16 text-primary/40" aria-hidden="true" />
          </div>
        )}
        
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 flex flex-col items-center gap-2">
              <Lock className="w-12 h-12 text-white" aria-hidden="true" />
              <span className="text-white font-bold text-lg">
                {lockMessage}
              </span>
            </div>
          </div>
        )}
        
        {!isLocked && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-body-sm font-medium ${difficultyColors[workout.difficulty]} backdrop-blur-sm`}>
              {workout.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-body-sm font-medium bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {workout.duration} min
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow">
        <h3 className={`text-h3 font-semibold mb-2 ${isLocked ? 'text-muted-foreground' : 'text-card-foreground'}`}>
          {workout.title}
        </h3>
        <p className="text-body-md text-muted-foreground">
          {categoryLabels[workout.category]} • {workout.duration} minutes
        </p>
      </div>
    </button>
  );
}
