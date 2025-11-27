import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { TestModeBanner } from "@/components/TestModeBanner";
import { initTestMode } from "@/lib/testMode";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import WorkoutPlayer from "@/pages/WorkoutPlayer";
import PuzzleRouter from "@/pages/PuzzleRouter";
import Progress from "@/pages/Progress";
import Onboarding from "@/pages/Onboarding";
import Premium from "@/pages/Premium";
import Success from "@/pages/Success";
import Community from "@/pages/Community";
import More from "@/pages/More";
import Account from "@/pages/Account";
import Settings from "@/pages/Settings";
import FAQ from "@/pages/FAQ";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

function Router() {
  const [location, navigate] = useLocation();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

    if (!hasSeenOnboarding && location !== "/onboarding" && location !== "/login") {
      navigate("/onboarding");
    }

    setHasCheckedOnboarding(true);
  }, [location, navigate]);

  if (!hasCheckedOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={Dashboard} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/workout/:id" component={WorkoutPlayer} />
      <Route path="/puzzle" component={PuzzleRouter} />
      <Route path="/progress" component={Progress} />
      <Route path="/premium" component={Premium} />
      <Route path="/success" component={Success} />
      <Route path="/community" component={Community} />
      <Route path="/more" component={More} />
      <Route path="/account" component={Account} />
      <Route path="/settings" component={Settings} />
      <Route path="/faq" component={FAQ} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initTestMode();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <TestModeBanner />
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
