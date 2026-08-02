// src/types/update

export interface Update {
  id: string;

  title: string;

  summary?: string;

  content?: string[];

  createdAt: string;

  league?: string;

  category?:
    | "announcement"
    | "results"
    | "playoffs"
    | "schedule"
    | "general";

  important?: boolean;

  image?: string;

  startDate?: string;

  endDate?: string;
}