import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface PremiumLockedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function PremiumLockedModal({
  open,
  onOpenChange,
  title = "Premium Feature",
  description = "The Fit with LaMaria Community is part of our Premium plan. Unlock now to join others staying fit and sharp together!",
}: PremiumLockedModalProps) {
  const [, navigate] = useLocation();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/premium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-premium-locked">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-h3" data-testid="text-premium-locked-title">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-body-lg pt-2" data-testid="text-premium-locked-description">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-body-md font-semibold text-foreground mb-1">
                Premium Benefits Include:
              </p>
              <ul className="text-body-sm text-muted-foreground space-y-1">
                <li>• Access to Community features</li>
                <li>• Unlimited workouts and puzzles</li>
                <li>• Exclusive premium content</li>
                <li>• 7-day free trial</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleUpgrade}
            size="lg"
            className="w-full h-12 text-body-md font-semibold"
            data-testid="button-upgrade-to-premium"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="lg"
            className="w-full h-12 text-body-md"
            data-testid="button-cancel-premium-locked"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
