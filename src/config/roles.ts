// src/config/roles.ts

/**
 * Every universal role supported across organizations.
 *
 * IMPORTANT:
 * Keep these IDs stable.
 *
 * These values may eventually be stored in:
 * - Firestore membership documents
 * - Organization configurations
 * - User filters
 * - MyHub configurations
 * - Assignment documents
 * - Permission rules
 *
 * Organizations decide which roles they enable.
 * They do NOT create organization-specific versions of these IDs.
 *
 * Truly organization-specific responsibilities can use CUSTOM
 * until/unless they become a universal platform role.
 */
export const ROLE_IDS = {
  ADMIN: "admin",

  CAPTAIN: "captain",
  PLAYER: "player",

  COACH: "coach",
  TRAINER: "trainer",
  TRAINEE: "trainee",

  REFEREE: "referee",
  SCOREKEEPER: "scorekeeper",

  FACILITY: "facility",

  CAMP_DIRECTOR: "camp-director",
  EVENT_STAFF: "event-staff",

  PHOTOGRAPHER: "photographer",
  VIDEOGRAPHER: "videographer",

  CUSTOM: "custom",
} as const;

/**
 * Creates a union type from ROLE_IDS.
 */
export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];

/**
 * Broad role categories.
 *
 * Categories are organizational helpers only.
 * They do NOT grant permissions by themselves.
 *
 * Used for:
 * - Filtering
 * - Organization setup
 * - Grouped permission management
 * - Admin-panel display
 * - Role selectors
 */
export const ROLE_CATEGORY_IDS = {
  MANAGEMENT: "management",
  PARTICIPANT: "participant",
  OFFICIAL: "official",
  DEVELOPMENT: "development",
  OPERATIONS: "operations",
  EVENT: "event",
  MEDIA: "media",
  CUSTOM: "custom",
} as const;

export type RoleCategoryId =
  (typeof ROLE_CATEGORY_IDS)[keyof typeof ROLE_CATEGORY_IDS];

/**
 * Shape of a universal role definition.
 *
 * A role describes WHO someone is within an organization.
 * Permissions determine WHAT that person can actually access or do.
 */
export type RoleDefinition = {
  id: RoleId;
  label: string;
  shortLabel: string;
  description: string;
  category: RoleCategoryId;

  /**
   * Whether an organization may assign this role to users.
   *
   * Keeping this field allows us to introduce internal/system roles
   * later without exposing them during organization setup.
   */
  organizationAssignable: boolean;
};

/**
 * Universal role definitions.
 *
 * Organizations can:
 * - Enable or disable roles
 * - Assign multiple roles to one user
 * - Configure permissions for roles
 * - Limit roles to particular offerings/assignments
 *
 * The universal role IDs remain consistent throughout the app.
 */
export const ROLES: Record<RoleId, RoleDefinition> = {
  // ---------------------------------------------------------------------------
  // MANAGEMENT
  // ---------------------------------------------------------------------------

  [ROLE_IDS.ADMIN]: {
    id: ROLE_IDS.ADMIN,
    label: "Admin / Director",
    shortLabel: "Admin",
    description:
      "Manages the organization, offerings, users, schedules, communication, access, and settings.",
    category: ROLE_CATEGORY_IDS.MANAGEMENT,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // PARTICIPANTS
  // ---------------------------------------------------------------------------

  [ROLE_IDS.CAPTAIN]: {
    id: ROLE_IDS.CAPTAIN,
    label: "Captain",
    shortLabel: "Captain",
    description:
      "Represents a team and may receive team-specific updates, responsibilities, confirmations, and tools.",
    category: ROLE_CATEGORY_IDS.PARTICIPANT,
    organizationAssignable: true,
  },

  [ROLE_IDS.PLAYER]: {
    id: ROLE_IDS.PLAYER,
    label: "Player / Participant",
    shortLabel: "Player",
    description:
      "Participates in leagues, games, camps, clinics, training, classes, events, or other organization offerings.",
    category: ROLE_CATEGORY_IDS.PARTICIPANT,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // DEVELOPMENT / INSTRUCTION
  // ---------------------------------------------------------------------------

  [ROLE_IDS.COACH]: {
    id: ROLE_IDS.COACH,
    label: "Coach",
    shortLabel: "Coach",
    description:
      "Supports a team, group, or participants through coaching, practices, instruction, and competition.",
    category: ROLE_CATEGORY_IDS.DEVELOPMENT,
    organizationAssignable: true,
  },

  [ROLE_IDS.TRAINER]: {
    id: ROLE_IDS.TRAINER,
    label: "Trainer",
    shortLabel: "Trainer",
    description:
      "Provides individual or group instruction through training sessions, clinics, camps, lessons, or development programs.",
    category: ROLE_CATEGORY_IDS.DEVELOPMENT,
    organizationAssignable: true,
  },

  [ROLE_IDS.TRAINEE]: {
    id: ROLE_IDS.TRAINEE,
    label: "Trainee",
    shortLabel: "Trainee",
    description:
      "Participates in a training or development program with access limited to relevant sessions, schedules, resources, and progress information.",
    category: ROLE_CATEGORY_IDS.DEVELOPMENT,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // OFFICIALS
  // ---------------------------------------------------------------------------

  [ROLE_IDS.REFEREE]: {
    id: ROLE_IDS.REFEREE,
    label: "Referee / Official",
    shortLabel: "Referee",
    description:
      "Views assigned games or competitions, officiating schedules, check-in tools, organization updates, and relevant resources.",
    category: ROLE_CATEGORY_IDS.OFFICIAL,
    organizationAssignable: true,
  },

  [ROLE_IDS.SCOREKEEPER]: {
    id: ROLE_IDS.SCOREKEEPER,
    label: "Scorekeeper",
    shortLabel: "Scorekeeper",
    description:
      "Views assigned games or competitions and may record scores, results, attendance, and other authorized game information.",
    category: ROLE_CATEGORY_IDS.OFFICIAL,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // OPERATIONS
  // ---------------------------------------------------------------------------

  [ROLE_IDS.FACILITY]: {
    id: ROLE_IDS.FACILITY,
    label: "Facility Staff / Operations",
    shortLabel: "Facility",
    description:
      "Supports locations, courts, fields, rooms, equipment, facility schedules, access, confirmations, and operational responsibilities.",
    category: ROLE_CATEGORY_IDS.OPERATIONS,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // PROGRAM / EVENT STAFF
  // ---------------------------------------------------------------------------

  [ROLE_IDS.CAMP_DIRECTOR]: {
    id: ROLE_IDS.CAMP_DIRECTOR,
    label: "Camp Director",
    shortLabel: "Camp Director",
    description:
      "Oversees camp operations, schedules, participants, staff assignments, attendance, communication, and authorized camp activities.",
    category: ROLE_CATEGORY_IDS.EVENT,
    organizationAssignable: true,
  },

  [ROLE_IDS.EVENT_STAFF]: {
    id: ROLE_IDS.EVENT_STAFF,
    label: "Event Staff",
    shortLabel: "Event Staff",
    description:
      "Supports tournaments, camps, clinics, special events, competitions, and other assigned organization activities.",
    category: ROLE_CATEGORY_IDS.EVENT,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // MEDIA
  // ---------------------------------------------------------------------------

  [ROLE_IDS.PHOTOGRAPHER]: {
    id: ROLE_IDS.PHOTOGRAPHER,
    label: "Photographer",
    shortLabel: "Photographer",
    description:
      "Views relevant assignments and event information and may capture, organize, or upload authorized photography.",
    category: ROLE_CATEGORY_IDS.MEDIA,
    organizationAssignable: true,
  },

  [ROLE_IDS.VIDEOGRAPHER]: {
    id: ROLE_IDS.VIDEOGRAPHER,
    label: "Videographer",
    shortLabel: "Videographer",
    description:
      "Views relevant assignments and event information and may capture, organize, or upload authorized video content.",
    category: ROLE_CATEGORY_IDS.MEDIA,
    organizationAssignable: true,
  },

  // ---------------------------------------------------------------------------
  // CUSTOM
  // ---------------------------------------------------------------------------

  [ROLE_IDS.CUSTOM]: {
    id: ROLE_IDS.CUSTOM,
    label: "Custom Role",
    shortLabel: "Custom",
    description:
      "Represents an organization-specific responsibility that does not yet match a universal platform role.",
    category: ROLE_CATEGORY_IDS.CUSTOM,
    organizationAssignable: true,
  },
};

/**
 * Array version for:
 * - FlatList
 * - Dropdowns
 * - Setup wizard options
 * - Admin-panel role selectors
 */
export const ROLE_LIST: RoleDefinition[] = Object.values(ROLES);

/**
 * Returns a complete role definition.
 */
export function getRoleById(roleId: RoleId): RoleDefinition {
  return ROLES[roleId];
}

/**
 * Checks whether an unknown value is a valid RoleId.
 *
 * Useful when reading role data from:
 * - Firestore
 * - Route parameters
 * - Forms
 * - Imported organization data
 * - Persisted filters
 */
export function isRoleId(value: unknown): value is RoleId {
  return (
    typeof value === "string" &&
    Object.values(ROLE_IDS).includes(value as RoleId)
  );
}

/**
 * Returns only valid roles from an unknown array.
 *
 * This prevents invalid or outdated stored values from reaching
 * the rest of the application.
 */
export function sanitizeRoleIds(values: unknown): RoleId[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.filter(isRoleId))];
}

/**
 * Checks whether a user has a particular role.
 */
export function hasRole(
  userRoles: readonly RoleId[],
  requiredRole: RoleId
): boolean {
  return userRoles.includes(requiredRole);
}

/**
 * Checks whether a user has at least one role from a supplied list.
 */
export function hasAnyRole(
  userRoles: readonly RoleId[],
  requiredRoles: readonly RoleId[]
): boolean {
  return requiredRoles.some((roleId) => userRoles.includes(roleId));
}

/**
 * Checks whether a user has every role from a supplied list.
 */
export function hasAllRoles(
  userRoles: readonly RoleId[],
  requiredRoles: readonly RoleId[]
): boolean {
  return requiredRoles.every((roleId) => userRoles.includes(roleId));
}

/**
 * Convenience helper for administrative access.
 */
export function isAdmin(userRoles: readonly RoleId[]): boolean {
  return hasRole(userRoles, ROLE_IDS.ADMIN);
}

/**
 * Groups roles by category for setup and admin screens.
 */
export function getRolesByCategory(
  category: RoleCategoryId
): RoleDefinition[] {
  return ROLE_LIST.filter((role) => role.category === category);
}

/**
 * Returns all roles an organization may assign.
 *
 * This gives us a single helper for organization setup/admin screens
 * if internal or system-only roles are introduced later.
 */
export function getOrganizationAssignableRoles(): RoleDefinition[] {
  return ROLE_LIST.filter((role) => role.organizationAssignable);
}