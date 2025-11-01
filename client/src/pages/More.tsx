import { TrendingUp, User, Settings, HelpCircle, Info, LogOut } from "lucide-react";
import { Link } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function More() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      icon: TrendingUp,
      label: "Progress",
      description: "View your streaks and achievements",
      path: "/progress",
      color: "from-primary to-primary/80",
      testId: "menu-progress",
    },
    {
      icon: User,
      label: user ? "My Account" : "Sign In or Join Now",
      description: user ? "Manage your profile and settings" : "Create an account or sign in",
      path: user ? "/account" : "/login",
      color: "from-secondary to-secondary/80",
      testId: "menu-account",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Customize your experience",
      path: "/settings",
      color: "from-accent to-accent/80",
      testId: "menu-settings",
    },
    {
      icon: HelpCircle,
      label: "FAQ",
      description: "Get answers to common questions",
      path: "/faq",
      color: "from-warning to-warning/80",
      testId: "menu-faq",
    },
    {
      icon: Info,
      label: "About Fit with LaMaria",
      description: "Learn more about our mission",
      path: "/about",
      color: "from-primary to-secondary",
      testId: "menu-about",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-foreground mb-2" data-testid="text-more-title">
            More
          </h1>
          <p className="text-body-lg text-muted-foreground">
            {user ? `Welcome back, ${user.displayName || 'there'}!` : 'Explore more options'}
          </p>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <Card 
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20"
                  data-testid={item.testId}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h4 font-bold text-foreground mb-1">
                        {item.label}
                      </h3>
                      <p className="text-body-md text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="mt-8 pt-8 border-t border-border">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="w-full h-14 text-body-lg font-semibold gap-2"
              data-testid="button-sign-out"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
