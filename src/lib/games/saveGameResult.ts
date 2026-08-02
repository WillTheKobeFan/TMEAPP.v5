// src/lib/games/saveGameResult.ts

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { GameResult } from "@/types/gameResults";
import { rebuildStandings } from "@/lib/standings/rebuildStandings";

export async function saveGameResult(
  league: string,
  game: GameResult
) {
  const ref = doc(
    db,
    `league/${league}/games`,
    game.id
  );

  await setDoc(ref, game);

  // 🔥 AUTO UPDATE STANDINGS
  await rebuildStandings(league);

  return true;
}