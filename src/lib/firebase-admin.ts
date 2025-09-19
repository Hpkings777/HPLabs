
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
let db: admin.firestore.Firestore;

export function ensureAdminDb() {
    if (!admin.apps.length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountKey) {
             throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be disabled.");
        }
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (error) {
            console.error('Firebase Admin initialization error:', error);
            throw new Error("Firebase Admin initialization failed.");
        }
    }
    
    if (!db) {
        db = admin.firestore();
    }

    return db;
}
