// src/context/LeagueContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_LEAGUE_INDICATOR_ID,
  isLeagueIndicatorId,
  LeagueIndicatorId,
} from "@/config/leagueIndicatorConfig";

type LeagueContextValue = {
  selectedLeagueId: LeagueIndicatorId;
  setSelectedLeagueId: (leagueId: LeagueIndicatorId) => void;
  selectLeague: (leagueId: unknown) => void;
};

const LeagueContext = createContext<LeagueContextValue | undefined>(
  undefined
);

type LeagueProviderProps = {
  children: React.ReactNode;
};

export function LeagueProvider({
  children,
}: LeagueProviderProps) {
  const [selectedLeagueId, setSelectedLeagueId] =
    useState<LeagueIndicatorId>(
      DEFAULT_LEAGUE_INDICATOR_ID
    );

  const selectLeague = useCallback((leagueId: unknown) => {
    if (!isLeagueIndicatorId(leagueId)) {
      console.warn(
        `[LeagueContext] Invalid league ID: ${String(leagueId)}`
      );
      return;
    }

    setSelectedLeagueId(leagueId);
  }, []);

  const value = useMemo(
    () => ({
      selectedLeagueId,
      setSelectedLeagueId,
      selectLeague,
    }),
    [selectedLeagueId, selectLeague]
  );

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);

  if (!context) {
    throw new Error(
      "useLeague must be used inside LeagueProvider"
    );
  }

  return context;
}