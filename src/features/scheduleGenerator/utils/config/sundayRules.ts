// src/features/scheduleGenerator/config/sundayRules.ts

export const sundayRules = {
  teams: 9,

  byesPerTeam: 2,

  championshipTeamsByeWeek1: true,

  avoidFinalWeekByeTeams: ["tB"],

  preferredTimeSlots: {
    tE: ["11:00", "12:00"],
    tH: ["11:00", "12:00"],
  },

  week9: {
    removeSlots: ["09:00", "10:00"],
  },

  week10: {
    removeSlots: ["09:00"],
  },

  avoidRepeatMatchups: true,
};