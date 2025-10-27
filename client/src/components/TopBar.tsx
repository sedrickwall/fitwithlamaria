import { format } from "date-fns";
import { Trophy } from "lucide-react";

interface TopBarProps {
  points: number;
}

export function TopBar({ points }: TopBarProps) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <header className="sticky top-0 bg-card border-b border-border shadow-sm z-40 h-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
        <h1 className="text-body-lg font-medium text-foreground">
          {today}
        </h1>
        <div 
          className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full"
          data-testid="points-display"
          aria-label={`${points} points`}
        >
          <Trophy className="w-8 h-8 text-warning" aria-hidden="true" />
          <span className="text-h3 font-bold text-accent-foreground">
            {points.toLocaleString()}
          </span>
          <span className="text-body-md text-muted-foreground">pts</span>
        </div>
      </div>
    </header>
  );
}
