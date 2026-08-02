// src/lib/scheduleGenerator/validation.ts

import type { LeagueGeneratorConfig, ValidationResult } from "./types";
import { getWeeklyCapacity } from "./helpers";

export function validateGeneratorConfig(
  config: LeagueGeneratorConfig
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.teams.length < 2) {
    errors.push("At least 2 teams are required.");
  }

  if (config.regularSeasonWeeks < 1) {
    errors.push("Regular season must have at least 1 week.");
  }

  if (config.gameSlots.length < 1) {
    errors.push("At least 1 game slot is required.");
  }

  if (config.playoffTeams > config.teams.length) {
    errors.push("Playoff teams cannot be greater than total teams.");
  }

  const { byesPerWeek } = getWeeklyCapacity(
    config.teams.length,
    config.gameSlots.length
  );

  const totalByeSlots = byesPerWeek * config.regularSeasonWeeks;
  const requestedByeSlots = config.targetByesPerTeam * config.teams.length;

  if (!config.allowUnevenByes && totalByeSlots !== requestedByeSlots) {
    warnings.push(
      `Bye math does not line up evenly. This setup creates ${totalByeSlots} total bye slots, but requested byes require ${requestedByeSlots}.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}