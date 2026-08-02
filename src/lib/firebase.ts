// src/lib/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDMsw_84AfqjX56gR7RFZsYZRP7Rjr9mCE",
  authDomain: "tmeappv5.firebaseapp.com",
  projectId: "tmeappv5",
  storageBucket: "tmeappv5.firebasestorage.app",
  messagingSenderId: "814932968132",
  appId: "1:814932968132:web:d9f63ed4849a55e3763f91",
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ✅ Only Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// ❌ Do NOT use getAnalytics or any web-only module here