// src/data/standings/standingsTypes.ts

export type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

export type TeamStanding = {
  team: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
};