import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Brain, Trophy, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { user, signInWithGoogle, signIn, signUp, loading, isFirebaseEnabled } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

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
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        toast({
          title: "Account created!",
          description: "Welcome to FitWord",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: isSignUp ? "Sign-up failed" : "Sign-in failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
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
                {isSignUp ? "Create Account" : "Welcome Back!"}
              </h2>
              <p className="text-body-md text-muted-foreground">
                {isSignUp ? "Join FitWord to save your progress" : "Sign in to continue your journey"}
              </p>
            </div>

            {isFirebaseEnabled ? (
              <>
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-body-md">
                        Name
                      </Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-12 text-body-md"
                        data-testid="input-displayname"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-body-md">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-body-md"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-body-md">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-body-md"
                      data-testid="input-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-body-md font-semibold gap-2"
                    data-testid="button-email-auth"
                  >
                    <Mail className="w-5 h-5" />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Button>
                </form>

                <div className="relative">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-body-sm text-muted-foreground">
                    or
                  </span>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-body-md font-semibold gap-3"
                  data-testid="button-google-signin"
                >
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-body-sm text-primary hover:underline"
                    data-testid="button-toggle-auth-mode"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </>
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
