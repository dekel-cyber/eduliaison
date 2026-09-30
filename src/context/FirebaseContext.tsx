import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, testFirestoreConnection } from '../firebase/config';
import { seedInitialDataIfEmpty } from '../firebase/firestoreService';
import { UserRole } from '../types';

interface FirebaseContextType {
  user: User | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testFirestoreConnection();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await seedInitialDataIfEmpty();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      await seedInitialDataIfEmpty();
    } catch (error) {
      console.error("Erreur lors de la connexion Google:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        userRole,
        setUserRole,
        loading,
        signInWithGoogle,
        logOut
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
