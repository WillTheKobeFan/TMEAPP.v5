// src/lib/playoffs/generateSeeds

export function generatePlayoffSeeds(standings: any[]) {
  return standings.map((team) => ({
    seed: team.seed,
    teamId: team.teamId,
  }));
}