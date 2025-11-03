import { Workout } from "@shared/schema";

export const SAMPLE_WORKOUTS: Workout[] = [
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
    videoUrl: "https://www.dropbox.com/scl/fi/04p9z9koxztoizs1zhn2c/Seated-Strength-Day-1-Final.mp4?rlkey=3g7fympl5qt3d0669i490s283&st=5epldprt?raw=1",
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
    videoUrl: "https://www.dropbox.com/scl/fi/xoojn6qebkaayvqtmbqzi/10-Minute-Low-Impact-Cardio-for-Beginners-Seniors-Standing-No-Jumping-Fitness-Challenge.mp4?rlkey=c98ymkmy8d9hx4wgd5o8fmxss&st=lysww5cb?raw=1",
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
    videoUrl: "https://www.dropbox.com/scl/fi/kigvno487io2dq4esae2q/Sqaut-Challenge-final.mp4?rlkey=6v7zv0l7pgxx9lczjyba0e0ib&st=gr8dkofb?raw=1",
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

export function getWorkoutById(id: string): Workout | undefined {
  return SAMPLE_WORKOUTS.find(w => w.id === id);
}
