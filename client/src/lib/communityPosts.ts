import { communityOperations, userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export async function createWorkoutPost(userId: string, userName: string, workoutTitle: string, category: string): Promise<void> {
  if (!isFirebaseReady()) return;
  
  try {
    const firestoreUser = await userOperations.getUser(userId);
    if (!firestoreUser?.premium) return;
    
    const categoryEmojis: Record<string, string> = {
      seated: "🪑",
      standing: "🧍",
      balance: "⚖️"
    };
    const emoji = categoryEmojis[category] || "💪";
    
    await communityOperations.createPost({
      userId,
      userName,
      text: `${emoji} ${userName} completed ${workoutTitle}!`,
      type: "activity"
    });
  } catch (error) {
    console.error("Error creating workout community post:", error);
  }
}

export async function createPuzzlePost(userId: string, userName: string, puzzleType: "wordle" | "wordsearch", attempts: number, solved: boolean): Promise<void> {
  if (!isFirebaseReady()) return;
  
  try {
    const firestoreUser = await userOperations.getUser(userId);
    if (!firestoreUser?.premium) return;
    
    if (!solved) return; // Only create posts for successful completions
    
    const puzzleEmojis = {
      wordle: "🔤",
      wordsearch: "🔎"
    };
    const emoji = puzzleEmojis[puzzleType];
    
    const puzzleName = puzzleType === "wordle" ? "word puzzle" : "word search";
    const text = `${emoji} ${userName} solved today's ${puzzleName} in ${attempts} ${attempts === 1 ? 'try' : 'tries'}!`;
    
    await communityOperations.createPost({
      userId,
      userName,
      text,
      type: "activity"
    });
  } catch (error) {
    console.error("Error creating puzzle community post:", error);
  }
}
