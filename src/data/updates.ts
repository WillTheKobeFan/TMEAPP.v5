// src/data/updates

import { Update } from "src/types/update";

export const updates: Update[] = [
  {
    id: "1",

    title: "Playoff Picture Update",

    summary: "Huge standings shifts after Week 8.",

    content: [
      "Mark clinched the #1 seed.",
      "Gross controls own destiny.",
      "Bubble teams fighting for final spot.",
    ],

    createdAt: "2026-05-11",

    league: "Wednesday",

    category: "playoffs",

    important: true,

    image:
      "https://example.com/playoffs.png",

    startDate: "2026-05-11",

    endDate: "2026-05-18",
  },
];