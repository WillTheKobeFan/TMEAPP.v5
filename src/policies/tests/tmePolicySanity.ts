// src/policies/tests/tmePolicySanity.ts

import { buildOrganizationPolicySetup } from "../buildOrganizationPolicySetup";
import { allTmePolicyOverrides } from "../organizations/tme";
import { ResolvedPolicy } from "../types";

const setup = buildOrganizationPolicySetup({
  context: {
    organizationId: "tme",
    sport: "basketball",
    programType: "mens_league",
  },
  overrides: allTmePolicyOverrides,
});

function getPolicy(policyId: string): ResolvedPolicy {
  const policy = setup.resolvedPolicies.find(
    (item: ResolvedPolicy) => item.id === policyId,
  );

  if (!policy) {
    throw new Error(`Policy not found: ${policyId}`);
  }

  return policy;
}

function expectPolicyValue(
  policyId: string,
  expectedValue: unknown,
): void {
  const policy = getPolicy(policyId);

  const actual = JSON.stringify(policy.value);
  const expected = JSON.stringify(expectedValue);

  if (actual !== expected) {
    throw new Error(
      [
        `Policy sanity check failed: ${policyId}`,
        `Expected: ${expected}`,
        `Received: ${actual}`,
        `Source: ${policy.sourceLevel}`,
      ].join("\n"),
    );
  }

  console.log(
    `✓ ${policyId}: ${actual} (${policy.sourceLevel})`,
  );
}

// -----------------------------------------------------------------------------
// TME MEN'S BASKETBALL SANITY CHECKS
// -----------------------------------------------------------------------------

expectPolicyValue("registration_required", true);

expectPolicyValue(
  "registration_types_allowed",
  ["individual", "captain", "team"],
);

expectPolicyValue("payment_required_before_session", true);

expectPolicyValue("minimum_players", 4);

expectPolicyValue("forfeit_player_threshold", 3);

expectPolicyValue("forfeit_notice_hours", 24);

expectPolicyValue("fill_in_players_allowed", true);

expectPolicyValue("official_fill_in_limit", 1);

expectPolicyValue(
  "multiple_fill_ins_result",
  "unofficial_game",
);

expectPolicyValue("injury_exception_allowed", true);

expectPolicyValue("injury_exception_limit", 1);

expectPolicyValue(
  "additional_injury_exception_requires_admin",
  true,
);

expectPolicyValue(
  "playoff_participation_requirement",
  3,
);

expectPolicyValue(
  "playoff_eligibility_override",
  true,
);

expectPolicyValue(
  "playoff_only_players_prohibited",
  true,
);

expectPolicyValue("basketball_foul_limit", 5);

expectPolicyValue(
  "basketball_after_foul_limit",
  "continue_with_technical_penalty",
);

expectPolicyValue(
  "basketball_team_may_continue_with_four",
  true,
);

expectPolicyValue(
  "basketball_flopping_rule",
  "normal_play",
);

expectPolicyValue(
  "basketball_transition_take_foul",
  "normal_foul",
);

expectPolicyValue("referee_shirt_required", true);

expectPolicyValue(
  "official_referee_uniform_required",
  false,
);

expectPolicyValue("competitive_integrity", true);

expectPolicyValue("staff_integrity", true);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------

console.log("\n--------------------------------");
console.log("TME POLICY SANITY CHECK PASSED");
console.log("--------------------------------");

console.log({
  availablePolicies:
    setup.summary.availablePolicyCount,

  applicablePolicies:
    setup.summary.applicablePolicyCount,

  inherited:
    setup.summary.inheritedPolicyCount,

  overridden:
    setup.summary.overriddenPolicyCount,

  surveyQuestions:
    setup.summary.surveyQuestionCount,
});