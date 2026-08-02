// src/utils/schedule-generators/tuesday.ts

import { generateWeekdayBaseSchedule } from "./weekdayBase";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateTuesdaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  return generateWeekdayBaseSchedule(input, {
    requiredByes: 2,
    regularWeeks: 10,

    lateSeasonReducedWeeks: [9, 10],

    // Weeks 9-10:
    // 6:30 PM, 7:30 PM only
    // NO 8:30 PM
    lateSeasonTimeSlots: ["6:30 PM", "7:30 PM"],
  });
}