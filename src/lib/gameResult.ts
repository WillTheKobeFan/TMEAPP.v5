// src/lib/gameResult.ts

export type GameStatus =
  | "scheduled"
  | "completed"
  | "final"
  | "cancelled";

export type GameType =
  | "regular"
  | "playoff"
  | "championship"
  | "all-star"
  | "special";

export type ResultType =
  | "pending"
  | "normal"
  | "forfeit";

export type TeamOutcome =
  | "W"
  | "L"
  | "T"
  | null;

export type GameResultLike = {
  team1Id?: string | null;
  team2Id?: string | null;

  team1Name?: string | null;
  team2Name?: string | null;

  team1Score?: number | string | null;
  team2Score?: number | string | null;

  // Support current/imported naming variants
  winner?: string | null;
  winnerId?: string | null;
  winnerName?: string | null;
  winnerTeamId?: string | null;

  status?: string | null;
  type?: string | null;
  resultType?: string | null;

  round?: string | null;
};

export type ResultDisplay = {
  outcome: TeamOutcome;
  text: string;
  shortText: string;

  hasScore: boolean;
  isFinal: boolean;
  isForfeit: boolean;

  winnerId: string | null;
  opponentId: string | null;
  opponentName: string;
};

// --------------------------------------------------
// BASIC NORMALIZERS
// --------------------------------------------------

export function normalizeScore(
  value: number | string | null | undefined
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export function hasCompleteScore(
  game: GameResultLike
): boolean {
  return (
    normalizeScore(game.team1Score) !== null &&
    normalizeScore(game.team2Score) !== null
  );
}

export function isFinalGame(
  game: GameResultLike
): boolean {
  return (
    game.status === "final" ||
    game.status === "completed"
  );
}

export function isForfeitGame(
  game: GameResultLike
): boolean {
  return game.resultType === "forfeit";
}

// --------------------------------------------------
// WINNER
// --------------------------------------------------

export function getWinnerId(
  game: GameResultLike
): string | null {
  // 1. Explicit winner always wins.
  const explicitWinner =
    game.winnerTeamId ||
    game.winnerId ||
    null;

  if (explicitWinner) {
    return String(explicitWinner);
  }

  // Some older data may store team ID directly in `winner`.
  if (
    game.winner &&
    (game.winner === game.team1Id ||
      game.winner === game.team2Id)
  ) {
    return String(game.winner);
  }

  // 2. Fall back to score.
  const score1 = normalizeScore(game.team1Score);
  const score2 = normalizeScore(game.team2Score);

  if (score1 === null || score2 === null) {
    return null;
  }

  if (score1 === score2) {
    return null;
  }

  return score1 > score2
    ? game.team1Id ?? null
    : game.team2Id ?? null;
}

// --------------------------------------------------
// TEAM OUTCOME
// --------------------------------------------------

export function getTeamOutcome(
  game: GameResultLike,
  teamId: string
): TeamOutcome {
  if (!isFinalGame(game)) {
    return null;
  }

  const score1 = normalizeScore(game.team1Score);
  const score2 = normalizeScore(game.team2Score);

  // Handle scored tie if sport/org permits ties.
  if (
    score1 !== null &&
    score2 !== null &&
    score1 === score2
  ) {
    return "T";
  }

  const winnerId = getWinnerId(game);

  if (!winnerId) {
    return null;
  }

  return winnerId === teamId ? "W" : "L";
}

// --------------------------------------------------
// OPPONENT
// --------------------------------------------------

export function getOpponent(
  game: GameResultLike,
  teamId: string
) {
  const isTeam1 = game.team1Id === teamId;

  return {
    id: isTeam1
      ? game.team2Id ?? null
      : game.team1Id ?? null,

    name: isTeam1
      ? game.team2Name || "Opponent"
      : game.team1Name || "Opponent",
  };
}

// --------------------------------------------------
// RESULT DISPLAY
// --------------------------------------------------

export function getTeamResultDisplay(
  game: GameResultLike,
  teamId: string
): ResultDisplay {
  const outcome = getTeamOutcome(game, teamId);
  const opponent = getOpponent(game, teamId);

  const score1 = normalizeScore(game.team1Score);
  const score2 = normalizeScore(game.team2Score);

  const completeScore =
    score1 !== null && score2 !== null;

  const teamIs1 = game.team1Id === teamId;

  const teamScore = teamIs1 ? score1 : score2;
  const opponentScore = teamIs1 ? score2 : score1;

  const forfeit = isForfeitGame(game);
  const final = isFinalGame(game);
  const winnerId = getWinnerId(game);

  // ---------------------------
  // UPCOMING
  // ---------------------------

  if (!final) {
    return {
      outcome: null,
      text: `vs ${opponent.name}`,
      shortText: "Upcoming",
      hasScore: false,
      isFinal: false,
      isForfeit: false,
      winnerId,
      opponentId: opponent.id,
      opponentName: opponent.name,
    };
  }

  // ---------------------------
  // FORFEIT
  // ---------------------------

  if (forfeit && outcome) {
    return {
      outcome,
      text: `${outcome} — Forfeit vs ${opponent.name}`,
      shortText: `${outcome} • Forfeit`,
      hasScore: false,
      isFinal: true,
      isForfeit: true,
      winnerId,
      opponentId: opponent.id,
      opponentName: opponent.name,
    };
  }

  // ---------------------------
  // FINAL WITH SCORE
  // ---------------------------

  if (
    completeScore &&
    teamScore !== null &&
    opponentScore !== null &&
    outcome
  ) {
    return {
      outcome,
      text: `${outcome} ${teamScore}–${opponentScore} vs ${opponent.name}`,
      shortText: `${outcome} ${teamScore}–${opponentScore}`,
      hasScore: true,
      isFinal: true,
      isForfeit: false,
      winnerId,
      opponentId: opponent.id,
      opponentName: opponent.name,
    };
  }

  // ---------------------------
  // WINNER ONLY
  // ---------------------------

  if (outcome) {
    return {
      outcome,
      text: `${outcome} vs ${opponent.name}`,
      shortText: outcome,
      hasScore: false,
      isFinal: true,
      isForfeit: false,
      winnerId,
      opponentId: opponent.id,
      opponentName: opponent.name,
    };
  }

  // Final but result somehow incomplete
  return {
    outcome: null,
    text: "Result pending",
    shortText: "Pending",
    hasScore: false,
    isFinal: true,
    isForfeit: false,
    winnerId: null,
    opponentId: opponent.id,
    opponentName: opponent.name,
  };
}

// --------------------------------------------------
// GAME TYPE / PLAYOFF CONTEXT
// --------------------------------------------------

export function getGameTypeLabel(
  game: GameResultLike
): string {
  switch (game.type) {
    case "championship":
      return "Championship";

    case "playoff":
      return game.round
        ? `Playoffs • ${game.round}`
        : "Playoffs";

    case "all-star":
      return "All-Star Event";

    case "special":
      return "Special Event";

    default:
      return "Regular Season";
  }
}

// --------------------------------------------------
// ROLE VISIBILITY
// --------------------------------------------------

export type MyHubRole =
  | "player"
  | "captain"
  | "referee"
  | "scorekeeper"
  | "trainer"
  | "trainee"
  | "facility"
  | "admin"
  | "camp-director";

export function canViewCompetitiveContext(
  role: MyHubRole
): boolean {
  return [
    "player",
    "captain",
    "referee",
    "scorekeeper",
    "admin",
  ].includes(role);
}

// --------------------------------------------------
// STANDINGS HELPERS
// --------------------------------------------------

export function countsTowardRecord(
  game: GameResultLike
): boolean {
  return (
    isFinalGame(game) &&
    getWinnerId(game) !== null
  );
}

export function countsTowardPointStats(
  game: GameResultLike
): boolean {
  return (
    isFinalGame(game) &&
    !isForfeitGame(game) &&
    hasCompleteScore(game)
  );
}