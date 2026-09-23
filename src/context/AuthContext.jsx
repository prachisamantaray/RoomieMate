import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

// Custom hook to use AuthContext easily in components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user and create Firestore profile document users/{uid}
  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name in Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Store user document in Firestore using user.uid as document ID
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      createdAt: serverTimestamp()
    });

    return user;
  };

  // Login existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout current user
  const logout = () => {
    return signOut(auth);
  };

  // Subscribe to Firebase auth state changes to persist session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
