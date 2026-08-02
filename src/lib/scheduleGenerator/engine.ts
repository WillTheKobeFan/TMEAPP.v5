// src/lib/scheduleGenerator/engine.ts

import type {
  GeneratedWeek,
  GeneratorGame,
  LeagueGeneratorConfig,
  ScheduleTeam,
} from "./types";
import { makeGameId } from "./helpers";
import { validateGeneratorConfig } from "./validation";

type MatchupKey = string;

function matchupKey(a: string, b: string): MatchupKey {
  return [a, b].sort().join("__");
}

function getTeamPreference(config: LeagueGeneratorConfig, teamId: string) {
  return config.teamPreferences.find((pref) => pref.teamId === teamId);
}

function teamAvoidsByeWeek(
  config: LeagueGeneratorConfig,
  teamId: string,
  week: number
) {
  const pref = getTeamPreference(config, teamId);

  return (
    pref?.avoidByeWeeks?.includes(week) ||
    pref?.mustPlayWeeks?.includes(week)
  );
}

function getWeeklyOverride(config: LeagueGeneratorConfig, week: number) {
  return config.weeklyOverrides?.find((item) => item.week === week);
}

function getAvailableSlots(config: LeagueGeneratorConfig, week: number) {
  const override = getWeeklyOverride(config, week);

  return config.gameSlots.filter(
    (slot) => !override?.blockedTimes?.includes(slot.time)
  );
}

function getWeekPlan(config: LeagueGeneratorConfig, week: number) {
  const override = getWeeklyOverride(config, week);
  const availableSlots = getAvailableSlots(config, week);

  const maxPossibleGames = Math.min(
    Math.floor(config.teams.length / 2),
    availableSlots.length
  );

  const gamesNeeded = Math.min(
    override?.maxGames ?? maxPossibleGames,
    maxPossibleGames
  );

  const byesNeeded =
    override?.requiredByes ?? Math.max(0, config.teams.length - gamesNeeded * 2);

  return {
    gamesNeeded,
    byesNeeded,
    availableSlots,
  };
}

function pickByesForWeek({
  config,
  week,
  byesNeeded,
  byeCounts,
}: {
  config: LeagueGeneratorConfig;
  week: number;
  byesNeeded: number;
  byeCounts: Map<string, number>;
}) {
  if (byesNeeded <= 0) return [];

  const target = config.targetByesPerTeam;

  const sorted = [...config.teams].sort((a, b) => {
    const aAvoids = teamAvoidsByeWeek(config, a.id, week);
    const bAvoids = teamAvoidsByeWeek(config, b.id, week);

    if (aAvoids !== bAvoids) return aAvoids ? 1 : -1;

    const aByes = byeCounts.get(a.id) ?? 0;
    const bByes = byeCounts.get(b.id) ?? 0;

    if (aByes !== bByes) return aByes - bByes;

    return a.name.localeCompare(b.name);
  });

  const byes: ScheduleTeam[] = [];

  for (const team of sorted) {
    if (byes.length >= byesNeeded) break;

    const currentByes = byeCounts.get(team.id) ?? 0;
    const avoidsThisWeek = teamAvoidsByeWeek(config, team.id, week);

    if (!config.allowUnevenByes && currentByes >= target) continue;
    if (avoidsThisWeek) continue;

    byes.push(team);
    byeCounts.set(team.id, currentByes + 1);
  }

  for (const team of sorted) {
    if (byes.length >= byesNeeded) break;
    if (byes.some((bye) => bye.id === team.id)) continue;

    const currentByes = byeCounts.get(team.id) ?? 0;

    if (!config.allowUnevenByes && currentByes >= target) continue;

    byes.push(team);
    byeCounts.set(team.id, currentByes + 1);
  }

  return byes;
}

function buildPairings({
  config,
  week,
  activeTeams,
  gamesNeeded,
  playedMatchups,
  lastWeekMatchups,
}: {
  config: LeagueGeneratorConfig;
  week: number;
  activeTeams: ScheduleTeam[];
  gamesNeeded: number;
  playedMatchups: Set<MatchupKey>;
  lastWeekMatchups: Set<MatchupKey>;
}) {
  const teams = [...activeTeams];
  const games: [ScheduleTeam, ScheduleTeam][] = [];

  while (teams.length >= 2 && games.length < gamesNeeded) {
    let bestAIndex = 0;
    let bestBIndex = 1;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const a = teams[i];
        const b = teams[j];
        const key = matchupKey(a.id, b.id);

        let score = 0;

        if (playedMatchups.has(key)) {
          score += config.allowDuplicateMatchups ? 50 : 1000;
        }

        if (config.preventBackToBackRematches && lastWeekMatchups.has(key)) {
          score += 2000;
        }

        const aPref = getTeamPreference(config, a.id);
        const bPref = getTeamPreference(config, b.id);

        if (aPref?.avoidWeeks?.includes(week)) score += 250;
        if (bPref?.avoidWeeks?.includes(week)) score += 250;

        if (score < bestScore) {
          bestScore = score;
          bestAIndex = i;
          bestBIndex = j;
        }
      }
    }

    const teamA = teams[bestAIndex];
    const teamB = teams[bestBIndex];

    games.push([teamA, teamB]);

    teams.splice(bestBIndex, 1);
    teams.splice(bestAIndex, 1);
  }

  return games;
}

function pickSlotForGame({
  config,
  week,
  gameIndex,
  team1,
  team2,
}: {
  config: LeagueGeneratorConfig;
  week: number;
  gameIndex: number;
  team1: ScheduleTeam;
  team2: ScheduleTeam;
}) {
  const availableSlots = getAvailableSlots(config, week);
  const fallback = availableSlots[gameIndex] ?? availableSlots[0];

  const t1Pref = getTeamPreference(config, team1.id);
  const t2Pref = getTeamPreference(config, team2.id);

  const preferred = availableSlots.find((slot) => {
    const t1Likes =
      !t1Pref?.preferredTimes?.length ||
      t1Pref.preferredTimes.includes(slot.time);

    const t2Likes =
      !t2Pref?.preferredTimes?.length ||
      t2Pref.preferredTimes.includes(slot.time);

    return t1Likes && t2Likes;
  });

  return preferred ?? fallback;
}

function getByeCountForTeam(weeks: GeneratedWeek[], teamId: string) {
  return weeks.reduce((total, week) => {
    return total + (week.byes.some((team) => team.id === teamId) ? 1 : 0);
  }, 0);
}

function addByeBalanceWarnings(
  config: LeagueGeneratorConfig,
  weeks: GeneratedWeek[],
  warnings: string[]
) {
  if (config.allowUnevenByes) return;

  const issues = config.teams
    .map((team) => ({
      team,
      byes: getByeCountForTeam(weeks, team.id),
    }))
    .filter((item) => item.byes !== config.targetByesPerTeam);

  if (!issues.length) return;

  warnings.push(
    `Bye balance issue: ${issues
      .map((item) => `${item.team.name} has ${item.byes}`)
      .join(", ")}. Target is ${config.targetByesPerTeam}.`
  );
}

export function generateUniversalSchedule(config: LeagueGeneratorConfig) {
  const validation = validateGeneratorConfig(config);

  if (!validation.valid && config.strictMode) {
    return {
      weeks: [] as GeneratedWeek[],
      validation,
    };
  }

  const weeks: GeneratedWeek[] = [];
  const byeCounts = new Map<string, number>();
  const playedMatchups = new Set<MatchupKey>();

  let lastWeekMatchups = new Set<MatchupKey>();

  config.teams.forEach((team) => byeCounts.set(team.id, 0));

  for (let week = 1; week <= config.regularSeasonWeeks; week++) {
    const { gamesNeeded, byesNeeded } = getWeekPlan(config, week);

    const byes = pickByesForWeek({
      config,
      week,
      byesNeeded,
      byeCounts,
    });

    const activeTeams = config.teams.filter(
      (team) => !byes.some((bye) => bye.id === team.id)
    );

    const pairings = buildPairings({
      config,
      week,
      activeTeams,
      gamesNeeded,
      playedMatchups,
      lastWeekMatchups,
    });

    const currentWeekMatchups = new Set<MatchupKey>();

    const games: GeneratorGame[] = pairings.map(([team1, team2], index) => {
      const slot = pickSlotForGame({
        config,
        week,
        gameIndex: index,
        team1,
        team2,
      });

      const key = matchupKey(team1.id, team2.id);

      playedMatchups.add(key);
      currentWeekMatchups.add(key);

      return {
        id: makeGameId(config.leagueId, week, index),
        week,
        time: slot.time,
        venue: slot.venue,
        team1Id: team1.id,
        team1Name: team1.name,
        team2Id: team2.id,
        team2Name: team2.name,
        status: "scheduled",
        type: "regular",
        resultType: "pending",
      };
    });

    weeks.push({
      week,
      games,
      byes,
      hiddenByes: [],
    });

    lastWeekMatchups = currentWeekMatchups;
  }

  addByeBalanceWarnings(config, weeks, validation.warnings);

  return {
    weeks,
    validation,
  };
}