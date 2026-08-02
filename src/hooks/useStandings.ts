// src/hooks/useStandings.ts

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { db } from "src/config/firebaseConfig";

export interface Team {
  name: string;
  wins: number;
  losses: number;
  rank: number;
  pf: number;
  pa: number;
}

export const useStandings = (day: string) => {
  const [standings, setStandings] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, `league/${day}/standings`)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teams: Team[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          name: data.name ?? "",
          wins: data.wins ?? 0,
          losses: data.losses ?? 0,
          rank: data.rank ?? 0,
          pf: data.pf ?? 0,
          pa: data.pa ?? 0,
        };
      });

      teams.sort((a, b) => a.rank - b.rank);

      setStandings(teams);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [day]);

  return { standings, loading };
};