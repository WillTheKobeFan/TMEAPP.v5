// src/config/permissions.test.ts

import {
  FEATURE_IDS,
  type FeatureId,
} from "./features";

import {
  MEMBERSHIP_SOURCE_IDS,
  MEMBERSHIP_STATUS_IDS,
  type OrganizationMembership,
} from "./memberships";

import {
  ORGANIZATION_IDS,
  type OrganizationId,
} from "./organizations";

import {
  PERMISSION_IDS,
  canAccessAdminPanel,
  canAccessFeature,
  canEditSchedule,
  canFinalizeScore,
  canPerformAction,
  canSubmitScore,
  getAccessibleFeatureIds,
} from "./permissions";

import {
  ROLE_IDS,
  type RoleId,
} from "./roles";

type TestResult = {
  name: string;
  expected: boolean;
  received: boolean;
  passed: boolean;
};

const results: TestResult[] = [];

/**
 * Records and prints one permission test.
 */
function expectPermission(
  name: string,
  received: boolean,
  expected: boolean
): void {
  const passed = received === expected;

  results.push({
    name,
    expected,
    received,
    passed,
  });

  const marker = passed ? "✅" : "❌";

  console.log(
    `${marker} ${name} | expected: ${expected}, received: ${received}`
  );
}

/**
 * Helper for creating clean test memberships.
 */
function createMembership(config: {
  id: string;
  userId: string;
  organizationId: OrganizationId;
  roles: readonly RoleId[];
  status?: OrganizationMembership["status"];
  teamIds?: readonly string[];
  leagueIds?: readonly string[];
  programIds?: readonly string[];
  assignmentIds?: readonly string[];
}): OrganizationMembership {
  return {
    id: config.id,
    userId: config.userId,
    organizationId: config.organizationId,
    roles: config.roles,
    status:
      config.status ?? MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.SYSTEM,
    teamIds: config.teamIds,
    leagueIds: config.leagueIds,
    programIds: config.programIds,
    assignmentIds: config.assignmentIds,
  };
}

/**
 * Test user 1:
 * TME player and captain for TeeJ in the Sunday league.
 */
const tmeCaptain = createMembership({
  id: "test_tme_captain",
  userId: "user_captain",
  organizationId: ORGANIZATION_IDS.TME,
  roles: [ROLE_IDS.PLAYER, ROLE_IDS.CAPTAIN],
  leagueIds: ["sunday"],
  teamIds: ["sun_tF"],
});

/**
 * Test user 2:
 * Pickup USA referee and scorekeeper.
 */
const pickupOfficial = createMembership({
  id: "test_pickup_official",
  userId: "user_official",
  organizationId: ORGANIZATION_IDS.PICKUP,
  roles: [ROLE_IDS.REFEREE, ROLE_IDS.SCOREKEEPER],
  leagueIds: ["pickup_sunday"],
  assignmentIds: [
    "pickup_game_01_scorekeeper",
    "pickup_game_02_referee",
  ],
});

/**
 * Test user 3:
 * Taj coach whose membership is still pending.
 */
const pendingTajCoach = createMembership({
  id: "test_pending_taj_coach",
  userId: "user_coach",
  organizationId: ORGANIZATION_IDS.TAJ,
  roles: [ROLE_IDS.COACH],
  status: MEMBERSHIP_STATUS_IDS.PENDING,
  programIds: ["taj_clinic_12_14"],
});

/**
 * Test user 4:
 * Full TME organization administrator.
 */
const tmeAdmin = createMembership({
  id: "test_tme_admin",
  userId: "user_admin",
  organizationId: ORGANIZATION_IDS.TME,
  roles: [ROLE_IDS.ADMIN],
});

/**
 * Test user 5:
 * Free-agent player with no captain role.
 */
const freeAgentPlayer = createMembership({
  id: "test_free_agent_player",
  userId: "user_free_agent",
  organizationId: ORGANIZATION_IDS.TME,
  roles: [ROLE_IDS.PLAYER],
  leagueIds: ["sunday"],
  teamIds: ["sun_free_agents_01"],
});

export function runPermissionTests(): TestResult[] {
  results.length = 0;

  console.log("\n==============================");
  console.log("PERMISSION SYSTEM TESTS");
  console.log("==============================\n");

  /**
   * TME captain tests
   */
  expectPermission(
    "TME captain can access Schedule",
    canAccessFeature(
      tmeCaptain,
      FEATURE_IDS.SCHEDULE
    ),
    true
  );

  expectPermission(
    "TME captain can access Standings",
    canAccessFeature(
      tmeCaptain,
      FEATURE_IDS.STANDINGS
    ),
    true
  );

  expectPermission(
    "TME captain cannot access disabled Progress",
    canAccessFeature(
      tmeCaptain,
      FEATURE_IDS.PROGRESS
    ),
    false
  );

  expectPermission(
    "TME captain can view own roster",
    canPerformAction({
      membership: tmeCaptain,
      permissionId:
        PERMISSION_IDS.TEAM_VIEW_ROSTER,
      resource: {
        leagueId: "sunday",
        teamId: "sun_tF",
      },
    }),
    true
  );

  expectPermission(
    "TME captain cannot view another private roster",
    canPerformAction({
      membership: tmeCaptain,
      permissionId:
        PERMISSION_IDS.TEAM_VIEW_ROSTER,
      resource: {
        leagueId: "sunday",
        teamId: "sun_tA",
      },
    }),
    false
  );

  expectPermission(
    "TME captain cannot edit Schedule",
    canEditSchedule(tmeCaptain, {
      leagueId: "sunday",
    }),
    false
  );

  expectPermission(
    "TME captain cannot access Admin Panel",
    canAccessAdminPanel(tmeCaptain),
    false
  );

  /**
   * Pickup official tests
   */
  expectPermission(
    "Pickup scorekeeper can access Schedule",
    canAccessFeature(
      pickupOfficial,
      FEATURE_IDS.SCHEDULE
    ),
    true
  );

  expectPermission(
    "Pickup official cannot access disabled Standings",
    canAccessFeature(
      pickupOfficial,
      FEATURE_IDS.STANDINGS
    ),
    false
  );

  expectPermission(
    "Pickup scorekeeper can submit assigned score",
    canSubmitScore(pickupOfficial, {
      assignmentId:
        "pickup_game_01_scorekeeper",
    }),
    true
  );

  expectPermission(
    "Pickup scorekeeper cannot submit unassigned score",
    canSubmitScore(pickupOfficial, {
      assignmentId:
        "pickup_game_99_scorekeeper",
    }),
    false
  );

  expectPermission(
    "Pickup scorekeeper cannot finalize score",
    canFinalizeScore(pickupOfficial, {
      assignmentId:
        "pickup_game_01_scorekeeper",
    }),
    false
  );

  /**
   * Pending membership tests
   */
  expectPermission(
    "Pending Taj coach cannot access Schedule",
    canAccessFeature(
      pendingTajCoach,
      FEATURE_IDS.SCHEDULE
    ),
    false
  );

  expectPermission(
    "Pending Taj coach cannot send group messages",
    canPerformAction({
      membership: pendingTajCoach,
      permissionId:
        PERMISSION_IDS.MESSAGE_SEND_GROUP,
      resource: {
        programId: "taj_clinic_12_14",
      },
    }),
    false
  );

  /**
   * Admin tests
   */
  expectPermission(
    "TME admin can access Admin Panel",
    canAccessAdminPanel(tmeAdmin),
    true
  );

  expectPermission(
    "TME admin can edit Sunday Schedule",
    canEditSchedule(tmeAdmin, {
      leagueId: "sunday",
    }),
    true
  );

  expectPermission(
    "TME admin can finalize scores",
    canFinalizeScore(tmeAdmin, {
      leagueId: "sunday",
      gameId: "sun_w04_g02",
    }),
    true
  );

  expectPermission(
    "TME admin still cannot access disabled Progress",
    canAccessFeature(
      tmeAdmin,
      FEATURE_IDS.PROGRESS
    ),
    false
  );

  /**
   * Free-agent player tests
   */
  expectPermission(
    "Free-agent player can view own team",
    canPerformAction({
      membership: freeAgentPlayer,
      permissionId: PERMISSION_IDS.TEAM_VIEW,
      resource: {
        leagueId: "sunday",
        teamId: "sun_free_agents_01",
      },
    }),
    true
  );

  expectPermission(
    "Free-agent player cannot use captain roster tools",
    canPerformAction({
      membership: freeAgentPlayer,
      permissionId:
        PERMISSION_IDS.TEAM_VIEW_ROSTER,
      resource: {
        leagueId: "sunday",
        teamId: "sun_free_agents_01",
      },
    }),
    false
  );

  expectPermission(
    "Free-agent player cannot message the team as captain",
    canPerformAction({
      membership: freeAgentPlayer,
      permissionId:
        PERMISSION_IDS.MESSAGE_SEND_TEAM,
      resource: {
        leagueId: "sunday",
        teamId: "sun_free_agents_01",
      },
    }),
    false
  );

  /**
   * Print accessible features.
   */
  printAccessibleFeatures(
    "TME Captain",
    tmeCaptain
  );

  printAccessibleFeatures(
    "Pickup Official",
    pickupOfficial
  );

  printAccessibleFeatures(
    "Pending Taj Coach",
    pendingTajCoach
  );

  printAccessibleFeatures(
    "TME Admin",
    tmeAdmin
  );

  const passedCount = results.filter(
    (result) => result.passed
  ).length;

  const failedCount =
    results.length - passedCount;

  console.log("\n------------------------------");
  console.log(
    `Tests: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`
  );
  console.log("------------------------------\n");

  if (failedCount > 0) {
    console.error(
      "❌ Permission tests failed.",
      results.filter((result) => !result.passed)
    );
  } else {
    console.log(
      "✅ All permission tests passed."
    );
  }

  return [...results];
}

function printAccessibleFeatures(
  label: string,
  membership: OrganizationMembership
): void {
  const featureIds: FeatureId[] =
    getAccessibleFeatureIds(membership);

  console.log(
    `\n${label} accessible features:`,
    featureIds.join(", ") || "None"
  );
}