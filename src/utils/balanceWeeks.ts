// src/features/scheduleGenerator/utils/balanceWeeks.ts

import type {
  ScheduleGame,
} from "@/features/scheduleGenerator/types";

type Input = {
  games: ScheduleGame[];

  weeks?: number;

  gameSlotsPerWeek: number;
};

export function balanceWeeks({
  games,
  weeks,
  gameSlotsPerWeek,
}: Input): ScheduleGame[] {
  if (!games.length) {
    return [];
  }

  const maxPerWeek =
    gameSlotsPerWeek <= 0
      ? Number.MAX_SAFE_INTEGER
      : gameSlotsPerWeek;

  const output: ScheduleGame[] = [];

  let week = 1;

  let slotCount = 0;

  const forcedWeeks =
    weeks && weeks > 0
      ? weeks
      : Math.ceil(
          games.length / maxPerWeek
        );

  for (const game of games) {
    if (slotCount >= maxPerWeek) {
      week++;

      slotCount = 0;
    }

    output.push({
      ...game,

      week:
        week <= forcedWeeks
          ? week
          : forcedWeeks +
            (week - forcedWeeks),
    });

    slotCount++;
  }

  return output;
}