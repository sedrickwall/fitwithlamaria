import { Trophy } from "lucide-react";

interface TopBarProps {
  points: number;
}

export function TopBar({ points }: TopBarProps) {
  return (
    <header className="sticky top-0 bg-card border-b border-border shadow-sm z-40 h-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-body-lg font-semibold text-foreground leading-tight">
            Fit with LaMaria
          </h1>
          <p className="text-body-sm text-muted-foreground">
            Body & mind wellness
          </p>
        </div>
        <div 
          className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border-2 border-warning"
          data-testid="points-display"
          aria-label={`${points} points`}
        >
          <Trophy className="w-8 h-8 text-warning" aria-hidden="true" />
          <span className="text-h3 font-bold text-warning">
            {points.toLocaleString()}
          </span>
          <span className="text-body-md text-muted-foreground">pts</span>
        </div>
      </div>
    </header>
  );
}
