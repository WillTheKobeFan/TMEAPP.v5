// src/data/rosters.ts

export type RosterPlayer = {
  playerId: string;
  displayName: string;
  captain?: boolean;
  status: "active" | "reserve" | "inactive";
};

export const rostersByTeamId: Record<string, RosterPlayer[]> = {
  sun_tH: [
    {
      playerId: "sun_p0001",
      displayName: "Prince",
      captain: true,
      status: "active",
    },
    {
      playerId: "sun_p0002",
      displayName: "Bryan O.",
      status: "active",
    },
    {
      playerId: "sun_p0003",
      displayName: "Marquis C.",
      status: "active",
    },
    {
      playerId: "sun_p0004",
      displayName: "Jake T.",
      status: "active",
    },
    {
      playerId: "sun_p0005",
      displayName: "Gary G.",
      status: "active",
    },
    {
      playerId: "sun_p0006",
      displayName: "Joey B.",
      status: "active",
    },
    {
      playerId: "sun_p0007",
      displayName: "Reggie C.",
      status: "active",
    },
  ],
};