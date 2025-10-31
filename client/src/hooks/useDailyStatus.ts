import { useState, useEffect } from "react";
import { DailyStatus } from "@shared/schema";
import { getTodayStatus, updateTodayStatus } from "@/lib/localStorage";
import { useAuth } from "@/contexts/AuthContext";
import { dailyStatusOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export function useDailyStatus() {
  const [status, setStatus] = useState<DailyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        let todayStatus: DailyStatus | null = null;

        if (isFirebaseReady() && isAuthenticated && user) {
          const firestoreStatus = await dailyStatusOperations.getStatus(user.uid, today);
          
          if (firestoreStatus) {
            // Backward compatibility: migrate legacy puzzleSolved flag
            let wordleSolved = firestoreStatus.wordleSolved || false;
            let wordSearchSolved = firestoreStatus.wordSearchSolved || false;
            
            // If puzzleSolved is true but no specific puzzle type is marked,
            // determine which type it was based on the day
            if (firestoreStatus.puzzleSolved && !wordleSolved && !wordSearchSolved) {
              const statusDate = new Date(firestoreStatus.date);
              statusDate.setHours(0, 0, 0, 0);
              const daysSinceEpoch = Math.floor(statusDate.getTime() / (1000 * 60 * 60 * 24));
              
              // Use same alternation logic: even days = wordle, odd days = word search
              if (daysSinceEpoch % 2 === 0) {
                wordleSolved = true;
              } else {
                wordSearchSolved = true;
              }
            }
            
            todayStatus = {
              date: firestoreStatus.date,
              workoutCompletionCount: firestoreStatus.workoutCompletionCount || 0,
              completedPuzzleIndices: firestoreStatus.completedPuzzleIndices || [],
              workoutCompleted: firestoreStatus.workoutCompleted || false,
              puzzleUnlocked: firestoreStatus.puzzleUnlocked || false,
              wordleSolved,
              wordSearchSolved,
              puzzleSolved: firestoreStatus.puzzleSolved || wordleSolved || wordSearchSolved,
              totalPointsEarned: firestoreStatus.totalPointsEarned,
            };
          }
        }

        if (!todayStatus) {
          todayStatus = getTodayStatus();
          
          // Also migrate legacy localStorage records
          if (todayStatus && todayStatus.puzzleSolved && !todayStatus.wordleSolved && !todayStatus.wordSearchSolved) {
            const statusDate = new Date(todayStatus.date);
            statusDate.setHours(0, 0, 0, 0);
            const daysSinceEpoch = Math.floor(statusDate.getTime() / (1000 * 60 * 60 * 24));
            
            // Use same alternation logic: even days = wordle, odd days = word search
            if (daysSinceEpoch % 2 === 0) {
              todayStatus.wordleSolved = true;
            } else {
              todayStatus.wordSearchSolved = true;
            }
            
            // Persist the migrated record back to localStorage
            updateTodayStatus(todayStatus);
          }
        }

        if (!todayStatus) {
          const newStatus: DailyStatus = {
            date: today,
            workoutCompletionCount: 0,
            completedPuzzleIndices: [],
            workoutCompleted: false,
            puzzleUnlocked: false,
            wordleSolved: false,
            wordSearchSolved: false,
            puzzleSolved: false,
            totalPointsEarned: 0,
          };
          
          updateTodayStatus(newStatus);
          
          if (isFirebaseReady() && isAuthenticated && user) {
            await dailyStatusOperations.setStatus(user.uid, today, newStatus);
          }
          
          todayStatus = newStatus;
        }

        setStatus(todayStatus);
      } catch (error) {
        console.error("Error loading daily status:", error);
        
        let todayStatus = getTodayStatus();
        if (!todayStatus) {
          todayStatus = {
            date: new Date().toISOString().split('T')[0],
            workoutCompletionCount: 0,
            completedPuzzleIndices: [],
            workoutCompleted: false,
            puzzleUnlocked: false,
            wordleSolved: false,
            wordSearchSolved: false,
            puzzleSolved: false,
            totalPointsEarned: 0,
          };
          updateTodayStatus(todayStatus);
        }
        setStatus(todayStatus);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [user, isAuthenticated]);

  const updateStatus = async (updates: Partial<DailyStatus>) => {
    if (!status) return;

    const updatedStatus = {
      ...status,
      ...updates,
    };

    updateTodayStatus(updatedStatus);
    setStatus(updatedStatus);

    if (isFirebaseReady() && isAuthenticated && user) {
      try {
        await dailyStatusOperations.setStatus(user.uid, status.date, updatedStatus);
      } catch (error) {
        console.error("Error syncing daily status to Firestore:", error);
      }
    }
  };

  // ============================================================
  // CONVENIENCE METHODS FOR MULTIPLE PUZZLE SYSTEM
  // ============================================================

  // Get the next available puzzle index (based on workout count)
  const getNextPuzzleIndex = (): number => {
    if (!status) return 0;
    // Next puzzle to unlock is based on workout completion count
    // If you've done 1 workout, puzzle 0 is available
    // If you've done 2 workouts, puzzle 1 is available, etc.
    const nextIndex = status.workoutCompletionCount;
    return nextIndex;
  };

  // Get the current puzzle index (the last unlocked one)
  const getCurrentPuzzleIndex = (): number => {
    if (!status) return 0;
    // Current available puzzle is workoutCompletionCount - 1
    // (since completing workout N unlocks puzzle N-1)
    return Math.max(0, status.workoutCompletionCount - 1);
  };

  // Check if a specific puzzle is completed
  const isPuzzleCompleted = (puzzleIndex: number): boolean => {
    if (!status) return false;
    return status.completedPuzzleIndices.includes(puzzleIndex);
  };

  // Check if puzzle is unlocked (at least one workout completed)
  const isPuzzleUnlocked = (): boolean => {
    if (!status) return false;
    return status.workoutCompletionCount > 0;
  };

  const completeWorkout = () => {
    if (!status) return;
    updateStatus({ 
      workoutCompletionCount: status.workoutCompletionCount + 1,
      workoutCompleted: true, // Backward compatibility
      puzzleUnlocked: true,    // Backward compatibility
    });
  };

  const solvePuzzle = (puzzleIndex: number, pointsEarned: number) => {
    if (!status) return;
    
    // Prevent duplicate completions
    if (status.completedPuzzleIndices.includes(puzzleIndex)) {
      return;
    }

    updateStatus({ 
      completedPuzzleIndices: [...status.completedPuzzleIndices, puzzleIndex],
      puzzleSolved: true, // Backward compatibility
      totalPointsEarned: status.totalPointsEarned + pointsEarned,
    });
  };

  const solveWordle = (puzzleIndex: number, pointsEarned: number) => {
    if (!status) return;
    
    // Prevent duplicate completions
    if (status.completedPuzzleIndices.includes(puzzleIndex)) {
      return;
    }

    updateStatus({ 
      completedPuzzleIndices: [...status.completedPuzzleIndices, puzzleIndex],
      wordleSolved: true,  // Backward compatibility
      puzzleSolved: true,  // Backward compatibility
      totalPointsEarned: status.totalPointsEarned + pointsEarned,
    });
  };

  const solveWordSearch = (puzzleIndex: number, pointsEarned: number) => {
    if (!status) return;
    
    // Prevent duplicate completions
    if (status.completedPuzzleIndices.includes(puzzleIndex)) {
      return;
    }

    updateStatus({ 
      completedPuzzleIndices: [...status.completedPuzzleIndices, puzzleIndex],
      wordSearchSolved: true, // Backward compatibility
      puzzleSolved: true,      // Backward compatibility
      totalPointsEarned: status.totalPointsEarned + pointsEarned,
    });
  };

  return {
    status,
    loading,
    updateStatus,
    completeWorkout,
    solvePuzzle,
    solveWordle,
    solveWordSearch,
    getNextPuzzleIndex,
    getCurrentPuzzleIndex,
    isPuzzleCompleted,
    isPuzzleUnlocked,
  };
}
