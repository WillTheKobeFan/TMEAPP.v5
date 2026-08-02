// src/components/services/firebase/firebaseHelpers.ts

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type StandingUpdate = {
  wins?: number;
  losses?: number;
  rank?: number;
};

// Get all standings for a day
export const getStandings = async (day: string) => {
  try {
    const ref = doc(db, "standings", day);
    const snapshot = await getDoc(ref);

    return snapshot.exists() ? snapshot.data() : {};
  } catch (err) {
    console.log("❌ ERROR FETCHING STANDINGS:", err);
    return {};
  }
};

// Update a single team
export const updateTeamStanding = async (
  day: string,
  team: string,
  data: StandingUpdate
) => {
  try {
    const ref = doc(db, "standings", day, "teams", team);

    await updateDoc(ref, data);

    console.log(`✅ UPDATED ${team} on ${day}`, data);
  } catch (err) {
    console.log(`❌ ERROR UPDATING ${team} on ${day}:`, err);
  }
};

// Replace entire standings
export const setStandings = async (
  day: string,
  data: Record<string, unknown>
) => {
  try {
    const ref = doc(db, "standings", day);

    await setDoc(ref, data, { merge: true });

    console.log(`✅ SET STANDINGS for ${day}`);
  } catch (err) {
    console.log(`❌ ERROR SETTING STANDINGS for ${day}:`, err);
  }
};