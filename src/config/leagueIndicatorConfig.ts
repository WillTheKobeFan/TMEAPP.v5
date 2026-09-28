// src/config/leagueIndicatorConfig.ts

import type { ImageSourcePropType } from "react-native";

export type OrganizationId =
  | "tme"
  | "pickup"
  | "taj";

/**
 * Backward-compatible alias.
 * Older files can continue using LeagueIndicatorId
 * while newer files use OrganizationId.
 */
export type LeagueIndicatorId = OrganizationId;

export type OrganizationIndicatorData = {
  id: OrganizationId;
  name: string;
  shortName: string;
  logo?: ImageSourcePropType;
  fallbackIcon: string;
  accentColor: string;
};

/**
 * Backward-compatible alias.
 */
export type LeagueIndicatorData =
  OrganizationIndicatorData;

export const organizationIndicatorConfig: Record<
  OrganizationId,
  OrganizationIndicatorData
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

    // Add the Taj Hill Hoops logo later:
    // logo: require("../../assets/logos/taj.png"),

    fallbackIcon: "🏀",
    accentColor: "#250F74",
  },
};

/**
 * Backward-compatible config name.
 */
export const leagueIndicatorConfig =
  organizationIndicatorConfig;

export const DEFAULT_ORGANIZATION_ID: OrganizationId =
  "tme";

/**
 * Backward-compatible default name.
 */
export const DEFAULT_LEAGUE_INDICATOR_ID =
  DEFAULT_ORGANIZATION_ID;

export function isOrganizationId(
  value: unknown
): value is OrganizationId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(
      organizationIndicatorConfig,
      value
    )
  );
}

/**
 * Backward-compatible helper.
 */
export const isLeagueIndicatorId =
  isOrganizationId;

export function getOrganizationIndicatorData(
  organizationId: unknown
): OrganizationIndicatorData {
  if (isOrganizationId(organizationId)) {
    return organizationIndicatorConfig[
      organizationId
    ];
  }

  return organizationIndicatorConfig[
    DEFAULT_ORGANIZATION_ID
  ];
}

/**
 * Backward-compatible helper.
 */
export const getLeagueIndicatorData =
  getOrganizationIndicatorData;