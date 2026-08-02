// src/types/leagues.ts

export type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"

export type LeagueInfo = {
  leagueName: string;

  registrationDates?: string;
  
  seasonStart: string;
  seasonEnd: string;

  gameNight: string;
  gameTime?: string;

  totalWeeks: string;

  leagueFormat: string;
  playoffFormat: string;

  skillDivision?: string;
  skillDescription?: string;

  gameRules: string;
  gameResults?: string;
  standingsInfo?: string;
};

export type League = {
  slug: LeagueKey;
  info: LeagueInfo;
};

export type LeagueRegistry = Record<LeagueKey, League>;