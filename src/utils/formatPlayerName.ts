// src/utils/formatPlayerName.ts

import type { TeamPlayer } from "@/types/teamCard";

export function formatPlayerName(player: TeamPlayer) {
  return player.lastInitial
    ? `${player.firstName} ${player.lastInitial}.`
    : player.firstName;
}