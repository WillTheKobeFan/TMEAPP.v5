// src/types/updates.ts

import { LeagueNight } from "./leagues";

export type UpdateCategory =
  | "registration"
  | "season"
  | "playoffs"
  | "schedule"
  | "facility"
  | "announcement"
  | "league_change";

export interface UpdatePost {
  id: string;

  league: LeagueNight | "All";

  category: UpdateCategory;

  title: string;

  summary?: string;

  content: string[];

  createdAt: string;

  important?: boolean;

  startDate?: string;
  endDate?: string;

  image?: string;
}