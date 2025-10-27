import { 
  UserProfile, 
  WorkoutCompletion, 
  PuzzleAttempt, 
  DailyStatus,
  LeaderboardEntry 
} from "@shared/schema";

const STORAGE_KEYS = {
  USER_PROFILE: "fitword_user_profile",
  WORKOUT_COMPLETIONS: "fitword_workout_completions",
  PUZZLE_ATTEMPTS: "fitword_puzzle_attempts",
  DAILY_STATUSES: "fitword_daily_statuses",
} as const;

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

export function setInStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

export function getUserProfile(): UserProfile | null {
  return getFromStorage<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
}

export function saveUserProfile(profile: UserProfile): void {
  setInStorage(STORAGE_KEYS.USER_PROFILE, profile);
}

export function initializeUserProfile(name: string = "You"): UserProfile {
  const existing = getUserProfile();
  if (existing) return existing;

  const newProfile: UserProfile = {
    id: `user_${Date.now()}`,
    name,
    totalPoints: 0,
    currentStreak: 0,
    lastActiveDate: undefined,
  };

  saveUserProfile(newProfile);
  return newProfile;
}

export function getWorkoutCompletions(): WorkoutCompletion[] {
  return getFromStorage<WorkoutCompletion[]>(STORAGE_KEYS.WORKOUT_COMPLETIONS, []);
}

export function saveWorkoutCompletion(completion: WorkoutCompletion): void {
  const completions = getWorkoutCompletions();
  
  const today = completion.date;
  const alreadyCompleted = completions.some(
    c => c.date === today && c.workoutId === completion.workoutId
  );
  
  if (!alreadyCompleted) {
    completions.push(completion);
    setInStorage(STORAGE_KEYS.WORKOUT_COMPLETIONS, completions);
  }
}

export function getPuzzleAttempts(): PuzzleAttempt[] {
  return getFromStorage<PuzzleAttempt[]>(STORAGE_KEYS.PUZZLE_ATTEMPTS, []);
}

export function savePuzzleAttempt(attempt: PuzzleAttempt): void {
  const attempts = getPuzzleAttempts();
  attempts.push(attempt);
  setInStorage(STORAGE_KEYS.PUZZLE_ATTEMPTS, attempts);
}

export function getDailyStatuses(): DailyStatus[] {
  return getFromStorage<DailyStatus[]>(STORAGE_KEYS.DAILY_STATUSES, []);
}

export function getTodayStatus(): DailyStatus | null {
  const today = new Date().toISOString().split('T')[0];
  const statuses = getDailyStatuses();
  return statuses.find(s => s.date === today) || null;
}

export function updateTodayStatus(updates: Partial<DailyStatus>): void {
  const today = new Date().toISOString().split('T')[0];
  const statuses = getDailyStatuses();
  const existingIndex = statuses.findIndex(s => s.date === today);

  if (existingIndex >= 0) {
    statuses[existingIndex] = { ...statuses[existingIndex], ...updates };
  } else {
    statuses.push({
      date: today,
      workoutCompleted: false,
      puzzleUnlocked: false,
      puzzleSolved: false,
      totalPointsEarned: 0,
      ...updates,
    });
  }

  setInStorage(STORAGE_KEYS.DAILY_STATUSES, statuses);
}

export function getCompletedDates(): string[] {
  const statuses = getDailyStatuses();
  return statuses
    .filter(s => s.workoutCompleted && s.puzzleSolved)
    .map(s => s.date);
}

export function calculateStreak(): number {
  const statuses = getDailyStatuses()
    .filter(s => s.workoutCompleted && s.puzzleSolved)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (statuses.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < statuses.length; i++) {
    const statusDate = new Date(statuses[i].date);
    statusDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (statusDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
