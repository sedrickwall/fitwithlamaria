import { Bell, Moon, Globe, Shield } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { BackHeader } from "@/components/BackHeader";
import { Card } from "@/components/ui/card";

export default function Settings() {
  const { swipeHandlers, HeaderComponent } = BackHeader({
    title: "Settings",
    subtitle: "Customize your Fit with LaMaria experience",
  });

  return (
    <div 
      className="min-h-screen bg-background pb-24"
      {...swipeHandlers}
    >
      <div className="max-w-2xl mx-auto px-6 py-8">
        {HeaderComponent}

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-foreground">Notifications</h3>
                <p className="text-body-md text-muted-foreground">
                  Manage your notification preferences
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-foreground">Appearance</h3>
                <p className="text-body-md text-muted-foreground">
                  Customize the look and feel
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-foreground">Language</h3>
                <p className="text-body-md text-muted-foreground">
                  Choose your preferred language
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-warning-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-h4 font-bold text-foreground">Privacy</h3>
                <p className="text-body-md text-muted-foreground">
                  Control your privacy settings
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <p className="text-body-md text-center text-muted-foreground">
              🚧 Settings customization is coming soon! We're working on adding notification preferences, dark mode, and more.
            </p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
