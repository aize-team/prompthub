// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert, AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountConfig = process.env.FIREBASE_CONFIG;

if (!serviceAccountConfig) {
  console.error('FATAL ERROR: FIREBASE_CONFIG environment variable is not set.');
  throw new Error('Firebase config is not configured via FIREBASE_CONFIG environment variable.');
}

const serviceAccount = JSON.parse(serviceAccountConfig);

const options: AppOptions = {
  credential: cert(serviceAccount),
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Uncomment if using Realtime Database
};

const app = getApps().length === 0 ? initializeApp(options) : getApp();
const db = getFirestore(app);

export { db };
