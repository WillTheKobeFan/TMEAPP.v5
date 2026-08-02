// src/lib/scheduleGenerator/gameSlotHelpers.ts

import type { GameSlot } from "./types";

export function addGameSlot(
  slots: GameSlot[],
  slot: GameSlot
) {
  return [...slots, slot];
}

export function removeGameSlot(
  slots: GameSlot[],
  slotId: string
) {
  return slots.filter((s) => s.id !== slotId);
}

export function updateGameSlot(
  slots: GameSlot[],
  updated: GameSlot
) {
  return slots.map((s) =>
    s.id === updated.id ? updated : s
  );
}

export function applyVenueToAll(
  slots: GameSlot[],
  venue: string
) {
  return slots.map((slot) => ({
    ...slot,
    venue,
  }));
}