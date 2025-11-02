import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

/**
 * Hook to check if the current user has premium status
 * Centralizes premium checking logic across the app
 * 
 * @returns {isPremium: boolean, isLoading: boolean}
 */
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isFirebaseReady() || !user) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        // TEMPORARY: Premium gating disabled for testing
        setIsPremium(true);
        
        /* PRODUCTION CODE - Uncomment to re-enable premium gating
        const firestoreUser = await userOperations.getUser(user.uid);
        setIsPremium(firestoreUser?.premium === true);
        */
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  return { isPremium, isLoading };
}
