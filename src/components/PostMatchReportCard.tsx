import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Trophy, TrendingUp, TrendingDown, Users } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerRating {
  id: string;
  name: string;
  position: string;
  team: "home" | "away";
  fanRating: number;
  votes: number;
  positivePercentage: number;
  keyMoments: string[];
  sentiment: number;
  isMOTM?: boolean;
  isFlop?: boolean;
}

interface PostMatchReportCardProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

const MOCK_RATINGS: PlayerRating[] = [
  // Home Team
  {
    id: "1",
    name: "M. Salah",
    position: "RW",
    team: "home",
    fanRating: 9.2,
    votes: 12500,
    positivePercentage: 94,
    keyMoments: ["2 Goals", "1 Assist", "Key dribbles"],
    sentiment: 95,
    isMOTM: true,
  },
  {
    id: "2",
    name: "V. van Dijk",
    position: "CB",
    team: "home",
    fanRating: 8.1,
    votes: 8900,
    positivePercentage: 82,
    keyMoments: ["Clean sheet", "5 clearances"],
    sentiment: 85,
  },
  {
    id: "3",
    name: "A. Robertson",
    position: "LB",
    team: "home",
    fanRating: 6.8,
    votes: 7200,
    positivePercentage: 58,
    keyMoments: ["1 Assist", "Defensive error"],
    sentiment: 62,
  },
  {
    id: "4",
    name: "C. Jones",
    position: "CM",
    team: "home",
    fanRating: 5.4,
    votes: 6800,
    positivePercentage: 35,
    keyMoments: ["Lost possession 12x", "Yellow card"],
    sentiment: 38,
    isFlop: true,
  },
  // Away Team
  {
    id: "5",
    name: "K. De Bruyne",
    position: "CM",
    team: "away",
    fanRating: 7.8,
    votes: 9500,
    positivePercentage: 75,
    keyMoments: ["1 Goal", "Key passes"],
    sentiment: 78,
  },
  {
    id: "6",
    name: "E. Haaland",
    position: "ST",
    team: "away",
    fanRating: 6.2,
    votes: 11000,
    positivePercentage: 48,
    keyMoments: ["Missed sitter", "Offside goal"],
    sentiment: 52,
  },
  {
    id: "7",
    name: "J. Stones",
    position: "CB",
    team: "away",
    fanRating: 4.8,
    votes: 8200,
    positivePercentage: 28,
    keyMoments: ["Own goal", "Penalty conceded"],
    sentiment: 25,
    isFlop: true,
  },
];

export function PostMatchReportCard({ 
  matchId, 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore 
}: PostMatchReportCardProps) {
  const [activeTab, setActiveTab] = useState("all");

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500 bg-green-500/10";
    if (rating >= 6.5) return "text-yellow-500 bg-yellow-500/10";
    if (rating >= 5) return "text-orange-500 bg-orange-500/10";
    return "text-red-500 bg-red-500/10";
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 8.5) return "🌟";
    if (rating >= 7.5) return "👏";
    if (rating >= 6) return "👍";
    if (rating >= 5) return "😐";
    return "👎";
  };

  const filteredRatings = MOCK_RATINGS.filter(p => {
    if (activeTab === "all") return true;
    if (activeTab === "home") return p.team === "home";
    if (activeTab === "away") return p.team === "away";
    if (activeTab === "top") return p.fanRating >= 7.5;
    if (activeTab === "flops") return p.fanRating < 5.5;
    return true;
  }).sort((a, b) => b.fanRating - a.fanRating);

  const motm = MOCK_RATINGS.find(p => p.isMOTM);
  const flop = MOCK_RATINGS.find(p => p.fanRating === Math.min(...MOCK_RATINGS.map(r => r.fanRating)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Post-Match Fan Report Card
          </CardTitle>
          <Badge variant="secondary">
            {MOCK_RATINGS.reduce((a, b) => a + b.votes, 0).toLocaleString()} votes
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="font-semibold">{homeTeam}</p>
            <p className="text-3xl font-bold">{homeScore}</p>
          </div>
          <span className="text-2xl text-muted-foreground">-</span>
          <div className="text-center">
            <p className="font-semibold">{awayTeam}</p>
            <p className="text-3xl font-bold">{awayScore}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* MOTM & Flop Highlights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {motm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-lg border border-yellow-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-yellow-500">Man of the Match</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-yellow-500/20 text-yellow-500">
                    {motm.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{motm.name}</p>
                  <p className="text-sm text-muted-foreground">{motm.position}</p>
                </div>
                <Badge className="ml-auto text-lg bg-yellow-500">
                  {motm.fanRating.toFixed(1)} 🌟
                </Badge>
              </div>
            </motion.div>
          )}
          {flop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-lg border border-red-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-red-500">Fan Disappointment</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-red-500/20 text-red-500">
                    {flop.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{flop.name}</p>
                  <p className="text-sm text-muted-foreground">{flop.position}</p>
                </div>
                <Badge variant="destructive" className="ml-auto text-lg">
                  {flop.fanRating.toFixed(1)} 👎
                </Badge>
              </div>
            </motion.div>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="home">{homeTeam.split(" ")[0]}</TabsTrigger>
            <TabsTrigger value="away">{awayTeam.split(" ")[0]}</TabsTrigger>
            <TabsTrigger value="top">Top Rated</TabsTrigger>
            <TabsTrigger value="flops">Flops</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Player Ratings List */}
        <div className="space-y-3 mt-4">
          {filteredRatings.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                player.isMOTM ? "bg-yellow-500/5 border-yellow-500/30" :
                player.isFlop ? "bg-red-500/5 border-red-500/30" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rating Badge */}
                <div className={`px-3 py-2 rounded-lg font-bold text-xl ${getRatingColor(player.fanRating)}`}>
                  {player.fanRating.toFixed(1)}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{player.name}</span>
                    <Badge variant="outline" className="text-xs">{player.position}</Badge>
                    {player.isMOTM && <Badge className="bg-yellow-500 text-xs">MOTM</Badge>}
                    {player.isFlop && <Badge variant="destructive" className="text-xs">FLOP</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {player.team === "home" ? homeTeam : awayTeam}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {player.keyMoments.map((moment, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{moment}</Badge>
                    ))}
                  </div>
                </div>

                {/* Voting Stats */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {player.votes.toLocaleString()} votes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{player.positivePercentage}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <ThumbsDown className="h-4 w-4" />
                      <span className="text-sm">{100 - player.positivePercentage}%</span>
                    </div>
                  </div>
                  <Progress 
                    value={player.positivePercentage} 
                    className="h-1.5 mt-2 w-24"
                  />
                </div>

                {/* Rating Emoji */}
                <span className="text-2xl">{getRatingEmoji(player.fanRating)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
