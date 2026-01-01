import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Crown, Flame, Target, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  correctPredictions: number;
  totalPredictions: number;
  streak: number;
  badges: string[];
  accuracy: number;
}

interface FanLeaderboardProps {
  entries?: LeaderboardEntry[];
  currentUserId?: string;
}

// Mock data for demonstration
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "1",
    displayName: "FanPulseKing",
    points: 2450,
    correctPredictions: 45,
    totalPredictions: 52,
    streak: 8,
    badges: ["🏆", "🔥", "⚡"],
    accuracy: 86.5
  },
  {
    rank: 2,
    userId: "2",
    displayName: "SentimentSage",
    points: 2180,
    correctPredictions: 41,
    totalPredictions: 50,
    streak: 5,
    badges: ["🥈", "🎯"],
    accuracy: 82.0
  },
  {
    rank: 3,
    userId: "3",
    displayName: "PulsePredictor",
    points: 1920,
    correctPredictions: 38,
    totalPredictions: 48,
    streak: 3,
    badges: ["🥉", "📊"],
    accuracy: 79.2
  },
  {
    rank: 4,
    userId: "4",
    displayName: "MatchMaster",
    points: 1780,
    correctPredictions: 35,
    totalPredictions: 46,
    streak: 2,
    badges: ["⭐"],
    accuracy: 76.1
  },
  {
    rank: 5,
    userId: "5",
    displayName: "FanForecast",
    points: 1650,
    correctPredictions: 33,
    totalPredictions: 45,
    streak: 4,
    badges: ["🌟"],
    accuracy: 73.3
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-[hsl(var(--warning))]" />;
    case 2:
      return <Medal className="w-5 h-5 text-muted-foreground" />;
    case 3:
      return <Medal className="w-5 h-5 text-warning/70" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankBackground = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-[hsl(var(--warning))]/20 to-[hsl(var(--warning))]/5 border-[hsl(var(--warning))]/30";
    case 2:
      return "bg-gradient-to-r from-muted/50 to-muted/20 border-muted-foreground/20";
    case 3:
      return "bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20";
    default:
      return "bg-card border-border";
  }
};

export function FanLeaderboard({ entries = mockLeaderboard, currentUserId }: FanLeaderboardProps) {
  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Top Score</p>
              <p className="text-sm font-bold text-primary">{entries[0]?.points.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-gradient-to-br from-[hsl(var(--success))]/10 to-[hsl(var(--success))]/5 border-[hsl(var(--success))]/20">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[hsl(var(--success))]" />
            <div>
              <p className="text-xs text-muted-foreground">Best Accuracy</p>
              <p className="text-sm font-bold text-[hsl(var(--success))]">{entries[0]?.accuracy}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Hot Streak</p>
              <p className="text-sm font-bold text-accent">{Math.max(...entries.map(e => e.streak))} 🔥</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`p-3 border transition-all hover:scale-[1.02] ${getRankBackground(entry.rank)} ${
                entry.userId === currentUserId ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{entry.displayName}</span>
                    {entry.streak >= 3 && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 border-accent/50 text-accent">
                        <Flame className="w-2.5 h-2.5 mr-0.5" />
                        {entry.streak}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {entry.correctPredictions}/{entry.totalPredictions} correct
                    </span>
                    <span className="text-xs">{entry.badges.join(" ")}</span>
                  </div>
                </div>

                {/* Points & Accuracy */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-sm">{entry.points.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--success))]">
                    <TrendingUp className="w-2.5 h-2.5" />
                    {entry.accuracy}%
                  </div>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div className="mt-2">
                <Progress 
                  value={entry.accuracy} 
                  className="h-1.5 bg-muted"
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Your Rank (if not in top 5) */}
      {currentUserId && !entries.find(e => e.userId === currentUserId) && (
        <Card className="p-3 border-dashed border-primary/50 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-8 flex justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-primary">Your Rank: #42</span>
              <p className="text-xs text-muted-foreground">Keep predicting to climb up!</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              1,250 pts
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}
