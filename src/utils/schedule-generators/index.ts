// src/utils/schedule-generators/index.ts

import { generateFridaySchedule } from "./friday";
import { generateMondaySchedule } from "./monday";
import { generateSaturdaySchedule } from "./saturday";
import { generateSundaySchedule } from "./sunday";
import { generateThursdaySchedule } from "./thursday";
import { generateTuesdaySchedule } from "./tuesday";
import { generateWednesdaySchedule } from "./wednesday";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateSchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  switch (input.leagueNight) {
    case "Sunday":
      return generateSundaySchedule(input);

    case "Monday":
      return generateMondaySchedule(input);

    case "Tuesday":
      return generateTuesdaySchedule(input);

    case "Wednesday":
      return generateWednesdaySchedule(input);

    case "Thursday":
      return generateThursdaySchedule(input);

    case "Friday":
      return generateFridaySchedule(input);

    case "Saturday":
      return generateSaturdaySchedule(input);

    default:
      return {
        success: false,
        weeks: [],
        errors: ["Unsupported league night."],
        attempts: 0,
      };
  }
}

export * from "./types";
export { exportGeneratedScheduleToTsv } from "./shared";