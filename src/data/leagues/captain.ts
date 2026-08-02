// src/data/leagues/captain.ts

export const captainLeague = {
  id: "captain",

  info: {
    leagueName: "Captain League",
    seasonStart: "May 5th",
    seasonEnd: "July 28th",
    gameNight: "Sundays • 9:00 AM - 1:00 PM",
    totalWeeks: "10 Regular + 2 Playoff",

    leagueFormat:
      "9 Teams • 10 Regular Season Games • Top 8 Make Playoffs",

    playoffFormat:
      "8 Team Single Elimination Bracket",

    gameRules:
      "FIBA-inspired rules • 5v5 full court • 2 refs per game",
  },

  schedule: {
    // later: migrate captainScheduleMap here
  },

  standings: {
    // later: migrate captainStandingsMap here
  },

  champions: {
    // later: migrate captainChamps.map here
  },

  updates: [
    // later: move updates if captain-specific
  ],
};