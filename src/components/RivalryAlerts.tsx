import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, TrendingDown, TrendingUp, AlertTriangle, PartyPopper, Share2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface RivalryAlert {
  id: string;
  rivalTeam: string;
  yourTeam: string;
  type: "panic" | "celebration" | "meltdown" | "surge";
  intensity: number;
  message: string;
  timestamp: string;
  metrics: {
    sentimentChange: number;
    mentions: number;
    topEmoji: string;
  };
}

const mockAlerts: RivalryAlert[] = [
  {
    id: "1",
    rivalTeam: "Manchester United",
    yourTeam: "Liverpool",
    type: "meltdown",
    intensity: 92,
    message: "United fans in absolute meltdown after conceding 3rd goal! 😱",
    timestamp: "2 min ago",
    metrics: {
      sentimentChange: -45,
      mentions: 12400,
      topEmoji: "😭"
    }
  },
  {
    id: "2",
    rivalTeam: "Tottenham",
    yourTeam: "Arsenal",
    type: "panic",
    intensity: 78,
    message: "Spurs supporters panicking as Arsenal extend their lead in the table",
    timestamp: "15 min ago",
    metrics: {
      sentimentChange: -28,
      mentions: 8900,
      topEmoji: "😰"
    }
  },
  {
    id: "3",
    rivalTeam: "Barcelona",
    yourTeam: "Real Madrid",
    type: "celebration",
    intensity: 85,
    message: "Madridistas celebrating as Barça drop points again!",
    timestamp: "1 hour ago",
    metrics: {
      sentimentChange: 35,
      mentions: 15600,
      topEmoji: "🎉"
    }
  },
  {
    id: "4",
    rivalTeam: "Chelsea",
    yourTeam: "Arsenal",
    type: "surge",
    intensity: 65,
    message: "Chelsea confidence surging after winning streak",
    timestamp: "3 hours ago",
    metrics: {
      sentimentChange: 22,
      mentions: 6200,
      topEmoji: "💪"
    }
  }
];

const getAlertIcon = (type: RivalryAlert["type"]) => {
  switch (type) {
    case "meltdown":
      return <Flame className="w-5 h-5 text-destructive" />;
    case "panic":
      return <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))]" />;
    case "celebration":
      return <PartyPopper className="w-5 h-5 text-[hsl(var(--success))]" />;
    case "surge":
      return <TrendingUp className="w-5 h-5 text-primary" />;
  }
};

const getAlertBadge = (type: RivalryAlert["type"]) => {
  switch (type) {
    case "meltdown":
      return { text: "MELTDOWN", className: "bg-destructive/20 text-destructive border-destructive/30" };
    case "panic":
      return { text: "PANIC MODE", className: "bg-warning/20 text-[hsl(var(--warning))] border-warning/30" };
    case "celebration":
      return { text: "CELEBRATING", className: "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30" };
    case "surge":
      return { text: "CONFIDENCE UP", className: "bg-primary/20 text-primary border-primary/30" };
  }
};

const getIntensityColor = (intensity: number) => {
  if (intensity >= 80) return "text-destructive";
  if (intensity >= 60) return "text-[hsl(var(--warning))]";
  return "text-muted-foreground";
};

export function RivalryAlerts() {
  const [alerts] = useState<RivalryAlert[]>(mockAlerts);

  const handleShare = (alert: RivalryAlert) => {
    const text = `🚨 ${alert.rivalTeam} fans ${alert.type === 'meltdown' ? 'melting down' : alert.type === 'panic' ? 'panicking' : 'reacting'}! ${alert.metrics.topEmoji}\n\n${alert.message}\n\n#FanPulse #${alert.rivalTeam.replace(/\s/g, '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Rivalry Alert",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent animate-pulse" />
          <span className="font-semibold text-sm">Live Rivalry Pulse</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Bell className="w-4 h-4 mr-1" />
          <span className="text-xs">Set Alerts</span>
        </Button>
      </div>

      {/* Alerts List */}
      <AnimatePresence>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const badge = getAlertBadge(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 border-l-4 ${
                  alert.type === 'meltdown' ? 'border-l-destructive bg-destructive/5' :
                  alert.type === 'panic' ? 'border-l-warning bg-warning/5' :
                  alert.type === 'celebration' ? 'border-l-[hsl(var(--success))] bg-[hsl(var(--success))]/5' :
                  'border-l-primary bg-primary/5'
                }`}>
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className={`text-[10px] ${badge.className}`}>
                          {badge.text}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-semibold text-sm">{alert.rivalTeam}</span>
                        <span className="text-xs text-muted-foreground">fans</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          {alert.metrics.sentimentChange < 0 ? (
                            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                          ) : (
                            <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--success))]" />
                          )}
                          <span className={`text-xs font-medium ${
                            alert.metrics.sentimentChange < 0 ? 'text-destructive' : 'text-[hsl(var(--success))]'
                          }`}>
                            {alert.metrics.sentimentChange > 0 ? '+' : ''}{alert.metrics.sentimentChange}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alert.metrics.mentions.toLocaleString()} mentions
                        </div>
                        <div className="text-lg">{alert.metrics.topEmoji}</div>
                      </div>
                    </div>

                    {/* Intensity & Share */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getIntensityColor(alert.intensity)}`}>
                          {alert.intensity}
                        </span>
                        <p className="text-[10px] text-muted-foreground">intensity</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2"
                        onClick={() => handleShare(alert)}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
