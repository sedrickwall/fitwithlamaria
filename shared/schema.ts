import { z } from "zod";

// Workout schema
export const workoutSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(["seated", "standing", "balance"]),
  duration: z.number(),
  difficulty: z.enum(["low", "medium"]),
  videoUrl: z.string(),
  thumbnail: z.string().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;

// User profile schema
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  totalPoints: z.number().default(0),
  currentStreak: z.number().default(0),
  lastActiveDate: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Workout completion schema
export const workoutCompletionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workoutId: z.string(),
  completedAt: z.string(),
  date: z.string(),
  pointsEarned: z.number(),
});

export type WorkoutCompletion = z.infer<typeof workoutCompletionSchema>;

// Puzzle attempt schema
export const puzzleAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  word: z.string(),
  guesses: z.array(z.string()),
  solved: z.boolean(),
  attempts: z.number(),
  pointsEarned: z.number(),
  completedAt: z.string().optional(),
});

export type PuzzleAttempt = z.infer<typeof puzzleAttemptSchema>;

// Daily status schema - supports multiple workouts/puzzles per day
export const dailyStatusSchema = z.object({
  date: z.string(),
  
  // Multiple workout system
  workoutCompletionCount: z.number().default(0), // How many workouts completed today
  
  // Multiple puzzle system
  completedPuzzleIndices: z.array(z.number()).default([]), // Array of completed puzzle indices [0, 1, 2, ...]
  
  // Backward compatibility fields (deprecated)
  workoutCompleted: z.boolean().default(false),
  puzzleUnlocked: z.boolean().default(false),
  wordleSolved: z.boolean().default(false),
  wordSearchSolved: z.boolean().default(false),
  puzzleSolved: z.boolean().default(false),
  
  totalPointsEarned: z.number(),
});

export type DailyStatus = z.infer<typeof dailyStatusSchema>;

// Leaderboard entry schema
export const leaderboardEntrySchema = z.object({
  userId: z.string(),
  name: z.string(),
  points: z.number(),
  rank: z.number(),
  streak: z.number(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

// Insert schemas (for creating new records)
export const insertUserProfileSchema = userProfileSchema.omit({ id: true });
export const insertWorkoutCompletionSchema = workoutCompletionSchema.omit({ id: true });
export const insertPuzzleAttemptSchema = puzzleAttemptSchema.omit({ id: true });

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertWorkoutCompletion = z.infer<typeof insertWorkoutCompletionSchema>;
export type InsertPuzzleAttempt = z.infer<typeof insertPuzzleAttemptSchema>;
