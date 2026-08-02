// src/lib/scheduleGenerator/presetHelpers.ts

import { buildConfigFromPreset, PresetName } from "./buildConfig";
import type { LeagueGeneratorConfig } from "./types";

export function loadPreset(presetName: PresetName): LeagueGeneratorConfig {
  return buildConfigFromPreset(presetName);
}

export function duplicateConfig(
  config: LeagueGeneratorConfig
): LeagueGeneratorConfig {
  return JSON.parse(JSON.stringify(config));
}