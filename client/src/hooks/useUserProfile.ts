import { useState, useEffect } from "react";
import { UserProfile } from "@shared/schema";
import { 
  getUserProfile, 
  saveUserProfile, 
  initializeUserProfile,
  calculateStreak 
} from "@/lib/localStorage";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      let userProfile = getUserProfile();
      
      if (!userProfile) {
        userProfile = initializeUserProfile();
      }

      const currentStreak = calculateStreak();
      if (userProfile.currentStreak !== currentStreak) {
        userProfile = {
          ...userProfile,
          currentStreak,
        };
        saveUserProfile(userProfile);
      }

      setProfile(userProfile);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      ...updates,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const addPoints = (points: number) => {
    if (!profile) return;

    updateProfile({
      totalPoints: profile.totalPoints + points,
    });
  };

  return {
    profile,
    loading,
    updateProfile,
    addPoints,
  };
}
