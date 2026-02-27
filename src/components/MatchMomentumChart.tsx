import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface MatchMomentumChartProps {
  homeTeam?: string;
  awayTeam?: string;
  currentMinute?: number;
}

function generateMomentumData(minutes: number) {
  const data = [];
  for (let i = 5; i <= minutes; i += 5) {
    // Positive = home dominance, negative = away dominance
    const value = Math.round((Math.random() - 0.45) * 100);
    data.push({ segment: `${i}'`, value });
  }
  return data;
}

export function MatchMomentumChart({ homeTeam = "Home", awayTeam = "Away", currentMinute = 75 }: MatchMomentumChartProps) {
  const data = useMemo(() => generateMomentumData(currentMinute), [currentMinute]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Match Momentum</span>
          <Badge variant="outline" className="text-xs ml-auto">5-min segments</Badge>
        </div>

        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-medium text-primary">↑ {homeTeam}</span>
          <span className="text-[10px] font-medium text-accent">↓ {awayTeam}</span>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="segment" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} domain={[-60, 60]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [
                  `${Math.abs(value)}% ${value > 0 ? homeTeam : awayTeam} dominance`,
                  "Momentum",
                ]}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.value >= 0 ? "hsl(var(--primary) / 0.7)" : "hsl(var(--accent) / 0.7)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
