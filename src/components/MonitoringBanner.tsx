import { AlertCircle, Radio, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function MonitoringBanner() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sentiment data sourced from Twitter, Reddit, and other social platforms. 
            This is a <span className="font-medium text-foreground">monitoring dashboard only</span> - no user interactions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[hsl(var(--success))] animate-pulse" />
              <span className="text-xs text-muted-foreground">Monitoring: 3 platforms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Last updated: {formatTime(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
