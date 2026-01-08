import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, TrendingDown, Minus, MessageSquare } from "lucide-react";

interface MentionedPlayer {
  id: string;
  name: string;
  team: string;
  mentions: number;
  sentiment: number; // 0-100
  trend: "up" | "down" | "stable";
  trendValue: number;
}

const players: MentionedPlayer[] = [
  { id: "1", name: "Erling Haaland", team: "Manchester City", mentions: 45200, sentiment: 92, trend: "up", trendValue: 15 },
  { id: "2", name: "Jude Bellingham", team: "Real Madrid", mentions: 38900, sentiment: 89, trend: "up", trendValue: 22 },
  { id: "3", name: "Mohamed Salah", team: "Liverpool", mentions: 32400, sentiment: 78, trend: "stable", trendValue: 2 },
  { id: "4", name: "Vinícius Jr.", team: "Real Madrid", mentions: 28700, sentiment: 85, trend: "up", trendValue: 8 },
  { id: "5", name: "Kevin De Bruyne", team: "Manchester City", mentions: 24300, sentiment: 81, trend: "down", trendValue: 5 },
];

export function MostMentionedPlayers() {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--success))]" />;
      case "down": return <TrendingDown className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" />;
      default: return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "bg-[hsl(var(--success))]";
    if (score >= 50) return "bg-[hsl(var(--warning))]";
    return "bg-[hsl(var(--destructive))]";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          Most Mentioned Players
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top players by social media mentions this week
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-4">
              {/* Rank */}
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">{index + 1}</span>
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{player.name}</span>
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    {player.team}
                  </Badge>
                </div>
                
                {/* Sentiment bar */}
                <div className="flex items-center gap-2 mt-1">
                  <Progress 
                    value={player.sentiment} 
                    className={`h-1.5 flex-1 max-w-[100px]`}
                  />
                  <span className="text-xs text-muted-foreground">{player.sentiment}%</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatNumber(player.mentions)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(player.trend)}
                  <span className={`text-xs ${
                    player.trend === "up" ? "text-[hsl(var(--success))]" : 
                    player.trend === "down" ? "text-[hsl(var(--destructive))]" : 
                    "text-muted-foreground"
                  }`}>
                    {player.trend !== "stable" && (player.trend === "up" ? "+" : "-")}
                    {player.trendValue}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
