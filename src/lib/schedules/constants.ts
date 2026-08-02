// src/lib/schedules/constants.ts

import type { LeagueNight } from "./types";

export const TIME_SLOTS: Record<LeagueNight, string[]> = {
  Sunday: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"],
  Monday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Tuesday: ["6:30 PM", "7:30 PM", "8:30 PM"],
  Wednesday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Thursday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Friday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Saturday: ["9:00 AM", "10:00 AM", "11:00 AM"],
};

export const SUNDAY_REGULAR_BYE_COUNTS: Record<number, number> = {
  1: 3, // 2 hidden championship byes + 1 visible bye
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

export const SUNDAY_PLAYOFF_WEEKS = {
  QUARTERFINALS: 11,
  SEMIFINALS: 12,
};

export const WEEKDAY_PLAYOFF_WEEKS = {
  PLAYOFFS_AND_CHAMPIONSHIP: 11,
};