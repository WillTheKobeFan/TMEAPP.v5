// src/utils/schedule-generators/wednesday.ts

import { generateWeekdayBaseSchedule } from "./weekdayBase";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateWednesdaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  return generateWeekdayBaseSchedule(
    {
      ...input,
      timeConstraints: [
        ...(input.timeConstraints ?? []),

        // Duffy: no 9 PM, prefer 7 PM, target around 6 early games
        {
          teamId: "wed_tA",
          allowedTimes: ["7:00 PM", "8:00 PM"],
          preferredTimes: ["7:00 PM"],
          targetPreferredGames: 6,
        },

        // Gross: no 9 PM, only 7 PM / 8 PM
        {
          teamId: "wed_tD",
          allowedTimes: ["7:00 PM", "8:00 PM"],
        },
      ],
    },
    {
      requiredByes: 2,
      regularWeeks: 10,
      lateSeasonReducedWeeks: [9, 10],

      // Weeks 9-10 use 8/9 globally.
      // Duffy/Gross can only be placed at 8 PM if they play.
      lateSeasonTimeSlots: ["8:00 PM", "9:00 PM"],
    },
  );
}