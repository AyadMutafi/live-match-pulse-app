import { Badge } from "@/components/ui/badge";

interface SentimentIntensityBadgeProps {
  score: number; // 0-100
}

export function SentimentIntensityBadge({ score }: SentimentIntensityBadgeProps) {
  const getIntensity = (score: number) => {
    if (score >= 80) return { label: "Strong", color: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" };
    if (score >= 50) return { label: "Moderate", color: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" };
    return { label: "Mild", color: "bg-muted text-muted-foreground border-border" };
  };

  const intensity = getIntensity(score);
  
  return (
    <Badge variant="outline" className={`text-xs ${intensity.color}`}>
      {intensity.label}
    </Badge>
  );
}
