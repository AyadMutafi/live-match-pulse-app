import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight, Zap, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface GoalAlert {
  id: string;
  minute: number;
  scorer: string;
  team: string;
  sentimentBefore: number;
  sentimentAfter: number;
  fanReaction: string;
  isRecent: boolean;
}

interface GoalSentimentAlertProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

const MOCK_GOALS: GoalAlert[] = [
  {
    id: "1",
    minute: 23,
    scorer: "M. Salah",
    team: "Liverpool",
    sentimentBefore: 45,
    sentimentAfter: 92,
    fanReaction: "ABSOLUTE SCENES! 🔥🔥🔥",
    isRecent: true,
  },
  {
    id: "2",
    minute: 56,
    scorer: "K. De Bruyne",
    team: "Man City",
    sentimentBefore: 38,
    sentimentAfter: 78,
    fanReaction: "What a strike! Vintage KDB! 💫",
    isRecent: false,
  },
  {
    id: "3",
    minute: 78,
    scorer: "E. Haaland",
    team: "Man City",
    sentimentBefore: 55,
    sentimentAfter: 88,
    fanReaction: "THE ROBOT STRIKES AGAIN! 🤖⚽",
    isRecent: false,
  },
];

export function GoalSentimentAlert({ matchId, homeTeam, awayTeam }: GoalSentimentAlertProps) {
  const [goals, setGoals] = useState<GoalAlert[]>(MOCK_GOALS);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalAlert | null>(null);

  useEffect(() => {
    // Simulate a new goal coming in
    const timeout = setTimeout(() => {
      const goal: GoalAlert = {
        id: `${Date.now()}`,
        minute: 85,
        scorer: "D. Núñez",
        team: homeTeam,
        sentimentBefore: 42,
        sentimentAfter: 95,
        fanReaction: "LATE DRAMA! THE ROOF IS OFF! 🎉",
        isRecent: true,
      };
      setNewGoal(goal);
      setShowNewGoal(true);
      setGoals(prev => [goal, ...prev.map(g => ({ ...g, isRecent: false }))]);
      
      setTimeout(() => setShowNewGoal(false), 8000);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [homeTeam]);

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🔥";
    if (sentiment >= 65) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 35) return "😟";
    return "😰";
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 75) return "text-green-500";
    if (sentiment >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="relative overflow-hidden">
      {/* New Goal Alert Overlay */}
      <AnimatePresence>
        {showNewGoal && newGoal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-20 bg-gradient-to-br from-green-500/95 to-green-600/95 flex items-center justify-center"
          >
            <div className="text-center text-white p-6">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                ⚽
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold mb-2"
              >
                GOAL!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl mb-4"
              >
                {newGoal.scorer} ({newGoal.team})
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 mb-4"
              >
                <div className="text-center">
                  <span className="text-4xl">{getSentimentEmoji(newGoal.sentimentBefore)}</span>
                  <p className="text-sm opacity-75">Before</p>
                </div>
                <ArrowRight className="h-8 w-8" />
                <div className="text-center">
                  <span className="text-4xl">{getSentimentEmoji(newGoal.sentimentAfter)}</span>
                  <p className="text-sm opacity-75">After</p>
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl italic"
              >
                "{newGoal.fanReaction}"
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  +{newGoal.sentimentAfter - newGoal.sentimentBefore}% Fan Excitement
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Goal Alerts with Sentiment
          </CardTitle>
          <Badge variant="outline">
            {goals.length} goals
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          See how fan mood changes after every goal
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => {
          const sentimentChange = goal.sentimentAfter - goal.sentimentBefore;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                goal.isRecent ? "bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20" : "bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{goal.scorer}</span>
                      {goal.isRecent && (
                        <Badge variant="default" className="animate-pulse">NEW</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.team}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono">
                  <Clock className="h-3 w-3 mr-1" />
                  {goal.minute}'
                </Badge>
              </div>

              {/* Sentiment Change Visualization */}
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <span className="text-3xl">{getSentimentEmoji(goal.sentimentBefore)}</span>
                  <p className="text-xs text-muted-foreground mt-1">Before</p>
                  <p className={`font-bold ${getSentimentColor(goal.sentimentBefore)}`}>
                    {goal.sentimentBefore}%
                  </p>
                </div>

                <div className="flex-1 relative">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: `${goal.sentimentBefore}%` }}
                      animate={{ width: `${goal.sentimentAfter}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-3xl">{getSentimentEmoji(goal.sentimentAfter)}</span>
                  <p className="text-xs text-muted-foreground mt-1">After</p>
                  <p className={`font-bold ${getSentimentColor(goal.sentimentAfter)}`}>
                    {goal.sentimentAfter}%
                  </p>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="flex items-center justify-between">
                <p className="text-sm italic text-muted-foreground">
                  "{goal.fanReaction}"
                </p>
                <Badge 
                  variant={sentimentChange > 30 ? "default" : "secondary"}
                  className={sentimentChange > 30 ? "bg-green-500" : ""}
                >
                  +{sentimentChange}% excitement
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
