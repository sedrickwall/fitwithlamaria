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
              workoutCompleted: firestoreStatus.workoutCompleted,
              puzzleUnlocked: firestoreStatus.puzzleUnlocked,
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
  // CONVENIENCE METHODS
  // ============================================================

  const completeWorkout = () => {
    updateStatus({ 
      workoutCompleted: true, 
      puzzleUnlocked: true 
    });
  };

  const solveWordle = (pointsEarned: number) => {
    updateStatus({ 
      wordleSolved: true,
      puzzleSolved: true,
      totalPointsEarned: (status?.totalPointsEarned || 0) + pointsEarned,
    });
  };

  const solveWordSearch = (pointsEarned: number) => {
    updateStatus({ 
      wordSearchSolved: true,
      puzzleSolved: true,
      totalPointsEarned: (status?.totalPointsEarned || 0) + pointsEarned,
    });
  };

  // Deprecated: kept for backward compatibility
  const solvePuzzle = (pointsEarned: number) => {
    updateStatus({ 
      puzzleSolved: true,
      totalPointsEarned: (status?.totalPointsEarned || 0) + pointsEarned,
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
  };
}
