// ============================================================
// FIREBASE INITIALIZATION
// ============================================================
// This file initializes Firebase Auth and Firestore for the FitWord app.
// Configuration uses environment variables with fallback placeholders.
//
// Setup Instructions:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Authentication (Email/Password and Google Sign-In)
// 3. Enable Firestore Database
// 4. Get your Firebase config from Project Settings > General
// 5. Add the following secrets to your Replit project:
//    - VITE_FIREBASE_API_KEY
//    - VITE_FIREBASE_AUTH_DOMAIN
//    - VITE_FIREBASE_PROJECT_ID
//    - VITE_FIREBASE_STORAGE_BUCKET
//    - VITE_FIREBASE_MESSAGING_SENDER_ID
//    - VITE_FIREBASE_APP_ID
// ============================================================

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Uses environment variables with placeholder fallbacks for development
// App will work with localStorage if Firebase credentials not provided
// ============================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:placeholder"
};

// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Check if Firebase config is properly set (not using placeholders)
const isFirebaseConfigured = !firebaseConfig.apiKey.includes("placeholder");

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase initialized successfully");
  } else {
    console.log("⚠️ Firebase not configured - using localStorage fallback");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  console.log("⚠️ Falling back to localStorage");
}

// ============================================================
// EXPORTS
// ============================================================

export { app, auth, db, isFirebaseConfigured };

// Helper to check if Firebase is ready to use
export const isFirebaseReady = (): boolean => {
  return isFirebaseConfigured && app !== null && auth !== null && db !== null;
};

// ============================================================
// AUTHENTICATION UTILITIES
// ============================================================

export const provider = new GoogleAuthProvider();

export const firebaseUtils = {
  // Google Sign-In
  signInWithGoogle: () => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return signInWithPopup(auth, provider);
  },
  
  // Email/Password Sign-Up
  signUpWithEmail: (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
  },
  
  // Email/Password Sign-In
  signInWithEmail: (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  },
  
  // Sign Out
  signOut: () => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return firebaseSignOut(auth);
  },
  
  // Auth State Listener
  onAuthStateChanged,
};
