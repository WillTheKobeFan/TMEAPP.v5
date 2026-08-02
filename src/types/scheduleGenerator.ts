// src/types/scheduleGenerator.ts 

// the single source of truth for the generator pipeline

export type LeagueNight = "Sunday" | "Monday" | "Tuesday" | "Wednesday";

/**
 * INPUT: what admin configures before generating a schedule
 */
export type ScheduleGeneratorInput = {
  league: LeagueNight;

  teams: string[]; // team IDs (wed_tA, etc.)

  weeks: number;

  timeSlots: string[]; // ["7:00 PM", "8:00 PM", ...]

  courts?: string[]; // optional future scaling

  settings?: GeneratorSettings;
};

/**
 * Rules / constraints for schedule generation
 */
export type GeneratorSettings = {
  gamesPerTeam?: number;

  allowRepeatMatchups?: boolean;

  balanceHomeAway?: boolean; // optional for future (even if not used now)

  hardConstraints?: string[]; // human-readable or rule IDs

  softConstraints?: string[];
};

/**
 * OUTPUT: raw generated schedule before publishing
 */
export type GeneratedSchedule = {
  league: LeagueNight;

  games: ScheduleGameDraft[];

  byes: Record<number, string[]>; // week -> teamIds

  meta: ScheduleMeta;
};

/**
 * Individual game before publishing/finalization
 */
export type ScheduleGameDraft = {
  id: string;

  week: number;
  gameNumber: number;

  team1: string;
  team2: string;

  time?: string;
  court?: string;
};

/**
 * Final metadata summary
 */
export type ScheduleMeta = {
  totalTeams: number;
  totalGames: number;
  totalWeeks: number;

  generatedAt: string;
};