// src/policies/organizations/tme.ts

import { PolicyOverride } from "../types";

export const TME_ORGANIZATION_ID = "tme";

/**
 * TME Social Sports
 *
 * Organization-level policy overrides.
 *
 * These values override the master policy library and sport/program
 * defaults when the active organization is TME.
 *
 * League/session-specific differences should NOT be placed here.
 * Those can be added separately as league/session overrides.
 */
export const tmePolicyOverrides: PolicyOverride[] = [
  // ---------------------------------------------------------------------------
  // REGISTRATION
  // ---------------------------------------------------------------------------

  {
    policyId: "registration_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason: "TME requires participants to register for league participation.",
  },

  {
    policyId: "registration_types_allowed",
    value: ["individual", "captain", "team"],
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Players may register individually, while captains may register themselves or teams.",
  },

  {
    policyId: "registration_grace_period_allowed",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "registration_extended_grace_allowed",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "next_session_registration_open_week",
    value: 2,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "TME generally begins accepting registration for the next session around Weeks 1–2.",
  },

  {
    policyId: "next_session_registration_close_week",
    value: 6,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "TME generally closes next-session registration around Week 6 unless otherwise announced.",
  },

  // ---------------------------------------------------------------------------
  // PAYMENTS
  // ---------------------------------------------------------------------------

  {
    policyId: "payment_required_before_session",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "payment_structures_allowed",
    value: ["paid_in_full", "payment_plan"],
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "payment_methods_allowed",
    value: ["venmo", "cash_app", "cash", "other"],
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  // ---------------------------------------------------------------------------
  // PLAYER COUNT / GAME ELIGIBILITY
  // ---------------------------------------------------------------------------

  {
    policyId: "minimum_players",
    value: 4,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason: "TME games may officially be played with four eligible players.",
  },

  {
    policyId: "forfeit_player_threshold",
    value: 3,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "A team with only three eligible players is subject to the TME forfeit rule.",
  },

  // ---------------------------------------------------------------------------
  // FILL-INS / SUBSTITUTE PLAYERS
  // ---------------------------------------------------------------------------

  {
    policyId: "fill_in_players_allowed",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "official_fill_in_limit",
    value: 1,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "A team may use one fill-in while keeping the game eligible to count officially.",
  },

  {
    policyId: "multiple_fill_ins_result",
    value: "unofficial_game",
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "When two fill-in players are required, the teams may still play, but the game does not count as an official result.",
  },

  // ---------------------------------------------------------------------------
  // FORFEITS
  // ---------------------------------------------------------------------------

  {
    policyId: "forfeit_notice_hours",
    value: 24,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Teams should notify league administration at least 24 hours before a scheduled game when forfeiting.",
  },

  {
    policyId: "allow_unofficial_game_after_forfeit",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  // ---------------------------------------------------------------------------
  // ROSTERS / INJURY EXCEPTIONS
  // ---------------------------------------------------------------------------

  {
    policyId: "injury_exception_allowed",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "injury_exception_limit",
    value: 1,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Captains may request one injury-exception addition. Additional exceptions require administrative or league-owner approval.",
  },

  {
    policyId: "additional_injury_exception_requires_admin",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  // ---------------------------------------------------------------------------
  // PLAYOFF ELIGIBILITY / COMPETITIVE INTEGRITY
  // ---------------------------------------------------------------------------

  {
    policyId: "playoff_participation_requirement",
    value: 3,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Players generally must participate in at least three regular-season games to qualify for postseason play.",
  },

  {
    policyId: "playoff_participation_requirement_max",
    value: 4,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Certain TME leagues may require four regular-season appearances.",
  },

  {
    policyId: "playoff_eligibility_override",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "League owners or authorized administrators may approve eligibility exceptions.",
  },

  {
    policyId: "playoff_only_players_prohibited",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "TME postseason eligibility rules are intended to prevent teams from adding players only for playoffs and gaining an unfair competitive advantage.",
  },

  // ---------------------------------------------------------------------------
  // BASKETBALL FOUL RULES
  // ---------------------------------------------------------------------------

  {
    policyId: "basketball_foul_limit",
    value: 5,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "basketball_after_foul_limit",
    value: "continue_with_technical_penalty",
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "After five fouls, the player may leave the game or continue playing under TME's additional-foul technical penalty rule.",
  },

  {
    policyId: "basketball_team_may_continue_with_four",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "basketball_flopping_rule",
    value: "normal_play",
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "No separate flopping penalty is applied unless specified by the league owner.",
  },

  {
    policyId: "basketball_transition_take_foul",
    value: "normal_foul",
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "Transition take fouls are handled under normal foul rules unless otherwise specified by the league owner.",
  },

  // ---------------------------------------------------------------------------
  // JERSEYS / UNIFORMS
  // ---------------------------------------------------------------------------

  {
    policyId: "jersey_requirement",
    value: "league_configurable",
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "TME jersey enforcement varies by league/session and should be configurable at the league level.",
  },

  {
    policyId: "team_color_fallback_allowed",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "When formal jerseys are not being strictly enforced, players should at minimum attempt to wear the team's assigned color.",
  },

  {
    policyId: "jersey_violation_penalty_enabled",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "League-specific penalties may be applied when jerseys are explicitly required.",
  },

  // ---------------------------------------------------------------------------
  // REFEREES / OFFICIALS
  // ---------------------------------------------------------------------------

  {
    policyId: "referee_shirt_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "TME referees must at minimum wear an identifiable referee shirt.",
  },

  {
    policyId: "official_referee_uniform_required",
    value: false,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
    reason:
      "A formal high-school, college, or association referee uniform is not required unless specifically mandated.",
  },

  {
    policyId: "referee_game_control_authority",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "referee_may_issue_warnings",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "referee_may_eject_participants",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  // ---------------------------------------------------------------------------
  // CONDUCT / STAFF / INTEGRITY
  // ---------------------------------------------------------------------------

  {
    policyId: "competitive_integrity",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "staff_integrity",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "staff_policy_acknowledgement_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "respect_officials_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "respect_scorekeepers_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },

  {
    policyId: "respect_facility_staff_required",
    value: true,
    level: "organization",
    organizationId: TME_ORGANIZATION_ID,
  },
];

/**
 * League-level overrides belong here rather than in the main
 * organization-level array.
 *
 * We can expand this when we configure Sunday, Monday and Wednesday
 * independently.
 */
export const tmeLeaguePolicyOverrides: PolicyOverride[] = [
  // Example:
  //
  // {
  //   policyId: "playoff_participation_requirement",
  //   value: 4,
  //   level: "league",
  //   organizationId: TME_ORGANIZATION_ID,
  //   leagueId: "sunday",
  // },
];

/**
 * Combined export for places where we want every currently-defined
 * TME override in one array.
 */
export const allTmePolicyOverrides: PolicyOverride[] = [
  ...tmePolicyOverrides,
  ...tmeLeaguePolicyOverrides,
];