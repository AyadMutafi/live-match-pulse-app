import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { TARGET_CLUBS, getClubInfo, getSentimentCategory } from "@/lib/constants";
import { TrendingUp, Flame, Clock, ChevronRight } from "lucide-react";

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

export function HomeTab({ favoriteClubs, onNavigate }: HomeTabProps) {
  const [clubSentiments, setClubSentiments] = useState<ClubSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);

  useEffect(() => {
    fetchHomeData();
  }, [favoriteClubs]);

  const fetchHomeData = async () => {
    try {
      // Fetch recent matches with sentiments for favorite clubs
      const { data: matches } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name),
          away_team:teams!matches_away_team_id_fkey(id, name)
        `)
        .order("match_date", { ascending: false })
        .limit(20);

      setRecentMatches(matches?.slice(0, 5) || []);

      // Build club sentiment summary from sentiment_snapshots
      const sentiments: ClubSentiment[] = [];

      for (const clubName of favoriteClubs) {
        const club = getClubInfo(clubName);
        if (!club) continue;

        // Get latest sentiment for this club's matches
        const { data: snapshots } = await supabase
          .from("sentiment_snapshots")
          .select("home_sentiment, away_sentiment, match_id")
          .order("created_at", { ascending: false })
          .limit(5);

        const avgSentiment = snapshots?.length
          ? Math.round(
              snapshots.reduce(
                (sum, s) => sum + ((s.home_sentiment || 50) + (s.away_sentiment || 50)) / 2,
                0
              ) / snapshots.length
            )
          : 50;

        const category = getSentimentCategory(avgSentiment);

        sentiments.push({
          clubName: club.name,
          shortName: club.shortName,
          color: club.color,
          sentiment: avgSentiment,
          emoji: category.emoji,
          label: category.name,
          matchCount: snapshots?.length || 0,
        });
      }

      setClubSentiments(sentiments);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Your Pulse 📡</h2>
        <p className="text-sm text-muted-foreground">
          How your clubs' fans are feeling right now
        </p>
      </div>

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
                <div
                  className="h-1"
                  style={{ backgroundColor: club.color }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${club.color}20` }}
                      >
                        {club.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {club.shortName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {club.label} · {club.matchCount} recent matches
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        {club.sentiment}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Fan Mood
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No sentiment data yet for your clubs. Check the Sentiments tab!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onNavigate("sentiments")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Live Sentiments</p>
              <p className="text-[10px] text-muted-foreground">Real-time fan mood</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onNavigate("rivals")}
        >
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
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
              onClick={() => onNavigate("sentiments")}
            >
              View All <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
          {recentMatches.map((match: any) => (
            <Card key={match.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {match.home_team?.name || "TBD"} vs{" "}
                      {match.away_team?.name || "TBD"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(match.match_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {match.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
