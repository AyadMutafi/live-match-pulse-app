import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, CircleDot, Square, ArrowLeftRight } from "lucide-react";

interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub";
  player: string;
  team: "home" | "away";
  detail?: string;
}

interface MatchTimelineProps {
  events?: MatchEvent[];
  currentMinute?: number;
}

const defaultEvents: MatchEvent[] = [
  { minute: 12, type: "goal", player: "Vinicius Jr", team: "home", detail: "Left foot, bottom corner" },
  { minute: 23, type: "yellow", player: "Gavi", team: "away" },
  { minute: 35, type: "goal", player: "Lewandowski", team: "away", detail: "Header from corner" },
  { minute: 45, type: "sub", player: "Pedri → De Jong", team: "away" },
  { minute: 58, type: "goal", player: "Bellingham", team: "home", detail: "Long range strike" },
  { minute: 67, type: "yellow", player: "Rüdiger", team: "home" },
  { minute: 78, type: "red", player: "Araujo", team: "away" },
];

const eventIcons = {
  goal: <CircleDot className="w-4 h-4" />,
  yellow: <Square className="w-3.5 h-3.5 fill-warning text-warning" />,
  red: <Square className="w-3.5 h-3.5 fill-destructive text-destructive" />,
  sub: <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />,
};

const eventColors = {
  goal: "bg-success/20 border-success/40 text-success",
  yellow: "bg-warning/20 border-warning/40 text-warning",
  red: "bg-destructive/20 border-destructive/40 text-destructive",
  sub: "bg-muted border-border text-muted-foreground",
};

export function MatchTimeline({ events = defaultEvents, currentMinute = 80 }: MatchTimelineProps) {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm">Match Timeline</span>
        <Badge variant="destructive" className="text-xs ml-auto animate-pulse">
          {currentMinute}'
        </Badge>
      </div>

      {/* Timeline bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (currentMinute / 90) * 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {/* Event markers on timeline */}
        {events.map((event, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card cursor-pointer"
            style={{ left: `${(event.minute / 90) * 100}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            title={`${event.minute}' - ${event.player}`}
          >
            <div className={`w-full h-full rounded-full ${
              event.type === "goal" ? "bg-success" :
              event.type === "yellow" ? "bg-warning" :
              event.type === "red" ? "bg-destructive" : "bg-muted-foreground"
            }`} />
          </motion.div>
        ))}
        {/* Half-time marker */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-px h-5 bg-muted-foreground/30" />
      </div>

      {/* Event list */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: event.team === "home" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-2 rounded-lg border ${eventColors[event.type]} ${
              event.team === "away" ? "flex-row-reverse text-right" : ""
            }`}
          >
            <div className="flex items-center gap-1.5 shrink-0">
              {eventIcons[event.type]}
              <span className="text-xs font-bold">{event.minute}'</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{event.player}</p>
              {event.detail && (
                <p className="text-[10px] opacity-70 truncate">{event.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
