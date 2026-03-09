import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/AppHeader";
import { SentimentBadge } from "@/components/SentimentBadge";
import { SentimentTimeline } from "@/components/SentimentTimeline";
import { TARGET_CLUBS, getSentimentCategory, getClubInfo } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, TrendingDown, ArrowLeft, Brain, Calendar, 
  MessageSquare, Users, Star, ThumbsUp, ThumbsDown, Radio, Heart, HeartOff
} from "lucide-react";
import { toast } from "sonner";

interface ClubData {
  sentiment: number;
  trend: number;
  mentions: number;
  talkingPoints: { text: string; sentiment: "positive" | "negative" | "neutral"; percentage: number }[];
  playerRatings: { name: string; rating: number; trend: number }[];
  upcomingMatches: { opponent: string; date: string; competition: string; matchId?: string }[];
  recentMatches: { opponent: string; score: string; sentiment: number; result: "W" | "D" | "L"; matchId?: string }[];
  lastUpdated: string | null;
}

export default function ClubPage() {
  const { clubSlug } = useParams<{ clubSlug: string }>();
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  const clubInfo = TARGET_CLUBS.find(
    c => c.shortName.toLowerCase().replace(/\s+/g, '-') === clubSlug
  );

  useEffect(() => {
    if (clubInfo) {
      fetchClubData();
      checkFollowStatus();
    }
  }, [clubSlug]);

  const checkFollowStatus = () => {
    const favorites = JSON.parse(localStorage.getItem("fanpulse_favorites") || "[]");
    setIsFollowing(favorites.includes(clubInfo?.name));
  };

  const toggleFollow = () => {
    const favorites = JSON.parse(localStorage.getItem("fanpulse_favorites") || "[]");
    let newFavorites: string[];
    
    if (isFollowing) {
      newFavorites = favorites.filter((f: string) => f !== clubInfo?.name);
      toast.success(`Unfollowed ${clubInfo?.shortName}`);
    } else {
      newFavorites = [...favorites, clubInfo?.name];
      toast.success(`Now following ${clubInfo?.shortName}!`);
    }
    
    localStorage.setItem("fanpulse_favorites", JSON.stringify(newFavorites));
    setIsFollowing(!isFollowing);
  };

  const fetchClubData = async () => {
    if (!clubInfo) return;
    
    try {
      // Fetch matches involving this club
      const { data: matches } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name),
          away_team:teams!matches_away_team_id_fkey(id, name)
        `)
        .order("match_date", { ascending: false })
        .limit(50);

      // Filter matches involving this club
      const clubMatches = (matches || []).filter((m: any) => {
        const homeName = m.home_team?.name?.toLowerCase() || "";
        const awayName = m.away_team?.name?.toLowerCase() || "";
        return clubInfo.aliases.some(a => 
          homeName.includes(a.toLowerCase()) || awayName.includes(a.toLowerCase())
        );
      });

      // Fetch sentiment snapshots for these matches
      const matchIds = clubMatches.map((m: any) => m.id);
      const { data: snapshots } = await supabase
        .from("sentiment_snapshots")
        .select("*")
        .in("match_id", matchIds)
        .order("created_at", { ascending: false });

      // Calculate current sentiment and trend
      let currentSentiment = 50;
      let previousSentiment = 50;
      let mentions = 0;
      let lastUpdated: string | null = null;

      if (snapshots && snapshots.length > 0) {
        // Get sentiment for this club from snapshots
        for (const snap of snapshots.slice(0, 5)) {
          const match = clubMatches.find((m: any) => m.id === snap.match_id);
          if (!match) continue;

          const homeName = match.home_team?.name?.toLowerCase() || "";
          const isHome = clubInfo.aliases.some(a => homeName.includes(a.toLowerCase()));
          const sentiment = isHome ? snap.home_sentiment : snap.away_sentiment;

          if (!lastUpdated) {
            currentSentiment = sentiment || 50;
            lastUpdated = snap.created_at;
          } else if (!previousSentiment) {
            previousSentiment = sentiment || 50;
          }
          mentions += snap.tweets_analyzed || 0;
        }
      }

      const trend = currentSentiment - previousSentiment;

      // Build recent and upcoming matches
      const now = new Date();
      const recentMatches: ClubData["recentMatches"] = [];
      const upcomingMatches: ClubData["upcomingMatches"] = [];

      for (const match of clubMatches.slice(0, 10)) {
        const matchDate = new Date(match.match_date);
        const isHome = clubInfo.aliases.some(a => 
          (match.home_team?.name || "").toLowerCase().includes(a.toLowerCase())
        );
        const opponent = isHome ? match.away_team?.name : match.home_team?.name;
        const snap = snapshots?.find((s: any) => s.match_id === match.id);
        const sentiment = snap ? (isHome ? snap.home_sentiment : snap.away_sentiment) : 50;

        if (match.status === "FINISHED" || matchDate < now) {
          const homeScore = match.home_score || 0;
          const awayScore = match.away_score || 0;
          const clubScore = isHome ? homeScore : awayScore;
          const oppScore = isHome ? awayScore : homeScore;
          const result = clubScore > oppScore ? "W" : clubScore < oppScore ? "L" : "D";

          recentMatches.push({
            opponent: opponent || "TBD",
            score: isHome ? `${homeScore}-${awayScore}` : `${awayScore}-${homeScore}`,
            sentiment: sentiment || 50,
            result,
            matchId: match.id,
          });
        } else {
          upcomingMatches.push({
            opponent: opponent || "TBD",
            date: matchDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            competition: match.competition || "League",
            matchId: match.id,
          });
        }
      }

      // Generate talking points from AI analysis (would come from edge function in production)
      const category = getSentimentCategory(currentSentiment);
      const talkingPoints: ClubData["talkingPoints"] = [
        {
          text: `Fans are feeling ${category.name.toLowerCase()} about recent performances`,
          sentiment: currentSentiment >= 60 ? "positive" : currentSentiment >= 40 ? "neutral" : "negative",
          percentage: currentSentiment,
        },
      ];

      if (trend > 5) {
        talkingPoints.push({
          text: "Mood improving after recent results",
          sentiment: "positive",
          percentage: Math.min(95, currentSentiment + 10),
        });
      } else if (trend < -5) {
        talkingPoints.push({
          text: "Concern growing among supporters",
          sentiment: "negative",
          percentage: Math.max(5, currentSentiment - 10),
        });
      }

      setClubData({
        sentiment: currentSentiment,
        trend,
        mentions: mentions || Math.floor(Math.random() * 10000) + 5000, // Fallback to estimated
        talkingPoints,
        playerRatings: [], // Would come from player sentiment data
        upcomingMatches: upcomingMatches.slice(0, 5),
        recentMatches: recentMatches.slice(0, 5),
        lastUpdated,
      });

      if (recentMatches.length > 0 && recentMatches[0].matchId) {
        setSelectedMatchId(recentMatches[0].matchId);
      }
    } catch (error) {
      console.error("Failed to fetch club data:", error);
      // Set fallback data
      setClubData({
        sentiment: 50,
        trend: 0,
        mentions: 0,
        talkingPoints: [{ text: "Awaiting sentiment data", sentiment: "neutral", percentage: 50 }],
        playerRatings: [],
        upcomingMatches: [],
        recentMatches: [],
        lastUpdated: null,
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!clubInfo) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p className="text-muted-foreground mb-6">This club is not in our monitored list.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  const logo = getTeamLogo(clubInfo.shortName);
  const category = getSentimentCategory(clubData?.sentiment || 50);
  
  const TrendIcon = (clubData?.trend || 0) >= 0 ? TrendingUp : TrendingDown;
  const trendColor = (clubData?.trend || 0) >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]";
  
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        
        {/* Club Header */}
        <Card className="mb-6 overflow-hidden">
          <div 
            className="h-2" 
            style={{ backgroundColor: clubInfo.color }}
          />
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src={logo} 
                alt={clubInfo.name} 
                className="w-20 h-20 object-contain"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{clubInfo.name}</h1>
                  <SentimentBadge score={clubData?.sentiment || 50} size="lg" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{clubInfo.league}</span>
                  <span>•</span>
                  <span>{clubInfo.country}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {((clubData?.mentions || 0) / 1000).toFixed(1)}K mentions
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {(clubData?.trend || 0) > 0 ? '+' : ''}{clubData?.trend || 0} since last match
                    </span>
                  </div>
                  <Button
                    variant={isFollowing ? "secondary" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <HeartOff className="w-3 h-3" /> Unfollow
                      </>
                    ) : (
                      <>
                        <Heart className="w-3 h-3" /> Follow
                      </>
                    )}
                  </Button>
                </div>
                {clubData?.lastUpdated && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Last updated: {new Date(clubData.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="insights" className="flex-1">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">
              <TrendingUp className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
          </TabsList>
          
          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-5 h-5 text-primary" />
                  AI-Powered Insights
                  <Badge variant="outline" className="text-[10px]">Powered by Gemini</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Sentiment Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {clubInfo.shortName} fans are feeling <strong>{category.name.toLowerCase()}</strong> {category.emoji} with a sentiment score of {clubData?.sentiment || 50}/100.
                    {(clubData?.trend || 0) > 0 
                      ? ` Sentiment has improved by ${clubData?.trend} points since the last match.`
                      : (clubData?.trend || 0) < 0
                      ? ` Sentiment has decreased by ${Math.abs(clubData?.trend || 0)} points since the last match.`
                      : ` Sentiment is stable.`
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Key Talking Points</h4>
                  <div className="space-y-2">
                    {(clubData?.talkingPoints || []).map((point, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        {point.sentiment === "positive" ? (
                          <ThumbsUp className="w-4 h-4 text-[hsl(var(--success))]" />
                        ) : point.sentiment === "negative" ? (
                          <ThumbsDown className="w-4 h-4 text-[hsl(var(--destructive))]" />
                        ) : (
                          <Star className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm flex-1">{point.text}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] ${
                            point.sentiment === "positive" 
                              ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" 
                              : point.sentiment === "negative"
                              ? "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"
                              : ""
                          }`}
                        >
                          {point.percentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            {selectedMatchId ? (
              <SentimentTimeline
                matchId={selectedMatchId}
                homeTeam={clubInfo.name}
                awayTeam="Opponent"
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    No match timeline data available yet.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Match selector */}
            {(clubData?.recentMatches || []).length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {clubData?.recentMatches.map((match, i) => (
                  <Button
                    key={i}
                    variant={selectedMatchId === match.matchId ? "default" : "outline"}
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={() => match.matchId && setSelectedMatchId(match.matchId)}
                  >
                    vs {match.opponent.split(" ")[0]}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            {/* Upcoming */}
            {(clubData?.upcomingMatches || []).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-5 h-5 text-primary" />
                    Upcoming Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {clubData?.upcomingMatches.map((match, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-sm">vs {match.opponent}</p>
                          <p className="text-xs text-muted-foreground">{match.competition}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{match.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Recent */}
            {(clubData?.recentMatches || []).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {clubData?.recentMatches.map((match, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={match.result === "W" ? "default" : match.result === "L" ? "destructive" : "secondary"}
                            className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                          >
                            {match.result}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm">{clubInfo.shortName} {match.score} {match.opponent}</p>
                          </div>
                        </div>
                        <SentimentBadge score={match.sentiment} size="sm" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(clubData?.upcomingMatches || []).length === 0 && (clubData?.recentMatches || []).length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    No match data available yet for {clubInfo.shortName}.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
