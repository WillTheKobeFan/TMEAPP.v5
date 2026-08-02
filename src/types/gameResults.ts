// src/types/gameResults.ts

export type GameResult = {
  id: string;

  league: string;

  week: number;

  team1: string;
  team1Name: string;

  team2: string;
  team2Name: string;

  winner: string | null;

  playedAt: string | null;
};