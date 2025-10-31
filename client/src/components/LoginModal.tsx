import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Cloud, Smartphone } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: "workout" | "puzzle";
}

export function LoginModal({ open, onOpenChange, trigger = "workout" }: LoginModalProps) {
  const { signInWithGoogle, isFirebaseEnabled } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSkip = () => {
    const skipCount = parseInt(localStorage.getItem("fitword_login_skip_count") || "0");
    localStorage.setItem("fitword_login_skip_count", (skipCount + 1).toString());
    onOpenChange(false);
  };

  if (!isFirebaseEnabled) {
    return null;
  }

  const title = trigger === "workout" 
    ? "Great workout! 🎉" 
    : "Puzzle solved! 🧩";

  const description = trigger === "workout"
    ? "You just earned points! Sign in to save your progress across all your devices."
    : "Amazing job! Sign in to save your streak and compete on the leaderboard.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-h3 text-center">{title}</DialogTitle>
          <DialogDescription className="text-body-md text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-body-sm text-foreground">
                Save your progress to the cloud
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-body-sm text-foreground">
                Access your account on any device
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-body-sm text-foreground">
                Keep your streak and compete on leaderboard
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            size="lg"
            className="w-full h-12 gap-3"
            data-testid="button-modal-google-signin"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>

          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="w-full"
            data-testid="button-modal-skip"
          >
            Continue without signing in
          </Button>
        </div>

        <p className="text-body-xs text-muted-foreground text-center">
          Your progress is currently saved locally on this device only
        </p>
      </DialogContent>
    </Dialog>
  );
}
