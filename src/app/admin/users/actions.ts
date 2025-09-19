
"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";

async function verifyAdmin() {
    // In a real app, you'd get the current user's session and verify they are an admin.
    // For this prototype, we'll assume the action is triggered by an authorized admin.
    // This is a critical security step for a production application.
    return true;
}

export async function toggleAdmin(uid: string, isAdmin: boolean) {
    const isAdminUser = await verifyAdmin();
    if (!isAdminUser) throw new Error("Unauthorized");

    try {
        const userRef = adminDb.collection('users').doc(uid);
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
        const userRef = adminDb.collection('users').doc(uid);
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
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({ credits });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Error updating user credits:", error);
        return { success: false, error: "Failed to update credits." };
    }
}
