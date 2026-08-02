// src/utils/calculateStandings.ts

import type {
  GameResult,
  TeamStanding,
} from "@/types/standings";

export function calculateStandings(
  games: GameResult[]
): TeamStanding[] {
  const map = new Map<string, TeamStanding>();

  function ensure(name: string) {
    if (!map.has(name)) {
      map.set(name, {
        name,
        wins: 0,
        losses: 0,
        rank: 0,
        gb: 0,
        pf: 0,
        pa: 0,
      });
    }

    return map.get(name)!;
  }

  for (const game of games) {
    const t1 = ensure(game.team1);
    const t2 = ensure(game.team2);

    if (!game.winner) continue;

    if (game.winner === game.team1) {
      t1.wins++;
      t2.losses++;
    } else {
      t2.wins++;
      t1.losses++;
    }
  }

  const sorted = Array.from(map.values()).sort(
    (a, b) =>
      b.wins - a.wins ||
      a.losses - b.losses
  );

  // -----------------------------
  // ASSIGN RANKS
  // -----------------------------
  sorted.forEach((team, index) => {
    team.rank = index + 1;
  });

  // -----------------------------
  // CALCULATE GAMES BACK
  // -----------------------------
  const leader = sorted[0];

  for (const team of sorted) {
    const winDiff = leader.wins - team.wins;
    const lossDiff = team.losses - leader.losses;

    team.gb = (winDiff + lossDiff) / 2;
  }

  return sorted;
}