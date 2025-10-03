import { useMemo } from "react";
import { useMatches } from "./useMatches";

// Generate team pulse data from real matches
export function useTeamPulse() {
  const { data: matches, isLoading, error } = useMatches();

  const teamPulseData = useMemo(() => {
    if (!matches || matches.length === 0) {
      return [];
    }

    // Extract unique teams and calculate pulse scores based on recent performance
    const teamsMap = new Map<string, {
      name: string;
      league: string;
      country: string;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
      matches: number;
    }>();

    matches.forEach(match => {
      if (match.status === "finished" && match.home_team && match.away_team) {
        // Process home team
        if (!teamsMap.has(match.home_team.name)) {
          teamsMap.set(match.home_team.name, {
            name: match.home_team.name,
            league: match.home_team.league,
            country: match.home_team.country,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            matches: 0,
          });
        }
        const homeTeam = teamsMap.get(match.home_team.name)!;
        homeTeam.matches++;
        homeTeam.goalsFor += match.home_score || 0;
        homeTeam.goalsAgainst += match.away_score || 0;
        
        if ((match.home_score || 0) > (match.away_score || 0)) {
          homeTeam.wins++;
        } else if ((match.home_score || 0) === (match.away_score || 0)) {
          homeTeam.draws++;
        } else {
          homeTeam.losses++;
        }

        // Process away team
        if (!teamsMap.has(match.away_team.name)) {
          teamsMap.set(match.away_team.name, {
            name: match.away_team.name,
            league: match.away_team.league,
            country: match.away_team.country,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            matches: 0,
          });
        }
        const awayTeam = teamsMap.get(match.away_team.name)!;
        awayTeam.matches++;
        awayTeam.goalsFor += match.away_score || 0;
        awayTeam.goalsAgainst += match.home_score || 0;
        
        if ((match.away_score || 0) > (match.home_score || 0)) {
          awayTeam.wins++;
        } else if ((match.away_score || 0) === (match.home_score || 0)) {
          awayTeam.draws++;
        } else {
          awayTeam.losses++;
        }
      }
    });

    // Calculate pulse scores and convert to component format
    const teams = Array.from(teamsMap.values()).map(team => {
      // Calculate pulse score based on performance (0-100)
      const winRate = team.matches > 0 ? (team.wins / team.matches) * 100 : 50;
      const goalDiff = team.goalsFor - team.goalsAgainst;
      const goalDiffScore = Math.min(Math.max(goalDiff * 5 + 50, 0), 100);
      const pulseScore = Math.round((winRate * 0.6 + goalDiffScore * 0.4));

      // Generate mock player data with realistic names
      const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"];
      const playerNames = [
        "Marcus Silva", "David Torres", "Alex Johnson", "Roberto Gomez", "James Wilson",
        "Lucas Martinez", "Carlos Rodriguez", "Michael Brown", "Antonio Lopez", "Daniel Garcia",
        "Francisco Santos", "Thomas Anderson", "Diego Fernandez", "Kevin Martinez", "Pablo Ruiz"
      ];
      
      const players = Array.from({ length: 5 }, (_, i) => ({
        id: `${team.name}-player-${i}`,
        name: playerNames[Math.floor(Math.random() * playerNames.length)],
        position: positions[i % positions.length],
        rating: Math.random() * 2 + 7.5,
        pulseScore: Math.floor(Math.random() * 30) + 70,
        mentions: Math.floor(Math.random() * 2000) + 500,
        sentiment: (["positive", "neutral", "negative"] as const)[Math.floor(Math.random() * 3)],
      })).sort((a, b) => b.rating - a.rating);

      return {
        teamName: team.name,
        league: `${team.league} - ${team.country}`,
        teamLogo: "",
        overallPulse: pulseScore,
        totalMentions: Math.floor(Math.random() * 10000) + 5000,
        languages: ["English", "Spanish", "French", "German"].slice(0, Math.floor(Math.random() * 3) + 2),
        players,
      };
    });

    // Sort by pulse score and return top teams
    return teams.sort((a, b) => b.overallPulse - a.overallPulse).slice(0, 6);
  }, [matches]);

  return {
    teamPulseData,
    isLoading,
    error,
  };
}
