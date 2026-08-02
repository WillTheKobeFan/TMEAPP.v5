// src/utils/schedule-generators/weekdayBase.ts

import type {
  GeneratedGame,
  GeneratedWeek,
  GenerateScheduleInput,
  GenerateScheduleResult,
  TeamTimeConstraint,
} from "./types";
import {
  addDays,
  createGame,
  matchupKey,
  shuffle,
  validateExactByeCount,
  validateNoBackToBackMatchups,
  validateNoTeamPlaysTwiceInWeek,
} from "./shared";

const MAX_ATTEMPTS = 1500;

type WeekdayBaseOptions = {
  requiredByes?: number;
  regularWeeks?: number;
  lateSeasonReducedWeeks?: number[];
  lateSeasonTimeSlots?: string[];
  avoidFinalWeekByeTeamIds?: string[];
  preferredEarlyTeamIds?: string[];
  preferredLateTeamIds?: string[];
};

type TimeConstraintCounts = Record<string, Record<string, number>>;

export function generateWeekdayBaseSchedule(
  input: GenerateScheduleInput,
  options: WeekdayBaseOptions = {},
): GenerateScheduleResult {
  const {
    requiredByes = 2,
    regularWeeks = 10,
    lateSeasonReducedWeeks = [9, 10],
    lateSeasonTimeSlots,
    avoidFinalWeekByeTeamIds = [],
    preferredEarlyTeamIds = [],
    preferredLateTeamIds = [],
  } = options;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const weeks = generateWeekdayAttempt(input, {
      requiredByes,
      regularWeeks,
      lateSeasonReducedWeeks,
      lateSeasonTimeSlots,
      avoidFinalWeekByeTeamIds,
      preferredEarlyTeamIds,
      preferredLateTeamIds,
      seed: input.seed + attempt * 97,
    });

    const errors = validateWeekdaySchedule(weeks, input, {
      requiredByes,
      regularWeeks,
      avoidFinalWeekByeTeamIds,
    });

    if (errors.length === 0) {
      return {
        success: true,
        weeks,
        errors: [],
        attempts: attempt,
      };
    }
  }

  return {
    success: false,
    weeks: [],
    errors: [
      `Could not generate a valid ${input.leagueNight} schedule with current constraints.`,
      "Try regenerating again or relaxing one constraint.",
    ],
    attempts: MAX_ATTEMPTS,
  };
}

function generateWeekdayAttempt(
  input: GenerateScheduleInput,
  options: {
    requiredByes: number;
    regularWeeks: number;
    lateSeasonReducedWeeks: number[];
    lateSeasonTimeSlots?: string[];
    avoidFinalWeekByeTeamIds: string[];
    preferredEarlyTeamIds: string[];
    preferredLateTeamIds: string[];
    seed: number;
  },
): GeneratedWeek[] {
  const { teams, startDate, timeSlots, venue, leagueNight, seasonId } = input;

  const weeks: GeneratedWeek[] = [];
  const teamIds = teams.map((team) => team.id);
  const byePlan = buildWeekdayByePlan(teamIds, options);

  const matchupCounts: Record<string, number> = {};
  const timeConstraintCounts: TimeConstraintCounts = {};

  (input.timeConstraints ?? []).forEach((constraint) => {
    timeConstraintCounts[constraint.teamId] = {};
  });

  let previousWeekMatchups = new Set<string>();

  for (let weekNumber = 1; weekNumber <= options.regularWeeks; weekNumber++) {
    const date = addDays(startDate, (weekNumber - 1) * 7);
    const byes = byePlan[weekNumber] ?? [];
    const availableTeamIds = teamIds.filter((teamId) => !byes.includes(teamId));

    const allowedSlots = getAllowedSlotsForWeek({
      weekNumber,
      timeSlots,
      lateSeasonReducedWeeks: options.lateSeasonReducedWeeks,
      lateSeasonTimeSlots: options.lateSeasonTimeSlots,
    });

    const pairs = buildPairsForWeek({
      teamIds: availableTeamIds,
      matchupCounts,
      previousWeekMatchups,
      seed: options.seed + weekNumber * 101,
    });

    if (!pairs) {
      return [];
    }

    const orderedPairs = orderPairsByTimePreference({
      pairs,
      preferredEarlyTeamIds: options.preferredEarlyTeamIds,
      preferredLateTeamIds: options.preferredLateTeamIds,
    });

    const scheduledPairs = assignWeekdayTimes({
      pairs: orderedPairs,
      allowedSlots,
      timeConstraints: input.timeConstraints ?? [],
      timeConstraintCounts,
    });

    if (!scheduledPairs) {
      return [];
    }

    const games = scheduledPairs.map(({ pair, time }, index) => {
      const [team1Id, team2Id] = pair;
      const key = matchupKey(team1Id, team2Id);
      matchupCounts[key] = (matchupCounts[key] ?? 0) + 1;

      updateTimeConstraintCounts({
        pair,
        time,
        timeConstraints: input.timeConstraints ?? [],
        timeConstraintCounts,
      });

      return createGame({
        id: `${leagueNight.toLowerCase()}_w${weekNumber}_g${index + 1}`,
        league: leagueNight,
        seasonId,
        week: weekNumber,
        date,
        time,
        venue,
        team1Id,
        team2Id,
        teams,
        sortOrder: index + 1,
      });
    });

    previousWeekMatchups = new Set(
      games.map((game) => matchupKey(game.team1Id, game.team2Id)),
    );

    weeks.push({
      week: weekNumber,
      date,
      games,
      byes,
    });
  }

  addWeekdayPlayoffWeek(weeks, input);

  return weeks;
}

function buildWeekdayByePlan(
  teamIds: string[],
  options: {
    requiredByes: number;
    regularWeeks: number;
    lateSeasonReducedWeeks: number[];
    lateSeasonTimeSlots?: string[];
    avoidFinalWeekByeTeamIds: string[];
    preferredEarlyTeamIds: string[];
    preferredLateTeamIds: string[];
    seed: number;
  },
) {
  const byesByWeek: Record<number, string[]> = {};

  for (let week = 1; week <= options.regularWeeks; week++) {
    byesByWeek[week] = [];
  }

  const weekCapacity: Record<number, number> = {};

  for (let week = 1; week <= options.regularWeeks; week++) {
    weekCapacity[week] = options.lateSeasonReducedWeeks.includes(week) ? 3 : 1;
  }

  const byeNeeds: string[] = [];

  teamIds.forEach((teamId) => {
    for (let i = 0; i < options.requiredByes; i++) {
      byeNeeds.push(teamId);
    }
  });

  const shuffledByeNeeds = shuffle(byeNeeds, options.seed);

  shuffledByeNeeds.forEach((teamId, index) => {
    const candidateWeeks = shuffle(
      Object.keys(weekCapacity)
        .map(Number)
        .filter((week) => {
          if (weekCapacity[week] <= 0) return false;
          if (byesByWeek[week].includes(teamId)) return false;

          const finalRegularWeek = options.regularWeeks;

          if (
            week === finalRegularWeek &&
            options.avoidFinalWeekByeTeamIds.includes(teamId)
          ) {
            return false;
          }

          return true;
        }),
      options.seed + index * 17,
    );

    const selectedWeek = candidateWeeks[0];

    if (!selectedWeek) return;

    byesByWeek[selectedWeek].push(teamId);
    weekCapacity[selectedWeek] -= 1;
  });

  return byesByWeek;
}

function buildPairsForWeek({
  teamIds,
  matchupCounts,
  previousWeekMatchups,
  seed,
}: {
  teamIds: string[];
  matchupCounts: Record<string, number>;
  previousWeekMatchups: Set<string>;
  seed: number;
}) {
  const remaining = shuffle(teamIds, seed);
  const pairs: [string, string][] = [];

  while (remaining.length >= 2) {
    let bestPair: [string, string] | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        const team1Id = remaining[i];
        const team2Id = remaining[j];
        const key = matchupKey(team1Id, team2Id);

        if (previousWeekMatchups.has(key)) continue;

        const duplicatePenalty = (matchupCounts[key] ?? 0) * 100;
        const positionPenalty = Math.abs(i - j);

        const score = duplicatePenalty + positionPenalty;

        if (score < bestScore) {
          bestScore = score;
          bestPair = [team1Id, team2Id];
        }
      }
    }

    if (!bestPair) {
      return null;
    }

    const [team1Id, team2Id] = bestPair;

    remaining.splice(remaining.indexOf(team1Id), 1);
    remaining.splice(remaining.indexOf(team2Id), 1);

    pairs.push(bestPair);
  }

  return pairs;
}

function getAllowedSlotsForWeek({
  weekNumber,
  timeSlots,
  lateSeasonReducedWeeks,
  lateSeasonTimeSlots,
}: {
  weekNumber: number;
  timeSlots: string[];
  lateSeasonReducedWeeks: number[];
  lateSeasonTimeSlots?: string[];
}) {
  if (!lateSeasonReducedWeeks.includes(weekNumber)) {
    return timeSlots;
  }

  return lateSeasonTimeSlots ?? timeSlots.slice(1);
}

function orderPairsByTimePreference({
  pairs,
  preferredEarlyTeamIds,
  preferredLateTeamIds,
}: {
  pairs: [string, string][];
  preferredEarlyTeamIds: string[];
  preferredLateTeamIds: string[];
}) {
  return [...pairs].sort((a, b) => {
    const aHasEarly =
      preferredEarlyTeamIds.includes(a[0]) ||
      preferredEarlyTeamIds.includes(a[1]);

    const bHasEarly =
      preferredEarlyTeamIds.includes(b[0]) ||
      preferredEarlyTeamIds.includes(b[1]);

    const aHasLate =
      preferredLateTeamIds.includes(a[0]) ||
      preferredLateTeamIds.includes(a[1]);

    const bHasLate =
      preferredLateTeamIds.includes(b[0]) ||
      preferredLateTeamIds.includes(b[1]);

    if (aHasEarly && !bHasEarly) return -1;
    if (!aHasEarly && bHasEarly) return 1;

    if (aHasLate && !bHasLate) return 1;
    if (!aHasLate && bHasLate) return -1;

    return 0;
  });
}

function getConstraintForTeam(
  teamId: string,
  timeConstraints: TeamTimeConstraint[],
) {
  return timeConstraints.find((constraint) => constraint.teamId === teamId);
}

function pairAllowedAtTime(params: {
  pair: [string, string];
  time: string;
  timeConstraints: TeamTimeConstraint[];
}) {
  const [team1Id, team2Id] = params.pair;

  const team1Constraint = getConstraintForTeam(
    team1Id,
    params.timeConstraints,
  );

  const team2Constraint = getConstraintForTeam(
    team2Id,
    params.timeConstraints,
  );

  if (
    team1Constraint?.allowedTimes &&
    !team1Constraint.allowedTimes.includes(params.time)
  ) {
    return false;
  }

  if (
    team2Constraint?.allowedTimes &&
    !team2Constraint.allowedTimes.includes(params.time)
  ) {
    return false;
  }

  return true;
}

function getTimeScore(params: {
  pair: [string, string];
  time: string;
  timeConstraints: TeamTimeConstraint[];
  timeConstraintCounts: TimeConstraintCounts;
}) {
  const [team1Id, team2Id] = params.pair;
  let score = 0;

  [team1Id, team2Id].forEach((teamId) => {
    const constraint = getConstraintForTeam(teamId, params.timeConstraints);

    if (!constraint?.preferredTimes?.includes(params.time)) {
      return;
    }

    const currentCount =
      params.timeConstraintCounts[teamId]?.[params.time] ?? 0;

    const target = constraint.targetPreferredGames ?? 999;

    if (currentCount < target) {
      score -= 50;
    } else {
      score -= 5;
    }
  });

  return score;
}

function assignWeekdayTimes(params: {
  pairs: [string, string][];
  allowedSlots: string[];
  timeConstraints: TeamTimeConstraint[];
  timeConstraintCounts: TimeConstraintCounts;
}) {
  const remainingSlots = [...params.allowedSlots];
  const scheduled: { pair: [string, string]; time: string }[] = [];

  const orderedPairs = [...params.pairs].sort((a, b) => {
    const aHasRestriction = a.some((teamId) =>
      getConstraintForTeam(teamId, params.timeConstraints)?.allowedTimes,
    );

    const bHasRestriction = b.some((teamId) =>
      getConstraintForTeam(teamId, params.timeConstraints)?.allowedTimes,
    );

    if (aHasRestriction && !bHasRestriction) return -1;
    if (!aHasRestriction && bHasRestriction) return 1;

    return 0;
  });

  for (const pair of orderedPairs) {
    const possibleSlots = remainingSlots
      .filter((time) =>
        pairAllowedAtTime({
          pair,
          time,
          timeConstraints: params.timeConstraints,
        }),
      )
      .sort((timeA, timeB) => {
        const scoreA = getTimeScore({
          pair,
          time: timeA,
          timeConstraints: params.timeConstraints,
          timeConstraintCounts: params.timeConstraintCounts,
        });

        const scoreB = getTimeScore({
          pair,
          time: timeB,
          timeConstraints: params.timeConstraints,
          timeConstraintCounts: params.timeConstraintCounts,
        });

        return scoreA - scoreB;
      });

    const selectedTime = possibleSlots[0];

    if (!selectedTime) {
      return null;
    }

    scheduled.push({ pair, time: selectedTime });
    remainingSlots.splice(remainingSlots.indexOf(selectedTime), 1);
  }

  return scheduled;
}

function updateTimeConstraintCounts(params: {
  pair: [string, string];
  time: string;
  timeConstraints: TeamTimeConstraint[];
  timeConstraintCounts: TimeConstraintCounts;
}) {
  params.pair.forEach((teamId) => {
    const constraint = getConstraintForTeam(teamId, params.timeConstraints);

    if (!constraint?.preferredTimes?.includes(params.time)) return;

    if (!params.timeConstraintCounts[teamId]) {
      params.timeConstraintCounts[teamId] = {};
    }

    params.timeConstraintCounts[teamId][params.time] =
      (params.timeConstraintCounts[teamId][params.time] ?? 0) + 1;
  });
}

function addWeekdayPlayoffWeek(
  weeks: GeneratedWeek[],
  input: GenerateScheduleInput,
) {
  const playoffWeek = 11;
  const date = addDays(input.startDate, 10 * 7);

  const playoffTimes = input.timeSlots;

  weeks.push({
    week: playoffWeek,
    date,
    byes: [],
    games: [
      createGame({
        id: `${input.leagueNight.toLowerCase()}_w11_sf1`,
        league: input.leagueNight,
        seasonId: input.seasonId,
        week: playoffWeek,
        date,
        time: playoffTimes[0] ?? "7:00 PM",
        venue: input.venue,
        team1Id: "seed_1",
        team2Id: "seed_4",
        teams: input.teams,
        sortOrder: 1,
        type: "playoff",
        notes: "Semi-Finals",
      }),
      createGame({
        id: `${input.leagueNight.toLowerCase()}_w11_sf2`,
        league: input.leagueNight,
        seasonId: input.seasonId,
        week: playoffWeek,
        date,
        time: playoffTimes[1] ?? "8:00 PM",
        venue: input.venue,
        team1Id: "seed_2",
        team2Id: "seed_3",
        teams: input.teams,
        sortOrder: 2,
        type: "playoff",
        notes: "Semi-Finals",
      }),
      createGame({
        id: `${input.leagueNight.toLowerCase()}_w11_championship`,
        league: input.leagueNight,
        seasonId: input.seasonId,
        week: playoffWeek,
        date,
        time: playoffTimes[2] ?? "9:00 PM",
        venue: input.venue,
        team1Id: "winner_sf1",
        team2Id: "winner_sf2",
        teams: input.teams,
        sortOrder: 3,
        type: "championship",
        notes: "Championship",
      }),
    ],
    notes: ["Semi-Finals", "Championship"],
  });
}

function validateWeekdaySchedule(
  weeks: GeneratedWeek[],
  input: GenerateScheduleInput,
  options: {
    requiredByes: number;
    regularWeeks: number;
    avoidFinalWeekByeTeamIds: string[];
  },
) {
  const errors: string[] = [];
  const regularWeeks = weeks.filter((week) => week.week <= options.regularWeeks);

  if (regularWeeks.length !== options.regularWeeks) {
    errors.push(
      `${input.leagueNight} must generate ${options.regularWeeks} regular season weeks.`,
    );
    return errors;
  }

  regularWeeks.forEach((week) => {
    errors.push(...validateNoTeamPlaysTwiceInWeek(week));

    week.games.forEach((game) => {
      if (game.time === "TBD") {
        errors.push(`Week ${week.week}: one or more games still have TBD time.`);
      }
    });
  });

  errors.push(...validateNoBackToBackMatchups(regularWeeks));

  errors.push(
    ...validateExactByeCount({
      weeks: regularWeeks,
      teams: input.teams,
      requiredByes: options.requiredByes,
    }),
  );

  const finalRegularWeek = regularWeeks.find(
    (week) => week.week === options.regularWeeks,
  );

  options.avoidFinalWeekByeTeamIds.forEach((teamId) => {
    if (finalRegularWeek?.byes.includes(teamId)) {
      errors.push(`${teamId} cannot have a Week ${options.regularWeeks} bye.`);
    }
  });

  validateTimeConstraints({
    weeks: regularWeeks,
    input,
    errors,
  });

  return errors;
}

function validateTimeConstraints(params: {
  weeks: GeneratedWeek[];
  input: GenerateScheduleInput;
  errors: string[];
}) {
  const constraints = params.input.timeConstraints ?? [];

  constraints.forEach((constraint) => {
    const allowedTimes = constraint.allowedTimes;

    if (!allowedTimes?.length) return;

    params.weeks.forEach((week) => {
      week.games.forEach((game) => {
        const involvesTeam =
          game.team1Id === constraint.teamId ||
          game.team2Id === constraint.teamId;

        if (!involvesTeam) return;

        if (!allowedTimes.includes(game.time)) {
          params.errors.push(
            `Week ${week.week}: ${constraint.teamId} can only play ${allowedTimes.join(
              "/",
            )}.`,
          );
        }
      });
    });
  });
}