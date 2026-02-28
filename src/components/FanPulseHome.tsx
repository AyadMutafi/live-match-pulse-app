import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const SENTIMENT_SCALE = [
  { emoji: "🔥", label: "On Fire", range: [90, 100] },
  { emoji: "😍", label: "Love It", range: [70, 89] },
  { emoji: "🙂", label: "Good", range: [50, 69] },
  { emoji: "😐", label: "Meh", range: [30, 49] },
  { emoji: "😤", label: "Frustrated", range: [10, 29] },
  { emoji: "💩", label: "Awful", range: [0, 9] },
];

function getMood(score: number) {
  return SENTIMENT_SCALE.find(s => score >= s.range[0] && score <= s.range[1]) || SENTIMENT_SCALE[2];
}

// Mock live data
const overallScore = 72;
const mood = getMood(overallScore);

const trending = [
  { topic: "#ElClasico", tweets: "12.4K", sentiment: "😍" },
  { topic: "#HaalandGoal", tweets: "8.1K", sentiment: "🔥" },
  { topic: "#VARControversy", tweets: "6.3K", sentiment: "😤" },
  { topic: "#ChampionsLeague", tweets: "5.8K", sentiment: "🙂" },
  { topic: "#TransferRumors", tweets: "4.2K", sentiment: "😐" },
];

const clubMoods = [
  { name: "Barcelona", emoji: "😍", score: 78, tweets: "3.2K" },
  { name: "Real Madrid", emoji: "🔥", score: 91, tweets: "4.1K" },
  { name: "Atlético", emoji: "🙂", score: 55, tweets: "1.4K" },
  { name: "Juventus", emoji: "😐", score: 42, tweets: "2.0K" },
  { name: "PSG", emoji: "😤", score: 28, tweets: "2.8K" },
  { name: "Liverpool", emoji: "😍", score: 82, tweets: "3.5K" },
  { name: "Arsenal", emoji: "🙂", score: 65, tweets: "2.1K" },
  { name: "Bayern", emoji: "🔥", score: 88, tweets: "2.6K" },
];

export function FanPulseHome() {
  return (
    <div className="space-y-6">
      {/* Hero: Live Fan Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Live Fan Mood</p>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-7xl mb-2"
        >
          {mood.emoji}
        </motion.div>
        <p className="text-lg font-semibold text-foreground">{mood.label}</p>
        <p className="text-xs text-muted-foreground mt-1">Overall sentiment: {overallScore}%</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">24.7K</p>
          <p className="text-[10px] text-muted-foreground">Posts analyzed</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-[hsl(var(--success))]">↑ 12%</p>
          <p className="text-[10px] text-muted-foreground">Sentiment trend</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">8</p>
          <p className="text-[10px] text-muted-foreground">Clubs tracked</p>
        </div>
      </div>

      {/* X.com source badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="font-bold text-sm">𝕏</span>
        <span>Last updated: 2 min ago from X.com</span>
      </div>

      {/* Trending on X */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="font-bold">𝕏</span> Trending on X
        </h2>
        <div className="space-y-2">
          {trending.map((t, i) => (
            <motion.div
              key={t.topic}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between bg-card border border-border rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{t.sentiment}</span>
                <span className="text-sm font-medium text-foreground">{t.topic}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">{t.tweets} posts</Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Club Sentiments Strip */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Club Moods</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {clubMoods.map((club) => (
            <div
              key={club.name}
              className="flex-shrink-0 bg-card border border-border rounded-xl p-3 text-center min-w-[90px]"
            >
              <span className="text-2xl block mb-1">{club.emoji}</span>
              <p className="text-xs font-medium text-foreground truncate">{club.name}</p>
              <p className="text-[10px] text-muted-foreground">{club.tweets}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Scale Legend */}
      <div className="bg-card border border-border rounded-xl p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center">Sentiment Scale</p>
        <div className="flex justify-between">
          {SENTIMENT_SCALE.map((s) => (
            <div key={s.label} className="text-center">
              <span className="text-lg block">{s.emoji}</span>
              <span className="text-[9px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
