// src/features/scheduleGenerator/utils/validateLeagueSetup.ts

import {
  leagueConstraints,
  type LeagueKey,
} from "./config/leagueConstraints";

type Input = {
  league: LeagueKey;
  teams: string[];
};

export function validateLeagueSetup({
  league,
  teams,
}: Input) {
  const config = leagueConstraints[league];

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config) {
    errors.push(`Unknown league: ${league}`);
    return { isValid: false, errors, warnings };
  }

  if (teams.length < config.minTeams) {
    errors.push(
      `${league} requires at least ${config.minTeams} teams. Current: ${teams.length}`
    );
  }

  const uniqueTeams = new Set(teams);

  if (uniqueTeams.size !== teams.length) {
    errors.push("Duplicate team IDs found.");
  }

  if (
    config.preferredMaxTeams &&
    teams.length > config.preferredMaxTeams
  ) {
    warnings.push(
      `${league} has ${teams.length} teams. Schedule will still generate, but this is above the usual size of ${config.preferredMaxTeams}.`
    );
  }

  const totalWeeks = config.totalWeeks;
  const byesPerWeek = teams.length % 2;
  const totalByes = byesPerWeek * totalWeeks;

  if (
    byesPerWeek > 0 &&
    totalByes % teams.length !== 0
  ) {
    warnings.push(
      `Bye math is uneven: ${totalByes} total byes across ${teams.length} teams. Some teams may need extra byes unless bye-heavy weeks are added.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}