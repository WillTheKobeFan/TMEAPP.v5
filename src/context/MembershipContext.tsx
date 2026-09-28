// src/context/MembershipContext.tsx

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  MEMBERSHIP_SOURCE_IDS,
  MEMBERSHIP_STATUS_IDS,
  type OrganizationMembership,
} from "src/config/memberships";

import {
  ORGANIZATION_IDS,
} from "src/config/organizations";

import {
  ROLE_IDS,
} from "src/config/roles";

type MembershipContextValue = {
  activeMembership: OrganizationMembership;
  setActiveMembership: (
    membership: OrganizationMembership
  ) => void;

  testMemberships: readonly OrganizationMembership[];
};

const TEST_MEMBERSHIPS: readonly OrganizationMembership[] = [
  {
    id: "test_tme_captain",
    userId: "test_captain",
    organizationId: ORGANIZATION_IDS.TME,
    roles: [
      ROLE_IDS.PLAYER,
      ROLE_IDS.CAPTAIN,
    ],
    status: MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.SYSTEM,
    leagueIds: ["sunday"],
    teamIds: ["sun_tF"],
  },

  {
    id: "test_pickup_official",
    userId: "test_official",
    organizationId: ORGANIZATION_IDS.PICKUP,
    roles: [
      ROLE_IDS.REFEREE,
      ROLE_IDS.SCOREKEEPER,
    ],
    status: MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.SYSTEM,
    leagueIds: ["pickup_sunday"],
    assignmentIds: [
      "pickup_game_01_scorekeeper",
      "pickup_game_02_referee",
    ],
  },

  {
    id: "test_taj_coach",
    userId: "test_coach",
    organizationId: ORGANIZATION_IDS.TAJ,
    roles: [ROLE_IDS.COACH],
    status: MEMBERSHIP_STATUS_IDS.PENDING,
    source: MEMBERSHIP_SOURCE_IDS.SYSTEM,
    programIds: ["taj_clinic_12_14"],
  },

  {
    id: "test_tme_admin",
    userId: "test_admin",
    organizationId: ORGANIZATION_IDS.TME,
    roles: [ROLE_IDS.ADMIN],
    status: MEMBERSHIP_STATUS_IDS.ACTIVE,
    source: MEMBERSHIP_SOURCE_IDS.SYSTEM,
  },
];

const MembershipContext =
  createContext<MembershipContextValue | null>(null);

type MembershipProviderProps = {
  children: ReactNode;
};

export function MembershipProvider({
  children,
}: MembershipProviderProps) {
  const [activeMembership, setActiveMembership] =
    useState<OrganizationMembership>(
      TEST_MEMBERSHIPS[0]
    );

  const value = useMemo(
    () => ({
      activeMembership,
      setActiveMembership,
      testMemberships: TEST_MEMBERSHIPS,
    }),
    [activeMembership]
  );

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership(): MembershipContextValue {
  const context = useContext(MembershipContext);

  if (!context) {
    throw new Error(
      "useMembership must be used inside MembershipProvider."
    );
  }

  return context;
}