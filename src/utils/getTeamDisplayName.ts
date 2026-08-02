// src/utils/getTeamDisplayName.ts

import { teamNameMap } from "src/data/teams/teamNameMap";

export function getTeamDisplayName(
  league: keyof typeof teamNameMap,
  teamId: string
) {
  return teamNameMap[league]?.[teamId as keyof typeof teamNameMap[typeof league]] ?? teamId;
}