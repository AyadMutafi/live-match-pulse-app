import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WordEntry {
  word: string;
  count: number;
  sentiment: "positive" | "negative" | "neutral";
}

interface FanWordCloudProps {
  teamName: string;
  words?: WordEntry[];
}

const MOCK_WORDS: WordEntry[] = [
  { word: "EXCITED", count: 4520, sentiment: "positive" },
  { word: "GOALS", count: 3890, sentiment: "positive" },
  { word: "BRUNO", count: 3450, sentiment: "positive" },
  { word: "RASHFORD", count: 3200, sentiment: "positive" },
  { word: "LOVE", count: 2980, sentiment: "positive" },
  { word: "WIN", count: 2650, sentiment: "positive" },
  { word: "HAPPY", count: 2340, sentiment: "positive" },
  { word: "PROUD", count: 2100, sentiment: "positive" },
  { word: "SPEED", count: 1890, sentiment: "positive" },
  { word: "MAGICAL", count: 1670, sentiment: "positive" },
  { word: "STRONG", count: 1450, sentiment: "positive" },
  { word: "DEFENSE", count: 1230, sentiment: "neutral" },
  { word: "WORRIED", count: 890, sentiment: "negative" },
  { word: "NERVOUS", count: 670, sentiment: "negative" },
  { word: "UNLUCKY", count: 450, sentiment: "negative" },
];

const EMOTIONS = [
  { emoji: "😍", label: "Excited", pct: 45 },
  { emoji: "🔥", label: "On Fire", pct: 30 },
  { emoji: "🙂", label: "Happy", pct: 15 },
  { emoji: "😐", label: "Neutral", pct: 10 },
];

function getSentimentHSL(sentiment: string) {
  if (sentiment === "positive") return "hsl(var(--success))";
  if (sentiment === "negative") return "hsl(var(--destructive))";
  return "hsl(var(--muted-foreground))";
}

export function FanWordCloud({ teamName, words = MOCK_WORDS }: FanWordCloudProps) {
  const maxCount = useMemo(() => Math.max(...words.map(w => w.count)), [words]);

  const getSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-2xl font-black";
    if (ratio > 0.6) return "text-xl font-bold";
    if (ratio > 0.4) return "text-lg font-semibold";
    if (ratio > 0.2) return "text-base font-medium";
    return "text-sm font-normal";
  };

  // Shuffle words for organic feel
  const shuffled = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-lg">☁️</span>
          Fan Feelings Cloud
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {teamName} fans right now
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Cloud */}
        <div className="bg-muted/30 rounded-xl p-5 min-h-[180px] flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {shuffled.map((entry, i) => (
            <motion.span
              key={entry.word}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
              className={`${getSize(entry.count)} cursor-default transition-transform hover:scale-110`}
              style={{ color: getSentimentHSL(entry.sentiment) }}
              title={`${entry.word}: ${entry.count.toLocaleString()} mentions`}
            >
              {entry.word}
            </motion.span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--success))" }} />
            Positive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(var(--destructive))" }} />
            Negative
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Neutral
          </span>
        </div>

        {/* Top Emotions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-[10px] text-muted-foreground">Top Emotions:</span>
          {EMOTIONS.map((e) => (
            <Badge key={e.label} variant="secondary" className="text-[10px] gap-1">
              {e.emoji} {e.label} ({e.pct}%)
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
