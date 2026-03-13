import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePredictions } from "@/hooks/usePredictions";
import { Target, Zap, Trophy } from "lucide-react";
import { getTeamLogo } from "@/lib/teamLogos";

interface FanPredictionProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

export function FanPrediction({ matchId, homeTeam, awayTeam, matchDate }: FanPredictionProps) {
  const { makePrediction, hasPredicted, stats, MOOD_EMOJIS } = usePredictions();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [justPredicted, setJustPredicted] = useState(false);

  const homeAlreadyPredicted = hasPredicted(matchId, homeTeam);
  const awayAlreadyPredicted = hasPredicted(matchId, awayTeam);
  const allPredicted = homeAlreadyPredicted && awayAlreadyPredicted;

  const handleSelectEmoji = (emoji: string) => {
    if (!selectedTeam) return;
    makePrediction({
      matchId,
      homeTeam,
      awayTeam,
      predictedEmoji: emoji,
      predictedTeam: selectedTeam,
    });
    setJustPredicted(true);
    setTimeout(() => {
      setJustPredicted(false);
      setSelectedTeam(null);
    }, 1500);
  };

  if (allPredicted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Predictions locked in! ✅</p>
            <p className="text-xs text-muted-foreground">
              {homeTeam} vs {awayTeam} · Results after the match
            </p>
          </div>
          {stats.streak > 0 && (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Zap className="w-3 h-3" /> {stats.streak} streak
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Predict Fan Mood
          {stats.total > 0 && (
            <Badge variant="outline" className="text-[9px] ml-auto gap-1">
              <Trophy className="w-3 h-3" />
              {stats.correct}/{stats.total} correct
            </Badge>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          How will fans feel after {homeTeam} vs {awayTeam}?
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {/* Team selector */}
        <div className="flex gap-2">
          {[{ name: homeTeam, predicted: homeAlreadyPredicted }, { name: awayTeam, predicted: awayAlreadyPredicted }].map(({ name, predicted }) => (
            <Button
              key={name}
              variant={selectedTeam === name ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs gap-2"
              onClick={() => !predicted && setSelectedTeam(name)}
              disabled={predicted}
            >
              <img src={getTeamLogo(name)} alt={name} className="w-4 h-4 object-contain" />
              {name} {predicted ? "✅" : "fans"}
            </Button>
          ))}
        </div>

        {/* Emoji picker */}
        <AnimatePresence>
          {selectedTeam && !justPredicted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-muted-foreground mb-2">
                Pick {selectedTeam} fans' post-match mood:
              </p>
              <div className="flex justify-between gap-1">
                {MOOD_EMOJIS.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => handleSelectEmoji(mood.emoji)}
                    className="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[9px] text-muted-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {justPredicted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-3"
            >
              <span className="text-3xl">🎯</span>
              <p className="text-sm font-medium text-foreground mt-1">Locked in!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
