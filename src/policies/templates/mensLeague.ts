// src/policies/templates/mensLeague.ts

import { ProgramPolicyTemplate } from "./types";

export const mensLeagueTemplate: ProgramPolicyTemplate = {
  id: "mens_league_default",
  name: "Men's League",
  programType: "mens_league",

  description:
    "Recommended policy configuration for organized adult men's league competition.",

  categories: [
    "organization",
    "integrity",
    "registration",
    "payment",
    "refund",
    "eligibility",
    "roster",
    "attendance",
    "scheduling",
    "game_operations",
    "forfeit",
    "substitution",
    "uniform",
    "equipment",
    "conduct",
    "discipline",
    "safety",
    "officials",
    "scorekeepers",
    "captains",
    "admins",
    "facilities",
    "standings",
    "playoffs",
    "championships",
    "communication",
    "media",
    "privacy",
    "permissions",
  ],

  requiredPolicyIds: [
    "staff_integrity",
    "competitive_integrity",
    "registration_required",
    "minimum_players",
    "forfeit_player_threshold",
    "respect_officials_required",
    "respect_scorekeepers_required",
    "respect_facility_staff_required",
    "referee_game_control_authority",
  ],

  surveyPriorityPolicyIds: [
    "registration_types_allowed",
    "registration_grace_period_allowed",
    "registration_extended_grace_allowed",
    "next_session_registration_open_week",
    "next_session_registration_close_week",

    "payment_required_before_session",
    "payment_structures_allowed",
    "payment_methods_allowed",

    "injury_exception_allowed",
    "injury_exception_limit",
    "playoff_participation_requirement",
    "playoff_eligibility_override",
    "playoff_only_players_prohibited",

    "minimum_players",
    "forfeit_player_threshold",
    "forfeit_notice_hours",
    "allow_unofficial_game_after_forfeit",

    "fill_in_players_allowed",
    "official_fill_in_limit",
    "multiple_fill_ins_result",

    "jersey_requirement",
    "team_color_fallback_allowed",
    "jersey_violation_penalty_enabled",

    "referee_shirt_required",
    "official_referee_uniform_required",
    "referee_may_issue_warnings",
    "referee_may_eject_participants",

    "staff_policy_acknowledgement_required",
  ],

  excludedPolicyIds: [],
};