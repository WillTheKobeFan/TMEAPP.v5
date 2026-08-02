export function normalizeGame(g: any) {
  return {
    id: g.id ?? Math.random().toString(),
    time: g.time ?? "",
    teamA: {
      id: g.teamA?.id ?? g.team1Id ?? "unknown_a",
      name: g.teamA?.name ?? g.team1Name ?? "TBD",
      score: g.teamA?.score ?? g.team1Score ?? null,
    },
    teamB: {
      id: g.teamB?.id ?? g.team2Id ?? "unknown_b",
      name: g.teamB?.name ?? g.team2Name ?? "TBD",
      score: g.teamB?.score ?? g.team2Score ?? null,
    },
    winnerId: g.winnerId ?? null,
    isForfeit: g.isForfeit ?? false,
    tag: g.tag ?? null,
  };
}