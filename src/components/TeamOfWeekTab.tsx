import { motion } from "framer-motion";

const positions = [
  { pos: "GK", name: "Oblak", club: "Atlético", emoji: "😍", score: 88 },
  { pos: "RB", name: "Alexander-Arnold", club: "Liverpool", emoji: "🔥", score: 91 },
  { pos: "CB", name: "Rüdiger", club: "Real Madrid", emoji: "🙂", score: 72 },
  { pos: "CB", name: "Saliba", club: "Arsenal", emoji: "😍", score: 84 },
  { pos: "LB", name: "Balde", club: "Barcelona", emoji: "🙂", score: 68 },
  { pos: "CM", name: "Pedri", club: "Barcelona", emoji: "😍", score: 86 },
  { pos: "CM", name: "Rodri", club: "Man City", emoji: "🔥", score: 93 },
  { pos: "RW", name: "Salah", club: "Liverpool", emoji: "🔥", score: 95 },
  { pos: "AM", name: "Musiala", club: "Bayern", emoji: "😍", score: 87 },
  { pos: "LW", name: "Vinícius Jr", club: "Real Madrid", emoji: "🔥", score: 94 },
  { pos: "ST", name: "Haaland", club: "Man City", emoji: "🔥", score: 92 },
];

export function TeamOfWeekTab() {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">🏆 Team of the Week</p>
        <p className="text-sm text-muted-foreground">Fan-voted XI based on 𝕏 sentiment</p>
      </div>

      {/* Formation visual */}
      <div className="bg-card border border-border rounded-2xl p-4">
        {/* ST */}
        <div className="flex justify-center mb-3">
          <PlayerChip {...positions[10]} />
        </div>
        {/* LW AM RW */}
        <div className="flex justify-around mb-3">
          <PlayerChip {...positions[9]} />
          <PlayerChip {...positions[8]} />
          <PlayerChip {...positions[7]} />
        </div>
        {/* CM CM */}
        <div className="flex justify-center gap-12 mb-3">
          <PlayerChip {...positions[5]} />
          <PlayerChip {...positions[6]} />
        </div>
        {/* LB CB CB RB */}
        <div className="flex justify-around mb-3">
          <PlayerChip {...positions[4]} />
          <PlayerChip {...positions[3]} />
          <PlayerChip {...positions[2]} />
          <PlayerChip {...positions[1]} />
        </div>
        {/* GK */}
        <div className="flex justify-center">
          <PlayerChip {...positions[0]} />
        </div>
      </div>

      {/* Full list */}
      <div className="space-y-1.5">
        {positions.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2"
          >
            <span className="text-[10px] text-muted-foreground font-mono w-6">{p.pos}</span>
            <span className="text-xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-[10px] text-muted-foreground">{p.club}</p>
            </div>
            <span className="text-sm font-bold text-foreground">{p.score}%</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2">
        <span className="font-bold text-xs">𝕏</span>
        <span>Voted by fans on X.com this week</span>
      </div>
    </div>
  );
}

function PlayerChip({ name, emoji, pos }: { name: string; emoji: string; pos: string; club: string; score: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] font-medium text-foreground">{name}</span>
      <span className="text-[8px] text-muted-foreground">{pos}</span>
    </motion.div>
  );
}
