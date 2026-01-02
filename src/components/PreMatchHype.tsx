import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Users, MessageCircle, TrendingUp, Clock, Swords, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PreMatchData {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoff: string;
  homeConfidence: number;
  awayConfidence: number;
  totalBuzz: number;
  trendingTopics: string[];
  fanPredictions: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  keyDiscussions: {
    topic: string;
    mentions: number;
    sentiment: "positive" | "negative" | "neutral";
  }[];
}

interface PreMatchHypeProps {
  matchData?: PreMatchData;
}

const MOCK_DATA: PreMatchData = {
  homeTeam: "Liverpool",
  awayTeam: "Bayern Munich",
  competition: "Champions League",
  kickoff: "2025-12-15T20:00:00",
  homeConfidence: 73,
  awayConfidence: 62,
  totalBuzz: 45600,
  trendingTopics: ["#LIVBAY", "#UCL", "#SalahVsMusiala", "#Anfield"],
  fanPredictions: {
    homeWin: 48,
    draw: 24,
    awayWin: 28,
  },
  keyDiscussions: [
    { topic: "Salah vs Musiala battle", mentions: 8900, sentiment: "positive" },
    { topic: "Van Dijk return from injury", mentions: 6200, sentiment: "positive" },
    { topic: "Bayern's defensive issues", mentions: 5400, sentiment: "negative" },
    { topic: "Anfield atmosphere", mentions: 4800, sentiment: "positive" },
  ],
};

export function PreMatchHype({ matchData = MOCK_DATA }: PreMatchHypeProps) {
  const [timeToKickoff, setTimeToKickoff] = useState("");
  const [hypeLevel, setHypeLevel] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const kickoff = new Date(matchData.kickoff);
      const now = new Date();
      const diff = kickoff.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeToKickoff(`${hours}h ${minutes}m`);
      } else {
        setTimeToKickoff("LIVE NOW");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    
    // Animate hype level
    const hypeInterval = setInterval(() => {
      setHypeLevel(prev => {
        const target = (matchData.homeConfidence + matchData.awayConfidence) / 2;
        return prev + (target - prev) * 0.1;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(hypeInterval);
    };
  }, [matchData]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-500 bg-green-500/10";
      case "negative": return "text-red-500 bg-red-500/10";
      default: return "text-yellow-500 bg-yellow-500/10";
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Hype Banner */}
      <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-6">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="font-bold text-xl">{matchData.homeTeam}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="outline">{matchData.homeConfidence}% confident</Badge>
            </div>
          </div>
          
          <div className="px-6">
            <Swords className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center flex-1">
            <p className="font-bold text-xl">{matchData.awayTeam}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="outline">{matchData.awayConfidence}% confident</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-lg">{timeToKickoff}</span>
          <Badge variant="secondary">{matchData.competition}</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Pre-Match Hype Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Hype Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fan Hype Level</span>
            <span className="font-bold">{Math.round(hypeLevel)}%</span>
          </div>
          <div className="relative">
            <Progress value={hypeLevel} className="h-4" />
            <motion.div
              className="absolute inset-0 flex items-center justify-end pr-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="h-5 w-5 text-orange-500" />
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {matchData.totalBuzz.toLocaleString()} fans discussing this match
          </p>
        </div>

        {/* Fan Predictions */}
        <div>
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Fan Predictions
          </p>
          <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchData.fanPredictions.homeWin}%` }}
              transition={{ duration: 1 }}
              className="bg-green-500 flex items-center justify-center text-white text-sm font-bold"
            >
              {matchData.fanPredictions.homeWin}%
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchData.fanPredictions.draw}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-yellow-500 flex items-center justify-center text-white text-sm font-bold"
            >
              {matchData.fanPredictions.draw}%
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchData.fanPredictions.awayWin}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="bg-blue-500 flex items-center justify-center text-white text-sm font-bold"
            >
              {matchData.fanPredictions.awayWin}%
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{matchData.homeTeam} win</span>
            <span>Draw</span>
            <span>{matchData.awayTeam} win</span>
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending Now
          </p>
          <div className="flex flex-wrap gap-2">
            {matchData.trendingTopics.map((topic, index) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Discussions */}
        <div>
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Key Fan Discussions
          </p>
          <div className="space-y-2">
            {matchData.keyDiscussions.map((discussion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${getSentimentColor(discussion.sentiment)}`}
              >
                <span className="font-medium">{discussion.topic}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{discussion.mentions.toLocaleString()} mentions</Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full" size="lg">
          <MessageCircle className="h-4 w-4 mr-2" />
          Join the Discussion
        </Button>
      </CardContent>
    </Card>
  );
}
