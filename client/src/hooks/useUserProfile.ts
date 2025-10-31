import { useState, useEffect } from "react";
import { UserProfile } from "@shared/schema";
import { 
  getUserProfile, 
  saveUserProfile, 
  initializeUserProfile,
  calculateStreak 
} from "@/lib/localStorage";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let userProfile: UserProfile | null = null;
        let loadedFromFirestore = false;

        if (isFirebaseReady() && isAuthenticated && user) {
          const firestoreUser = await userOperations.getUser(user.uid);
          
          if (firestoreUser) {
            userProfile = {
              id: firestoreUser.uid,
              name: firestoreUser.displayName || firestoreUser.email || "User",
              totalPoints: firestoreUser.totalPoints || 0,
              currentStreak: firestoreUser.currentStreak || 0,
              lastActiveDate: firestoreUser.lastActiveDate,
            };
            loadedFromFirestore = true;
          }
        }

        if (!userProfile) {
          userProfile = getUserProfile();
          
          if (!userProfile) {
            userProfile = initializeUserProfile(
              user?.displayName || (user as any)?.email?.split('@')[0] || "You"
            );
          }
        }

        if (!loadedFromFirestore) {
          const currentStreak = calculateStreak();
          if (userProfile.currentStreak !== currentStreak) {
            userProfile = {
              ...userProfile,
              currentStreak,
            };
            
            saveUserProfile(userProfile);
            
            if (isFirebaseReady() && isAuthenticated && user) {
              await userOperations.updateProgress(
                user.uid,
                userProfile.totalPoints,
                currentStreak,
                new Date().toISOString().split('T')[0]
              );
            }
          }
        } else {
          saveUserProfile(userProfile);
        }

        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading user profile:", error);
        
        let userProfile = getUserProfile();
        if (!userProfile) {
          userProfile = initializeUserProfile();
        }
        setProfile(userProfile);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, isAuthenticated]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      ...updates,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);

    if (isFirebaseReady() && isAuthenticated && user) {
      try {
        await userOperations.setUser(user.uid, {
          uid: user.uid,
          email: (user as any).email || "",
          displayName: updatedProfile.name,
          totalPoints: updatedProfile.totalPoints,
          currentStreak: updatedProfile.currentStreak,
          lastActiveDate: updatedProfile.lastActiveDate,
          emailNotifications: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error syncing profile to Firestore:", error);
      }
    }
  };

  // ============================================================
  // ADD POINTS (convenience method)
  // ============================================================

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
