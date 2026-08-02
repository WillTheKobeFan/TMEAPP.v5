// src/lib/leagueConfig.ts

export const LEAGUE_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type LeagueDay = typeof LEAGUE_DAYS[number];

export type LeagueSetup = {
  day: LeagueDay;
  active: boolean;
  season: string;
  year: string;
  regularWeeks: number;
  playoffWeeks: number;
  gamesPerNight: number;
  timeSlots: string[];
  useCustomGenerator?: boolean;
};