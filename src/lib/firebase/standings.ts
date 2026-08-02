// src/lib/firebase/standings

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Game } from "scripts/utils/scheduleParse";

export async function getLeagueGames(
  seasonId: string,
  league: "sun" | "mon" | "wed"
): Promise<Game[]> {
  const colRef = collection(
    db,
    "seasons",
    seasonId,
    "schedules",
    league
  );

  const snapshot = await getDocs(colRef);

  const games: Game[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    games.push(data as Game);
  });

  return games;
}