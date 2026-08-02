// src/lib/schedules/scheduleGeneratorService.ts

import type {
  ChampionshipCarryover,
  LeagueNight,
  ScheduleWeek,
  Team,
  TeamConstraint,
  ValidationResult,
} from "./types";

import { buildSundaySchedule } from "./sundayGenerator";
import { buildWeeknightSchedule } from "./MondayTuesdayWednesdayGenerator";
import { validateSchedule } from "./validation";

const MAX_VALID_GENERATION_ATTEMPTS = 500;

type GenerateScheduleInput = {
  league: LeagueNight;
  teams: Team[];
  startDate: string;
  constraints: TeamConstraint[];
  championshipCarryover?: ChampionshipCarryover;
  seed?: number;
  forceNew?: boolean;
};

type GenerateScheduleResult = {
  weeks: ScheduleWeek[];
  validation: ValidationResult;
  attemptsUsed: number;
};

const getIssueCount = (validation: ValidationResult) =>
  validation.errors.length + validation.warnings.length;

const failureResult = (
  message: string,
  attemptsUsed: number
): GenerateScheduleResult => ({
  weeks: [],
  attemptsUsed,
  validation: {
    valid: false,
    errors: [message],
    warnings: [],
  },
});

const buildValidationError = (message: string): ValidationResult => ({
  valid: false,
  errors: [message],
  warnings: [],
});

function buildWeeks(input: GenerateScheduleInput): ScheduleWeek[] {
  if (input.league === "Sunday") {
    if (!input.championshipCarryover?.enabled) {
      throw new Error("Sunday requires championship carryover to be enabled.");
    }

    return buildSundaySchedule({
      teams: input.teams,
      startDate: input.startDate,
      championship: {
        team1Id: input.championshipCarryover.team1Id,
        team2Id: input.championshipCarryover.team2Id,
        time: input.championshipCarryover.time as any,
      },
    });
  }

  return buildWeeknightSchedule({
    league: input.league,
    teams: input.teams,
    startDate: input.startDate,
    constraints: input.constraints,
  });
}

export function generateSchedule(
  input: GenerateScheduleInput
): GenerateScheduleResult {
  let bestWeeks: ScheduleWeek[] = [];
  let bestValidation: ValidationResult | null = null;
  let lastErrorMessage = "";

  for (let attempt = 1; attempt <= MAX_VALID_GENERATION_ATTEMPTS; attempt++) {
    try {
      const weeks = buildWeeks(input);

      const validation = validateSchedule({
        league: input.league,
        weeks,
        teams: input.teams,
      });

      if (!bestValidation || getIssueCount(validation) < getIssueCount(bestValidation)) {
        bestWeeks = weeks;
        bestValidation = validation;
      }

      if (validation.valid) {
        return {
          weeks,
          validation,
          attemptsUsed: attempt,
        };
      }
    } catch (error) {
      lastErrorMessage =
        error instanceof Error ? error.message : "Generation failed.";

      const errorValidation = buildValidationError(lastErrorMessage);

      if (
        !bestValidation ||
        getIssueCount(errorValidation) < getIssueCount(bestValidation)
      ) {
        bestWeeks = [];
        bestValidation = errorValidation;
      }
    }
  }

  if (bestValidation) {
    const baseErrors = bestValidation.errors.length
      ? bestValidation.errors
      : [lastErrorMessage || "No valid schedule found."];

    return {
      weeks: bestWeeks,
      validation: {
        valid: false,
        errors: [
          "Could not generate a fully valid schedule with the current constraints.",
          ...baseErrors,
        ],
        warnings: bestValidation.warnings,
      },
      attemptsUsed: MAX_VALID_GENERATION_ATTEMPTS,
    };
  }

  return failureResult(
    "Could not generate a schedule with the current constraints.",
    MAX_VALID_GENERATION_ATTEMPTS
  );
}