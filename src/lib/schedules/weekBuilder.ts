// src/lib/schedules/weekBuilder.ts

import { LeagueNight, ScheduleGame, Team, GameType } from "./types";

export function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function addWeeks(dateString: string, weeksToAdd: number) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + weeksToAdd * 7);
  return formatDate(date);
}

export function getMatchupKey(team1Id: string, team2Id: string) {
  return [team1Id, team2Id].sort().join("___");
}

export function makeGameId(
  league: LeagueNight,
  week: number,
  index: number,
  type: GameType = "regular"
) {
  return `${league.toLowerCase()}_w${week}_${type}_g${index + 1}`;
}

export function buildGame(params: {
  league: LeagueNight;
  week: number;
  date: string;
  time: string;
  team1: Team;
  team2: Team;
  index: number;
  type?: GameType;
}): ScheduleGame {
  return {
    id: makeGameId(
      params.league,
      params.week,
      params.index,
      params.type ?? "regular"
    ),
    week: params.week,
    date: params.date,
    time: params.time,
    team1: params.team1,
    team2: params.team2,
    type: params.type ?? "regular",
  };
}