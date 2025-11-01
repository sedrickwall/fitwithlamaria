import { useState, useEffect } from "react";
import { User, Mail, Crown, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export default function Account() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const checkPremiumStatus = async () => {
      if (!isFirebaseReady()) {
        setIsLoading(false);
        return;
      }

      try {
        const firestoreUser = await userOperations.getUser(user.uid);
        setIsPremium(firestoreUser?.premium === true);
      } catch (error) {
        console.error("Error checking premium status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-foreground mb-2" data-testid="text-account-title">
            My Account
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Manage your profile and subscription
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-h3 font-bold text-foreground" data-testid="text-user-name">
                  {user.displayName || 'User'}
                </h2>
                <p className="text-body-md text-muted-foreground">Member</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-body-sm text-muted-foreground">Email</p>
                  <p className="text-body-md text-foreground" data-testid="text-user-email">
                    {user.email || 'No email'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-body-sm text-muted-foreground">Member Since</p>
                  <p className="text-body-md text-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${isPremium ? 'from-warning to-warning-secondary' : 'from-muted to-muted-foreground'} flex items-center justify-center`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-h4 font-bold text-foreground">Subscription Status</h3>
                <p className="text-body-md text-muted-foreground">
                  {isPremium ? 'Premium Member ✅' : 'Free Member'}
                </p>
              </div>
            </div>
            
            {!isPremium && (
              <Link href="/premium">
                <button className="w-full mt-4 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all" data-testid="button-upgrade-account">
                  Upgrade Now →
                </button>
              </Link>
            )}
          </Card>

          <Card className="p-6 bg-muted/50">
            <p className="text-body-md text-center text-muted-foreground">
              More account settings coming soon! You can manage your reminder time, notifications, and other preferences here.
            </p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
