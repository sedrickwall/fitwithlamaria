import { Heart, Target, Users, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-foreground mb-2" data-testid="text-about-title">
            About Fit with LaMaria
          </h1>
          <p className="text-body-lg text-muted-foreground">
            Move your body, sharpen your mind
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-h2 font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-body-lg text-foreground leading-relaxed">
              Fit with LaMaria is designed specifically for active seniors 65+ who want to stay physically fit and mentally sharp. We believe that aging doesn't mean slowing down—it means finding smarter, more enjoyable ways to stay healthy.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-h4 font-bold text-foreground">Designed with Care</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Every workout and puzzle is crafted with seniors in mind—gentle, effective, and accessible to everyone.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-h4 font-bold text-foreground">Results That Matter</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Build strength, improve balance, and keep your mind sharp with daily consistency.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-h4 font-bold text-foreground">Community Support</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Join a community of like-minded seniors who encourage and inspire each other.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning to-warning-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-h4 font-bold text-foreground">Fun & Engaging</h3>
              </div>
              <p className="text-body-md text-muted-foreground">
                Fitness shouldn't feel like a chore. We make it enjoyable with puzzles, points, and progress tracking.
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-h3 font-bold text-foreground mb-4">The "Move to Unlock" Model</h2>
            <p className="text-body-lg text-foreground mb-4 leading-relaxed">
              Our unique approach combines physical activity with mental stimulation. Complete your daily workout to unlock today's brain-boosting puzzle. This simple system helps you:
            </p>
            <ul className="space-y-2 text-body-md text-muted-foreground">
              <li>• Stay consistent with daily movement</li>
              <li>• Keep your mind engaged and sharp</li>
              <li>• Build healthy habits that last</li>
              <li>• Track your progress and celebrate wins</li>
            </ul>
          </Card>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
            <h2 className="text-h3 font-bold text-foreground mb-4">Join Us Today</h2>
            <p className="text-body-lg text-muted-foreground mb-6">
              Start your journey to a healthier, sharper you. Try Fit with LaMaria free for 7 days.
            </p>
            <a
              href="/premium"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              data-testid="link-get-started"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
