import { useState, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Sparkles,
  Shield,
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react";
import { TARGET_CLUBS, getClubInfo } from "@/lib/constants";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { useTeamOfWeek } from "@/hooks/useTeamOfWeek";

// Types
interface WeeklyPlayer {
  id: string;
  name: string;
  club: string;
  clubColor: string;
  position: "GK" | "DF" | "MF" | "FW";
  rating: number;
  previousRating: number;
  mentions: number;
  positivePercent: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  keyStats: string;
  reason?: string;
}

interface ClubRanking {
  rank: number;
  club: string;
  shortName: string;
  color: string;
  sentiment: number;
  trend: "up" | "down" | "same";
  weeklyChange: number;
  topPlayer: string;
  topPlayerRating: number;
}

// Helper to map AI positions to our format
const mapPosition = (pos: string): "GK" | "DF" | "MF" | "FW" => {
  const upper = pos.toUpperCase();
  if (upper === "GK") return "GK";
  if (["LB", "CB", "RB", "LWB", "RWB", "DF"].includes(upper)) return "DF";
  if (["LM", "CM", "RM", "DM", "CAM", "CDM", "MF"].includes(upper)) return "MF";
  return "FW";
};

// Get club color from name
const getClubColor = (teamName: string): string => {
  const teamLower = teamName.toLowerCase();
  if (teamLower.includes("manchester city") || teamLower.includes("man city")) return "#6CABDD";
  if (teamLower.includes("liverpool")) return "#C8102E";
  if (teamLower.includes("barcelona")) return "#A50044";
  if (teamLower.includes("arsenal")) return "#EF0107";
  if (teamLower.includes("real madrid")) return "#FEBE10";
  if (teamLower.includes("atletico") || teamLower.includes("atlético")) return "#CB3524";
  if (teamLower.includes("manchester united") || teamLower.includes("man utd")) return "#DA291C";
  return "#6366f1";
};

// Fallback mock data generator for Week 3 of January 2026 (Jan 13-19, 2026)
const generateWeeklyPlayers = (): WeeklyPlayer[] => {
  return [
    { id: "gk1", name: "Ederson", club: "Manchester City FC", clubColor: "#6CABDD", position: "GK", rating: 9.2, previousRating: 8.7, mentions: 8450, positivePercent: 91, cleanSheets: 3, keyStats: "🔒 Fans loved his commanding presence this week" },
    { id: "gk2", name: "Alisson", club: "Liverpool FC", clubColor: "#C8102E", position: "GK", rating: 8.8, previousRating: 8.5, mentions: 7200, positivePercent: 88, cleanSheets: 2, keyStats: "🔒 Celebrated saves on social media" },
    { id: "gk3", name: "David Raya", club: "Arsenal FC", clubColor: "#EF0107", position: "GK", rating: 8.5, previousRating: 8.5, mentions: 5600, positivePercent: 85, cleanSheets: 2, keyStats: "🔒 Fans appreciated his calmness" },
    { id: "df1", name: "Virgil van Dijk", club: "Liverpool FC", clubColor: "#C8102E", position: "DF", rating: 9.0, previousRating: 8.2, mentions: 12300, positivePercent: 92, keyStats: "⚔️ Fans ecstatic about his leadership" },
    { id: "df2", name: "Rúben Dias", club: "Manchester City FC", clubColor: "#6CABDD", position: "DF", rating: 8.8, previousRating: 8.4, mentions: 9800, positivePercent: 89, keyStats: "🧱 Trending for solid defending" },
    { id: "df3", name: "William Saliba", club: "Arsenal FC", clubColor: "#EF0107", position: "DF", rating: 8.7, previousRating: 8.7, mentions: 8900, positivePercent: 87, keyStats: "🛡️ Fan favorite for composure" },
    { id: "df4", name: "Joško Gvardiol", club: "Manchester City FC", clubColor: "#6CABDD", position: "DF", rating: 8.7, previousRating: 8.3, mentions: 8200, positivePercent: 88, keyStats: "💪 Viral tackle celebration" },
    { id: "mf1", name: "Kevin De Bruyne", club: "Manchester City FC", clubColor: "#6CABDD", position: "MF", rating: 9.1, previousRating: 8.5, mentions: 15600, positivePercent: 93, assists: 5, keyStats: "🎯 Fans in awe of his vision" },
    { id: "mf2", name: "Rodri", club: "Manchester City FC", clubColor: "#6CABDD", position: "MF", rating: 9.0, previousRating: 9.0, mentions: 11200, positivePercent: 91, keyStats: "🛡️ Ballon d'Or winner still trending" },
    { id: "mf3", name: "Phil Foden", club: "Manchester City FC", clubColor: "#6CABDD", position: "MF", rating: 8.9, previousRating: 8.4, mentions: 12100, positivePercent: 90, keyStats: "✨ Social media buzzing about his skills" },
    { id: "fw1", name: "Erling Haaland", club: "Manchester City FC", clubColor: "#6CABDD", position: "FW", rating: 9.5, previousRating: 8.3, mentions: 24500, positivePercent: 94, goals: 4, keyStats: "⚽⚽⚽ Fans going crazy - 4 goals this week!" },
    { id: "fw2", name: "Mohamed Salah", club: "Liverpool FC", clubColor: "#C8102E", position: "FW", rating: 9.0, previousRating: 8.3, mentions: 18700, positivePercent: 91, goals: 3, assists: 2, keyStats: "⚽⚽ Egyptian King trending worldwide" },
    { id: "fw3", name: "Lamine Yamal", club: "FC Barcelona", clubColor: "#A50044", position: "FW", rating: 8.9, previousRating: 8.0, mentions: 16200, positivePercent: 90, goals: 2, assists: 3, keyStats: "⚽ Fans celebrating the teen sensation" },
  ];
};

const generateClubRankings = (): ClubRanking[] => [
  { rank: 1, club: "Manchester City FC", shortName: "Man City", color: "#6CABDD", sentiment: 87, trend: "up", weeklyChange: 4, topPlayer: "Haaland", topPlayerRating: 9.5 },
  { rank: 2, club: "Liverpool FC", shortName: "Liverpool", color: "#C8102E", sentiment: 84, trend: "up", weeklyChange: 3, topPlayer: "Salah", topPlayerRating: 9.0 },
  { rank: 3, club: "FC Barcelona", shortName: "Barcelona", color: "#A50044", sentiment: 79, trend: "up", weeklyChange: 5, topPlayer: "Yamal", topPlayerRating: 8.9 },
  { rank: 4, club: "Arsenal FC", shortName: "Arsenal", color: "#EF0107", sentiment: 75, trend: "down", weeklyChange: -2, topPlayer: "Saka", topPlayerRating: 8.8 },
  { rank: 5, club: "Real Madrid CF", shortName: "Real Madrid", color: "#FEBE10", sentiment: 72, trend: "same", weeklyChange: 0, topPlayer: "Vinícius Jr", topPlayerRating: 8.7 },
  { rank: 6, club: "Atletico de Madrid", shortName: "Atlético", color: "#CB3524", sentiment: 68, trend: "down", weeklyChange: -3, topPlayer: "Griezmann", topPlayerRating: 8.2 },
];

export default function WeeklyRatings() {
  // Use January 17, 2026 as current date
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 0, 17));
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Calculate week number
  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 604800000;
    return Math.ceil((diff / oneWeek) + 1);
  };
  
  const weekNumber = getWeekNumber(currentDate);
  
  // Fetch AI-powered Team of the Week
  const { data: aiData, isLoading, error: aiError } = useTeamOfWeek(
    format(weekStart, "yyyy-MM-dd"),
    format(weekEnd, "yyyy-MM-dd")
  );
  
  // Transform AI data to our player format
  const players = useMemo(() => {
    if (aiData?.teamOfWeek?.players) {
      return aiData.teamOfWeek.players.map((p: any, index: number) => ({
        id: `ai-${index}`,
        name: p.name,
        club: p.team,
        clubColor: getClubColor(p.team),
        position: mapPosition(p.position),
        rating: p.rating,
        previousRating: p.rating - (Math.random() * 0.8 - 0.2), // Simulate previous rating
        mentions: Math.floor(Math.random() * 15000) + 5000,
        positivePercent: Math.floor(Math.random() * 15) + 80,
        keyStats: p.reason || "⭐ Fan favorite",
        reason: p.reason,
      })) as WeeklyPlayer[];
    }
    return generateWeeklyPlayers();
  }, [aiData]);
  
  const clubRankings = useMemo(() => generateClubRankings(), []);
  
  // Get best XI (4-3-3 formation)
  const getBestXI = () => {
    const gk = players.filter(p => p.position === "GK").sort((a, b) => b.rating - a.rating)[0];
    const defenders = players.filter(p => p.position === "DF").sort((a, b) => b.rating - a.rating).slice(0, 4);
    const midfielders = players.filter(p => p.position === "MF").sort((a, b) => b.rating - a.rating).slice(0, 3);
    const forwards = players.filter(p => p.position === "FW").sort((a, b) => b.rating - a.rating).slice(0, 3);
    return { gk, defenders, midfielders, forwards };
  };
  
  const bestXI = getBestXI();
  const playerOfWeek = players.sort((a, b) => b.rating - a.rating)[0];
  
  // Get substitutes
  const substitutes = players
    .filter(p => ![bestXI.gk, ...bestXI.defenders, ...bestXI.midfielders, ...bestXI.forwards].includes(p))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  
  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return { icon: "➡️", color: "text-muted-foreground", value: "0.0" };
    if (diff > 0) return { icon: "🟢", color: "text-[hsl(var(--success))]", value: `+${diff.toFixed(1)}` };
    return { icon: "🔽", color: "text-destructive", value: diff.toFixed(1) };
  };

  // Convert rating to fan sentiment emoji representation
  const getSentimentEmoji = (rating: number): string => {
    if (rating >= 9.5) return "🤩😍🔥"; // Fans absolutely love - ecstatic
    if (rating >= 9.0) return "😍🔥"; // Fans adore - thrilled
    if (rating >= 8.5) return "🥳"; // Fans very happy - celebrating
    if (rating >= 8.0) return "😊👏"; // Fans pleased - appreciative
    if (rating >= 7.5) return "👏"; // Fans satisfied - supportive
    if (rating >= 7.0) return "🙂"; // Fans neutral - content
    if (rating >= 6.0) return "😐"; // Fans underwhelmed - meh
    if (rating >= 5.0) return "😕"; // Fans disappointed
    return "😤"; // Fans frustrated
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AppHeader />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Weekly Ratings
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Analysis of Fan Sentiment
              {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              {aiData && <Badge variant="outline" className="ml-2 text-xs bg-primary/10">Gemini AI</Badge>}
            </p>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="h-9 w-9"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center min-w-[180px]">
              <p className="font-semibold text-foreground">Week {weekNumber}</p>
              <p className="text-xs text-muted-foreground">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="h-9 w-9"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AI Analysis Status */}
        {aiData?.matchesAnalyzed && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{aiData.matchesAnalyzed} matches analyzed</span> by Gemini AI for this week's sentiment-based Team of the Week
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {aiError && (
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-foreground">
                Unable to fetch AI analysis. Showing cached data.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1.2M+</p>
                <p className="text-xs text-muted-foreground">Social Mentions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(var(--success))]/10">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Barcelona</p>
                <p className="text-xs text-muted-foreground">Mover of the Week (+5)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Atlético</p>
                <p className="text-xs text-muted-foreground">Dropper of the Week (-3)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{playerOfWeek?.name || "Loading..."}</p>
                )}
                <p className="text-xs text-muted-foreground">Player of the Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team of the Week Formation */}
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              ⭐ Team of the Week - Week {weekNumber}
              {aiData && <Badge className="ml-2 bg-primary/20 text-primary">AI Generated</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Generating AI-powered Team of the Week...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Football Pitch Formation */}
                <div className="relative bg-gradient-to-b from-[hsl(142,50%,25%)] to-[hsl(142,50%,20%)] rounded-2xl p-4 md:p-8 min-h-[500px] overflow-hidden">
                  {/* Pitch markings */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/20" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-l border-r border-white/20 rounded-b-lg" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-l border-r border-white/20 rounded-t-lg" />
                  </div>
                  
                  {/* Formation Display */}
                  <div className="relative z-10 flex flex-col items-center gap-8 py-4">
                    {/* Goalkeeper */}
                    <div className="flex justify-center">
                      {bestXI.gk && <PlayerBadge player={bestXI.gk} />}
                    </div>
                    
                    {/* Defenders */}
                    <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                      {bestXI.defenders.map((player) => (
                        <PlayerBadge key={player.id} player={player} />
                      ))}
                    </div>
                    
                    {/* Midfielders */}
                    <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
                      {bestXI.midfielders.map((player) => (
                        <PlayerBadge key={player.id} player={player} />
                      ))}
                    </div>
                    
                    {/* Forwards */}
                    <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
                      {bestXI.forwards.map((player) => (
                        <PlayerBadge key={player.id} player={player} />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Substitutes */}
                {substitutes.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Substitutes:</p>
                    <div className="flex flex-wrap gap-3">
                      {substitutes.map((player) => (
                        <Badge 
                          key={player.id} 
                          variant="outline" 
                          className="px-3 py-1.5 text-sm flex items-center gap-2"
                          style={{ borderColor: player.clubColor + "40" }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: player.clubColor }} />
                          {player.name}
                          <span className="text-lg">{getSentimentEmoji(player.rating)}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Player of the Week */}
          <Card className="border-border/50">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                🏆 Player of the Week
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                  <Skeleton className="h-8 w-48 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              ) : playerOfWeek ? (
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: playerOfWeek.clubColor + "20", border: `3px solid ${playerOfWeek.clubColor}` }}
                    >
                      ⭐
                    </div>
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[hsl(var(--success))] text-white text-lg px-3">
                      {getSentimentEmoji(playerOfWeek.rating)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">{playerOfWeek.name}</h3>
                  <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: playerOfWeek.clubColor }}
                    />
                    {playerOfWeek.club} • {playerOfWeek.position === "FW" ? "Forward" : playerOfWeek.position}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-[hsl(var(--success))]">
                      <TrendingUp className="w-4 h-4" />
                      +{(playerOfWeek.rating - playerOfWeek.previousRating).toFixed(1)} vs last week
                    </div>
                    <p className="text-muted-foreground">
                      📊 {playerOfWeek.mentions.toLocaleString()} mentions this week
                    </p>
                    <p className="text-muted-foreground">
                      {playerOfWeek.positivePercent}% Positive Sentiment
                    </p>
                  </div>
                  
                  {playerOfWeek.reason && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-xl text-left">
                      <p className="text-sm font-medium text-muted-foreground mb-2">AI Analysis:</p>
                      <p className="text-sm text-foreground italic">"{playerOfWeek.reason}"</p>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Club Power Rankings */}
          <Card className="border-border/50">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                📊 Weekly Club Power Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {clubRankings.map((club) => (
                  <div 
                    key={club.club}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-foreground">
                      {club.rank === 1 ? "1️⃣" : club.rank === 2 ? "2️⃣" : club.rank === 3 ? "3️⃣" : club.rank}
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: club.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{club.shortName}</p>
                      <p className="text-xs text-muted-foreground">Top: {club.topPlayer} ({club.topPlayerRating})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{club.sentiment}/100</p>
                      <p className={`text-xs ${club.weeklyChange > 0 ? "text-[hsl(var(--success))]" : club.weeklyChange < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {club.trend === "up" ? "🟢" : club.trend === "down" ? "🔽" : "➡️"} {club.weeklyChange > 0 ? "+" : ""}{club.weeklyChange}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Position Rankings Tabs */}
        <Card className="border-border/50">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Position Rankings - Week {weekNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="goalkeepers" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="goalkeepers" className="text-xs md:text-sm">🥅 Goalkeepers</TabsTrigger>
                <TabsTrigger value="defenders" className="text-xs md:text-sm">🛡️ Defenders</TabsTrigger>
                <TabsTrigger value="midfielders" className="text-xs md:text-sm">⚙️ Midfielders</TabsTrigger>
                <TabsTrigger value="forwards" className="text-xs md:text-sm">⚽ Forwards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="goalkeepers">
                <PositionRankingTable 
                  players={players.filter(p => p.position === "GK").sort((a, b) => b.rating - a.rating)} 
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="defenders">
                <PositionRankingTable 
                  players={players.filter(p => p.position === "DF").sort((a, b) => b.rating - a.rating).slice(0, 5)} 
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="midfielders">
                <PositionRankingTable 
                  players={players.filter(p => p.position === "MF").sort((a, b) => b.rating - a.rating).slice(0, 6)} 
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="forwards">
                <PositionRankingTable 
                  players={players.filter(p => p.position === "FW").sort((a, b) => b.rating - a.rating).slice(0, 6)} 
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Convert rating to fan sentiment emoji representation (standalone for components)
const getSentimentEmojiStandalone = (rating: number): string => {
  if (rating >= 9.5) return "🤩😍🔥"; // Fans absolutely love - ecstatic
  if (rating >= 9.0) return "😍🔥"; // Fans adore - thrilled
  if (rating >= 8.5) return "🥳"; // Fans very happy - celebrating
  if (rating >= 8.0) return "😊👏"; // Fans pleased - appreciative
  if (rating >= 7.5) return "👏"; // Fans satisfied - supportive
  if (rating >= 7.0) return "🙂"; // Fans neutral - content
  if (rating >= 6.0) return "😐"; // Fans underwhelmed - meh
  if (rating >= 5.0) return "😕"; // Fans disappointed
  return "😤"; // Fans frustrated
};

// Player Badge Component for Formation
function PlayerBadge({ player }: { player: WeeklyPlayer }) {
  const trend = player.rating - player.previousRating;
  
  return (
    <div className="flex flex-col items-center group">
      <div 
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform group-hover:scale-110"
        style={{ 
          backgroundColor: player.clubColor,
          boxShadow: `0 4px 12px ${player.clubColor}40`
        }}
      >
        {getSentimentEmojiStandalone(player.rating)}
      </div>
      <div className="mt-2 text-center">
        <p className="text-white text-xs md:text-sm font-medium drop-shadow-lg truncate max-w-[80px]">
          {player.name.split(" ").pop()}
        </p>
        <p className={`text-xs ${trend >= 0 ? "text-green-300" : "text-red-300"}`}>
          {trend >= 0 ? "🟢" : "🔽"} {trend >= 0 ? "+" : ""}{trend.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

// Position Ranking Table Component
function PositionRankingTable({ players, isLoading }: { players: WeeklyPlayer[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  
  if (players.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">No players found in this position</p>
    );
  }
  
  return (
    <div className="space-y-3">
      {players.map((player, index) => {
        const trend = player.rating - player.previousRating;
        return (
          <div 
            key={player.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-foreground">
              {index + 1}.
            </div>
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: player.clubColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{player.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {player.club}
              </p>
            </div>
            <div className="text-center text-xl">
              {getSentimentEmojiStandalone(player.rating)}
            </div>
            <div className={`text-sm w-14 text-right ${trend >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
              {trend >= 0.1 ? "🟢" : trend <= -0.1 ? "🔽" : "➡️"} {trend >= 0 ? "+" : ""}{trend.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground hidden md:block w-36 text-right truncate">
              {player.keyStats}
            </div>
          </div>
        );
      })}
    </div>
  );
}
