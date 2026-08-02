// src/notifications/NotificationProvider.tsx

import React from "react";

type Props = {
  children: React.ReactNode;
};

export type LeagueDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

export function NotificationProvider({
  children,
}: Props) {
  return <>{children}</>;
}

export default NotificationProvider;