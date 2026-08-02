// src/utils/translateTeamId.ts

import { teamNameMap } from "src/data/teams/teamNameMap";

export function translateTeamId(league: string, teamId: string) {
  return (
    teamNameMap[league as keyof typeof teamNameMap]?.[
      teamId as keyof typeof teamNameMap[keyof typeof teamNameMap]
    ] ?? teamId
  );
}