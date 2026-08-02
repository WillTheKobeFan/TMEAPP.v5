// src/utils/schedule-generators/saturday.ts

import { generateWeekdayBaseSchedule } from "./weekdayBase";
import type {
  GenerateScheduleInput,
  GenerateScheduleResult,
} from "./types";

export function generateSaturdaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  return generateWeekdayBaseSchedule(input);
}