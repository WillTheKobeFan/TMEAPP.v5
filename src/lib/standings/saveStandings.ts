// src/lib/standings/saveStandings.ts

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function saveStandings(
  league: string,
  standings: any
) {
  const ref = doc(
    db,
    "standings",
    league
  );

  await setDoc(ref, standings);

  return true;
}