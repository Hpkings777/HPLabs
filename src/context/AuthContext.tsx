"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseAuthUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseAuthUser | null;
  authLoading: boolean;
  login: typeof signInWithEmailAndPassword;
  signup: typeof createUserWithEmailAndPassword;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserProfileDocument = async (user: FirebaseAuthUser) => {
  const userDocRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { uid, email, displayName, photoURL } = user;
    try {
      await setDoc(userDocRef, {
        uid,
        email,
        displayName,
        photoURL,
        isPremium: false, // Default to false for new users
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user profile document:", error);
    }
  }
  return userDocRef;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        await createUserProfileDocument(fbUser);
        const userDocRef = doc(db, "users", fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setAuthLoading(true);
    await signOut(auth);
    // onAuthStateChanged will handle the rest
  };

  const signup = async (authInstance: typeof auth, ...args: Parameters<typeof createUserWithEmailAndPassword>) => {
    setAuthLoading(true);
    const userCredential = await createUserWithEmailAndPassword(authInstance, ...args);
    // onAuthStateChanged will handle the rest
    return userCredential;
  }

  const login = async (authInstance: typeof auth, ...args: Parameters<typeof signInWithEmailAndPassword>) => {
    setAuthLoading(true);
    const userCredential = await signInWithEmailAndPassword(authInstance, ...args);
    // onAuthStateChanged will handle the rest
    return userCredential;
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user and redirecting.
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      setAuthLoading(false); // Only set to false on error, success is handled by listener
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    authLoading,
    login: (...args) => login(auth, ...args),
    signup: (...args) => signup(auth, ...args),
    logout,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
