// src/features/scheduleGenerator/utils/validateSchedule.ts

import type {
  GeneratedSchedule,
  ScheduleGame,
  ValidationResult,
} from "../types";

export function validateSchedule(
  schedule: GeneratedSchedule
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const matchupSet =
    new Set<string>();

  const gameIdSet =
    new Set<string>();

  const weeklyTeamSet =
    new Map<number, Set<string>>();

  const weeklyGameCount =
    new Map<number, number>();

  if (!schedule.games.length) {
    errors.push("Schedule has no games");
  }

  for (const game of schedule.games) {
    validateGameShape(game, errors);

    if (game.gameId) {
      if (gameIdSet.has(game.gameId)) {
        errors.push(
          `Duplicate gameId detected: ${game.gameId}`
        );
      }

      gameIdSet.add(game.gameId);
    }

    if (game.week < 1) {
      errors.push(
        `Game ${game.gameId} has invalid week: ${game.week}`
      );
    }

    if (game.slot < 1) {
      errors.push(
        `Game ${game.gameId} has invalid slot: ${game.slot}`
      );
    }

    if (!weeklyTeamSet.has(game.week)) {
      weeklyTeamSet.set(
        game.week,
        new Set<string>()
      );
    }

    const teamsThisWeek =
      weeklyTeamSet.get(game.week)!;

    weeklyGameCount.set(
      game.week,
      (weeklyGameCount.get(game.week) ?? 0) + 1
    );

    if (
      game.homeTeamId ===
      game.awayTeamId
    ) {
      errors.push(
        `Self-match detected in week ${game.week}: ${game.homeTeamId}`
      );
    }

    if (teamsThisWeek.has(game.homeTeamId)) {
      errors.push(
        `Team ${game.homeTeamId} plays more than once in week ${game.week}`
      );
    }

    if (teamsThisWeek.has(game.awayTeamId)) {
      errors.push(
        `Team ${game.awayTeamId} plays more than once in week ${game.week}`
      );
    }

    teamsThisWeek.add(game.homeTeamId);
    teamsThisWeek.add(game.awayTeamId);

    const matchupKey = [
      game.homeTeamId,
      game.awayTeamId,
    ]
      .sort()
      .join("-");

    if (matchupSet.has(matchupKey)) {
      warnings.push(
        `Repeat matchup: ${game.homeTeamId} vs ${game.awayTeamId}`
      );
    } else {
      matchupSet.add(matchupKey);
    }
  }

  for (const week of schedule.weeks) {
    const byeTeams =
      schedule.byes[week.week] ??
      week.byes ??
      [];

    const teamsPlaying =
      weeklyTeamSet.get(week.week) ??
      new Set<string>();

    for (const byeTeam of byeTeams) {
      if (teamsPlaying.has(byeTeam)) {
        errors.push(
          `Team ${byeTeam} has a bye and also plays in week ${week.week}`
        );
      }
    }

    if (byeTeams.length > 1) {
      warnings.push(
        `Week ${week.week} has multiple byes: ${byeTeams.join(", ")}`
      );
    }

    if (!week.games.length) {
      warnings.push(
        `Week ${week.week} has no games`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateGameShape(
  game: ScheduleGame,
  errors: string[]
) {
  if (!game.gameId) {
    errors.push("Game is missing gameId");
  }

  if (!game.league) {
    errors.push(
      `Game ${game.gameId} is missing league`
    );
  }

  if (!Number.isFinite(game.week)) {
    errors.push(
      `Game ${game.gameId} is missing week`
    );
  }

  if (!Number.isFinite(game.slot)) {
    errors.push(
      `Game ${game.gameId} is missing slot`
    );
  }

  if (!game.time) {
    errors.push(
      `Game ${game.gameId} is missing time`
    );
  }

  if (!game.homeTeamId) {
    errors.push(
      `Game ${game.gameId} is missing homeTeamId`
    );
  }

  if (!game.awayTeamId) {
    errors.push(
      `Game ${game.gameId} is missing awayTeamId`
    );
  }
}