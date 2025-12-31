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
   * 1. MASTER INITIALIZATION
   * Handles the "Mobile Redirect Loop" by capturing the login result 
   * before the rest of the app renders.
   */
  useEffect(() => {
    const handleAuthLifecycle = async () => {
      try {
        // Force local persistence so session survives mobile redirect reloads
        await setPersistence(auth, browserLocalPersistence);
        
        // Catch the user returning from Google/Apple
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Mobile redirect login successful");
        }
      } catch (error: any) {
        if (error.code !== "auth/redirect-cancelled-by-user") {
          console.error("Auth Lifecycle Error:", error);
        }
      }
    };

    handleAuthLifecycle();

    // Listen for Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            // Setup default "Conscious Profile" for new users
            const newProfile = { 
              name: currentUser.displayName || "User", 
              email: currentUser.email,
              medicalHistory: [], 
              role: 'user',
              createdAt: serverTimestamp() 
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Firestore Profile Sync Error:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * 2. UNIVERSAL PROVIDER HANDLER
   * Checks if device is mobile to decide between Popup and Redirect.
   */
  const executeSocialLogin = async (provider: FirebaseAuthProvider): Promise<void> => {
    if (typeof window === "undefined") return;

    // Detect mobile or small screens
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    try {
      if (isMobile) {
        // Redirect triggers a full page refresh
        await signInWithRedirect(auth, provider);
      } else {
        // Popup is faster for desktop
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      if (error.code === "auth/redirect-cancelled-by-user" || error.code === "auth/popup-closed-by-user") {
        return;
      }
      throw error;
    }
  };

  // --- EXPORTED METHODS ---

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await executeSocialLogin(provider);
  };

  const loginWithApple = async (): Promise<void> => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    await executeSocialLogin(provider);
  };

  const loginWithEmail = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        medicalHistory: [],
        role: 'user',
        createdAt: serverTimestamp()
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Memoize value to stop unnecessary re-renders of the whole app
  const contextValue = useMemo(() => ({
    user, profile, loading, 
    loginWithGoogle, loginWithApple, loginWithEmail, 
    signUpWithEmail, resetPassword, logout 
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);