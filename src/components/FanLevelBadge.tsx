import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getFanBadge } from "@/hooks/useFanProfile";

interface FanLevelBadgeProps {
  level: number;
  showIcon?: boolean;
  showLevel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function FanLevelBadge({ 
  level, 
  showIcon = true, 
  showLevel = true,
  size = "md" 
}: FanLevelBadgeProps) {
  const badge = getFanBadge(level);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const iconSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            className={`${badge.color} ${sizeClasses[size]} gap-1.5`}
            variant="secondary"
          >
            {showIcon && <span className={iconSizes[size]}>{badge.icon}</span>}
            {showLevel && <span>Lv {level}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{badge.name}</p>
          <p className="text-xs text-muted-foreground">
            Level {level} • {badge.icon}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
