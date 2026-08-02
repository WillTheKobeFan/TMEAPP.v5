// src/features/scheduleGenerator/services/buildGeneratedSeason.ts

import type {
  GeneratedSchedule,
} from "../types";

export type BuiltSeason = {
  league: string;

  mode: string;

  schedule: GeneratedSchedule;

  totalWeeks: number;

  totalGames: number;

  createdAt: string;
};

export type BuildGeneratedSeasonInput = {
  schedule: GeneratedSchedule;
};

export function buildGeneratedSeason({
  schedule,
}: BuildGeneratedSeasonInput): BuiltSeason {
  return {
    league: schedule.league,

    mode: schedule.mode,

    schedule,

    totalWeeks:
      schedule.meta.totalWeeks,

    totalGames:
      schedule.meta.totalGames,

    createdAt:
      schedule.meta.generatedAt,
  };
}