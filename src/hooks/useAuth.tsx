"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db } from "@/lib/firebase/config";
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,  
  OAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence,
  AuthProvider as FirebaseAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 1. MASTER LOGIN HANDLER
   * This is the single source of truth for all social logins.
   * Optimized for Chef Cary Neff's mobile-first audience.
   */
  const executeSocialLogin = async (provider: FirebaseAuthProvider): Promise<void> => {
    const isMobile = 
      typeof window !== "undefined" && 
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

    try {
      // Ensure session persistence before the jump
      await setPersistence(auth, browserLocalPersistence);

      if (isMobile) {
        // Redirect mode for messy hands in the kitchen (Mobile Safari/Chrome)
        await signInWithRedirect(auth, provider);
      } else {
        // Popup mode for desktop convenience
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      // Gracefully catch cancellation so the app doesn't crash during the demo
      if (
        error?.code === "auth/redirect-cancelled-by-user" || 
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        console.log("Chef, user cancelled login - returning to state.");
        return;
      }
      throw error;
    }
  };

  /**
   * 2. INITIALIZATION & REDIRECT HANDLING
   * Catches the user when they return from the Google/Apple redirect.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Redirect login successful for:", result.user.email);
        }
      } catch (error: any) {
        if (error.code !== "auth/redirect-cancelled-by-user") {
          console.error("Auth Init Error:", error);
        }
      }
    };
    initAuth();
  }, []);

  /**
   * 3. AUTH STATE LISTENER
   * Syncs the Firebase User with the Firestore "Conscious Profile".
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // New Profile Creation Logic
          const newProfile = { 
            name: currentUser.displayName || "User", 
            medicalHistory: [], 
            role: 'user',
            createdAt: serverTimestamp() 
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- EXPORTED AUTH METHODS ---

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await executeSocialLogin(provider);
  };

  const loginWithApple = async (): Promise<void> => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      await executeSocialLogin(provider);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        alert("Apple Sign-In is pending final developer certificate approval.");
      } else {
        throw error;
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<void> => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      name,
      medicalHistory: [],
      role: 'user',
      createdAt: serverTimestamp()
    });
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  // Performance Optimization: Only re-render when auth state actually changes
  const authValue = useMemo(() => ({
    user, profile, loading, 
    loginWithGoogle, loginWithApple, loginWithEmail, 
    signUpWithEmail, resetPassword, logout 
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);