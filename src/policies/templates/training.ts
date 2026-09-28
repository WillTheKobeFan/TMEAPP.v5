// src/policies/templates/training.ts

import { ProgramPolicyTemplate } from "./types";

export const trainingTemplate: ProgramPolicyTemplate = {
  id: "training_default",

  name: "Training",

  programType: "training",

  description:
    "Recommended policy configuration for individual and group sports training programs.",

  categories: [
    "organization",
    "integrity",

    "registration",
    "payment",
    "refund",

    "eligibility",
    "attendance",
    "scheduling",

    "equipment",

    "conduct",
    "discipline",
    "safety",

    "coaches",
    "trainers",
    "admins",

    "facilities",

    "communication",

    "training",

    "media",
    "privacy",

    "permissions",
  ],

  requiredPolicyIds: [
    "staff_integrity",

    "registration_required",

    "respect_facility_staff_required",

    "staff_policy_acknowledgement_required",
  ],

  surveyPriorityPolicyIds: [
    // Registration
    "registration_required",
    "registration_types_allowed",
    "registration_grace_period_allowed",

    // Payment
    "payment_required_before_session",
    "payment_structures_allowed",
    "payment_methods_allowed",

    // Attendance / Scheduling
    "training_attendance_required",
    "training_late_arrival_policy",
    "training_cancellation_notice_hours",
    "training_no_show_policy",
    "training_makeup_sessions_allowed",

    // Training Structure
    "training_session_type",
    "training_group_size_limit",
    "training_drop_ins_allowed",
    "training_package_required",

    // Safety / Equipment
    "training_required_equipment",
    "training_injury_reporting_required",

    // Staff
    "trainer_policy_acknowledgement_required",

    // Communication
    "training_schedule_change_notice",
  ],

  /**
   * These are competition-specific policies and normally
   * should never appear in a training program.
   */
  excludedPolicyIds: [
    "minimum_players",
    "forfeit_player_threshold",
    "forfeit_notice_hours",
    "allow_unofficial_game_after_forfeit",

    "fill_in_players_allowed",
    "official_fill_in_limit",
    "multiple_fill_ins_result",

    "playoff_participation_requirement",
    "playoff_participation_requirement_max",
    "playoff_eligibility_override",
    "playoff_only_players_prohibited",

    "jersey_violation_penalty_enabled",

    "referee_shirt_required",
    "official_referee_uniform_required",
    "referee_game_control_authority",
    "referee_may_issue_warnings",
    "referee_may_eject_participants",

    "basketball_foul_limit",
    "basketball_after_foul_limit",
    "basketball_team_may_continue_with_four",
    "basketball_flopping_rule",
    "basketball_transition_take_foul",
    "basketball_technical_foul_enabled",
    "basketball_technical_ejection_threshold",
    "basketball_fighting_ejection",
    "basketball_overtime_rule",
    "basketball_mercy_rule_enabled",
    "basketball_timeout_rule",
  ],
};