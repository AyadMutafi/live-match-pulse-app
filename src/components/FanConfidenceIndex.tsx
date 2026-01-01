import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Brain, CheckCircle, XCircle, Minus, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface ConfidenceMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  fanConfidence: {
    home: number;
    away: number;
  };
  actualResult: "home" | "away" | "draw" | null;
  fanPrediction: "home" | "away" | "draw";
  wasCorrect: boolean | null;
  date: string;
}

interface FanConfidenceIndexProps {
  matches?: ConfidenceMatch[];
}

const mockMatches: ConfidenceMatch[] = [
  {
    id: "1",
    homeTeam: "Liverpool",
    awayTeam: "Manchester City",
    fanConfidence: { home: 72, away: 65 },
    actualResult: "home",
    fanPrediction: "home",
    wasCorrect: true,
    date: "Dec 28"
  },
  {
    id: "2",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    fanConfidence: { home: 68, away: 45 },
    actualResult: "draw",
    fanPrediction: "home",
    wasCorrect: false,
    date: "Dec 27"
  },
  {
    id: "3",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    fanConfidence: { home: 78, away: 82 },
    actualResult: "away",
    fanPrediction: "away",
    wasCorrect: true,
    date: "Dec 26"
  },
  {
    id: "4",
    homeTeam: "Manchester United",
    awayTeam: "Tottenham",
    fanConfidence: { home: 55, away: 60 },
    actualResult: "away",
    fanPrediction: "away",
    wasCorrect: true,
    date: "Dec 25"
  },
  {
    id: "5",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    fanConfidence: { home: 62, away: 58 },
    actualResult: null,
    fanPrediction: "home",
    wasCorrect: null,
    date: "Today"
  }
];

// Calculate overall accuracy
const calculateAccuracy = (matches: ConfidenceMatch[]) => {
  const completedMatches = matches.filter(m => m.wasCorrect !== null);
  const correctPredictions = completedMatches.filter(m => m.wasCorrect === true).length;
  return completedMatches.length > 0 
    ? Math.round((correctPredictions / completedMatches.length) * 100) 
    : 0;
};

// Get confidence insight
const getConfidenceInsight = (homeConf: number, awayConf: number): string => {
  const diff = Math.abs(homeConf - awayConf);
  if (diff > 25) return "Strong conviction - fans very confident";
  if (diff > 15) return "Clear preference detected";
  if (diff > 5) return "Slight edge - could go either way";
  return "Split decision - high uncertainty";
};

const getResultIcon = (wasCorrect: boolean | null) => {
  if (wasCorrect === null) return <Minus className="w-4 h-4 text-muted-foreground" />;
  return wasCorrect 
    ? <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
    : <XCircle className="w-4 h-4 text-destructive" />;
};

export function FanConfidenceIndex({ matches = mockMatches }: FanConfidenceIndexProps) {
  const accuracy = calculateAccuracy(matches);
  const correctCount = matches.filter(m => m.wasCorrect === true).length;
  const totalCompleted = matches.filter(m => m.wasCorrect !== null).length;

  return (
    <div className="space-y-4">
      {/* Accuracy Header */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">Fan Confidence Index</span>
          </div>
          <Badge variant="outline" className="border-primary/50 text-primary">
            AI-Powered
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{accuracy}%</div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[hsl(var(--success))]">{correctCount}</div>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Analyzed</p>
          </div>
        </div>

        <div className="mt-3">
          <Progress value={accuracy} className="h-2 bg-muted" />
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          When fans are highly confident, predictions are {accuracy >= 70 ? 'very' : accuracy >= 50 ? 'moderately' : 'somewhat'} accurate
        </p>
      </Card>

      {/* Match Predictions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recent Predictions</span>
        </div>

        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-3 ${
              match.wasCorrect === null 
                ? 'border-primary/30 bg-primary/5' 
                : match.wasCorrect 
                  ? 'border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5' 
                  : 'border-destructive/20 bg-destructive/5'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getResultIcon(match.wasCorrect)}
                  <span className="text-xs text-muted-foreground">{match.date}</span>
                </div>
                {match.wasCorrect === null && (
                  <Badge variant="outline" className="text-[10px] border-primary/50 text-primary animate-pulse">
                    LIVE
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium flex-1 truncate ${
                  match.fanPrediction === 'home' ? 'text-primary' : ''
                }`}>
                  {match.homeTeam}
                </span>
                <span className="text-xs text-muted-foreground">vs</span>
                <span className={`text-sm font-medium flex-1 truncate text-right ${
                  match.fanPrediction === 'away' ? 'text-primary' : ''
                }`}>
                  {match.awayTeam}
                </span>
              </div>

              {/* Confidence Bars */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-10">Home</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${match.fanConfidence.home}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                  </div>
                  <span className="text-[10px] font-medium w-8 text-right">{match.fanConfidence.home}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-10">Away</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${match.fanConfidence.away}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 + 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] font-medium w-8 text-right">{match.fanConfidence.away}%</span>
                </div>
              </div>

              {/* Insight */}
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                <Target className="w-3 h-3" />
                {getConfidenceInsight(match.fanConfidence.home, match.fanConfidence.away)}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
