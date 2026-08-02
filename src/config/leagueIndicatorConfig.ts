
// src/config/leagueIndicatorConfig.ts

import type { ImageSourcePropType } from "react-native";

export type LeagueIndicatorId = "tme" | "pickup" | "taj";

export type LeagueIndicatorData = {
  id: LeagueIndicatorId;
  name: string;
  shortName: string;
  logo?: ImageSourcePropType;
  fallbackIcon: string;
  accentColor: string;
};

export const leagueIndicatorConfig: Record<
  LeagueIndicatorId,
  LeagueIndicatorData
> = {
  tme: {
    id: "tme",
    name: "TME Social Sports",
    shortName: "TME",
    logo: require("../../assets/logos/tme.png"),
    fallbackIcon: "🏀",
    accentColor: "#250F74",
  },

  pickup: {
    id: "pickup",
    name: "Pickup Basketball USA",
    shortName: "Pickup",
    logo: require("../../assets/logos/pickup.png"),
    fallbackIcon: "🏀",
    accentColor: "#250F74",
  },

  taj: {
    id: "taj",
    name: "Taj Hill Hoops",
    shortName: "THH",

    // Add the Taj Hill logo here later:
    // logo: require("../../assets/logos/taj.png"),

    logo: undefined,
    fallbackIcon: "🏀",
    accentColor: "#250F74",
  },
};

export const DEFAULT_LEAGUE_INDICATOR_ID: LeagueIndicatorId = "tme";

export function isLeagueIndicatorId(
  value: unknown
): value is LeagueIndicatorId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(leagueIndicatorConfig, value)
  );
}

export function getLeagueIndicatorData(
  leagueId: unknown
): LeagueIndicatorData {
  if (isLeagueIndicatorId(leagueId)) {
    return leagueIndicatorConfig[leagueId];
  }

  return leagueIndicatorConfig[DEFAULT_LEAGUE_INDICATOR_ID];
}