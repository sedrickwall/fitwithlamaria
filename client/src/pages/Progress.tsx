import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Trophy, Calendar as CalendarIcon, Users, Flame, Target, Brain } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getWorkoutCompletions, getPuzzleAttempts, getCompletedDates } from "@/lib/localStorage";
import { getWeeklyLeaderboard } from "@/lib/leaderboard";

export default function Progress() {
  const [selectedTab, setSelectedTab] = useState("stats");
  const { profile } = useUserProfile();

  const totalPoints = profile?.totalPoints || 0;
  const currentStreak = profile?.currentStreak || 0;
  const workoutCompletions = getWorkoutCompletions();
  const puzzleAttempts = getPuzzleAttempts();
  
  const uniqueWorkoutDays = new Set(workoutCompletions.map(c => c.date)).size;
  const uniquePuzzleDays = new Set(puzzleAttempts.filter(a => a.solved).map(a => a.date)).size;
  
  const totalWorkouts = uniqueWorkoutDays;
  const totalPuzzles = uniquePuzzleDays;
  const completedDates = getCompletedDates();
  const leaderboard = getWeeklyLeaderboard();

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateCompleted = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return completedDates.includes(dateStr);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar points={totalPoints} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-h1 font-bold text-foreground mb-2">
            Your Progress
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Track your fitness journey
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap gap-2 bg-transparent mb-8">
            <TabsTrigger 
              value="stats" 
              className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-stats"
            >
              <Target className="w-5 h-5 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-calendar"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="text-body-md h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-leaderboard"
            >
              <Users className="w-5 h-5 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border-2 border-border p-8 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-body-md text-muted-foreground">Total Points</p>
                    <p className="text-stat font-bold text-foreground" data-testid="stat-points">
                      {totalPoints.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border-2 border-border p-8 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-warning flex items-center justify-center">
                    <Flame className="w-8 h-8 text-warning" />
                  </div>
                  <div>
                    <p className="text-body-md text-muted-foreground">Current Streak</p>
                    <p className="text-stat font-bold text-foreground" data-testid="stat-streak">
                      {currentStreak} days
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border-2 border-border p-8 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-success flex items-center justify-center">
                    <Target className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <p className="text-body-md text-muted-foreground">Workouts Completed</p>
                    <p className="text-stat font-bold text-foreground" data-testid="stat-workouts">
                      {totalWorkouts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border-2 border-border p-8 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                    <Brain className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-body-md text-muted-foreground">Puzzles Solved</p>
                    <p className="text-stat font-bold text-foreground" data-testid="stat-puzzles">
                      {totalPuzzles}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-card rounded-lg border-2 border-primary">
              <h3 className="text-h3 font-semibold text-foreground mb-3">
                Your consistency is inspiring
              </h3>
              <p className="text-body-lg text-muted-foreground">
                Each day you move and engage your mind, you're investing in your well-being. Keep nourishing your body and brain—you're doing beautifully.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <div className="bg-card rounded-lg border-2 border-border p-8 shadow-md">
              <div className="mb-6">
                <h3 className="text-h2 font-semibold text-foreground text-center">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-body-md font-semibold text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {daysInMonth.map((date, i) => {
                  const completed = isDateCompleted(date);
                  const today = isToday(date);
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg
                        text-body-lg font-medium transition-all
                        ${completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
                        ${today ? "ring-4 ring-primary ring-offset-2" : ""}
                      `}
                      data-testid={`calendar-day-${format(date, "yyyy-MM-dd")}`}
                      aria-label={`${format(date, "MMMM d")}${completed ? " - completed" : ""}${today ? " - today" : ""}`}
                    >
                      {format(date, "d")}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-8 text-body-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-success" />
                  <span className="text-muted-foreground">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted" />
                  <span className="text-muted-foreground">Incomplete</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0">
            <div className="bg-card rounded-lg border-2 border-border shadow-md overflow-hidden">
              <div className="p-6 border-b border-border bg-primary/5">
                <h3 className="text-h2 font-semibold text-foreground">
                  Weekly Leaderboard
                </h3>
                <p className="text-body-md text-muted-foreground mt-1">
                  Top performers this week
                </p>
              </div>

              <div className="divide-y divide-border">
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.userId === profile?.id;
                  
                  return (
                    <div
                      key={entry.userId}
                      className={`
                        flex items-center gap-6 p-6 transition-colors
                        ${isCurrentUser ? "bg-accent/30" : "hover:bg-muted/30"}
                      `}
                      data-testid={`leaderboard-entry-${entry.rank}`}
                    >
                      <div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold text-body-lg
                          ${entry.rank === 1 ? "bg-warning text-warning-foreground" : 
                            entry.rank === 2 ? "bg-muted text-muted-foreground" : 
                            entry.rank === 3 ? "bg-destructive/20 text-destructive" : 
                            "bg-muted text-muted-foreground"}
                        `}
                      >
                        {entry.rank}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-h3 font-semibold text-foreground">
                          {entry.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-body-md text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            {entry.points.toLocaleString()} pts
                          </span>
                          <span className="text-body-md text-muted-foreground flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {entry.streak} day streak
                          </span>
                        </div>
                      </div>

                      {entry.rank <= 3 && (
                        <Trophy 
                          className={`w-10 h-10 ${
                            entry.rank === 1 ? "text-warning" : 
                            entry.rank === 2 ? "text-muted-foreground" : 
                            "text-destructive/70"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent/50 rounded-lg">
              <h3 className="text-h3 font-semibold text-foreground mb-3">
                Climb the leaderboard
              </h3>
              <p className="text-body-lg text-muted-foreground">
                Complete workouts and solve puzzles to earn points. The more consistent you are, the higher you'll rank!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
