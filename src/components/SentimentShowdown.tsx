import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Swords, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSentimentEmoji } from "@/lib/fanRatings";

interface ShowdownPlayer {
  name: string;
  team: string;
  sentiment: number;
  totalRatings: number;
  fanArguments: string[];
}

export function SentimentShowdown() {
  const [userVote, setUserVote] = useState<"p1" | "p2" | null>(null);

  const player1: ShowdownPlayer = {
    name: "Erling Haaland",
    team: "Manchester City",
    sentiment: 94,
    totalRatings: 2100000,
    fanArguments: ["More goals, more excitement", "Every touch is thrilling", "Born to score"],
  };

  const player2: ShowdownPlayer = {
    name: "Mohamed Salah",
    team: "Liverpool",
    sentiment: 91,
    totalRatings: 1800000,
    fanArguments: ["More complete player", "Consistently amazing for years", "Bigger legacy"],
  };

  const totalVotes = 45234 + (userVote ? 1 : 0);
  const p1Pct = userVote === "p1" ? 53 : userVote === "p2" ? 51 : 52;
  const p2Pct = 100 - p1Pct;

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const renderPlayer = (p: ShowdownPlayer, side: "p1" | "p2") => (
    <div className="flex-1 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
        <span className="text-4xl">{getSentimentEmoji(p.sentiment)}</span>
      </div>
      <h4 className="font-bold text-foreground mt-2">{p.name}</h4>
      <p className="text-xs text-muted-foreground">{p.team}</p>
      <div className="text-2xl font-black text-primary mt-1">{p.sentiment}%</div>
      <p className="text-[10px] text-muted-foreground">{formatCount(p.totalRatings)} ratings</p>
      <Button
        variant={userVote === side ? "default" : "outline"}
        size="sm"
        className="mt-3 w-full"
        onClick={() => setUserVote(side)}
      >
        {userVote === side ? "✓ Voted" : `Vote ${p.name.split(" ")[1]}`}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Swords className="w-8 h-8 text-primary mx-auto mb-2" />
        <h2 className="text-lg font-black text-foreground">SENTIMENT SHOWDOWN</h2>
        <p className="text-sm text-muted-foreground">Who do fans feel more positive about?</p>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-4">
          {renderPlayer(player1, "p1")}
          <div className="flex items-center pt-10">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
              VS
            </div>
          </div>
          {renderPlayer(player2, "p2")}
        </div>

        {/* Vote Results */}
        {userVote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 pt-4 border-t border-border"
          >
            <p className="text-xs text-muted-foreground text-center mb-2">
              {formatCount(totalVotes)} fans have voted
            </p>
            <div className="flex h-4 rounded-full overflow-hidden bg-muted">
              <motion.div
                className="bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${p1Pct}%` }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${p2Pct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold mt-1">
              <span className="text-primary">{player1.name.split(" ")[1]}: {p1Pct}%</span>
              <span className="text-accent">{player2.name.split(" ")[1]}: {p2Pct}%</span>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Fan Arguments */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">TOP FAN ARGUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-primary mb-2">{player1.name.split(" ")[1]} fans say:</p>
            {player1.fanArguments.map((arg, i) => (
              <p key={i} className="text-xs text-muted-foreground mb-1">• "{arg}"</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-accent mb-2">{player2.name.split(" ")[1]} fans say:</p>
            {player2.fanArguments.map((arg, i) => (
              <p key={i} className="text-xs text-muted-foreground mb-1">• "{arg}"</p>
            ))}
          </div>
        </div>
      </Card>

      <Button variant="outline" className="w-full">
        <Share2 className="w-4 h-4 mr-1" />
        Share This Comparison
      </Button>
    </div>
  );
}
