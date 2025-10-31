import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, CheckCircle, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db, isFirebaseReady } from "@/services/firebase";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<"setup" | "welcome">("setup");
  const [inviteCode, setInviteCode] = useState("");
  const [reminderTime, setReminderTime] = useState<string>("09:00");
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const timeOptions = [
    { value: "06:00", label: "6:00 AM" },
    { value: "07:00", label: "7:00 AM" },
    { value: "08:00", label: "8:00 AM" },
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "20:00", label: "8:00 PM" },
  ];

  const handleContinue = () => {
    if (inviteCode) {
      localStorage.setItem("fitword_invite_code", inviteCode);
    }
    setStep("welcome");
  };

  const handleComplete = async () => {
    localStorage.setItem("fitword_reminder_time", reminderTime);
    localStorage.setItem("fitword_reminder_enabled", reminderEnabled ? "true" : "false");
    localStorage.setItem("fitword_onboarding_complete", "true");
    
    if (inviteCode) {
      localStorage.setItem("fitword_invite_code", inviteCode);
    }
    
    const userName = user?.displayName || user?.email?.split('@')[0] || "Pat";
    localStorage.setItem("fitword_user_name", userName);

    if (isFirebaseReady() && user && db) {
      try {
        const ref = doc(db, "users", user.uid);
        await updateDoc(ref, {
          inviteCode: inviteCode || "",
          reminderTime,
          reminderEnabled,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving onboarding data to Firestore:", error);
      }
    }

    toast({
      title: "Welcome to FitWord!",
      description: `Your daily reminder is set for ${timeOptions.find(t => t.value === reminderTime)?.label}`,
    });

    navigate("/");
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-h1 font-bold text-foreground mb-4">
              Welcome to FitWord!
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Let's get moving and thinking together. Watch this quick intro to get started.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
              <div className="bg-black rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                  title="Welcome to FitWord"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                  data-testid="video-welcome"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-h4 font-bold text-foreground mb-3">
              You're All Set!
            </h3>
            <p className="text-body-md text-muted-foreground">
              Complete your daily workout to unlock today's word puzzle. Build your streak, earn points, and join our community on the leaderboard!
            </p>
          </div>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full max-w-md mx-auto h-16 text-body-lg font-semibold group"
            data-testid="button-finish-onboarding"
          >
            Let's Go! 💪
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-4">
            Move your body, sharpen your mind.
          </h1>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Your journey to fitness and mental sharpness starts here. Let's personalize your experience.
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="invite-code" className="text-body-lg font-semibold">
                Invite Code (Optional)
              </Label>
              <Input
                id="invite-code"
                type="text"
                placeholder="Enter your invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="h-14 text-body-lg"
                data-testid="input-invite-code"
              />
              <p className="text-body-sm text-muted-foreground">
                Have an invite code? Enter it here to unlock special features and connect with your group.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-h3 font-bold text-foreground mb-2">
                Daily Reminder
              </h2>
              <p className="text-body-md text-muted-foreground">
                Choose your preferred time for daily workout and puzzle reminders
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="reminder-time" className="text-body-lg font-semibold">
                Reminder Time
              </Label>
              <Select
                value={reminderTime}
                onValueChange={setReminderTime}
              >
                <SelectTrigger
                  id="reminder-time"
                  className="h-14 text-body-lg"
                  data-testid="select-reminder-time"
                >
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-body-lg py-3"
                      data-testid={`option-time-${option.value}`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-body-md font-semibold text-foreground">
                  Enable Daily Reminders
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Get notified to keep your streak alive
                </p>
              </div>
              <button
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${reminderEnabled ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted-foreground/30'}
                `}
                data-testid="toggle-reminder-enabled"
                aria-label="Toggle reminder"
              >
                <span
                  className={`
                    absolute top-1 left-1 w-6 h-6 rounded-full bg-white
                    transition-transform duration-200 ease-in-out
                    ${reminderEnabled ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </Card>

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mb-8">
          <h3 className="text-h4 font-bold text-foreground mb-3">
            What to Expect
          </h3>
          <ul className="space-y-3 text-body-md text-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Daily workout videos (10-20 minutes) designed for seniors</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Brain-boosting word puzzle unlocked after each workout</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Track your progress, earn points, and build your streak</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Compete on the leaderboard with the community</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-16 text-body-lg font-semibold group"
          data-testid="button-continue-onboarding"
        >
          Continue
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
