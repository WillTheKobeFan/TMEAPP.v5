// src/features/scheduleGenerator/hooks/useSchedulePipeline.ts

import { useState } from "react";

import {
  generateSchedule,
} from "../utils/generateSchedule";

import {
  validateSchedule,
} from "../utils/validateSchedule";

import {
  buildGeneratedSeason,
  type BuiltSeason,
} from "../services/buildGeneratedSeason";

import {
  publishGeneratedSchedule,
} from "../services/publishGeneratedSchedule";

import type {
  GenerateScheduleInput,
  GeneratedSchedule,
  ValidationResult,
} from "../types";

export function useSchedulePipeline() {
  const [
    schedule,
    setSchedule,
  ] = useState<GeneratedSchedule | null>(null);

  const [
    validation,
    setValidation,
  ] = useState<ValidationResult | null>(null);

  const [
    builtSeason,
    setBuiltSeason,
  ] = useState<BuiltSeason | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    publishing,
    setPublishing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const generate = async (
    input: GenerateScheduleInput
  ) => {
    try {
      setLoading(true);
      setError(null);

      const generated =
        generateSchedule(input);

      const validationResult =
        validateSchedule(generated);

      const built =
        buildGeneratedSeason({
          schedule: generated,
        });

      setSchedule(generated);
      setValidation(validationResult);
      setBuiltSeason(built);

      return {
        generated,
        validationResult,
        built,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate schedule";

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    if (publishing) {
      return null;
    }

    try {
      setPublishing(true);
      setError(null);

      if (!builtSeason) {
        throw new Error(
          "No built season available"
        );
      }

      if (!validation?.isValid) {
        throw new Error(
          "Invalid schedule"
        );
      }

      const published =
        await publishGeneratedSchedule(
          builtSeason
        );

      return published;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to publish schedule";

      setError(message);

      return null;
    } finally {
      setPublishing(false);
    }
  };

  const reset = () => {
    setSchedule(null);
    setValidation(null);
    setBuiltSeason(null);
    setError(null);
  };

  const canPublish =
    !!builtSeason &&
    !!validation?.isValid &&
    (schedule?.games.length ?? 0) > 0 &&
    !publishing;

  return {
    schedule,
    validation,
    builtSeason,

    loading,
    publishing,
    error,

    generate,
    publish,
    reset,

    canPublish,
  };
}