// src/policies/resolvePolicies.ts

import {
  PolicyDefinition,
  PolicyLevel,
  PolicyOverride,
  ProgramType,
  ResolvedPolicy,
} from "./types";

type ResolvePoliciesContext = {
  organizationId?: string;
  sport?: string;
  programType?: ProgramType;
  programId?: string;
  leagueId?: string;
  sessionId?: string;
};

type ResolvePoliciesArgs = {
  policies: PolicyDefinition[];
  overrides?: PolicyOverride[];
  context?: ResolvePoliciesContext;
};

/**
 * Higher number = more specific.
 *
 * app
 *   ↓
 * sport
 *   ↓
 * organization
 *   ↓
 * program
 *   ↓
 * league
 *   ↓
 * session
 */
const POLICY_LEVEL_PRIORITY: Record<PolicyLevel, number> = {
  app: 0,
  sport: 1,
  organization: 2,
  program: 3,
  league: 4,
  session: 5,
};

/**
 * Checks whether a policy belongs in the current context.
 */
function isPolicyApplicable(
  policy: PolicyDefinition,
  context: ResolvePoliciesContext,
): boolean {
  // Sport-specific policy
  if (policy.sport) {
    if (!context.sport) {
      return false;
    }

    if (policy.sport !== context.sport) {
      return false;
    }
  }

  // Program-specific policy
  if (
    policy.applicablePrograms?.length &&
    context.programType &&
    !policy.applicablePrograms.includes(context.programType)
  ) {
    return false;
  }

  return true;
}

/**
 * Checks whether an override applies to the current context.
 */
function doesOverrideMatchContext(
  override: PolicyOverride,
  context: ResolvePoliciesContext,
): boolean {
  switch (override.level) {
    case "app":
      return true;

    case "sport":
      // Sport overrides currently rely on the supplied policy set/context.
      // We can add sportId directly to PolicyOverride later if needed.
      return Boolean(context.sport);

    case "organization":
      return (
        Boolean(context.organizationId) &&
        override.organizationId === context.organizationId
      );

    case "program":
      return (
        Boolean(context.organizationId) &&
        Boolean(context.programId) &&
        override.organizationId === context.organizationId &&
        override.programId === context.programId
      );

    case "league":
      return (
        Boolean(context.organizationId) &&
        Boolean(context.leagueId) &&
        override.organizationId === context.organizationId &&
        override.leagueId === context.leagueId
      );

    case "session":
      return (
        Boolean(context.organizationId) &&
        Boolean(context.sessionId) &&
        override.organizationId === context.organizationId &&
        override.sessionId === context.sessionId
      );

    default:
      return false;
  }
}

/**
 * Returns all matching overrides for a policy,
 * ordered from least specific to most specific.
 */
function getMatchingOverrides(
  policy: PolicyDefinition,
  overrides: PolicyOverride[],
  context: ResolvePoliciesContext,
): PolicyOverride[] {
  return overrides
    .filter((override) => override.policyId === policy.id)
    .filter((override) => doesOverrideMatchContext(override, context))
    .sort(
      (a, b) =>
        POLICY_LEVEL_PRIORITY[a.level] -
        POLICY_LEVEL_PRIORITY[b.level],
    );
}

/**
 * Resolves one policy into its final effective value.
 */
export function resolvePolicy(
  policy: PolicyDefinition,
  overrides: PolicyOverride[] = [],
  context: ResolvePoliciesContext = {},
): ResolvedPolicy {
  const matchingOverrides = getMatchingOverrides(
    policy,
    overrides,
    context,
  );

  // Start with the master/default value.
  let value = policy.defaultValue;
  let sourceLevel: PolicyLevel = policy.sport ? "sport" : "app";
  let appliedOverride: PolicyOverride | undefined;

  // Policies that cannot be overridden always keep their default.
  if (policy.allowOverride !== false) {
    for (const override of matchingOverrides) {
      value = override.value;
      sourceLevel = override.level;
      appliedOverride = override;
    }
  }

  return {
    ...policy,

    value,

    sourceLevel,

    status: appliedOverride ? "overridden" : "inherited",

    override: appliedOverride,
  };
}

/**
 * Resolves the complete policy library for the supplied context.
 */
export function resolvePolicies({
  policies,
  overrides = [],
  context = {},
}: ResolvePoliciesArgs): ResolvedPolicy[] {
  return policies
    .filter((policy) => isPolicyApplicable(policy, context))
    .map((policy) => resolvePolicy(policy, overrides, context));
}

/**
 * Convenient helper when you only need one policy.
 */
export function getResolvedPolicy(
  policyId: string,
  resolvedPolicies: ResolvedPolicy[],
): ResolvedPolicy | undefined {
  return resolvedPolicies.find((policy) => policy.id === policyId);
}

/**
 * Convenient helper when code only needs the resulting value.
 *
 * Example:
 *
 * const minimumPlayers = getResolvedPolicyValue(
 *   "minimum_players",
 *   resolvedPolicies,
 * );
 */
export function getResolvedPolicyValue(
  policyId: string,
  resolvedPolicies: ResolvedPolicy[],
) {
  return getResolvedPolicy(policyId, resolvedPolicies)?.value;
}