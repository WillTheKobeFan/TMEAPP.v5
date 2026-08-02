// src/hooks/usePublishedSchedule.ts

import { useEffect, useState } from "react";

import { loadSchedule } from "@/lib/schedules/loadSchedule";

import type { PublishedSchedule } from "@/types/schedule";

export function usePublishedSchedule(league: string) {
  const [schedule, setSchedule] =
    useState<PublishedSchedule | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const result = await loadSchedule(league);

        setSchedule(result);
      } catch (err) {
        console.error("Published schedule error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [league]);

  return {
    schedule,
    loading,
  };
}