import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface StatRow {
  label: string;
  home: number;
  away: number;
  isPercentage?: boolean;
}

interface LiveMatchStatsProps {
  homeTeam?: string;
  awayTeam?: string;
  stats?: StatRow[];
}

const defaultStats: StatRow[] = [
  { label: "Possession", home: 58, away: 42, isPercentage: true },
  { label: "Shots", home: 14, away: 9 },
  { label: "Shots on Target", home: 6, away: 4 },
  { label: "Corners", home: 7, away: 3 },
  { label: "Fouls", home: 11, away: 14 },
  { label: "Pass Accuracy", home: 87, away: 82, isPercentage: true },
];

function StatBar({ label, home, away, isPercentage, index }: StatRow & { index: number }) {
  const total = isPercentage ? 100 : home + away;
  const homeWidth = total > 0 ? (home / total) * 100 : 50;
  const awayWidth = 100 - homeWidth;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium tabular-nums w-10 text-right">
          {home}{isPercentage ? "%" : ""}
        </span>
        <span className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</span>
        <span className="font-medium tabular-nums w-10">
          {away}{isPercentage ? "%" : ""}
        </span>
      </div>
      <div className="flex h-2 gap-0.5">
        <div className="flex-1 flex justify-end bg-muted rounded-l-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${homeWidth}%` }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
          />
        </div>
        <div className="flex-1 bg-muted rounded-r-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${awayWidth}%` }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export function LiveMatchStats({ homeTeam = "Home", awayTeam = "Away", stats = defaultStats }: LiveMatchStatsProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm">Match Statistics</span>
        <Badge variant="outline" className="text-xs ml-auto">Live</Badge>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-bold text-primary">{homeTeam}</span>
        <span className="text-xs font-bold text-accent">{awayTeam}</span>
      </div>

      <div className="space-y-3">
        {stats.map((stat, i) => (
          <StatBar key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </Card>
  );
}
