import confetti from "canvas-confetti";

/**
 * Triggers a subtle, calming confetti celebration
 * Uses pastel colors and gentle animations
 * Perfect for affirming senior users without overwhelming them
 */
export const triggerCelebrationConfetti = () => {
  // Subtle pastel confetti - calm and affirming, not flashy
  const colors = ['#FAD7A0', '#F9E79F', '#D6EAF8', '#E8DAEF', '#D5F4E6'];
  
  // First gentle burst from center
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.6 },
    colors: colors,
    ticks: 120,
    gravity: 0.8,
    scalar: 0.9,
    drift: 0,
  });
  
  // Second subtle drift from sides (delayed slightly)
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: colors,
      ticks: 100,
      gravity: 0.7,
      scalar: 0.8,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: colors,
      ticks: 100,
      gravity: 0.7,
      scalar: 0.8,
    });
  }, 250);
};

/**
 * Check if confetti should be shown today
 * Ensures confetti is only triggered once per day (either workout OR puzzle)
 */
export const shouldShowConfetti = (): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const lastConfettiDate = localStorage.getItem("lastConfettiDate");
  
  return lastConfettiDate !== today;
};

/**
 * Mark that confetti has been shown today
 */
export const markConfettiShown = () => {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem("lastConfettiDate", today);
};
