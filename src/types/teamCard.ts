// src/types/teamCard.ts

export type TeamPlayer = {
  firstName: string;
  lastInitial?: string;
  isCaptain?: boolean;
};

export type TeamCardData = {
  teamId: string;
  teamName: string;
  league: string;
  captainName: string;
  record?: string;
  roster: TeamPlayer[];
};