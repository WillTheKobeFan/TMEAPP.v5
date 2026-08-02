// src/lib/scheduleGenerator/preferenceHelpers.ts

import type { TeamPreference } from "./types";

export function addPreference(
  preferences: TeamPreference[],
  pref: TeamPreference
) {
  return [...preferences, pref];
}

export function removePreference(
  preferences: TeamPreference[],
  id: string
) {
  return preferences.filter(
    (p) => p.id !== id
  );
}

export function updatePreference(
  preferences: TeamPreference[],
  updated: TeamPreference
) {
  return preferences.map((p) =>
    p.id === updated.id ? updated : p
  );
}