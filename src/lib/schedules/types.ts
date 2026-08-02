// src/lib/schedules/types.ts

export type LeagueNight = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday"
  | "Friday" | "Saturday";

export type GameType = "regular" | "playoff" | "championship";

export type Team = {
  id: string;
  name: string;
};

export type ChampionshipCarryover = {
  enabled: boolean;
  team1Id: string;
  team2Id: string;
  time: string;
};

export type TeamConstraint = {
  teamId: string;
  preferredTimes: string[];
  avoidByeWeeks: number[];
  avoidWeek10Bye?: boolean;
};

export type ScheduleGame = {
  id: string;
  week: number;
  date: string;
  time: string;
  team1: Team;
  team2: Team;
  type: GameType;
};

export type ScheduleWeek = {
  week: number;
  date: string;
  label?: string;
  games: ScheduleGame[];
  byes: Team[];
  hiddenByes?: Team[];
};

export type GenerateScheduleInput = {
  league: LeagueNight;
  teams: Team[];
  startDate: string;
  constraints: TeamConstraint[];
  championshipCarryover?: ChampionshipCarryover;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};