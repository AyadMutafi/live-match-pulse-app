import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, Users } from "lucide-react";

interface PlayerRating {
  id: string;
  name: string;
  position: string;
  rating: number;
  pulseScore: number;
  mentions: number;
  sentiment: "positive" | "neutral" | "negative";
}

interface TeamPulseRatingProps {
  teamName: string;
  league: string;
  teamLogo: string;
  overallPulse: number;
  totalMentions: number;
  players: PlayerRating[];
  languages: string[];
}

export function TeamPulseRating({ 
  teamName, 
  league, 
  teamLogo, 
  overallPulse, 
  totalMentions, 
  players,
  languages 
}: TeamPulseRatingProps) {
  const getPulseColor = (pulse: number) => {
    if (pulse >= 80) return "text-success";
    if (pulse >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPulseBackground = (pulse: number) => {
    if (pulse >= 80) return "bg-success/10";
    if (pulse >= 60) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="w-3 h-3 text-success" />;
      case "negative": return <TrendingDown className="w-3 h-3 text-destructive" />;
      default: return <Users className="w-3 h-3 text-warning" />;
    }
  };

  const getPlayerRatingEmoji = (rating: number) => {
    if (rating >= 9) return "🔥"; // Top player
    if (rating >= 7) return "😍"; // Good
    if (rating >= 5) return "😐"; // Just okay
    if (rating >= 3) return "😑"; // Bad day
    return "🤬"; // Awful performance
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{teamName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-base">{teamName}</h3>
            <p className="text-xs text-muted-foreground">{league}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getPulseColor(overallPulse)}`}>
            {overallPulse}
          </div>
          <div className="text-xs text-muted-foreground">{totalMentions.toLocaleString()} mentions</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Team Pulse</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-accent" />
            <span className="text-xs">{overallPulse}/100</span>
          </div>
        </div>
        <Progress value={overallPulse} className="h-2" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Languages Tracked</span>
          <span className="text-xs text-muted-foreground">{languages.length} languages</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {languages.map((lang, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Player Ratings</span>
          <span className="text-xs text-muted-foreground">Top performers</span>
        </div>
        
        {players.slice(0, 5).map((player) => (
          <div key={player.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPulseBackground(player.pulseScore)}`}>
                <span className="text-lg">
                  {getPlayerRatingEmoji(player.rating)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">{player.name}</div>
                <div className="text-xs text-muted-foreground">{player.position}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getSentimentIcon(player.sentiment)}
              <div className="text-right">
                <div className={`text-sm font-bold ${getPulseColor(player.pulseScore)}`}>
                  {player.pulseScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  {player.mentions} mentions
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}