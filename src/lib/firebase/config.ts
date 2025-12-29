import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// These match the keys we put in your .env.local file
const firebaseConfig = {
  apiKey: "AIzaSyCAjMGswxh1av3ctmZB1QszUz75EGvf42w",
  authDomain: "conscious-cuisine-5827a.firebaseapp.com",
  projectId: "conscious-cuisine-5827a",
  storageBucket: "conscious-cuisine-5827a.firebasestorage.app",
  messagingSenderId: "53766906036",
  appId: "1:53766906036:web:b0e0a24d2ed47022db77e1"
};

// Initialize Firebase for Next.js (Server-Safe)
// If an app already exists, use it; otherwise, initialize a new one.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };