// src/lib/schedules/constraints.ts

import { LeagueNight } from "./types";

export const TIME_SLOTS: Record<LeagueNight, string[]> = {
  Sunday: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"],
  Monday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Tuesday: ["6:30 PM", "7:30 PM", "8:30 PM"],
  Wednesday: ["7:00 PM", "8:00 PM", "9:00 PM"],
};

export const SUNDAY_REGULAR_BYE_COUNTS: Record<number, number> = {
  1: 3,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 3,
  9: 3,
  10: 3,
};

export const WEEKDAY_REGULAR_BYE_COUNTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 3,
  10: 3,
};