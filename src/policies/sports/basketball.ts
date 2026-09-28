// src/policies/sports/basketball.ts

import { PolicyDefinition } from "../types";

const BASKETBALL_LEAGUES = [
  "mens_league",
  "womens_league",
  "adult_league",
  "youth_league",
  "kids_league",
] as const;

export const basketballPolicies: PolicyDefinition[] = [
  // ===========================================================================
  // GAME STRUCTURE
  // ===========================================================================

  {
    id: "basketball_foul_limit",
    title: "Personal Foul Limit",
    description:
      "Number of personal fouls a player may accumulate before the league's foul-limit procedure applies.",
    category: "game_operations",
    importance: "organization",
    defaultValue: 5,
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_after_foul_limit",
    title: "Procedure After Foul Limit",
    description:
      "Defines what happens when a player reaches the league's personal foul limit.",
    category: "game_operations",
    importance: "organization",
    defaultValue: "player_removed",
    options: [
      {
        label: "Player Fouls Out",
        value: "player_removed",
      },
      {
        label: "Player May Continue With Additional Penalty",
        value: "continue_with_additional_penalty",
      },
      {
        label: "Player May Continue With Technical Penalty",
        value: "continue_with_technical_penalty",
      },
      {
        label: "Custom Rule",
        value: "custom",
      },
    ],
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_team_may_continue_with_four",
    title: "Continue With Four Players",
    description:
      "Determines whether a team may continue an official contest with four eligible players.",
    category: "game_operations",
    importance: "organization",
    defaultValue: true,
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // OFFICIATING / HOUSE RULES
  // ===========================================================================

  {
    id: "basketball_flopping_rule",
    title: "Flopping Rule",
    description:
      "Determines whether the league applies a special warning or penalty for flopping.",
    category: "game_operations",
    importance: "optional",
    defaultValue: "normal_play",
    options: [
      {
        label: "No Special Penalty",
        value: "normal_play",
      },
      {
        label: "Warning",
        value: "warning",
      },
      {
        label: "Technical / Penalty",
        value: "technical",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_transition_take_foul",
    title: "Transition Take Foul",
    description:
      "Determines whether transition take fouls are treated as normal fouls or receive a special penalty.",
    category: "game_operations",
    importance: "optional",
    defaultValue: "normal_foul",
    options: [
      {
        label: "Normal Foul",
        value: "normal_foul",
      },
      {
        label: "Special Take-Foul Penalty",
        value: "special_penalty",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  // ===========================================================================
  // TECHNICALS / DISCIPLINE
  // ===========================================================================

  {
    id: "basketball_technical_foul_enabled",
    title: "Technical Fouls",
    description:
      "Allows officials to assess technical fouls according to the organization's basketball rules.",
    category: "discipline",
    importance: "recommended",
    defaultValue: true,
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_technical_ejection_threshold",
    title: "Technical Foul Ejection Threshold",
    description:
      "Number of technical fouls that results in automatic removal from the contest.",
    category: "discipline",
    importance: "organization",
    defaultValue: 2,
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_fighting_ejection",
    title: "Fighting Ejection",
    description:
      "Determines whether fighting or physical altercations result in immediate ejection.",
    category: "discipline",
    importance: "required",
    defaultValue: true,
    audiences: ["player", "captain", "referee"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: false,
    allowOverride: false,
  },

  // ===========================================================================
  // GAME FORMAT
  // ===========================================================================

  {
    id: "basketball_overtime_rule",
    title: "Overtime Rule",
    description:
      "Defines how tied games are handled after regulation.",
    category: "game_operations",
    importance: "organization",
    defaultValue: "overtime",
    options: [
      {
        label: "Play Overtime",
        value: "overtime",
      },
      {
        label: "Sudden Death",
        value: "sudden_death",
      },
      {
        label: "Tie Allowed",
        value: "tie_allowed",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ],
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_mercy_rule_enabled",
    title: "Mercy Rule",
    description:
      "Determines whether the league uses an accelerated-clock or mercy procedure when the score margin reaches a configured level.",
    category: "game_operations",
    importance: "optional",
    defaultValue: false,
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },

  {
    id: "basketball_timeout_rule",
    title: "Timeout Rules",
    description:
      "Defines the league's timeout structure and any game-specific restrictions.",
    category: "game_operations",
    importance: "organization",
    defaultValue: "league_configurable",
    audiences: ["player", "captain", "referee", "scorekeeper"],
    applicablePrograms: [...BASKETBALL_LEAGUES],
    sport: "basketball",
    configurable: true,
    allowOverride: true,
  },
];