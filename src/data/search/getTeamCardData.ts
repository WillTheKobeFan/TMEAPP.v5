// src/data/search/getTeamCardData.ts

import type { Team } from "src/components/cards/SearchTeamCard";
import { getAllTeams } from "src/data/search/getAllTeams";

function normalizeLeague(input?: string): Team["league"] {
  const value = String(input || "").toLowerCase();

  if (value.includes("mon")) return "Monday";
  if (value.includes("tue")) return "Tuesday";
  if (value.includes("wed")) return "Wednesday";
  if (value.includes("sun")) return "Sunday";

  return "Sunday";
}

function cleanTeamName(input: string) {
  return input
    .replace(/^\(\d+\)\s*/, "")
    .replace(/^Seed\s+\d+$/i, "")
    .trim();
}

export function getTeamCardData(
  teamNameOrId: string,
  league?: string
): Team | null {
  const teams = getAllTeams();
  const searchValue = cleanTeamName(teamNameOrId).toLowerCase();
  const leagueValue = league ? normalizeLeague(league).toLowerCase() : null;

  if (!searchValue) return null;

  const foundTeam = teams.find((rawTeam) => {
    const team: any = rawTeam;

    const teamId = String(team.id || "").toLowerCase();
    const teamName = String(team.teamName || "").toLowerCase();
    const captain = String(team.captain || "").toLowerCase();
    const teamLeague = normalizeLeague(team.league).toLowerCase();

    const leagueMatch = leagueValue ? teamLeague === leagueValue : true;

    return (
      leagueMatch &&
      (teamId === searchValue ||
        teamName === searchValue ||
        captain === searchValue)
    );
  });

  if (!foundTeam) return null;

  const team: any = foundTeam;

  return {
    id: team.id,
    teamName: team.teamName,
    captain: team.captain,
    league: normalizeLeague(team.league),
    record: team.record,
    place: team.place,
    status: team.status,
    nextGame: team.nextGame || team.nextMatch,
    nextMatch: team.nextMatch,
    lastResult: team.lastResult,
    schedule: team.schedule,
  };
}