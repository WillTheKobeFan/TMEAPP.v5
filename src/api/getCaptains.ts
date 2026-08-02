// src/api/getCaptains.ts
import { getDatabase, ref, get } from "firebase/database";

export async function fetchCaptains() {
  const db = getDatabase();
  const snapshot = await get(ref(db, "captains"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.values(data);
}