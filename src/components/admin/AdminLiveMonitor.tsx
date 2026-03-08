import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, RefreshCw, Zap, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminLiveMonitor() {
  const queryClient = useQueryClient();
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const { data: activeMatches = [], isLoading } = useQuery({
    queryKey: ["admin-active-matches"],
    queryFn: async () => {
      const { data } = await supabase
        .from("match_monitoring")
        .select("*, matches(*, home_team:teams!matches_home_team_id_fkey(id, name), away_team:teams!matches_away_team_id_fkey(id, name))")
        .eq("active", true)
        .order("created_at");
      return data || [];
    },
    refetchInterval: 30000,
  });

  const { data: snapshots = [] } = useQuery({
    queryKey: ["admin-snapshots"],
    queryFn: async () => {
      const matchIds = activeMatches.map((m: any) => m.match_id);
      if (matchIds.length === 0) return [];
      const { data } = await supabase
        .from("sentiment_snapshots")
        .select("*")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: activeMatches.length > 0,
    refetchInterval: 30000,
  });

  const fetchSentiment = useMutation({
    mutationFn: async (monitoring: any) => {
      setFetchingId(monitoring.id);
      const match = monitoring.matches;
      const homeTeamId = match.home_team?.id;
      const awayTeamId = match.away_team?.id;

      // Get sources for both teams
      const { data: homeSources } = await supabase
        .from("data_sources").select("*").eq("team_id", homeTeamId).eq("active", true);
      const { data: awaySources } = await supabase
        .from("data_sources").select("*").eq("team_id", awayTeamId).eq("active", true);

      // Build search keywords from configured sources
      const homeKeywords = (homeSources || []).map((s: any) => s.hashtag || `@${s.handle}`).join(" OR ");
      const awayKeywords = (awaySources || []).map((s: any) => s.hashtag || `@${s.handle}`).join(" OR ");

      const homeName = match.home_team?.name || "Home";
      const awayName = match.away_team?.name || "Away";

      // Fetch sentiment for home team
      const { data: homeData } = await supabase.functions.invoke("analyze-football-sentiment", {
        body: {
          keyword: `${homeName} fans ${homeKeywords}`,
          limit: 15,
          sources: homeSources?.map((s: any) => s.handle || s.hashtag) || [],
        },
      });

      await new Promise(r => setTimeout(r, 3000));

      // Fetch sentiment for away team
      const { data: awayData } = await supabase.functions.invoke("analyze-football-sentiment", {
        body: {
          keyword: `${awayName} fans ${awayKeywords}`,
          limit: 15,
          sources: awaySources?.map((s: any) => s.handle || s.hashtag) || [],
        },
      });

      // Convert to sentiment score
      const homeScore = homeData?.percentages?.positive || 50;
      const awayScore = awayData?.percentages?.positive || 50;
      const getEmoji = (s: number) => s >= 90 ? "🔥" : s >= 70 ? "😍" : s >= 50 ? "🙂" : s >= 30 ? "😐" : s >= 10 ? "😤" : "💩";

      // Save snapshot
      const { error } = await supabase.from("sentiment_snapshots").insert({
        match_id: monitoring.match_id,
        home_sentiment: homeScore,
        home_emoji: getEmoji(homeScore),
        home_breakdown: homeData?.percentages || {},
        home_themes: homeData?.themes || [],
        home_sample_tweets: homeData?.results || [],
        away_sentiment: awayScore,
        away_emoji: getEmoji(awayScore),
        away_breakdown: awayData?.percentages || {},
        away_themes: awayData?.themes || [],
        away_sample_tweets: awayData?.results || [],
        tweets_analyzed: (homeData?.total_posts || 0) + (awayData?.total_posts || 0),
        ai_confidence: Math.round(((homeData?.total_posts || 0) + (awayData?.total_posts || 0)) / 2),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-snapshots"] });
      setFetchingId(null);
      toast({ title: "Sentiment fetched & saved!" });
    },
    onError: (e: any) => {
      setFetchingId(null);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const fetchAll = async () => {
    for (const m of activeMatches) {
      await fetchSentiment.mutateAsync(m);
      await new Promise(r => setTimeout(r, 3000));
    }
  };

  const getLatestSnapshot = (matchId: string) => snapshots.find((s: any) => s.match_id === matchId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-green-500 animate-pulse" /> Live Monitor
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={fetchAll} disabled={fetchSentiment.isPending}>
            <Zap className="h-3.5 w-3.5 mr-1" /> Fetch All Now
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading active matches...</p>
        ) : activeMatches.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No active matches. Activate matches in the Weekly Setup tab.</p>
          </div>
        ) : (
          activeMatches.map((m: any) => {
            const match = m.matches;
            const homeName = match?.home_team?.name || "Home";
            const awayName = match?.away_team?.name || "Away";
            const latest = getLatestSnapshot(m.match_id);
            const isFetching = fetchingId === m.id;

            return (
              <div key={m.id} className="p-4 rounded-lg border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-foreground">{homeName} vs {awayName}</span>
                    <Badge className="ml-2 text-[10px] bg-green-500/20 text-green-400 border-green-500/30">ACTIVE</Badge>
                  </div>
                  <Button
                    size="sm" variant="outline"
                    onClick={() => fetchSentiment.mutate(m)}
                    disabled={isFetching}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isFetching ? "animate-spin" : ""}`} />
                    {isFetching ? "Fetching..." : "Fetch Now"}
                  </Button>
                </div>

                {latest ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <div className="text-2xl">{latest.home_emoji}</div>
                      <div className="text-lg font-bold text-foreground">{latest.home_sentiment}%</div>
                      <div className="text-xs text-muted-foreground">{homeName} Fans</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <div className="text-2xl">{latest.away_emoji}</div>
                      <div className="text-lg font-bold text-foreground">{latest.away_sentiment}%</div>
                      <div className="text-xs text-muted-foreground">{awayName} Fans</div>
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span><Clock className="h-3 w-3 inline mr-1" />{new Date(latest.created_at).toLocaleTimeString()}</span>
                      <span>📊 {latest.tweets_analyzed} tweets analyzed</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">No sentiment data yet. Click "Fetch Now" to start.</p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
