// src/utils/schedule-generators/sunday.ts

import type {
  GeneratedGame,
  GeneratedWeek,
  GenerateScheduleInput,
  GenerateScheduleResult,
  GeneratorTeam,
} from "./types";

const DEFAULT_VENUE = "YMCA";

const DEFAULT_WEEK_1_VISIBLE_BYE = "sun_tC"; // Edwards
const DEFAULT_LATE_ONLY_IDS = ["sun_tE", "sun_tH"]; // Timmy, Prince
const DEFAULT_AVOID_WEEK_10_BYE_IDS = ["sun_tB"]; // Tom

const DEFAULT_SUNDAY_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
const DEFAULT_WEEKS_8_TO_10_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM"];
const LATE_SLOTS = ["11:00 AM", "12:00 PM"];

type Pair = [string, string];

type SundayResolvedRules = {
  week1VisibleByeTeamId?: string;
  lateOnlyTeamIds: string[];
  avoidWeek10ByeTeamIds: string[];
  weeks8To10TimeSlots: string[];
};

type WeekPlan = {
  week: number;
  date: string;
  byes: string[];
  hiddenByes: string[];
  games: Pair[];
};

function resolveRules(input: GenerateScheduleInput): SundayResolvedRules {
  return {
    week1VisibleByeTeamId:
      input.sundayRules?.week1VisibleByeTeamId ?? DEFAULT_WEEK_1_VISIBLE_BYE,
    lateOnlyTeamIds:
      input.sundayRules?.lateOnlyTeamIds ?? DEFAULT_LATE_ONLY_IDS,
    avoidWeek10ByeTeamIds:
      input.sundayRules?.avoidWeek10ByeTeamIds ?? DEFAULT_AVOID_WEEK_10_BYE_IDS,
    weeks8To10TimeSlots:
      input.sundayRules?.weeks8To10TimeSlots ?? DEFAULT_WEEKS_8_TO_10_SLOTS,
  };
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createRng(seed: number) {
  let value = seed || 1;

  return function random() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getTeamName(teamId: string, teams: GeneratorTeam[]) {
  return teams.find((team) => team.id === teamId)?.teamName ?? teamId;
}

function matchupKey(a: string, b: string) {
  return [a, b].sort().join("__");
}

function getCombinations<T>(items: T[], size: number) {
  const results: T[][] = [];

  function walk(start: number, combo: T[]) {
    if (combo.length === size) {
      results.push([...combo]);
      return;
    }

    for (let i = start; i < items.length; i++) {
      combo.push(items[i]);
      walk(i + 1, combo);
      combo.pop();
    }
  }

  walk(0, []);
  return results;
}

function getWeekSlots(
  input: GenerateScheduleInput,
  rules: SundayResolvedRules,
  week: number,
) {
  if (week >= 8 && week <= 10) return rules.weeks8To10TimeSlots;
  return input.timeSlots.length > 0 ? input.timeSlots : DEFAULT_SUNDAY_SLOTS;
}

function getRegularGamesNeeded(week: number, hiddenByes: string[]) {
  if (week === 1 && hiddenByes.length === 2) return 3;
  if (week <= 7) return 4;
  return 3;
}

function getVisibleByesNeeded(week: number) {
  return week <= 7 ? 1 : 3;
}

function timeOrder(time: string) {
  const order = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  const index = order.indexOf(time);
  return index === -1 ? 999 : index;
}

function createGame(params: {
  input: GenerateScheduleInput;
  week: number;
  date: string;
  index: number;
  time: string;
  team1Id: string;
  team2Id: string;
  venue?: string;
  type?: "regular" | "playoff" | "championship";
}): GeneratedGame {
  const type = params.type ?? "regular";

  return {
    id: `${params.input.seasonId}_sun_w${params.week}_${type}_${params.index + 1}`,
    league: "Sunday",
    seasonId: params.input.seasonId,
    week: params.week,
    date: params.date,
    time: params.time,
    venue: params.venue ?? params.input.venue ?? DEFAULT_VENUE,

    team1Id: params.team1Id,
    team1Name: getTeamName(params.team1Id, params.input.teams),
    team2Id: params.team2Id,
    team2Name: getTeamName(params.team2Id, params.input.teams),

    team1Score: "",
    team2Score: "",
    winnerId: "",
    winnerName: "",

    status: "scheduled",
    type,
    resultType: "pending",

    sortOrder: params.index + 1,
    published: false,
    locked: false,
    notes: "",
  };
}

function sortGames(games: GeneratedGame[]) {
  return [...games]
    .sort((a, b) => timeOrder(a.time) - timeOrder(b.time))
    .map((game, index) => ({
      ...game,
      sortOrder: index + 1,
    }));
}

function getByeOptions(params: {
  week: number;
  teamIds: string[];
  hiddenByes: string[];
  previousOffTeamIds: Set<string>;
  offCounts: Record<string, number>;
  rules: SundayResolvedRules;
  random: () => number;
}) {
  const needed = getVisibleByesNeeded(params.week);
  const hiddenSet = new Set(params.hiddenByes);

  const week1Bye = params.rules.week1VisibleByeTeamId;

  if (
    params.week === 1 &&
    week1Bye &&
    params.teamIds.includes(week1Bye) &&
    !hiddenSet.has(week1Bye) &&
    (params.offCounts[week1Bye] ?? 0) < 2
  ) {
    return [[week1Bye]];
  }

  const candidates = params.teamIds
    .filter((id) => !hiddenSet.has(id))
    .filter((id) => !params.previousOffTeamIds.has(id))
    .filter((id) => (params.offCounts[id] ?? 0) < 2)
    .filter((id) => {
      if (params.week === 10 && params.rules.avoidWeek10ByeTeamIds.includes(id)) {
        return false;
      }

      return true;
    });

  return shuffle(getCombinations(candidates, needed), params.random);
}

function findMatchings(params: {
  playingTeamIds: string[];
  usedPairs: Set<string>;
  previousWeekPairs: Set<string>;
  random: () => number;
}) {
  const results: Pair[][] = [];

  function walk(remaining: string[], current: Pair[]) {
    if (remaining.length === 0) {
      results.push([...current]);
      return;
    }

    const teamA = remaining[0];

    const partners = shuffle(remaining.slice(1), params.random).filter((teamB) => {
      const key = matchupKey(teamA, teamB);

      if (params.usedPairs.has(key)) return false;
      if (params.previousWeekPairs.has(key)) return false;

      return true;
    });

    partners.forEach((teamB) => {
      const nextRemaining = remaining.filter(
        (id) => id !== teamA && id !== teamB,
      );

      current.push([teamA, teamB]);
      walk(nextRemaining, current);
      current.pop();
    });
  }

  walk(params.playingTeamIds, []);

  return shuffle(results, params.random);
}

function canAssignTimes(params: {
  input: GenerateScheduleInput;
  rules: SundayResolvedRules;
  week: number;
  pairs: Pair[];
  reservedTimes: string[];
}) {
  const slots = getWeekSlots(params.input, params.rules, params.week).filter(
    (slot) => !params.reservedTimes.includes(slot),
  );

  const lateOnlySet = new Set(params.rules.lateOnlyTeamIds);

  const lateGames = params.pairs.filter(
    ([a, b]) => lateOnlySet.has(a) || lateOnlySet.has(b),
  );

  const lateSlotsAvailable = slots.filter((slot) => LATE_SLOTS.includes(slot));

  if (lateGames.length > lateSlotsAvailable.length) return false;

  const bothLateGame = params.pairs.find(
    ([a, b]) => lateOnlySet.has(a) && lateOnlySet.has(b),
  );

  if (bothLateGame && !slots.includes("12:00 PM")) return false;

  return params.pairs.length <= slots.length;
}

function assignTimes(params: {
  input: GenerateScheduleInput;
  rules: SundayResolvedRules;
  week: number;
  pairs: Pair[];
  reservedTimes: string[];
}) {
  const slots = getWeekSlots(params.input, params.rules, params.week).filter(
    (slot) => !params.reservedTimes.includes(slot),
  );

  const lateOnlySet = new Set(params.rules.lateOnlyTeamIds);
  const usedTimes = new Set<string>();

  const normalPairs = params.pairs.filter(
    ([a, b]) => !lateOnlySet.has(a) && !lateOnlySet.has(b),
  );

  const latePairs = params.pairs.filter(
    ([a, b]) => lateOnlySet.has(a) || lateOnlySet.has(b),
  );

  const orderedPairs = [...normalPairs, ...latePairs];
  const scheduled: { pair: Pair; time: string }[] = [];

  orderedPairs.forEach((pair) => {
    const [a, b] = pair;
    const bothLateOnly = lateOnlySet.has(a) && lateOnlySet.has(b);
    const hasLateOnly = lateOnlySet.has(a) || lateOnlySet.has(b);

    let time = "";

    if (bothLateOnly) {
      time =
        ["12:00 PM", "11:00 AM"].find(
          (slot) => slots.includes(slot) && !usedTimes.has(slot),
        ) ?? "";
    } else if (hasLateOnly) {
      time =
        LATE_SLOTS.find(
          (slot) => slots.includes(slot) && !usedTimes.has(slot),
        ) ?? "";
    } else {
      time = slots.find((slot) => !usedTimes.has(slot)) ?? "";
    }

    if (!time) return;

    usedTimes.add(time);
    scheduled.push({ pair, time });
  });

  if (scheduled.length !== params.pairs.length) return null;

  return scheduled;
}

function buildPlan(input: GenerateScheduleInput, seed: number) {
  const rules = resolveRules(input);
  const random = createRng(seed);
  const teamIds = input.teams.map((team) => team.id);

  const championshipTeamIds = input.championshipTeamIds ?? [];

  const hasCarryoverChampionship =
    input.sundayChampionshipMode === "carryover" &&
    championshipTeamIds.length === 2;

  const offCounts: Record<string, number> = {};
  const usedPairs = new Set<string>();
  const plan: WeekPlan[] = [];

  teamIds.forEach((id) => {
    offCounts[id] = 0;
  });

  function walk(week: number, previousWeekPairs: Set<string>): boolean {
    if (week > 10) {
      return (
        teamIds.every((id) => (offCounts[id] ?? 0) === 2) &&
        usedPairs.size === 36
      );
    }

    const date = addDays(input.startDate, (week - 1) * 7);

    const hiddenByes =
      week === 1 && hasCarryoverChampionship ? [...championshipTeamIds] : [];

    const previousOffTeamIds =
      plan.length > 0
        ? new Set([
            ...plan[plan.length - 1].byes,
            ...plan[plan.length - 1].hiddenByes,
          ])
        : new Set<string>();

    hiddenByes.forEach((id) => {
      offCounts[id] = (offCounts[id] ?? 0) + 1;
    });

    if (hiddenByes.some((id) => (offCounts[id] ?? 0) > 2)) {
      hiddenByes.forEach((id) => {
        offCounts[id] = (offCounts[id] ?? 0) - 1;
      });

      return false;
    }

    const byeOptions = getByeOptions({
      week,
      teamIds,
      hiddenByes,
      previousOffTeamIds,
      offCounts,
      rules,
      random,
    });

    for (const byes of byeOptions) {
      byes.forEach((id) => {
        offCounts[id] = (offCounts[id] ?? 0) + 1;
      });

      const invalidBye = byes.some((id) => (offCounts[id] ?? 0) > 2);

      if (!invalidBye) {
        const gamesNeeded = getRegularGamesNeeded(week, hiddenByes);
        const unavailable = new Set([...byes, ...hiddenByes]);
        const playingTeamIds = teamIds.filter((id) => !unavailable.has(id));

        if (playingTeamIds.length === gamesNeeded * 2) {
          const reservedTimes =
            week === 1 && hasCarryoverChampionship && input.championshipTime
              ? [input.championshipTime]
              : [];

          const matchings = findMatchings({
            playingTeamIds,
            usedPairs,
            previousWeekPairs,
            random,
          }).filter((pairs) =>
            canAssignTimes({
              input,
              rules,
              week,
              pairs,
              reservedTimes,
            }),
          );

          for (const matching of matchings) {
            const keys = matching.map(([a, b]) => matchupKey(a, b));

            keys.forEach((key) => usedPairs.add(key));

            plan.push({
              week,
              date,
              byes,
              hiddenByes,
              games: matching,
            });

            const nextPreviousWeekPairs = new Set(keys);

            if (walk(week + 1, nextPreviousWeekPairs)) return true;

            plan.pop();
            keys.forEach((key) => usedPairs.delete(key));
          }
        }
      }

      byes.forEach((id) => {
        offCounts[id] = (offCounts[id] ?? 0) - 1;
      });
    }

    hiddenByes.forEach((id) => {
      offCounts[id] = (offCounts[id] ?? 0) - 1;
    });

    return false;
  }

  return walk(1, new Set<string>()) ? plan : null;
}

function buildRegularWeeks(input: GenerateScheduleInput) {
  const rules = resolveRules(input);
  const baseSeed = input.seed ?? Date.now();

  for (let attempt = 0; attempt < 150; attempt++) {
    const plan = buildPlan(input, baseSeed + attempt * 101);

    if (!plan) continue;

    const weeks: GeneratedWeek[] = [];
    let failedTiming = false;

    plan.forEach((weekPlan) => {
      const reservedTimes =
        weekPlan.week === 1 &&
        input.sundayChampionshipMode === "carryover" &&
        input.championshipTeamIds?.length === 2 &&
        input.championshipTime
          ? [input.championshipTime]
          : [];

      const scheduledGames = assignTimes({
        input,
        rules,
        week: weekPlan.week,
        pairs: weekPlan.games,
        reservedTimes,
      });

      if (!scheduledGames) {
        failedTiming = true;
        return;
      }

      const games: GeneratedGame[] = [];

      scheduledGames.forEach(({ pair, time }) => {
        games.push(
          createGame({
            input,
            week: weekPlan.week,
            date: weekPlan.date,
            index: games.length,
            time,
            team1Id: pair[0],
            team2Id: pair[1],
          }),
        );
      });

      if (
        weekPlan.week === 1 &&
        input.sundayChampionshipMode === "carryover" &&
        input.championshipTeamIds?.length === 2
      ) {
        const [team1Id, team2Id] = input.championshipTeamIds;

        games.push(
          createGame({
            input,
            week: 1,
            date: weekPlan.date,
            index: games.length,
            time: input.championshipTime ?? "12:00 PM",
            venue: input.championshipVenue ?? input.venue ?? DEFAULT_VENUE,
            team1Id,
            team2Id,
            type: "championship",
          }),
        );
      }

      weeks.push({
        week: weekPlan.week,
        date: weekPlan.date,
        games: sortGames(games),
        byes: weekPlan.byes,
        hiddenByes: weekPlan.hiddenByes,
      });
    });

    if (!failedTiming && weeks.length === 10) {
      return { weeks, attempts: attempt + 1 };
    }
  }

  return { weeks: [] as GeneratedWeek[], attempts: 150 };
}

function buildPlayoffWeeks(input: GenerateScheduleInput) {
  const week11Date = addDays(input.startDate, 10 * 7);
  const week12Date = addDays(input.startDate, 11 * 7);

  const quarterFinals: GeneratedWeek = {
    week: 11,
    date: week11Date,
    byes: [],
    hiddenByes: [],
    games: sortGames([
      createGame({
        input,
        week: 11,
        date: week11Date,
        index: 0,
        time: "9:00 AM",
        team1Id: "seed_1",
        team2Id: "seed_8",
        type: "playoff",
      }),
      createGame({
        input,
        week: 11,
        date: week11Date,
        index: 1,
        time: "10:00 AM",
        team1Id: "seed_4",
        team2Id: "seed_5",
        type: "playoff",
      }),
      createGame({
        input,
        week: 11,
        date: week11Date,
        index: 2,
        time: "11:00 AM",
        team1Id: "seed_2",
        team2Id: "seed_7",
        type: "playoff",
      }),
      createGame({
        input,
        week: 11,
        date: week11Date,
        index: 3,
        time: "12:00 PM",
        team1Id: "seed_3",
        team2Id: "seed_6",
        type: "playoff",
      }),
    ]),
  };

  const semiFinals: GeneratedWeek = {
    week: 12,
    date: week12Date,
    byes: [],
    hiddenByes: [],
    games: sortGames([
      createGame({
        input,
        week: 12,
        date: week12Date,
        index: 0,
        time: "10:00 AM",
        team1Id: "winner_1_8",
        team2Id: "winner_4_5",
        type: "playoff",
      }),
      createGame({
        input,
        week: 12,
        date: week12Date,
        index: 1,
        time: "11:00 AM",
        team1Id: "winner_2_7",
        team2Id: "winner_3_6",
        type: "playoff",
      }),
    ]),
  };

  return [quarterFinals, semiFinals];
}

function validateSundaySchedule(input: GenerateScheduleInput, weeks: GeneratedWeek[]) {
  const rules = resolveRules(input);
  const errors: string[] = [];
  const totalOffCounts: Record<string, number> = {};
  const usedRegularMatchups = new Set<string>();

  input.teams.forEach((team) => {
    totalOffCounts[team.id] = 0;
  });

  let previousOffTeamIds = new Set<string>();

  weeks
    .filter((week) => week.week <= 10)
    .forEach((week) => {
      const usedTimes = new Set<string>();
      const usedTeams = new Set<string>();
      const allOff = [...week.byes, ...(week.hiddenByes ?? [])];

      const currentOffTeamIds = new Set(allOff);

      currentOffTeamIds.forEach((teamId) => {
        if (previousOffTeamIds.has(teamId)) {
          errors.push(
            `Week ${week.week}: ${getTeamName(
              teamId,
              input.teams,
            )} has back-to-back off-weeks.`,
          );
        }

        totalOffCounts[teamId] = (totalOffCounts[teamId] ?? 0) + 1;
      });

      week.games
        .filter((game) => game.type === "regular")
        .forEach((game) => {
          const key = matchupKey(game.team1Id, game.team2Id);

          if (usedRegularMatchups.has(key)) {
            errors.push(
              `Duplicate matchup: ${game.team1Name} vs ${game.team2Name}.`,
            );
          }

          usedRegularMatchups.add(key);

          if (usedTimes.has(game.time)) {
            errors.push(`Week ${week.week}: duplicate ${game.time} game time.`);
          }

          usedTimes.add(game.time);

          if (usedTeams.has(game.team1Id) || usedTeams.has(game.team2Id)) {
            errors.push(`Week ${week.week}: a team is scheduled twice.`);
          }

          usedTeams.add(game.team1Id);
          usedTeams.add(game.team2Id);

          const team1LateOnly = rules.lateOnlyTeamIds.includes(game.team1Id);
          const team2LateOnly = rules.lateOnlyTeamIds.includes(game.team2Id);

          if ((team1LateOnly || team2LateOnly) && !LATE_SLOTS.includes(game.time)) {
            errors.push(
              `Week ${week.week}: ${game.team1Name} vs ${game.team2Name} must be 11:00 AM or 12:00 PM.`,
            );
          }

          if (team1LateOnly && team2LateOnly && game.time !== "12:00 PM") {
            errors.push(
              `Week ${week.week}: ${game.team1Name} vs ${game.team2Name} must be 12:00 PM.`,
            );
          }

          if (
            week.week >= 8 &&
            week.week <= 10 &&
            game.time === "9:00 AM"
          ) {
            errors.push(`Week ${week.week}: no 9:00 AM games allowed.`);
          }
        });

      previousOffTeamIds = currentOffTeamIds;
    });

  input.teams.forEach((team) => {
    const count = totalOffCounts[team.id] ?? 0;

    if (count !== 2) {
      errors.push(
        `${team.teamName} has ${count} total bye/off-week(s). Target is exactly 2.`,
      );
    }
  });

  if (usedRegularMatchups.size !== 36) {
    errors.push(
      `Expected 36 unique regular-season matchups, found ${usedRegularMatchups.size}.`,
    );
  }

  return errors;
}

export function generateSundaySchedule(
  input: GenerateScheduleInput,
): GenerateScheduleResult {
  const regularResult = buildRegularWeeks(input);

  if (regularResult.weeks.length === 0) {
    return {
      success: false,
      weeks: [],
      errors: ["Could not generate a valid Sunday schedule. Try Regenerate."],
      attempts: regularResult.attempts,
    };
  }

  const weeks = [...regularResult.weeks, ...buildPlayoffWeeks(input)];
  const errors = validateSundaySchedule(input, weeks);

  return {
    success: errors.length === 0,
    weeks,
    errors,
    attempts: regularResult.attempts,
  };
}