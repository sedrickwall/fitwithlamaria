import { useState, useEffect } from "react";
import { Users, MessageCircle, Trophy, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { PremiumLockedModal } from "@/components/PremiumLockedModal";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export default function Community() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isFirebaseReady() || !user) {
        setIsPremium(false);
        setShowPremiumModal(true);
        setIsLoading(false);
        return;
      }

      try {
        const firestoreUser = await userOperations.getUser(user.uid);
        const premium = firestoreUser?.premium === true;
        setIsPremium(premium);
        
        if (!premium) {
          setShowPremiumModal(true);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
        setShowPremiumModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  const handleModalClose = () => {
    setShowPremiumModal(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <>
        <PremiumLockedModal
          open={showPremiumModal}
          onOpenChange={handleModalClose}
          title="Premium Feature"
          description="The Fit with LaMaria Community is part of our Premium plan. Unlock now to join others staying fit and sharp together!"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-foreground mb-2" data-testid="text-community-title">
            Community
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Connect with others on their fitness journey
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-h3 font-bold text-foreground">Welcome to the Community!</h2>
                <p className="text-body-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <p className="text-body-md text-foreground">
              This is where you'll connect with other members, share your progress, and stay motivated together.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                <h3 className="text-h4 font-bold text-foreground">Group Chat</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Chat with fellow members and share your fitness journey
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-warning" />
                <h3 className="text-h4 font-bold text-foreground">Challenges</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Join weekly challenges and compete with friends
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-8 h-8 text-accent" />
                <h3 className="text-h4 font-bold text-foreground">Support</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Give and receive encouragement from the community
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-secondary" />
                <h3 className="text-h4 font-bold text-foreground">Member Stories</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Read inspiring stories from other members
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-muted/50">
            <p className="text-body-md text-center text-muted-foreground">
              🚧 Community features are currently under development and will be available soon!
            </p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
