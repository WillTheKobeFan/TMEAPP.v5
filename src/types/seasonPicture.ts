// src/types/seasonPicture.ts

export type PlayoffStatus =
  | "in"
  | "bubble"
  | "out";

export type SeasonPicture = {
  teamId: string;

  gamesPlayed: number;
  gamesRemaining: number;

  winPct: number;

  plusMinus: number;

  streak: string;

  playoffStatus: PlayoffStatus;
};