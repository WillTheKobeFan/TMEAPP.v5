// src/utils/schedule-generators/shared.ts

import type {
  GeneratedGame,
  GeneratedWeek,
  GeneratorTeam,
  LeagueNight,
} from "./types";

export function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function makeRandom(seed: number) {
  let value = seed || Date.now();

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function shuffle<T>(items: T[], seed: number) {
  const arr = [...items];
  const random = makeRandom(seed);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export function matchupKey(team1Id: string, team2Id: string) {
  return [team1Id, team2Id].sort().join("_vs_");
}

export function getTeamName(teamId: string, teams: GeneratorTeam[]) {
  return teams.find((team) => team.id === teamId)?.teamName ?? teamId;
}

export function createGame({
  id,
  league,
  seasonId,
  week,
  date,
  time,
  venue,
  team1Id,
  team2Id,
  teams,
  sortOrder,
  type = "regular",
  notes = "",
}: {
  id: string;
  league: LeagueNight;
  seasonId: string;
  week: number;
  date: string;
  time: string;
  venue: string;
  team1Id: string;
  team2Id: string;
  teams: GeneratorTeam[];
  sortOrder: number;
  type?: GeneratedGame["type"];
  notes?: string;
}): GeneratedGame {
  return {
    id,
    league,
    seasonId,
    week,
    date,
    time,
    venue,

    team1Id,
    team1Name: getTeamName(team1Id, teams),
    team2Id,
    team2Name: getTeamName(team2Id, teams),

    team1Score: "",
    team2Score: "",
    winnerId: "",
    winnerName: "",

    status: "scheduled",
    type,
    resultType: "pending",

    sortOrder,
    published: false,
    locked: false,
    notes,
  };
}

export function getByeCounts(weeks: GeneratedWeek[], teams: GeneratorTeam[]) {
  const counts: Record<string, number> = {};

  teams.forEach((team) => {
    counts[team.id] = 0;
  });

  weeks.forEach((week) => {
    week.byes.forEach((teamId) => {
      counts[teamId] = (counts[teamId] ?? 0) + 1;
    });
  });

  return counts;
}

export function getMatchupCounts(weeks: GeneratedWeek[]) {
  const counts: Record<string, number> = {};

  weeks.forEach((week) => {
    week.games.forEach((game) => {
      const key = matchupKey(game.team1Id, game.team2Id);
      counts[key] = (counts[key] ?? 0) + 1;
    });
  });

  return counts;
}

export function validateNoTeamPlaysTwiceInWeek(week: GeneratedWeek) {
  const errors: string[] = [];
  const played = new Set<string>();

  week.games.forEach((game) => {
    if (played.has(game.team1Id)) {
      errors.push(`Week ${week.week}: ${game.team1Name} plays twice.`);
    }

    if (played.has(game.team2Id)) {
      errors.push(`Week ${week.week}: ${game.team2Name} plays twice.`);
    }

    played.add(game.team1Id);
    played.add(game.team2Id);
  });

  week.byes.forEach((teamId) => {
    if (played.has(teamId)) {
      errors.push(`Week ${week.week}: ${teamId} has a bye and a game.`);
    }
  });

  return errors;
}

export function validateNoBackToBackMatchups(weeks: GeneratedWeek[]) {
  const errors: string[] = [];
  let previousWeekMatchups = new Set<string>();

  weeks.forEach((week) => {
    const currentWeekMatchups = new Set<string>();

    week.games.forEach((game) => {
      const key = matchupKey(game.team1Id, game.team2Id);

      if (previousWeekMatchups.has(key)) {
        errors.push(
          `Week ${week.week}: back-to-back repeat matchup: ${game.team1Name} vs ${game.team2Name}.`,
        );
      }

      currentWeekMatchups.add(key);
    });

    previousWeekMatchups = currentWeekMatchups;
  });

  return errors;
}

export function validateExactByeCount({
  weeks,
  teams,
  requiredByes,
}: {
  weeks: GeneratedWeek[];
  teams: GeneratorTeam[];
  requiredByes: number;
}) {
  const errors: string[] = [];
  const byeCounts = getByeCounts(weeks, teams);

  teams.forEach((team) => {
    if (byeCounts[team.id] !== requiredByes) {
      errors.push(
        `${team.teamName} has ${byeCounts[team.id]} byes. Must have exactly ${requiredByes}.`,
      );
    }
  });

  return errors;
}

export function exportGeneratedScheduleToTsv(weeks: GeneratedWeek[]) {
  const headers = [
    "GameID",
    "League",
    "SeasonID",
    "Week",
    "Date",
    "Time",
    "Venue",
    "Team1ID",
    "Team1Name",
    "Team2ID",
    "Team2Name",
    "Team1Score",
    "Team2Score",
    "WinnerID",
    "WinnerName",
    "Status",
    "Type",
    "ResultType",
    "SortOrder",
    "Published",
    "Locked",
    "Notes",
  ];

  const rows = weeks.flatMap((week) =>
    week.games.map((game) => [
      game.id,
      game.league,
      game.seasonId,
      game.week,
      game.date,
      game.time,
      game.venue,
      game.team1Id,
      game.team1Name,
      game.team2Id,
      game.team2Name,
      game.team1Score,
      game.team2Score,
      game.winnerId,
      game.winnerName,
      game.status,
      game.type,
      game.resultType,
      game.sortOrder,
      game.published ? "TRUE" : "FALSE",
      game.locked ? "TRUE" : "FALSE",
      game.notes,
    ]),
  );

  return [headers, ...rows].map((row) => row.join("\t")).join("\n");
}