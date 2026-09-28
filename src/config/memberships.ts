// src/config/memberships.ts

import {
  ORGANIZATION_IDS,
  isOrganizationId,
  type OrganizationId,
} from "./organizations";

import {
  ROLE_IDS,
  isRoleId,
  sanitizeRoleIds,
  type RoleId,
} from "./roles";

/**
 * Membership status inside a specific organization.
 */
export const MEMBERSHIP_STATUS_IDS = {
  ACTIVE: "active",
  INVITED: "invited",
  PENDING: "pending",
  SUSPENDED: "suspended",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

export type MembershipStatusId =
  (typeof MEMBERSHIP_STATUS_IDS)[keyof typeof MEMBERSHIP_STATUS_IDS];

/**
 * Identifies why or how the membership was created.
 */
export const MEMBERSHIP_SOURCE_IDS = {
  ADMIN: "admin",
  INVITATION: "invitation",
  REGISTRATION: "registration",
  IMPORT: "import",
  SYSTEM: "system",
} as const;

export type MembershipSourceId =
  (typeof MEMBERSHIP_SOURCE_IDS)[keyof typeof MEMBERSHIP_SOURCE_IDS];

/**
 * A user's membership inside one organization.
 *
 * Roles belong to the membership—not directly to the global user.
 *
 * This allows the same user to have completely different roles
 * in different organizations.
 */
export type OrganizationMembership = {
  id: string;
  userId: string;
  organizationId: OrganizationId;

  /**
   * A user may hold multiple roles inside the same organization.
   *
   * Example:
   * ["player", "captain"]
   */
  roles: readonly RoleId[];

  status: MembershipStatusId;
  source: MembershipSourceId;

  /**
   * Optional organization-specific relationships.
   *
   * These IDs connect the membership to filtered data without
   * putting private personal information in the public profile.
   */
  teamIds?: readonly string[];
  leagueIds?: readonly string[];
  programIds?: readonly string[];

  /**
   * Optional assignment references for operational roles.
   *
   * Examples:
   * referee assignments
   * scorekeeper assignments
   * coach groups
   * facility locations
   */
  assignmentIds?: readonly string[];

  /**
   * Whether this is the user's preferred organization.
   */
  isPrimary?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

/**
 * Minimal global user record.
 *
 * Organization roles are intentionally not stored here.
 */
export type AppUser = {
  id: string;
  displayName: string;
  membershipIds: readonly string[];

  /**
   * The organization most recently selected by the user.
   */
  activeOrganizationId?: OrganizationId;

  createdAt?: string;
  updatedAt?: string;
};

/**
 * Temporary development memberships.
 *
 * These will eventually come from Firestore.
 */
export const DEMO_MEMBERSHIPS: readonly OrganizationMembership[] = [
  {
    id: "membership_will_tme",
    userId: "user_will",
    organizationId: ORGANIZATION_IDS.TME,
    roles: [
      ROLE_IDS.PLAYER,
      ROLE_IDS.CAPTAIN,
    ],
    status: MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.ADMIN,
    teamIds: ["sun_tF"],
    leagueIds: ["sunday"],
    isPrimary: true,
  },

  {
    id: "membership_will_pickup",
    userId: "user_will",
    organizationId: ORGANIZATION_IDS.PICKUP,
    roles: [
      ROLE_IDS.REFEREE,
      ROLE_IDS.SCOREKEEPER,
    ],
    status: MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.INVITATION,
    assignmentIds: [
      "pickup_ref_assignment_01",
      "pickup_scorekeeper_assignment_01",
    ],
  },

  {
    id: "membership_will_taj",
    userId: "user_will",
    organizationId: ORGANIZATION_IDS.TAJ,
    roles: [ROLE_IDS.COACH],
    status: MEMBERSHIP_STATUS_IDS.PENDING,
    source: MEMBERSHIP_SOURCE_IDS.INVITATION,
  },
];

/**
 * Temporary development user.
 */
export const DEMO_USER: AppUser = {
  id: "user_will",
  displayName: "Will",
  membershipIds: DEMO_MEMBERSHIPS
    .filter((membership) => membership.userId === "user_will")
    .map((membership) => membership.id),
  activeOrganizationId: ORGANIZATION_IDS.TME,
};

/**
 * Checks whether an unknown value is a valid membership status.
 */
export function isMembershipStatusId(
  value: unknown
): value is MembershipStatusId {
  return (
    typeof value === "string" &&
    Object.values(MEMBERSHIP_STATUS_IDS).includes(
      value as MembershipStatusId
    )
  );
}

/**
 * Checks whether a membership is currently usable.
 */
export function isActiveMembership(
  membership: OrganizationMembership
): boolean {
  return membership.status === MEMBERSHIP_STATUS_IDS.ACTIVE;
}

/**
 * Returns all memberships belonging to one user.
 */
export function getUserMemberships(
  userId: string,
  memberships: readonly OrganizationMembership[]
): OrganizationMembership[] {
  return memberships.filter(
    (membership) => membership.userId === userId
  );
}

/**
 * Returns only active memberships belonging to one user.
 */
export function getActiveUserMemberships(
  userId: string,
  memberships: readonly OrganizationMembership[]
): OrganizationMembership[] {
  return getUserMemberships(userId, memberships).filter(
    isActiveMembership
  );
}

/**
 * Finds a user's membership for one organization.
 */
export function getUserOrganizationMembership(
  userId: string,
  organizationId: OrganizationId,
  memberships: readonly OrganizationMembership[]
): OrganizationMembership | undefined {
  return memberships.find(
    (membership) =>
      membership.userId === userId &&
      membership.organizationId === organizationId
  );
}

/**
 * Returns the active organization membership.
 *
 * If the preferred organization is unavailable, the first active
 * membership becomes the fallback.
 */
export function getActiveOrganizationMembership(
  user: AppUser,
  memberships: readonly OrganizationMembership[]
): OrganizationMembership | undefined {
  const activeMemberships = getActiveUserMemberships(
    user.id,
    memberships
  );

  if (user.activeOrganizationId) {
    const preferredMembership = activeMemberships.find(
      (membership) =>
        membership.organizationId ===
        user.activeOrganizationId
    );

    if (preferredMembership) {
      return preferredMembership;
    }
  }

  return (
    activeMemberships.find(
      (membership) => membership.isPrimary
    ) ?? activeMemberships[0]
  );
}

/**
 * Returns a user's roles inside one organization.
 */
export function getUserRolesForOrganization(
  userId: string,
  organizationId: OrganizationId,
  memberships: readonly OrganizationMembership[]
): RoleId[] {
  const membership = getUserOrganizationMembership(
    userId,
    organizationId,
    memberships
  );

  if (!membership || !isActiveMembership(membership)) {
    return [];
  }

  return sanitizeRoleIds(membership.roles);
}

/**
 * Checks whether a user belongs to an organization.
 */
export function isUserMemberOfOrganization(
  userId: string,
  organizationId: OrganizationId,
  memberships: readonly OrganizationMembership[]
): boolean {
  const membership = getUserOrganizationMembership(
    userId,
    organizationId,
    memberships
  );

  return Boolean(
    membership && isActiveMembership(membership)
  );
}

/**
 * Checks whether a user has a role inside one organization.
 */
export function userHasOrganizationRole(
  userId: string,
  organizationId: OrganizationId,
  requiredRole: RoleId,
  memberships: readonly OrganizationMembership[]
): boolean {
  return getUserRolesForOrganization(
    userId,
    organizationId,
    memberships
  ).includes(requiredRole);
}

/**
 * Checks whether a user has at least one requested role
 * inside one organization.
 */
export function userHasAnyOrganizationRole(
  userId: string,
  organizationId: OrganizationId,
  requiredRoles: readonly RoleId[],
  memberships: readonly OrganizationMembership[]
): boolean {
  const userRoles = getUserRolesForOrganization(
    userId,
    organizationId,
    memberships
  );

  return requiredRoles.some((roleId) =>
    userRoles.includes(roleId)
  );
}

/**
 * Sanitizes unknown membership data coming from Firestore,
 * imports, local storage, or route state.
 */
export function sanitizeMembership(
  value: unknown
): OrganizationMembership | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<OrganizationMembership>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.userId !== "string" ||
    !isOrganizationId(candidate.organizationId) ||
    !isMembershipStatusId(candidate.status)
  ) {
    return null;
  }

  const sourceValues = Object.values(MEMBERSHIP_SOURCE_IDS);

  const source = sourceValues.includes(
    candidate.source as MembershipSourceId
  )
    ? (candidate.source as MembershipSourceId)
    : MEMBERSHIP_SOURCE_IDS.SYSTEM;

  return {
    id: candidate.id,
    userId: candidate.userId,
    organizationId: candidate.organizationId,
    roles: sanitizeRoleIds(candidate.roles),
    status: candidate.status,
    source,
    teamIds: sanitizeStringArray(candidate.teamIds),
    leagueIds: sanitizeStringArray(candidate.leagueIds),
    programIds: sanitizeStringArray(candidate.programIds),
    assignmentIds: sanitizeStringArray(
      candidate.assignmentIds
    ),
    isPrimary: candidate.isPrimary === true,
    createdAt:
      typeof candidate.createdAt === "string"
        ? candidate.createdAt
        : undefined,
    updatedAt:
      typeof candidate.updatedAt === "string"
        ? candidate.updatedAt
        : undefined,
  };
}

/**
 * Returns valid, unique string IDs from unknown data.
 */
function sanitizeStringArray(
  value: unknown
): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const values = [
    ...new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" &&
          item.trim().length > 0
      )
    ),
  ];

  return values.length > 0 ? values : undefined;
}