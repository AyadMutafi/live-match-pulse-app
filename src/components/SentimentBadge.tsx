import { Badge } from "@/components/ui/badge";
import { getSentimentCategory } from "@/lib/constants";

interface SentimentBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SentimentBadge({ score, showScore = true, size = "md" }: SentimentBadgeProps) {
  const category = getSentimentCategory(score);
  
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5"
  };
  
  return (
    <Badge 
      variant="secondary" 
      className={`${sizeClasses[size]} font-medium`}
      style={{ 
        backgroundColor: `${category.color}20`, 
        color: category.color,
        borderColor: `${category.color}40`
      }}
    >
      <span className="mr-1">{category.emoji}</span>
      {showScore && <span className="mr-1">{score}</span>}
      <span>{category.name}</span>
    </Badge>
  );
}
