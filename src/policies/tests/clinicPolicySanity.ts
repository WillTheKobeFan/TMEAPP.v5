// src/policies/tests/clinicPolicySanity.ts

import { buildOrganizationPolicySetup } from "../buildOrganizationPolicySetup";
import { ResolvedPolicy } from "../types";

const setup = buildOrganizationPolicySetup({
  context: {
    organizationId: "test_clinic_org",
    sport: "basketball",
    programType: "clinic",
  },

  overrides: [],
});

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
      `Expected clinic policy was not loaded: ${policyId}`,
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
      `Policy should NOT exist in Clinic: ${policyId}`,
    );
  }

  console.log(`✓ excluded: ${policyId}`);
}

// -----------------------------------------------------------------------------
// CLINIC POLICIES
// -----------------------------------------------------------------------------

console.log("\nCLINIC POLICIES\n");

expectPolicyExists("staff_integrity");

expectPolicyExists("registration_required");

expectPolicyExists(
  "payment_required_before_session",
);

expectPolicyExists("clinic_capacity_limit");

expectPolicyExists("clinic_waitlist_enabled");

expectPolicyExists("clinic_age_requirement");

expectPolicyExists("clinic_skill_level");

expectPolicyExists(
  "clinic_attendance_required",
);

expectPolicyExists(
  "clinic_late_arrival_policy",
);

expectPolicyExists("clinic_no_show_policy");

expectPolicyExists("clinic_makeup_allowed");

expectPolicyExists("clinic_drop_ins_allowed");

expectPolicyExists(
  "clinic_required_equipment",
);

expectPolicyExists(
  "clinic_instructor_ratio",
);

expectPolicyExists(
  "clinic_injury_reporting_required",
);

expectPolicyExists(
  "clinic_schedule_change_notice",
);

// -----------------------------------------------------------------------------
// LEAGUE POLICIES SHOULD NOT LOAD
// -----------------------------------------------------------------------------

console.log("\nLEAGUE POLICIES EXCLUDED\n");

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
  "referee_game_control_authority",
);

expectPolicyExcluded(
  "basketball_foul_limit",
);

expectPolicyExcluded(
  "basketball_flopping_rule",
);

expectPolicyExcluded(
  "basketball_overtime_rule",
);

// -----------------------------------------------------------------------------
// TRAINING POLICIES SHOULD ALSO NOT LOAD
// -----------------------------------------------------------------------------

console.log("\nTRAINING POLICIES EXCLUDED\n");

expectPolicyExcluded(
  "training_cancellation_notice_hours",
);

expectPolicyExcluded(
  "training_package_required",
);

expectPolicyExcluded(
  "training_session_type",
);

expectPolicyExcluded(
  "training_group_size_limit",
);

expectPolicyExcluded(
  "training_no_show_policy",
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------

console.log("\n--------------------------------");
console.log("CLINIC POLICY SANITY CHECK PASSED");
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