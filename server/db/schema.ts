// ============================================================
// DATABASE SCHEMA - Future Firebase Integration
// ============================================================
// This file defines the data structure for future database integration.
// Currently using localStorage for MVP; these schemas prepare for
// migrating to Firebase Firestore or PostgreSQL.
//
// Schema Status: PLACEHOLDER - Not connected to live database
// Next Steps: Configure Firebase/Firestore when ready for auth & persistence
// ============================================================

// ============================================================
// USERS COLLECTION
// ============================================================
// Stores user profiles, authentication data, and subscription info
export interface UserSchema {
  // Unique identifier (Firebase UID or auto-generated)
  id: string;
  
  // Authentication & Contact
  email: string;
  uid: string; // Firebase Authentication UID
  displayName?: string;
  
  // Subscription & Billing
  subscriptionTier: "free" | "premium" | "lifetime";
  subscriptionStatus: "active" | "canceled" | "expired" | "trial";
  subscriptionStartDate?: string; // ISO timestamp
  subscriptionEndDate?: string; // ISO timestamp
  
  // Gamification & Progress
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string; // ISO date string (YYYY-MM-DD)
  
  // User Preferences
  age?: number;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  reminderTime?: string; // Preferred daily reminder time
  emailNotifications: boolean;
  
  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// ============================================================
// PUZZLES COLLECTION
// ============================================================
// Stores daily puzzle configurations and historical puzzle data
export interface PuzzleSchema {
  // Unique identifier
  id: string;
  
  // Puzzle Configuration
  date: string; // ISO date string (YYYY-MM-DD)
  word: string; // The daily word (encrypted in production)
  wordList: string[]; // Array of valid words for this puzzle
  difficulty: "easy" | "medium" | "hard";
  category?: string; // Theme category (e.g., "wellness", "faith", "fitness")
  
  // Puzzle Metadata
  puzzleNumber: number; // Sequential puzzle number (e.g., 20392)
  maxAttempts: number; // Usually 6
  wordLength: number; // Usually 5
  
  // Analytics
  totalAttempts?: number; // Total guesses across all users
  solveRate?: number; // Percentage of users who solved it
  averageAttempts?: number; // Average attempts to solve
  
  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// ============================================================
// PUZZLE ATTEMPTS COLLECTION
// ============================================================
// Stores individual user puzzle attempts for tracking and analytics
export interface PuzzleAttemptSchema {
  // Unique identifier
  id: string;
  
  // References
  userId: string; // Foreign key to users.id
  puzzleId: string; // Foreign key to puzzles.id
  
  // Attempt Data
  date: string; // ISO date string (YYYY-MM-DD)
  word: string; // The word that was attempted (for historical reference)
  guesses: string[]; // Array of user's guesses
  solved: boolean; // Whether puzzle was solved
  attempts: number; // Number of attempts used
  
  // Scoring
  pointsEarned: number;
  bonusPoints?: number; // Extra points for speed, streak, etc.
  
  // Timing
  completedAt?: string; // ISO timestamp when completed
  timeToComplete?: number; // Seconds taken to complete
  
  // Metadata
  createdAt: string; // ISO timestamp
}

// ============================================================
// WORKOUT COMPLETIONS COLLECTION
// ============================================================
// Tracks user workout completions for unlock mechanics and progress
export interface WorkoutCompletionSchema {
  // Unique identifier
  id: string;
  
  // References
  userId: string; // Foreign key to users.id
  workoutId: string; // Foreign key to workouts.id
  
  // Completion Data
  date: string; // ISO date string (YYYY-MM-DD)
  completedAt: string; // ISO timestamp
  duration?: number; // Actual workout duration in seconds
  pointsEarned: number;
  
  // Metadata
  createdAt: string; // ISO timestamp
}

// ============================================================
// LEADERBOARD COLLECTION
// ============================================================
// Stores leaderboard rankings (can be computed or cached)
export interface LeaderboardSchema {
  // Unique identifier
  id: string;
  
  // User Info
  userId: string; // Foreign key to users.id
  displayName: string;
  
  // Rankings
  rank: number; // Global rank
  points: number; // Total points
  streak: number; // Current streak
  
  // Leaderboard Type
  scope: "global" | "friends" | "weekly" | "monthly";
  period?: string; // For time-based leaderboards (e.g., "2025-W05")
  
  // Metadata
  updatedAt: string; // ISO timestamp of last update
}

// ============================================================
// WORKOUTS COLLECTION
// ============================================================
// Catalog of available workouts (admin-managed content)
export interface WorkoutSchema {
  // Unique identifier
  id: string;
  
  // Workout Info
  title: string;
  description?: string;
  category: "seated" | "standing" | "balance" | "flexibility";
  difficulty: "low" | "medium" | "high";
  duration: number; // Duration in minutes
  
  // Media
  videoUrl: string; // YouTube URL or CDN URL
  thumbnailUrl?: string;
  
  // Metadata
  isActive: boolean; // Whether workout is available to users
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// ============================================================
// DAILY STATUS COLLECTION
// ============================================================
// Tracks daily completion status per user
export interface DailyStatusSchema {
  // Composite key: userId + date
  id: string;
  
  // References
  userId: string; // Foreign key to users.id
  date: string; // ISO date string (YYYY-MM-DD)
  
  // Completion Flags
  workoutCompleted: boolean;
  puzzleUnlocked: boolean; // Unlocked after workout
  puzzleSolved: boolean;
  
  // Daily Points
  totalPointsEarned: number;
  
  // Metadata
  updatedAt: string; // ISO timestamp
}

// ============================================================
// EXPORT NOTES
// ============================================================
// When integrating with Firebase Firestore:
// 1. Replace interfaces with Firestore data converters
// 2. Add Firestore-specific types (DocumentReference, Timestamp)
// 3. Set up collection references and security rules
// 4. Implement data validation with Zod schemas
//
// When integrating with PostgreSQL:
// 1. Convert interfaces to Drizzle ORM table schemas
// 2. Set up foreign key relationships
// 3. Add indexes for performance (userId, date, etc.)
// 4. Create migration scripts using drizzle-kit
// ============================================================
