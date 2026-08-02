// src/features/scheduleGenerator/utils/rotateTeams.ts

export function rotateTeams<T>(
  teams: T[]
): T[] {
  if (teams.length <= 2) {
    return teams;
  }

  const fixed = teams[0];

  const rest = teams.slice(1);

  rest.unshift(
    rest.pop()!
  );

  return [
    fixed,
    ...rest,
  ];
}