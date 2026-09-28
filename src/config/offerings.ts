// src/config/offerings.ts

/**
 * Universal Offering System
 *
 * An Offering represents something an organization provides.
 *
 * Examples:
 * - Men's Basketball League
 * - Youth Development League
 * - Summer Camp
 * - Basketball Clinic
 * - Private Training
 * - Group Training
 * - Open Gym / Pickup
 * - Tournament
 * - Membership
 * - Court Rental
 * - Birthday Party
 * - Special Event
 *
 * IMPORTANT:
 * An Offering is NOT a navigation screen.
 *
 * Organizations enable offerings and configure which capabilities
 * each offering uses. The rest of the app can then adapt around
 * those configurations.
 */

// -----------------------------------------------------------------------------
// OFFERING TYPES
// -----------------------------------------------------------------------------

/**
 * Stable universal offering type IDs.
 *
 * Keep these IDs stable because they may eventually be stored in:
 * - Firestore
 * - Organization configuration
 * - Registration records
 * - Search filters
 * - MyHub
 * - Schedule/event records
 */
export const OFFERING_TYPE_IDS = {
  LEAGUE: "league",
  TOURNAMENT: "tournament",
  PICKUP: "pickup",

  CAMP: "camp",
  CLINIC: "clinic",
  TRAINING: "training",
  CLASS: "class",
  LESSON: "lesson",

  MEMBERSHIP: "membership",

  RENTAL: "rental",

  EVENT: "event",
  PARTY: "party",

  CUSTOM: "custom",
} as const;

export type OfferingTypeId =
  (typeof OFFERING_TYPE_IDS)[keyof typeof OFFERING_TYPE_IDS];

// -----------------------------------------------------------------------------
// OFFERING CATEGORIES
// -----------------------------------------------------------------------------

/**
 * Broad categories used for:
 * - Organization setup
 * - Discovery
 * - Search
 * - Filtering
 * - Admin configuration
 *
 * Categories organize offerings but do not control permissions.
 */
export const OFFERING_CATEGORY_IDS = {
  COMPETITION: "competition",
  ACTIVITY: "activity",
  INSTRUCTION: "instruction",
  MEMBERSHIP: "membership",
  RESERVATION: "reservation",
  EVENT: "event",
  CUSTOM: "custom",
} as const;

export type OfferingCategoryId =
  (typeof OFFERING_CATEGORY_IDS)[keyof typeof OFFERING_CATEGORY_IDS];

// -----------------------------------------------------------------------------
// OFFERING STATUS
// -----------------------------------------------------------------------------

export const OFFERING_STATUS_IDS = {
  DRAFT: "draft",
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration-open",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type OfferingStatusId =
  (typeof OFFERING_STATUS_IDS)[keyof typeof OFFERING_STATUS_IDS];

// -----------------------------------------------------------------------------
// OFFERING CAPABILITIES
// -----------------------------------------------------------------------------

/**
 * Capabilities describe what an offering can use.
 *
 * These are intentionally different from permissions.
 *
 * Example:
 *
 * A league may enable STANDINGS.
 * That means standings exist for the offering.
 *
 * Permissions then determine WHO may view/manage those standings.
 */
export const OFFERING_CAPABILITY_IDS = {
  REGISTRATION: "registration",
  WAITLIST: "waitlist",
  WAIVER: "waiver",
  PAYMENT: "payment",

  SCHEDULE: "schedule",
  ATTENDANCE: "attendance",
  CHECK_IN: "check-in",
  CONFIRMATIONS: "confirmations",

  TEAMS: "teams",
  ROSTERS: "rosters",
  DIVISIONS: "divisions",

  SCORES: "scores",
  STATS: "stats",
  STANDINGS: "standings",
  PLAYOFFS: "playoffs",

  ASSIGNMENTS: "assignments",

  MESSAGING: "messaging",
  NOTIFICATIONS: "notifications",

  MEDIA: "media",

  RESERVATIONS: "reservations",
  RESOURCES: "resources",
  EQUIPMENT: "equipment",

  INCIDENT_REPORTS: "incident-reports",

  AWARDS: "awards",

  CUSTOM: "custom",
} as const;

export type OfferingCapabilityId =
  (typeof OFFERING_CAPABILITY_IDS)[keyof typeof OFFERING_CAPABILITY_IDS];

// -----------------------------------------------------------------------------
// OFFERING TYPE DEFINITION
// -----------------------------------------------------------------------------

export type OfferingTypeDefinition = {
  id: OfferingTypeId;
  label: string;
  shortLabel: string;
  description: string;
  category: OfferingCategoryId;
};

/**
 * Universal offering types.
 *
 * Organizations may use any combination of these.
 */
export const OFFERING_TYPES: Record<
  OfferingTypeId,
  OfferingTypeDefinition
> = {
  [OFFERING_TYPE_IDS.LEAGUE]: {
    id: OFFERING_TYPE_IDS.LEAGUE,
    label: "League",
    shortLabel: "League",
    description:
      "Organized recurring competition that may include teams, schedules, scores, standings, and playoffs.",
    category: OFFERING_CATEGORY_IDS.COMPETITION,
  },

  [OFFERING_TYPE_IDS.TOURNAMENT]: {
    id: OFFERING_TYPE_IDS.TOURNAMENT,
    label: "Tournament",
    shortLabel: "Tournament",
    description:
      "Organized competition typically held across a limited date range with brackets, standings, or championship play.",
    category: OFFERING_CATEGORY_IDS.COMPETITION,
  },

  [OFFERING_TYPE_IDS.PICKUP]: {
    id: OFFERING_TYPE_IDS.PICKUP,
    label: "Pickup / Open Play",
    shortLabel: "Pickup",
    description:
      "Open or organized recreational play that may use schedules, registration, capacity, or check-in.",
    category: OFFERING_CATEGORY_IDS.ACTIVITY,
  },

  [OFFERING_TYPE_IDS.CAMP]: {
    id: OFFERING_TYPE_IDS.CAMP,
    label: "Camp",
    shortLabel: "Camp",
    description:
      "Multi-session development or recreational program that may include registration, attendance, instruction, and events.",
    category: OFFERING_CATEGORY_IDS.INSTRUCTION,
  },

  [OFFERING_TYPE_IDS.CLINIC]: {
    id: OFFERING_TYPE_IDS.CLINIC,
    label: "Clinic",
    shortLabel: "Clinic",
    description:
      "Focused instructional program or event centered around development of specific skills or activities.",
    category: OFFERING_CATEGORY_IDS.INSTRUCTION,
  },

  [OFFERING_TYPE_IDS.TRAINING]: {
    id: OFFERING_TYPE_IDS.TRAINING,
    label: "Training",
    shortLabel: "Training",
    description:
      "Individual or group development sessions led by trainers, coaches, or instructors.",
    category: OFFERING_CATEGORY_IDS.INSTRUCTION,
  },

  [OFFERING_TYPE_IDS.CLASS]: {
    id: OFFERING_TYPE_IDS.CLASS,
    label: "Class",
    shortLabel: "Class",
    description:
      "Recurring or scheduled instructional activity for individuals or groups.",
    category: OFFERING_CATEGORY_IDS.INSTRUCTION,
  },

  [OFFERING_TYPE_IDS.LESSON]: {
    id: OFFERING_TYPE_IDS.LESSON,
    label: "Lesson",
    shortLabel: "Lesson",
    description:
      "Individual or small-group instructional session that may be scheduled or booked.",
    category: OFFERING_CATEGORY_IDS.INSTRUCTION,
  },

  [OFFERING_TYPE_IDS.MEMBERSHIP]: {
    id: OFFERING_TYPE_IDS.MEMBERSHIP,
    label: "Membership",
    shortLabel: "Membership",
    description:
      "Membership or access plan that may provide benefits, facility access, pricing, or eligibility.",
    category: OFFERING_CATEGORY_IDS.MEMBERSHIP,
  },

  [OFFERING_TYPE_IDS.RENTAL]: {
    id: OFFERING_TYPE_IDS.RENTAL,
    label: "Rental / Reservation",
    shortLabel: "Rental",
    description:
      "Bookable facility, court, field, room, equipment, or other organization resource.",
    category: OFFERING_CATEGORY_IDS.RESERVATION,
  },

  [OFFERING_TYPE_IDS.EVENT]: {
    id: OFFERING_TYPE_IDS.EVENT,
    label: "Special Event",
    shortLabel: "Event",
    description:
      "Organization event that may include registration, attendance, scheduling, capacity, or special access.",
    category: OFFERING_CATEGORY_IDS.EVENT,
  },

  [OFFERING_TYPE_IDS.PARTY]: {
    id: OFFERING_TYPE_IDS.PARTY,
    label: "Party / Package",
    shortLabel: "Party",
    description:
      "Bookable party, celebration, group package, or similar organization service.",
    category: OFFERING_CATEGORY_IDS.EVENT,
  },

  [OFFERING_TYPE_IDS.CUSTOM]: {
    id: OFFERING_TYPE_IDS.CUSTOM,
    label: "Custom Offering",
    shortLabel: "Custom",
    description:
      "Organization-specific offering assembled from existing platform capabilities.",
    category: OFFERING_CATEGORY_IDS.CUSTOM,
  },
};

// -----------------------------------------------------------------------------
// AUDIENCE
// -----------------------------------------------------------------------------

export type OfferingAudience = {
  minAge?: number;
  maxAge?: number;

  /**
   * Examples:
   * ["1", "2", "3"]
   * ["Middle School"]
   */
  grades?: string[];

  /**
   * Examples:
   * ["recreational"]
   * ["beginner", "intermediate"]
   */
  skillLevels?: string[];

  /**
   * Optional free-form audience label for display.
   *
   * Examples:
   * "Adults 18+"
   * "Grades 1–9"
   * "All Skill Levels"
   */
  label?: string;
};

// -----------------------------------------------------------------------------
// DATES / SCHEDULE SUMMARY
// -----------------------------------------------------------------------------

export type OfferingDates = {
  startDate?: string;
  endDate?: string;
  registrationOpenDate?: string;
  registrationDeadline?: string;
};

export type OfferingScheduleSummary = {
  /**
   * Examples:
   * ["sunday"]
   * ["monday", "wednesday", "friday"]
   */
  days?: string[];

  startTime?: string;
  endTime?: string;

  /**
   * Optional human-readable schedule text.
   *
   * Examples:
   * "Sunday Nights"
   * "Mon–Fri • 9 AM–2 PM"
   */
  label?: string;
};

// -----------------------------------------------------------------------------
// LOCATION
// -----------------------------------------------------------------------------

export type OfferingLocation = {
  facilityId?: string;
  resourceId?: string;

  facilityName?: string;
  venueName?: string;

  /**
   * Allows an offering to span more than one facility/location.
   */
  multiVenue?: boolean;
};

// -----------------------------------------------------------------------------
// PRICING
// -----------------------------------------------------------------------------

export type OfferingPricing = {
  free?: boolean;

  currency?: string;

  individualPrice?: number;
  teamPrice?: number;

  memberPrice?: number;
  nonMemberPrice?: number;

  perSessionPrice?: number;
  perWeekPrice?: number;
  perMonthPrice?: number;

  /**
   * Optional display text for pricing models that do not fit
   * cleanly into a single numeric field.
   *
   * Example:
   * "From $139/week"
   */
  label?: string;
};

// -----------------------------------------------------------------------------
// CAPACITY
// -----------------------------------------------------------------------------

export type OfferingCapacity = {
  limit?: number;
  waitlistEnabled?: boolean;
};

// -----------------------------------------------------------------------------
// REGISTRATION
// -----------------------------------------------------------------------------

export const REGISTRATION_MODE_IDS = {
  NONE: "none",
  OPEN: "open",
  INVITE_ONLY: "invite-only",
  TEAM: "team",
  FREE_AGENT: "free-agent",
  TEAM_AND_FREE_AGENT: "team-and-free-agent",
} as const;

export type RegistrationModeId =
  (typeof REGISTRATION_MODE_IDS)[keyof typeof REGISTRATION_MODE_IDS];

export type OfferingRegistration = {
  required?: boolean;
  mode?: RegistrationModeId;
};

// -----------------------------------------------------------------------------
// OFFERING
// -----------------------------------------------------------------------------

/**
 * Universal offering instance.
 *
 * Example:
 *
 * type = "league"
 * name = "Sunday Men's Basketball"
 *
 * OR:
 *
 * type = "camp"
 * name = "Summer Basketball Camp"
 *
 * Both use the same base model.
 */
export type Offering = {
  /**
   * Stable offering instance ID.
   *
   * Examples:
   * "tme-sunday"
   * "pickup-ydl-season-3"
   * "pickup-summer-camp-2026"
   */
  id: string;

  organizationId: string;

  type: OfferingTypeId;

  name: string;
  shortName?: string;
  description?: string;

  status: OfferingStatusId;

  audience?: OfferingAudience;

  dates?: OfferingDates;

  schedule?: OfferingScheduleSummary;

  location?: OfferingLocation;

  pricing?: OfferingPricing;

  capacity?: OfferingCapacity;

  registration?: OfferingRegistration;

  /**
   * Capabilities enabled specifically for this offering.
   *
   * Example:
   *
   * League:
   * [
   *   "registration",
   *   "schedule",
   *   "teams",
   *   "rosters",
   *   "scores",
   *   "standings",
   *   "playoffs"
   * ]
   *
   * Camp:
   * [
   *   "registration",
   *   "schedule",
   *   "attendance",
   *   "waiver"
   * ]
   */
  capabilities: OfferingCapabilityId[];

  /**
   * Organization-specific information that does not justify
   * changing the universal Offering model.
   *
   * Use this sparingly.
   */
  customFields?: Record<string, unknown>;
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

export const OFFERING_TYPE_LIST: OfferingTypeDefinition[] =
  Object.values(OFFERING_TYPES);

/**
 * Returns a universal offering-type definition.
 */
export function getOfferingTypeById(
  typeId: OfferingTypeId
): OfferingTypeDefinition {
  return OFFERING_TYPES[typeId];
}

/**
 * Checks whether an unknown value is a valid OfferingTypeId.
 */
export function isOfferingTypeId(
  value: unknown
): value is OfferingTypeId {
  return (
    typeof value === "string" &&
    Object.values(OFFERING_TYPE_IDS).includes(
      value as OfferingTypeId
    )
  );
}

/**
 * Checks whether an unknown value is a valid OfferingStatusId.
 */
export function isOfferingStatusId(
  value: unknown
): value is OfferingStatusId {
  return (
    typeof value === "string" &&
    Object.values(OFFERING_STATUS_IDS).includes(
      value as OfferingStatusId
    )
  );
}

/**
 * Checks whether an unknown value is a valid OfferingCapabilityId.
 */
export function isOfferingCapabilityId(
  value: unknown
): value is OfferingCapabilityId {
  return (
    typeof value === "string" &&
    Object.values(OFFERING_CAPABILITY_IDS).includes(
      value as OfferingCapabilityId
    )
  );
}

/**
 * Removes invalid/duplicate capability IDs.
 *
 * Useful for:
 * - Firestore
 * - Imported configuration
 * - Admin forms
 */
export function sanitizeOfferingCapabilities(
  values: unknown
): OfferingCapabilityId[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.filter(isOfferingCapabilityId))];
}

/**
 * Returns true when an offering has a particular capability enabled.
 */
export function offeringHasCapability(
  offering: Offering,
  capability: OfferingCapabilityId
): boolean {
  return offering.capabilities.includes(capability);
}

/**
 * Returns all universal offering types in a category.
 */
export function getOfferingTypesByCategory(
  category: OfferingCategoryId
): OfferingTypeDefinition[] {
  return OFFERING_TYPE_LIST.filter(
    (offeringType) => offeringType.category === category
  );
}