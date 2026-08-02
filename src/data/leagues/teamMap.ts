// src/data/leagues/teamMap.ts

import { sundayTeams } from "./teams/sunday";
import { mondayTeams } from "./teams/monday";
import { tuesdayTeams } from "./teams/tuesday";
import { wednesdayTeams } from "./teams/wednesday";

/**
 * Raw team shape coming from your data files
 */
export type RawTeam = {
  id: string;
  league: string;
  teamName: string;
  active?: boolean;
};

/**
 * Union of all league keys (prevents typos like "Sundey")
 */
export type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

/**
 * Strongly typed teams map
 */
export const teamsMap: Record<LeagueKey, RawTeam[]> = {
  sunday: sundayTeams,
  monday: mondayTeams,
  tuesday: tuesdayTeams,
  wednesday: wednesdayTeams,
};