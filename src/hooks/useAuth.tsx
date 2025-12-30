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

  // 1. Initialize Auth and handle Redirects
  useEffect(() => {
    const handleAuthInit = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Redirect login successful");
        }
      } catch (error: any) {
        if (error.code !== "auth/redirect-cancelled-by-user") {
          console.error("Auth Init Error:", error);
        }
      }
    };
    handleAuthInit();
  }, []);

  // 2. Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
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

  // 3. Helper for Login (No 'return' here to satisfy the 'void' interface)
  const performLogin = async (provider: FirebaseAuthProvider) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
      // Redirect doesn't return anything; it leaves the page
      await signInWithRedirect(auth, provider);
    } else {
      // Popup returns a UserCredential, but we just want to wait for it to finish
      await signInWithPopup(auth, provider);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await performLogin(provider);
  };

  const loginWithApple = async (): Promise<void> => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    await performLogin(provider);
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

  // Memoize value for performance
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