// src/config/admin/adminTools.ts

export const ADMIN_TOOLS = {
  "game-operations": [
    {
      id: "schedule-generator",
      title: "Schedule Generator",
      icon: "⚡",
      route: "/admin/game-operations/schedule-generator",
    },
    {
      id: "manage-games",
      title: "Manage Games",
      icon: "🗓️",
      route: "/admin/game-operations/edit-games",
    },
    {
      id: "scores-results",
      title: "Scores & Results",
      icon: "🧮",
      route: "/admin/game-operations/game-results",
    },
    {
      id: "season-picture",
      title: "Standings & Season Picture",
      icon: "📊",
      route: "/admin/game-operations/season-picture",
    },
    {
      id: "playoffs",
      title: "Playoff Management",
      icon: "🏆",
      route: "/admin/game-operations/playoff-seeding",
    },
  ],
};