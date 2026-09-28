// src/policies/templates/types.ts

import {
  PolicyCategory,
  ProgramType,
} from "../types";

export type ProgramPolicyTemplate = {
  id: string;

  name: string;

  programType: ProgramType;

  description: string;

  categories: PolicyCategory[];

  requiredPolicyIds: string[];

  surveyPriorityPolicyIds: string[];

  excludedPolicyIds?: string[];
};