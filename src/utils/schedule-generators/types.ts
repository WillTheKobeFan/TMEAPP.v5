// src/utils/schedule-generators/types.ts

export type LeagueNight =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type GameStatus = "scheduled" | "completed" | "final";
export type GameType = "regular" | "playoff" | "championship";
export type ResultType = "pending" | "normal" | "forfeit";

export type GeneratorTeam = {
  id: string;
  teamName: string;
};

export type GeneratedGame = {
  id: string;
  league: LeagueNight;
  seasonId: string;
  week: number;
  date: string;
  time: string;
  venue: string;

  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;

  team1Score: string;
  team2Score: string;
  winnerId: string;
  winnerName: string;

  status: GameStatus;
  type: GameType;
  resultType: ResultType;

  sortOrder: number;
  published: boolean;
  locked: boolean;
  notes: string;
};

export type GeneratedWeek = {
  week: number;
  date: string;
  games: GeneratedGame[];
  byes: string[];
  hiddenByes?: string[];
  notes?: string[];
};

export type SundayChampionshipMode =
  | "carryover"
  | "sameSession"
  | "none";

export type GenerateScheduleInput = {
  leagueNight: LeagueNight;
  seasonId: string;
  startDate: string;
  teams: GeneratorTeam[];
  timeSlots: string[];
  venue: string;
  seed: number;
  sundayChampionshipMode?: SundayChampionshipMode;
  championshipTeamIds?: string[];
  championshipTime?: string;
  championshipVenue?: string;
  sundayRules?: SundayGeneratorRules;
  timeConstraints?: TeamTimeConstraint[];
};

export type GenerateScheduleResult = {
  success: boolean;
  weeks: GeneratedWeek[];
  errors: string[];
  attempts: number;
};

export type SundayGeneratorRules = {
  week1VisibleByeTeamId?: string;
  lateOnlyTeamIds?: string[];
  avoidWeek10ByeTeamIds?: string[];
  weeks8To10TimeSlots?: string[];
};

export type TeamTimeConstraint = {
  teamId: string;
  allowedTimes?: string[];
  preferredTimes?: string[];
  targetPreferredGames?: number;
};