// scripts/utils/importSchedule.ts

import { adminDb } from "../lib/firebaseAdmin";
import { parseSchedule } from "./scheduleParse";

import type { Game } from "./scheduleParse";

type ImportScheduleParams = {
  sessionName: string; // "Sunday AM"
  seasonId: string;
  rawText: string;
};

type LeagueNight = "sun" | "mon" | "wed";

function resolveLeagueNight(sessionName: string): LeagueNight {
  const s = sessionName.toLowerCase();

  if (s.includes("sun")) return "sun";
  if (s.includes("mon")) return "mon";
  return "wed";
}

export async function importSchedule({
  sessionName,
  seasonId,
  rawText,
}: ImportScheduleParams) {
  if (!sessionName) throw new Error("sessionName is required");
  if (!seasonId) throw new Error("seasonId is required");
  if (!rawText) throw new Error("rawText is required");

  // -----------------------------
  // NORMALIZE LEAGUE
  // -----------------------------
  const leagueNight = resolveLeagueNight(sessionName);

  // -----------------------------
  // PARSE RAW SCHEDULE
  // -----------------------------
  const parsed = parseSchedule(rawText, {
  leagueNight,
  seasonId,
});

if (!parsed?.games?.length) {
  throw new Error("Parsed schedule returned no games");
}

  // -----------------------------
  // FIREBASE REFERENCES
  // -----------------------------
  const leagueRef = adminDb.collection("leagues").doc(leagueNight);
  const seasonRef = leagueRef.collection("seasons").doc(seasonId);

  const batch = adminDb.batch();

  // -----------------------------
// WRITE DATA
// -----------------------------
const weeks = new Map<number, Game[]>();

parsed.games.forEach((game) => {
  const existingGames = weeks.get(game.week) ?? [];

  existingGames.push(game);

  weeks.set(game.week, existingGames);
});

weeks.forEach((games, weekNumber) => {
  const weekRef = seasonRef
    .collection("weeks")
    .doc(String(weekNumber));

  batch.set(
    weekRef,
    {
      week: weekNumber,
      date: games[0]?.date ?? null,
    },
    { merge: true }
  );

  games.forEach((game) => {
    const gameRef = weekRef
      .collection("games")
      .doc(game.gameId);

    batch.set(gameRef, {
      ...game,
      leagueNight,
      seasonId,
    });
  });
});

parsed.announcements.forEach((announcement) => {
  if (!announcement.week) return;

  const weekRef = seasonRef
    .collection("weeks")
    .doc(String(announcement.week));

  const annRef = weekRef
    .collection("announcements")
    .doc(announcement.id);

  batch.set(annRef, {
    ...announcement,
    leagueNight,
    seasonId,
  });
});
}
