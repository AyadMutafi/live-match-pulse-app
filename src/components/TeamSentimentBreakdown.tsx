import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface TeamSentiment {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface TeamSentimentBreakdownProps {
  teams?: TeamSentiment[];
}

const defaultTeams: TeamSentiment[] = [
  { name: "Real Madrid", positive: 62, neutral: 22, negative: 16 },
  { name: "Barcelona", positive: 55, neutral: 25, negative: 20 },
  { name: "Man City", positive: 58, neutral: 27, negative: 15 },
  { name: "Bayern Munich", positive: 50, neutral: 30, negative: 20 },
];

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  return (
    <motion.div
      className="h-full rounded-sm"
      style={{ backgroundColor: color }}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  );
}

export function TeamSentimentBreakdown({ teams = defaultTeams }: TeamSentimentBreakdownProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm">Sentiment by Club</span>
        <Badge variant="outline" className="text-xs ml-auto">Live</Badge>
      </div>

      <div className="space-y-4">
        {teams.map((team, i) => (
          <div key={team.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{team.name}</span>
              <span className="text-muted-foreground">{team.positive}% positive</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted gap-px">
              <AnimatedBar value={team.positive} color="hsl(var(--success))" delay={i * 0.1} />
              <AnimatedBar value={team.neutral} color="hsl(var(--warning))" delay={i * 0.1 + 0.1} />
              <AnimatedBar value={team.negative} color="hsl(var(--destructive))" delay={i * 0.1 + 0.2} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-sm bg-success" />
          <span className="text-muted-foreground">Positive</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-sm bg-warning" />
          <span className="text-muted-foreground">Neutral</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-sm bg-destructive" />
          <span className="text-muted-foreground">Negative</span>
        </div>
      </div>
    </Card>
  );
}
