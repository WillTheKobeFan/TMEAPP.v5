// src/lib/schedules/publishSchedule.ts

import { saveSchedule } from "./saveSchedule";

type Input = {
  league: string;

  schedule: unknown;
};

export async function publishSchedule(
  input: Input
) {
  await saveSchedule(input);

  return {
    published: true,
  };
}