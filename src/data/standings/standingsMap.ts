// src/data/standings/standingsMap.ts

export type StandingTeam = {
  team: string;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
  streak: string;
};

export type StandingsMap = {
  sunday: StandingTeam[];
  monday: StandingTeam[];
  tuesday: StandingTeam[];
  wednesday: StandingTeam[];
};

export const standingsMap: StandingsMap = {
  sunday: [
    { team: "Ziller", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Tom", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Rich", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Edwards", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Timmy", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "TeeJ", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Dale", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Prince", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Dex", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
  ],

  monday: [
    { team: "Trifecta", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Beans", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Chimney", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    {
      team: "MAAC (Mac Concrete)",
      wins: 0,
      losses: 0,
      pf: 0,
      pa: 0,
      streak: "—",
    },
    { team: "Hard Rock", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    {
      team: "The Other Bar",
      wins: 0,
      losses: 0,
      pf: 0,
      pa: 0,
      streak: "—",
    },
    { team: "JRL", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
  ],

  tuesday: [
    { team: "Rich", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "TJ", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Timmy", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Dave", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Mark", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
  ],

  wednesday: [
    { team: "Duffy", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Neil", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Tom", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Gross", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Gervese", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Rob", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
    { team: "Mark", wins: 0, losses: 0, pf: 0, pa: 0, streak: "—" },
  ],
};