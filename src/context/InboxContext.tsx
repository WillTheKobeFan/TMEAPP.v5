// src/context/InboxContext.tsx

import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type InboxContextValue = {
  unreadNotificationCount: number;
  unreadMessageCount: number;
  inboxBadgeCount: number;
  setUnreadNotificationCount: (count: number) => void;
  setUnreadMessageCount: (count: number) => void;
};

const InboxContext =
  createContext<InboxContextValue | null>(null);

type InboxProviderProps = {
  children: ReactNode;
};

export function InboxProvider({
  children,
}: InboxProviderProps) {
  /*
   * Temporary sample counts so the badge is visible before
   * Firebase is connected. The Inbox screen immediately keeps
   * these values synchronized with its live local data.
   */
  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(2);

  const [
    unreadMessageCount,
    setUnreadMessageCount,
  ] = useState(1);

  const inboxBadgeCount =
    unreadNotificationCount +
    unreadMessageCount;

  const value = useMemo(
    () => ({
      unreadNotificationCount,
      unreadMessageCount,
      inboxBadgeCount,
      setUnreadNotificationCount,
      setUnreadMessageCount,
    }),
    [
      inboxBadgeCount,
      unreadMessageCount,
      unreadNotificationCount,
    ],
  );

  return (
    <InboxContext.Provider value={value}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox(): InboxContextValue {
  const context = useContext(InboxContext);

  if (!context) {
    throw new Error(
      "useInbox must be used inside InboxProvider",
    );
  }

  return context;
}