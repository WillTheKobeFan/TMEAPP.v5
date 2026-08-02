// src/utils/schedule-generators/friday.ts

import { generateWeekdayBaseSchedule } from "./weekdayBase";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateFridaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  return generateWeekdayBaseSchedule(input);
}