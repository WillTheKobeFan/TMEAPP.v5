// src/types/team.ts

export type LeagueKey =
  | "Sunday"
  | "Monday"
  | "Wednesday";

export type TeamStatus =
  | "clinched"
  | "bubble"
  | "eliminated"
  | "upcoming";

export type TeamSnapshot = {
  id: string;

  name: string;

  league:
    | "Sunday"
    | "Monday"
    | "Wednesday";

  place: number;

  record: {
    wins: number;
    losses: number;
  };

  status: TeamStatus;

  nextMatch: {
    opponent: string;
    day: string;
    time: string;
  } | null;

  lastResult: {
    result: "W" | "L";
    opponent: string;
    score: string;
  } | null;

  schedule: {
    week: number;

    result:
      | "W"
      | "L"
      | "BYE"
      | "UPCOMING";

    opponent?: string;

    score?: string;
  }[];
};