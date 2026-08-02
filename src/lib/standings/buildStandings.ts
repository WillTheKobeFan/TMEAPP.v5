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

type Game = {
  team1Id: string;
  team2Id: string;
  team1Score: number | null;
  team2Score: number | null;
  winnerTeamId: string | null;
  status: "scheduled" | "completed";
};

type Week = {
  games: Game[];
};

export function buildStandings(weeks: Week[]): TeamStanding[] {
  const map = new Map<string, TeamStanding>();

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
  // BUILD STATS
  // -----------------------------
  for (const week of weeks) {
    for (const game of week.games) {
      if (game.status !== "completed") continue;
      if (game.team1Score == null || game.team2Score == null) continue;

      const t1 = get(game.team1Id);
      const t2 = get(game.team2Id);

      // POINTS
      t1.pointsFor += game.team1Score;
      t1.pointsAgainst += game.team2Score;

      t2.pointsFor += game.team2Score;
      t2.pointsAgainst += game.team1Score;

      // W / L (use winnerTeamId ONLY)
      if (game.winnerTeamId === game.team1Id) {
        t1.wins++;
        t2.losses++;
      } else if (game.winnerTeamId === game.team2Id) {
        t2.wins++;
        t1.losses++;
      }
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
  // SORTING RULES
  // -----------------------------
  standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
    return b.diff - a.diff;
  });

  // -----------------------------
  // SEED ASSIGNMENT
  // -----------------------------
  return standings.map((team, index) => ({
    ...team,
    seed: index + 1,
  }));
}