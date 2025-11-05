import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Clock, X } from "lucide-react";
import { useLocation } from "wouter";

interface LimitedTimeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
  expiresAt: number; // timestamp when offer expires
}

export function LimitedTimeOfferModal({ 
  open, 
  onOpenChange, 
  onDismiss,
  expiresAt 
}: LimitedTimeOfferModalProps) {
  const [, navigate] = useLocation();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleUpgrade = (plan: "monthly" | "yearly") => {
    onOpenChange(false);
    navigate(`/premium?plan=${plan}`);
  };

  const handleDismissModal = () => {
    onDismiss();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <button
          onClick={handleDismissModal}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          data-testid="button-close-offer-modal"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-warning-start to-warning-end flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <DialogTitle className="text-h2 text-center">
            🎉 Congratulations!
          </DialogTitle>
          <DialogDescription className="text-body-lg text-center">
            You've just experienced the power of combining movement and brain health. 
            Ready to unlock your full potential?
          </DialogDescription>
        </DialogHeader>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-br from-warning-start to-warning-end rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-white" />
            <p className="text-body-md font-semibold text-white">Limited Time Offer</p>
          </div>
          <p className="text-h3 font-bold text-white">{timeLeft}</p>
          <p className="text-body-sm text-white/90 mt-1">to claim your special offer</p>
        </div>

        {/* Premium Features */}
        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-body-md font-semibold text-foreground">Unlimited Workouts & Puzzles</p>
              <p className="text-body-sm text-muted-foreground">Do as many as you want, every day</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-body-md font-semibold text-foreground">Community Access</p>
              <p className="text-body-sm text-muted-foreground">Connect, cheer, and motivate each other</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-body-md font-semibold text-foreground">7-Day Free Trial</p>
              <p className="text-body-sm text-muted-foreground">Try premium risk-free, cancel anytime</p>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="space-y-3">
          <Button
            onClick={() => handleUpgrade("yearly")}
            className="w-full h-auto py-4 px-6 bg-gradient-to-br from-primary-start to-primary-end hover:opacity-90 relative"
            data-testid="button-offer-yearly"
          >
            <div className="absolute -top-2 -right-2 bg-warning text-warning-foreground text-xs font-bold px-3 py-1 rounded-full">
              SAVE 59%
            </div>
            <div className="flex flex-col items-center w-full">
              <p className="text-h3 font-bold text-white">$49/year</p>
              <p className="text-body-sm text-white/90">Just $4.08/month • 7-day free trial</p>
            </div>
          </Button>

          <Button
            onClick={() => handleUpgrade("monthly")}
            variant="outline"
            className="w-full h-auto py-4 px-6"
            data-testid="button-offer-monthly"
          >
            <div className="flex flex-col items-center w-full">
              <p className="text-h4 font-bold text-foreground">$4.99/month</p>
              <p className="text-body-sm text-muted-foreground">7-day free trial included</p>
            </div>
          </Button>
        </div>

        <Button
          onClick={handleDismissModal}
          variant="ghost"
          className="w-full h-12 text-body-md"
          data-testid="button-dismiss-offer"
        >
          Maybe Later
        </Button>

        <p className="text-body-xs text-muted-foreground text-center">
          No charges during your 7-day trial. Cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}
