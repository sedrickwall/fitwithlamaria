import { LeaderboardEntry } from "@shared/schema";
import { getUserProfile } from "./localStorage";

const SAMPLE_USERS = [
  { name: "Sarah M.", basePoints: 2850, baseStreak: 42 },
  { name: "John D.", basePoints: 2640, baseStreak: 38 },
  { name: "Mary K.", basePoints: 2510, baseStreak: 35 },
  { name: "Robert L.", basePoints: 2340, baseStreak: 31 },
  { name: "Patricia W.", basePoints: 2180, baseStreak: 28 },
  { name: "Michael S.", basePoints: 2050, baseStreak: 25 },
  { name: "Linda H.", basePoints: 1920, baseStreak: 22 },
  { name: "James B.", basePoints: 1810, baseStreak: 20 },
  { name: "Barbara C.", basePoints: 1690, baseStreak: 18 },
  { name: "David R.", basePoints: 1580, baseStreak: 16 },
];

export function getWeeklyLeaderboard(): LeaderboardEntry[] {
  const userProfile = getUserProfile();
  
  const entries: LeaderboardEntry[] = SAMPLE_USERS.map((user, index) => ({
    userId: `user_${index + 1}`,
    name: user.name,
    points: user.basePoints,
    streak: user.baseStreak,
    rank: index + 1,
  }));

  if (userProfile) {
    const userEntry: LeaderboardEntry = {
      userId: userProfile.id,
      name: userProfile.name,
      points: userProfile.totalPoints,
      streak: userProfile.currentStreak,
      rank: 0,
    };

    entries.push(userEntry);

    entries.sort((a, b) => b.points - a.points);

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, 20);
  }

  return entries.slice(0, 20);
}
