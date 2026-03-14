import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Share2, ThumbsUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  getSentimentEmoji,
  getSentimentLabel,
  generateMockPlayerSentiment,
  PlayerSentimentData,
} from "@/lib/fanRatings";

interface PlayerSentimentProfileProps {
  playerName: string;
  teamName: string;
  position: string;
  number: number;
  onRate?: () => void;
}

export function PlayerSentimentProfile({
  playerName,
  teamName,
  position,
  number,
  onRate,
}: PlayerSentimentProfileProps) {
  const data = useMemo(() => generateMockPlayerSentiment(playerName), [playerName]);
  const emoji = getSentimentEmoji(data.averageSentiment);
  const label = getSentimentLabel(data.averageSentiment);

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="space-y-4">
      {/* Hero */}
      <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="text-xl font-bold text-foreground">{playerName}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {position} • {teamName} • #{number}
        </p>

        <div className="my-5">
          <span className="text-6xl">{emoji}</span>
          <div className="text-4xl font-black text-foreground mt-2">{data.averageSentiment}%</div>
          <div className="text-lg font-bold text-primary">{label.toUpperCase()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {formatCount(data.totalRatings)} fan ratings this season
          </p>
        </div>
      </Card>

      {/* Sentiment Trend */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">
          SENTIMENT TREND (Last 10 matches)
        </h3>
        <div className="flex items-end gap-1 h-32">
          {data.sentimentHistory.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs">{getSentimentEmoji(point.value)}</span>
              <motion.div
                className="w-full rounded-t-sm bg-primary/70"
                initial={{ height: 0 }}
                animate={{ height: `${point.value}%` }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              />
              <span className="text-[9px] text-muted-foreground">{point.week}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* What Fans Love */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">🔥 WHAT FANS LOVE</h3>
        <div className="space-y-2">
          {data.loved.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-sm text-foreground">"{item.phrase}"</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatCount(item.count)} ratings</span>
            </div>
          ))}
        </div>
      </Card>

      {/* What Fans Criticize */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">😤 WHAT FANS CRITICIZE</h3>
        <div className="space-y-2">
          {data.criticized.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-destructive/5">
              <span className="text-sm text-foreground">"{item.phrase}"</span>
              <span className="text-xs text-muted-foreground">{formatCount(item.count)} ratings</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Fan Comments */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">💬 FAN COMMENTS</h3>
        <div className="space-y-3">
          {data.comments.map((c, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-primary">{c.user}</span>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{c.text}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <ThumbsUp className="w-3 h-3" />
                <span>{formatCount(c.likes)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {onRate && (
          <Button className="flex-1" onClick={onRate}>
            Add Your Rating
          </Button>
        )}
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-1" />
          Share Profile
        </Button>
      </div>
    </div>
  );
}
