// src/data/leagues/leagueData.ts

import type { LeagueKey } from "@/types/leagues";

import { standingsMap } from "../standings/standingsMap";

import { sunday } from "./info/sunday";
import { monday } from "./info/monday";
import { tuesday } from "./info/tuesday";
import { wednesday } from "./info/wednesday";

import { teamsMap } from "./teams/teamMap";

import {
  sundaySchedulePreset,
  mondaySchedulePreset,
  tuesdaySchedulePreset,
  wednesdaySchedulePreset,
} from "./schedulePresets";

export const leagueData: Record<LeagueKey, any> = {
  sunday: {
    name: "Sunday League",
    info: sunday,
    teams: teamsMap.sunday,
    standings: standingsMap.sunday,
    preset: sundaySchedulePreset,

    defaultTimes: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
    ],

    slotOverrides: {
      8: ["10:00 AM", "11:00 AM", "12:00 PM"],
      9: ["10:00 AM", "11:00 AM", "12:00 PM"],
      10: ["10:00 AM", "11:00 AM", "12:00 PM"],
    },
  },

  monday: {
    name: "Monday League",
    info: monday,
    teams: teamsMap.monday,
    standings: standingsMap.monday,
    preset: mondaySchedulePreset,

    defaultTimes: [
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],

    slotOverrides: {
      9: ["7:00 PM", "8:00 PM"],
      10: ["7:00 PM", "8:00 PM"],
    },
  },

  tuesday: {
    name: "Tuesday League",
    info: tuesday,
    teams: teamsMap.tuesday,
    standings: standingsMap.tuesday,
    preset: tuesdaySchedulePreset,

    defaultTimes: [
      "6:30 PM",
      "7:30 PM",
      "8:30 PM",
    ],

    slotOverrides: {},
  },

  wednesday: {
    name: "Wednesday League",
    info: wednesday,
    teams: teamsMap.wednesday,
    standings: standingsMap.wednesday,
    preset: wednesdaySchedulePreset,

    defaultTimes: [
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],

    slotOverrides: {
      9: ["7:00 PM", "8:00 PM"],
      10: ["7:00 PM", "8:00 PM"],
    },
  },
};