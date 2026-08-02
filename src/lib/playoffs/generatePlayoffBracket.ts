// src/lib/playoffs/generatePlayoffBracket.ts

import type { RawGame } from "@/types/firebaseSchedule";

type PlayoffTeam = {
  teamId: string;
  seed: number;
};

type GeneratePlayoffBracketParams = {
  leagueNight: string;
  seasonId: string;
  week: number;
  date: string;
  teams: PlayoffTeam[];
};

export function generatePlayoffBracket({
  leagueNight,
  seasonId,
  week,
  date,
  teams,
}: GeneratePlayoffBracketParams): RawGame[] {
  const sortedTeams = [...teams].sort(
    (a, b) => a.seed - b.seed
  );

  const matchups = [
    [sortedTeams[0], sortedTeams[7]],
    [sortedTeams[3], sortedTeams[4]],
    [sortedTeams[1], sortedTeams[6]],
    [sortedTeams[2], sortedTeams[5]],
  ];

  return matchups
    .filter(([team1, team2]) => team1 && team2)
    .map(([team1, team2], index) => {
      const gameId = `${leagueNight}-${seasonId}-playoff-qf-${
        index + 1
      }`;

      return {
        gameId,
        id: gameId,

        league: leagueNight,
        leagueNight,
        seasonId,

        week,
        date,
        time: "",

        team1Id: team1.teamId,
        team2Id: team2.teamId,

        team1Score: null,
        team2Score: null,

        score: null,
        winner: null,
        winnerTeamId: null,

        status: "scheduled",
        type: "playoff",
        resultType: "pending",

        phase: "playoffs",
        round: "quarterfinal",
      };
    });
}