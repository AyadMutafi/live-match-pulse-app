import { useMemo } from "react";
import { useMatches } from "./useMatches";

// Generate match pulse data from real matches
export function useMatchPulse() {
  const { data: matches, isLoading, error } = useMatches();

  const liveMatchesData = useMemo(() => {
    if (!matches || matches.length === 0) {
      return [];
    }

    // Get live or recent finished matches
    const relevantMatches = matches
      .filter(m => m.status === "live" || m.status === "in_play" || m.status === "finished")
      .slice(0, 4);

    return relevantMatches.map(match => {
      const homeScore = match.home_score || 0;
      const awayScore = match.away_score || 0;
      
      // Calculate pulse based on score
      let homePulse = 50;
      let awayPulse = 50;
      
      if (homeScore > awayScore) {
        homePulse = 75 + (homeScore - awayScore) * 5;
        awayPulse = 35 - (homeScore - awayScore) * 3;
      } else if (awayScore > homeScore) {
        awayPulse = 75 + (awayScore - homeScore) * 5;
        homePulse = 35 - (awayScore - homeScore) * 3;
      } else {
        homePulse = 60;
        awayPulse = 60;
      }

      // Clamp values
      homePulse = Math.min(Math.max(homePulse, 20), 95);
      awayPulse = Math.min(Math.max(awayPulse, 20), 95);

      // Determine sentiment
      const getTeamSentiment = (pulse: number) => {
        if (pulse >= 80) return "on_fire" as const;
        if (pulse >= 65) return "good" as const;
        if (pulse >= 45) return "okay" as const;
        if (pulse >= 30) return "bad" as const;
        return "awful" as const;
      };

      const getTrend = (pulse: number) => {
        if (pulse >= 70) return "up" as const;
        if (pulse >= 45) return "stable" as const;
        return "down" as const;
      };

      return {
        matchId: match.id,
        homeTeam: {
          name: match.home_team?.name || "Home Team",
          pulse: homePulse,
          trend: getTrend(homePulse),
          sentiment: getTeamSentiment(homePulse),
          recentMentions: Math.floor(Math.random() * 3000) + 1000,
        },
        awayTeam: {
          name: match.away_team?.name || "Away Team",
          pulse: awayPulse,
          trend: getTrend(awayPulse),
          sentiment: getTeamSentiment(awayPulse),
          recentMentions: Math.floor(Math.random() * 3000) + 1000,
        },
        matchTime: match.status === "live" || match.status === "in_play" ? `${Math.floor(Math.random() * 45) + 1}'` : "FT",
        status: match.status === "live" || match.status === "in_play" ? ("LIVE" as const) : ("FT" as const),
        totalEngagement: Math.floor(Math.random() * 15000) + 5000,
        topReactions: ["⚽", "🔥", "👏", "😍", "💪", "🎯", "⭐"],
        trendingHashtags: [
          match.competition.replace(/\s+/g, ""),
          match.home_team?.name?.replace(/\s+/g, "") || "Home",
          match.away_team?.name?.replace(/\s+/g, "") || "Away",
        ],
        liveUpdates: [
          {
            text: `${match.home_team?.name} ${homeScore} - ${awayScore} ${match.away_team?.name}`,
            sentiment: homePulse > awayPulse ? ("positive" as const) : ("negative" as const),
            team: homePulse > awayPulse ? ("home" as const) : ("away" as const),
            timestamp: "Now",
          },
        ],
      };
    });
  }, [matches]);

  return {
    liveMatchesData,
    isLoading,
    error,
  };
}
