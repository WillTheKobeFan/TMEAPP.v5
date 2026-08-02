// src/lib/teamMap

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const loadTeamMap = async () => {
  const snap = await getDocs(collection(db, "spring2026_teams"));

  const map: Record<string, string> = {};

  snap.forEach(doc => {
    const data = doc.data();
    map[data.teamId] = `${data.displayName} (${data.captain})`;
  });

  return map;
};