// src/context/LeagueContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_ORGANIZATION_ID,
  isOrganizationId,
  OrganizationId,
} from "@/config/leagueIndicatorConfig";

type LeagueContextValue = {
  selectedOrganizationId: OrganizationId;
  setSelectedOrganizationId: (
    organizationId: OrganizationId
  ) => void;
  selectOrganization: (
    organizationId: unknown
  ) => void;

  /**
   * Backward-compatible aliases.
   */
  selectedLeagueId: OrganizationId;
  setSelectedLeagueId: (
    organizationId: OrganizationId
  ) => void;
  selectLeague: (
    organizationId: unknown
  ) => void;
};

const LeagueContext =
  createContext<LeagueContextValue | undefined>(
    undefined
  );

type LeagueProviderProps = {
  children: React.ReactNode;
};

export function LeagueProvider({
  children,
}: LeagueProviderProps) {
  const [
    selectedOrganizationId,
    setSelectedOrganizationId,
  ] = useState<OrganizationId>(
    DEFAULT_ORGANIZATION_ID
  );

  const selectOrganization = useCallback(
    (organizationId: unknown) => {
      if (!isOrganizationId(organizationId)) {
        console.warn(
          `[LeagueContext] Invalid organization ID: ${String(
            organizationId
          )}`
        );

        return;
      }

      setSelectedOrganizationId(organizationId);
    },
    []
  );

  const value = useMemo<LeagueContextValue>(
    () => ({
      selectedOrganizationId,
      setSelectedOrganizationId,
      selectOrganization,

      selectedLeagueId: selectedOrganizationId,
      setSelectedLeagueId:
        setSelectedOrganizationId,
      selectLeague: selectOrganization,
    }),
    [
      selectedOrganizationId,
      selectOrganization,
    ]
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