// src/config/admin/adminTypes.ts 

import type { Href } from "expo-router";

export type AdminSectionId =
  | "game-operations"
  | "teams"
  | "communication-media"
  | "screen-updates";

export type AdminSection = {
  id: AdminSectionId;
  title: string;
  description: string;
  icon: string;
};

export type AdminTool = {
  id: string;
  sectionId: AdminSectionId;
  title: string;
  description: string;
  icon: string;
  route: Href;
  status?: "active" | "coming-soon";
};