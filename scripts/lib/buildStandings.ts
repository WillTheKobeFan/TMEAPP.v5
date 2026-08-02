// scripts/lib/buildStandings

import { Game } from "scripts/utils/scheduleParse";

export type TeamStanding = {
  teamId: string;

  wins: number;
  losses: number;

  pointsFor: number;
  pointsAgainst: number;

  winPct: number;
  diff: number;

  seed?: number;
};

export function buildStandings(games: Game[]): TeamStanding[] {
  const map = new Map<string, TeamStanding>();

  // -----------------------------
  // INIT TEAM
  // -----------------------------
  function get(teamId: string): TeamStanding {
    if (!map.has(teamId)) {
      map.set(teamId, {
        teamId,

        wins: 0,
        losses: 0,

        pointsFor: 0,
        pointsAgainst: 0,

        winPct: 0,
        diff: 0,
      });
    }
    return map.get(teamId)!;
  }

  // -----------------------------
  // PROCESS GAMES
  // -----------------------------
  for (const game of games) {
    if (game.status !== "completed") continue;

    const {
      team1Id,
      team2Id,
      team1Score,
      team2Score,
      winnerTeamId,
    } = game;

    const t1 = get(team1Id);
    const t2 = get(team2Id);

    // -----------------------------
    // POINTS (only if valid)
    // -----------------------------
    if (team1Score != null && team2Score != null) {
      t1.pointsFor += team1Score;
      t1.pointsAgainst += team2Score;

      t2.pointsFor += team2Score;
      t2.pointsAgainst += team1Score;
    }

    // -----------------------------
    // W / L
    // -----------------------------
    if (winnerTeamId === team1Id) {
      t1.wins++;
      t2.losses++;
    } else if (winnerTeamId === team2Id) {
      t2.wins++;
      t1.losses++;
    }
  }

  // -----------------------------
  // FINALIZE STATS
  // -----------------------------
  const standings = Array.from(map.values()).map((t) => {
    const totalGames = t.wins + t.losses;

    return {
      ...t,
      diff: t.pointsFor - t.pointsAgainst,
      winPct: totalGames === 0 ? 0 : t.wins / totalGames,
    };
  });

  // -----------------------------
  // SORT RULES
  // -----------------------------
  standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
    return b.diff - a.diff;
  });

  // -----------------------------
  // SEEDING
  // -----------------------------
  return standings.map((team, index) => ({
    ...team,
    seed: index + 1,
  }));
}