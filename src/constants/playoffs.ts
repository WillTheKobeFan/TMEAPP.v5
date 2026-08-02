export type PlayoffRound =
  | "quarterfinal"
  | "semifinal"
  | "championship";

export const roundLabelMap: Record<PlayoffRound, string> = {
  quarterfinal: "Quarter-Finals",
  semifinal: "Semi-Finals",
  championship: "Championship",
};