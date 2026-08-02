// src/features/scheduleGenerator/services/publishGeneratedSchedule.ts

import { doc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  BuiltSeason,
} from "./buildGeneratedSeason";

export type PublishGeneratedScheduleInput =
  BuiltSeason;

export async function publishGeneratedSchedule(
  input: PublishGeneratedScheduleInput
) {
  const {
    league,
    mode,
    schedule,
    totalWeeks,
    totalGames,
    createdAt,
  } = input;

  if (!league) {
    throw new Error("Missing league");
  }

  if (!schedule?.games?.length) {
    throw new Error(
      "Invalid schedule: missing games"
    );
  }

  if (!schedule?.weeks?.length) {
    throw new Error(
      "Invalid schedule: missing weeks"
    );
  }

  const ref = doc(
    db,
    "schedules",
    league
  );

  const payload = {
    league,
    mode,
    schedule,
    totalWeeks,
    totalGames,
    createdAt,
    updatedAt:
      new Date().toISOString(),
  };

  await setDoc(
    ref,
    payload,
    { merge: true }
  );

  return payload;
}