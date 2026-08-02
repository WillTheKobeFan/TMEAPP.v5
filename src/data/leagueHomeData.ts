// src/data/leagueHomeData.ts

import type { ImageSourcePropType } from "react-native";

export type LeagueHomeId = "tme" | "pickup" | "taj";

export type LeagueProgramStatus = "active" | "inactive";

export type RegistrationStatus =
  | "open"
  | "closed"
  | "comingSoon";

export type LeaguePhase =
  | "regular"
  | "quarterfinals"
  | "semifinals"
  | "championship"
  | "inactive";

export type LeagueRegistration = {
  status: RegistrationStatus;

  /**
   * Use YYYY-MM-DD.
   * The League Home screen calculates the remaining days automatically.
   */
  closesAt?: string;
};

export type LeagueStatus = {
  currentWeek: number;
  totalWeeks: number;
  phase: LeaguePhase;
};

export type LeagueProgram = {
  id: string;
  title: string;
  location: string;
  status: LeagueProgramStatus;
  level: string;
  registration: LeagueRegistration;
  leagueStatus: LeagueStatus;
};

export type LeagueChampion = {
  id: string;
  label: string;
  team: string;
};

export type LeagueHomeData = {
  id: LeagueHomeId;
  name: string;
  logoText: string;
  logo?: ImageSourcePropType;
  programs: LeagueProgram[];
  champions: LeagueChampion[];
};

export const leagueHomeData: Record<
  LeagueHomeId,
  LeagueHomeData
> = {
  tme: {
    id: "tme",
    name: "TME Social Sports",
    logoText: "TME",
    logo: require("../../assets/logos/tme.png"),

    programs: [
      {
        id: "sunday-am",
        title: "Sunday • AM",
        location: "YMCA",
        status: "active",
        level: "Recreational • Advanced",

        registration: {
          status: "open",
          closesAt: "2026-07-31",
        },

        leagueStatus: {
          currentWeek: 2,
          totalWeeks: 10,
          phase: "regular",
        },
      },

      {
        id: "monday-pm",
        title: "Monday • PM",
        location: "Berlin",
        status: "active",
        level: "Recreational • Friendly",

        registration: {
          status: "open",
          closesAt: "2026-07-31",
        },

        leagueStatus: {
          currentWeek: 1,
          totalWeeks: 10,
          phase: "regular",
        },
      },

      {
        id: "tuesday-pm",
        title: "Tuesday • PM",
        location: "YMCA",
        status: "inactive",
        level: "Recreational • Advanced",

        registration: {
          status: "closed",
        },

        leagueStatus: {
          currentWeek: 0,
          totalWeeks: 0,
          phase: "inactive",
        },
      },

      {
        id: "wednesday-pm",
        title: "Wednesday • PM",
        location: "Berlin",
        status: "active",
        level: "Recreational • Intermediate",

        registration: {
          status: "open",
          closesAt: "2026-07-31",
        },

        leagueStatus: {
          currentWeek: 2,
          totalWeeks: 10,
          phase: "regular",
        },
      },
    ],

    champions: [
      {
        id: "sun-champ",
        label: "Sunday • AM",
        team: "Prince",
      },
      {
        id: "mon-champ",
        label: "Monday • PM",
        team: "Trifecta",
      },
      {
        id: "wed-champ",
        label: "Wednesday • PM",
        team: "Duffy",
      },
    ],
  },

  pickup: {
    id: "pickup",
    name: "Pickup Basketball USA",
    logoText: "PICKUP USA",
    logo: require("../../assets/logos/pickup.png"),
    programs: [],
    champions: [],
  },

  taj: {
    id: "taj",
    name: "THH",
    logoText: "THH",
    programs: [],
    champions: [],
  },
};

export const leagueHomeOptions = Object.values(
  leagueHomeData,
).map((league) => ({
  id: league.id,
  name: league.name,
}));

export function getLeagueHomeData(
  id: LeagueHomeId,
): LeagueHomeData {
  return leagueHomeData[id];
}