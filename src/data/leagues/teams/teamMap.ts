// src/data/leagues/teams/teamMap.ts

import { sundayTeams } from "./sunday";
import { mondayTeams } from "./monday";
import { tuesdayTeams } from "./tuesday";
import { wednesdayTeams } from "./wednesday";

export const teamsMap = {
  sunday: sundayTeams,
  monday: mondayTeams,
  tuesday: tuesdayTeams,
  wednesday: wednesdayTeams,
};