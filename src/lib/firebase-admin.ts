
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
let db: admin.firestore.Firestore | null = null;

export function ensureAdminDb() {
    if (!admin.apps.length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                db = admin.firestore();
            } catch (error) {
                console.error('Firebase Admin initialization error:', error);
                db = null;
            }
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be disabled.");
            db = null;
        }
    } else if (!db) {
        // App is initialized, but db might not be.
        db = admin.firestore();
    }

    if (!db) {
        throw new Error("Firebase Admin is not initialized. Cannot perform admin action.");
    }
    return db;
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
