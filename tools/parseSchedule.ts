// tools/parseSchedule.ts

import fs from "fs";
import path from "path";

// ======================================================
// TYPES
// ======================================================

type Game = {
  id: string;

  league: string;
  season: string;
  seasonPhase: string;

  week: number;
  date: string;

  time: string;

  teamA: string;
  teamB: string;

  scoreA: number | null;
  scoreB: number | null;

  winner: string | null;

  completed: boolean;

  status: string;
  resultType: string | null;

  playoff: boolean;
  playoffRound: string | null;

  forfeit: boolean;
};

type ParsedSchedule = {
  league: string;
  season: string;
  seasonPhase: string;

  games: Game[];
  teams: string[];

  byeWeeks: {
    week: number;
    teams: string[];
  }[];

  announcements: {
    week: number;
    message: string;
  }[];
};

// ======================================================
// CONFIG
// ======================================================

const league = process.argv[2] || "sun";
const SEASON = "season_2026";

const inputPath = path.join(__dirname, `../data/raw/${league}.txt`);
const outputPath = path.join(__dirname, `../data/parsed/${league}.json`);

// ======================================================
// START
// ======================================================

console.log("\n==============================");
console.log("🚀 PARSER STARTED");
console.log("==============================");

if (!fs.existsSync(inputPath)) {
  console.error("❌ FILE NOT FOUND:", inputPath);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf-8");

const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

console.log("📂 Input Path:", inputPath);
console.log("📊 Total lines:", lines.length);

// ======================================================
// STATE
// ======================================================

const parsed: ParsedSchedule = {
  league: "",
  season: SEASON,
  seasonPhase: "",

  games: [],
  teams: [],

  byeWeeks: [],
  announcements: [],
};

let currentWeek = 0;
let currentDate = "";
let gameIndex = 1;

const teamSet = new Set<string>();

// ======================================================
// HELPERS
// ======================================================

const getField = (parts: string[], key: string) => {
  const found = parts.find((p) => p.startsWith(`${key}:`));
  if (!found) return null;
  return found.replace(`${key}:`, "").trim();
};

const parseScore = (raw: string | null) => {
  if (!raw || !raw.includes("-")) return { a: null, b: null };

  const [a, b] = raw.split("-");

  const scoreA = Number(a);
  const scoreB = Number(b);

  return {
    a: isNaN(scoreA) ? null : scoreA,
    b: isNaN(scoreB) ? null : scoreB,
  };
};

// ======================================================
// PARSE LOOP
// ======================================================

for (const line of lines) {
  // -----------------------------
  // META
  // -----------------------------

  if (line.startsWith("league=")) {
    parsed.league = line.replace("league=", "");
    continue;
  }

  if (line.startsWith("seasonPhase=")) {
    parsed.seasonPhase = line.replace("seasonPhase=", "");
    continue;
  }

  if (line.startsWith("week=")) {
    currentWeek = Number(line.replace("week=", ""));
    gameIndex = 1;
    continue;
  }

  if (line.startsWith("date=")) {
    currentDate = line.replace("date=", "");
    continue;
  }

  // -----------------------------
  // BYE
  // -----------------------------

  if (line.startsWith("bye=")) {
    const teams = line.replace("bye=", "").split(",");

    teams.forEach((t) => teamSet.add(t));

    parsed.byeWeeks.push({
      week: currentWeek,
      teams,
    });

    continue;
  }

  // -----------------------------
  // ANNOUNCEMENTS
  // -----------------------------

  if (line.startsWith("announcement=")) {
    parsed.announcements.push({
      week: currentWeek,
      message: line.replace("announcement=", ""),
    });

    continue;
  }

  // -----------------------------
  // GAME LINE
  // -----------------------------

  if (!line.startsWith("GAME")) continue;

  const parts = line.split("|").map((p) => p.trim());

  const id = getField(parts, "ID");
  const time = getField(parts, "TIME");
  const scoreRaw = getField(parts, "SCORE");
  const winnerRaw = getField(parts, "WINNER");
  const status = getField(parts, "STATUS") || "";
  const type = getField(parts, "TYPE") || "";
  const round = getField(parts, "ROUND");

  // -----------------------------
  // MATCHUP PARSE (CRITICAL FIX)
  // -----------------------------

  const matchup = parts.find((p) => p.includes(" vs "));

  let teamA = "N/A";
  let teamB = "N/A";

  if (matchup?.includes(" vs ")) {
    const [a, b] = matchup.split(" vs ").map((t) => t.trim());

    teamA = a || "N/A";
    teamB = b || "N/A";

    teamSet.add(teamA);
    teamSet.add(teamB);
  }

  // -----------------------------
  // SCORE PARSE
  // -----------------------------

  const { a: scoreA, b: scoreB } = parseScore(scoreRaw);

  // -----------------------------
  // STATUS LOGIC
  // -----------------------------

  const completed = status.toLowerCase() === "final";

  // -----------------------------
  // RESULT TYPE (ROBUST)
  // -----------------------------

  const resultType =
    getField(parts, "RESULT_TYPE") ||
    getField(parts, "RESULTTYPE");

  const winner =
    winnerRaw && winnerRaw !== "null" ? winnerRaw : null;

  const playoff = type.toLowerCase() === "playoff";

  // -----------------------------
  // GAME OBJECT
  // -----------------------------

  const game: Game = {
    id: id || `${parsed.league}_w${currentWeek}_g${gameIndex}`,

    league: parsed.league,
    season: SEASON,
    seasonPhase: parsed.seasonPhase,

    week: currentWeek,
    date: currentDate,

    time: time || "",

    teamA,
    teamB,

    scoreA,
    scoreB,

    winner,

    completed,

    status,
    resultType,

    playoff,
    playoffRound: round || null,

    forfeit: resultType === "forfeit",
  };

  parsed.games.push(game);
  gameIndex++;
}

// ======================================================
// FINALIZE
// ======================================================

parsed.teams = Array.from(teamSet).sort();

console.log("\n==============================");
console.log("📦 FINAL STATS");
console.log("==============================");
console.log("Games:", parsed.games.length);
console.log("Teams:", parsed.teams.length);

// ======================================================
// OUTPUT
// ======================================================

fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));

console.log("✅ OUTPUT WRITTEN:", outputPath);
console.log("🏁 PARSER COMPLETE\n");