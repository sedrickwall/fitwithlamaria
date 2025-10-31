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
            todayStatus = {
              date: firestoreStatus.date,
              workoutCompleted: firestoreStatus.workoutCompleted,
              puzzleUnlocked: firestoreStatus.puzzleUnlocked,
              puzzleSolved: firestoreStatus.puzzleSolved,
              totalPointsEarned: firestoreStatus.totalPointsEarned,
            };
          }
        }

        if (!todayStatus) {
          todayStatus = getTodayStatus();
        }

        if (!todayStatus) {
          const newStatus: DailyStatus = {
            date: today,
            workoutCompleted: false,
            puzzleUnlocked: false,
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
  };
}
