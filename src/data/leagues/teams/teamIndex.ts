// src/data/leagues/teams/teamIndex.ts

import { toTeamSnapshot } from "src/data/leagues/teams/teamMapper";
import { teamsMap } from "src/data/leagues/teams/teamMap";

export const teamIndex: Record<
  string,
  ReturnType<typeof toTeamSnapshot>
> = {};

Object.values(teamsMap).forEach((leagueTeams) => {
  leagueTeams.forEach((team) => {
    const snapshot = toTeamSnapshot(team);

    teamIndex[
      snapshot.name.trim().toLowerCase()
    ] = snapshot;
  });
});