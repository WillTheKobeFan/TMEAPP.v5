// src/config/firebaseConfig

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMsw_84AfqjX56gR7RFZsYZRP7Rjr9mCE",
  authDomain: "tmeappv5.firebaseapp.com",
  projectId: "tmeappv5",
  storageBucket: "tmeappv5.firebasestorage.app",
  messagingSenderId: "814932968132",
  appId: "1:814932968132:web:d9f63ed4849a55e3763f91",
};

// ✅ CRITICAL FIX: prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);