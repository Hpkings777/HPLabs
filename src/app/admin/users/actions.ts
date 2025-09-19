
"use server";

import { revalidatePath } from "next/cache";
import * as admin from "firebase-admin";
import { adminDb, ensureAdminDb } from "@/lib/firebase-admin";
import { UserProfile } from "@/context/AuthContext";

async function verifyAdmin() {
    // In a real app, you'd get the current user's session and verify they are an admin.
    // For this prototype, we'll assume the action is triggered by an authorized admin.
    // This is a critical security step for a production application.
    await ensureAdminDb();
    return true;
}

export async function toggleAdmin(uid: string, isAdmin: boolean) {
    const isAdminUser = await verifyAdmin();
    if (!isAdminUser) throw new Error("Unauthorized");

    try {
        const userRef = adminDb!.collection('users').doc(uid);
        await userRef.update({ isAdmin });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Error toggling admin status:", error);
        return { success: false, error: "Failed to update admin status." };
    }
}

export async function togglePremium(uid: string, isPremium: boolean) {
    const isAdminUser = await verifyAdmin();
    if (!isAdminUser) throw new Error("Unauthorized");

    try {
        const userRef = adminDb!.collection('users').doc(uid);
        await userRef.update({ isPremium });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Error toggling premium status:", error);
        return { success: false, error: "Failed to update premium status." };
    }
}

export async function updateUserCredits(uid: string, credits: number) {
    const isAdminUser = await verifyAdmin();
    if (!isAdminUser) throw new Error("Unauthorized");

    if (credits < 0) {
        return { success: false, error: "Credits cannot be negative." };
    }

    try {
        const userRef = adminDb!.collection('users').doc(uid);
        await userRef.update({ credits });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Error updating user credits:", error);
        return { success: false, error: "Failed to update credits." };
    }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  await ensureAdminDb();

  const usersSnapshot = await adminDb!.collection("users").orderBy("createdAt", "desc").get();
  const users: UserProfile[] = [];
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    const createdAtTimestamp = data.createdAt as admin.firestore.Timestamp;
    users.push({
      uid: data.uid,
      email: data.email || null,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      isPremium: data.isPremium || false,
      credits: data.credits || 0,
      isAdmin: data.isAdmin || false,
      // Convert Timestamp to a serializable format (ISO string)
      createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : new Date(0).toISOString(),
    } as unknown as UserProfile);
  });
  return users;
}

export async function getTotalUserCount(): Promise<number> {
    await ensureAdminDb();
    const snapshot = await adminDb!.collection("users").get();
    return snapshot.size;
}

export async function getTotalLinkCount(): Promise<number> {
    await ensureAdminDb();
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

    await ensureAdminDb();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const snapshot = await adminDb!.collection(collectionName).where('createdAt', '>=', sevenDaysAgo).get();
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
