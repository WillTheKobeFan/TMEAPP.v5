// src/services/leagueService.ts

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type SessionData =
  Record<string, unknown>;

const sessionRef = doc(
  db,
  "sessions",
  "wednesdaySession"
);

export async function getWednesdaySession() {
  const snapshot = await getDoc(sessionRef);

  return snapshot.exists() ? snapshot.data() : null;
}

export async function setWednesdaySession(
  data: SessionData
) {
  await setDoc(sessionRef, data, { merge: true });
}

export async function updateWednesdaySession(
  data: SessionData
) {
  await updateDoc(sessionRef, data);
}

export function listenToSession(
  callback: (data: SessionData | null) => void
) {
  return onSnapshot(sessionRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}