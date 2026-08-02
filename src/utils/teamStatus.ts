// src/utils/teamStatus.ts

import { TeamStatus } from "../types/team";

export function getStatusMeta(status: TeamStatus) {
  switch (status) {
    case "clinched":
      return {
        label: "🟢 Clinched Playoffs",
        color: "#22c55e",
      };
    case "bubble":
      return {
        label: "🟡 On the Bubble",
        color: "#eab308",
      };
    case "eliminated":
      return {
        label: "🔴 Eliminated",
        color: "#ef4444",
      };
  }
}