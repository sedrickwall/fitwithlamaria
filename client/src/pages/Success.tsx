import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db, isFirebaseReady } from "@/services/firebase";

export default function Success() {
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const totalPoints = profile?.totalPoints || 0;

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        console.error("No session ID found in URL");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/stripe/checkout-session/${sessionId}`);
        const data = await response.json();

        if (data.status === "complete") {
          setSubscriptionId(data.subscriptionId as string);

          // Update user's premium status in Firestore
          if (isFirebaseReady() && user && db) {
            try {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                premium: true,
                subscriptionId: data.subscriptionId,
                updatedAt: new Date(),
              });
              console.log("✅ User premium status updated in Firestore");
            } catch (error) {
              console.error("Error updating Firestore:", error);
              toast({
                title: "Note",
                description: "Payment successful, but there was an issue updating your account. Please contact support if needed.",
                variant: "default",
              });
            }
          } else {
            // Update in localStorage as fallback
            if (profile) {
              const updatedProfile = {
                ...profile,
                premium: true,
                subscriptionId: data.subscriptionId,
              };
              localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
            }
          }
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Verification Error",
          description: "Could not verify payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [user, profile, toast]);

  useEffect(() => {
    if (!isVerifying) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, isVerifying]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar points={totalPoints} />
        
        <main className="max-w-2xl mx-auto px-6 md:px-8 py-16 pb-24">
          <div className="text-center space-y-6">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <h1 className="text-h1 font-bold">Verifying Payment...</h1>
            <p className="text-body-lg text-muted-foreground">
              Please wait while we confirm your subscription.
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

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
            {subscriptionId && (
              <p className="text-body-sm text-muted-foreground mt-4">
                Subscription ID: {subscriptionId}
              </p>
            )}
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
