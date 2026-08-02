// app/src/lib/teams

import { collection, getDocs } from "firebase/firestore";
import { db } from "src/lib/firebase";

export const fetchTeamsByLeague = async (league: string) => {
  const snapshot = await getDocs(collection(db, "teams", league));

  const teams: any[] = [];

  snapshot.forEach(doc => {
    teams.push(doc.data());
  });

  return teams;
};