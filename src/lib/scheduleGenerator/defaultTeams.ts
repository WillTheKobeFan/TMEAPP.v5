import type { ScheduleTeam } from "./types";

export const sundayTeams: ScheduleTeam[] = [
  {
    id: "sun_tA",
    name: "Ziller",
    captain: "Ziller",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tB",
    name: "Tom",
    captain: "Tom",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tC",
    name: "Edwards",
    captain: "Edwards",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tD",
    name: "Rich",
    captain: "Rich",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tE",
    name: "Timmy",
    captain: "Timmy",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tF",
    name: "TeeJ",
    captain: "TeeJ",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tG",
    name: "Dale",
    captain: "Dale",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tH",
    name: "Prince",
    captain: "Prince",
    captainSameAsTeamName: true,
  },
  {
    id: "sun_tI",
    name: "Dex",
    captain: "Dex",
    captainSameAsTeamName: true,
  },
];

export const mondayTeams: ScheduleTeam[] = [
  {
    id: "mon_tA",
    name: "Cam",
    captain: "Cam",
    captainSameAsTeamName: false,
  },
  {
    id: "mon_tB",
    name: "Coffey",
    captain: "Coffey",
    captainSameAsTeamName: true,
  },
  {
    id: "mon_tC",
    name: "Ladd",
    captain: "Ladd",
    captainSameAsTeamName: true,
  },
  {
    id: "mon_tD",
    name: "John",
    captain: "John",
    captainSameAsTeamName: true,
  },
  {
    id: "mon_tE",
    name: "Justin",
    captain: "Justin",
    captainSameAsTeamName: true,
  },
  {
    id: "mon_tF",
    name: "Gross",
    captain: "Gross",
    captainSameAsTeamName: false,
  },
  {
    id: "mon_tG",
    name: "Gibson",
    captain: "Gibson",
    captainSameAsTeamName: true,
  },
];

export const wednesdayTeams: ScheduleTeam[] = [
  {
    id: "wed_tA",
    name: "Duffy",
    captain: "Duffy",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tB",
    name: "Neil",
    captain: "Neil",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tC",
    name: "Tom",
    captain: "Tom",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tD",
    name: "Gross",
    captain: "Gross",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tE",
    name: "Gervese",
    captain: "Gervese",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tF",
    name: "Rob",
    captain: "Rob",
    captainSameAsTeamName: true,
  },
  {
    id: "wed_tG",
    name: "Mark",
    captain: "Mark",
    captainSameAsTeamName: true,
  },
];

export const defaultTeamsByPreset = {
  Sunday: sundayTeams,
  Monday: mondayTeams,
  Tuesday: [],
  Wednesday: wednesdayTeams,
  Thursday: [],
  Friday: [],
  Saturday: [],
};