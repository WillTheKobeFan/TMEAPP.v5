// src/types/cards.ts

export type TeamCardRecentResult = {
  week: string;
  display: string;
};

export type TeamCardRosterPlayer = {
  playerId?: string;
  displayName?: string;
  firstName: string;
  lastName?: string;
  isCaptain?: boolean;
  status?: "active" | "inactive" | "freeAgent" | string;
};

export type TeamCardConfig = {
  teamId?: string;
  teamName: string;
  leagueName?: string;

  wins: number;
  losses: number;
  streak?: string;

  seed?: number;
  playoffStatus?: string;

  nextGame?: string;
  lastResult?: string;

  recentResults?: TeamCardRecentResult[];

  pointsFor?: number;
  pointsAgainst?: number;
  pointDifferential?: number;

  winPercentage?: string;
  gamesBack?: string | number;

  roster?: TeamCardRosterPlayer[];
};