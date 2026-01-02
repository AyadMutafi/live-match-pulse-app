import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, MessageCircle, Flame, ArrowUp, ArrowDown, Minus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrendingPlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  mentions: number;
  mentionChange: number;
  sentiment: number;
  sentimentChange: number;
  topReason: string;
  isHot: boolean;
}

interface TrendingPlayersProps {
  matchId?: string;
  league?: string;
}

const MOCK_TRENDING: TrendingPlayer[] = [
  {
    id: "1",
    name: "M. Salah",
    team: "Liverpool",
    position: "RW",
    mentions: 12500,
    mentionChange: 234,
    sentiment: 92,
    sentimentChange: 15,
    topReason: "Stunning hat-trick performance",
    isHot: true,
  },
  {
    id: "2",
    name: "J. Bellingham",
    team: "Real Madrid",
    position: "CM",
    mentions: 9800,
    mentionChange: 156,
    sentiment: 88,
    sentimentChange: 8,
    topReason: "Match-winning goal",
    isHot: true,
  },
  {
    id: "3",
    name: "K. Mbappé",
    team: "Real Madrid",
    position: "LW",
    mentions: 8900,
    mentionChange: -45,
    sentiment: 45,
    sentimentChange: -22,
    topReason: "Missed penalty in crucial moment",
    isHot: false,
  },
  {
    id: "4",
    name: "V. Osimhen",
    team: "Napoli",
    position: "ST",
    mentions: 7200,
    mentionChange: 89,
    sentiment: 85,
    sentimentChange: 12,
    topReason: "Back-to-back goals",
    isHot: true,
  },
  {
    id: "5",
    name: "B. Saka",
    team: "Arsenal",
    position: "RW",
    mentions: 6500,
    mentionChange: 67,
    sentiment: 78,
    sentimentChange: 5,
    topReason: "Creative assist",
    isHot: false,
  },
];

export function TrendingPlayers({ matchId, league }: TrendingPlayersProps) {
  const [players, setPlayers] = useState<TrendingPlayer[]>(MOCK_TRENDING);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setPlayers(prev => prev.map(p => ({
        ...p,
        mentions: p.mentions + Math.floor(Math.random() * 50),
        mentionChange: p.mentionChange + Math.floor((Math.random() - 0.3) * 10),
      })));
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return "text-green-500";
    if (sentiment >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🔥";
    if (sentiment >= 65) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 35) return "😟";
    return "😤";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Players
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Updated {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Who fans are talking about most right now
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  player.isHot ? "bg-orange-500/5 border-orange-500/20" : "bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                    {player.isHot && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Flame className="h-5 w-5 text-orange-500" />
                      </motion.div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {player.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {player.team} • {player.position}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 italic">
                      "{player.topReason}"
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Mentions */}
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>Mentions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{player.mentions.toLocaleString()}</span>
                          <div className="flex items-center gap-0.5">
                            {getChangeIcon(player.mentionChange)}
                            <span className={`text-xs ${
                              player.mentionChange > 0 ? "text-green-500" : 
                              player.mentionChange < 0 ? "text-red-500" : "text-muted-foreground"
                            }`}>
                              {player.mentionChange > 0 ? "+" : ""}{player.mentionChange}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sentiment */}
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Zap className="h-3 w-3" />
                          <span>Fan Sentiment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getSentimentEmoji(player.sentiment)}</span>
                          <span className={`font-bold ${getSentimentColor(player.sentiment)}`}>
                            {player.sentiment}%
                          </span>
                          <div className="flex items-center gap-0.5">
                            {getChangeIcon(player.sentimentChange)}
                            <span className={`text-xs ${
                              player.sentimentChange > 0 ? "text-green-500" : 
                              player.sentimentChange < 0 ? "text-red-500" : "text-muted-foreground"
                            }`}>
                              {player.sentimentChange > 0 ? "+" : ""}{player.sentimentChange}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mention Bar */}
                    <div className="mt-3">
                      <Progress 
                        value={(player.mentions / players[0].mentions) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
