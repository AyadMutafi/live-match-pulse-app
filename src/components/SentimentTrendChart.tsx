import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface SentimentTrendChartProps {
  matchMinute?: number;
}

function generateTrendData(minutes: number) {
  const data = [];
  for (let i = 0; i <= minutes; i += 5) {
    const base = Math.random();
    const positive = 30 + Math.random() * 40;
    const neutral = 15 + Math.random() * 25;
    const negative = 100 - positive - neutral;
    data.push({
      minute: `${i}'`,
      positive: Math.round(positive),
      neutral: Math.round(neutral),
      negative: Math.round(Math.max(0, negative)),
    });
  }
  return data;
}

export function SentimentTrendChart({ matchMinute = 45 }: SentimentTrendChartProps) {
  const data = useMemo(() => generateTrendData(matchMinute), [matchMinute]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Live Sentiment Trend</span>
          </div>
          <Badge variant="outline" className="text-xs">Last {matchMinute} min</Badge>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="minute" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.4)" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.4)" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.4)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-success" />
            <span className="text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-warning" />
            <span className="text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-destructive" />
            <span className="text-muted-foreground">Negative</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
