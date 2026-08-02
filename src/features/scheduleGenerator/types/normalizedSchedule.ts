// src/features/scheduleGenerator/types/normalizedSchedule.ts

import type {
  GeneratedSchedule,
} from "../types";

/**
 * UI + DB safe format (NO Record types allowed here)
 */
export type NormalizedSchedule = {
  games: GeneratedSchedule["games"];
  byes: string[];
};

/**
 * Converts RAW generator output into stable app format
 */
export function normalizeSchedule(
  raw: GeneratedSchedule
): NormalizedSchedule {
  return {
    games: raw.games,

    // flatten Record<number, string[]> → string[]
    byes: Object.values(raw.byes).flat(),
  };
}