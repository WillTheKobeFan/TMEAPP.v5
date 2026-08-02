// src/types/standings.ts

export type TeamStanding = {
  name: string;

  wins: number;

  losses: number;

  rank: number;

  gb: number;

  pf: number;

  pa: number;
};

export type GameResult = {
  id: string;

  week: number;

  team1: string;

  team2: string;

  winner: string | null;
};