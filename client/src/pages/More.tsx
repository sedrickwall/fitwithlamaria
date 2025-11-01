import { TrendingUp, User, Settings, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

export default function More() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      icon: TrendingUp,
      label: "Progress",
      href: "/progress",
      testId: "link-progress"
    },
    {
      icon: User,
      label: "Account",
      href: "/account",
      testId: "link-account",
      requiresAuth: true
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      testId: "link-settings"
    },
    {
      icon: HelpCircle,
      label: "FAQ",
      href: "/faq",
      testId: "link-faq"
    },
    {
      icon: Info,
      label: "About",
      href: "/about",
      testId: "link-about"
    }
  ];

  const visibleMenuItems = menuItems.filter(item => !item.requiresAuth || user);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {!user && (
          <div className="mb-8 text-center">
            <h2 className="text-h2 font-bold text-foreground mb-2">
              Sign In or Join Now
            </h2>
            <p className="text-body-md text-muted-foreground mb-6">
              Log in on any platform, sync Favorites & more!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <button
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all text-body-lg"
                  data-testid="button-signin-more"
                >
                  Sign In
                </button>
              </Link>
              <Link href="/login">
                <button
                  className="px-8 py-3 bg-muted text-foreground rounded-full font-semibold hover:bg-muted/70 transition-all text-body-lg"
                  data-testid="button-joinnow-more"
                >
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {visibleMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className="w-full p-5 bg-card rounded-lg hover:bg-muted/30 transition-colors border border-border flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <span className="text-body-lg font-medium text-foreground flex-1 text-left" data-testid={item.testId}>
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
              </button>
            </Link>
          ))}

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full p-5 bg-card rounded-lg hover:bg-muted/30 transition-colors border border-border flex items-center gap-4 group mt-6"
              data-testid="button-signout"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <span className="text-body-lg font-medium text-foreground flex-1 text-left">
                Sign Out
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-body-sm text-muted-foreground">v1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
