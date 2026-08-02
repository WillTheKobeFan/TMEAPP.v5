// src/config/admin/adminSections.ts

export const ADMIN_SECTIONS = [
  {
    id: "game-operations",
    title: "Game Operations",
    icon: "🎮",
    description:
      "Schedules, scores, standings and playoff management.",
  },
  {
    id: "teams",
    title: "Teams",
    icon: "👥",
    description:
      "Teams, rosters, branding and player information.",
  },
  {
    id: "communication-media",
    title: "Communication & Media",
    icon: "📢",
    description:
      "Messages, notifications, resources and champions.",
  },
  {
    id: "screen-updates",
    title: "Screen Updates",
    icon: "🖥️",
    description:
      "Home, registration, league information and visibility.",
  },
] as const;