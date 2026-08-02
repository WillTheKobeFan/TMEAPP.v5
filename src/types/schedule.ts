// src/types/schedule.ts

export type ScheduleGame = {
  id: string;
  week: number;
  team1: string;
  team2: string;
};

export type PublishedSchedule = {
  games: ScheduleGame[];
  byes: Record<number, string[]>;
  meta: {
    totalTeams: number;
    totalGames: number;
    totalWeeks: number;
  };
};