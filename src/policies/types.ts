// src/policies/types.ts

// This is the foundation.

export type PolicyLevel =
  | "app"
  | "sport"
  | "organization"
  | "program"
  | "league"
  | "session";

export type PolicyImportance =
  | "required"
  | "organization"
  | "recommended"
  | "optional";

export type PolicyStatus =
  | "configured"
  | "needs_review"
  | "inherited"
  | "overridden"
  | "not_applicable";

export type PolicyCategory =
  | "organization"
  | "integrity"
  | "registration"
  | "payment"
  | "refund"
  | "eligibility"
  | "roster"
  | "attendance"
  | "scheduling"
  | "game_operations"
  | "forfeit"
  | "substitution"
  | "uniform"
  | "equipment"
  | "conduct"
  | "discipline"
  | "safety"
  | "officials"
  | "scorekeepers"
  | "captains"
  | "coaches"
  | "trainers"
  | "admins"
  | "facilities"
  | "standings"
  | "playoffs"
  | "championships"
  | "communication"
  | "camp"
  | "clinic"
  | "training"
  | "tournament"
  | "media"
  | "privacy"
  | "permissions";

export type ProgramType =
  | "mens_league"
  | "womens_league"
  | "adult_league"
  | "youth_league"
  | "kids_league"
  | "camp"
  | "clinic"
  | "training"
  | "tournament"
  | "event";

export type PolicyAudience =
  | "all"
  | "admin"
  | "director"
  | "captain"
  | "player"
  | "parent"
  | "coach"
  | "trainer"
  | "referee"
  | "scorekeeper"
  | "facility_staff";

export type PolicyValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | null;

export type PolicyOption = {
  label: string;
  value: PolicyValue;
};

export type PolicyDefinition = {
  id: string;

  title: string;
  description: string;

  category: PolicyCategory;

  importance: PolicyImportance;

  defaultValue: PolicyValue;

  options?: PolicyOption[];

  audiences: PolicyAudience[];

  applicablePrograms?: ProgramType[];

  sport?: string;

  configurable: boolean;

  allowOverride: boolean;

  helpText?: string;
};

export type PolicyOverride = {
  policyId: string;

  value: PolicyValue;

  level: PolicyLevel;

  organizationId?: string;

  programId?: string;

  leagueId?: string;

  sessionId?: string;

  approvedBy?: string;

  reason?: string;

  updatedAt?: string;
};

export type ResolvedPolicy = PolicyDefinition & {
  value: PolicyValue;

  sourceLevel: PolicyLevel;

  status: PolicyStatus;

  override?: PolicyOverride;
};