// src/features/scheduleGenerator/types.ts

export type LeagueKey = "sunday" | "monday" | "tuesday" | "wednesday";

export type TeamInput = {
  id: string;
  captain: string;
};

export type ScheduleGame = {
  week: number;
  time: string;
  team1: string;
  team2: string;
  display: string;
  isChampionship?: boolean;
};

export type ScheduleWeek = {
  week: number;
  games: ScheduleGame[];
  byes: string[];
  hiddenByes: string[];
  byeDisplay: string[];
  hiddenByeDisplay: string[];
};

export type IndividualWeekSchedule = {
  week: number;
  status: "game" | "bye" | "hiddenBye" | "off";
  time: string;
  opponent: string;
  matchup: string;
};

export type IndividualSchedule = {
  teamId: string;
  captain: string;
  weeks: IndividualWeekSchedule[];
};

export type GeneratedSchedule = {
  league: LeagueKey;
  weeks: ScheduleWeek[];
  individualSchedules: IndividualSchedule[];
};

export type GenerateScheduleInput = {
  league: LeagueKey;
  teams: TeamInput[];
  weeks: number;

  /**
   * Sunday only.
   * These should be the 2 teams that won the Sunday semifinals.
   */
  sundayCarryoverTeamIds?: string[];

  /**
   * Sunday only.
   * Admin-selected championship time.
   *
   * Example:
   * "9:00 AM"
   * "10:00 AM"
   * "11:00 AM"
   * "12:00 PM"
   */
  sundayChampionshipTime?: string;
};

