// src/lib/standings/getStandings

import { getLeagueGames } from "../firebase/standings";
import { buildStandings } from "./buildStandings";

export async function getStandings(
  seasonId: string,
  league: "sun" | "mon" | "wed"
) {
  const games = await getLeagueGames(seasonId, league);

  // wrap into expected shape for your engine
  return buildStandings([{ games }]);
}