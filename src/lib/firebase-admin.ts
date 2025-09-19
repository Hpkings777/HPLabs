
import * as admin from "firebase-admin";

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

export async function ensureAdminDb() {
    if (!adminDb) {
        throw new Error("Firebase Admin is not initialized. Cannot perform admin action.");
    }
}
