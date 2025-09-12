import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, icon: Icon, color = "text-primary", trend }: StatCardProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-primary/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              trend === "up" ? "bg-success" : trend === "down" ? "bg-destructive" : "bg-warning"
            }`}></div>
            <span className={`text-xs ${
              trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-warning"
            }`}>
              {trend === "up" ? "Trending up" : trend === "down" ? "Trending down" : "Stable"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}