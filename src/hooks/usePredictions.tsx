import { useState, useEffect, useCallback } from "react";

const PREDICTIONS_KEY = "fanpulse_predictions";
const STATS_KEY = "fanpulse_prediction_stats";

export interface Prediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predictedEmoji: string;
  predictedTeam: string;
  timestamp: number;
  resolved: boolean;
  actualEmoji?: string;
  correct?: boolean;
}

export interface PredictionStats {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

const MOOD_EMOJIS = [
  { emoji: "🔥", label: "Ecstatic", minScore: 80 },
  { emoji: "😍", label: "Happy", minScore: 65 },
  { emoji: "🙂", label: "Neutral", minScore: 45 },
  { emoji: "😤", label: "Frustrated", minScore: 25 },
  { emoji: "💩", label: "Furious", minScore: 0 },
];

export function getEmojiForScore(score: number): string {
  for (const m of MOOD_EMOJIS) {
    if (score >= m.minScore) return m.emoji;
  }
  return "🙂";
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<PredictionStats>({ total: 0, correct: 0, streak: 0, bestStreak: 0 });

  useEffect(() => {
    const saved = localStorage.getItem(PREDICTIONS_KEY);
    if (saved) setPredictions(JSON.parse(saved));
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const savePredictions = useCallback((preds: Prediction[]) => {
    setPredictions(preds);
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(preds));
  }, []);

  const saveStats = useCallback((s: PredictionStats) => {
    setStats(s);
    localStorage.setItem(STATS_KEY, JSON.stringify(s));
  }, []);

  const makePrediction = useCallback((prediction: Omit<Prediction, "timestamp" | "resolved">) => {
    const newPred: Prediction = {
      ...prediction,
      timestamp: Date.now(),
      resolved: false,
    };
    const updated = [newPred, ...predictions.filter(p => !(p.matchId === prediction.matchId && p.predictedTeam === prediction.predictedTeam))];
    savePredictions(updated);
    saveStats({ ...stats, total: stats.total + 1 });
  }, [predictions, stats, savePredictions, saveStats]);

  const resolvePrediction = useCallback((matchId: string, team: string, actualScore: number) => {
    const actualEmoji = getEmojiForScore(actualScore);
    const updated = predictions.map(p => {
      if (p.matchId === matchId && p.predictedTeam === team && !p.resolved) {
        const isCorrect = p.predictedEmoji === actualEmoji;
        return { ...p, resolved: true, actualEmoji, correct: isCorrect };
      }
      return p;
    });
    savePredictions(updated);

    const pred = predictions.find(p => p.matchId === matchId && p.predictedTeam === team);
    if (pred && !pred.resolved) {
      const isCorrect = pred.predictedEmoji === actualEmoji;
      const newStreak = isCorrect ? stats.streak + 1 : 0;
      saveStats({
        ...stats,
        correct: isCorrect ? stats.correct + 1 : stats.correct,
        streak: newStreak,
        bestStreak: Math.max(stats.bestStreak, newStreak),
      });
    }
  }, [predictions, stats, savePredictions, saveStats]);

  const hasPredicted = useCallback((matchId: string, team: string) => {
    return predictions.some(p => p.matchId === matchId && p.predictedTeam === team);
  }, [predictions]);

  return {
    predictions,
    stats,
    makePrediction,
    resolvePrediction,
    hasPredicted,
    MOOD_EMOJIS,
  };
}
