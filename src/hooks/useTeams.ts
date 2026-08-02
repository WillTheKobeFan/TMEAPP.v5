// src/hooks/useTeams.ts

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Team = {
  teamId: string;
  displayName?: string;
  captain?: string;
  league?: string;
};

export function useTeams(league: string, season: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const ref = collection(
          db,
          "leagues",
          league,
          "seasons",
          season,
          "teams"
        );

        const snap = await getDocs(ref);

        const data = snap.docs.map((doc) => ({
          teamId: doc.id,
          ...doc.data(),
        })) as Team[];

        setTeams(data);
      } catch (err) {
        console.error("Failed loading teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [league, season]);

  return { teams, loading };
}