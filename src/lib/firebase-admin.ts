
import "server-only";

import * as admin from "firebase-admin";
import { UserProfile } from "@/context/AuthContext";
import { Link } from "lucide-react";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
     console.error('Firebase Admin initialization error', error);
  }
}

export const adminDb = admin.firestore();

export async function getAllUsers(): Promise<UserProfile[]> {
  const usersSnapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();
  const users: UserProfile[] = [];
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      uid: data.uid,
      email: data.email || null,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      isPremium: data.isPremium || false,
      credits: data.credits || 0,
      isAdmin: data.isAdmin || false,
      createdAt: (data.createdAt as admin.firestore.Timestamp)?.toDate() || new Date(0),
    } as UserProfile);
  });
  return users;
}

export async function getTotalUserCount(): Promise<number> {
    const snapshot = await adminDb.collection("users").get();
    return snapshot.size;
}

export async function getTotalLinkCount(): Promise<number> {
    const snapshot = await adminDb.collection("links").get();
    return snapshot.size;
}

async function getCountByDay(collectionName: string): Promise<{ date: string; count: number }[]> {
    const snapshot = await adminDb.collection(collectionName).get();
    const countsByDay: { [key: string]: number } = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && data.createdAt.toDate) {
            const date = data.createdAt.toDate().toISOString().split('T')[0];
            countsByDay[date] = (countsByDay[date] || 0) + 1;
        }
    });

    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        result.push({
            date: dateString,
            count: countsByDay[dateString] || 0
        });
    }

    return result;
}

export async function getUserActivity() {
    return getCountByDay("users");
}

export async function getLinkActivity() {
    return getCountByDay("links");
}
