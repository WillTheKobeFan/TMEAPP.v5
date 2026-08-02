// src/utils/schedule-generators/monday.ts

import { generateWeekdayBaseSchedule } from "./weekdayBase";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateMondaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  return generateWeekdayBaseSchedule(
    {
      ...input,
      timeConstraints: [
        ...(input.timeConstraints ?? []),

        // Cam / Trifecta: no 9 PM, prefer 7 PM, target around 6 early games
        {
          teamId: "mon_tA",
          allowedTimes: ["7:00 PM", "8:00 PM"],
          preferredTimes: ["7:00 PM"],
          targetPreferredGames: 6,
        },

        // Gross / The Other Bar: no 9 PM, only 7 PM / 8 PM
        {
          teamId: "mon_tF",
          allowedTimes: ["7:00 PM", "8:00 PM"],
        },
      ],
    },
    {
      requiredByes: 2,
      regularWeeks: 10,
      lateSeasonReducedWeeks: [9, 10],

      // Weeks 9-10 still use 8/9 globally,
      // but Cam/Gross can only land at 8 PM if they play.
      lateSeasonTimeSlots: ["8:00 PM", "9:00 PM"],
    },
  );
}