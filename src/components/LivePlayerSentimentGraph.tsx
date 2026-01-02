import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { User, TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerSentiment {
  id: string;
  name: string;
  position: string;
  team: string;
  currentSentiment: number;
  trend: "up" | "down" | "stable";
  mentions: number;
  timeline: { minute: number; sentiment: number }[];
  keyMoments: { minute: number; event: string; impact: number }[];
}

interface LivePlayerSentimentGraphProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

const generateTimeline = () => {
  const data = [];
  let sentiment = 50 + Math.random() * 20;
  for (let i = 0; i <= 90; i += 5) {
    sentiment = Math.max(10, Math.min(100, sentiment + (Math.random() - 0.5) * 20));
    data.push({ minute: i, sentiment: Math.round(sentiment) });
  }
  return data;
};

const MOCK_PLAYERS: PlayerSentiment[] = [
  {
    id: "1",
    name: "M. Salah",
    position: "RW",
    team: "Liverpool",
    currentSentiment: 87,
    trend: "up",
    mentions: 4520,
    timeline: generateTimeline(),
    keyMoments: [
      { minute: 23, event: "Goal scored", impact: 35 },
      { minute: 67, event: "Assist", impact: 20 },
    ],
  },
  {
    id: "2",
    name: "V. van Dijk",
    position: "CB",
    team: "Liverpool",
    currentSentiment: 72,
    trend: "stable",
    mentions: 2180,
    timeline: generateTimeline(),
    keyMoments: [
      { minute: 41, event: "Key interception", impact: 15 },
    ],
  },
  {
    id: "3",
    name: "K. De Bruyne",
    position: "CM",
    team: "Man City",
    currentSentiment: 45,
    trend: "down",
    mentions: 3890,
    timeline: generateTimeline(),
    keyMoments: [
      { minute: 34, event: "Missed chance", impact: -25 },
      { minute: 56, event: "Lost possession", impact: -15 },
    ],
  },
  {
    id: "4",
    name: "E. Haaland",
    position: "ST",
    team: "Man City",
    currentSentiment: 62,
    trend: "up",
    mentions: 5120,
    timeline: generateTimeline(),
    keyMoments: [
      { minute: 78, event: "Goal scored", impact: 30 },
    ],
  },
];

export function LivePlayerSentimentGraph({ matchId, homeTeam, awayTeam }: LivePlayerSentimentGraphProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSentiment>(MOCK_PLAYERS[0]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return "text-green-500";
    if (sentiment >= 50) return "text-yellow-500";
    if (sentiment >= 25) return "text-orange-500";
    return "text-red-500";
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🔥";
    if (sentiment >= 65) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 35) return "😟";
    return "😰";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}'</p>
          <p className={getSentimentColor(payload[0].value)}>
            Sentiment: {payload[0].value}% {getSentimentEmoji(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Player Sentiment Graph
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            <span className="mr-1 h-2 w-2 rounded-full bg-white inline-block" />
            LIVE
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Track how fan sentiment changes for each player during the match
        </p>
      </CardHeader>
      <CardContent>
        {/* Player Selection */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {MOCK_PLAYERS.map((player) => (
            <motion.button
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                selectedPlayer.id === player.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">{player.name}</span>
              <Badge variant={selectedPlayer.id === player.id ? "secondary" : "outline"} className="text-xs">
                {player.position}
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* Selected Player Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Sentiment</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getSentimentEmoji(selectedPlayer.currentSentiment)}</span>
              <span className={`text-2xl font-bold ${getSentimentColor(selectedPlayer.currentSentiment)}`}>
                {selectedPlayer.currentSentiment}%
              </span>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Trend</p>
            <div className="flex items-center gap-2">
              {selectedPlayer.trend === "up" ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : selectedPlayer.trend === "down" ? (
                <TrendingDown className="h-6 w-6 text-red-500" />
              ) : (
                <Activity className="h-6 w-6 text-yellow-500" />
              )}
              <span className="text-lg font-semibold capitalize">{selectedPlayer.trend}</span>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Mentions</p>
            <p className="text-2xl font-bold">{selectedPlayer.mentions.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Team</p>
            <p className="text-lg font-semibold">{selectedPlayer.team}</p>
          </div>
        </div>

        {/* Sentiment Timeline Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedPlayer.timeline}>
              <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="minute" 
                tickFormatter={(value) => `${value}'`}
                className="text-xs"
              />
              <YAxis 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#sentimentGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key Moments */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Key Moments
          </h4>
          <div className="space-y-2">
            {selectedPlayer.keyMoments.map((moment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  moment.impact > 0 ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{moment.minute}'</Badge>
                  <span>{moment.event}</span>
                </div>
                <Badge variant={moment.impact > 0 ? "default" : "destructive"}>
                  {moment.impact > 0 ? "+" : ""}{moment.impact}%
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
