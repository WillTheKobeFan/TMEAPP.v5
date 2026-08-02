//
// scripts/utils/scheduleParse.ts
//

// -----------------------------
// TYPES
// -----------------------------

export type LeagueNight = "sun" | "mon" | "wed";

export type Game = {
    gameId: string;

    leagueNight: LeagueNight;
    seasonId: string;

    week: number;
    date: string;
    time: string;

    team1Id: string;
    team2Id: string;

    team1Score: number | null;
    team2Score: number | null;

    winnerTeamId: string | null;

    status: "scheduled" | "completed";
    type: "regular" | "playoff" | "championship";
    resultType: "normal" | "forfeit" | "pending";

    phase: "regular" | "playoffs";

    round?: "quarterfinal" | "semifinal" | "championship";
};

export type Announcement = {
    id: string;
    leagueNight: LeagueNight;
    seasonId: string;
    week: number | null;
    date: string | null;
    message: string;
    type: "announcement";
};

export type ParsedScheduleResult = {
    games: Game[];
    announcements: Announcement[];
};

// -----------------------------
// HELPERS
// -----------------------------

function parseRound(value?: string): Game["round"] | undefined {
    if (!value) return undefined;

    const v = value.toLowerCase().trim();

    if (v === "quarterfinal") return "quarterfinal";
    if (v === "semifinal") return "semifinal";
    if (v === "championship") return "championship";

    return undefined;
}

// -----------------------------
// MAIN PARSER
// -----------------------------

export function parseSchedule(
    rawText: string,
    params: {
        leagueNight: LeagueNight;
        seasonId: string;
    }
): ParsedScheduleResult {
    const { leagueNight, seasonId } = params;

    const lines = rawText
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    const games: Game[] = [];
    const announcements: Announcement[] = [];

    let currentWeek: number | null = null;
    let currentDate: string | null = null;
    let currentPhase: "regular" | "playoffs" = "regular";
    let gameCounter = 1;

    // -----------------------------
    // PARSE LOOP
    // -----------------------------
    for (const line of lines) {

        // WEEK HEADER
        const weekMatch = line.match(/WEEK (\d+) \| DATE: (.+)/);
        if (weekMatch) {
            currentWeek = Number(weekMatch[1]);
            currentDate = weekMatch[2].trim();
            continue;
        }

        if (!currentWeek) continue;

        // PHASE SWITCH
        if (line.includes("SEASON PHASE")) {
            currentPhase = line.includes("PLAYOFFS")
                ? "playoffs"
                : "regular";
            continue;
        }

        // ANNOUNCEMENTS
        if (line.startsWith("ANNOUNCEMENT")) {
            const msg = line.match(/MESSAGE:\s*(.+)/);
            if (!msg) continue;

            announcements.push({
                id: `${leagueNight}_${seasonId}_wk${currentWeek}_${announcements.length}`,
                leagueNight,
                seasonId,
                week: currentWeek,
                date: currentDate,
                message: msg[1],
                type: "announcement"
            });

            continue;
        }

        // GAME LINES
        if (line.startsWith("GAME")) {
            const parts = line.split("|").map(p => p.trim());

            const time = parts[1];
            const teamSection = parts[2];

            const scoreRaw = parts
                .find(p => p.startsWith("SCORE:"))
                ?.replace("SCORE:", "")
                .trim();

            const winner = parts
                .find(p => p.startsWith("WINNER:"))
                ?.replace("WINNER:", "")
                .trim();

            const status = parts
                .find(p => p.startsWith("STATUS:"))
                ?.replace("STATUS:", "")
                .trim() as Game["status"];

            const type = parts
                .find(p => p.includes("type:"))
                ?.split(":")[1]
                ?.trim() as Game["type"];

            const resultType = parts
                .find(p => p.includes("resultType:"))
                ?.split(":")[1]
                ?.trim() as Game["resultType"];

            const round = parseRound(
                parts.find(p => p.includes("round:"))?.split(":")[1]
            );

            const id = parts
                .find(p => p.startsWith("ID:"))
                ?.replace("ID:", "")
                .trim();

            const [team1Id, , team2Id] = teamSection.split(" ");

            const [s1, s2] =
                scoreRaw && scoreRaw !== "N/A" && scoreRaw !== "FORFEIT"
                    ? scoreRaw.split("-").map(Number)
                    : [null, null];

            games.push({
                gameId:
                    id || `${leagueNight}-w${currentWeek}-g${gameCounter++}`,

                leagueNight,
                seasonId,

                week: currentWeek,
                date: currentDate || "",
                time,

                team1Id,
                team2Id,

                team1Score: isNaN(s1 as number) ? null : s1,
                team2Score: isNaN(s2 as number) ? null : s2,

                winnerTeamId: winner === "N/A" ? null : winner ?? null,

                status,
                type,
                resultType,

                phase: currentPhase,

                round
            });

            continue;
        }
    }

    // -----------------------------
    // FINAL OUTPUT
    // -----------------------------
    return {
        games,
        announcements
    };
}