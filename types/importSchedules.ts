// types/importSchedules

export type LeagueNight = "Sunday" | "Monday" | "Wednesday";

export type Game = {
  id: string;
  week: number;
  league: LeagueNight;
  home: string;
  away: string;
  date?: string;
};

export type ImportScheduleParams = {
  league: LeagueNight;
  seasonId: string;
  rawText: string;
};

export type ImportScheduleResult = {
  success: true;
  league: LeagueNight;
  seasonId: string;
  weeks: Game[];
};