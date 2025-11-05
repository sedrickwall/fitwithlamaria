import { useState, useEffect } from "react";

interface OfferState {
  shouldShowOffer: boolean;
  expiresAt: number;
  hasSeenOffer: boolean;
}

const STORAGE_KEYS = {
  FIRST_WORKOUT: "fitword_first_workout_completed",
  FIRST_PUZZLE: "fitword_first_puzzle_completed",
  OFFER_SHOWN: "fitword_offer_modal_shown",
  OFFER_TIMESTAMP: "fitword_offer_modal_timestamp",
  OFFER_DISMISSED: "fitword_offer_modal_dismissed",
};

const OFFER_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useFirstCompletionOffer() {
  const [offerState, setOfferState] = useState<OfferState>({
    shouldShowOffer: false,
    expiresAt: 0,
    hasSeenOffer: false,
  });

  useEffect(() => {
    const offerShown = localStorage.getItem(STORAGE_KEYS.OFFER_SHOWN);
    const offerDismissed = localStorage.getItem(STORAGE_KEYS.OFFER_DISMISSED);
    const offerTimestamp = localStorage.getItem(STORAGE_KEYS.OFFER_TIMESTAMP);

    if (offerShown && offerTimestamp) {
      const expiresAt = parseInt(offerTimestamp) + OFFER_DURATION_MS;
      const now = Date.now();

      // If offer is still valid and not dismissed, we can show it again
      if (now < expiresAt && offerDismissed !== "true") {
        setOfferState({
          shouldShowOffer: false, // Don't auto-show, only on completion
          expiresAt,
          hasSeenOffer: true,
        });
      }
    }
  }, []);

  const checkAndTriggerOffer = (type: "workout" | "puzzle"): boolean => {
    const storageKey = type === "workout" ? STORAGE_KEYS.FIRST_WORKOUT : STORAGE_KEYS.FIRST_PUZZLE;
    const hasCompleted = localStorage.getItem(storageKey);

    // If this is their first completion of this type
    if (!hasCompleted) {
      // Mark as completed
      localStorage.setItem(storageKey, "true");

      // Check if we should show the offer
      const offerShown = localStorage.getItem(STORAGE_KEYS.OFFER_SHOWN);
      const offerDismissed = localStorage.getItem(STORAGE_KEYS.OFFER_DISMISSED);
      
      // Show offer if it hasn't been shown before, or if it was shown but not dismissed and still valid
      if (!offerShown) {
        const now = Date.now();
        const expiresAt = now + OFFER_DURATION_MS;

        localStorage.setItem(STORAGE_KEYS.OFFER_SHOWN, "true");
        localStorage.setItem(STORAGE_KEYS.OFFER_TIMESTAMP, now.toString());

        setOfferState({
          shouldShowOffer: true,
          expiresAt,
          hasSeenOffer: true,
        });

        return true;
      } else if (offerDismissed !== "true") {
        // Offer was shown before but not dismissed, check if still valid
        const offerTimestamp = localStorage.getItem(STORAGE_KEYS.OFFER_TIMESTAMP);
        if (offerTimestamp) {
          const expiresAt = parseInt(offerTimestamp) + OFFER_DURATION_MS;
          const now = Date.now();

          if (now < expiresAt) {
            setOfferState({
              shouldShowOffer: true,
              expiresAt,
              hasSeenOffer: true,
            });
            return true;
          }
        }
      }
    }

    return false;
  };

  const dismissOffer = () => {
    localStorage.setItem(STORAGE_KEYS.OFFER_DISMISSED, "true");
    setOfferState(prev => ({
      ...prev,
      shouldShowOffer: false,
    }));
  };

  const resetOffer = () => {
    setOfferState({
      shouldShowOffer: false,
      expiresAt: 0,
      hasSeenOffer: false,
    });
  };

  return {
    shouldShowOffer: offerState.shouldShowOffer,
    expiresAt: offerState.expiresAt,
    hasSeenOffer: offerState.hasSeenOffer,
    checkAndTriggerOffer,
    dismissOffer,
    resetOffer,
  };
}
