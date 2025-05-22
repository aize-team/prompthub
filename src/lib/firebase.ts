// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert, AppOptions } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin with null checks for build time
let db: Firestore | null = null;

try {
  const serviceAccountConfig = process.env.FIREBASE_CONFIG;

  if (typeof window === 'undefined' && serviceAccountConfig) {
    // Server-side initialization
    const serviceAccount = JSON.parse(serviceAccountConfig);

    const options: AppOptions = {
      credential: cert(serviceAccount),
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    };

    const app = getApps().length === 0 ? initializeApp(options) : getApp();
    db = getFirestore(app);
  }
} catch (error) {
  // Only throw error in production, not during build
  if (process.env.NODE_ENV === 'production') {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
  console.warn('Firebase Admin initialization failed (this is expected during build)');
}

export { db };
