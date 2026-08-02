// src/data/leagues/index.ts

import type { LeagueRegistry } from "@/types/leagues";

export const leagues: Partial<LeagueRegistry> = {
  sunday: {
    slug: "sunday",
    info: {
      leagueName: "Sunday League",
      seasonStart: "May",
      seasonEnd: "August",
      gameNight: "Sunday \n 9am - 1pm",
      totalWeeks: "10 Regular \n + 2 Playoffs",

      skillDivision: "Advanced Competition",
      skillDescription:
        "Experienced players, faster pace, highly competitive games.",

      leagueFormat:
        "9 Teams \n 8 Regular Season Games \n 2 bye weeks per team",

      playoffFormat:
        "8 Team Playoff \n Single Elimination \n Seeds are NOT reseeded",

      gameRules: "Click to view full league rules",
      gameResults:
        "Scores updated weekly. \n Click to view full league game results",

      standingsInfo:
        "Teams ranked by win percentage and tie breakers. \n Click to view full league game results",
    },
  },

  monday: {
    slug: "monday",
    info: {
      leagueName: "Monday League",
      seasonStart: "March",
      seasonEnd: "June",
      gameNight: "Monday \n 7pm - 10pm",
      totalWeeks: "10 Regular \n + 1 Playoff",

      skillDivision: "Intermediate Competitive",
      skillDescription:
        "Balanced competition for experienced recreational players.",

      leagueFormat:
        "7 Teams \n 8 Regular Season Games \n 2 bye weeks per team",

      playoffFormat:
        "4 Team Playoff \n Single Elimination \n Seeds are NOT reseeded",

      gameRules: "Click to view full league rules",
      gameResults:
        "Scores updated weekly. \n Click to view full league game results",

      standingsInfo:
        "Teams ranked by win percentage and tie breakers. \n Click to view full league game results",
    },
  },

  tuesday: {
    slug: "tuesday",
    info: {
      leagueName: "Tuesday League",
      seasonStart: "TBD",
      seasonEnd: "TBD",
      gameNight: "Tuesday \n TBD",
      totalWeeks: "10 Regular \n + 1 Playoff",

      skillDivision: "Advanced Competition",
      skillDescription:
        "Experienced players, faster pace, highly competitive games.",

      leagueFormat:
        "TBD \n 8 Regular Season Games \n 2 bye weeks per team",

      playoffFormat:
        "4 Team Playoff \n Single Elimination \n Seeds are NOT reseeded",

      gameRules: "Click to view full league rules",
      gameResults:
        "Scores updated weekly. \n Click to view full league game results",

      standingsInfo:
        "Teams ranked by win percentage and tie breakers. \n Click to view full league game results",
    },
  },

  wednesday: {
    slug: "wednesday",
    info: {
      leagueName: "Wednesday League",
      seasonStart: "June",
      seasonEnd: "TBD",
      gameNight: "Wednesday \n 7pm - 10pm",
      totalWeeks: "10 Regular \n + 1 Playoff",

      skillDivision: "Recreational Division",
      skillDescription:
        "Fun, organized basketball for casual and developing players.",

      leagueFormat:
        "7 Teams \n 8 Regular Season Games \n 2 bye weeks per team",

      playoffFormat:
        "4 Team Playoff \n Single Elimination \n Seeds are NOT reseeded",

      gameRules: "Click to view full league rules",
      gameResults:
        "Scores updated weekly. \n Click to view full league game results",

      standingsInfo:
        "Teams ranked by win percentage and tie breakers. \n Click to view full league game results",
    },
  },
};

export default leagues;