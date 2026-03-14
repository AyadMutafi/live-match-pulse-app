import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SENTIMENT_SCALE, MatchPlayer } from "@/lib/fanRatings";

interface LiveMatchRatingProps {
  matchTitle: string;
  minute: number;
  players: MatchPlayer[];
}

interface MockMoment {
  minute: number;
  emoji: string;
  text: string;
}

export function LiveMatchRating({ matchTitle, minute, players }: LiveMatchRatingProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  const player = players[currentIdx];

  // Mock live sentiment & moments per player
  const liveSentiment = 60 + (player.name.length * 3) % 35;
  const moments: MockMoment[] = [
    { minute: Math.max(1, minute - 12), emoji: "🎯", text: "Key pass" },
    { minute: Math.max(1, minute - 25), emoji: "⚽", text: "Assist" },
    { minute: Math.max(1, minute - 38), emoji: "😰", text: "Missed chance" },
  ].filter(m => m.minute > 0);

  const navigate = (dir: number) => {
    setCurrentIdx(prev => Math.max(0, Math.min(players.length - 1, prev + dir)));
  };

  return (
    <Card className="p-4 border-primary/30">
      {/* Live Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
          <span className="text-sm font-bold text-foreground">LIVE</span>
          <span className="text-sm text-muted-foreground">{matchTitle} ({minute}')</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">Rate players as you watch! Sentiment updates live.</p>

      {/* Player Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-muted/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-foreground">{player.name}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Current:</span>
                <span className="text-base">{liveSentiment >= 80 ? "😍" : liveSentiment >= 60 ? "🙂" : "😐"}</span>
                <span className="font-semibold text-foreground">{liveSentiment}%</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {player.position} #{player.number}
            </Badge>
          </div>

          {/* Your Rating */}
          <div className="flex gap-1 my-3">
            {SENTIMENT_SCALE.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setUserRatings(prev => ({ ...prev, [player.id]: idx }))}
                className={`flex-1 h-10 rounded-lg text-lg transition-all flex items-center justify-center ${
                  userRatings[player.id] === idx
                    ? "bg-primary/20 ring-2 ring-primary scale-105"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                {opt.emoji}
              </button>
            ))}
          </div>

          {/* Recent Moments */}
          <div className="space-y-1 mb-3">
            <p className="text-xs font-medium text-muted-foreground">Recent moments:</p>
            {moments.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{m.minute}'</span>
                <span>-</span>
                <span>{m.emoji} {m.text}</span>
              </div>
            ))}
          </div>

          {/* Live Sentiment Bar */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Live fan sentiment:</p>
            <div className="flex items-center gap-2">
              <Progress value={liveSentiment} className="h-2.5 flex-1" />
              <span className="text-xs font-bold text-foreground">{liveSentiment}%</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-3">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === 0}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentIdx + 1} / {players.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === players.length - 1}
          onClick={() => navigate(1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
