import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Star, ThumbsUp, ThumbsDown, MessageSquare, Flame, Frown } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerSentiment {
  id: string;
  name: string;
  team: string;
  position: string;
  sentimentScore: number;
  mentions: number;
  topReaction: string;
  change: number;
  highlights: string[];
}

interface MatchTopFlopProps {
  matchId?: string;
  homeTeam?: string;
  awayTeam?: string;
  topPlayers?: PlayerSentiment[];
  flopPlayers?: PlayerSentiment[];
}

const mockTopPlayers: PlayerSentiment[] = [
  {
    id: "1",
    name: "Mohamed Salah",
    team: "Liverpool",
    position: "Forward",
    sentimentScore: 94,
    mentions: 15420,
    topReaction: "🔥",
    change: 18,
    highlights: ["Hat-trick hero", "Unstoppable", "Egyptian King"]
  },
  {
    id: "2",
    name: "Erling Haaland",
    team: "Manchester City",
    position: "Forward",
    sentimentScore: 91,
    mentions: 12850,
    topReaction: "⚡",
    change: 12,
    highlights: ["Clinical finish", "Monster performance"]
  },
  {
    id: "3",
    name: "Jude Bellingham",
    team: "Real Madrid",
    position: "Midfielder",
    sentimentScore: 88,
    mentions: 11200,
    topReaction: "💫",
    change: 8,
    highlights: ["MOTM contender", "Future Ballon d'Or"]
  }
];

const mockFlopPlayers: PlayerSentiment[] = [
  {
    id: "1",
    name: "Harry Maguire",
    team: "Manchester United",
    position: "Defender",
    sentimentScore: 22,
    mentions: 8900,
    topReaction: "😬",
    change: -35,
    highlights: ["Another mistake", "Needs to be dropped", "Cost us the game"]
  },
  {
    id: "2",
    name: "Raheem Sterling",
    team: "Chelsea",
    position: "Forward",
    sentimentScore: 28,
    mentions: 6200,
    topReaction: "😤",
    change: -22,
    highlights: ["Invisible", "Wasted chances", "Not good enough"]
  },
  {
    id: "3",
    name: "Marcus Rashford",
    team: "Manchester United",
    position: "Forward",
    sentimentScore: 31,
    mentions: 7100,
    topReaction: "😔",
    change: -18,
    highlights: ["Missing his chances", "Off form", "Where's the old Marcus?"]
  }
];

const getSentimentColor = (score: number) => {
  if (score >= 80) return "text-[hsl(var(--success))]";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-[hsl(var(--warning))]";
  return "text-destructive";
};

const getSentimentBg = (score: number) => {
  if (score >= 80) return "bg-[hsl(var(--success))]";
  if (score >= 60) return "bg-primary";
  if (score >= 40) return "bg-[hsl(var(--warning))]";
  return "bg-destructive";
};

export function MatchTopFlop({ 
  homeTeam = "Liverpool", 
  awayTeam = "Manchester City",
  topPlayers = mockTopPlayers,
  flopPlayers = mockFlopPlayers
}: MatchTopFlopProps) {
  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="text-center">
        <Badge variant="outline" className="mb-2 border-primary/30 text-primary">
          Based on Fan Sentiment
        </Badge>
        <p className="text-sm text-muted-foreground">
          {homeTeam} vs {awayTeam}
        </p>
      </div>

      {/* TOP Players */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[hsl(var(--success))]/20">
            <Flame className="w-4 h-4 text-[hsl(var(--success))]" />
          </div>
          <span className="font-semibold text-sm">Top Performers</span>
          <Badge className="ml-auto bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-0 text-[10px]">
            Fan Favorites
          </Badge>
        </div>

        {topPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 border-[hsl(var(--success))]/20 bg-gradient-to-r from-[hsl(var(--success))]/5 to-transparent">
              <div className="flex items-start gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--success))]/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-[hsl(var(--success))]" />
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{player.name}</span>
                    <span className="text-lg">{player.topReaction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{player.team}</span>
                    <span>•</span>
                    <span>{player.position}</span>
                  </div>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1">
                    {player.highlights.slice(0, 2).map((highlight, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-[10px] px-1.5 py-0 border-[hsl(var(--success))]/30 text-[hsl(var(--success))]"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sentiment Score */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-xl font-bold ${getSentimentColor(player.sentimentScore)}`}>
                    {player.sentimentScore}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--success))]">
                    <TrendingUp className="w-3 h-3" />
                    +{player.change}%
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <MessageSquare className="w-2.5 h-2.5" />
                    {(player.mentions / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>

              {/* Sentiment Bar */}
              <div className="mt-2">
                <Progress 
                  value={player.sentimentScore} 
                  className="h-1.5 bg-muted"
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FLOP Players */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-destructive/20">
            <Frown className="w-4 h-4 text-destructive" />
          </div>
          <span className="font-semibold text-sm">Under Pressure</span>
          <Badge className="ml-auto bg-destructive/20 text-destructive border-0 text-[10px]">
            Fan Frustration
          </Badge>
        </div>

        {flopPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Card className="p-3 border-destructive/20 bg-gradient-to-r from-destructive/5 to-transparent">
              <div className="flex items-start gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ThumbsDown className="w-4 h-4 text-destructive" />
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{player.name}</span>
                    <span className="text-lg">{player.topReaction}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{player.team}</span>
                    <span>•</span>
                    <span>{player.position}</span>
                  </div>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1">
                    {player.highlights.slice(0, 2).map((highlight, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-[10px] px-1.5 py-0 border-destructive/30 text-destructive"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sentiment Score */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-xl font-bold ${getSentimentColor(player.sentimentScore)}`}>
                    {player.sentimentScore}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-destructive">
                    <TrendingDown className="w-3 h-3" />
                    {player.change}%
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <MessageSquare className="w-2.5 h-2.5" />
                    {(player.mentions / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>

              {/* Sentiment Bar */}
              <div className="mt-2">
                <Progress 
                  value={player.sentimentScore} 
                  className="h-1.5 bg-muted"
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
