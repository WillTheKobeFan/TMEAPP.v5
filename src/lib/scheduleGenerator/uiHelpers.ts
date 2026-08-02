// src/lib/scheduleGenerator/uiHelpers.ts

import type { GameSlot, ScheduleTeam, TeamPreference } from "./types";

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyTeam(): ScheduleTeam {
  return {
    id: "",
    name: "",
    captain: "",
    captainSameAsTeamName: true,
  };
}

export function createEmptyGameSlot(): GameSlot {
  return {
    id: makeId("slot"),
    time: "",
    venue: "",
  };
}

export function createEmptyPreference(): TeamPreference {
  return {
    id: makeId("pref"),
    teamId: "",
    teamName: "",
  };
}