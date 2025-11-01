import { useState, useEffect } from "react";
import { Home, Dumbbell, TrendingUp, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";
import { PremiumLockedModal } from "./PremiumLockedModal";

export function BottomNav() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isCheckingPremium, setIsCheckingPremium] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isFirebaseReady() || !user) {
        setIsPremium(false);
        setIsCheckingPremium(false);
        return;
      }

      try {
        const firestoreUser = await userOperations.getUser(user.uid);
        setIsPremium(firestoreUser?.premium === true);
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setIsCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isPremium && !isCheckingPremium) {
      setShowPremiumModal(true);
    } else if (isPremium) {
      navigate("/community");
    }
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home", testId: "nav-home", onClick: null },
    { path: "/workouts", icon: Dumbbell, label: "Workouts", testId: "nav-workouts", onClick: null },
    { path: "/progress", icon: TrendingUp, label: "Progress", testId: "nav-progress", onClick: null },
    { path: "/community", icon: Users, label: "Community", testId: "nav-community", onClick: handleCommunityClick },
  ];

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex justify-around items-center h-18">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            if (item.onClick) {
              return (
                <button
                  key={item.path}
                  onClick={item.onClick}
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
                </button>
              );
            }
            
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

      <PremiumLockedModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        title="Premium Feature"
        description="The Fit with LaMaria Community is part of our Premium plan. Unlock now to join others staying fit and sharp together!"
      />
    </>
  );
}
