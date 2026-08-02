// src/utils/buildStandings

type Game = {
  teamA: string;
  teamB: string;
  scoreA?: number;
  scoreB?: number;
};

type TeamMap = {
  [key: string]: {
    id: string;
    name: string;
    wins: number;
    losses: number;
    pf: number;
    pa: number;
  };
};

export const buildStandings = (games: Game[] = []) => {
  const teams: TeamMap = {};

  const ensureTeam = (name: string) => {
    if (!teams[name]) {
      teams[name] = {
        id: name,
        name,
        wins: 0,
        losses: 0,
        pf: 0,
        pa: 0,
      };
    }
  };

  games.forEach((g) => {
    if (g.scoreA == null || g.scoreB == null) return;

    ensureTeam(g.teamA);
    ensureTeam(g.teamB);

    teams[g.teamA].pf += g.scoreA;
    teams[g.teamA].pa += g.scoreB;

    teams[g.teamB].pf += g.scoreB;
    teams[g.teamB].pa += g.scoreA;

    if (g.scoreA > g.scoreB) {
      teams[g.teamA].wins++;
      teams[g.teamB].losses++;
    } else {
      teams[g.teamB].wins++;
      teams[g.teamA].losses++;
    }
  });

  return Object.values(teams);
};