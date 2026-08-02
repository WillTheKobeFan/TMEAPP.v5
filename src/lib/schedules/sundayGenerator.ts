// src/lib/schedules/sundayGenerator.ts

import type { ScheduleGame, ScheduleWeek, Team } from "./types";

const MAX_ATTEMPTS = 5000;
const BYE_PLAN_ATTEMPTS = 750;

const TOM_ID = "sun_tB";
const TIMMY_ID = "sun_tE";
const PRINCE_ID = "sun_tH";

const SUNDAY_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"] as const;
type SundaySlot = (typeof SUNDAY_SLOTS)[number];
type RestrictedSlot = "11:00 AM" | "12:00 PM";

const SUNDAY_BYES_PER_WEEK: Record<number, number> = {
  1: 3,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 3,
  9: 3,
  10: 3,
};

type ChampionshipCarryover = {
  team1Id: string;
  team2Id: string;
  time: SundaySlot;
};

type GenerateSundayInput = {
  teams: Team[];
  startDate: string;
  championship: ChampionshipCarryover;
};

type Matchup = [Team, Team];
type UntimedWeek = Omit<ScheduleWeek, "date">;

const shuffle = <T,>(items: T[]) =>
  [...items].sort(() => Math.random() - 0.5);

const addWeeks = (dateString: string, weeksToAdd: number) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + weeksToAdd * 7);
  return date.toISOString().slice(0, 10);
};

const matchupKey = (a: string, b: string) => [a, b].sort().join("__");

const getTeamById = (teams: Team[], teamId: string) =>
  teams.find((team) => team.id === teamId);

const getGameTeamIds = (game: ScheduleGame) => [
  game.team1.id,
  game.team2.id,
];

function createGame(params: {
  id: string;
  week: number;
  date: string;
  time: string;
  team1: Team;
  team2: Team;
  type: ScheduleGame["type"];
}): ScheduleGame {
  return {
    id: params.id,
    week: params.week,
    date: params.date,
    time: params.time,
    team1: params.team1,
    team2: params.team2,
    type: params.type,
  };
}

function buildAllMatchups(teams: Team[]): Matchup[] {
  const matchups: Matchup[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matchups.push([teams[i], teams[j]]);
    }
  }

  return shuffle(matchups);
}

function validateChampionshipInput(
  teams: Team[],
  championship: ChampionshipCarryover
) {
  if (!championship?.team1Id || !championship?.team2Id || !championship?.time) {
    throw new Error(
      "Sunday requires 2 championship teams and a championship time."
    );
  }

  if (championship.team1Id === championship.team2Id) {
    throw new Error("Championship teams must be different.");
  }

  if (!SUNDAY_SLOTS.includes(championship.time)) {
    throw new Error("Invalid Sunday championship time.");
  }

  const team1 = getTeamById(teams, championship.team1Id);
  const team2 = getTeamById(teams, championship.team2Id);

  if (!team1 || !team2) {
    throw new Error("Championship team not found in Sunday teams.");
  }
}

function buildByePlan(
  teams: Team[],
  championship: ChampionshipCarryover
): Record<number, string[]> {
  for (let attempt = 1; attempt <= BYE_PLAN_ATTEMPTS; attempt++) {
    const byePlan: Record<number, string[]> = {};
    const byeCounts: Record<string, number> = {};

    teams.forEach((team) => {
      byeCounts[team.id] = 0;
    });

    for (let week = 1; week <= 10; week++) {
      byePlan[week] = [];
    }

    byePlan[1].push(championship.team1Id, championship.team2Id);
    byeCounts[championship.team1Id] += 1;
    byeCounts[championship.team2Id] += 1;

    let failed = false;

    for (let week = 1; week <= 10; week++) {
      const needed = SUNDAY_BYES_PER_WEEK[week] - byePlan[week].length;

      if (needed <= 0) continue;

      const eligible = shuffle(
        teams.filter((team) => {
          if (byeCounts[team.id] >= 2) return false;
          if (byePlan[week].includes(team.id)) return false;
          if (week === 10 && team.id === TOM_ID) return false;

          return true;
        })
      ).sort((a, b) => byeCounts[a.id] - byeCounts[b.id]);

      if (eligible.length < needed) {
        failed = true;
        break;
      }

      eligible.slice(0, needed).forEach((team) => {
        byePlan[week].push(team.id);
        byeCounts[team.id] += 1;
      });
    }

    const valid =
      !failed &&
      teams.every((team) => byeCounts[team.id] === 2) &&
      !byePlan[10].includes(TOM_ID);

    if (valid) return byePlan;
  }

  throw new Error("Could not build valid Sunday bye plan.");
}

function buildRegularGamesFromPool(
  teams: Team[],
  byePlan: Record<number, string[]>,
  championship: ChampionshipCarryover
): UntimedWeek[] | null {
  const remaining = buildAllMatchups(teams);
  const weeks: UntimedWeek[] = [];

  let previousWeekKeys = new Set<string>();

  for (let week = 1; week <= 10; week++) {
    const byeIds = byePlan[week] ?? [];
    const championshipByeIds =
      week === 1 ? [championship.team1Id, championship.team2Id] : [];

    const gamesNeeded = (teams.length - byeIds.length) / 2;

    if (!Number.isInteger(gamesNeeded)) return null;

    const games: ScheduleGame[] = [];
    const usedTeamIds = new Set<string>();

    for (let index = 0; index < gamesNeeded; index++) {
      const matchupIndex = remaining.findIndex(([teamA, teamB]) => {
        if (byeIds.includes(teamA.id) || byeIds.includes(teamB.id)) return false;
        if (usedTeamIds.has(teamA.id) || usedTeamIds.has(teamB.id)) return false;

        const key = matchupKey(teamA.id, teamB.id);
        if (previousWeekKeys.has(key)) return false;

        return true;
      });

      if (matchupIndex === -1) return null;

      const [teamA, teamB] = remaining.splice(matchupIndex, 1)[0];

      usedTeamIds.add(teamA.id);
      usedTeamIds.add(teamB.id);

      games.push(
        createGame({
          id: `sun_w${week}_g${games.length + 1}`,
          week,
          date: "",
          time: "",
          team1: teamA,
          team2: teamB,
          type: "regular",
        })
      );
    }

    previousWeekKeys = new Set(
      games.map((game) => matchupKey(game.team1.id, game.team2.id))
    );

    weeks.push({
      week,
      games,
      byes: teams.filter(
        (team) =>
          byeIds.includes(team.id) && !championshipByeIds.includes(team.id)
      ),
      hiddenByes: teams.filter((team) => championshipByeIds.includes(team.id)),
    } as UntimedWeek);
  }

  if (remaining.length !== 0) return null;

  return weeks;
}

function assignTimes(
  weeks: UntimedWeek[],
  teams: Team[],
  championship: ChampionshipCarryover
): UntimedWeek[] {
  const restrictedCounts: Record<string, Record<RestrictedSlot, number>> = {
    [TIMMY_ID]: { "11:00 AM": 0, "12:00 PM": 0 },
    [PRINCE_ID]: { "11:00 AM": 0, "12:00 PM": 0 },
  };

  return weeks.map((week) => {
    let openSlots: SundaySlot[] = [...SUNDAY_SLOTS];

    if (week.week === 1) {
      openSlots = openSlots.filter((slot) => slot !== championship.time);
    }

    const sortedGames = [...week.games].sort((a, b) => {
      const aIds = getGameTeamIds(a);
      const bIds = getGameTeamIds(b);

      const aHasBoth =
        aIds.includes(TIMMY_ID) && aIds.includes(PRINCE_ID) ? 1 : 0;
      const bHasBoth =
        bIds.includes(TIMMY_ID) && bIds.includes(PRINCE_ID) ? 1 : 0;

      if (aHasBoth !== bHasBoth) return bHasBoth - aHasBoth;

      const aRestricted = aIds.includes(TIMMY_ID) || aIds.includes(PRINCE_ID);
      const bRestricted = bIds.includes(TIMMY_ID) || bIds.includes(PRINCE_ID);

      return Number(bRestricted) - Number(aRestricted);
    });

    const timedGames: ScheduleGame[] = [];

    sortedGames.forEach((game) => {
      const ids = getGameTeamIds(game);
      const hasTimmy = ids.includes(TIMMY_ID);
      const hasPrince = ids.includes(PRINCE_ID);

      let allowedSlots: SundaySlot[] = [...openSlots];

      if (hasTimmy && hasPrince) {
        allowedSlots = allowedSlots.filter((slot) => slot === "12:00 PM");
      } else if (hasTimmy || hasPrince) {
        const restrictedId = hasTimmy ? TIMMY_ID : PRINCE_ID;

        allowedSlots = allowedSlots
          .filter(
            (slot): slot is RestrictedSlot =>
              slot === "11:00 AM" || slot === "12:00 PM"
          )
          .sort(
            (a, b) =>
              restrictedCounts[restrictedId][a] -
              restrictedCounts[restrictedId][b]
          );
      }

      const time = allowedSlots[0] ?? "";

      timedGames.push({ ...game, time });

      if (time) {
        openSlots = openSlots.filter((slot) => slot !== time);

        if (hasTimmy && (time === "11:00 AM" || time === "12:00 PM")) {
          restrictedCounts[TIMMY_ID][time] += 1;
        }

        if (hasPrince && (time === "11:00 AM" || time === "12:00 PM")) {
          restrictedCounts[PRINCE_ID][time] += 1;
        }
      }
    });

    if (week.week === 1) {
      const team1 = getTeamById(teams, championship.team1Id);
      const team2 = getTeamById(teams, championship.team2Id);

      if (team1 && team2) {
        timedGames.push(
          createGame({
            id: "sun_w1_championship",
            week: 1,
            date: "",
            time: championship.time,
            team1,
            team2,
            type: "championship",
          })
        );
      }
    }

    timedGames.sort((a, b) => {
      const aIndex = SUNDAY_SLOTS.indexOf(a.time as SundaySlot);
      const bIndex = SUNDAY_SLOTS.indexOf(b.time as SundaySlot);

      return aIndex - bIndex;
    });

    return {
      ...week,
      games: timedGames,
    } as UntimedWeek;
  });
}

function validateSundaySchedule(weeks: ScheduleWeek[], teams: Team[]) {
  const errors: string[] = [];

  const byeCounts: Record<string, number> = {};
  const matchupCounts: Record<string, number> = {};
  const timeCounts: Record<string, Record<RestrictedSlot, number>> = {
    [TIMMY_ID]: { "11:00 AM": 0, "12:00 PM": 0 },
    [PRINCE_ID]: { "11:00 AM": 0, "12:00 PM": 0 },
  };

  teams.forEach((team) => {
    byeCounts[team.id] = 0;
  });

  weeks
    .filter((week) => week.week <= 10)
    .forEach((week) => {
      (week.byes ?? []).forEach((team) => {
        byeCounts[team.id] += 1;
      });

      (week.hiddenByes ?? []).forEach((team) => {
        byeCounts[team.id] += 1;
      });
    });

  teams.forEach((team) => {
    if (byeCounts[team.id] !== 2) {
      errors.push(`${team.name} has ${byeCounts[team.id]} byes.`);
    }
  });

  const week10 = weeks.find((week) => week.week === 10);

  if (!week10) {
    errors.push("Week 10 is missing.");
  } else if (
    (week10.byes ?? []).some((team) => team.id === TOM_ID) ||
    (week10.hiddenByes ?? []).some((team) => team.id === TOM_ID)
  ) {
    errors.push("Tom must play Week 10.");
  }

  const previousMatchups = new Map<number, Set<string>>();

  weeks
    .filter((week) => week.week <= 10)
    .forEach((week) => {
      const weekKeys = new Set<string>();
      const usedTeamsThisWeek = new Set<string>();

      week.games
        .filter((game) => game.type === "regular")
        .forEach((game) => {
          const ids = getGameTeamIds(game);
          const key = matchupKey(ids[0], ids[1]);

          ids.forEach((id) => {
            if (usedTeamsThisWeek.has(id)) {
              errors.push(`Team ${id} plays twice in Week ${week.week}.`);
            }
            usedTeamsThisWeek.add(id);
          });

          matchupCounts[key] = (matchupCounts[key] ?? 0) + 1;
          weekKeys.add(key);

          if (!game.time) {
            errors.push(`Week ${week.week} has a game with no time.`);
          }

          const previousKeys = previousMatchups.get(week.week - 1);

          if (previousKeys?.has(key)) {
            errors.push(`Back-to-back matchup found in Week ${week.week}.`);
          }

          const hasTimmy = ids.includes(TIMMY_ID);
          const hasPrince = ids.includes(PRINCE_ID);

          if (
            (hasTimmy || hasPrince) &&
            game.time !== "11:00 AM" &&
            game.time !== "12:00 PM"
          ) {
            errors.push("Timmy/Prince game scheduled before 11 AM.");
          }

          if (hasTimmy && hasPrince && game.time !== "12:00 PM") {
            errors.push("Timmy vs Prince must be at 12:00 PM.");
          }

          if (
            hasTimmy &&
            (game.time === "11:00 AM" || game.time === "12:00 PM")
          ) {
            timeCounts[TIMMY_ID][game.time] += 1;
          }

          if (
            hasPrince &&
            (game.time === "11:00 AM" || game.time === "12:00 PM")
          ) {
            timeCounts[PRINCE_ID][game.time] += 1;
          }
        });

      previousMatchups.set(week.week, weekKeys);
    });

  buildAllMatchups(teams).forEach(([teamA, teamB]) => {
    const key = matchupKey(teamA.id, teamB.id);
    const count = matchupCounts[key] ?? 0;

    if (count !== 1) {
      errors.push(`${teamA.name} vs ${teamB.name} appears ${count} times.`);
    }
  });

  [TIMMY_ID, PRINCE_ID].forEach((teamId) => {
    if (
      timeCounts[teamId]["11:00 AM"] !== 4 ||
      timeCounts[teamId]["12:00 PM"] !== 4
    ) {
      errors.push(
        `${teamId} must have 4 games at 11 AM and 4 games at 12 PM.`
      );
    }
  });

  const week1 = weeks.find((week) => week.week === 1);
  const championshipGame = week1?.games.find(
    (game) => game.type === "championship"
  );

  if (!championshipGame) {
    errors.push("Week 1 championship game is missing.");
  }

  return errors;
}

export function buildSundaySchedule(input: GenerateSundayInput): ScheduleWeek[] {
  const { teams, startDate, championship } = input;

  validateChampionshipInput(teams, championship);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const byePlan = buildByePlan(teams, championship);
    const regularWeeks = buildRegularGamesFromPool(
      teams,
      byePlan,
      championship
    );

    if (!regularWeeks) continue;

    const timedWeeks = assignTimes(regularWeeks, teams, championship);

    const weeks: ScheduleWeek[] = timedWeeks.map((week) => {
      const date = addWeeks(startDate, week.week - 1);

      return {
        ...week,
        date,
        games: week.games.map((game) => ({
          ...game,
          date,
        })),
      } as ScheduleWeek;
    });

    const errors = validateSundaySchedule(weeks, teams);

    if (errors.length === 0) {
      return weeks;
    }
  }

  throw new Error("Could not generate a valid Sunday schedule.");
}