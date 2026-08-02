// src/features/scheduleGenerator/services/buildScheduleInput.ts

import type {
  GenerateScheduleInput,
  LeagueKey,
  TeamInput,
} from "../types";

type RawTeam =
  | string
  | {
      id: string;
      captain?: string;
      name?: string;
      teamName?: string;
    };

type BuildScheduleInputData = {
  league: LeagueKey;
  teams: RawTeam[];
  weeks: number;
  sundayCarryoverTeamIds?: string[];
};

function normalizeTeams(teams: RawTeam[]): TeamInput[] {
  return teams.map((team) => {
    if (typeof team === "string") {
      return {
        id: team,
        captain: team,
      };
    }

    return {
      id: team.id,
      captain: team.captain ?? team.name ?? team.teamName ?? team.id,
    };
  });
}

export function buildScheduleInput(
  data: BuildScheduleInputData
): GenerateScheduleInput {
  return {
    league: data.league,
    weeks: data.weeks,
    teams: normalizeTeams(data.teams),
    sundayCarryoverTeamIds:
      data.league === "sunday" ? data.sundayCarryoverTeamIds ?? [] : [],
  };
}