/**
 * Compatibility bridge between existing league IDs
 * and stable universal Offering IDs.
 *
 * Keep this mapping until schedule, standings,
 * registration, and league data all use offering IDs.
 */

const LEGACY_LEAGUE_TO_OFFERING: Record<string, string> = {
  "sunday-am": "tme-sunday-mens-basketball",
  "monday-pm": "tme-monday-mens-basketball",
  "wednesday-pm": "tme-wednesday-mens-basketball",
};

const OFFERING_TO_LEGACY_LEAGUE: Record<string, string> =
  Object.fromEntries(
    Object.entries(LEGACY_LEAGUE_TO_OFFERING).map(
      ([leagueId, offeringId]) => [offeringId, leagueId]
    )
  );

export function getOfferingIdForLeague(
  leagueId: string
): string | undefined {
  return LEGACY_LEAGUE_TO_OFFERING[leagueId];
}

export function getLegacyLeagueIdForOffering(
  offeringId: string
): string | undefined {
  return OFFERING_TO_LEGACY_LEAGUE[offeringId];
}
