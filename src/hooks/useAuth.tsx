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
   * This runs once when the app opens.
   * It handles the logic for users returning from a mobile redirect.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Force LOCAL persistence so mobile browsers don't "forget" the session
        await setPersistence(auth, browserLocalPersistence);
        
        // This is the critical fix for mobile: catch the redirect result
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Mobile redirect login successful:", result.user.email);
        }
      } catch (error: any) {
        if (error.code !== "auth/redirect-cancelled-by-user") {
          console.error("Auth Initialization Error:", error);
        }
      }
    };

    initAuth();
  }, []);

  /**
   * 2. SYNC AUTH WITH FIRESTORE
   * Listens for login/logout and fetches the "Conscious Profile".
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            // Setup default profile for first-time login
            const newProfile = { 
              name: currentUser.displayName || "New User", 
              email: currentUser.email,
              medicalHistory: [], 
              role: 'user',
              createdAt: serverTimestamp() 
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error("Profile Fetch Error:", err);
        }
      } else {
        setProfile(null);
      }
      
      // Crucial: only stop loading once we've checked the profile
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * 3. UNIVERSAL SOCIAL LOGIN HANDLER
   * Optimized for Mobile Redirects vs. Desktop Popups
   */
  const executeSocialLogin = async (provider: FirebaseAuthProvider): Promise<void> => {
    if (typeof window === "undefined") return;

    // Detect mobile by userAgent or screen size
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    try {
      if (isMobile) {
        // Triggers a page reload - handled by initAuth above
        await signInWithRedirect(auth, provider);
      } else {
        // Desktop standard
        await signInWithPopup(auth, provider);
      }
    } catch (error: any) {
      if (
        error.code === "auth/redirect-cancelled-by-user" || 
        error.code === "auth/popup-closed-by-user"
      ) {
        return; // Gracefully handle user closing the window
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
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      await executeSocialLogin(provider);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        alert("Apple Sign-In is currently being verified. Please use Google or Email for the demo.");
      } else {
        throw error;
      }
    }
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

  // Memoize value to prevent unnecessary re-renders of your entire app
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