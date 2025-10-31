import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Brain, Trophy } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { user, signInWithGoogle, loading, isFirebaseEnabled } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      const onboardingComplete = localStorage.getItem("fitword_onboarding_complete");
      if (onboardingComplete === "true") {
        navigate("/");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-h3 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-4">
            Fit with LaMaria
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Move your body, sharpen your mind
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-h3 font-bold text-foreground mb-2">
                Welcome!
              </h2>
              <p className="text-body-md text-muted-foreground">
                Sign in to start your fitness and brain training journey
              </p>
            </div>

            {isFirebaseEnabled ? (
              <Button
                onClick={handleGoogleSignIn}
                size="lg"
                variant="outline"
                className="w-full h-14 text-body-lg font-semibold gap-3"
                data-testid="button-google-signin"
              >
                <FcGoogle className="w-6 h-6" />
                Sign in with Google
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/onboarding")}
                size="lg"
                className="w-full h-14 text-body-lg font-semibold"
                data-testid="button-demo-mode"
              >
                Continue in Demo Mode
              </Button>
            )}
          </div>
        </Card>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
          <h3 className="text-h4 font-bold text-foreground mb-4 text-center">
            What You'll Get
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-body-md text-foreground">Daily workout videos for seniors</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-body-md text-foreground">Brain-boosting word puzzles</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warning to-warning-secondary flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-body-md text-foreground">Track progress & compete on leaderboard</span>
            </div>
          </div>
        </div>

        <p className="text-body-sm text-muted-foreground text-center mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
