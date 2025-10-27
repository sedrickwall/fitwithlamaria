import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div 
      className="bg-gradient-to-br from-warning/20 to-destructive/20 p-8 rounded-lg border-2 border-warning/30 shadow-lg"
      data-testid="streak-display"
    >
      <div className="flex items-center justify-center gap-4">
        <Flame 
          className="w-12 h-12 text-warning drop-shadow-lg" 
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 0 8px rgba(251, 146, 60, 0.5))" }}
        />
        <div className="text-center">
          <div className="text-stat font-bold text-foreground animate-scale-pulse">
            {streak}
          </div>
          <div className="text-body-lg text-muted-foreground">
            day{streak !== 1 ? "s" : ""} streak
          </div>
        </div>
      </div>
    </div>
  );
}
