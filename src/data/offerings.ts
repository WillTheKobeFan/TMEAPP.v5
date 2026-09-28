// src/data/offerings.ts

import {
  OFFERING_CAPABILITY_IDS,
  OFFERING_STATUS_IDS,
  OFFERING_TYPE_IDS,
  REGISTRATION_MODE_IDS,
  type Offering,
} from "../config/offerings";

import {
  ORGANIZATION_IDS,
  getOrganizationOfferingIds,
  type OrganizationId,
} from "../config/organizations";

/**
 * Universal Offering Registry
 *
 * This is the current local/default source of truth for offerings
 * provided by organizations.
 *
 * Later, these records can come from Firestore while preserving
 * the same universal Offering shape.
 *
 * CORE DISTINCTION
 * ---------------------------------------------------------------------------
 *
 * FEATURES
 * Things the APP provides.
 *
 * Examples:
 * - Home
 * - Schedule
 * - Standings
 * - Inbox
 * - MyHub
 * - Search
 *
 * OFFERINGS
 * Things an ORGANIZATION provides.
 *
 * Examples:
 * - League
 * - Camp
 * - Clinic
 * - Training
 * - Membership
 * - Rental
 * - Pickup
 * - Special Event
 *
 * CAPABILITIES
 * Systems an OFFERING uses.
 *
 * Examples:
 * - Registration
 * - Schedule
 * - Teams
 * - Attendance
 * - Scores
 * - Standings
 * - Reservations
 * - Media
 *
 * Example:
 *
 * Organization:
 * TME Social Sports
 *
 * Offering:
 * Sunday Men's Basketball
 *
 * Capabilities:
 * Schedule, Teams, Scores, Standings, Playoffs, etc.
 */

// =============================================================================
// TME SOCIAL SPORTS
// =============================================================================

const TME_OFFERINGS: Offering[] = [
  {
    id: "tme-sunday-mens-basketball",
    organizationId: ORGANIZATION_IDS.TME,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Sunday Men's Basketball",
    shortName: "Sunday",

    description:
      "Sunday men's basketball league competition managed by TME Social Sports.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Adult Men's Basketball",
    },

    schedule: {
      days: ["sunday"],
      label: "Sunday",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.TEAM_AND_FREE_AGENT,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.CONFIRMATIONS,
      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
    ],
  },

  {
    id: "tme-monday-mens-basketball",
    organizationId: ORGANIZATION_IDS.TME,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Monday Men's Basketball",
    shortName: "Monday",

    description:
      "Monday men's basketball league competition managed by TME Social Sports.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Adult Men's Basketball",
    },

    schedule: {
      days: ["monday"],
      label: "Monday",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.TEAM_AND_FREE_AGENT,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.CONFIRMATIONS,
      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
    ],
  },

  {
    id: "tme-wednesday-mens-basketball",
    organizationId: ORGANIZATION_IDS.TME,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Wednesday Men's Basketball",
    shortName: "Wednesday",

    description:
      "Wednesday men's basketball league competition managed by TME Social Sports.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Adult Men's Basketball",
    },

    schedule: {
      days: ["wednesday"],
      label: "Wednesday",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.TEAM_AND_FREE_AGENT,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.CONFIRMATIONS,
      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
    ],
  },
];

// =============================================================================
// PICKUP BASKETBALL USA
// =============================================================================

const PICKUP_OFFERINGS: Offering[] = [
  // ---------------------------------------------------------------------------
  // ADULT LEAGUE
  // ---------------------------------------------------------------------------

  {
    id: "pickup-adult-league",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Adult Basketball League",
    shortName: "Adult League",

    description: "Organized adult basketball league competition.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Adult Basketball",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.TEAM_AND_FREE_AGENT,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,
      OFFERING_CAPABILITY_IDS.DIVISIONS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STATS,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.CONFIRMATIONS,
      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
      OFFERING_CAPABILITY_IDS.AWARDS,
    ],
  },

  // ---------------------------------------------------------------------------
  // YOUTH DEVELOPMENT LEAGUE
  // ---------------------------------------------------------------------------

  {
    id: "pickup-youth-development-league",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Youth Development League",
    shortName: "YDL",

    description:
      "Youth basketball development program combining organized league play with player development.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Youth Basketball",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAITLIST,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,
      OFFERING_CAPABILITY_IDS.DIVISIONS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STATS,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
      OFFERING_CAPABILITY_IDS.AWARDS,
    ],
  },

  // ---------------------------------------------------------------------------
  // OPEN PLAY / PICKUP
  // ---------------------------------------------------------------------------

  {
    id: "pickup-open-play",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.PICKUP,

    name: "Open Play / Pickup Basketball",
    shortName: "Pickup",

    description:
      "Open or organized basketball sessions for eligible participants.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.CHECK_IN,
      OFFERING_CAPABILITY_IDS.ATTENDANCE,

      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
    ],
  },

  // ---------------------------------------------------------------------------
  // SUMMER CAMP
  // ---------------------------------------------------------------------------

  {
    id: "pickup-summer-camp",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.CAMP,

    name: "Summer Basketball Camp",
    shortName: "Summer Camp",

    description:
      "Youth summer basketball camp with scheduled instruction, development, and activities.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    audience: {
      label: "Youth Basketball Camp",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capacity: {
      waitlistEnabled: true,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAITLIST,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
      OFFERING_CAPABILITY_IDS.AWARDS,
    ],
  },

  // ---------------------------------------------------------------------------
  // GROUP TRAINING
  // ---------------------------------------------------------------------------

  {
    id: "pickup-group-training",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.TRAINING,

    name: "Group Training",
    shortName: "Group Training",

    description:
      "Scheduled group basketball development and training sessions.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,
    ],
  },

  // ---------------------------------------------------------------------------
  // PRIVATE TRAINING
  // ---------------------------------------------------------------------------

  {
    id: "pickup-private-training",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.TRAINING,

    name: "Private Training",
    shortName: "Private Training",

    description:
      "Individual basketball training sessions scheduled with an instructor or trainer.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.RESERVATIONS,

      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,
    ],
  },

  // ---------------------------------------------------------------------------
  // MEMBERSHIP
  // ---------------------------------------------------------------------------

  {
    id: "pickup-membership",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.MEMBERSHIP,

    name: "Membership",
    shortName: "Membership",

    description:
      "Organization membership and facility-access options.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,
    ],
  },

  // ---------------------------------------------------------------------------
  // COURT RENTAL
  // ---------------------------------------------------------------------------

  {
    id: "pickup-court-rental",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.RENTAL,

    name: "Court Rental",
    shortName: "Court Rental",

    description:
      "Reservable basketball court space.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    capabilities: [
      OFFERING_CAPABILITY_IDS.RESERVATIONS,
      OFFERING_CAPABILITY_IDS.RESOURCES,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,
    ],
  },

  // ---------------------------------------------------------------------------
  // EQUIPMENT RENTAL
  // ---------------------------------------------------------------------------

  {
    id: "pickup-equipment-rental",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.RENTAL,

    name: "Equipment Rental",
    shortName: "Equipment",

    description:
      "Reservable basketball training equipment or other organization resources.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    capabilities: [
      OFFERING_CAPABILITY_IDS.RESERVATIONS,
      OFFERING_CAPABILITY_IDS.RESOURCES,
      OFFERING_CAPABILITY_IDS.EQUIPMENT,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,
    ],
  },

  // ---------------------------------------------------------------------------
  // PARTIES / PACKAGES
  // ---------------------------------------------------------------------------

  {
    id: "pickup-parties",
    organizationId: ORGANIZATION_IDS.PICKUP,

    type: OFFERING_TYPE_IDS.PARTY,

    name: "Parties & Packages",
    shortName: "Parties",

    description:
      "Bookable celebrations, parties, facility packages, and group events.",

    status: OFFERING_STATUS_IDS.ACTIVE,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.RESERVATIONS,
      OFFERING_CAPABILITY_IDS.RESOURCES,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,
      OFFERING_CAPABILITY_IDS.MEDIA,
    ],
  },
];

// =============================================================================
// TAJ HILL HOOPS
// =============================================================================

const TAJ_OFFERINGS: Offering[] = [
  {
    id: "taj-mens-league",
    organizationId: ORGANIZATION_IDS.TAJ,

    type: OFFERING_TYPE_IDS.LEAGUE,

    name: "Men's Basketball League",
    shortName: "Men's League",

    description:
      "Organized men's basketball league competition.",

    status: OFFERING_STATUS_IDS.UPCOMING,

    audience: {
      label: "Adult Men's Basketball",
    },

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.TEAM_AND_FREE_AGENT,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,

      OFFERING_CAPABILITY_IDS.TEAMS,
      OFFERING_CAPABILITY_IDS.ROSTERS,

      OFFERING_CAPABILITY_IDS.SCORES,
      OFFERING_CAPABILITY_IDS.STANDINGS,
      OFFERING_CAPABILITY_IDS.PLAYOFFS,

      OFFERING_CAPABILITY_IDS.CONFIRMATIONS,
      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,
    ],
  },

  {
    id: "taj-training",
    organizationId: ORGANIZATION_IDS.TAJ,

    type: OFFERING_TYPE_IDS.TRAINING,

    name: "Basketball Training",
    shortName: "Training",

    description:
      "Basketball player development and training sessions.",

    status: OFFERING_STATUS_IDS.UPCOMING,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,
      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,
    ],
  },

  {
    id: "taj-clinics",
    organizationId: ORGANIZATION_IDS.TAJ,

    type: OFFERING_TYPE_IDS.CLINIC,

    name: "Basketball Clinics",
    shortName: "Clinics",

    description:
      "Focused basketball instruction and player-development clinics.",

    status: OFFERING_STATUS_IDS.UPCOMING,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAITLIST,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,
      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,
      OFFERING_CAPABILITY_IDS.MEDIA,
    ],
  },

  {
    id: "taj-camps",
    organizationId: ORGANIZATION_IDS.TAJ,

    type: OFFERING_TYPE_IDS.CAMP,

    name: "Basketball Camps",
    shortName: "Camps",

    description:
      "Basketball camps focused on instruction, development, and organized activities.",

    status: OFFERING_STATUS_IDS.UPCOMING,

    registration: {
      required: true,
      mode: REGISTRATION_MODE_IDS.OPEN,
    },

    capacity: {
      waitlistEnabled: true,
    },

    capabilities: [
      OFFERING_CAPABILITY_IDS.REGISTRATION,
      OFFERING_CAPABILITY_IDS.WAITLIST,
      OFFERING_CAPABILITY_IDS.WAIVER,
      OFFERING_CAPABILITY_IDS.PAYMENT,

      OFFERING_CAPABILITY_IDS.SCHEDULE,
      OFFERING_CAPABILITY_IDS.ATTENDANCE,
      OFFERING_CAPABILITY_IDS.CHECK_IN,

      OFFERING_CAPABILITY_IDS.ASSIGNMENTS,

      OFFERING_CAPABILITY_IDS.MESSAGING,
      OFFERING_CAPABILITY_IDS.NOTIFICATIONS,

      OFFERING_CAPABILITY_IDS.MEDIA,

      OFFERING_CAPABILITY_IDS.INCIDENT_REPORTS,
    ],
  },
];

// =============================================================================
// UNIVERSAL REGISTRY
// =============================================================================

/**
 * Complete local offering registry.
 *
 * Firestore can eventually replace or extend this source without changing
 * consumers that depend on Offering[].
 */
export const OFFERING_LIST: Offering[] = [
  ...TME_OFFERINGS,
  ...PICKUP_OFFERINGS,
  ...TAJ_OFFERINGS,
];

/**
 * Lookup map keyed by Offering.id.
 *
 * This allows fast lookup without repeatedly searching OFFERING_LIST.
 */
export const OFFERINGS_BY_ID: Record<string, Offering> =
  Object.fromEntries(
    OFFERING_LIST.map((offering) => [
      offering.id,
      offering,
    ])
  );

// =============================================================================
// BASIC LOOKUP HELPERS
// =============================================================================

/**
 * Returns an offering by ID.
 */
export function getOfferingById(
  offeringId: string
): Offering | undefined {
  return OFFERINGS_BY_ID[offeringId];
}

/**
 * Returns true when an Offering exists in the registry.
 */
export function hasOffering(
  offeringId: string
): boolean {
  return Boolean(OFFERINGS_BY_ID[offeringId]);
}

/**
 * Returns every registry offering belonging to an organization.
 *
 * IMPORTANT:
 *
 * This checks registry ownership only.
 *
 * It does NOT check whether the organization's current configuration
 * has enabled/referenced that offering.
 *
 * For normal application UI, prefer:
 *
 * getConfiguredOfferingsForOrganization()
 */
export function getOfferingsByOrganization(
  organizationId: OrganizationId
): Offering[] {
  return OFFERING_LIST.filter(
    (offering) =>
      offering.organizationId === organizationId
  );
}

/**
 * Returns all registry offerings of a particular universal type.
 */
export function getOfferingsByType(
  type: Offering["type"]
): Offering[] {
  return OFFERING_LIST.filter(
    (offering) => offering.type === type
  );
}

/**
 * Returns registry offerings belonging to an organization
 * that use a particular capability.
 *
 * This checks registry ownership only.
 *
 * For configured offerings, prefer:
 *
 * getConfiguredOrganizationOfferingsWithCapability()
 */
export function getOrganizationOfferingsWithCapability(
  organizationId: OrganizationId,
  capability: Offering["capabilities"][number]
): Offering[] {
  return getOfferingsByOrganization(
    organizationId
  ).filter((offering) =>
    offering.capabilities.includes(capability)
  );
}

// =============================================================================
// CONFIGURATION-AWARE HELPERS
// =============================================================================

/**
 * Returns the actual Offering objects currently configured for
 * an organization.
 *
 * This follows organization.offeringIds from organizations.ts.
 *
 * This distinction matters because an Offering may exist in the
 * universal registry without currently being enabled/configured
 * for an organization.
 *
 * THIS is the primary organization Offering helper that UI screens
 * should eventually consume.
 */
export function getConfiguredOfferingsForOrganization(
  organizationId: OrganizationId
): Offering[] {
  const offeringIds =
    getOrganizationOfferingIds(organizationId);

  return offeringIds
    .map((offeringId) => getOfferingById(offeringId))
    .filter(
      (offering): offering is Offering =>
        offering !== undefined
    );
}

/**
 * Returns configured offerings that are currently active
 * or accepting registration.
 */
export function getConfiguredActiveOfferingsForOrganization(
  organizationId: OrganizationId
): Offering[] {
  return getConfiguredOfferingsForOrganization(
    organizationId
  ).filter(
    (offering) =>
      offering.status === OFFERING_STATUS_IDS.ACTIVE ||
      offering.status ===
        OFFERING_STATUS_IDS.REGISTRATION_OPEN
  );
}

/**
 * Returns configured offerings for an organization that use
 * a specific capability.
 *
 * Example:
 *
 * getConfiguredOrganizationOfferingsWithCapability(
 *   ORGANIZATION_IDS.TME,
 *   OFFERING_CAPABILITY_IDS.STANDINGS
 * )
 *
 * would return only configured TME offerings where standings
 * are enabled.
 */
export function getConfiguredOrganizationOfferingsWithCapability(
  organizationId: OrganizationId,
  capability: Offering["capabilities"][number]
): Offering[] {
  return getConfiguredOfferingsForOrganization(
    organizationId
  ).filter((offering) =>
    offering.capabilities.includes(capability)
  );
}

/**
 * Returns configured offerings of a particular universal type.
 *
 * Example:
 *
 * Organization = Pickup USA
 * Type = training
 *
 * Result:
 * - Group Training
 * - Private Training
 */
export function getConfiguredOrganizationOfferingsByType(
  organizationId: OrganizationId,
  type: Offering["type"]
): Offering[] {
  return getConfiguredOfferingsForOrganization(
    organizationId
  ).filter(
    (offering) => offering.type === type
  );
}

/**
 * Returns whether a configured Offering belongs to an organization.
 *
 * This is stricter than checking only the Offering registry.
 */
export function isOfferingConfiguredForOrganization(
  organizationId: OrganizationId,
  offeringId: string
): boolean {
  return getOrganizationOfferingIds(
    organizationId
  ).includes(offeringId);
}

/**
 * Returns offering IDs configured by an organization that do not
 * currently resolve to an Offering object in the registry.
 *
 * This is useful for:
 * - Development validation
 * - Organization setup
 * - Firestore imports
 * - Migration checks
 * - Preventing broken organization configurations
 */
export function getMissingOrganizationOfferingIds(
  organizationId: OrganizationId
): string[] {
  return getOrganizationOfferingIds(
    organizationId
  ).filter(
    (offeringId) => !hasOffering(offeringId)
  );
}

/**
 * Returns true when every configured Offering ID for an organization
 * resolves to an Offering in the registry.
 */
export function organizationOfferingConfigurationIsValid(
  organizationId: OrganizationId
): boolean {
  return (
    getMissingOrganizationOfferingIds(
      organizationId
    ).length === 0
  );
}