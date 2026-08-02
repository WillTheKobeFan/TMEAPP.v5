// src/lib/standings/rebuildStandings.ts

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { GameResult } from "@/types/gameResults";
import { calculateStandings } from "src/utils/calculateStandings";
import { publishStandings } from "@/features/standings/utils/publishStandings";

export async function rebuildStandings(league: string) {
  // 1. load all games for league
  const gamesRef = collection(
    db,
    `league/${league}/games`
  );

  const snap = await getDocs(gamesRef);

  const games = snap.docs.map((d) => {
    const data = d.data();

    return {
      id: d.id,
      ...(data as Omit<GameResult, "id">),
    } as GameResult;
  });

  // 2. compute standings
  const standings = calculateStandings(games);

  // 3. publish standings to firestore
  await publishStandings(league, standings);

  return standings;
}