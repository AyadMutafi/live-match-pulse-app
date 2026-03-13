import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { TARGET_CLUBS, getClubInfo, getSentimentCategory } from "@/lib/constants";
import { TrendingUp, Flame, Clock, ChevronRight, Share2, Target, Calendar } from "lucide-react";
import { SentimentAlert } from "@/components/SentimentAlert";
import { ShareableMoodCard } from "@/components/ShareableMoodCard";
import { FanPrediction } from "@/components/FanPrediction";
import { PullToRefresh } from "@/components/PullToRefresh";
import { getTeamLogo } from "@/lib/teamLogos";
import { usePredictions } from "@/hooks/usePredictions";

interface HomeTabProps {
  favoriteClubs: string[];
  onNavigate: (tab: string) => void;
}

interface ClubSentiment {
  clubName: string;
  shortName: string;
  color: string;
  sentiment: number;
  emoji: string;
  label: string;
  matchCount: number;
}

interface RecentMatch {
  id: string;
  home_team: { name: string } | null;
  away_team: { name: string } | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string;
  status: string;
  homeSentiment?: number;
  awaySentiment?: number;
}

export function HomeTab({ favoriteClubs, onNavigate }: HomeTabProps) {
  const [clubSentiments, setClubSentiments] = useState<ClubSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<RecentMatch[]>([]);
  const [shareMatch, setShareMatch] = useState<RecentMatch | null>(null);
  const { stats } = usePredictions();

  const fetchHomeData = useCallback(async () => {
    try {
      const { data: matches } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name),
          away_team:teams!matches_away_team_id_fkey(id, name)
        `)
        .order("match_date", { ascending: false })
        .limit(20);

      const matchIds = matches?.map(m => m.id) || [];
      const { data: snapshots } = await supabase
        .from("sentiment_snapshots")
        .select("*")
        .in("match_id", matchIds);

      const now = new Date();
      const allMatches = (matches || []).map((m: any) => {
        const snap = snapshots?.find(s => s.match_id === m.id);
        return {
          ...m,
          homeSentiment: snap?.home_sentiment || undefined,
          awaySentiment: snap?.away_sentiment || undefined,
        };
      });

      // Split into past and upcoming
      const past = allMatches.filter((m: any) => new Date(m.match_date) <= now).slice(0, 5);
      const upcoming = allMatches.filter((m: any) => new Date(m.match_date) > now && m.status !== "FINISHED").slice(0, 3);

      setRecentMatches(past);
      setUpcomingMatches(upcoming);

      // Build club sentiment summary
      const sentiments: ClubSentiment[] = [];
      for (const clubName of favoriteClubs) {
        const club = getClubInfo(clubName);
        if (!club) continue;

        const { data: clubSnapshots } = await supabase
          .from("sentiment_snapshots")
          .select("home_sentiment, away_sentiment, match_id, match:matches(home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name))")
          .order("created_at", { ascending: false })
          .limit(10);

        const relevantSnapshots = (clubSnapshots || []).filter((s: any) => {
          const homeName = s.match?.home_team?.name?.toLowerCase() || "";
          const awayName = s.match?.away_team?.name?.toLowerCase() || "";
          return club.aliases.some(a =>
            homeName.includes(a.toLowerCase()) || awayName.includes(a.toLowerCase())
          );
        });

        if (relevantSnapshots.length > 0) {
          let total = 0;
          let count = 0;
          for (const snap of relevantSnapshots.slice(0, 5)) {
            const homeName = snap.match?.home_team?.name?.toLowerCase() || "";
            const isHome = club.aliases.some(a => homeName.includes(a.toLowerCase()));
            total += isHome ? (snap.home_sentiment || 50) : (snap.away_sentiment || 50);
            count++;
          }
          const avgSentiment = Math.round(total / count);
          const category = getSentimentCategory(avgSentiment);
          sentiments.push({
            clubName: club.name, shortName: club.shortName, color: club.color,
            sentiment: avgSentiment, emoji: category.emoji, label: category.name, matchCount: count,
          });
        } else {
          sentiments.push({
            clubName: club.name, shortName: club.shortName, color: club.color,
            sentiment: 50, emoji: "😐", label: "Awaiting data", matchCount: 0,
          });
        }
      }
      setClubSentiments(sentiments);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
  }, [favoriteClubs]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchHomeData();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SentimentAlert favoriteClubs={favoriteClubs} enabled={true} />

        {/* Greeting + Stats */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Pulse 📡</h2>
            <p className="text-sm text-muted-foreground">
              How your clubs' fans are feeling right now
            </p>
          </div>
          {stats.total > 0 && (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Target className="w-3 h-3" />
              {Math.round((stats.correct / stats.total) * 100)}% accuracy
            </Badge>
          )}
        </div>

        {/* Prediction Widget for upcoming matches */}
        {upcomingMatches.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Predict Fan Mood
            </h3>
            {upcomingMatches.slice(0, 2).map((match) => (
              <FanPrediction
                key={match.id}
                matchId={match.id}
                homeTeam={match.home_team?.name || "Home"}
                awayTeam={match.away_team?.name || "Away"}
                matchDate={match.match_date}
              />
            ))}
          </div>
        )}

        {/* Club Sentiment Cards */}
        {clubSentiments.length > 0 ? (
          <div className="space-y-3">
            {clubSentiments.map((club, i) => (
              <motion.div
                key={club.clubName}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: club.color }} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getTeamLogo(club.shortName)}
                          alt={club.shortName}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{club.shortName}</p>
                          <p className="text-xs text-muted-foreground">
                            {club.matchCount > 0
                              ? `${club.label} · ${club.matchCount} recent matches`
                              : "No matches analyzed yet — check back soon!"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-2xl">{club.emoji}</span>
                          <p className="text-2xl font-bold text-foreground">{club.sentiment}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fan Mood</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center space-y-2">
              <span className="text-3xl">📊</span>
              <p className="text-sm font-medium text-foreground">No clubs selected yet</p>
              <p className="text-xs text-muted-foreground">
                Head to the Sentiments tab to explore live fan mood for 25+ clubs!
              </p>
              <Button variant="outline" size="sm" onClick={() => onNavigate("sentiments")}>
                Explore Sentiments
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onNavigate("sentiments")}>
            <CardContent className="p-4 flex items-center gap-3">
              <Flame className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-foreground">Live Sentiments</p>
                <p className="text-[10px] text-muted-foreground">Real-time fan mood</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onNavigate("rivals")}>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Rivalry Hub</p>
                <p className="text-[10px] text-muted-foreground">Who's happier?</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent Matches
              </h3>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => onNavigate("sentiments")}>
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
            {recentMatches.map((match: RecentMatch) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {match.home_team?.name || "TBD"} vs {match.away_team?.name || "TBD"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(match.match_date).toLocaleDateString()}
                        </p>
                        {match.homeSentiment && match.awaySentiment && (
                          <Badge variant="secondary" className="text-[9px]">
                            {getSentimentCategory(match.homeSentiment).emoji} vs {getSentimentCategory(match.awaySentiment).emoji}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{match.status}</Badge>
                      {match.homeSentiment && match.awaySentiment && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareMatch(match);
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Share Modal */}
        {shareMatch && shareMatch.homeSentiment && shareMatch.awaySentiment && (
          <ShareableMoodCard
            homeTeam={shareMatch.home_team?.name || "Home"}
            awayTeam={shareMatch.away_team?.name || "Away"}
            homeScore={shareMatch.home_score ?? undefined}
            awayScore={shareMatch.away_score ?? undefined}
            homeSentiment={shareMatch.homeSentiment}
            awaySentiment={shareMatch.awaySentiment}
            onClose={() => setShareMatch(null)}
          />
        )}
      </motion.div>
    </PullToRefresh>
  );
}
