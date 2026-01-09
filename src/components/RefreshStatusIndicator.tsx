import { Badge } from "@/components/ui/badge";
import { RefreshCw, Zap, Clock, Timer } from "lucide-react";
import { motion } from "framer-motion";

interface RefreshStatusIndicatorProps {
  interval: number;
  reason: string;
  isBoost: boolean;
  lastRefresh: Date;
  liveMatchCount: number;
}

export function RefreshStatusIndicator({
  interval,
  reason,
  isBoost,
  lastRefresh,
  liveMatchCount,
}: RefreshStatusIndicatorProps) {
  const formatInterval = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <motion.div
        animate={isBoost ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Badge 
          variant={isBoost ? "destructive" : liveMatchCount > 0 ? "default" : "secondary"}
          className="flex items-center gap-1 px-2 py-1"
        >
          {isBoost ? (
            <Zap className="w-3 h-3" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span>{formatInterval(interval)}</span>
        </Badge>
      </motion.div>
      
      <span className="text-muted-foreground hidden sm:inline">
        {reason}
      </span>
      
      <div className="flex items-center gap-1 text-muted-foreground ml-auto">
        <Clock className="w-3 h-3" />
        <span>
          {lastRefresh.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
