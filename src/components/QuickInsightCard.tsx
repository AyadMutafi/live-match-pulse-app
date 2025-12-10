import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickInsightCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "highlight" | "muted";
  onClick?: () => void;
}

export function QuickInsightCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendValue,
  variant = "default",
  onClick
}: QuickInsightCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
        variant === "highlight" && "bg-primary/5 border-primary/20",
        variant === "muted" && "bg-muted/50",
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            variant === "highlight" ? "bg-primary/10" : "bg-muted"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              variant === "highlight" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && trendValue && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              trend === "up" && "text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
              trend === "down" && "text-destructive border-destructive/30",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </Badge>
        )}
      </div>
    </Card>
  );
}
