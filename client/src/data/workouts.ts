import { Workout } from "@shared/schema";
import lowImpactCardioThumb from "@assets/Screenshot 2025-11-05 at 8.20.38 PM_1762395981557.png";
import balanceFlexibilityThumb from "@assets/Screenshot 2025-11-05 at 8.24.32 PM_1762396598501.png";
import seatedCardioThumb from "@assets/Screenshot 2025-11-05 at 8.22.33 PM_1762396737911.png";
import standingBalanceThumb from "@assets/Screenshot 2025-11-07 at 2.36.49 PM_1762548079929.png";
import seatedStandingThumb from "@assets/Screenshot 2025-11-09 at 7.02.38 PM_1762736573565.png";

const ALL_WORKOUTS: Workout[] = [
  {
    id: "1",
    title: "Gentle Seated Stretches",
    category: "seated",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/4pKly2JojMw",
    visible: false,  // ← Add this to hide it
  },
  {
    id: "2",
    title: "Seated & Standing",
    category: "seated",
    duration: 15,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/lILzVK_jiC8?si=_Oz_KidAa8bw0jDq",
    thumbnail: seatedStandingThumb,
  },
  {
    id: "3",
    title: "Seated Cardio Workout",
    category: "seated",
    duration: 15,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/HC_45pfZy-w?si=_M9-j56XTPOue7j9",
    thumbnail: seatedCardioThumb,
  },
  {
    id: "4",
    title: "Standing Balance & Mobility",
    category: "standing",
    duration: 4,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/e898TV_t77g?si=fYi5Y_yxT8ms8Ley",
    thumbnail: standingBalanceThumb,
  },
  {
    id: "5",
    title: "Low Impact Cardio",
    category: "standing",
    duration: 10,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/fywl19sc35Y?si=2Yl07mqNsCoGWqGY",
    thumbnail: lowImpactCardioThumb,
  },
  {
    id: "6",
    title: "Full Body Standing Workout",
    category: "standing",
    duration: 20,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/dtGAcoOwkfI",
    visible: false,  // ← Add this to hide it
  },
  {
    id: "7",
    title: "Simple Balance Exercises",
    category: "balance",
    duration: 5,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/1ogJBXcDAbA",
    visible: false,  // ← Add this to hide it
  },
  {
    id: "8",
    title: "Low Impact Squats",
    category: "balance",
    duration: 5,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/8FvlCbqUOWE?si=iUof2MThK2EN2I2U",
    thumbnail: balanceFlexibilityThumb,
  },
  {
    id: "9",
    title: "Gentle Stretching Routine",
    category: "balance",
    duration: 15,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/gZoMmI_dNmk",
    visible: false,  // ← Add this to hide it
  },
  {
    id: "10",
    title: "Full Body Stretch",
    category: "balance",
    duration: 20,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/L_xrDAtykMI",
    visible: false,  // ← Add this to hide it
  },
];

export const SAMPLE_WORKOUTS = ALL_WORKOUTS.filter(w => w.visible !== false);

export function getWorkoutById(id: string): Workout | undefined {
  return ALL_WORKOUTS.find(w => w.id === id);
}
