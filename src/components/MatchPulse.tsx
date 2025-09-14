import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MessageCircle, 
  Zap,
  Eye,
  Heart
} from "lucide-react";

interface MatchPulseData {
  matchId: string;
  homeTeam: {
    name: string;
    pulse: number;
    trend: "up" | "down" | "stable";
    sentiment: "on_fire" | "good" | "okay" | "bad" | "awful";
    recentMentions: number;
  };
  awayTeam: {
    name: string;
    pulse: number;
    trend: "up" | "down" | "stable";
    sentiment: "on_fire" | "good" | "okay" | "bad" | "awful";
    recentMentions: number;
  };
  matchTime: string;
  status: "LIVE" | "HT" | "FT" | "PRE";
  totalEngagement: number;
  topReactions: string[];
  trendingHashtags: string[];
  liveUpdates: {
    text: string;
    sentiment: "positive" | "negative" | "neutral";
    team: "home" | "away" | "both";
    timestamp: string;
  }[];
}

interface MatchPulseProps {
  matchData: MatchPulseData;
}

export function MatchPulse({ matchData }: MatchPulseProps) {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "on_fire": return "🔥";
      case "good": return "😍"; 
      case "okay": return "😐";
      case "bad": return "😑";
      case "awful": return "🤬";
      default: return "😐";
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case "on_fire": return "On Fire";
      case "good": return "Good Form"; 
      case "okay": return "Just Okay";
      case "bad": return "Bad Day";
      case "awful": return "Awful";
      default: return "Neutral";
    }
  };

  const getPulseColor = (pulse: number) => {
    if (pulse >= 80) return "text-success";
    if (pulse >= 60) return "text-warning";
    return "text-destructive";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-success" />;
      case "down": return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getUpdateColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-success";
      case "negative": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const isLive = matchData.status === "LIVE";

  return (
    <Card className="p-4 bg-card border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${isLive ? 'animate-pulse' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-destructive' : 'bg-muted'}`} />
            <span className="font-semibold text-sm">{matchData.status}</span>
          </div>
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{matchData.matchTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{matchData.totalEngagement.toLocaleString()}</span>
        </div>
      </div>

      {/* Match Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">
          {matchData.homeTeam.name} vs {matchData.awayTeam.name}
        </h3>
        <p className="text-sm text-muted-foreground">Live Fan Pulse</p>
      </div>

      {/* Team Pulses */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Home Team */}
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">{getSentimentEmoji(matchData.homeTeam.sentiment)}</span>
            {getTrendIcon(matchData.homeTeam.trend)}
          </div>
          <div className="text-sm font-medium mb-1">{matchData.homeTeam.name}</div>
          <div className={`text-xl font-bold ${getPulseColor(matchData.homeTeam.pulse)}`}>
            {matchData.homeTeam.pulse}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {getSentimentText(matchData.homeTeam.sentiment)}
          </div>
          <Progress value={matchData.homeTeam.pulse} className="h-1.5" />
          <div className="text-xs text-muted-foreground mt-1">
            {matchData.homeTeam.recentMentions} mentions
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">{getSentimentEmoji(matchData.awayTeam.sentiment)}</span>
            {getTrendIcon(matchData.awayTeam.trend)}
          </div>
          <div className="text-sm font-medium mb-1">{matchData.awayTeam.name}</div>
          <div className={`text-xl font-bold ${getPulseColor(matchData.awayTeam.pulse)}`}>
            {matchData.awayTeam.pulse}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {getSentimentText(matchData.awayTeam.sentiment)}
          </div>
          <Progress value={matchData.awayTeam.pulse} className="h-1.5" />
          <div className="text-xs text-muted-foreground mt-1">
            {matchData.awayTeam.recentMentions} mentions
          </div>
        </div>
      </div>

      {/* Top Reactions */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Top Fan Reactions</span>
          <Heart className="w-4 h-4 text-accent" />
        </div>
        <div className="flex flex-wrap gap-1">
          {matchData.topReactions.map((reaction, index) => (
            <span key={index} className="text-lg px-2 py-1 bg-muted/50 rounded-full">
              {reaction}
            </span>
          ))}
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Trending Now</span>
          <Zap className="w-4 h-4 text-warning" />
        </div>
        <div className="flex flex-wrap gap-1">
          {matchData.trendingHashtags.map((hashtag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{hashtag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Live Updates */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Live Fan Updates</span>
          <MessageCircle className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {matchData.liveUpdates.slice(0, 3).map((update, index) => (
            <div key={index} className="text-xs p-2 bg-muted/20 rounded border-l-2 border-l-primary/50">
              <div className={`font-medium ${getUpdateColor(update.sentiment)}`}>
                {update.text}
              </div>
              <div className="text-muted-foreground mt-1">
                {update.timestamp} • {update.team === "both" ? "General" : update.team === "home" ? matchData.homeTeam.name : matchData.awayTeam.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Flame className="w-3 h-3 text-destructive animate-pulse" />
          <span>Live pulse updates every 30 seconds</span>
        </div>
      )}
    </Card>
  );
}