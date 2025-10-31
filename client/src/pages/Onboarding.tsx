import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
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

  const handleComplete = () => {
    localStorage.setItem("fitword_reminder_time", reminderTime);
    localStorage.setItem("fitword_reminder_enabled", reminderEnabled ? "true" : "false");
    localStorage.setItem("fitword_onboarding_complete", "true");

    toast({
      title: "Welcome to FitWord!",
      description: `Your daily reminder is set for ${timeOptions.find(t => t.value === reminderTime)?.label}`,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-4">
            Welcome to FitWord!
          </h1>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Your journey to fitness and mental sharpness starts here. Let's personalize your experience.
          </p>
        </div>

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
          onClick={handleComplete}
          size="lg"
          className="w-full h-16 text-body-lg font-semibold group"
          data-testid="button-complete-onboarding"
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
