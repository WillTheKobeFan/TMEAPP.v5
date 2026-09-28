// src/config/features.ts

/**
 * Every feature supported by the app.
 *
 * Keep these IDs stable because they may eventually be stored in:
 * - Firestore organization configurations
 * - Role permissions
 * - User navigation preferences
 * - Admin feature settings
 */
export const FEATURE_IDS = {
  HOME: "home",
  SCHEDULE: "schedule",
  STANDINGS: "standings",
  INBOX: "inbox",
  CHAMPS: "champs",
  PROGRESS: "progress",
  SEARCH: "search",
  SETTINGS: "settings",
} as const;

/**
 * Creates a union type containing every valid feature ID.
 */
export type FeatureId =
  (typeof FEATURE_IDS)[keyof typeof FEATURE_IDS];

/**
 * Determines where a feature may appear in the app.
 */
export const FEATURE_PLACEMENTS = {
  MAIN_NAV: "mainNav",
  MORE: "more",
  SETTINGS: "settings",
  HIDDEN: "hidden",
} as const;

export type FeaturePlacement =
  (typeof FEATURE_PLACEMENTS)[keyof typeof FEATURE_PLACEMENTS];

/**
 * Broad feature groups used by the Admin Panel.
 */
export const FEATURE_CATEGORY_IDS = {
  CORE: "core",
  COMPETITION: "competition",
  COMMUNICATION: "communication",
  DEVELOPMENT: "development",
  DISCOVERY: "discovery",
  SYSTEM: "system",
} as const;

export type FeatureCategoryId =
  (typeof FEATURE_CATEGORY_IDS)[keyof typeof FEATURE_CATEGORY_IDS];

/**
 * Complete definition for an app feature.
 */
export type FeatureDefinition = {
  id: FeatureId;
  label: string;
  shortLabel: string;
  description: string;
  route: string;
  category: FeatureCategoryId;

  /**
   * Whether new organizations receive this feature by default.
   */
  defaultEnabled: boolean;

  /**
   * Whether the feature must remain available internally.
   */
  required: boolean;

  /**
   * Whether an organization admin can enable or disable it.
   */
  adminConfigurable: boolean;

  /**
   * Places where the feature is allowed to appear.
   */
  allowedPlacements: readonly FeaturePlacement[];

  /**
   * Default navigation placement.
   */
  defaultPlacement: FeaturePlacement;

  /**
   * Default navigation order.
   */
  defaultOrder: number;
};

/**
 * Universal feature library.
 *
 * Organizations select which features they use.
 * Roles and permissions later determine who can access them.
 */
export const FEATURES: Record<FeatureId, FeatureDefinition> = {
  [FEATURE_IDS.HOME]: {
    id: FEATURE_IDS.HOME,
    label: "Home",
    shortLabel: "Home",
    description:
      "Displays the organization overview, important information, and featured content.",
    route: "/home",
    category: FEATURE_CATEGORY_IDS.CORE,
    defaultEnabled: true,
    required: true,
    adminConfigurable: false,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MAIN_NAV,
    defaultOrder: 1,
  },

  [FEATURE_IDS.SCHEDULE]: {
    id: FEATURE_IDS.SCHEDULE,
    label: "Schedule",
    shortLabel: "Schedule",
    description:
      "Displays games, events, assignments, results, and calendar information.",
    route: "/schedule",
    category: FEATURE_CATEGORY_IDS.COMPETITION,
    defaultEnabled: true,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MAIN_NAV,
    defaultOrder: 2,
  },

  [FEATURE_IDS.STANDINGS]: {
    id: FEATURE_IDS.STANDINGS,
    label: "Standings",
    shortLabel: "Standings",
    description:
      "Displays rankings, records, tiebreakers, playoff position, and season information.",
    route: "/standings",
    category: FEATURE_CATEGORY_IDS.COMPETITION,
    defaultEnabled: true,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MAIN_NAV,
    defaultOrder: 3,
  },

  [FEATURE_IDS.INBOX]: {
    id: FEATURE_IDS.INBOX,
    label: "Inbox",
    shortLabel: "Inbox",
    description:
      "Displays organization announcements, updates, support information, and resources.",
    route: "/inbox",
    category: FEATURE_CATEGORY_IDS.COMMUNICATION,
    defaultEnabled: true,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MAIN_NAV,
    defaultOrder: 4,
  },

  [FEATURE_IDS.CHAMPS]: {
    id: FEATURE_IDS.CHAMPS,
    label: "Champions",
    shortLabel: "Champs",
    description:
      "Displays current champions, championship history, photos, and season history.",
    route: "/champs",
    category: FEATURE_CATEGORY_IDS.COMPETITION,
    defaultEnabled: true,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MAIN_NAV,
    defaultOrder: 5,
  },

  [FEATURE_IDS.PROGRESS]: {
    id: FEATURE_IDS.PROGRESS,
    label: "Progress",
    shortLabel: "Progress",
    description:
      "Displays participant, team, training, attendance, or development progress.",
    route: "/progress",
    category: FEATURE_CATEGORY_IDS.DEVELOPMENT,
    defaultEnabled: false,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MORE,
    defaultOrder: 6,
  },

  [FEATURE_IDS.SEARCH]: {
    id: FEATURE_IDS.SEARCH,
    label: "Search",
    shortLabel: "Search",
    description:
      "Allows users to find organizations, programs, teams, resources, and other available information.",
    route: "/search",
    category: FEATURE_CATEGORY_IDS.DISCOVERY,
    defaultEnabled: true,
    required: false,
    adminConfigurable: true,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MAIN_NAV,
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.HIDDEN,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MORE,
    defaultOrder: 7,
  },

  [FEATURE_IDS.SETTINGS]: {
    id: FEATURE_IDS.SETTINGS,
    label: "Settings",
    shortLabel: "Settings",
    description:
      "Provides user preferences, accessibility controls, organization switching, and account tools.",
    route: "/settings",
    category: FEATURE_CATEGORY_IDS.SYSTEM,
    defaultEnabled: true,
    required: true,
    adminConfigurable: false,
    allowedPlacements: [
      FEATURE_PLACEMENTS.MORE,
      FEATURE_PLACEMENTS.SETTINGS,
    ],
    defaultPlacement: FEATURE_PLACEMENTS.MORE,
    defaultOrder: 8,
  },
};

/**
 * Array version for FlatList, setup forms, and Admin Panel screens.
 */
export const FEATURE_LIST: FeatureDefinition[] =
  Object.values(FEATURES);

/**
 * Returns a complete feature definition.
 */
export function getFeatureById(
  featureId: FeatureId
): FeatureDefinition {
  return FEATURES[featureId];
}

/**
 * Checks whether an unknown value is a valid FeatureId.
 */
export function isFeatureId(
  value: unknown
): value is FeatureId {
  return (
    typeof value === "string" &&
    Object.values(FEATURE_IDS).includes(value as FeatureId)
  );
}

/**
 * Returns valid, unique feature IDs from unknown data.
 *
 * Useful when reading organization settings from Firestore.
 */
export function sanitizeFeatureIds(
  values: unknown
): FeatureId[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.filter(isFeatureId))];
}

/**
 * Returns all features enabled by default.
 */
export function getDefaultEnabledFeatures(): FeatureId[] {
  return FEATURE_LIST
    .filter((feature) => feature.defaultEnabled)
    .map((feature) => feature.id);
}

/**
 * Checks whether a feature is enabled.
 */
export function isFeatureEnabled(
  enabledFeatures: readonly FeatureId[],
  featureId: FeatureId
): boolean {
  const feature = FEATURES[featureId];

  if (feature.required) {
    return true;
  }

  return enabledFeatures.includes(featureId);
}

/**
 * Returns enabled feature definitions in their default order.
 */
export function getEnabledFeatures(
  enabledFeatures: readonly FeatureId[]
): FeatureDefinition[] {
  return FEATURE_LIST
    .filter((feature) =>
      isFeatureEnabled(enabledFeatures, feature.id)
    )
    .sort((a, b) => a.defaultOrder - b.defaultOrder);
}

/**
 * Returns features assigned to a particular placement.
 */
export function getFeaturesByPlacement(
  enabledFeatures: readonly FeatureId[],
  placement: FeaturePlacement
): FeatureDefinition[] {
  return getEnabledFeatures(enabledFeatures).filter(
    (feature) => feature.defaultPlacement === placement
  );
}

/**
 * Checks whether a feature supports a requested placement.
 */
export function canUseFeaturePlacement(
  featureId: FeatureId,
  placement: FeaturePlacement
): boolean {
  return FEATURES[featureId].allowedPlacements.includes(
    placement
  );
}

/**
 * Returns features that an organization admin may configure.
 */
export function getAdminConfigurableFeatures(): FeatureDefinition[] {
  return FEATURE_LIST.filter(
    (feature) => feature.adminConfigurable
  );
}