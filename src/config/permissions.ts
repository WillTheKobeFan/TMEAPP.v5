// src/config/permissions.ts

import {
  FEATURE_IDS,
  type FeatureId,
} from "./features";

import {
  getOrganizationFeatureConfig,
  isFeatureEnabledForOrganization,
  isRoleEnabledForOrganization,
  type OrganizationId,
} from "./organizations";

import {
  MEMBERSHIP_STATUS_IDS,
  type OrganizationMembership,
} from "./memberships";

import {
  ROLE_IDS,
  type RoleId,
} from "./roles";

/**
 * Individual actions supported by the permission system.
 *
 * Feature access answers:
 * "Can this user open Schedule?"
 *
 * Action permissions answer:
 * "Can this user edit the Schedule?"
 */
export const PERMISSION_IDS = {
  // General
  VIEW: "view",

  // Schedule
  SCHEDULE_VIEW: "schedule.view",
  SCHEDULE_EDIT: "schedule.edit",

  // Scores / results
  SCORE_VIEW: "score.view",
  SCORE_SUBMIT: "score.submit",
  SCORE_FINALIZE: "score.finalize",

  // Standings
  STANDINGS_VIEW: "standings.view",

  // Teams
  TEAM_VIEW: "team.view",
  TEAM_VIEW_ROSTER: "team.viewRoster",
  TEAM_RESPOND_AVAILABILITY: "team.respondAvailability",
  TEAM_REPORT_ISSUE: "team.reportIssue",

  // Members
  MEMBERS_VIEW: "members.view",
  MEMBERS_ASSIGN: "members.assign",

  // Messaging
  MESSAGE_VIEW: "messages.view",
  MESSAGE_SEND_TEAM: "messages.sendTeam",
  MESSAGE_SEND_GROUP: "messages.sendGroup",
  MESSAGE_SEND_ORGANIZATION: "messages.sendOrganization",

  // Organization
  ORGANIZATION_CONFIGURE: "organization.configure",

  // Admin
  ADMIN_PANEL_ACCESS: "admin.access",
} as const;

export type PermissionId =
  (typeof PERMISSION_IDS)[keyof typeof PERMISSION_IDS];

/**
 * Optional resource information.
 *
 * This allows us to ask:
 *
 * "Can this scorekeeper submit THIS game's score?"
 *
 * instead of:
 *
 * "Can scorekeepers submit every game's score?"
 */
export type PermissionResource = {
  leagueId?: string;
  teamId?: string;
  programId?: string;
  assignmentId?: string;
  gameId?: string;
  locationId?: string;
};

/**
 * Context used for permission checks.
 */
export type PermissionContext = {
  membership: OrganizationMembership;
  permissionId: PermissionId;
  resource?: PermissionResource;
};

/**
 * Default action permissions for each foundation role.
 *
 * These are safe application defaults.
 *
 * Organization-specific overrides can be added later through
 * the Admin Panel / Firestore configuration.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<
  RoleId,
  readonly PermissionId[]
> = {
  [ROLE_IDS.ADMIN]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCHEDULE_EDIT,

    PERMISSION_IDS.SCORE_VIEW,
    PERMISSION_IDS.SCORE_SUBMIT,
    PERMISSION_IDS.SCORE_FINALIZE,

    PERMISSION_IDS.STANDINGS_VIEW,

    PERMISSION_IDS.TEAM_VIEW,
    PERMISSION_IDS.TEAM_VIEW_ROSTER,
    PERMISSION_IDS.TEAM_RESPOND_AVAILABILITY,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,

    PERMISSION_IDS.MEMBERS_VIEW,
    PERMISSION_IDS.MEMBERS_ASSIGN,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.MESSAGE_SEND_TEAM,
    PERMISSION_IDS.MESSAGE_SEND_GROUP,
    PERMISSION_IDS.MESSAGE_SEND_ORGANIZATION,

    PERMISSION_IDS.ORGANIZATION_CONFIGURE,
    PERMISSION_IDS.ADMIN_PANEL_ACCESS,
  ],

  [ROLE_IDS.CAPTAIN]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCORE_VIEW,
    PERMISSION_IDS.STANDINGS_VIEW,

    PERMISSION_IDS.TEAM_VIEW,
    PERMISSION_IDS.TEAM_VIEW_ROSTER,
    PERMISSION_IDS.TEAM_RESPOND_AVAILABILITY,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.MESSAGE_SEND_TEAM,
  ],

  [ROLE_IDS.PLAYER]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCORE_VIEW,
    PERMISSION_IDS.STANDINGS_VIEW,

    PERMISSION_IDS.TEAM_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
  ],

  [ROLE_IDS.REFEREE]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCORE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,
  ],

  [ROLE_IDS.SCOREKEEPER]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCORE_VIEW,
    PERMISSION_IDS.SCORE_SUBMIT,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,
  ],

  [ROLE_IDS.COACH]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,
    PERMISSION_IDS.SCORE_VIEW,

    PERMISSION_IDS.TEAM_VIEW,
    PERMISSION_IDS.TEAM_VIEW_ROSTER,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.MESSAGE_SEND_GROUP,
  ],

  [ROLE_IDS.FACILITY]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,
  ],

    [ROLE_IDS.TRAINER]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.TEAM_VIEW,
    PERMISSION_IDS.TEAM_VIEW_ROSTER,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.MESSAGE_SEND_GROUP,
  ],

  [ROLE_IDS.TRAINEE]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
  ],

  [ROLE_IDS.CAMP_DIRECTOR]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.TEAM_VIEW,
    PERMISSION_IDS.TEAM_VIEW_ROSTER,

    PERMISSION_IDS.MEMBERS_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.MESSAGE_SEND_GROUP,
  ],

  [ROLE_IDS.EVENT_STAFF]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
    PERMISSION_IDS.TEAM_REPORT_ISSUE,
  ],

  [ROLE_IDS.PHOTOGRAPHER]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
  ],

  [ROLE_IDS.VIDEOGRAPHER]: [
    PERMISSION_IDS.VIEW,

    PERMISSION_IDS.SCHEDULE_VIEW,

    PERMISSION_IDS.MESSAGE_VIEW,
  ],

  [ROLE_IDS.CUSTOM]: [
    PERMISSION_IDS.VIEW,
  ],

};

/**
 * Checks whether the membership is active.
 */
export function canUseMembership(
  membership: OrganizationMembership
): boolean {
  return (
    membership.status ===
    MEMBERSHIP_STATUS_IDS.ACTIVE
  );
}

/**
 * Returns only roles that are currently enabled by the
 * organization.
 */
export function getUsableMembershipRoles(
  membership: OrganizationMembership
): RoleId[] {
  if (!canUseMembership(membership)) {
    return [];
  }

  return membership.roles.filter((roleId) =>
    isRoleEnabledForOrganization(
      membership.organizationId,
      roleId
    )
  );
}

/**
 * Checks whether a membership has a usable role.
 */
export function membershipHasRole(
  membership: OrganizationMembership,
  roleId: RoleId
): boolean {
  return getUsableMembershipRoles(membership).includes(
    roleId
  );
}

/**
 * Checks whether a membership can access an enabled feature.
 *
 * This is the helper CustomNavBar2 will eventually use.
 */
export function canAccessFeature(
  membership: OrganizationMembership,
  featureId: FeatureId
): boolean {
  if (!canUseMembership(membership)) {
    return false;
  }

  const organizationId =
    membership.organizationId;

  if (
    !isFeatureEnabledForOrganization(
      organizationId,
      featureId
    )
  ) {
    return false;
  }

  const featureConfig =
    getOrganizationFeatureConfig(
      organizationId,
      featureId
    );

  if (!featureConfig) {
    return false;
  }

  const roles = getUsableMembershipRoles(membership);

  /**
   * Organization admins receive access to enabled features.
   */
  if (roles.includes(ROLE_IDS.ADMIN)) {
    return true;
  }

  return roles.some((roleId) =>
    featureConfig.allowedRoles.includes(roleId)
  );
}

/**
 * Returns every feature the membership may currently access.
 */
export function getAccessibleFeatureIds(
  membership: OrganizationMembership
): FeatureId[] {
  return Object.values(FEATURE_IDS).filter(
    (featureId) =>
      canAccessFeature(membership, featureId)
  );
}

/**
 * Checks whether a user's roles grant a particular action.
 */
export function hasBasePermission(
  membership: OrganizationMembership,
  permissionId: PermissionId
): boolean {
  const roles = getUsableMembershipRoles(membership);

  return roles.some((roleId) =>
    DEFAULT_ROLE_PERMISSIONS[roleId].includes(
      permissionId
    )
  );
}

export function isResourceWithinMembershipScope(
  membership: OrganizationMembership,
  resource?: PermissionResource
): boolean {
  if (!resource) {
    return true;
  }

  const usableRoles = getUsableMembershipRoles(membership);

  /**
   * Organization admins currently receive organization-wide scope.
   *
   * Later, league/program admins will need explicit scoped
   * administrative assignments.
   */
  if (usableRoles.includes(ROLE_IDS.ADMIN)) {
    return true;
  }

  if (resource.leagueId) {
    if (
      !membership.leagueIds?.includes(resource.leagueId)
    ) {
      return false;
    }
  }

  if (resource.teamId) {
    if (!membership.teamIds?.includes(resource.teamId)) {
      return false;
    }
  }

  if (resource.programId) {
    if (
      !membership.programIds?.includes(resource.programId)
    ) {
      return false;
    }
  }

  if (resource.assignmentId) {
    if (
      !membership.assignmentIds?.includes(
        resource.assignmentId
      )
    ) {
      return false;
    }
  }

  return true;
}
/**
 * Main action-level permission helper.
 */
export function canPerformAction({
  membership,
  permissionId,
  resource,
}: PermissionContext): boolean {
  if (!canUseMembership(membership)) {
    return false;
  }

  if (
    !hasBasePermission(
      membership,
      permissionId
    )
  ) {
    return false;
  }

  if (
    !isResourceWithinMembershipScope(
      membership,
      resource
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Convenience helper for Admin Panel access.
 */
export function canAccessAdminPanel(
  membership: OrganizationMembership
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.ADMIN_PANEL_ACCESS,
  });
}

/**
 * Convenience helper for organization configuration.
 */
export function canConfigureOrganization(
  membership: OrganizationMembership
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.ORGANIZATION_CONFIGURE,
  });
}

/**
 * Convenience helper for score submission.
 */
export function canSubmitScore(
  membership: OrganizationMembership,
  resource?: PermissionResource
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.SCORE_SUBMIT,
    resource,
  });
}

/**
 * Convenience helper for score finalization.
 */
export function canFinalizeScore(
  membership: OrganizationMembership,
  resource?: PermissionResource
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.SCORE_FINALIZE,
    resource,
  });
}

/**
 * Convenience helper for schedule editing.
 */
export function canEditSchedule(
  membership: OrganizationMembership,
  resource?: PermissionResource
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.SCHEDULE_EDIT,
    resource,
  });
}

/**
 * Convenience helper for organization-wide messaging.
 */
export function canSendOrganizationMessage(
  membership: OrganizationMembership
): boolean {
  return canPerformAction({
    membership,
    permissionId:
      PERMISSION_IDS.MESSAGE_SEND_ORGANIZATION,
  });
}