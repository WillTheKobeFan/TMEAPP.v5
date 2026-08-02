import type { GameResult } from "@/types/standings";

import { calculateStandings } from "src/utils/calculateStandings";

export function buildStandings(
  league: string,
  games: GameResult[]
) {
  const teams =
    calculateStandings(games);

  return {
    league,

    teams,

    updatedAt:
      new Date().toISOString(),
  };
}