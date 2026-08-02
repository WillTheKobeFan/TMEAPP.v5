// src/types/leagueCard.ts

import { LeagueKey } from "./leagues";

export type LeagueInfoCardConfig = {

  slug: LeagueKey;

  leagueName: string;

  seasonStart: string;
  seasonEnd: string;

  registrationDates?: string; // ✅ add this

  gameNight: string;
  gameTime?: string;

  totalWeeks: string;

  leagueFormat: string;
  playoffFormat: string;

  skillDivision?: string;
  skillDescription?: string;

  gameRules?: string;
  gameResults?: string;
  standingsInfo?: string;
};