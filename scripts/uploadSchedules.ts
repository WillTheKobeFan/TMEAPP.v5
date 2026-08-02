// scripts/uploadSchedules.ts

import fs from "fs";
import path from "path";
import { db } from "../src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const SEASON_ID = "spring2026";

const LEAGUES = [
  {
    league: "sunday",
    file: "sun.txt",
  },
  {
    league: "monday",
    file: "mon.txt",
  },
  {
    league: "wednesday",
    file: "wed.txt",
  },
];

type Game = {
  id: string;
  time: string;
  team1Id?: string;
  team2Id?: string;
  team1Score: number | null;
  team2Score: number | null;
  score: string | null;
  winner: string | null;
  status: string;
  type: string;
  resultType: string | null;
  round?: string | null;
  matchup?: string;
};

type WeekDoc = {
  week: number;
  date: string | null;
  games: Game[];
  bye: string[];
  announcements: any[];
};

function getValue(line: string, key: string) {
  const match = line.match(new RegExp(`${key}:\\s*([^|]+)`, "i"));
  return match?.[1]?.trim() ?? null;
}

function parseScore(scoreRaw: string | null) {
  if (!scoreRaw || scoreRaw === "N/A" || scoreRaw === "null") {
    return {
      score: null,
      team1Score: null,
      team2Score: null,
    };
  }

  function addDays(dateString: string, days: number) {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function getAnchorDate(rawText: string) {
    const match = rawText.match(
      /ANCHOR_WEEK:\s*WEEK\s*1\s*=\s*\(DATE:\s*([0-9-]+)\)/i
    );

    return match?.[1] ?? null;
  }

  if (scoreRaw.toUpperCase() === "FORFEIT") {
    return {
      score: "FORFEIT",
      team1Score: null,
      team2Score: null,
    };
  }

  const parts = scoreRaw.split("-").map((value) => Number(value.trim()));

  return {
    score: scoreRaw,
    team1Score: Number.isFinite(parts[0]) ? parts[0] : null,
    team2Score: Number.isFinite(parts[1]) ? parts[1] : null,
  };
}

function parseMatchup(line: string) {
  const parts = line.split("|").map((part) => part.trim());

  const matchupPart =
    parts.find((part) => part.includes(" vs ")) ??
    getValue(line, "MATCHUP") ??
    "";

  const cleanMatchup = matchupPart
    .replace(/^MATCHUP:\s*/i, "")
    .trim();

  const [left, right] = cleanMatchup.split(" vs ").map((value) => value.trim());

  const cleanTeam = (value?: string) => {
    if (!value) return undefined;

    return value
      .replace(/^seed\d+:/i, "")
      .replace(/^winner:/i, "")
      .replace(/^seed\d+_/i, "")
      .trim();
  };

  return {
    matchup: cleanMatchup,
    team1Id: cleanTeam(left),
    team2Id: cleanTeam(right),
  };
}

function parseSchedule(rawText: string): WeekDoc[] {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const weeks: WeekDoc[] = [];
  let currentWeek: WeekDoc | null = null;

  for (const line of lines) {
    const weekMatch = line.match(/^WEEK\s+(\d+)(?:\s+\|\s+DATE:\s*([0-9-]+))?/i);

    if (weekMatch) {
      currentWeek = {
        week: Number(weekMatch[1]),
        date: weekMatch[2] ?? null,
        games: [],
        bye: [],
        announcements: [],
      };

      weeks.push(currentWeek);
      continue;
    }

    if (!currentWeek) continue;

    if (line.startsWith("GAME |")) {
      const id = getValue(line, "ID") ?? `game_${currentWeek.games.length + 1}`;
      const time = getValue(line, "TIME") ?? line.split("|")[2]?.trim() ?? "TBD";
      const scoreRaw = getValue(line, "SCORE");
      const winnerRaw = getValue(line, "WINNER");
      const status = getValue(line, "STATUS") ?? "scheduled";
      const type = getValue(line, "TYPE") ?? "regular";
      const resultType = getValue(line, "RESULT_TYPE");
      const round = getValue(line, "ROUND");

      const matchup = parseMatchup(line);
      const score = parseScore(scoreRaw);

      currentWeek.games.push({
        id,
        time,
        team1Id: matchup.team1Id,
        team2Id: matchup.team2Id,
        matchup: matchup.matchup,
        team1Score: score.team1Score,
        team2Score: score.team2Score,
        score: score.score,
        winner:
          !winnerRaw || winnerRaw === "N/A" || winnerRaw === "null"
            ? null
            : winnerRaw,
        status: status === "final" ? "completed" : status,
        type: type.toLowerCase(),
        resultType:
          !resultType || resultType === "null" || resultType === "N/A"
            ? null
            : resultType,
        round,
      });

      continue;
    }

    if (line.startsWith("BYE |")) {
      const team = getValue(line, "TEAM");

      if (team) {
        currentWeek.bye.push(team);
      }

      continue;
    }

    if (line.startsWith("ANNOUNCEMENT |")) {
      currentWeek.announcements.push({
        type: getValue(line, "TYPE"),
        phase: getValue(line, "PHASE"),
        priority: getValue(line, "PRIORITY"),
        message: getValue(line, "MESSAGE") ?? line,
      });
    }
  }

  return weeks;
}
function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getAnchorDate(rawText: string) {
  const match = rawText.match(
    /ANCHOR_WEEK:\s*WEEK\s*1\s*=\s*\(DATE:\s*([0-9-]+)\)/i
  );

  return match?.[1] ?? null;
}
async function uploadLeague(league: string, fileName: string) {
  console.log("================================");
  console.log(`Uploading ${league} schedule...`);

  const filePath = path.join(process.cwd(), "data", "raw", fileName);
  const rawText = fs.readFileSync(filePath, "utf8");

  const weeks = parseSchedule(rawText);
  const anchorDate = getAnchorDate(rawText);

  if (anchorDate) {
    weeks.forEach((week) => {
      if (!week.date) {
        week.date = addDays(anchorDate, (week.week - 1) * 7);
      }
    });
  }

  console.log(`${league}: ${weeks.length} weeks parsed`);

  if (anchorDate) {
    console.log(`${league}: anchor date ${anchorDate}`);
  }

  for (const week of weeks) {
    await setDoc(
      doc(
        db,
        "leagues",
        league,
        "seasons",
        SEASON_ID,
        "weeks",
        `week_${week.week}`
      ),
      week
    );

    console.log(
      `${league}: week_${week.week} uploaded (${week.games.length} games, ${week.bye.length} byes)`
    );
  }

  console.log(`✓ ${league} upload complete`);
}

async function main() {
  console.log("Starting schedule upload...");

  for (const item of LEAGUES) {
    await uploadLeague(item.league, item.file);
  }

  console.log("================================");
  console.log("ALL SCHEDULES UPLOADED");
  console.log("================================");
}

main().catch((error) => {
  console.error("Upload failed:", error);
  process.exit(1);
});