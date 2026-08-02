// src/lib/scheduleGenerator/teamHelpers.ts

import type { ScheduleTeam } from "./types";

export function addTeam(
  teams: ScheduleTeam[],
  team: ScheduleTeam
) {
  return [...teams, team];
}

export function removeTeam(
  teams: ScheduleTeam[],
  teamId: string
) {
  return teams.filter((t) => t.id !== teamId);
}

export function updateTeam(
  teams: ScheduleTeam[],
  updated: ScheduleTeam
) {
  return teams.map((t) =>
    t.id === updated.id ? updated : t
  );
}