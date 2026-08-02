// src/features/scheduleGenerator/services/getSeasonTeams.ts

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type SeasonTeam = {
  teamId: string;
  teamName: string;
  captainName: string;
  leagueNight: string;
  seasonId: string;
  active: boolean;
};

export async function getSeasonTeams({
  leagueNight,
  seasonId,
}: {
  leagueNight: string;
  seasonId: string;
}): Promise<SeasonTeam[]> {
  const teamsRef = collection(
    db,
    "leagues",
    leagueNight,
    "seasons",
    seasonId,
    "teams"
  );

  const snapshot = await getDocs(teamsRef);

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();

      return {
        teamId: docSnap.id,
        teamName: String(data.teamName ?? ""),
        captainName: String(data.captainName ?? ""),
        leagueNight,
        seasonId,
        active: Boolean(data.active ?? true),
      };
    })
    .filter((team) => team.active);
}