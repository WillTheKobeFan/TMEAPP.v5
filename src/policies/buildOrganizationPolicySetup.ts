// src/policies/buildOrganizationPolicySetup.ts

import { getPoliciesForProgram } from "src/policies/getPoliciesForProgram";
import { masterPolicyLibrary } from "./masterPolicyLibrary";
import {
  buildPolicySurvey,
  PolicySurveyQuestion,
} from "./policySurvey";
import { resolvePolicies } from "./resolvePolicies";

import { basketballPolicies } from "./sports/basketball";

import { mensLeagueTemplate } from "./templates/mensLeague";
import { ProgramPolicyTemplate } from "./templates/types";

import {
  PolicyDefinition,
  PolicyOverride,
  ProgramType,
  ResolvedPolicy,
} from "./types";

import { trainingTemplate } from "./templates/training";
import { clinicTemplate } from "./templates/clinic";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

export type SupportedSport = "basketball";

export type OrganizationPolicySetupContext = {
  organizationId: string;

  sport?: SupportedSport;

  programType: ProgramType;

  programId?: string;
  leagueId?: string;
  sessionId?: string;
};

export type OrganizationPolicySetup = {
  context: OrganizationPolicySetupContext;

  template: ProgramPolicyTemplate;

  /**
   * Master + sport policies before program filtering.
   */
  availablePolicies: PolicyDefinition[];

  /**
   * Policies that actually apply to the selected program.
   */
  applicablePolicies: PolicyDefinition[];

  /**
   * Final values after organization/program/league/session
   * overrides have been resolved.
   */
  resolvedPolicies: ResolvedPolicy[];

  /**
   * Survey generated from the relevant configurable policies.
   */
  survey: PolicySurveyQuestion[];

  /**
   * Useful summary information for admin/onboarding screens.
   */
  summary: {
    availablePolicyCount: number;
    applicablePolicyCount: number;
    configurablePolicyCount: number;
    resolvedPolicyCount: number;
    overriddenPolicyCount: number;
    inheritedPolicyCount: number;
    surveyQuestionCount: number;
  };
};

// -----------------------------------------------------------------------------
// TEMPLATE LOOKUP
// -----------------------------------------------------------------------------

function getProgramTemplate(
  programType: ProgramType,
): ProgramPolicyTemplate {
  switch (programType) {
    case "mens_league":
      return mensLeagueTemplate;

    case "training":
      return trainingTemplate;

    case "clinic":
      return clinicTemplate;

    default:
      throw new Error(
        `No policy template has been configured for program type: ${programType}`,
      );
  }
}

// -----------------------------------------------------------------------------
// SPORT POLICY LOOKUP
// -----------------------------------------------------------------------------

function getSportPolicies(
  sport?: SupportedSport,
): PolicyDefinition[] {
  if (!sport) {
    return [];
  }

  switch (sport) {
    case "basketball":
      return basketballPolicies;

    default:
      return [];
  }
}

// -----------------------------------------------------------------------------
// DEDUPE
// -----------------------------------------------------------------------------

function dedupePolicies(
  policies: PolicyDefinition[],
): PolicyDefinition[] {
  const policyMap = new Map<string, PolicyDefinition>();

  for (const policy of policies) {
    policyMap.set(policy.id, policy);
  }

  return Array.from(policyMap.values());
}

// -----------------------------------------------------------------------------
// MAIN BUILDER
// -----------------------------------------------------------------------------

type BuildOrganizationPolicySetupArgs = {
  context: OrganizationPolicySetupContext;

  overrides?: PolicyOverride[];
};

export function buildOrganizationPolicySetup({
  context,
  overrides = [],
}: BuildOrganizationPolicySetupArgs): OrganizationPolicySetup {
  // 1. Determine program template.
  const template = getProgramTemplate(context.programType);

  // 2. Load universal policies.
  const universalPolicies = masterPolicyLibrary;

  // 3. Load sport-specific rules.
  const sportPolicies = getSportPolicies(context.sport);

  // 4. Combine the policy libraries.
  const availablePolicies = dedupePolicies([
    ...universalPolicies,
    ...sportPolicies,
  ]);

  // 5. Filter them through the selected program template.
  const applicablePolicies = getPoliciesForProgram({
    policies: availablePolicies,
    template,
  });

  // 6. Resolve organization/program/league/session overrides.
  const resolvedPolicies = resolvePolicies({
    policies: applicablePolicies,
    overrides,
    context: {
      organizationId: context.organizationId,
      sport: context.sport,
      programType: context.programType,
      programId: context.programId,
      leagueId: context.leagueId,
      sessionId: context.sessionId,
    },
  });

  // 7. Build onboarding survey.
  const survey = buildPolicySurvey({
    policies: applicablePolicies,
    priorityPolicyIds: template.surveyPriorityPolicyIds,
  });

  // 8. Build summary information.
  const configurablePolicyCount = applicablePolicies.filter(
    (policy) => policy.configurable,
  ).length;

  const overriddenPolicyCount = resolvedPolicies.filter(
    (policy) => policy.status === "overridden",
  ).length;

  const inheritedPolicyCount = resolvedPolicies.filter(
    (policy) => policy.status === "inherited",
  ).length;

  return {
    context,
    template,

    availablePolicies,
    applicablePolicies,
    resolvedPolicies,
    survey,

    summary: {
      availablePolicyCount: availablePolicies.length,
      applicablePolicyCount: applicablePolicies.length,
      configurablePolicyCount,
      resolvedPolicyCount: resolvedPolicies.length,
      overriddenPolicyCount,
      inheritedPolicyCount,
      surveyQuestionCount: survey.length,
    },
  };
}