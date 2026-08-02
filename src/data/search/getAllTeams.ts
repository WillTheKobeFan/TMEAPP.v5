// src/data/search/getAllTeams.ts

// import { teamsMap } from "../leagues/teamMap"; 

//export function getAllTeams() {
  //return Object.values(teamsMap).flat();
// }

import { teamsMap } from "../leagues/teamMap";

export function getAllTeams() {
  const teams = Object.values(teamsMap).flat();

  console.log(
    "GET ALL TEAMS - TOM:",
    teams.filter(
      (team) => team.teamName.toLowerCase() === "tom"
    )
  );

  return teams;
}