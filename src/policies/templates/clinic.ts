// src/policies/templates/clinic.ts

import { ProgramPolicyTemplate } from "./types";

export const clinicTemplate: ProgramPolicyTemplate = {
  id: "clinic_default",

  name: "Clinic",

  programType: "clinic",

  description:
    "Recommended policy configuration for instructional sports clinics and short-form development programs.",

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

    "clinic",

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

    // Capacity / eligibility
    "clinic_capacity_limit",
    "clinic_waitlist_enabled",
    "clinic_age_requirement",
    "clinic_skill_level",

    // Payment
    "payment_required_before_session",
    "payment_structures_allowed",
    "payment_methods_allowed",

    // Attendance
    "clinic_attendance_required",
    "clinic_late_arrival_policy",
    "clinic_no_show_policy",
    "clinic_makeup_allowed",

    // Structure
    "clinic_drop_ins_allowed",
    "clinic_required_equipment",
    "clinic_instructor_ratio",

    // Safety
    "clinic_injury_reporting_required",

    // Communication
    "clinic_schedule_change_notice",
  ],

  excludedPolicyIds: [
    // League competition
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

    // Officials
    "referee_shirt_required",
    "official_referee_uniform_required",
    "referee_game_control_authority",
    "referee_may_issue_warnings",
    "referee_may_eject_participants",

    // Basketball competition rules
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

    // Training-only configuration
    "training_attendance_required",
    "training_late_arrival_policy",
    "training_cancellation_notice_hours",
    "training_no_show_policy",
    "training_makeup_sessions_allowed",
    "training_session_type",
    "training_group_size_limit",
    "training_drop_ins_allowed",
    "training_package_required",
    "training_required_equipment",
    "training_injury_reporting_required",
    "trainer_policy_acknowledgement_required",
    "training_schedule_change_notice",
  ],
};