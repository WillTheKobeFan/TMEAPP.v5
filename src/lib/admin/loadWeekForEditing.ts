// src/lib/admin/loadWeekForEditing.ts

import { collection, getDocs } from "firebase/firestore";
import { db } from "src/lib/firebase";

export type LeagueKey = "sunday" | "monday" | "tuesday" | "wednesday";

export type EditableWeek = {
  firestoreId: string;
  week: number;
  date: string | null;
  games: any[];
  byeTeams: string[];
  announcements: any[];
};

export async function loadWeekForEditing({
  league,
  season = "spring2026",
  week,
}: {
  league: LeagueKey;
  season?: string;
  week: number;
}): Promise<EditableWeek | null> {
  const ref = collection(
    db,
    "leagues",
    league,
    "seasons",
    season,
    "weeks"
  );

  const snap = await getDocs(ref);

  const rawWeeks = snap.docs.map((doc) => ({
    firestoreId: doc.id,
    ...doc.data(),
  }));

  const normalizedWeeks = rawWeeks.map((w: any) => ({
    firestoreId: w.firestoreId,
    week: Number(w.week?.toString().replace("week_", "")) || Number(w.week),
    date: w.date ?? null,
    games: Array.isArray(w.games) ? w.games : [],
    announcements: Array.isArray(w.announcements) ? w.announcements : [],
    byeTeams: Array.isArray(w.byeTeams)
      ? w.byeTeams
      : Array.isArray(w.bye)
        ? w.bye
        : [],
  }));

  return (
    normalizedWeeks.find((w) => Number(w.week) === Number(week)) ?? null
  );
}