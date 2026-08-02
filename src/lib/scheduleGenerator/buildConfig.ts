// src/lib/scheduleGenerator/buildConfig.ts

import type { LeagueGeneratorConfig } from "./types";
import { leaguePresets } from "./presets";
import { defaultTeamsByPreset } from "./defaultTeams";

export type PresetName = keyof typeof defaultTeamsByPreset;

export function buildConfigFromPreset(
  presetName: PresetName
): LeagueGeneratorConfig {
  return {
    ...leaguePresets[presetName],
    teams: defaultTeamsByPreset[presetName],
  };
}