import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, AlertTriangle, Eye, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface PeakMoment {
  id: string;
  type: "goal" | "red_card" | "var" | "penalty" | "save" | "miss";
  minute: number;
  description: string;
  sentimentBefore: number;
  sentimentAfter: number;
  team: "home" | "away";
  player?: string;
  intensity: number;
}

interface PeakMomentDetectorProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

const MOCK_MOMENTS: PeakMoment[] = [
  {
    id: "1",
    type: "goal",
    minute: 23,
    description: "GOAL! Stunning strike from outside the box!",
    sentimentBefore: 45,
    sentimentAfter: 92,
    team: "home",
    player: "M. Salah",
    intensity: 95,
  },
  {
    id: "2",
    type: "var",
    minute: 34,
    description: "VAR Review - Checking for offside",
    sentimentBefore: 85,
    sentimentAfter: 42,
    team: "home",
    intensity: 78,
  },
  {
    id: "3",
    type: "save",
    minute: 41,
    description: "INCREDIBLE SAVE! Goalkeeper denies certain goal",
    sentimentBefore: 30,
    sentimentAfter: 75,
    team: "away",
    player: "A. Becker",
    intensity: 88,
  },
  {
    id: "4",
    type: "red_card",
    minute: 56,
    description: "RED CARD! Straight red for dangerous tackle",
    sentimentBefore: 65,
    sentimentAfter: 25,
    team: "away",
    player: "B. Silva",
    intensity: 92,
  },
  {
    id: "5",
    type: "penalty",
    minute: 72,
    description: "PENALTY! Handball in the box!",
    sentimentBefore: 55,
    sentimentAfter: 85,
    team: "home",
    intensity: 90,
  },
];

export function PeakMomentDetector({ matchId, homeTeam, awayTeam }: PeakMomentDetectorProps) {
  const [moments, setMoments] = useState<PeakMoment[]>(MOCK_MOMENTS);
  const [latestMoment, setLatestMoment] = useState<PeakMoment | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Simulate detecting new peak moments
    const interval = setInterval(() => {
      const newMoments: PeakMoment[] = [
        {
          id: `${Date.now()}`,
          type: "goal",
          minute: Math.floor(Math.random() * 90),
          description: "GOAL! Clinical finish!",
          sentimentBefore: 45,
          sentimentAfter: 90,
          team: Math.random() > 0.5 ? "home" : "away",
          player: "Star Player",
          intensity: 85 + Math.random() * 15,
        },
      ];

      if (Math.random() > 0.7) {
        const newMoment = newMoments[0];
        setLatestMoment(newMoment);
        setShowAlert(true);
        setMoments(prev => [newMoment, ...prev.slice(0, 4)]);
        
        setTimeout(() => setShowAlert(false), 5000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: PeakMoment["type"]) => {
    switch (type) {
      case "goal": return <Target className="h-5 w-5 text-green-500" />;
      case "red_card": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "var": return <Eye className="h-5 w-5 text-yellow-500" />;
      case "penalty": return <Zap className="h-5 w-5 text-orange-500" />;
      case "save": return <Target className="h-5 w-5 text-blue-500" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: PeakMoment["type"]) => {
    switch (type) {
      case "goal": return "bg-green-500/10 border-green-500/30";
      case "red_card": return "bg-red-500/10 border-red-500/30";
      case "var": return "bg-yellow-500/10 border-yellow-500/30";
      case "penalty": return "bg-orange-500/10 border-orange-500/30";
      case "save": return "bg-blue-500/10 border-blue-500/30";
      default: return "bg-muted";
    }
  };

  const getSentimentChange = (before: number, after: number) => {
    const change = after - before;
    return {
      value: change,
      isPositive: change > 0,
      emoji: change > 30 ? "🔥" : change > 0 ? "📈" : change < -30 ? "😰" : "📉",
    };
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Alert Banner for New Peak Moment */}
      <AnimatePresence>
        {showAlert && latestMoment && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute inset-x-0 top-0 z-10 p-4 bg-gradient-to-r from-primary to-primary/80"
          >
            <div className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {getTypeIcon(latestMoment.type)}
                </motion.div>
                <div>
                  <p className="font-bold">PEAK MOMENT DETECTED!</p>
                  <p className="text-sm opacity-90">{latestMoment.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="animate-pulse">
                {latestMoment.minute}'
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className={showAlert ? "mt-20" : ""}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Peak Moment Detector
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {moments.length} detected
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Highlights when fan sentiment spikes dramatically
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {moments.map((moment, index) => {
          const change = getSentimentChange(moment.sentimentBefore, moment.sentimentAfter);
          
          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getTypeColor(moment.type)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getTypeIcon(moment.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize">{moment.type.replace("_", " ")}</span>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {moment.minute}'
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{moment.description}</p>
                    {moment.player && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Player: {moment.player} ({moment.team === "home" ? homeTeam : awayTeam})
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-lg">
                  {change.emoji}
                </Badge>
              </div>

              {/* Sentiment Change Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sentiment Shift</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    change.isPositive ? "text-green-500" : "text-red-500"
                  }`}>
                    {change.isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {change.isPositive ? "+" : ""}{change.value}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-8">{moment.sentimentBefore}%</span>
                  <div className="flex-1 relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: `${moment.sentimentBefore}%` }}
                      animate={{ width: `${moment.sentimentAfter}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`absolute h-full rounded-full ${
                        change.isPositive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <span className="text-xs w-8 text-right">{moment.sentimentAfter}%</span>
                </div>
              </div>

              {/* Intensity Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Fan Reaction Intensity</span>
                  <span className="font-mono">{moment.intensity.toFixed(0)}%</span>
                </div>
                <Progress value={moment.intensity} className="h-1" />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
