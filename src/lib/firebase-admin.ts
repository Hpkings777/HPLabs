
import "server-only";

import * as admin from "firebase-admin";
import { UserProfile } from "@/context/AuthContext";
import { Link } from "lucide-react";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be disabled.");
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;

async function ensureAdminDb() {
    if (!adminDb) {
        console.error("Firebase Admin is not initialized. Skipping admin operation.");
        return false;
    }
    return true;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  if (!await ensureAdminDb()) return [];

  const usersSnapshot = await adminDb!.collection("users").orderBy("createdAt", "desc").get();
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
    if (!await ensureAdminDb()) return 0;
    const snapshot = await adminDb!.collection("users").get();
    return snapshot.size;
}

export async function getTotalLinkCount(): Promise<number> {
    if (!await ensureAdminDb()) return 0;
    const snapshot = await adminDb!.collection("links").get();
    return snapshot.size;
}

async function getCountByDay(collectionName: string): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        result.push({
            date: dateString,
            count: 0
        });
    }

    if (!await ensureAdminDb()) return result;
    
    const snapshot = await adminDb!.collection(collectionName).get();
    const countsByDay: { [key: string]: number } = {};

    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && data.createdAt.toDate) {
            const date = data.createdAt.toDate().toISOString().split('T')[0];
            countsByDay[date] = (countsByDay[date] || 0) + 1;
        }
    });

    return result.map(day => ({
        ...day,
        count: countsByDay[day.date] || 0,
    }));
}

export async function getUserActivity() {
    return getCountByDay("users");
}

export async function getLinkActivity() {
    return getCountByDay("links");
}
