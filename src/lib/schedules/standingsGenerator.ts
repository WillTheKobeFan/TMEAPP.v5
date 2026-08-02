// src/lib/schedules/standingsGenerator.ts

import type {
  SessionData,
  RawGame,
} from "@/types/firebaseSchedule";

export type TeamStanding = {
  teamId: string;
  wins: number;
  losses: number;
  ties: number;
  gamesPlayed: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  winPercentage: number;
};

function ensureTeam(
  standings: Record<string, TeamStanding>,
  teamId: string
) {
  if (!standings[teamId]) {
    standings[teamId] = {
      teamId,
      wins: 0,
      losses: 0,
      ties: 0,
      gamesPlayed: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDifferential: 0,
      winPercentage: 0,
    };
  }

  return standings[teamId];
}

function applyGameToStandings(
  standings: Record<string, TeamStanding>,
  game: RawGame
) {
  const team1Id = game.team1Id ?? game.team1;
  const team2Id = game.team2Id ?? game.team2;

  if (!team1Id || !team2Id) return;
  if (
    game.team1Score === null ||
    game.team2Score === null
  ) {
    return;
  }

  const team1 = ensureTeam(standings, team1Id);
  const team2 = ensureTeam(standings, team2Id);

  team1.gamesPlayed += 1;
  team2.gamesPlayed += 1;

  team1.pointsFor += game.team1Score;
  team1.pointsAgainst += game.team2Score;

  team2.pointsFor += game.team2Score;
  team2.pointsAgainst += game.team1Score;

  if (game.team1Score > game.team2Score) {
    team1.wins += 1;
    team2.losses += 1;
  } else if (game.team2Score > game.team1Score) {
    team2.wins += 1;
    team1.losses += 1;
  } else {
    team1.ties += 1;
    team2.ties += 1;
  }
}

export function generateStandings(
  data: SessionData
): TeamStanding[] {
  const standings: Record<string, TeamStanding> = {};

  data.weeks.forEach(
    (week: SessionData["weeks"][number]) => {
      week.games.forEach((game: RawGame) => {
        applyGameToStandings(standings, game);
      });
    }
  );

  return Object.values(standings)
    .map((team) => ({
      ...team,
      pointDifferential:
        team.pointsFor - team.pointsAgainst,
      winPercentage:
        team.gamesPlayed > 0
          ? team.wins / team.gamesPlayed
          : 0,
    }))
    .sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }

      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      if (
        b.pointDifferential !== a.pointDifferential
      ) {
        return (
          b.pointDifferential -
          a.pointDifferential
        );
      }

      if (a.pointsAgainst !== b.pointsAgainst) {
        return a.pointsAgainst - b.pointsAgainst;
      }

      return a.teamId.localeCompare(b.teamId);
    });
}