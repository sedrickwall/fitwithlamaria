import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth, isFirebaseReady } from "@/services/firebase";
import { userOperations } from "@/services/firestore";

const MOCK_USER_KEY = "fitword_mock_user";

interface MockUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<User | MockUser>;
  signIn: (email: string, password: string) => Promise<User | MockUser>;
  signInWithGoogle: () => Promise<User | MockUser>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseReady() || !auth) {
      const stored = localStorage.getItem(MOCK_USER_KEY);
      const mockUser = stored ? JSON.parse(stored) : {
        uid: "mock_dev_user",
        email: "demo@fitword.com",
        displayName: "Demo User"
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          const existingUser = await userOperations.getUser(firebaseUser.uid);
          
          if (!existingUser) {
            await userOperations.setUser(firebaseUser.uid, {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || undefined,
              totalPoints: 0,
              currentStreak: 0,
              longestStreak: 0,
              emailNotifications: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error("Error syncing user to Firestore:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    setError(null);
    if (!isFirebaseReady() || !auth) {
      const mockUser: MockUser = { uid: `mock_${Date.now()}`, email, displayName };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    if (!isFirebaseReady() || !auth) {
      const mockUser: MockUser = { uid: `mock_${Date.now()}`, email };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (!isFirebaseReady() || !auth) {
      const mockUser: MockUser = { uid: `mock_google_${Date.now()}`, email: "demo@fitword.com", displayName: "Demo User" };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    if (!isFirebaseReady() || !auth) {
      localStorage.removeItem(MOCK_USER_KEY);
      setUser(null);
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
        isFirebaseEnabled: isFirebaseReady()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
