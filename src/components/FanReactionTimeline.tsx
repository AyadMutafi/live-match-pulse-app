import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  minute: number;
  event: string;
  emoji: string;
  reaction: string;
  sentimentChange: number;
}

interface FanReactionTimelineProps {
  homeTeam: string;
  awayTeam: string;
  events?: TimelineEvent[];
  topEmojis?: { emoji: string; count: number }[];
}

const MOCK_EVENTS: TimelineEvent[] = [
  { minute: 15, event: "🥅 GOAL!", emoji: "😍", reaction: "YESSS!", sentimentChange: 45 },
  { minute: 34, event: "😰 Miss", emoji: "😤", reaction: "How did he miss?!", sentimentChange: -30 },
  { minute: 56, event: "🥅 GOAL!", emoji: "😍", reaction: "Brunooo!", sentimentChange: 35 },
  { minute: 78, event: "🥅 GOAL!", emoji: "🔥", reaction: "GAME OVER!", sentimentChange: 25 },
  { minute: 90, event: "🏆 WIN!", emoji: "🔥", reaction: "THREE POINTS!", sentimentChange: 15 },
];

const MOCK_TOP_EMOJIS = [
  { emoji: "🔥", count: 12345 },
  { emoji: "😍", count: 8901 },
  { emoji: "⚽", count: 6234 },
  { emoji: "🎉", count: 4567 },
  { emoji: "💪", count: 2345 },
];

function formatNumber(num: number) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Build sentiment line from events
function buildSentimentPath(events: TimelineEvent[]) {
  let current = 50;
  const points: { minute: number; sentiment: number }[] = [{ minute: 0, sentiment: 50 }];
  for (const ev of events) {
    current = Math.max(0, Math.min(100, current + ev.sentimentChange));
    points.push({ minute: ev.minute, sentiment: current });
  }
  return points;
}

export function FanReactionTimeline({
  homeTeam,
  awayTeam,
  events = MOCK_EVENTS,
  topEmojis = MOCK_TOP_EMOJIS,
}: FanReactionTimelineProps) {
  const sentimentPoints = buildSentimentPath(events);
  const finalSentiment = sentimentPoints[sentimentPoints.length - 1]?.sentiment ?? 50;

  // Build SVG path
  const width = 280;
  const height = 120;
  const pathD = sentimentPoints
    .map((p, i) => {
      const x = (p.minute / 90) * width;
      const y = height - (p.sentiment / 100) * height;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-lg">📊</span>
          Fan Emotion Timeline
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {homeTeam} vs {awayTeam}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart */}
        <div className="bg-muted/30 rounded-xl p-3 overflow-hidden">
          <svg viewBox={`-10 -10 ${width + 20} ${height + 30}`} className="w-full h-auto">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={0} y1={height - (v / 100) * height}
                  x2={width} y2={height - (v / 100) * height}
                  stroke="hsl(var(--border))" strokeWidth={0.5} strokeDasharray="4 4"
                />
                <text x={-8} y={height - (v / 100) * height + 3} fontSize={8} fill="hsl(var(--muted-foreground))" textAnchor="end">
                  {v}%
                </text>
              </g>
            ))}

            {/* Sentiment line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Event dots */}
            {sentimentPoints.slice(1).map((p, i) => {
              const x = (p.minute / 90) * width;
              const y = height - (p.sentiment / 100) * height;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4} fill="hsl(var(--primary))" />
                  <text x={x} y={height + 15} fontSize={7} fill="hsl(var(--muted-foreground))" textAnchor="middle">
                    {p.minute}'
                  </text>
                </g>
              );
            })}

            {/* Final sentiment label */}
            <text
              x={width + 5}
              y={height - (finalSentiment / 100) * height + 4}
              fontSize={10}
              fontWeight="bold"
              fill="hsl(var(--primary))"
            >
              {finalSentiment}%
            </text>
          </svg>
        </div>

        {/* Key Moments */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Key Emotional Moments</p>
          {events.map((ev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 text-xs"
            >
              <Badge variant="outline" className="text-[10px] w-10 justify-center shrink-0">
                {ev.minute}'
              </Badge>
              <span className="text-sm">{ev.event}</span>
              <span className="text-muted-foreground flex-1 truncate">"{ev.reaction}"</span>
              <span className={`font-semibold ${ev.sentimentChange > 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                {ev.sentimentChange > 0 ? "+" : ""}{ev.sentimentChange}%
              </span>
            </motion.div>
          ))}
        </div>

        {/* Top Emojis */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-[10px] text-muted-foreground">Most used:</span>
          {topEmojis.map((e) => (
            <span key={e.emoji} className="flex items-center gap-1 text-xs">
              <span className="text-lg">{e.emoji}</span>
              <span className="text-muted-foreground">{formatNumber(e.count)}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
