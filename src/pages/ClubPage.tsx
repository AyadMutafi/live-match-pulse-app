import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/AppHeader";
import { SentimentBadge } from "@/components/SentimentBadge";
import { TARGET_CLUBS, getSentimentCategory, getClubInfo } from "@/lib/constants";
import { getTeamLogo } from "@/lib/teamLogos";
import { 
  TrendingUp, TrendingDown, ArrowLeft, Brain, Calendar, 
  MessageSquare, Users, Star, ThumbsUp, ThumbsDown, Radio
} from "lucide-react";

// Mock data for club page
const mockClubData: Record<string, {
  sentiment: number;
  trend: number;
  weekTrend: number;
  mentions: number;
  talkingPoints: { text: string; sentiment: "positive" | "negative" | "neutral"; percentage: number }[];
  playerRatings: { name: string; rating: number; trend: number }[];
  upcomingMatches: { opponent: string; date: string; competition: string }[];
  recentMatches: { opponent: string; score: string; sentiment: number; result: "W" | "D" | "L" }[];
}> = {
  "barcelona": {
    sentiment: 78,
    trend: 5,
    weekTrend: 8,
    mentions: 52300,
    talkingPoints: [
      { text: "Fans excited about Yamal's development", sentiment: "positive", percentage: 85 },
      { text: "Concerns over defensive depth", sentiment: "negative", percentage: 45 },
      { text: "Optimism about La Liga title race", sentiment: "positive", percentage: 70 }
    ],
    playerRatings: [
      { name: "Lamine Yamal", rating: 8.9, trend: 0.3 },
      { name: "Robert Lewandowski", rating: 8.2, trend: 0.1 },
      { name: "Pedri", rating: 7.8, trend: 0 },
      { name: "Andreas Christensen", rating: 4.2, trend: -0.5 },
      { name: "Ronald Araujo", rating: 5.1, trend: -0.3 }
    ],
    upcomingMatches: [
      { opponent: "Real Madrid CF", date: "Oct 26, 21:00", competition: "La Liga - El Clásico" },
      { opponent: "Sevilla FC", date: "Nov 2, 19:00", competition: "La Liga" },
      { opponent: "Atletico de Madrid", date: "Nov 9, 18:30", competition: "La Liga" }
    ],
    recentMatches: [
      { opponent: "Sevilla FC", score: "3-0", sentiment: 82, result: "W" },
      { opponent: "Real Madrid CF", score: "2-2", sentiment: 71, result: "D" }
    ]
  },
  "real-madrid": {
    sentiment: 72,
    trend: 2,
    weekTrend: 5,
    mentions: 48700,
    talkingPoints: [
      { text: "Bellingham continues to impress", sentiment: "positive", percentage: 88 },
      { text: "Questions about Vinicius form", sentiment: "neutral", percentage: 52 },
      { text: "Champions League expectations high", sentiment: "positive", percentage: 75 }
    ],
    playerRatings: [
      { name: "Jude Bellingham", rating: 9.1, trend: 0.2 },
      { name: "Vinicius Jr", rating: 7.5, trend: -0.2 },
      { name: "Rodrygo", rating: 7.8, trend: 0.1 }
    ],
    upcomingMatches: [
      { opponent: "FC Barcelona", date: "Oct 26, 21:00", competition: "La Liga - El Clásico" }
    ],
    recentMatches: [
      { opponent: "FC Barcelona", score: "2-2", sentiment: 65, result: "D" }
    ]
  },
  "liverpool": {
    sentiment: 82,
    trend: 5,
    weekTrend: 10,
    mentions: 61200,
    talkingPoints: [
      { text: "Slot's system getting results", sentiment: "positive", percentage: 90 },
      { text: "Salah in incredible form", sentiment: "positive", percentage: 92 },
      { text: "Title charge looks promising", sentiment: "positive", percentage: 85 }
    ],
    playerRatings: [
      { name: "Mohamed Salah", rating: 9.3, trend: 0.4 },
      { name: "Virgil van Dijk", rating: 8.5, trend: 0.2 },
      { name: "Dominik Szoboszlai", rating: 7.9, trend: 0.3 }
    ],
    upcomingMatches: [
      { opponent: "Arsenal FC", date: "Oct 27, 16:30", competition: "Premier League" }
    ],
    recentMatches: [
      { opponent: "Chelsea FC", score: "2-1", sentiment: 85, result: "W" }
    ]
  },
  "man-city": {
    sentiment: 75,
    trend: 1,
    weekTrend: 3,
    mentions: 45600,
    talkingPoints: [
      { text: "Haaland scoring machine", sentiment: "positive", percentage: 95 },
      { text: "Midfield depth concerns", sentiment: "negative", percentage: 40 },
      { text: "Champions League favorites", sentiment: "positive", percentage: 78 }
    ],
    playerRatings: [
      { name: "Erling Haaland", rating: 9.5, trend: 0.2 },
      { name: "Kevin De Bruyne", rating: 8.8, trend: 0.1 },
      { name: "Phil Foden", rating: 8.0, trend: 0 }
    ],
    upcomingMatches: [
      { opponent: "Southampton FC", date: "Oct 26, 15:00", competition: "Premier League" }
    ],
    recentMatches: [
      { opponent: "Wolverhampton Wanderers", score: "2-1", sentiment: 72, result: "W" }
    ]
  },
  "man-united": {
    sentiment: 45,
    trend: -8,
    weekTrend: -12,
    mentions: 72100,
    talkingPoints: [
      { text: "Manager under pressure", sentiment: "negative", percentage: 75 },
      { text: "Inconsistent performances", sentiment: "negative", percentage: 80 },
      { text: "Youth players showing promise", sentiment: "positive", percentage: 65 }
    ],
    playerRatings: [
      { name: "Bruno Fernandes", rating: 6.8, trend: -0.3 },
      { name: "Kobbie Mainoo", rating: 7.5, trend: 0.2 },
      { name: "Marcus Rashford", rating: 5.2, trend: -0.5 }
    ],
    upcomingMatches: [
      { opponent: "West Ham United", date: "Oct 27, 14:00", competition: "Premier League" }
    ],
    recentMatches: [
      { opponent: "Aston Villa", score: "0-0", sentiment: 42, result: "D" }
    ]
  },
  "arsenal": {
    sentiment: 71,
    trend: 4,
    weekTrend: 6,
    mentions: 38900,
    talkingPoints: [
      { text: "Saka world-class performances", sentiment: "positive", percentage: 88 },
      { text: "Title challenge underway", sentiment: "positive", percentage: 75 },
      { text: "Defensive solidity impressive", sentiment: "positive", percentage: 70 }
    ],
    playerRatings: [
      { name: "Bukayo Saka", rating: 8.7, trend: 0.3 },
      { name: "Martin Ødegaard", rating: 8.4, trend: 0.1 },
      { name: "William Saliba", rating: 8.2, trend: 0.2 }
    ],
    upcomingMatches: [
      { opponent: "Liverpool FC", date: "Oct 27, 16:30", competition: "Premier League" }
    ],
    recentMatches: [
      { opponent: "Bournemouth", score: "3-0", sentiment: 78, result: "W" }
    ]
  },
  "atletico-madrid": {
    sentiment: 65,
    trend: -2,
    weekTrend: -4,
    mentions: 21400,
    talkingPoints: [
      { text: "Simeone's tactics working", sentiment: "positive", percentage: 68 },
      { text: "Griezmann still delivering", sentiment: "positive", percentage: 72 },
      { text: "Europa League focus questioned", sentiment: "negative", percentage: 45 }
    ],
    playerRatings: [
      { name: "Antoine Griezmann", rating: 8.0, trend: 0.1 },
      { name: "Álvaro Morata", rating: 7.2, trend: -0.1 },
      { name: "Jan Oblak", rating: 7.8, trend: 0 }
    ],
    upcomingMatches: [
      { opponent: "Sevilla FC", date: "Oct 27, 16:00", competition: "La Liga" }
    ],
    recentMatches: [
      { opponent: "Real Sociedad", score: "1-1", sentiment: 58, result: "D" }
    ]
  }
};

export default function ClubPage() {
  const { clubSlug } = useParams<{ clubSlug: string }>();
  
  const clubInfo = TARGET_CLUBS.find(
    c => c.shortName.toLowerCase().replace(/\s+/g, '-') === clubSlug
  );
  
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
  
  const clubData = mockClubData[clubSlug || ""] || mockClubData["barcelona"];
  const logo = getTeamLogo(clubInfo.shortName);
  const category = getSentimentCategory(clubData.sentiment);
  
  const TrendIcon = clubData.trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = clubData.trend > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]";
  
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
                  <SentimentBadge score={clubData.sentiment} size="lg" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{clubInfo.league}</span>
                  <span>•</span>
                  <span>{clubInfo.country}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {(clubData.mentions / 1000).toFixed(1)}K mentions today
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {clubData.trend > 0 ? '+' : ''}{clubData.trend} vs last match
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {clubData.weekTrend > 0 ? '+' : ''}{clubData.weekTrend} vs last week
                    </span>
                  </div>
                </div>
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
            <TabsTrigger value="players" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex-1">
              <Radio className="w-4 h-4 mr-2" />
              Live Feed
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
                    {clubInfo.shortName} fans are feeling <strong>{category.name.toLowerCase()}</strong> with a sentiment score of {clubData.sentiment}/100.
                    {clubData.trend > 0 
                      ? ` Sentiment has improved by ${clubData.trend} points since the last match.`
                      : ` Sentiment has decreased by ${Math.abs(clubData.trend)} points since the last match.`
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Key Talking Points</h4>
                  <div className="space-y-2">
                    {clubData.talkingPoints.map((point, index) => (
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
                          {point.percentage}% {point.sentiment}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Players Tab */}
          <TabsContent value="players" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-5 h-5 text-primary" />
                  Player Sentiment Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clubData.playerRatings.map((player, index) => {
                    const isPositive = player.rating >= 7;
                    const PlayerTrendIcon = player.trend > 0 ? TrendingUp : player.trend < 0 ? TrendingDown : null;
                    
                    return (
                      <div 
                        key={player.name} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                          <span className="font-medium text-sm">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`}>
                            {player.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">/10</span>
                          {PlayerTrendIcon && (
                            <PlayerTrendIcon 
                              className={`w-4 h-4 ${player.trend > 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'}`} 
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {clubData.upcomingMatches.map((match, index) => (
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
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {clubData.recentMatches.map((match, index) => (
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
          </TabsContent>
          
          {/* Live Feed Tab */}
          <TabsContent value="feed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Radio className="w-5 h-5 text-[hsl(var(--success))] animate-pulse" />
                  Live Social Feed - {clubInfo.shortName} Only
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Live social feed filtering for {clubInfo.shortName} mentions coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
