// src/hooks/useGameResults.ts

import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { GameResult } from "@/types/gameResults";

export function useGameResults(
  league: string
) {
  const [
    games,
    setGames,
  ] = useState<GameResult[]>([]);

  useEffect(() => {
    const ref = collection(
      db,
      `league/${league}/games`
    );

    return onSnapshot(ref, (snap) => {
      setGames(
        snap.docs.map(
          (d) =>
            d.data() as GameResult
        )
      );
    });
  }, [league]);

  return { games };
}