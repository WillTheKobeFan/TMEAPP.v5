// src/data/leagues/teams/teamMapper.ts

import type { RawTeam } from "src/data/leagues/teamMap";
import type {
  LeagueKey,
  TeamSnapshot,
} from "@/types/team";

function normalizeLeague(
  league: string
): LeagueKey {
  if (
    league === "Sunday" ||
    league === "Monday" ||
    league === "Wednesday"
  ) {
    return league;
  }

  if (league.toLowerCase() === "sunday") {
    return "Sunday";
  }

  if (league.toLowerCase() === "monday") {
    return "Monday";
  }

  if (league.toLowerCase() === "wednesday") {
    return "Wednesday";
  }

  return "Sunday";
}

export function toTeamSnapshot(
  team: RawTeam
): TeamSnapshot {
  return {
    id: team.id,
    name: team.teamName,
    league: normalizeLeague(team.league),
    place: 0,
    record: {
      wins: 0,
      losses: 0,
    },
    status: "upcoming",
    nextMatch: null,
    lastResult: null,
    schedule: [],
  };
}