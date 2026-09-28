// src/config/organizations.ts

import {
  FEATURE_IDS,
  FEATURE_PLACEMENTS,
  FEATURES,
  type FeatureId,
  type FeaturePlacement,
} from "./features";

import {
  ROLE_IDS,
  type RoleId,
} from "./roles";

/**
 * Every organization currently supported by the app.
 *
 * Keep these IDs stable because they may eventually appear in:
 * - Firestore document paths
 * - Membership records
 * - Saved user filters
 * - Organization invitations
 * - Navigation state
 */
export const ORGANIZATION_IDS = {
  TME: "tme",
  PICKUP: "pickup",
  TAJ: "taj",
} as const;

export type OrganizationId =
  (typeof ORGANIZATION_IDS)[keyof typeof ORGANIZATION_IDS];

/**
 * Current organization status.
 */
export const ORGANIZATION_STATUS_IDS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SETUP: "setup",
  ARCHIVED: "archived",
} as const;

export type OrganizationStatusId =
  (typeof ORGANIZATION_STATUS_IDS)[keyof typeof ORGANIZATION_STATUS_IDS];

/**
 * Configuration for one feature inside one organization.
 *
 * This is separate from features.ts.
 *
 * features.ts:
 * Defines what the feature is.
 *
 * organizations.ts:
 * Defines how a particular organization uses it.
 */
export type OrganizationFeatureConfig = {
  featureId: FeatureId;

  /**
   * Whether the organization currently uses this feature.
   */
  enabled: boolean;

  /**
   * Where the feature appears in navigation.
   */
  placement: FeaturePlacement;

  /**
   * Navigation order inside its placement.
   */
  order: number;

  /**
   * Optional organization-specific display name.
   *
   * Example:
   * "Progress" could display as "Training".
   */
  customLabel?: string;

  /**
   * Roles allowed to access this feature.
   *
   * Admin access will later be protected by the permission helper.
   */
  allowedRoles: readonly RoleId[];
};

/**
 * Configuration for one role inside one organization.
 */
export type OrganizationRoleConfig = {
  roleId: RoleId;

  /**
   * Whether the role is currently available for assignment.
   */
  enabled: boolean;

  /**
   * Optional organization-specific role name.
   *
   * Example:
   * facility → "Building Operator"
   */
  customLabel?: string;
};

/**
 * Organization branding.
 */
export type OrganizationBranding = {
  shortName: string;
  accentColor: string;
  logoKey?: string;
  fallbackEmoji?: string;
};

/**
 * Full organization configuration.
 */
export type OrganizationDefinition = {
  id: OrganizationId;
  name: string;
  description: string;
  status: OrganizationStatusId;
  branding: OrganizationBranding;

  /**
   * IDs of the offerings currently owned/configured
   * by this organization.
   *
   * The full Offering objects will live in the universal
   * offering registry rather than being duplicated here.
   */
  offeringIds: readonly string[];

  roles: readonly OrganizationRoleConfig[];
  features: readonly OrganizationFeatureConfig[];
};

/**
 * Common role groups used to keep configuration readable.
 */
const ALL_FOUNDATION_ROLES: readonly RoleId[] = [
  ROLE_IDS.ADMIN,
  ROLE_IDS.CAPTAIN,
  ROLE_IDS.PLAYER,
  ROLE_IDS.REFEREE,
  ROLE_IDS.SCOREKEEPER,
  ROLE_IDS.COACH,
  ROLE_IDS.FACILITY,
];

const STANDARD_MEMBER_ROLES: readonly RoleId[] = [
  ROLE_IDS.ADMIN,
  ROLE_IDS.CAPTAIN,
  ROLE_IDS.PLAYER,
  ROLE_IDS.REFEREE,
  ROLE_IDS.SCOREKEEPER,
  ROLE_IDS.COACH,
];

/**
 * Universal organization configurations.
 *
 * These are initial local defaults.
 *
 * Later, Firestore organization settings can override the enabled
 * roles, enabled features, labels, placements, and ordering.
 */
export const ORGANIZATIONS: Record<
  OrganizationId,
  OrganizationDefinition
> = {
  [ORGANIZATION_IDS.TME]: {
    id: ORGANIZATION_IDS.TME,
    name: "TME Social Sports",
    description:
      "Community basketball leagues, schedules, standings, updates, and championship history.",
    status: ORGANIZATION_STATUS_IDS.ACTIVE,

    branding: {
      shortName: "TME",
      accentColor: "#250F74",
      logoKey: "tme",
      fallbackEmoji: "🏀",
    },

        offeringIds: [
      "tme-sunday-mens-basketball",
      "tme-monday-mens-basketball",
      "tme-wednesday-mens-basketball",
    ],

    roles: [
      {
        roleId: ROLE_IDS.ADMIN,
        enabled: true,
        customLabel: "Admin / League Director",
      },
      {
        roleId: ROLE_IDS.CAPTAIN,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.PLAYER,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.REFEREE,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.SCOREKEEPER,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.COACH,
        enabled: false,
      },
      {
        roleId: ROLE_IDS.FACILITY,
        enabled: true,
        customLabel: "Building Operator",
      },
    ],

    features: [
      {
        featureId: FEATURE_IDS.HOME,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 1,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
      {
        featureId: FEATURE_IDS.SCHEDULE,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 2,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
      {
        featureId: FEATURE_IDS.STANDINGS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 3,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.CAPTAIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.REFEREE,
          ROLE_IDS.SCOREKEEPER,
        ],
      },
      {
        featureId: FEATURE_IDS.INBOX,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 4,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
      {
        featureId: FEATURE_IDS.CHAMPS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 5,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
      {
        featureId: FEATURE_IDS.PROGRESS,
        enabled: false,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 6,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.COACH,
          ROLE_IDS.CAPTAIN,
          ROLE_IDS.PLAYER,
        ],
      },
      {
        featureId: FEATURE_IDS.SEARCH,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 7,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
      {
        featureId: FEATURE_IDS.SETTINGS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 8,
        allowedRoles: ALL_FOUNDATION_ROLES,
      },
    ],
  },

  [ORGANIZATION_IDS.PICKUP]: {
    id: ORGANIZATION_IDS.PICKUP,
    name: "Pickup Basketball USA",
    description:
      "Pickup basketball programs, league scheduling, player communication, and event coordination.",
    status: ORGANIZATION_STATUS_IDS.ACTIVE,

    branding: {
      shortName: "Pickup",
      accentColor: "#250F74",
      logoKey: "pickup",
      fallbackEmoji: "🏀",
    },

        offeringIds: [
      "pickup-adult-league",
      "pickup-youth-development-league",
      "pickup-open-play",
      "pickup-summer-camp",
      "pickup-group-training",
      "pickup-private-training",
      "pickup-membership",
      "pickup-court-rental",
      "pickup-equipment-rental",
      "pickup-parties",
    ],

    roles: [
      {
        roleId: ROLE_IDS.ADMIN,
        enabled: true,
        customLabel: "Owner / Admin",
      },
      {
        roleId: ROLE_IDS.CAPTAIN,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.PLAYER,
        enabled: true,
        customLabel: "Player / Participant",
      },
      {
        roleId: ROLE_IDS.REFEREE,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.SCOREKEEPER,
        enabled: true,
      },
      {
        roleId: ROLE_IDS.COACH,
        enabled: true,
        customLabel: "Coach / Trainer",
      },
      {
        roleId: ROLE_IDS.FACILITY,
        enabled: false,
      },
    ],

    features: [
      {
        featureId: FEATURE_IDS.HOME,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 1,
        allowedRoles: STANDARD_MEMBER_ROLES,
      },
      {
        featureId: FEATURE_IDS.SCHEDULE,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 2,
        allowedRoles: STANDARD_MEMBER_ROLES,
      },
      {
        featureId: FEATURE_IDS.STANDINGS,
        enabled: false,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 3,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.CAPTAIN,
          ROLE_IDS.PLAYER,
        ],
      },
      {
        featureId: FEATURE_IDS.INBOX,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 3,
        allowedRoles: STANDARD_MEMBER_ROLES,
      },
      {
        featureId: FEATURE_IDS.CHAMPS,
        enabled: false,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 4,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.CAPTAIN,
          ROLE_IDS.PLAYER,
        ],
      },
      {
        featureId: FEATURE_IDS.PROGRESS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 4,
        customLabel: "Training",
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.COACH,
          ROLE_IDS.CAPTAIN,
          ROLE_IDS.PLAYER,
        ],
      },
      {
        featureId: FEATURE_IDS.SEARCH,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 5,
        allowedRoles: STANDARD_MEMBER_ROLES,
      },
      {
        featureId: FEATURE_IDS.SETTINGS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 6,
        allowedRoles: STANDARD_MEMBER_ROLES,
      },
    ],
  },

  [ORGANIZATION_IDS.TAJ]: {
    id: ORGANIZATION_IDS.TAJ,
    name: "Taj Hill Hoops",
    description:
      "Basketball instruction, player development, camps, clinics, and training programs.",
    status: ORGANIZATION_STATUS_IDS.SETUP,

    branding: {
      shortName: "THH",
      accentColor: "#250F74",
      logoKey: "taj",
      fallbackEmoji: "🏀",
    },

       offeringIds: [
      "taj-mens-league",
      "taj-training",
      "taj-clinics",
      "taj-camps",
    ],

    roles: [
      {
        roleId: ROLE_IDS.ADMIN,
        enabled: true,
        customLabel: "Director / Admin",
      },
      {
        roleId: ROLE_IDS.CAPTAIN,
        enabled: false,
      },
      {
        roleId: ROLE_IDS.PLAYER,
        enabled: true,
        customLabel: "Athlete / Participant",
      },
      {
        roleId: ROLE_IDS.REFEREE,
        enabled: false,
      },
      {
        roleId: ROLE_IDS.SCOREKEEPER,
        enabled: false,
      },
      {
        roleId: ROLE_IDS.COACH,
        enabled: true,
        customLabel: "Coach / Trainer",
      },
      {
        roleId: ROLE_IDS.FACILITY,
        enabled: true,
        customLabel: "Site Coordinator",
      },
    ],

    features: [
      {
        featureId: FEATURE_IDS.HOME,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 1,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
          ROLE_IDS.FACILITY,
        ],
      },
      {
        featureId: FEATURE_IDS.SCHEDULE,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 2,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
          ROLE_IDS.FACILITY,
        ],
      },
      {
        featureId: FEATURE_IDS.STANDINGS,
        enabled: false,
        placement: FEATURE_PLACEMENTS.HIDDEN,
        order: 3,
        allowedRoles: [ROLE_IDS.ADMIN],
      },
      {
        featureId: FEATURE_IDS.INBOX,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 3,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
          ROLE_IDS.FACILITY,
        ],
      },
      {
        featureId: FEATURE_IDS.CHAMPS,
        enabled: false,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 4,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
        ],
      },
      {
        featureId: FEATURE_IDS.PROGRESS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MAIN_NAV,
        order: 4,
        customLabel: "Development",
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
        ],
      },
      {
        featureId: FEATURE_IDS.SEARCH,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 5,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
          ROLE_IDS.FACILITY,
        ],
      },
      {
        featureId: FEATURE_IDS.SETTINGS,
        enabled: true,
        placement: FEATURE_PLACEMENTS.MORE,
        order: 6,
        allowedRoles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.PLAYER,
          ROLE_IDS.COACH,
          ROLE_IDS.FACILITY,
        ],
      },
    ],
  },
};

/**
 * Array version for organization selectors and lists.
 */
export const ORGANIZATION_LIST: OrganizationDefinition[] =
  Object.values(ORGANIZATIONS);

/**
 * Returns an organization definition.
 */
export function getOrganizationById(
  organizationId: OrganizationId
): OrganizationDefinition {
  return ORGANIZATIONS[organizationId];
}

/**
 * Returns all offering IDs configured for an organization.
 */
export function getOrganizationOfferingIds(
  organizationId: OrganizationId
): readonly string[] {
  return ORGANIZATIONS[organizationId].offeringIds;
}

/**
 * Checks whether an offering belongs to an organization.
 */
export function organizationHasOffering(
  organizationId: OrganizationId,
  offeringId: string
): boolean {
  return ORGANIZATIONS[organizationId].offeringIds.includes(offeringId);
}

/**
 * Checks whether an unknown value is a valid organization ID.
 */
export function isOrganizationId(
  value: unknown
): value is OrganizationId {
  return (
    typeof value === "string" &&
    Object.values(ORGANIZATION_IDS).includes(
      value as OrganizationId
    )
  );
}

/**
 * Returns the role configuration for an organization.
 */
export function getOrganizationRoleConfig(
  organizationId: OrganizationId,
  roleId: RoleId
): OrganizationRoleConfig | undefined {
  return ORGANIZATIONS[organizationId].roles.find(
    (role) => role.roleId === roleId
  );
}

/**
 * Returns the feature configuration for an organization.
 */
export function getOrganizationFeatureConfig(
  organizationId: OrganizationId,
  featureId: FeatureId
): OrganizationFeatureConfig | undefined {
  return ORGANIZATIONS[organizationId].features.find(
    (feature) => feature.featureId === featureId
  );
}

/**
 * Returns all currently enabled roles for an organization.
 */
export function getEnabledOrganizationRoles(
  organizationId: OrganizationId
): OrganizationRoleConfig[] {
  return ORGANIZATIONS[organizationId].roles.filter(
    (role) => role.enabled
  );
}

/**
 * Returns all currently enabled features for an organization.
 */
export function getEnabledOrganizationFeatures(
  organizationId: OrganizationId
): OrganizationFeatureConfig[] {
  return ORGANIZATIONS[organizationId].features
    .filter((feature) => {
      const masterFeature = FEATURES[feature.featureId];

      return feature.enabled || masterFeature.required;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns enabled features assigned to a navigation placement.
 */
export function getOrganizationFeaturesByPlacement(
  organizationId: OrganizationId,
  placement: FeaturePlacement
): OrganizationFeatureConfig[] {
  return getEnabledOrganizationFeatures(organizationId)
    .filter((feature) => feature.placement === placement)
    .sort((a, b) => a.order - b.order);
}

/**
 * Checks whether a role is enabled for an organization.
 */
export function isRoleEnabledForOrganization(
  organizationId: OrganizationId,
  roleId: RoleId
): boolean {
  return (
    getOrganizationRoleConfig(organizationId, roleId)
      ?.enabled ?? false
  );
}

/**
 * Checks whether a feature is enabled for an organization.
 */
export function isFeatureEnabledForOrganization(
  organizationId: OrganizationId,
  featureId: FeatureId
): boolean {
  const masterFeature = FEATURES[featureId];

  if (masterFeature.required) {
    return true;
  }

  return (
    getOrganizationFeatureConfig(
      organizationId,
      featureId
    )?.enabled ?? false
  );
}

/**
 * Returns the organization-specific feature label when one exists.
 */
export function getOrganizationFeatureLabel(
  organizationId: OrganizationId,
  featureId: FeatureId
): string {
  const config = getOrganizationFeatureConfig(
    organizationId,
    featureId
  );

  return config?.customLabel ?? FEATURES[featureId].shortLabel;
}

/**
 * Checks whether at least one of the user's roles may access
 * a feature within an organization.
 */
export function canRolesAccessOrganizationFeature(
  organizationId: OrganizationId,
  userRoles: readonly RoleId[],
  featureId: FeatureId
): boolean {
  if (!isFeatureEnabledForOrganization(
    organizationId,
    featureId
  )) {
    return false;
  }

  const featureConfig = getOrganizationFeatureConfig(
    organizationId,
    featureId
  );

  if (!featureConfig) {
    return false;
  }

  /**
   * Admins receive access to enabled features by default.
   * More detailed admin permission levels can be added later.
   */
  if (userRoles.includes(ROLE_IDS.ADMIN)) {
    return true;
  }

  return userRoles.some((roleId) =>
    featureConfig.allowedRoles.includes(roleId)
  );
}