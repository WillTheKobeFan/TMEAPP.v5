// src/lib/schedules/validation.ts

import type {
  LeagueNight,
  ScheduleWeek,
  Team,
  ValidationResult,
} from "./types";
import {
  SUNDAY_REGULAR_BYE_COUNTS,
  WEEKDAY_REGULAR_BYE_COUNTS,
} from "./constraints";
import { getMatchupKey } from "./weekBuilder";

type ValidateScheduleInput = {
  league: LeagueNight;
  teams: Team[];
  weeks: ScheduleWeek[];
};

function getTeamName(teams: Team[], teamId: string) {
  return teams.find((team) => team.id === teamId)?.name ?? teamId;
}

export function validateSchedule({
  league,
  teams,
  weeks,
}: ValidateScheduleInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const regularWeeks = weeks.filter((week) => week.week <= 10);

  validateByeCounts({ teams, regularWeeks, errors });
  validateWeekByeCounts({ league, regularWeeks, errors });
  validateBackToBackMatchups({ regularWeeks, errors });

  if (league === "Sunday") {
    validateSundayRoundRobin({ teams, regularWeeks, errors });
    validateSundayChampionshipCarryover({ teams, regularWeeks, errors });
  } else {
    validateWeeknightCoverage({ teams, regularWeeks, warnings });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateByeCounts(params: {
  teams: Team[];
  regularWeeks: ScheduleWeek[];
  errors: string[];
}) {
  const { teams, regularWeeks, errors } = params;

  teams.forEach((team) => {
    const byeCount = regularWeeks.reduce((count, week) => {
      const visibleBye = week.byes.some((bye) => bye.id === team.id);
      const hiddenBye = week.hiddenByes?.some((bye) => bye.id === team.id);

      return count + (visibleBye || hiddenBye ? 1 : 0);
    }, 0);

    if (byeCount !== 2) {
      errors.push(`${team.name} has ${byeCount} bye(s). Target is exactly 2.`);
    }
  });
}

function validateWeekByeCounts(params: {
  league: LeagueNight;
  regularWeeks: ScheduleWeek[];
  errors: string[];
}) {
  const { league, regularWeeks, errors } = params;

  const expectedByeCounts =
    league === "Sunday" ? SUNDAY_REGULAR_BYE_COUNTS : WEEKDAY_REGULAR_BYE_COUNTS;

  regularWeeks.forEach((week) => {
    const visibleByes = week.byes.length;
    const hiddenByes = week.hiddenByes?.length ?? 0;
    const totalByes = visibleByes + hiddenByes;
    const expectedByes = expectedByeCounts[week.week];

    if (totalByes !== expectedByes) {
      errors.push(
        `Week ${week.week} has ${totalByes} total bye(s). Expected ${expectedByes}.`
      );
    }
  });
}

function validateBackToBackMatchups(params: {
  regularWeeks: ScheduleWeek[];
  errors: string[];
}) {
  const { regularWeeks, errors } = params;

  let previousWeekMatchups = new Set<string>();

  regularWeeks.forEach((week) => {
    const currentWeekMatchups = new Set<string>();

    week.games
      .filter((game) => game.type === "regular")
      .forEach((game) => {
        const matchupKey = getMatchupKey(game.team1.id, game.team2.id);

        if (previousWeekMatchups.has(matchupKey)) {
          errors.push(
            `Back-to-back matchup found in Week ${week.week}: ${game.team1.name}/${game.team2.name}.`
          );
        }

        currentWeekMatchups.add(matchupKey);
      });

    previousWeekMatchups = currentWeekMatchups;
  });
}

function validateSundayRoundRobin(params: {
  teams: Team[];
  regularWeeks: ScheduleWeek[];
  errors: string[];
}) {
  const { teams, regularWeeks, errors } = params;

  const expectedPairs = new Set<string>();

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      expectedPairs.add(getMatchupKey(teams[i].id, teams[j].id));
    }
  }

  const playedPairs = new Map<string, number>();

  regularWeeks.forEach((week) => {
    week.games
      .filter((game) => game.type === "regular")
      .forEach((game) => {
        const key = getMatchupKey(game.team1.id, game.team2.id);
        playedPairs.set(key, (playedPairs.get(key) ?? 0) + 1);
      });
  });

  expectedPairs.forEach((pairKey) => {
    const count = playedPairs.get(pairKey) ?? 0;
    const [team1Id, team2Id] = pairKey.split("___");
    const team1Name = getTeamName(teams, team1Id);
    const team2Name = getTeamName(teams, team2Id);

    if (count === 0) {
      errors.push(`Sunday missing matchup: ${team1Name}/${team2Name}.`);
    }

    if (count > 1) {
      errors.push(
        `Sunday duplicate matchup: ${team1Name}/${team2Name} appears ${count} times.`
      );
    }
  });
}

function validateSundayChampionshipCarryover(params: {
  teams: Team[];
  regularWeeks: ScheduleWeek[];
  errors: string[];
}) {
  const { teams, regularWeeks, errors } = params;

  const weekOne = regularWeeks.find((week) => week.week === 1);
  if (!weekOne) return;

  const championshipGame = weekOne.games.find(
    (game) => game.type === "championship"
  );

  if (!championshipGame) return;

  const championshipTeamIds = [
    championshipGame.team1.id,
    championshipGame.team2.id,
  ];

  weekOne.games
    .filter((game) => game.type === "regular")
    .forEach((game) => {
      if (
        championshipTeamIds.includes(game.team1.id) ||
        championshipTeamIds.includes(game.team2.id)
      ) {
        errors.push(
          `Championship team was double-booked in Week 1 regular game: ${game.team1.name}/${game.team2.name}.`
        );
      }
    });

  championshipTeamIds.forEach((teamId) => {
    const hasHiddenBye = weekOne.hiddenByes?.some((team) => team.id === teamId);

    if (!hasHiddenBye) {
      errors.push(
        `${getTeamName(
          teams,
          teamId
        )} is missing hidden Week 1 championship carryover bye.`
      );
    }
  });
}

function validateWeeknightCoverage(params: {
  teams: Team[];
  regularWeeks: ScheduleWeek[];
  warnings: string[];
}) {
  const { teams, regularWeeks, warnings } = params;

  teams.forEach((team) => {
    const opponents = new Set<string>();

    regularWeeks.forEach((week) => {
      week.games
        .filter((game) => game.type === "regular")
        .forEach((game) => {
          if (game.team1.id === team.id) opponents.add(game.team2.id);
          if (game.team2.id === team.id) opponents.add(game.team1.id);
        });
    });

    const expectedOpponentCount = teams.length - 1;

    if (opponents.size < expectedOpponentCount) {
      warnings.push(
        `${team.name} played ${opponents.size}/${expectedOpponentCount} possible opponents.`
      );
    }
  });
}