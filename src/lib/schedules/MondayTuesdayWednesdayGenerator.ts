// src/lib/schedules/MondayTuesdayWednesdayGenerator.ts

import type {
  GenerateScheduleInput,
  ScheduleGame,
  ScheduleWeek,
  Team,
  TeamConstraint,
} from "./types";
import {
  TIME_SLOTS,
  WEEKDAY_REGULAR_BYE_COUNTS,
} from "src/lib/schedules/constraints";
import { addWeeks, buildGame, getMatchupKey } from "./weekBuilder";

const MAX_ATTEMPTS = 2000;
const MAX_NON_PREFERRED_GAMES = 2;

type Matchup = [Team, Team];

const shuffle = <T,>(items: T[]) =>
  [...items].sort(() => Math.random() - 0.5);

function buildAllMatchups(teams: Team[]): Matchup[] {
  const matchups: Matchup[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matchups.push([teams[i], teams[j]]);
    }
  }

  return shuffle(matchups);
}

function getWeekSlots(league: GenerateScheduleInput["league"], week: number) {
  return week >= 9 ? TIME_SLOTS[league].slice(1) : TIME_SLOTS[league];
}

function getGamesNeeded(teamCount: number, byeCount: number) {
  return (teamCount - byeCount) / 2;
}

function getConstraint(teamId: string, constraints: TeamConstraint[]) {
  return constraints.find((constraint) => constraint.teamId === teamId);
}

function hasPreferredTimes(teamId: string, constraints: TeamConstraint[]) {
  return (getConstraint(teamId, constraints)?.preferredTimes.length ?? 0) > 0;
}

function isPreferredTime(
  teamId: string,
  time: string,
  constraints: TeamConstraint[]
) {
  const preferredTimes = getConstraint(teamId, constraints)?.preferredTimes ?? [];

  if (!preferredTimes.length) return true;

  return preferredTimes.includes(time);
}

function wouldBreakPreferredLimit(params: {
  team1: Team;
  team2: Team;
  time: string;
  constraints: TeamConstraint[];
  nonPreferredCounts: Record<string, number>;
}) {
  const { team1, team2, time, constraints, nonPreferredCounts } = params;

  return [team1.id, team2.id].some((teamId) => {
    if (!hasPreferredTimes(teamId, constraints)) return false;
    if (isPreferredTime(teamId, time, constraints)) return false;

    return (nonPreferredCounts[teamId] ?? 0) >= MAX_NON_PREFERRED_GAMES;
  });
}

function trackPreferredTimeUsage(params: {
  team1: Team;
  team2: Team;
  time: string;
  constraints: TeamConstraint[];
  nonPreferredCounts: Record<string, number>;
}) {
  const { team1, team2, time, constraints, nonPreferredCounts } = params;

  [team1.id, team2.id].forEach((teamId) => {
    if (!hasPreferredTimes(teamId, constraints)) return;
    if (isPreferredTime(teamId, time, constraints)) return;

    nonPreferredCounts[teamId] = (nonPreferredCounts[teamId] ?? 0) + 1;
  });
}

function buildByePlan(
  teams: Team[],
  constraints: TeamConstraint[]
): Record<number, Team[]> {
  for (let attempt = 1; attempt <= 500; attempt++) {
    const byePlan: Record<number, Team[]> = {};
    const byeCounts: Record<string, number> = {};

    teams.forEach((team) => {
      byeCounts[team.id] = 0;
    });

    let failed = false;

    for (let week = 1; week <= 10; week++) {
      const requiredByes = WEEKDAY_REGULAR_BYE_COUNTS[week];

      const eligible = shuffle(
        teams.filter((team) => {
          if (byeCounts[team.id] >= 2) return false;

          const constraint = getConstraint(team.id, constraints);

          if (constraint?.avoidByeWeeks.includes(week)) return false;

          return true;
        })
      ).sort((a, b) => byeCounts[a.id] - byeCounts[b.id]);

      if (eligible.length < requiredByes) {
        failed = true;
        break;
      }

      const selected = eligible.slice(0, requiredByes);
      byePlan[week] = selected;

      selected.forEach((team) => {
        byeCounts[team.id] += 1;
      });
    }

    const valid =
      !failed &&
      Object.keys(byePlan).length === 10 &&
      teams.every((team) => byeCounts[team.id] === 2);

    if (valid) {
      return byePlan;
    }
  }

  throw new Error("Could not build valid weekday bye plan.");
}

function chooseMatchup(params: {
  remainingUnique: Matchup[];
  duplicatePool: Matchup[];
  byeIds: Set<string>;
  usedTeamIds: Set<string>;
  lastWeekMatchups: Set<string>;
  matchupCounts: Map<string, number>;
  time: string;
  constraints: TeamConstraint[];
  nonPreferredCounts: Record<string, number>;
}) {
  const {
    remainingUnique,
    duplicatePool,
    byeIds,
    usedTeamIds,
    lastWeekMatchups,
    matchupCounts,
    time,
    constraints,
    nonPreferredCounts,
  } = params;

  const canUse = ([team1, team2]: Matchup) => {
    if (byeIds.has(team1.id) || byeIds.has(team2.id)) return false;
    if (usedTeamIds.has(team1.id) || usedTeamIds.has(team2.id)) return false;

    const key = getMatchupKey(team1.id, team2.id);

    if (lastWeekMatchups.has(key)) return false;

    return !wouldBreakPreferredLimit({
      team1,
      team2,
      time,
      constraints,
      nonPreferredCounts,
    });
  };

  const uniqueIndex = remainingUnique.findIndex(canUse);

  if (uniqueIndex !== -1) {
    return remainingUnique.splice(uniqueIndex, 1)[0];
  }

  const duplicateMatchup = shuffle(duplicatePool)
    .filter(canUse)
    .sort((a, b) => {
      const keyA = getMatchupKey(a[0].id, a[1].id);
      const keyB = getMatchupKey(b[0].id, b[1].id);

      return (matchupCounts.get(keyA) ?? 0) - (matchupCounts.get(keyB) ?? 0);
    })[0];

  return duplicateMatchup ?? null;
}

function buildRegularWeeks(input: GenerateScheduleInput): ScheduleWeek[] | null {
  const { league, teams, startDate, constraints } = input;

  const byePlan = buildByePlan(teams, constraints);
  const allMatchups = buildAllMatchups(teams);
  const remainingUnique = [...allMatchups];
  const duplicatePool = [...allMatchups];

  const matchupCounts = new Map<string, number>();
  const nonPreferredCounts: Record<string, number> = {};

  teams.forEach((team) => {
    nonPreferredCounts[team.id] = 0;
  });

  let lastWeekMatchups = new Set<string>();

  const weeks: ScheduleWeek[] = [];

  for (let week = 1; week <= 10; week++) {
    const date = addWeeks(startDate, week - 1);
    const byes = byePlan[week] ?? [];
    const byeIds = new Set(byes.map((team) => team.id));
    const slots = getWeekSlots(league, week);
    const gamesNeeded = getGamesNeeded(teams.length, byes.length);

    if (!Number.isInteger(gamesNeeded) || gamesNeeded > slots.length) {
      return null;
    }

    const games: ScheduleGame[] = [];
    const usedTeamIds = new Set<string>();
    const thisWeekMatchups = new Set<string>();

    for (let index = 0; index < gamesNeeded; index++) {
      const time = slots[index];

      const matchup = chooseMatchup({
        remainingUnique,
        duplicatePool,
        byeIds,
        usedTeamIds,
        lastWeekMatchups,
        matchupCounts,
        time,
        constraints,
        nonPreferredCounts,
      });

      if (!matchup) return null;

      const [team1, team2] = matchup;
      const key = getMatchupKey(team1.id, team2.id);

      usedTeamIds.add(team1.id);
      usedTeamIds.add(team2.id);
      thisWeekMatchups.add(key);
      matchupCounts.set(key, (matchupCounts.get(key) ?? 0) + 1);

      trackPreferredTimeUsage({
        team1,
        team2,
        time,
        constraints,
        nonPreferredCounts,
      });

      games.push(
        buildGame({
          league,
          week,
          date,
          time,
          team1,
          team2,
          index,
          type: "regular",
        })
      );
    }

    weeks.push({
      week,
      date,
      label: week === 6 ? "Registration" : undefined,
      games,
      byes,
    });

    lastWeekMatchups = thisWeekMatchups;
  }

  if (remainingUnique.length > 0) return null;

  return weeks;
}

function validateWeeknightSchedule(
  weeks: ScheduleWeek[],
  teams: Team[],
  constraints: TeamConstraint[]
) {
  const errors: string[] = [];
  const byeCounts: Record<string, number> = {};
  const matchupCounts = new Map<string, number>();
  const nonPreferredCounts: Record<string, number> = {};

  let previousWeekMatchups = new Set<string>();

  teams.forEach((team) => {
    byeCounts[team.id] = 0;
    nonPreferredCounts[team.id] = 0;
  });

  weeks
    .filter((week) => week.week <= 10)
    .forEach((week) => {
      const thisWeekMatchups = new Set<string>();

      (week.byes ?? []).forEach((team) => {
        byeCounts[team.id] += 1;

        const constraint = getConstraint(team.id, constraints);

        if (constraint?.avoidByeWeeks.includes(week.week)) {
          errors.push(`${team.name} has a bye in avoided Week ${week.week}.`);
        }
      });

      week.games.forEach((game) => {
        const key = getMatchupKey(game.team1.id, game.team2.id);

        if (previousWeekMatchups.has(key)) {
          errors.push(`Back-to-back matchup found in Week ${week.week}.`);
        }

        [game.team1, game.team2].forEach((team) => {
          if (!hasPreferredTimes(team.id, constraints)) return;
          if (isPreferredTime(team.id, game.time, constraints)) return;

          nonPreferredCounts[team.id] += 1;
        });

        matchupCounts.set(key, (matchupCounts.get(key) ?? 0) + 1);
        thisWeekMatchups.add(key);
      });

      previousWeekMatchups = thisWeekMatchups;
    });

  teams.forEach((team) => {
    if (byeCounts[team.id] !== 2) {
      errors.push(`${team.name} has ${byeCounts[team.id]} byes.`);
    }

    if (
      hasPreferredTimes(team.id, constraints) &&
      nonPreferredCounts[team.id] > MAX_NON_PREFERRED_GAMES
    ) {
      errors.push(
        `${team.name} has ${nonPreferredCounts[team.id]} non-preferred games. Max allowed is ${MAX_NON_PREFERRED_GAMES}.`
      );
    }
  });

  buildAllMatchups(teams).forEach(([team1, team2]) => {
    const key = getMatchupKey(team1.id, team2.id);

    if ((matchupCounts.get(key) ?? 0) < 1) {
      errors.push(`${team1.name} vs ${team2.name} is missing.`);
    }
  });

  return errors;
}

export function buildWeeknightSchedule(
  input: GenerateScheduleInput
): ScheduleWeek[] {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const regularWeeks = buildRegularWeeks(input);

    if (!regularWeeks) continue;

    const errors = validateWeeknightSchedule(
      regularWeeks,
      input.teams,
      input.constraints
    );

    if (errors.length > 0) continue;

    return [
      ...regularWeeks,
      {
        week: 11,
        date: addWeeks(input.startDate, 10),
        label: "Playoffs/Championship",
        games: [],
        byes: [],
      },
    ];
  }

  throw new Error("Could not generate a valid weeknight schedule.");
}