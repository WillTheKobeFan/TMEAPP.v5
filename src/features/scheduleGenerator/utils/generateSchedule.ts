// src/features/scheduleGenerator/utils/generateSchedule.ts

import type {
  GenerateScheduleInput,
  GeneratedSchedule,
  IndividualSchedule,
  ScheduleGame,
  ScheduleWeek,
  TeamInput,
} from "../types";

const LEAGUE_TIMES: Record<string, string[]> = {
  sunday: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"],
  monday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  tuesday: ["6:30 PM", "7:30 PM", "8:30 PM"],
  wednesday: ["7:00 PM", "8:00 PM", "9:00 PM"],
};

const SUNDAY_LATE_ONLY_CAPTAINS = ["Timmy", "Prince"];
const SUNDAY_LATE_TIMES = ["11:00 AM", "12:00 PM"];
const SUNDAY_TOM_CAPTAIN = "Tom";

function getCaptainName(teamId: string, teams: TeamInput[]) {
  return teams.find((team) => team.id === teamId)?.captain ?? teamId;
}

function displayMatchup(team1: string, team2: string, teams: TeamInput[]) {
  return `${getCaptainName(team1, teams)} vs ${getCaptainName(team2, teams)}`;
}

function isSundayLateOnlyTeam(teamId: string, teams: TeamInput[]) {
  const captain = getCaptainName(teamId, teams);
  return SUNDAY_LATE_ONLY_CAPTAINS.includes(captain);
}

function isSundayTom(teamId: string, teams: TeamInput[]) {
  return getCaptainName(teamId, teams) === SUNDAY_TOM_CAPTAIN;
}

function rotateTeams<T>(teams: T[]) {
  if (teams.length <= 2) return teams;

  const fixed = teams[0];
  const rest = teams.slice(1);
  const last = rest[rest.length - 1];

  return [fixed, last, ...rest.slice(0, rest.length - 1)];
}

function buildPairings(teamIds: string[]) {
  const workingTeams = [...teamIds];

  if (workingTeams.length % 2 !== 0) {
    workingTeams.push("BYE");
  }

  const rounds: string[][][] = [];
  let rotatingTeams = workingTeams;

  const totalRounds = rotatingTeams.length - 1;

  for (let round = 0; round < totalRounds; round++) {
    const pairs: string[][] = [];

    for (let i = 0; i < rotatingTeams.length / 2; i++) {
      const team1 = rotatingTeams[i];
      const team2 = rotatingTeams[rotatingTeams.length - 1 - i];

      pairs.push([team1, team2]);
    }

    rounds.push(pairs);
    rotatingTeams = rotateTeams(rotatingTeams);
  }

  return rounds;
}

function getBestSundayTimeForGame(
  team1: string,
  team2: string,
  availableTimes: string[],
  teams: TeamInput[],
  lateSlotCounts: Record<string, Record<string, number>>
) {
  const hasLateOnlyTeam =
    isSundayLateOnlyTeam(team1, teams) || isSundayLateOnlyTeam(team2, teams);

  if (!hasLateOnlyTeam) {
    return availableTimes[0];
  }

  const lateAvailableTimes = availableTimes.filter((time) =>
    SUNDAY_LATE_TIMES.includes(time)
  );

  if (lateAvailableTimes.length === 0) {
    return undefined;
  }

  const lateOnlyTeam = isSundayLateOnlyTeam(team1, teams) ? team1 : team2;

  return [...lateAvailableTimes].sort((a, b) => {
    const aCount = lateSlotCounts[lateOnlyTeam]?.[a] ?? 0;
    const bCount = lateSlotCounts[lateOnlyTeam]?.[b] ?? 0;

    return aCount - bCount;
  })[0];
}

function recordSundayLateSlotCount(
  team1: string,
  team2: string,
  time: string,
  teams: TeamInput[],
  lateSlotCounts: Record<string, Record<string, number>>
) {
  if (!SUNDAY_LATE_TIMES.includes(time)) return;

  if (isSundayLateOnlyTeam(team1, teams)) {
    lateSlotCounts[team1][time] += 1;
  }

  if (isSundayLateOnlyTeam(team2, teams)) {
    lateSlotCounts[team2][time] += 1;
  }
}

function buildIndividualSchedules(
  weeks: ScheduleWeek[],
  teams: TeamInput[]
): IndividualSchedule[] {
  return teams.map((team) => {
    const weekRows = weeks.map((week) => {
      const game = week.games.find(
        (g) => g.team1 === team.id || g.team2 === team.id
      );

      const isHiddenBye = week.hiddenByes.includes(team.id);
      const isNormalBye = week.byes.includes(team.id);

      if (game) {
        const opponentId = game.team1 === team.id ? game.team2 : game.team1;

        return {
          week: week.week,
          status: "game" as const,
          time: game.time,
          opponent: getCaptainName(opponentId, teams),
          matchup: game.isChampionship
            ? `🏆 ${game.display} 🏆`
            : game.display,
        };
      }

      if (isHiddenBye) {
        return {
          week: week.week,
          status: "hiddenBye" as const,
          time: "Hidden BYE",
          opponent: "Championship Carryover",
          matchup: "Hidden BYE",
        };
      }

      if (isNormalBye) {
        return {
          week: week.week,
          status: "bye" as const,
          time: "BYE",
          opponent: "BYE",
          matchup: "BYE",
        };
      }

      return {
        week: week.week,
        status: "off" as const,
        time: "OFF",
        opponent: "OFF",
        matchup: "OFF",
      };
    });

    return {
      teamId: team.id,
      captain: team.captain,
      weeks: weekRows,
    };
  });
}

export function generateSchedule(input: GenerateScheduleInput): GeneratedSchedule {
  const { league, teams, weeks } = input;

  const times = LEAGUE_TIMES[league];
  const teamIds = teams.map((team) => team.id);

  const sundayCarryoverTeamIds =
    league === "sunday" ? input.sundayCarryoverTeamIds ?? [] : [];

  const sundayChampionshipTime =
    league === "sunday"
      ? input.sundayChampionshipTime ?? "12:00 PM"
      : undefined;

  const normalByeCounts: Record<string, number> = {};
  const lateSlotCounts: Record<string, Record<string, number>> = {};

  teamIds.forEach((teamId) => {
    normalByeCounts[teamId] = 0;

    lateSlotCounts[teamId] = {
      "11:00 AM": 0,
      "12:00 PM": 0,
    };
  });

  const pairings = buildPairings(teamIds);
  const generatedWeeks: ScheduleWeek[] = [];

  function canReceiveNormalBye(teamId: string) {
    if (league !== "sunday") return true;

    const maxNormalByes = sundayCarryoverTeamIds.includes(teamId) ? 1 : 2;

    return normalByeCounts[teamId] < maxNormalByes;
  }

  function addNormalBye(
    teamId: string,
    byes: string[],
    weekNumber: number
  ) {
    if (!teamIds.includes(teamId)) return;
    if (byes.includes(teamId)) return;

    if (
      league === "sunday" &&
      weekNumber === 10 &&
      isSundayTom(teamId, teams)
    ) {
      return;
    }

    if (canReceiveNormalBye(teamId)) {
      byes.push(teamId);
      normalByeCounts[teamId] += 1;
    }
  }

  function addGame(
    weekNumber: number,
    time: string,
    team1: string,
    team2: string,
    games: ScheduleGame[],
    isChampionship = false
  ) {
    games.push({
      week: weekNumber,
      time,
      team1,
      team2,
      display: displayMatchup(team1, team2, teams),
      isChampionship,
    });

    if (league === "sunday") {
      recordSundayLateSlotCount(
        team1,
        team2,
        time,
        teams,
        lateSlotCounts
      );
    }
  }

  function addRegularGameWithBestTime(
    weekNumber: number,
    team1: string,
    team2: string,
    games: ScheduleGame[],
    byes: string[],
    availableTimes: string[]
  ) {
    const time =
      league === "sunday"
        ? getBestSundayTimeForGame(
            team1,
            team2,
            availableTimes,
            teams,
            lateSlotCounts
          )
        : availableTimes[0];

    if (!time) {
      addNormalBye(team1, byes, weekNumber);
      addNormalBye(team2, byes, weekNumber);
      return availableTimes;
    }

    addGame(weekNumber, time, team1, team2, games);

    return availableTimes.filter((slot) => slot !== time);
  }

  for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
    const weekNumber = weekIndex + 1;
    const round = pairings[weekIndex % pairings.length];

    const games: ScheduleGame[] = [];
    const byes: string[] = [];
    const hiddenByes: string[] = [];

    const isSundayWeekOne = league === "sunday" && weekNumber === 1;

    const hasSundayChampionship =
      isSundayWeekOne &&
      sundayCarryoverTeamIds.length === 2 &&
      !!sundayChampionshipTime;

    if (hasSundayChampionship && sundayChampionshipTime) {
      const [champTeam1, champTeam2] = sundayCarryoverTeamIds;

      addGame(
        weekNumber,
        sundayChampionshipTime,
        champTeam1,
        champTeam2,
        games,
        true
      );

      hiddenByes.push(champTeam1, champTeam2);

      const regularWeekOneTeams = teamIds.filter(
        (teamId) => !sundayCarryoverTeamIds.includes(teamId)
      );

      let availableTimes = times.filter(
        (time) => time !== sundayChampionshipTime
      );

      for (let i = 0; i < regularWeekOneTeams.length; i += 2) {
        const team1 = regularWeekOneTeams[i];
        const team2 = regularWeekOneTeams[i + 1];

        if (!team1) continue;

        if (!team2) {
          addNormalBye(team1, byes, weekNumber);
          continue;
        }

        availableTimes = addRegularGameWithBestTime(
          weekNumber,
          team1,
          team2,
          games,
          byes,
          availableTimes
        );
      }
    } else {
      if (isSundayWeekOne) {
        sundayCarryoverTeamIds.forEach((teamId) => {
          if (teamIds.includes(teamId) && !hiddenByes.includes(teamId)) {
            hiddenByes.push(teamId);
          }
        });
      }

      const unavailableThisWeek = new Set(hiddenByes);
      let availableTimes = [...times];

      round.forEach(([team1, team2]) => {
        if (team1 === "BYE" && team2 !== "BYE") {
          if (!unavailableThisWeek.has(team2)) {
            addNormalBye(team2, byes, weekNumber);
          }
          return;
        }

        if (team2 === "BYE" && team1 !== "BYE") {
          if (!unavailableThisWeek.has(team1)) {
            addNormalBye(team1, byes, weekNumber);
          }
          return;
        }

        if (unavailableThisWeek.has(team1) || unavailableThisWeek.has(team2)) {
          return;
        }

        availableTimes = addRegularGameWithBestTime(
          weekNumber,
          team1,
          team2,
          games,
          byes,
          availableTimes
        );
      });
    }

    const accountedFor = new Set<string>();

    games.forEach((game) => {
      accountedFor.add(game.team1);
      accountedFor.add(game.team2);
    });

    byes.forEach((teamId) => accountedFor.add(teamId));
    hiddenByes.forEach((teamId) => accountedFor.add(teamId));

    teamIds.forEach((teamId) => {
      if (!accountedFor.has(teamId)) {
        addNormalBye(teamId, byes, weekNumber);
      }
    });

    const sortedGames = [...games].sort(
      (a, b) => times.indexOf(a.time) - times.indexOf(b.time)
    );

    generatedWeeks.push({
      week: weekNumber,
      games: sortedGames,
      byes,
      hiddenByes,
      byeDisplay: byes.map((id) => getCaptainName(id, teams)),
      hiddenByeDisplay: hiddenByes.map((id) => getCaptainName(id, teams)),
    });
  }

  return {
    league,
    weeks: generatedWeeks,
    individualSchedules: buildIndividualSchedules(generatedWeeks, teams),
  };
}