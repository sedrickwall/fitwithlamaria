export const POINTS = {
  WORKOUT_COMPLETE: 100,
  PUZZLE_SOLVED: 50,
  PUZZLE_BONUS_4_OR_LESS: 25,
  STREAK_DAILY_BONUS: 10,
} as const;

export function calculateWorkoutPoints(): number {
  return POINTS.WORKOUT_COMPLETE;
}

export function calculatePuzzlePoints(attempts: number, solved: boolean): number {
  if (!solved) return 0;
  
  let points = POINTS.PUZZLE_SOLVED;
  
  if (attempts <= 4) {
    points += POINTS.PUZZLE_BONUS_4_OR_LESS;
  }
  
  return points;
}

export function calculateStreakBonus(streak: number): number {
  return streak * POINTS.STREAK_DAILY_BONUS;
}

export function calculateTotalDailyPoints(
  workoutCompleted: boolean,
  puzzleSolved: boolean,
  puzzleAttempts: number,
  currentStreak: number
): number {
  let total = 0;
  
  if (workoutCompleted) {
    total += calculateWorkoutPoints();
  }
  
  if (puzzleSolved) {
    total += calculatePuzzlePoints(puzzleAttempts, true);
  }
  
  if (workoutCompleted && puzzleSolved && currentStreak > 0) {
    total += POINTS.STREAK_DAILY_BONUS;
  }
  
  return total;
}
