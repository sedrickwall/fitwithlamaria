import { Workout } from "@shared/schema";

const ALL_WORKOUTS: Workout[] = [
  {
    id: "1",
    title: "Gentle Seated Stretches",
    category: "seated",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/4pKly2JojMw",
  },
  {
    id: "2",
    title: "Chair Yoga Flow",
    category: "seated",
    duration: 15,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/KLGkCOMMbSs",
  },
  {
    id: "3",
    title: "Seated Cardio Workout",
    category: "seated",
    duration: 15,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/HC_45pfZy-w?si=_M9-j56XTPOue7j9",
  },
  {
    id: "4",
    title: "Standing Balance & Strength",
    category: "standing",
    duration: 10,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/fywl19sc35Y?si=2Yl07mqNsCoGWqGY",
  },
  {
    id: "5",
    title: "Low Impact Cardio",
    category: "standing",
    duration: 10,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/fywl19sc35Y?si=2Yl07mqNsCoGWqGY",
  },
  {
    id: "6",
    title: "Full Body Standing Workout",
    category: "standing",
    duration: 20,
    difficulty: "medium",
    videoUrl: "https://www.youtube.com/embed/dtGAcoOwkfI",
  },
  {
    id: "7",
    title: "Simple Balance Exercises",
    category: "balance",
    duration: 5,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/1ogJBXcDAbA",
  },
  {
    id: "8",
    title: "Balance & Flexibility",
    category: "balance",
    duration: 5,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/8FvlCbqUOWE?si=iUof2MThK2EN2I2U",
  },
  {
    id: "9",
    title: "Gentle Stretching Routine",
    category: "balance",
    duration: 15,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/gZoMmI_dNmk",
  },
  {
    id: "10",
    title: "Full Body Stretch",
    category: "balance",
    duration: 20,
    difficulty: "low",
    videoUrl: "https://www.youtube.com/embed/L_xrDAtykMI",
  },
];

export const SAMPLE_WORKOUTS = ALL_WORKOUTS.filter(w => w.visible !== false);

export function getWorkoutById(id: string): Workout | undefined {
  return ALL_WORKOUTS.find(w => w.id === id);
}
