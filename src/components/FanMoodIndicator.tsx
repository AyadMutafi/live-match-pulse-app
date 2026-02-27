import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface FanMoodIndicatorProps {
  positive?: number;
  neutral?: number;
  negative?: number;
}

const moods = [
  { emoji: "🎉", label: "Excited", color: "hsl(var(--success))", min: 60 },
  { emoji: "😊", label: "Happy", color: "hsl(var(--success))", min: 45 },
  { emoji: "😐", label: "Neutral", color: "hsl(var(--warning))", min: 30 },
  { emoji: "😰", label: "Anxious", color: "hsl(var(--warning))", min: 15 },
  { emoji: "😡", label: "Frustrated", color: "hsl(var(--destructive))", min: 0 },
];

export function FanMoodIndicator({ positive = 50, neutral = 30, negative = 20 }: FanMoodIndicatorProps) {
  const mood = useMemo(() => {
    const score = positive - negative;
    return moods.find((m) => score >= m.min) || moods[moods.length - 1];
  }, [positive, negative]);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="text-center">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fan Mood</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={mood.label}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="my-2"
          >
            <span className="text-5xl">{mood.emoji}</span>
          </motion.div>
        </AnimatePresence>
        <motion.p
          key={mood.label + "-text"}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold text-sm"
          style={{ color: mood.color }}
        >
          {mood.label}
        </motion.p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Based on {positive + neutral + negative}% of fan reactions
        </p>
      </div>
    </Card>
  );
}
