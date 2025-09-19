
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
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  credits: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseAuthUser | null;
  authLoading: boolean;
  login: (email:string, pass:string) => Promise<any>;
  signup: (email:string, pass:string) => Promise<any>;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserProfileDocument = async (user: FirebaseAuthUser, isGoogleSignIn = false) => {
  const userDocRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { uid, email, displayName, photoURL } = user;
    try {
      await setDoc(userDocRef, {
        uid,
        email,
        displayName: isGoogleSignIn ? displayName : email,
        photoURL,
        isPremium: false,
        credits: 10, // Grant 10 free credits on signup
        isAdmin: false, // Default to not admin
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user profile document:", error);
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, "users", fbUser.uid);
        
        const unsubProfile = onSnapshot(userDocRef, (doc) => {
           if (doc.exists()) {
            setUser(doc.data() as UserProfile);
           } else {
             // This can happen if the user was deleted directly from Firebase console
             // or if document creation failed.
             createUserProfileDocument(fbUser).then(() => {
                // The snapshot listener will pick up the new document.
             });
           }
           setAuthLoading(false);
        }, (error) => {
            console.error("Error listening to user profile:", error);
            setAuthLoading(false);
        });

        return () => unsubProfile();

      } else {
        setFirebaseUser(null);
        setUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const signup = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await createUserProfileDocument(userCredential.user);
    return userCredential;
  }

  const login = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await createUserProfileDocument(userCredential.user, true);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    authLoading,
    login,
    signup,
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
