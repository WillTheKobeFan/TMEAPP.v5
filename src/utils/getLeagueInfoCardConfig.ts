// src/utils/getLeagueInfoCardConfig.ts

import { leagues } from "../data/leagues/index";
import type { LeagueInfoCardConfig } from "../types/leagueCard";

/**
 * One defined league entry from src/data/leagues/index.ts.
 *
 * The leagues registry is Partial, so NonNullable removes the
 * possibility of an undefined league entry.
 */
export type LeagueInfoSource = NonNullable<
  (typeof leagues)[keyof typeof leagues]
>;

/**
 * Separates a value such as:
 *
 * "Sunday \n 9am - 1pm"
 *
 * into:
 *
 * gameNight: "Sunday"
 * gameTime: "9am - 1pm"
 */
function splitGameNight(value: string): {
  gameNight: string;
  gameTime: string;
} {
  const [night = "", ...timeParts] = value
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    gameNight: night,
    gameTime: timeParts.join(" ") || "Time TBD",
  };
}

/**
 * Converts one entry from the league registry into the configuration
 * expected by LeagueInfoGameCard.
 */
export function getLeagueInfoCardConfig(
  data: LeagueInfoSource,
): LeagueInfoCardConfig {
  const { gameNight, gameTime } = splitGameNight(
    data.info.gameNight,
  );

  return {
    slug: data.slug,

    leagueName: data.info.leagueName,

    /**
     * The current league registry stores seasonStart and seasonEnd
     * separately rather than storing registrationDates.
     */
    registrationDates: "Registration information coming soon",

    seasonStart: data.info.seasonStart,
    seasonEnd: data.info.seasonEnd,

    gameNight,
    gameTime,

    totalWeeks: data.info.totalWeeks,

    leagueFormat: data.info.leagueFormat,
    playoffFormat: data.info.playoffFormat,

    skillDivision: data.info.skillDivision,
    skillDescription: data.info.skillDescription,

    gameRules: data.info.gameRules,
    gameResults: data.info.gameResults,
    standingsInfo: data.info.standingsInfo,
  };
}

export default getLeagueInfoCardConfig;