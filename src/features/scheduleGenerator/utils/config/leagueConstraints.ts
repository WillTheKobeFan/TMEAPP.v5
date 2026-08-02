// src/features/scheduleGenerator/utils/leagueConstraints.ts

export type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

export type LeagueConstraintConfig = {
  league: LeagueKey;

  minTeams: number;

  totalWeeks: number;

  times: string[];

  preferredMaxTeams?: number;

  protectedTeams?: {
    teamId: string;
    preferredTimes?: string[];
    avoidByeWeeks?: number[];
  }[];

  softRules: {
    minimizeRepeats: boolean;
    balanceByes: boolean;
    avoidBackToBackByes: boolean;
    avoidFinalWeekBye: boolean;
    balanceTimes: boolean;
    avoidConsecutiveLateGames: boolean;
    avoidConsecutiveEarlyGames: boolean;
  };
};

export const leagueConstraints: Record<
  LeagueKey,
  LeagueConstraintConfig
> = {
  sunday: {
    league: "sunday",
    minTeams: 8,
    totalWeeks: 10,

    times: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
    ],

    preferredMaxTeams: 10,

    protectedTeams: [
      {
        teamId: "tA", // Timmy
        preferredTimes: [
          "11:00 AM",
          "12:00 PM",
        ],
      },
      {
        teamId: "tF", // Prince
        preferredTimes: [
          "11:00 AM",
          "12:00 PM",
        ],
      },
      {
        teamId: "tC", // Tom
        avoidByeWeeks: [10],
      },
    ],

    softRules: {
      minimizeRepeats: true,
      balanceByes: true,
      avoidBackToBackByes: true,
      avoidFinalWeekBye: true,
      balanceTimes: true,
      avoidConsecutiveLateGames: true,
      avoidConsecutiveEarlyGames: true,
    },
  },

  monday: {
    league: "monday",
    minTeams: 6,
    totalWeeks: 10,

    times: [
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],

    preferredMaxTeams: 8,

    softRules: {
      minimizeRepeats: true,
      balanceByes: true,
      avoidBackToBackByes: true,
      avoidFinalWeekBye: true,
      balanceTimes: true,
      avoidConsecutiveLateGames: true,
      avoidConsecutiveEarlyGames: true,
    },
  },

  tuesday: {
    league: "tuesday",
    minTeams: 5,
    totalWeeks: 10,

    times: [
      "6:30 PM",
      "7:30 PM",
      "8:30 PM",
    ],

    preferredMaxTeams: 8,

    softRules: {
      minimizeRepeats: true,
      balanceByes: true,
      avoidBackToBackByes: true,
      avoidFinalWeekBye: true,
      balanceTimes: true,
      avoidConsecutiveLateGames: true,
      avoidConsecutiveEarlyGames: true,
    },
  },

  wednesday: {
    league: "wednesday",
    minTeams: 6,
    totalWeeks: 10,

    times: [
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],

    preferredMaxTeams: 8,

    softRules: {
      minimizeRepeats: true,
      balanceByes: true,
      avoidBackToBackByes: true,
      avoidFinalWeekBye: true,
      balanceTimes: true,
      avoidConsecutiveLateGames: true,
      avoidConsecutiveEarlyGames: true,
    },
  },
};