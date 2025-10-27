import { useState, useEffect } from "react";
import { DailyStatus } from "@shared/schema";
import { getTodayStatus, updateTodayStatus } from "@/lib/localStorage";

export function useDailyStatus() {
  const [status, setStatus] = useState<DailyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = () => {
      const todayStatus = getTodayStatus();
      
      if (!todayStatus) {
        const newStatus: DailyStatus = {
          date: new Date().toISOString().split('T')[0],
          workoutCompleted: false,
          puzzleUnlocked: false,
          puzzleSolved: false,
          totalPointsEarned: 0,
        };
        updateTodayStatus(newStatus);
        setStatus(newStatus);
      } else {
        setStatus(todayStatus);
      }
      
      setLoading(false);
    };

    loadStatus();
  }, []);

  const updateStatus = (updates: Partial<DailyStatus>) => {
    if (!status) return;

    const updatedStatus = {
      ...status,
      ...updates,
    };

    updateTodayStatus(updatedStatus);
    setStatus(updatedStatus);
  };

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
