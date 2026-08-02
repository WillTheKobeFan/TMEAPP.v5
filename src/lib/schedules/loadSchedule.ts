// src/lib/schedules/loadSchedule.ts

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PublishedSchedule } from "@/types/schedule";

export async function loadSchedule(
  league: string
): Promise<PublishedSchedule | null> {
  const ref = doc(db, "schedules", league);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data().schedule as PublishedSchedule;
}