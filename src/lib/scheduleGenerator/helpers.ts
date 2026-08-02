// src/lib/scheduleGenerator/helpers.ts

export function getWeeklyCapacity(teamCount: number, gameSlotCount: number) {
  const maxPossibleGames = Math.floor(teamCount / 2);
  const gamesPerWeek = Math.min(maxPossibleGames, gameSlotCount);
  const byesPerWeek = Math.max(0, teamCount - gamesPerWeek * 2);

  return {
    gamesPerWeek,
    byesPerWeek,
  };
}

export function makeGameId(leagueId: string, week: number, index: number) {
  return `${leagueId}_w${week}_g${index + 1}`;
}