// src/features/standings/utils/publishStandings.ts

import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { TeamStanding } from "@/types/standings";

// normalize Firestore-safe ID
function makeId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}

export async function publishStandings(
  league: string,
  standings: TeamStanding[]
) {
  const ref = collection(
    db,
    `league/${league}/standings`
  );

  await Promise.all(
    standings.map((team) =>
      setDoc(
        doc(ref, makeId(team.name)),
        team
      )
    )
  );
}