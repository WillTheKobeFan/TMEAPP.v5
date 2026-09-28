// src/policies/policySurvey.ts

import {
  PolicyDefinition,
  PolicyOption,
  PolicyOverride,
  PolicyValue,
} from "./types";

export type SurveyInputType =
  | "boolean"
  | "single_select"
  | "multi_select"
  | "number"
  | "text";

export type PolicySurveyQuestion = {
  id: string;
  policyId: string;

  title: string;
  question: string;

  inputType: SurveyInputType;

  currentValue: PolicyValue;
  defaultValue: PolicyValue;

  options?: PolicyOption[];

  required: boolean;

  helpText?: string;
};

export type PolicySurveyAnswer = {
  policyId: string;
  value: PolicyValue;
};

type BuildPolicySurveyArgs = {
  policies: PolicyDefinition[];

  /**
   * Optional ordered list from a program template.
   * Priority questions appear first.
   */
  priorityPolicyIds?: string[];
};

/**
 * Determines the best survey input automatically
 * when a policy does not explicitly provide options.
 */
function inferInputType(policy: PolicyDefinition): SurveyInputType {
  if (policy.options?.length) {
    return "single_select";
  }

  if (typeof policy.defaultValue === "boolean") {
    return "boolean";
  }

  if (typeof policy.defaultValue === "number") {
    return "number";
  }

  if (Array.isArray(policy.defaultValue)) {
    return "multi_select";
  }

  return "text";
}

/**
 * Converts a policy definition into a human-readable
 * onboarding question.
 *
 * Later we can add custom surveyQuestion fields directly
 * to PolicyDefinition when we want more precise wording.
 */
function buildQuestionText(policy: PolicyDefinition): string {
  switch (policy.id) {
    case "registration_required":
      return "Is registration required before participation?";

    case "registration_types_allowed":
      return "Who is allowed to complete registration?";

    case "registration_grace_period_allowed":
      return "Do you allow a registration grace period?";

    case "registration_extended_grace_allowed":
      return "Do you allow an extended grace period?";

    case "next_session_registration_open_week":
      return "What week does next-session registration open?";

    case "next_session_registration_close_week":
      return "What week does next-session registration close?";

    case "payment_required_before_session":
      return "Must payment be completed before participation?";

    case "payment_structures_allowed":
      return "Which payment structures do you allow?";

    case "payment_methods_allowed":
      return "Which payment methods do you accept?";

    case "minimum_players":
      return "How many players are needed for an official game?";

    case "forfeit_player_threshold":
      return "At what player count is the game a forfeit?";

    case "forfeit_notice_hours":
      return "How much advance notice is required for a forfeit?";

    case "fill_in_players_allowed":
      return "Are fill-in players allowed?";

    case "official_fill_in_limit":
      return "How many fill-ins may be used in an official game?";

    case "multiple_fill_ins_result":
      return "What happens when the fill-in limit is exceeded?";

    case "injury_exception_allowed":
      return "Do you allow injury roster exceptions?";

    case "injury_exception_limit":
      return "How many injury exceptions are normally allowed?";

    case "playoff_participation_requirement":
      return "How many regular-season games are required for playoffs?";

    case "playoff_eligibility_override":
      return "Can authorized admins approve playoff exceptions?";

    case "jersey_requirement":
      return "How are jerseys handled?";

    case "team_color_fallback_allowed":
      return "Can team colors be used when jerseys are unavailable?";

    case "referee_shirt_required":
      return "Must referees wear an identifiable referee shirt?";

    case "official_referee_uniform_required":
      return "Is a formal referee uniform required?";

    case "staff_policy_acknowledgement_required":
      return "Must staff acknowledge policies before receiving access?";

    case "basketball_foul_limit":
      return "How many personal fouls are allowed?";

    case "basketball_after_foul_limit":
      return "What happens after a player reaches the foul limit?";

    case "basketball_flopping_rule":
      return "How does your league handle flopping?";

    case "basketball_transition_take_foul":
      return "How are transition take fouls handled?";

    default:
      return policy.title;
  }
}

/**
 * Builds the list of survey questions for the policies
 * selected by the organization's program/sport templates.
 */
export function buildPolicySurvey({
  policies,
  priorityPolicyIds = [],
}: BuildPolicySurveyArgs): PolicySurveyQuestion[] {
  const priorityMap = new Map(
    priorityPolicyIds.map((policyId, index) => [
      policyId,
      index,
    ]),
  );

  return policies
    .filter((policy) => policy.configurable)
    .map((policy): PolicySurveyQuestion => {
      return {
        id: `survey_${policy.id}`,
        policyId: policy.id,

        title: policy.title,
        question: buildQuestionText(policy),

        inputType: inferInputType(policy),

        currentValue: policy.defaultValue,
        defaultValue: policy.defaultValue,

        options: policy.options,

        required: policy.importance === "required",

        helpText: policy.helpText ?? policy.description,
      };
    })
    .sort((a, b) => {
      const aPriority = priorityMap.get(a.policyId);
      const bPriority = priorityMap.get(b.policyId);

      if (
        aPriority !== undefined &&
        bPriority !== undefined
      ) {
        return aPriority - bPriority;
      }

      if (aPriority !== undefined) {
        return -1;
      }

      if (bPriority !== undefined) {
        return 1;
      }

      return a.title.localeCompare(b.title);
    });
}

/**
 * Converts completed survey answers into organization-level
 * PolicyOverride records.
 *
 * These can eventually be written directly to Firestore.
 */
export function surveyAnswersToOverrides(
  answers: PolicySurveyAnswer[],
  organizationId: string,
): PolicyOverride[] {
  return answers.map((answer) => ({
    policyId: answer.policyId,

    value: answer.value,

    level: "organization",

    organizationId,

    reason: "Configured during organization policy survey.",
  }));
}

/**
 * Only creates overrides when the answer differs
 * from the template/default value.
 *
 * This keeps Firestore cleaner because an organization
 * doesn't need to store hundreds of unnecessary overrides.
 */
export function changedSurveyAnswersToOverrides(
  answers: PolicySurveyAnswer[],
  policies: PolicyDefinition[],
  organizationId: string,
): PolicyOverride[] {
  const policyMap = new Map(
    policies.map((policy) => [policy.id, policy]),
  );

  return answers.flatMap((answer) => {
    const policy = policyMap.get(answer.policyId);

    if (!policy) {
      return [];
    }

    if (valuesAreEqual(answer.value, policy.defaultValue)) {
      return [];
    }

    return [
      {
        policyId: answer.policyId,
        value: answer.value,
        level: "organization" as const,
        organizationId,
        reason: "Organization policy survey override.",
      },
    ];
  });
}

function valuesAreEqual(
  a: PolicyValue,
  b: PolicyValue,
): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return a === b;
}