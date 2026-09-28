// src/policies/tests/trainingPolicySanity.ts

import { buildOrganizationPolicySetup } from "../buildOrganizationPolicySetup";
import { ResolvedPolicy } from "../types";

// -----------------------------------------------------------------------------
// BUILD TEST TRAINING ORGANIZATION
// -----------------------------------------------------------------------------

const setup = buildOrganizationPolicySetup({
  context: {
    organizationId: "test_training_org",
    sport: "basketball",
    programType: "training",
  },

  overrides: [],
});

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function getPolicy(
  policyId: string,
): ResolvedPolicy | undefined {
  return setup.resolvedPolicies.find(
    (policy: ResolvedPolicy) =>
      policy.id === policyId,
  );
}

function expectPolicyExists(
  policyId: string,
): void {
  const policy = getPolicy(policyId);

  if (!policy) {
    throw new Error(
      `Expected training policy was not loaded: ${policyId}`,
    );
  }

  console.log(
    `✓ loaded: ${policyId} = ${JSON.stringify(
      policy.value,
    )} (${policy.sourceLevel})`,
  );
}

function expectPolicyExcluded(
  policyId: string,
): void {
  const policy = getPolicy(policyId);

  if (policy) {
    throw new Error(
      `Competition policy should NOT exist in Training: ${policyId}`,
    );
  }

  console.log(
    `✓ excluded: ${policyId}`,
  );
}

// -----------------------------------------------------------------------------
// EXPECTED TRAINING POLICIES
// -----------------------------------------------------------------------------

console.log("\nTRAINING POLICIES\n");

expectPolicyExists("staff_integrity");

expectPolicyExists("registration_required");

expectPolicyExists(
  "payment_required_before_session",
);

expectPolicyExists(
  "training_attendance_required",
);

expectPolicyExists(
  "training_late_arrival_policy",
);

expectPolicyExists(
  "training_cancellation_notice_hours",
);

expectPolicyExists(
  "training_no_show_policy",
);

expectPolicyExists(
  "training_makeup_sessions_allowed",
);

expectPolicyExists(
  "training_session_type",
);

expectPolicyExists(
  "training_group_size_limit",
);

expectPolicyExists(
  "training_drop_ins_allowed",
);

expectPolicyExists(
  "training_package_required",
);

expectPolicyExists(
  "training_required_equipment",
);

expectPolicyExists(
  "training_injury_reporting_required",
);

expectPolicyExists(
  "trainer_policy_acknowledgement_required",
);

expectPolicyExists(
  "training_schedule_change_notice",
);

// -----------------------------------------------------------------------------
// POLICIES TRAINING SHOULD NOT RECEIVE
// -----------------------------------------------------------------------------

console.log("\nCOMPETITION POLICIES EXCLUDED\n");

expectPolicyExcluded("minimum_players");

expectPolicyExcluded(
  "forfeit_player_threshold",
);

expectPolicyExcluded(
  "fill_in_players_allowed",
);

expectPolicyExcluded(
  "playoff_participation_requirement",
);

expectPolicyExcluded(
  "playoff_only_players_prohibited",
);

expectPolicyExcluded(
  "referee_game_control_authority",
);

expectPolicyExcluded(
  "basketball_foul_limit",
);

expectPolicyExcluded(
  "basketball_flopping_rule",
);

expectPolicyExcluded(
  "basketball_transition_take_foul",
);

expectPolicyExcluded(
  "basketball_overtime_rule",
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------

console.log("\n--------------------------------");
console.log("TRAINING POLICY SANITY CHECK PASSED");
console.log("--------------------------------");

console.log({
  availablePolicies:
    setup.summary.availablePolicyCount,

  applicablePolicies:
    setup.summary.applicablePolicyCount,

  configurablePolicies:
    setup.summary.configurablePolicyCount,

  inherited:
    setup.summary.inheritedPolicyCount,

  overridden:
    setup.summary.overriddenPolicyCount,

  surveyQuestions:
    setup.summary.surveyQuestionCount,
});