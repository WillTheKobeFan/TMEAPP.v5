// src/policies/masterPolicyLibrary.ts

import { PolicyDefinition } from "./types";

export const masterPolicyLibrary: PolicyDefinition[] = [
  // ===========================================================================
  // 01 — ORGANIZATION / INTEGRITY
  // ===========================================================================

  {
    id: "staff_integrity",
    title: "Staff Integrity & Professional Standards",
    description:
      "Staff must act honestly, fairly, professionally, and in the best interest of the organization and its participants.",
    category: "integrity",
    importance: "required",
    defaultValue: true,
    audiences: [
      "admin",
      "director",
      "coach",
      "trainer",
      "referee",
      "scorekeeper",
      "facility_staff",
    ],
    configurable: false,
    allowOverride: false,
  },

  {
    id: "competitive_integrity",
    title: "Competitive Integrity",
    description:
      "Roster, eligibility, scheduling, standings, officiating, and postseason decisions must be administered fairly.",
    category: "integrity",
    importance: "required",
    defaultValue: true,
    audiences: [
      "admin",
      "director",
      "captain",
      "coach",
      "trainer",
      "referee",
      "scorekeeper",
    ],
    configurable: false,
    allowOverride: false,
  },

  {
    id: "staff_policy_acknowledgement_required",
    title: "Staff Policy Acknowledgement",
    description:
      "Staff members must acknowledge applicable organization and role policies before receiving active staff privileges.",
    category: "permissions",
    importance: "recommended",
    defaultValue: true,
    audiences: [
      "admin",
      "director",
      "coach",
      "trainer",
      "referee",
      "scorekeeper",
      "facility_staff",
    ],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 02 — REGISTRATION
  // ===========================================================================

  {
    id: "registration_required",
    title: "Registration Required",
    description:
      "Participants must complete registration before becoming eligible for the applicable program.",
    category: "registration",
    importance: "recommended",
    defaultValue: true,
    audiences: ["all"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "registration_types_allowed",
    title: "Registration Types",
    description:
      "Defines who may complete registration, such as an individual, captain, team, parent, or administrator.",
    category: "registration",
    importance: "organization",
    defaultValue: ["individual"],
    audiences: ["admin", "director", "captain", "player", "parent"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "registration_grace_period_allowed",
    title: "Registration Grace Period",
    description:
      "Determines whether registration may remain available after the normal registration deadline.",
    category: "registration",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "director", "player", "captain", "parent"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "registration_extended_grace_allowed",
    title: "Extended Registration Grace Period",
    description:
      "Determines whether an additional late-registration period may follow the normal grace period.",
    category: "registration",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "director", "player", "captain", "parent"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "next_session_registration_open_week",
    title: "Next Session Registration Opens",
    description:
      "Defines the current-session week when registration may open for the next session.",
    category: "registration",
    importance: "organization",
    defaultValue: null,
    audiences: ["admin", "director"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "next_session_registration_close_week",
    title: "Next Session Registration Closes",
    description:
      "Defines the current-session week when registration closes for the next session.",
    category: "registration",
    importance: "organization",
    defaultValue: null,
    audiences: ["admin", "director"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 03 — PAYMENTS
  // ===========================================================================

  {
    id: "payment_required_before_session",
    title: "Payment Before Participation",
    description:
      "Participants must satisfy the organization's payment requirements before participation.",
    category: "payment",
    importance: "organization",
    defaultValue: true,
    audiences: ["player", "captain", "parent"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "payment_structures_allowed",
    title: "Payment Structures",
    description:
      "Defines the payment structures available, such as full payment, deposit, or payment plan.",
    category: "payment",
    importance: "organization",
    defaultValue: ["paid_in_full"],
    audiences: ["admin", "director", "player", "captain", "parent"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "payment_methods_allowed",
    title: "Payment Methods",
    description:
      "Defines the payment methods accepted by the organization.",
    category: "payment",
    importance: "organization",
    defaultValue: ["other"],
    audiences: ["admin", "director", "player", "captain", "parent"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 04 — ROSTERS / ELIGIBILITY
  // ===========================================================================

  {
    id: "injury_exception_allowed",
    title: "Injury Roster Exception",
    description:
      "Teams may request a roster replacement when an existing participant becomes unavailable because of injury.",
    category: "roster",
    importance: "organization",
    defaultValue: false,
    audiences: ["admin", "director", "captain"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "injury_exception_limit",
    title: "Injury Exception Limit",
    description:
      "Maximum number of injury-exception additions allowed without additional approval.",
    category: "roster",
    importance: "organization",
    defaultValue: 1,
    audiences: ["admin", "director", "captain"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "additional_injury_exception_requires_admin",
    title: "Additional Injury Exception Approval",
    description:
      "Additional injury replacements beyond the normal limit require authorized administrative approval.",
    category: "roster",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "director", "captain"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "playoff_participation_requirement",
    title: "Minimum Regular-Season Participation",
    description:
      "Minimum number of regular-season appearances required for postseason eligibility.",
    category: "eligibility",
    importance: "recommended",
    defaultValue: 3,
    audiences: ["admin", "director", "captain", "player", "referee"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "playoff_participation_requirement_max",
    title: "Maximum Standard Playoff Requirement",
    description:
      "Optional upper standard used when individual leagues require a higher participation minimum.",
    category: "eligibility",
    importance: "optional",
    defaultValue: null,
    audiences: ["admin", "director"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "playoff_eligibility_override",
    title: "Postseason Eligibility Exception",
    description:
      "Authorized administrators may approve postseason eligibility exceptions.",
    category: "eligibility",
    importance: "organization",
    defaultValue: true,
    audiences: ["admin", "director"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "playoff_only_players_prohibited",
    title: "Playoff-Only Players",
    description:
      "Prevents players from joining only for postseason competition without satisfying participation requirements.",
    category: "eligibility",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "director", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 05 — GAME PARTICIPATION / FORFEITS
  // ===========================================================================

  {
    id: "minimum_players",
    title: "Minimum Players for Official Game",
    description:
      "Minimum number of eligible players required for a game to remain official.",
    category: "game_operations",
    importance: "organization",
    defaultValue: 5,
    audiences: ["admin", "director", "captain", "player", "referee"],
    applicablePrograms: [
      "mens_league",
      "womens_league",
      "adult_league",
      "youth_league",
      "kids_league",
    ],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "forfeit_player_threshold",
    title: "Forfeit Player Threshold",
    description:
      "Player-count threshold at which a team is considered unable to field an official team.",
    category: "forfeit",
    importance: "organization",
    defaultValue: 4,
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "forfeit_notice_hours",
    title: "Forfeit Notice Requirement",
    description:
      "Number of hours of advance notice requested before a scheduled forfeit.",
    category: "forfeit",
    importance: "organization",
    defaultValue: 24,
    audiences: ["admin", "director", "captain"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "allow_unofficial_game_after_forfeit",
    title: "Unofficial Game After Forfeit",
    description:
      "Allows teams to play an unofficial game even after the scheduled contest has been recorded as a forfeit.",
    category: "forfeit",
    importance: "optional",
    defaultValue: true,
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 06 — FILL-INS / SUBSTITUTES
  // ===========================================================================

  {
    id: "fill_in_players_allowed",
    title: "Fill-In Players",
    description:
      "Determines whether temporary substitute or fill-in players may participate.",
    category: "substitution",
    importance: "organization",
    defaultValue: false,
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "official_fill_in_limit",
    title: "Official Fill-In Limit",
    description:
      "Maximum number of fill-in players permitted while keeping the contest official.",
    category: "substitution",
    importance: "organization",
    defaultValue: 0,
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "multiple_fill_ins_result",
    title: "Multiple Fill-In Result",
    description:
      "Defines how a contest is classified when a team exceeds the official fill-in limit.",
    category: "substitution",
    importance: "organization",
    defaultValue: "forfeit",
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 07 — UNIFORMS
  // ===========================================================================

  {
    id: "jersey_requirement",
    title: "Jersey Requirement",
    description:
      "Defines whether assigned jerseys or uniforms are required, preferred, or league-configurable.",
    category: "uniform",
    importance: "organization",
    defaultValue: "preferred",
    audiences: ["admin", "director", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "team_color_fallback_allowed",
    title: "Team Color Fallback",
    description:
      "Allows players without an assigned jersey to wear the team's designated color when permitted.",
    category: "uniform",
    importance: "optional",
    defaultValue: true,
    audiences: ["admin", "director", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "jersey_violation_penalty_enabled",
    title: "Jersey Violation Penalties",
    description:
      "Allows an organization or league to apply penalties when required jerseys are not worn.",
    category: "uniform",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "director", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 08 — OFFICIALS
  // ===========================================================================

  {
    id: "referee_shirt_required",
    title: "Referee Shirt Required",
    description:
      "Requires referees to wear identifiable referee attire while officiating.",
    category: "officials",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "director", "referee"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "official_referee_uniform_required",
    title: "Formal Referee Uniform",
    description:
      "Determines whether a formal association, school, or professional-style referee uniform is required.",
    category: "officials",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "director", "referee"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "referee_game_control_authority",
    title: "Referee Game Control",
    description:
      "Authorizes officials to control the contest and enforce applicable game and conduct rules.",
    category: "officials",
    importance: "required",
    defaultValue: true,
    audiences: ["admin", "director", "captain", "player", "referee"],
    configurable: false,
    allowOverride: false,
  },

  {
    id: "referee_may_issue_warnings",
    title: "Referee Warnings",
    description:
      "Allows officials to issue verbal or formal warnings when appropriate.",
    category: "officials",
    importance: "recommended",
    defaultValue: true,
    audiences: ["referee", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "referee_may_eject_participants",
    title: "Referee Ejection Authority",
    description:
      "Allows referees to remove participants from a contest when conduct or game rules warrant removal.",
    category: "officials",
    importance: "recommended",
    defaultValue: true,
    audiences: ["referee", "captain", "player"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 09 — CONDUCT
  // ===========================================================================

  {
    id: "respect_officials_required",
    title: "Respect Officials",
    description:
      "Participants are expected to treat referees and officials respectfully.",
    category: "conduct",
    importance: "required",
    defaultValue: true,
    audiences: ["all"],
    configurable: false,
    allowOverride: false,
  },

  {
    id: "respect_scorekeepers_required",
    title: "Respect Scorekeepers",
    description:
      "Participants are expected to treat scorekeepers and game-table staff respectfully.",
    category: "conduct",
    importance: "required",
    defaultValue: true,
    audiences: ["all"],
    configurable: false,
    allowOverride: false,
  },

  {
    id: "respect_facility_staff_required",
    title: "Respect Facility Staff",
    description:
      "Participants are expected to treat facility employees and operators respectfully.",
    category: "conduct",
    importance: "required",
    defaultValue: true,
    audiences: ["all"],
    configurable: false,
    allowOverride: false,
  },

  // ===========================================================================
  // 10 — TRAINING
  // ===========================================================================

  {
    id: "training_attendance_required",
    title: "Training Attendance",
    description:
      "Defines whether participants are expected to attend scheduled training sessions.",
    category: "training",
    importance: "organization",
    defaultValue: true,
    audiences: ["admin", "director", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_late_arrival_policy",
    title: "Late Arrival Policy",
    description:
      "Defines how late arrivals to scheduled training sessions are handled.",
    category: "training",
    importance: "organization",
    defaultValue: "allowed_with_notice",
    options: [
      {
        label: "Allowed",
        value: "allowed",
      },
      {
        label: "Allowed With Notice",
        value: "allowed_with_notice",
      },
      {
        label: "May Shorten Session",
        value: "session_shortened",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_cancellation_notice_hours",
    title: "Training Cancellation Notice",
    description:
      "Number of hours of advance notice requested when cancelling a training session.",
    category: "training",
    importance: "organization",
    defaultValue: 24,
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_no_show_policy",
    title: "Training No-Show Policy",
    description:
      "Defines how missed training sessions without notice are handled.",
    category: "training",
    importance: "organization",
    defaultValue: "session_forfeited",
    options: [
      {
        label: "Session Forfeited",
        value: "session_forfeited",
      },
      {
        label: "Makeup Allowed",
        value: "makeup_allowed",
      },
      {
        label: "Fee Charged",
        value: "fee_charged",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_makeup_sessions_allowed",
    title: "Makeup Training Sessions",
    description:
      "Determines whether missed training sessions may be rescheduled.",
    category: "training",
    importance: "organization",
    defaultValue: true,
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_session_type",
    title: "Training Session Type",
    description:
      "Defines whether training is offered individually, in groups, or both.",
    category: "training",
    importance: "organization",
    defaultValue: ["individual", "group"],
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_group_size_limit",
    title: "Training Group Size",
    description:
      "Maximum number of participants normally allowed in a group training session.",
    category: "training",
    importance: "organization",
    defaultValue: null,
    audiences: ["admin", "trainer"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_drop_ins_allowed",
    title: "Training Drop-Ins",
    description:
      "Determines whether participants may attend individual training sessions without purchasing a package.",
    category: "training",
    importance: "optional",
    defaultValue: true,
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_package_required",
    title: "Training Package Requirement",
    description:
      "Determines whether participants must purchase a multi-session training package.",
    category: "training",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_required_equipment",
    title: "Training Equipment",
    description:
      "Defines whether participants must bring specific equipment to training.",
    category: "equipment",
    importance: "organization",
    defaultValue: [],
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_injury_reporting_required",
    title: "Training Injury Reporting",
    description:
      "Requires injuries or safety incidents occurring during training to be reported to the appropriate staff.",
    category: "safety",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "trainer_policy_acknowledgement_required",
    title: "Trainer Policy Acknowledgement",
    description:
      "Requires trainers to acknowledge applicable organization and training policies.",
    category: "trainers",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "trainer"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "training_schedule_change_notice",
    title: "Training Schedule Changes",
    description:
      "Defines how participants should be notified when a scheduled training session changes.",
    category: "communication",
    importance: "recommended",
    defaultValue: "notify_participants",
    audiences: ["admin", "trainer", "player", "parent"],
    applicablePrograms: ["training"],
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // 11 — CLINIC
  // ===========================================================================

  {
    id: "clinic_capacity_limit",
    title: "Clinic Capacity",
    description:
      "Maximum number of participants allowed to register for the clinic.",
    category: "clinic",
    importance: "organization",
    defaultValue: null,
    audiences: ["admin", "director", "coach", "trainer"],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_waitlist_enabled",
    title: "Clinic Waitlist",
    description:
      "Determines whether a waitlist is created when clinic capacity is reached.",
    category: "clinic",
    importance: "recommended",
    defaultValue: true,
    audiences: ["admin", "director", "player", "parent"],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_age_requirement",
    title: "Clinic Age Requirement",
    description:
      "Defines any age or age-group requirements for clinic participation.",
    category: "eligibility",
    importance: "organization",
    defaultValue: null,
    audiences: ["admin", "director", "player", "parent"],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_skill_level",
    title: "Clinic Skill Level",
    description:
      "Defines the intended participant skill level for the clinic.",
    category: "clinic",
    importance: "optional",
    defaultValue: "all_levels",
    options: [
      {
        label: "All Levels",
        value: "all_levels",
      },
      {
        label: "Beginner",
        value: "beginner",
      },
      {
        label: "Intermediate",
        value: "intermediate",
      },
      {
        label: "Advanced",
        value: "advanced",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: [
      "admin",
      "director",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_attendance_required",
    title: "Clinic Attendance",
    description:
      "Defines whether attendance is tracked for clinic participants.",
    category: "attendance",
    importance: "organization",
    defaultValue: true,
    audiences: [
      "admin",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_late_arrival_policy",
    title: "Clinic Late Arrival",
    description:
      "Defines how late arrival to clinic sessions is handled.",
    category: "clinic",
    importance: "organization",
    defaultValue: "allowed",
    audiences: [
      "admin",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_no_show_policy",
    title: "Clinic No-Show Policy",
    description:
      "Defines how missed clinic sessions without notice are handled.",
    category: "clinic",
    importance: "organization",
    defaultValue: "no_makeup",
    options: [
      {
        label: "No Makeup",
        value: "no_makeup",
      },
      {
        label: "Makeup Allowed",
        value: "makeup_allowed",
      },
      {
        label: "Credit Allowed",
        value: "credit_allowed",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: [
      "admin",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_makeup_allowed",
    title: "Clinic Makeup Sessions",
    description:
      "Determines whether missed clinic participation may be made up during another eligible session.",
    category: "clinic",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "player", "parent"],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_drop_ins_allowed",
    title: "Clinic Drop-Ins",
    description:
      "Determines whether participants may attend without completing the normal full clinic registration.",
    category: "clinic",
    importance: "optional",
    defaultValue: false,
    audiences: ["admin", "director", "player", "parent"],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_required_equipment",
    title: "Clinic Equipment",
    description:
      "Defines equipment participants are expected to bring to the clinic.",
    category: "equipment",
    importance: "organization",
    defaultValue: [],
    audiences: [
      "admin",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_instructor_ratio",
    title: "Participant-to-Instructor Ratio",
    description:
      "Defines the preferred or maximum participant-to-instructor ratio.",
    category: "clinic",
    importance: "optional",
    defaultValue: null,
    audiences: [
      "admin",
      "director",
      "coach",
      "trainer",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_injury_reporting_required",
    title: "Clinic Injury Reporting",
    description:
      "Requires injuries and safety incidents during a clinic to be reported.",
    category: "safety",
    importance: "recommended",
    defaultValue: true,
    audiences: [
      "admin",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },

  {
    id: "clinic_schedule_change_notice",
    title: "Clinic Schedule Changes",
    description:
      "Defines how registered participants are notified when clinic dates, times, or locations change.",
    category: "communication",
    importance: "recommended",
    defaultValue: "notify_participants",
    audiences: [
      "admin",
      "director",
      "coach",
      "trainer",
      "player",
      "parent",
    ],
    applicablePrograms: ["clinic"],
    configurable: true,
    allowOverride: true,
  },
];