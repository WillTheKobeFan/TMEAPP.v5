// scripts/lib/firebaseAdmin

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// IMPORTANT: rename export to avoid collision
export const adminDb = admin.firestore();
export { admin };