import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Clock, Zap } from "lucide-react";

interface LiveRefreshIndicatorProps {
  lastRefresh: Date;
  refreshInterval: number; // in seconds
  isRefreshing?: boolean;
  mode?: "normal" | "high-activity";
}

export function LiveRefreshIndicator({ 
  lastRefresh, 
  refreshInterval, 
  isRefreshing = false,
  mode = "normal"
}: LiveRefreshIndicatorProps) {
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);
  const [secondsUntilNext, setSecondsUntilNext] = useState(refreshInterval);
  
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
      setSecondsSinceRefresh(diffSeconds);
      setSecondsUntilNext(Math.max(0, refreshInterval - diffSeconds));
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [lastRefresh, refreshInterval]);
  
  return (
    <div className="flex items-center gap-3 text-xs">
      {/* Refresh Status Indicator */}
      <div className="flex items-center gap-1.5">
        {isRefreshing ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <RefreshCw className="w-3 h-3 text-primary animate-spin" />
            <span className="text-primary font-medium">Refreshing...</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--success))]"></span>
            </span>
            <span className="text-muted-foreground">Live</span>
          </>
        )}
      </div>
      
      {/* Last Updated */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Updated: {secondsSinceRefresh}s ago</span>
      </div>
      
      {/* Next Refresh */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <RefreshCw className="w-3 h-3" />
        <span>Next: {secondsUntilNext}s</span>
      </div>
      
      {/* Mode Indicator */}
      <Badge 
        variant="outline" 
        className={`text-[10px] ${mode === "high-activity" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted"}`}
      >
        <Zap className={`w-2.5 h-2.5 mr-1 ${mode === "high-activity" ? "animate-pulse" : ""}`} />
        {mode === "high-activity" ? `High activity (${refreshInterval}s)` : `Normal (${refreshInterval}s)`}
      </Badge>
    </div>
  );
}
