import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for RoomieMatch
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAxWnBTx8-B0EQvKA5ji2PPm3FHq5FjNnA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roomiematch-68bd7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roomiematch-68bd7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roomiematch-68bd7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1079010602218",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1079010602218:web:f6b8d14ae0c69c0a35bb93"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export app and services
export { app, auth, db };
