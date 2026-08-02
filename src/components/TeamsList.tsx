// src/components/TeamsList

type Props = {
  league: string;
  season: string;
};

type Team = {
  teamId: string;
  displayName?: string;
  captain?: string;
};

import { useTeams } from "src/hooks/useTeams";

export default function TeamsList({ league, season }: Props) {
  const { teams, loading } = useTeams(league, season);

  if (loading) return <div>Loading teams...</div>;

  return (
    <div className="space-y-2">
      {teams.map((team: Team) => (
        <div key={team.teamId} className="flex justify-between border p-2 rounded">
          <div>{team.displayName || team.teamId}</div>
          <div className="text-gray-500">{team.captain}</div>
        </div>
      ))}
    </div>
  );
}