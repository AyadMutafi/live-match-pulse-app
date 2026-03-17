import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamOfWeek(weekStart: string, weekEnd: string, competition?: string) {
  return useQuery({
    queryKey: ["team-of-week", weekStart, weekEnd, competition],
    queryFn: async () => {
      // First try to build from DB sentiment scores
      const league = competition || 'Premier League';
      const { data: dbScores } = await supabase
        .from("player_sentiment_scores")
        .select("*")
        .eq("league", league)
        .gte("analyzed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("sentiment_score", { ascending: false })
        .limit(20);

      // If we have enough DB data, use it to build the team
      if (dbScores && dbScores.length >= 11) {
        return buildTeamFromScores(dbScores, league);
      }

      // Fallback to edge function
      const { data, error } = await supabase.functions.invoke('generate-team-of-week', {
        body: { weekStart, weekEnd, competition }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!(weekStart && weekEnd),
  });
}

function buildTeamFromScores(scores: any[], league: string) {
  const positions = { GK: 1, DEF: 3, MID: 3, FW: 4 };
  const posMap: Record<string, string> = {
    GK: 'GK', CB: 'DEF', LB: 'DEF', RB: 'DEF', DEF: 'DEF',
    CM: 'MID', AM: 'MID', DM: 'MID', MID: 'MID',
    ST: 'FW', LW: 'FW', RW: 'FW', CF: 'FW', FW: 'FW',
  };

  const grouped: Record<string, any[]> = { GK: [], DEF: [], MID: [], FW: [] };
  for (const s of scores) {
    const group = posMap[s.position] || 'MID';
    grouped[group].push(s);
  }

  const selected: any[] = [];
  for (const [group, count] of Object.entries(positions)) {
    const picks = grouped[group].slice(0, count);
    selected.push(...picks);
  }

  // Fill remaining slots from highest scores
  while (selected.length < 11 && scores.length > selected.length) {
    const next = scores.find(s => !selected.includes(s));
    if (next) selected.push(next);
    else break;
  }

  return {
    matchesAnalyzed: scores.length,
    teamOfWeek: {
      formation: "4-3-3",
      players: selected.slice(0, 11).map((s, i) => ({
        name: s.player_name,
        team: s.team,
        position: s.position || 'MID',
        rating: Math.round(((s.sentiment_score + 1) / 2) * 100),
        reason: `Sentiment: ${s.sentiment_score > 0 ? '🔥' : '😐'} ${((s.sentiment_score + 1) / 2 * 100).toFixed(0)}% positive`,
      })),
    },
    matchSummaries: [`Based on ${scores.length} real-time Firecrawl + Gemini sentiment analyses from X.com`],
    source: 'firecrawl_db',
  };
}
