// src/types/firebaseSchedule.ts

export type RawGame = {
  gameId: string;
  id?: string;

  league?: string;
  leagueNight: string;
  seasonId: string;

  week: number;
  date: string;
  time: string;

  team1Id: string;
  team2Id: string;

  team1?: string;
  team2?: string;

  team1Score: number | null;
  team2Score: number | null;

  score?: string | null;
  winner?: string | null;
  winnerTeamId?: string | null;

  status: "scheduled" | "completed" | "cancelled";
  type: "regular" | "playoff" | "championship" | string;
  resultType: "normal" | "forfeit" | "pending" | string;

  phase?: "regular" | "playoffs";
  round?: "quarterfinal" | "semifinal" | "championship";
};

export type Game = RawGame;

export type ScheduleWeek = {
  week: number;
  date: string | null;
  games: RawGame[];
  announcements?: string[];
};

export type SessionData = {
  weeks: ScheduleWeek[];
};

export type ParsedScheduleResult = {
  weeks: ScheduleWeek[];
};