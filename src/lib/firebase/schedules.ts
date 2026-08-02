// src/lib/firebase/schedules

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Game } from "scripts/utils/scheduleParse";

export async function writeGame(
  seasonId: string,
  game: Game
) {
  const ref = doc(
    db,
    "seasons",
    seasonId,
    "schedules",
    game.leagueNight,
    `week_${game.week}`,
    game.gameId
  );

  await setDoc(ref, game, { merge: true });
}

// -----------------------------
// BULK WRITER 
// -----------------------------

export async function writeGames(
  seasonId: string,
  games: Game[]
) {
  for (const game of games) {
    await writeGame(seasonId, game);
  }
}