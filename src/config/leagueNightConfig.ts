// src/config/leagueNightConfig.ts

import type { LeagueIndicatorId } from "@/config/leagueIndicatorConfig";

export type LeagueDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type LeaguePeriod = "AM" | "PM";

export type LeagueNightData = {
  id: string;
  organizationId: LeagueIndicatorId;

  day: LeagueDay;
  period: LeaguePeriod;

  displayName: string;
  routeLeagueId: string;

  active: boolean;
  displayOrder: number;

  badgeCount?: number;
};

export const leagueNightConfig: LeagueNightData[] = [
  /*
   * TME SOCIAL SPORTS
   */

  {
    id: "tme-sunday-am",
    organizationId: "tme",
    day: "Sunday",
    period: "AM",
    displayName: "Adult Recreational League",
    routeLeagueId: "sunday",
    active: true,
    displayOrder: 1,
  },

  {
    id: "tme-monday-pm",
    organizationId: "tme",
    day: "Monday",
    period: "PM",
    displayName: "Men's Adult League",
    routeLeagueId: "monday",
    active: true,
    displayOrder: 2,
  },

  {
    id: "tme-tuesday-pm",
    organizationId: "tme",
    day: "Tuesday",
    period: "PM",
    displayName: "Adult Advanced League",
    routeLeagueId: "tuesday",
    active: false,
    displayOrder: 3,
  },

  {
    id: "tme-wednesday-pm",
    organizationId: "tme",
    day: "Wednesday",
    period: "PM",
    displayName: "Adult Intermediate League",
    routeLeagueId: "wednesday",
    active: true,
    displayOrder: 4,
  },

  /*
   * PICKUP BASKETBALL USA
   *
   * Add the finalized Pickup leagues here later.
   */

  /*
  {
    id: "pickup-sunday-pm",
    organizationId: "pickup",
    day: "Sunday",
    period: "PM",
    displayName: "Men's Adult League",
    routeLeagueId: "pickup-sunday-adult",
    active: true,
    displayOrder: 1,
  },
  */

  /*
   * TAJ HILL HOOPS
   *
   * Add the finalized Taj Hill leagues here later.
   */
];

export function getActiveLeagueNights(
  organizationId: LeagueIndicatorId
): LeagueNightData[] {
  return leagueNightConfig
    .filter(
      (league) =>
        league.organizationId === organizationId &&
        league.active
    )
    .sort(
      (firstLeague, secondLeague) =>
        firstLeague.displayOrder -
        secondLeague.displayOrder
    );
}