import { Home, Dumbbell, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home", testId: "nav-home" },
    { path: "/workouts", icon: Dumbbell, label: "Workouts", testId: "nav-workouts" },
    { path: "/progress", icon: TrendingUp, label: "Progress", testId: "nav-progress" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex justify-around items-center h-18">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={item.testId}
              className="flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-ring"
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon 
                  className={`w-8 h-8 transition-colors ${
                    isActive 
                      ? "text-primary fill-primary" 
                      : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                />
                <span 
                  className={`text-body-sm font-medium ${
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
