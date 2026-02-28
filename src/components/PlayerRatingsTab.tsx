import { motion } from "framer-motion";

const players = [
  { name: "Vinícius Jr", club: "Real Madrid", emoji: "🔥", score: 94, tweets: "5.2K", trend: "↑" },
  { name: "Lamine Yamal", club: "Barcelona", emoji: "😍", score: 89, tweets: "4.8K", trend: "↑" },
  { name: "Salah", club: "Liverpool", emoji: "😍", score: 85, tweets: "3.9K", trend: "↑" },
  { name: "Haaland", club: "Man City", emoji: "🔥", score: 92, tweets: "4.5K", trend: "↑" },
  { name: "Saka", club: "Arsenal", emoji: "🙂", score: 68, tweets: "2.1K", trend: "→" },
  { name: "Mbappé", club: "Real Madrid", emoji: "😐", score: 45, tweets: "6.1K", trend: "↓" },
  { name: "Vlahović", club: "Juventus", emoji: "😤", score: 24, tweets: "1.8K", trend: "↓" },
  { name: "Dembélé", club: "PSG", emoji: "🙂", score: 58, tweets: "2.3K", trend: "→" },
  { name: "Musiala", club: "Bayern", emoji: "😍", score: 87, tweets: "2.7K", trend: "↑" },
  { name: "Griezmann", club: "Atlético", emoji: "🙂", score: 62, tweets: "1.5K", trend: "→" },
];

export function PlayerRatingsTab() {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Player Ratings</p>
        <p className="text-sm text-muted-foreground">How fans feel about top players on 𝕏</p>
      </div>

      <div className="space-y-2">
        {players.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-3"
          >
            <span className="text-muted-foreground text-xs font-mono w-5">{i + 1}</span>
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.club}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{p.score}%</p>
              <p className="text-[10px] text-muted-foreground">{p.tweets} posts {p.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2">
        <span className="font-bold text-xs">𝕏</span>
        <span>Based on fan reactions from X.com</span>
      </div>
    </div>
  );
}
