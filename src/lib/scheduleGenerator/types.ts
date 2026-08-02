// src/lib/scheduleGenerator/types.ts

export type LeagueDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type ScheduleTeam = {
  id: string;
  name: string;
  captain?: string;
  captainSameAsTeamName: boolean;
};

export type GameSlot = {
  id: string;
  time: string;
  venue: string;
};

export type WeekRule = {
  week: number;

  gameLimit?: number;
  byeCount?: number;

  allowedTimeSlots?: string[];
  blockedTimeSlots?: string[];

  championshipCarryover?: boolean;
  notes?: string;
};

export type TeamPreference = {
  id: string;
  teamId: string;
  teamName: string;

  preferredTimes?: string[];
  avoidTimes?: string[];

  mustPlayWeeks?: number[];
  avoidByeWeeks?: number[];
  avoidWeeks?: number[];
};

export type GeneratorGame = {
  id: string;
  week: number;
  time: string;
  venue: string;

  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;

  status: "scheduled" | "completed" | "final";
  type: "regular" | "playoff" | "championship";
  resultType: "pending" | "normal" | "forfeit";
};

export type GeneratedWeek = {
  week: number;
  date?: string;
  games: GeneratorGame[];
  byes: ScheduleTeam[];
  hiddenByes?: ScheduleTeam[];
};

export type LeagueGeneratorConfig = {
  leagueId: string;
  leagueName: string;
  sport: string;
  day: LeagueDay;

  seasonId: string;
  seasonName: string;
  startDate: string;

  teams: ScheduleTeam[];

  regularSeasonWeeks: number;
  playoffWeeks: number;
  playoffTeams: number;

  gameSlots: GameSlot[];

  targetByesPerTeam: number;
  allowUnevenByes: boolean;

  weekRules?: WeekRule[];
  teamPreferences: TeamPreference[];

  requireEveryonePlaysOnce: boolean;
  allowDuplicateMatchups: boolean;
  preventBackToBackRematches: boolean;
  balanceTimeSlots: boolean;

  strictMode: boolean;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export interface WeeklyOverride {
  week: number;
  maxGames?: number;
  requiredByes?: number;
  disabledTimeSlots?: string[];
}

