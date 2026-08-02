// src/lib/schedules/saveSchedule.ts

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

type Input = {
  league: string;

  schedule: unknown;
};

export async function saveSchedule({
  league,
  schedule,
}: Input) {
  const ref = doc(
    db,
    "schedules",
    league
  );

  await setDoc(ref, {
    updatedAt:
      new Date().toISOString(),

    schedule,
  });

  return true;
}