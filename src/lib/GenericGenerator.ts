// src/lib/GenericGenerator.ts

export type GenericTeam = {
  id: string;
  name: string;
};

export type GenericGame = {
  id: string;
  week: number;
  date: string;
  time: string;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  status: "scheduled";
  type: "regular";
  resultType: "pending";
};

export type GenericWeek = {
  week: number;
  date: string;
  games: GenericGame[];
  byes: GenericTeam[];
};

export type GenericGeneratorInput = {
  league: string;
  seasonId: string;
  startDate: string;
  teams: GenericTeam[];
  regularWeeks: number;
  timeSlots: string[];
  gamesPerNight: number;
  venue?: string;

  exactByeCount?: number;
  avoidBackToBackRematches?: boolean;
  requireEveryoneOnce?: boolean;

  // Optional: lets Week 9/10 have fewer games later if needed
  gamesPerWeek?: Record<number, number>;
};

const MAX_ATTEMPTS = 1000;

function addWeeks(startDate: string, weeksToAdd: number) {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + weeksToAdd * 7);
  return date.toISOString().slice(0, 10);
}

function matchupKey(a: string, b: string) {
  return [a, b].sort().join("__");
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function generateGenericSchedule(
  input: GenericGeneratorInput
): GenericWeek[] {
  const {
    league,
    seasonId,
    startDate,
    teams,
    regularWeeks,
    timeSlots,
    gamesPerNight,
    exactByeCount,
    avoidBackToBackRematches = true,
    requireEveryoneOnce = true,
    gamesPerWeek = {},
  } = input;

  if (teams.length < 2) {
    throw new Error("At least 2 teams are required.");
  }

  if (timeSlots.length === 0) {
    throw new Error("At least 1 time slot is required.");
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const weeks: GenericWeek[] = [];
    const byeCounts: Record<string, number> = {};
    const matchupCounts: Record<string, number> = {};
    let previousWeekKeys = new Set<string>();

    teams.forEach((team) => {
      byeCounts[team.id] = 0;
    });

    let failed = false;

    for (let week = 1; week <= regularWeeks; week++) {
      const date = addWeeks(startDate, week - 1);

      const weeklyGamesPerNight =
        gamesPerWeek[week] ?? gamesPerNight;

      const availableSlots = timeSlots.slice(0, weeklyGamesPerNight);

      const maxGames = Math.min(
        availableSlots.length,
        Math.floor(teams.length / 2)
      );

      const byeAmount = teams.length - maxGames * 2;

      const byeTeams = shuffle(teams)
        .sort((a, b) => byeCounts[a.id] - byeCounts[b.id])
        .slice(0, byeAmount);

      const byeIds = new Set(byeTeams.map((team) => team.id));

      byeTeams.forEach((team) => {
        byeCounts[team.id]++;
      });

      const playingTeams = shuffle(
        teams.filter((team) => !byeIds.has(team.id))
      );

      const games: GenericGame[] = [];
      const usedTeamIds = new Set<string>();
      const currentWeekKeys = new Set<string>();

      for (const slot of availableSlots) {
        const availableTeams = playingTeams.filter(
          (team) => !usedTeamIds.has(team.id)
        );

        if (availableTeams.length < 2) break;

        let bestPair: [GenericTeam, GenericTeam] | null = null;
        let bestScore = Number.POSITIVE_INFINITY;

        for (let i = 0; i < availableTeams.length; i++) {
          for (let j = i + 1; j < availableTeams.length; j++) {
            const team1 = availableTeams[i];
            const team2 = availableTeams[j];
            const key = matchupKey(team1.id, team2.id);

            if (
              avoidBackToBackRematches &&
              previousWeekKeys.has(key)
            ) {
              continue;
            }

            const score =
              (matchupCounts[key] ?? 0) * 10 +
              Math.random();

            if (score < bestScore) {
              bestScore = score;
              bestPair = [team1, team2];
            }
          }
        }

        if (!bestPair) {
          failed = true;
          break;
        }

        const [team1, team2] = bestPair;
        const key = matchupKey(team1.id, team2.id);

        usedTeamIds.add(team1.id);
        usedTeamIds.add(team2.id);
        currentWeekKeys.add(key);
        matchupCounts[key] = (matchupCounts[key] ?? 0) + 1;

        games.push({
          id: `${league}_${seasonId}_wk${week}_g${games.length + 1}`,
          week,
          date,
          time: slot,
          team1Id: team1.id,
          team1Name: team1.name,
          team2Id: team2.id,
          team2Name: team2.name,
          status: "scheduled",
          type: "regular",
          resultType: "pending",
        });
      }

      if (failed) break;

      weeks.push({
        week,
        date,
        games,
        byes: byeTeams,
      });

      previousWeekKeys = currentWeekKeys;
    }

    if (failed || weeks.length !== regularWeeks) continue;

    if (exactByeCount !== undefined) {
      const byeValid = teams.every(
        (team) => byeCounts[team.id] === exactByeCount
      );

      if (!byeValid) continue;
    }

    if (requireEveryoneOnce) {
      const allRequiredMatchups = new Set<string>();

      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          allRequiredMatchups.add(matchupKey(teams[i].id, teams[j].id));
        }
      }

      const playedKeys = new Set(Object.keys(matchupCounts));
      const everyonePlayed = [...allRequiredMatchups].every((key) =>
        playedKeys.has(key)
      );

      if (!everyonePlayed) continue;
    }

    return weeks;
  }

  throw new Error(
    "Unable to generate a valid generic schedule with the selected settings."
  );
}