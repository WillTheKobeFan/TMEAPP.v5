// src/policies/getPoliciesForProgram.ts

import { ProgramPolicyTemplate } from "./templates/types";
import { PolicyDefinition } from "./types";

type GetPoliciesForProgramArgs = {
  policies: PolicyDefinition[];
  template: ProgramPolicyTemplate;
};

export function getPoliciesForProgram({
  policies,
  template,
}: GetPoliciesForProgramArgs): PolicyDefinition[] {
  const excluded = new Set<string>(
    template.excludedPolicyIds ?? [],
  );

  const required = new Set<string>(
    template.requiredPolicyIds,
  );

  return policies.filter(
    (policy: PolicyDefinition): boolean => {
      // Explicit exclusion always wins.
      if (excluded.has(policy.id)) {
        return false;
      }

      // Explicitly required policies always stay.
      if (required.has(policy.id)) {
        return true;
      }

      // Policy explicitly applies to this program.
      if (
        policy.applicablePrograms?.includes(
          template.programType,
        )
      ) {
        return true;
      }

      // Policy has program restrictions and this
      // program isn't included.
      if (
        policy.applicablePrograms?.length &&
        !policy.applicablePrograms.includes(
          template.programType,
        )
      ) {
        return false;
      }

      // Otherwise determine applicability by category.
      return template.categories.includes(
        policy.category,
      );
    },
  );
}