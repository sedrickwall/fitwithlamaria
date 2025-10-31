// ============================================================
// FIRESTORE COLLECTIONS & HELPERS
// ============================================================
// This file defines Firestore collection references and helper functions
// for managing user data, workouts, puzzles, and community features.
//
// Collections:
// - users: User profiles, points, streaks, preferences
// - workouts: Workout library (videos, categories, difficulty)
// - workout_completions: User workout completion history
// - puzzles: Daily puzzle configurations
// - puzzle_attempts: User puzzle attempt history
// - daily_status: Daily completion tracking per user
// - community: Leaderboard and social features
// ============================================================

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  type Firestore,
  type CollectionReference,
  type DocumentData
} from "firebase/firestore";
import { db, isFirebaseReady } from "./firebase";

// ============================================================
// COLLECTION REFERENCES
// ============================================================

// Helper to safely get collection reference
const getCollection = (collectionName: string): CollectionReference<DocumentData> | null => {
  if (!db) return null;
  return collection(db, collectionName);
};

export const collections = {
  users: () => getCollection("users"),
  workouts: () => getCollection("workouts"),
  workoutCompletions: () => getCollection("workout_completions"),
  puzzles: () => getCollection("puzzles"),
  puzzleAttempts: () => getCollection("puzzle_attempts"),
  dailyStatus: () => getCollection("daily_status"),
  community: () => getCollection("community")
};

// ============================================================
// USER OPERATIONS
// ============================================================

export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  age?: number;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  reminderTime?: string;
  emailNotifications: boolean;
  createdAt: any;
  updatedAt: any;
}

export const userOperations = {
  // Create or update user profile
  async setUser(uid: string, userData: Partial<FirestoreUser>): Promise<void> {
    if (!db || !collections.users()) return;
    
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...userData,
      uid,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Get user profile
  async getUser(uid: string): Promise<FirestoreUser | null> {
    if (!db || !collections.users()) return null;
    
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as FirestoreUser;
    }
    return null;
  },

  // Update user points and streak
  async updateProgress(uid: string, points: number, streak: number, lastActiveDate: string): Promise<void> {
    if (!db || !collections.users()) return;
    
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      totalPoints: points,
      currentStreak: streak,
      lastActiveDate,
      updatedAt: serverTimestamp()
    });
  }
};

// ============================================================
// WORKOUT OPERATIONS
// ============================================================

export interface FirestoreWorkoutCompletion {
  userId: string;
  workoutId: string;
  date: string;
  completedAt: any;
  duration?: number;
  pointsEarned: number;
}

export const workoutOperations = {
  // Record workout completion
  async addCompletion(completion: FirestoreWorkoutCompletion): Promise<void> {
    if (!db || !collections.workoutCompletions()) return;
    
    await addDoc(collection(db, "workout_completions"), {
      ...completion,
      completedAt: serverTimestamp()
    });
  },

  // Get user's workout history
  async getCompletions(userId: string, days: number = 30): Promise<FirestoreWorkoutCompletion[]> {
    if (!db || !collections.workoutCompletions()) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
      collection(db, "workout_completions"),
      where("userId", "==", userId),
      where("date", ">=", cutoffDate.toISOString().split('T')[0]),
      orderBy("date", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FirestoreWorkoutCompletion);
  }
};

// ============================================================
// PUZZLE OPERATIONS
// ============================================================

export interface FirestorePuzzleAttempt {
  userId: string;
  puzzleId: string;
  date: string;
  word: string;
  guesses: string[];
  solved: boolean;
  attempts: number;
  pointsEarned: number;
  completedAt?: any;
}

export const puzzleOperations = {
  // Record puzzle attempt
  async addAttempt(attempt: FirestorePuzzleAttempt): Promise<void> {
    if (!db || !collections.puzzleAttempts()) return;
    
    await addDoc(collection(db, "puzzle_attempts"), {
      ...attempt,
      completedAt: serverTimestamp()
    });
  },

  // Get user's puzzle history
  async getAttempts(userId: string, days: number = 30): Promise<FirestorePuzzleAttempt[]> {
    if (!db || !collections.puzzleAttempts()) return [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
      collection(db, "puzzle_attempts"),
      where("userId", "==", userId),
      where("date", ">=", cutoffDate.toISOString().split('T')[0]),
      orderBy("date", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FirestorePuzzleAttempt);
  },

  // Get today's puzzle attempt
  async getTodayAttempt(userId: string, date: string): Promise<FirestorePuzzleAttempt | null> {
    if (!db || !collections.puzzleAttempts()) return null;
    
    const q = query(
      collection(db, "puzzle_attempts"),
      where("userId", "==", userId),
      where("date", "==", date),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    return snapshot.docs[0].data() as FirestorePuzzleAttempt;
  }
};

// ============================================================
// DAILY STATUS OPERATIONS
// ============================================================

export interface FirestoreDailyStatus {
  userId: string;
  date: string;
  
  // Multiple workout/puzzle system
  workoutCompletionCount?: number;
  completedPuzzleIndices?: number[];
  
  // Backward compatibility fields (deprecated)
  workoutCompleted: boolean;
  puzzleUnlocked: boolean;
  wordleSolved?: boolean;
  wordSearchSolved?: boolean;
  puzzleSolved: boolean;
  
  totalPointsEarned: number;
  updatedAt: any;
}

export const dailyStatusOperations = {
  // Update daily status
  async setStatus(userId: string, date: string, status: Partial<FirestoreDailyStatus>): Promise<void> {
    if (!db || !collections.dailyStatus()) return;
    
    const statusId = `${userId}_${date}`;
    const statusRef = doc(db, "daily_status", statusId);
    
    await setDoc(statusRef, {
      userId,
      date,
      ...status,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Get daily status
  async getStatus(userId: string, date: string): Promise<FirestoreDailyStatus | null> {
    if (!db || !collections.dailyStatus()) return null;
    
    const statusId = `${userId}_${date}`;
    const statusRef = doc(db, "daily_status", statusId);
    const statusSnap = await getDoc(statusRef);
    
    if (statusSnap.exists()) {
      return statusSnap.data() as FirestoreDailyStatus;
    }
    return null;
  }
};

// ============================================================
// COMMUNITY / LEADERBOARD OPERATIONS
// ============================================================

export interface FirestoreLeaderboardEntry {
  userId: string;
  displayName: string;
  totalPoints: number;
  currentStreak: number;
  rank?: number;
}

export const communityOperations = {
  // Get top users for leaderboard
  async getLeaderboard(limitCount: number = 10): Promise<FirestoreLeaderboardEntry[]> {
    if (!db || !collections.users()) return [];
    
    const q = query(
      collection(db, "users"),
      orderBy("totalPoints", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        userId: data.uid,
        displayName: data.displayName || "Anonymous",
        totalPoints: data.totalPoints || 0,
        currentStreak: data.currentStreak || 0,
        rank: index + 1
      } as FirestoreLeaderboardEntry;
    });
  }
};

// ============================================================
// EXPORT ALL
// ============================================================

export {
  isFirebaseReady
};
