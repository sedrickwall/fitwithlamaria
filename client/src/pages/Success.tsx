import { useEffect } from "react";
import { useLocation } from "wouter";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

export default function Success() {
  const { profile } = useUserProfile();
  const [, navigate] = useLocation();
  const totalPoints = profile?.totalPoints || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar points={totalPoints} />
      
      <main className="max-w-2xl mx-auto px-6 md:px-8 py-16 pb-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-h1 font-bold">Payment Successful!</h1>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-h3 font-semibold">Welcome to Premium!</h2>
            </div>
            <p className="text-body-lg text-muted-foreground">
              You now have unlimited access to all workouts, puzzles, and premium features.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <p className="text-body-md text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
            
            <Button 
              onClick={() => navigate("/")}
              className="w-full md:w-auto h-14 text-lg px-8"
              data-testid="button-continue"
            >
              Continue to Dashboard
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Redirecting in 5 seconds...
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
