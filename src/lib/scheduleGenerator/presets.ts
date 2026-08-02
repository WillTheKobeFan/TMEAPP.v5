import type { LeagueDay, LeagueGeneratorConfig } from "./types";

function createEmptyPreset(day: LeagueDay): Omit<LeagueGeneratorConfig, "teams"> {
  const lowerDay = day.toLowerCase();

  return {
    leagueId: lowerDay,
    leagueName: `${day} League`,
    sport: "Basketball",
    day,

    seasonId: "new_season",
    seasonName: "New Season",
    startDate: "",

    regularSeasonWeeks: 10,
    playoffWeeks: 1,
    playoffTeams: 4,

    targetByesPerTeam: 0,
    allowUnevenByes: false,

    teamPreferences: [],

    requireEveryonePlaysOnce: true,
    allowDuplicateMatchups: true,
    preventBackToBackRematches: true,
    balanceTimeSlots: true,

    strictMode: true,

    gameSlots: [],
  };
}

export const leaguePresets: Record<
  string,
  Omit<LeagueGeneratorConfig, "teams">
> = {
  Sunday: {
    leagueId: "sunday",
    leagueName: "Sunday League",
    sport: "Basketball",
    day: "Sunday",

    seasonId: "spring_2026",
    seasonName: "Spring 2026",
    startDate: "2026-02-22",

    regularSeasonWeeks: 10,
    playoffWeeks: 2,
    playoffTeams: 8,

    targetByesPerTeam: 2,
    allowUnevenByes: false,

    teamPreferences: [
      {
        id: "sun_tom_no_w10_bye",
        teamId: "sun_tB",
        teamName: "Tom",
        mustPlayWeeks: [10],
        avoidByeWeeks: [10],
      },
      {
        id: "sun_timmy_late",
        teamId: "sun_tE",
        teamName: "Timmy",
        preferredTimes: ["11:00 AM", "12:00 PM"],
      },
      {
        id: "sun_prince_late",
        teamId: "sun_tH",
        teamName: "Prince",
        preferredTimes: ["11:00 AM", "12:00 PM"],
      },
    ],

    requireEveryonePlaysOnce: true,
    allowDuplicateMatchups: false,
    preventBackToBackRematches: true,
    balanceTimeSlots: true,
    strictMode: true,

    gameSlots: [
      { id: "sun_9", time: "9:00 AM", venue: "YMCA" },
      { id: "sun_10", time: "10:00 AM", venue: "YMCA" },
      { id: "sun_11", time: "11:00 AM", venue: "YMCA" },
      { id: "sun_12", time: "12:00 PM", venue: "YMCA" },
    ],
  },

  Monday: {
    leagueId: "monday",
    leagueName: "Monday League",
    sport: "Basketball",
    day: "Monday",

    seasonId: "spring_2026",
    seasonName: "Spring 2026",
    startDate: "2026-03-23",

    regularSeasonWeeks: 10,
    playoffWeeks: 1,
    playoffTeams: 4,

    targetByesPerTeam: 2,
    allowUnevenByes: false,

    teamPreferences: [],

    requireEveryonePlaysOnce: true,
    allowDuplicateMatchups: true,
    preventBackToBackRematches: true,
    balanceTimeSlots: true,
    strictMode: true,

    gameSlots: [
      { id: "mon_7", time: "7:00 PM", venue: "Berlin" },
      { id: "mon_8", time: "8:00 PM", venue: "Berlin" },
      { id: "mon_9", time: "9:00 PM", venue: "Berlin" },
    ],
  },

  Tuesday: createEmptyPreset("Tuesday"),

  Wednesday: {
    leagueId: "wednesday",
    leagueName: "Wednesday League",
    sport: "Basketball",
    day: "Wednesday",

    seasonId: "spring_2026",
    seasonName: "Spring 2026",
    startDate: "2026-03-04",

    regularSeasonWeeks: 10,
    playoffWeeks: 1,
    playoffTeams: 4,

    targetByesPerTeam: 2,
    allowUnevenByes: false,

    teamPreferences: [],

    requireEveryonePlaysOnce: true,
    allowDuplicateMatchups: true,
    preventBackToBackRematches: true,
    balanceTimeSlots: true,
    strictMode: true,

    gameSlots: [
      { id: "wed_7", time: "7:00 PM", venue: "Berlin" },
      { id: "wed_8", time: "8:00 PM", venue: "Berlin" },
      { id: "wed_9", time: "9:00 PM", venue: "Berlin" },
    ],
  },

  Thursday: createEmptyPreset("Thursday"),
  Friday: createEmptyPreset("Friday"),
  Saturday: createEmptyPreset("Saturday"),
};