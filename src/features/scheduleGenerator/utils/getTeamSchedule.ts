// src/features/scheduleGenerator/utils/getTeamSchedule.ts

import type {
  GeneratedSchedule,
  ScheduleGame,
} from "../types";

export type TeamScheduleItem =
  | {
      type: "game";
      week: number;
      game: ScheduleGame;
      opponentId: string;
      isHome: boolean;
    }
  | {
      type: "bye";
      week: number;
      teamId: string;
    };

export function getTeamSchedule(
  schedule: GeneratedSchedule,
  teamId: string
): TeamScheduleItem[] {
  const items: TeamScheduleItem[] = [];

  for (const week of schedule.weeks) {
    const game = week.games.find(
      (item) =>
        item.homeTeamId === teamId ||
        item.awayTeamId === teamId
    );

    if (game) {
      items.push({
        type: "game",
        week: week.week,
        game,
        opponentId:
          game.homeTeamId === teamId
            ? game.awayTeamId
            : game.homeTeamId,
        isHome:
          game.homeTeamId === teamId,
      });

      continue;
    }

    if (week.byes.includes(teamId)) {
      items.push({
        type: "bye",
        week: week.week,
        teamId,
      });
    }
  }

  return items;
}