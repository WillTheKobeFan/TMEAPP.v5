import { LeagueNight } from "types/leagues";

export const LEAGUE_STATUS: Record<LeagueNight, "active" | "inactive"> = {
  Sunday: "active",
  Monday: "active",
  Tuesday: "inactive",
  Wednesday: "active",
};

export type LeagueStatus =
  | "active"
  | "inactive"
  | "coming_soon"
  | "paused";