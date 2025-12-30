"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup,
  signInWithRedirect,
  signInWithPhoneNumber, 
  GoogleAuthProvider,
  getRedirectResult,  
  OAuthProvider,
  RecaptchaVerifier,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthProvider as FirebaseAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithApple: async () => {},
  loginWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
});

const loginWithPhone = async (phoneNumber: string, recaptchaContainerId: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
  });
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to detect mobile
  const getIsMobile = () => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  // 1. Handle Auth State Changes
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
            role: 'user' 
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

  // 2. Handle Redirect Results (Needed for Mobile)
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      if (error.code !== "auth/redirect-cancelled-by-user") {
        console.error("Redirect Login Error", error);
      }
    });
  }, []);

  // 3. Provider Login Logic
  const handleProviderLogin = async (provider: FirebaseAuthProvider) => {
    if (getIsMobile()) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await handleProviderLogin(provider);
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    await handleProviderLogin(provider);
  };

  // 4. Email/Password Logic
  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      name,
      medicalHistory: [],
      role: 'user'
    });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, 
      loginWithGoogle, loginWithApple, loginWithEmail, 
      signUpWithEmail, resetPassword, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);