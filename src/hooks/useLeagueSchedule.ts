// src/hooks/useLeagueSchedule.ts

import { useEffect, useState } from "react";
import { db } from "src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Props = {
  league: string;
  season: string;
};

export function useLeagueSchedule({ league, season }: Props) {
  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const ref = collection(
          db,
          "leagues",
          league,
          "seasons",
          season,
          "weeks"
        );

        const snap = await getDocs(ref);

        const raw = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Firebase schedule path:", `leagues/${league}/seasons/${season}/weeks`);
        console.log("Weeks loaded:", raw.length);
        console.log("First week loaded:", raw[0]);
        // ----------------------------
        // NORMALIZE WEEK STRUCTURE
        // ----------------------------
        const normalized = raw.map((w: any) => {
          return {
            week: Number(w.week?.toString().replace("week_", "")) || w.week,
            date: w.date ?? null,

            games: Array.isArray(w.games) ? w.games : [],

            announcements: Array.isArray(w.announcements)
              ? w.announcements
              : [],

            // 🔥 IMPORTANT FIX (your UI was breaking here)
            byeTeams: Array.isArray(w.byeTeams)
              ? w.byeTeams
              : Array.isArray(w.bye)
                ? w.bye
                : [],
          };
        });

        // sort weeks properly
        normalized.sort((a: any, b: any) => a.week - b.week);

        setWeeks(normalized);
      } catch (err) {
        console.error("Schedule fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [league, season]);

  return { weeks, loading };
}