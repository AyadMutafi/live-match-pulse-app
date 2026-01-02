import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Zap, AlertTriangle, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SentimentPoint {
  minute: number;
  sentiment: number;
  event?: string;
  eventType?: "goal" | "red_card" | "var" | "penalty" | "substitution" | "injury";
}

interface LiveSentimentPulseProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  currentMinute: number;
}

export function LiveSentimentPulse({ matchId, homeTeam, awayTeam, currentMinute }: LiveSentimentPulseProps) {
  const [sentimentData, setSentimentData] = useState<SentimentPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time sentiment data
  useEffect(() => {
    const generateInitialData = () => {
      const data: SentimentPoint[] = [];
      for (let i = 0; i <= Math.min(currentMinute, 90); i++) {
        let sentiment = 50 + Math.sin(i / 10) * 20 + (Math.random() - 0.5) * 15;
        let event: string | undefined;
        let eventType: SentimentPoint["eventType"] | undefined;

        // Simulate events
        if (i === 23) {
          sentiment = 85;
          event = `${homeTeam} GOAL!`;
          eventType = "goal";
        } else if (i === 45) {
          sentiment = 35;
          event = "RED CARD!";
          eventType = "red_card";
        } else if (i === 67) {
          sentiment = 75;
          event = "VAR Review";
          eventType = "var";
        } else if (i === 78) {
          sentiment = 90;
          event = `${awayTeam} GOAL!`;
          eventType = "goal";
        }

        data.push({
          minute: i,
          sentiment: Math.max(0, Math.min(100, sentiment)),
          event,
          eventType,
        });
      }
      return data;
    };

    setSentimentData(generateInitialData());

    // Simulate live updates
    const interval = setInterval(() => {
      if (isLive && currentMinute < 90) {
        setSentimentData(prev => {
          const lastSentiment = prev[prev.length - 1]?.sentiment || 50;
          const newSentiment = Math.max(0, Math.min(100, lastSentiment + (Math.random() - 0.5) * 10));
          return [...prev, { minute: prev.length, sentiment: newSentiment }];
        });
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [matchId, homeTeam, awayTeam, currentMinute, isLive]);

  const currentSentiment = sentimentData[sentimentData.length - 1]?.sentiment || 50;
  const previousSentiment = sentimentData[sentimentData.length - 2]?.sentiment || 50;
  const sentimentTrend = currentSentiment - previousSentiment;

  const peakMoments = useMemo(() => {
    return sentimentData.filter(p => p.event);
  }, [sentimentData]);

  const getSentimentColor = (value: number) => {
    if (value >= 75) return "text-green-500";
    if (value >= 50) return "text-yellow-500";
    if (value >= 25) return "text-orange-500";
    return "text-red-500";
  };

  const getSentimentEmoji = (value: number) => {
    if (value >= 80) return "🔥";
    if (value >= 65) return "😊";
    if (value >= 50) return "😐";
    if (value >= 35) return "😟";
    return "😰";
  };

  const getEventIcon = (type?: SentimentPoint["eventType"]) => {
    switch (type) {
      case "goal": return <Target className="h-4 w-4 text-green-500" />;
      case "red_card": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "var": return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const maxSentiment = Math.max(...sentimentData.map(d => d.sentiment));
  const minSentiment = Math.min(...sentimentData.map(d => d.sentiment));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Sentiment Pulse
          </CardTitle>
          {isLive && (
            <Badge variant="destructive" className="animate-pulse">
              <span className="mr-1 h-2 w-2 rounded-full bg-white inline-block" />
              LIVE
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Minute-by-minute fan reaction tracker
        </p>
      </CardHeader>
      <CardContent>
        {/* Current Sentiment Display */}
        <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Current Fan Mood</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl">{getSentimentEmoji(currentSentiment)}</span>
              <span className={`text-3xl font-bold ${getSentimentColor(currentSentiment)}`}>
                {currentSentiment.toFixed(0)}%
              </span>
              <div className="flex items-center gap-1">
                {sentimentTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : sentimentTrend < 0 ? (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                ) : null}
                <span className={sentimentTrend > 0 ? "text-green-500" : "text-red-500"}>
                  {sentimentTrend > 0 ? "+" : ""}{sentimentTrend.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Match Time</p>
            <p className="text-2xl font-bold">{currentMinute}'</p>
          </div>
        </div>

        {/* Sentiment Timeline Graph */}
        <div className="relative h-32 mb-4">
          <div className="absolute inset-0 flex items-end">
            {sentimentData.slice(-45).map((point, index) => (
              <motion.div
                key={point.minute}
                initial={{ height: 0 }}
                animate={{ height: `${point.sentiment}%` }}
                className={`flex-1 mx-px rounded-t ${
                  point.sentiment >= 75 ? "bg-green-500" :
                  point.sentiment >= 50 ? "bg-yellow-500" :
                  point.sentiment >= 25 ? "bg-orange-500" : "bg-red-500"
                } ${point.event ? "ring-2 ring-white" : ""}`}
                style={{ opacity: 0.3 + (index / 45) * 0.7 }}
              />
            ))}
          </div>
          {/* Event markers */}
          <div className="absolute inset-0 pointer-events-none">
            {peakMoments.slice(-5).map((moment, idx) => (
              <AnimatePresence key={moment.minute}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-0"
                  style={{ left: `${(moment.minute / 90) * 100}%` }}
                >
                  <div className="bg-background border-2 rounded-full p-1 shadow-lg">
                    {getEventIcon(moment.eventType)}
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="text-lg font-bold text-green-500">{maxSentiment.toFixed(0)}%</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-bold">
              {(sentimentData.reduce((a, b) => a + b.sentiment, 0) / sentimentData.length || 0).toFixed(0)}%
            </p>
          </div>
          <div className="p-2 bg-red-500/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="text-lg font-bold text-red-500">{minSentiment.toFixed(0)}%</p>
          </div>
        </div>

        {/* Recent Events */}
        {peakMoments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Peak Moments</p>
            <div className="space-y-2">
              {peakMoments.slice(-3).reverse().map((moment, idx) => (
                <motion.div
                  key={moment.minute}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getEventIcon(moment.eventType)}
                    <span className="font-medium">{moment.event}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{moment.minute}'</span>
                    <Badge variant="outline">
                      {getSentimentEmoji(moment.sentiment)} {moment.sentiment.toFixed(0)}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
