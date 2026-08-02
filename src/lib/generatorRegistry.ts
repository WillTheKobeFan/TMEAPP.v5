// src/lib/generatorRegistry.ts

import { generateGenericSchedule } from "./GenericGenerator";
import { buildSundaySchedule } from "./schedules/sundayGenerator";
import { buildWeeknightSchedule } from "./schedules/MondayTuesdayWednesdayGenerator";

export function getGeneratorForLeague(day: string) {
  switch (day) {
    case "Sunday":
      return buildSundaySchedule;

    case "Monday":
    case "Tuesday":
    case "Wednesday":
      return buildWeeknightSchedule;

    default:
      return generateGenericSchedule;
  }
}