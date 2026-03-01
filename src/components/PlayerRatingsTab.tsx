import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// ── Sentiment scale ───────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────
interface PlayerData {
  id: string;
  name: string;
  team: string;
  position: string;
  score: number;
  tweets: string;
  tweetsCount: number;
  trend: "rising" | "falling" | "stable";
  aiConfidence: number;
  aiSummary: string;
  themes: { icon: string; label: string; count: string }[];
  recentForm: { match: string; emoji: string; score: number }[];
  sampleTweets: { text: string; sentiment: string }[];
}

// ── Sample data ───────────────────────────────────────────────────
const PLAYERS: PlayerData[] = [
  {
    id: "1", name: "Haaland", team: "Man City", position: "ST", score: 94, tweets: "5.2K", tweetsCount: 5200,
    trend: "rising", aiConfidence: 96,
    aiSummary: "Fans are in awe of his goal-scoring record. Called 'unstoppable' and 'machine' across thousands of tweets. Minor criticism about hold-up play but overwhelmingly positive.",
    themes: [
      { icon: "⚽", label: "Clinical finishing", count: "2.8K" },
      { icon: "💪", label: "Physical dominance", count: "1.9K" },
      { icon: "🤖", label: "Goal machine", count: "1.4K" },
    ],
    recentForm: [
      { match: "vs Arsenal", emoji: "🔥", score: 96 },
      { match: "vs Chelsea", emoji: "😍", score: 88 },
      { match: "vs Wolves", emoji: "🔥", score: 92 },
      { match: "vs Spurs", emoji: "😍", score: 85 },
      { match: "vs Villa", emoji: "🔥", score: 94 },
    ],
    sampleTweets: [
      { text: "Haaland is genuinely unstoppable, hat-trick hero again!", sentiment: "🔥" },
      { text: "Best striker in the world and it's not even close", sentiment: "😍" },
      { text: "His hold-up play could be better but who cares when he scores like that", sentiment: "🙂" },
    ],
  },
  {
    id: "2", name: "Vinícius Jr", team: "Real Madrid", position: "LW", score: 94, tweets: "6.1K", tweetsCount: 6100,
    trend: "rising", aiConfidence: 93,
    aiSummary: "Fans praise his dribbling and big-game performances. Ballon d'Or discussions fuelling positive sentiment. Some frustration about diving but overall euphoric.",
    themes: [
      { icon: "✨", label: "Dribbling skills", count: "3.1K" },
      { icon: "🏆", label: "Ballon d'Or talk", count: "2.4K" },
      { icon: "😤", label: "Diving criticism", count: "620" },
    ],
    recentForm: [
      { match: "vs Barça", emoji: "🔥", score: 95 },
      { match: "vs Atlético", emoji: "😍", score: 88 },
      { match: "vs Sevilla", emoji: "🔥", score: 91 },
      { match: "vs Valencia", emoji: "🙂", score: 72 },
      { match: "vs Betis", emoji: "🔥", score: 93 },
    ],
    sampleTweets: [
      { text: "Vinícius is the best player in the world right now, no debate", sentiment: "🔥" },
      { text: "That dribble past 3 defenders was insane, give him the Ballon d'Or", sentiment: "😍" },
      { text: "Wish he'd stop diving, it's the only thing holding him back", sentiment: "😐" },
    ],
  },
  {
    id: "3", name: "Lamine Yamal", team: "Barcelona", position: "RW", score: 91, tweets: "4.8K", tweetsCount: 4800,
    trend: "rising", aiConfidence: 90,
    aiSummary: "Incredible buzz around the teenager. Fans comparing him to Messi and praising his maturity beyond his years. Some caution about burnout.",
    themes: [
      { icon: "⭐", label: "Generational talent", count: "2.6K" },
      { icon: "🐐", label: "Messi comparisons", count: "1.8K" },
      { icon: "😰", label: "Burnout concerns", count: "340" },
    ],
    recentForm: [
      { match: "vs Madrid", emoji: "🔥", score: 93 },
      { match: "vs Atlético", emoji: "😍", score: 87 },
      { match: "vs Villarreal", emoji: "😍", score: 85 },
      { match: "vs Sevilla", emoji: "🔥", score: 90 },
      { match: "vs Betis", emoji: "🙂", score: 78 },
    ],
    sampleTweets: [
      { text: "Yamal at 17 doing things most players dream of. Generational.", sentiment: "🔥" },
      { text: "Don't compare him to Messi yet, but the potential is insane", sentiment: "😍" },
      { text: "Hope they manage his minutes, don't want another burnout story", sentiment: "🙂" },
    ],
  },
  {
    id: "4", name: "Salah", team: "Liverpool", position: "RW", score: 89, tweets: "3.9K", tweetsCount: 3900,
    trend: "rising", aiConfidence: 94,
    aiSummary: "Contract saga driving massive engagement. Fans overwhelmingly want him to stay. Goal-scoring form praised highly. Egyptian King sentiment strong.",
    themes: [
      { icon: "📝", label: "Contract talks", count: "2.1K" },
      { icon: "👑", label: "Egyptian King", count: "1.6K" },
      { icon: "⚽", label: "Goal record", count: "1.2K" },
    ],
    recentForm: [
      { match: "vs United", emoji: "😍", score: 86 },
      { match: "vs City", emoji: "🔥", score: 92 },
      { match: "vs Everton", emoji: "🙂", score: 78 },
      { match: "vs Arsenal", emoji: "😍", score: 88 },
      { match: "vs Spurs", emoji: "🔥", score: 91 },
    ],
    sampleTweets: [
      { text: "Sign the contract Mo, we need you forever!", sentiment: "😍" },
      { text: "Salah's numbers this season are absolutely ridiculous", sentiment: "🔥" },
      { text: "If he leaves it will be the worst decision Liverpool ever make", sentiment: "😤" },
    ],
  },
  {
    id: "5", name: "Musiala", team: "Bayern", position: "AM", score: 87, tweets: "2.7K", tweetsCount: 2700,
    trend: "rising", aiConfidence: 89,
    aiSummary: "German fans absolutely adore him. Called the future of German football. Creative displays winning hearts globally.",
    themes: [
      { icon: "🇩🇪", label: "German football future", count: "1.4K" },
      { icon: "🎨", label: "Creativity praise", count: "1.1K" },
      { icon: "💰", label: "Transfer rumors", count: "520" },
    ],
    recentForm: [
      { match: "vs Dortmund", emoji: "😍", score: 84 },
      { match: "vs Leipzig", emoji: "🔥", score: 91 },
      { match: "vs Leverkusen", emoji: "🙂", score: 78 },
      { match: "vs Stuttgart", emoji: "😍", score: 86 },
      { match: "vs Frankfurt", emoji: "🔥", score: 90 },
    ],
    sampleTweets: [
      { text: "Musiala is the most exciting young player in Europe", sentiment: "🔥" },
      { text: "His dribbling is magical, reminds me of young Iniesta", sentiment: "😍" },
      { text: "Bayern better not sell him, he IS the future", sentiment: "😤" },
    ],
  },
  {
    id: "6", name: "Saka", team: "Arsenal", position: "RW", score: 85, tweets: "2.1K", tweetsCount: 2100,
    trend: "stable", aiConfidence: 91,
    aiSummary: "Consistent praise for work rate and versatility. Arsenal fans see him as their talisman. Slight concerns about fatigue in busy period.",
    themes: [
      { icon: "💪", label: "Work rate", count: "1.2K" },
      { icon: "🌟", label: "Starboy praise", count: "980" },
      { icon: "😰", label: "Fatigue concerns", count: "280" },
    ],
    recentForm: [
      { match: "vs Chelsea", emoji: "😍", score: 87 },
      { match: "vs Spurs", emoji: "🙂", score: 76 },
      { match: "vs City", emoji: "😍", score: 84 },
      { match: "vs Newcastle", emoji: "🔥", score: 90 },
      { match: "vs West Ham", emoji: "🙂", score: 78 },
    ],
    sampleTweets: [
      { text: "Saka never stops running, his work rate is insane", sentiment: "😍" },
      { text: "Our Starboy delivering again, love this kid", sentiment: "😍" },
      { text: "He needs rest, Arteta is running him into the ground", sentiment: "😤" },
    ],
  },
  {
    id: "7", name: "De Bruyne", team: "Man City", position: "CM", score: 82, tweets: "3.1K", tweetsCount: 3100,
    trend: "rising", aiConfidence: 92,
    aiSummary: "Return from injury has excited fans. Assist numbers generating huge buzz. Some worry about fitness longevity.",
    themes: [
      { icon: "🎯", label: "Assist king", count: "1.8K" },
      { icon: "🏥", label: "Injury comeback", count: "980" },
      { icon: "👑", label: "Best midfielder", count: "720" },
    ],
    recentForm: [
      { match: "vs Arsenal", emoji: "🔥", score: 93 },
      { match: "vs Chelsea", emoji: "😍", score: 85 },
      { match: "vs Wolves", emoji: "🙂", score: 72 },
      { match: "vs Spurs", emoji: "😍", score: 80 },
      { match: "vs Villa", emoji: "🙂", score: 68 },
    ],
    sampleTweets: [
      { text: "KDB is back and City look like a different team", sentiment: "🔥" },
      { text: "3 assists in one game, nobody sees passes like him", sentiment: "😍" },
      { text: "Hope he stays fit, City crumble without him", sentiment: "🙂" },
    ],
  },
  {
    id: "8", name: "Pedri", team: "Barcelona", position: "CM", score: 79, tweets: "1.8K", tweetsCount: 1800,
    trend: "stable", aiConfidence: 87,
    aiSummary: "Fans praise his passing range and composure. Injury history makes fans cautious but current form is generating positive buzz.",
    themes: [
      { icon: "🎭", label: "Xavi regen", count: "920" },
      { icon: "🏥", label: "Injury worry", count: "540" },
      { icon: "⚽", label: "Passing range", count: "480" },
    ],
    recentForm: [
      { match: "vs Madrid", emoji: "😍", score: 82 },
      { match: "vs Atlético", emoji: "🙂", score: 75 },
      { match: "vs Villarreal", emoji: "😍", score: 80 },
      { match: "vs Sevilla", emoji: "🙂", score: 72 },
      { match: "vs Betis", emoji: "😐", score: 65 },
    ],
    sampleTweets: [
      { text: "Pedri's vision is otherworldly, the new Xavi", sentiment: "😍" },
      { text: "Please stay healthy, we need you every game", sentiment: "🙂" },
      { text: "He was quiet today, not his best performance", sentiment: "😐" },
    ],
  },
  {
    id: "9", name: "Griezmann", team: "Atlético", position: "ST", score: 62, tweets: "1.5K", tweetsCount: 1500,
    trend: "stable", aiConfidence: 85,
    aiSummary: "Mixed feelings. Fans appreciate his intelligence but question his declining pace. Retirement talk emerging.",
    themes: [
      { icon: "🧠", label: "Football IQ", count: "680" },
      { icon: "⏳", label: "Age concerns", count: "520" },
      { icon: "❤️", label: "Club legend", count: "440" },
    ],
    recentForm: [
      { match: "vs Madrid", emoji: "🙂", score: 65 },
      { match: "vs Barça", emoji: "😐", score: 48 },
      { match: "vs Sevilla", emoji: "🙂", score: 62 },
      { match: "vs Valencia", emoji: "😍", score: 75 },
      { match: "vs Betis", emoji: "😐", score: 55 },
    ],
    sampleTweets: [
      { text: "Griezmann is so smart, always in the right position", sentiment: "🙂" },
      { text: "Father Time is catching up, he's lost a yard of pace", sentiment: "😐" },
      { text: "Legend of the club regardless, thank you Antoine", sentiment: "😍" },
    ],
  },
  {
    id: "10", name: "Mbappé", team: "Real Madrid", position: "ST", score: 45, tweets: "6.1K", tweetsCount: 6100,
    trend: "falling", aiConfidence: 95,
    aiSummary: "High engagement but deeply divided sentiment. Fans frustrated with adaptation struggles at Real Madrid. Big-game pressure mounting.",
    themes: [
      { icon: "😤", label: "Adaptation struggles", count: "3.2K" },
      { icon: "💰", label: "Worth the hype?", count: "2.1K" },
      { icon: "⚡", label: "Pace still elite", count: "980" },
    ],
    recentForm: [
      { match: "vs Barça", emoji: "😐", score: 42 },
      { match: "vs Atlético", emoji: "😤", score: 28 },
      { match: "vs Sevilla", emoji: "🙂", score: 55 },
      { match: "vs Valencia", emoji: "😐", score: 38 },
      { match: "vs Betis", emoji: "🙂", score: 60 },
    ],
    sampleTweets: [
      { text: "Mbappé looks lost at Real Madrid, where's the PSG version?", sentiment: "😤" },
      { text: "Give him time, adapting to a new league isn't easy", sentiment: "🙂" },
      { text: "He's invisible in big games, this is not what we expected", sentiment: "💩" },
    ],
  },
  {
    id: "11", name: "Vlahović", team: "Juventus", position: "ST", score: 24, tweets: "1.8K", tweetsCount: 1800,
    trend: "falling", aiConfidence: 93,
    aiSummary: "Heavy criticism from Juve fans. Missing big chances and lack of movement. Fans calling for a replacement in the transfer window.",
    themes: [
      { icon: "❌", label: "Missed chances", count: "890" },
      { icon: "🔄", label: "Replace him", count: "620" },
      { icon: "😤", label: "No movement", count: "480" },
    ],
    recentForm: [
      { match: "vs Inter", emoji: "😤", score: 22 },
      { match: "vs Milan", emoji: "💩", score: 8 },
      { match: "vs Napoli", emoji: "😐", score: 35 },
      { match: "vs Roma", emoji: "😤", score: 18 },
      { match: "vs Lazio", emoji: "😐", score: 32 },
    ],
    sampleTweets: [
      { text: "Vlahović missed a sitter AGAIN, I can't take this anymore", sentiment: "😤" },
      { text: "We need a real striker, Vlahović is not it", sentiment: "💩" },
      { text: "Maybe if the midfield created more chances he'd score more", sentiment: "😐" },
    ],
  },
  {
    id: "12", name: "Dembélé", team: "PSG", position: "RW", score: 58, tweets: "2.3K", tweetsCount: 2300,
    trend: "stable", aiConfidence: 88,
    aiSummary: "Fans acknowledge his raw talent but frustrated by inconsistency. Dribbling praised but end product questioned.",
    themes: [
      { icon: "⚡", label: "Pace & dribbling", count: "1.2K" },
      { icon: "❌", label: "End product lacking", count: "780" },
      { icon: "🎲", label: "Inconsistency", count: "540" },
    ],
    recentForm: [
      { match: "vs Marseille", emoji: "😤", score: 25 },
      { match: "vs Lyon", emoji: "🙂", score: 65 },
      { match: "vs Monaco", emoji: "😐", score: 48 },
      { match: "vs Lille", emoji: "😍", score: 78 },
      { match: "vs Nice", emoji: "🙂", score: 55 },
    ],
    sampleTweets: [
      { text: "Dembélé can beat anyone 1v1 but then wastes the final ball", sentiment: "😐" },
      { text: "When he's on, he's unplayable. Problem is that's rare", sentiment: "🙂" },
      { text: "Invisible against Marseille, absolutely shocking", sentiment: "😤" },
    ],
  },
];

const TEAMS = ["All", "Man City", "Real Madrid", "Barcelona", "Liverpool", "Arsenal", "Bayern", "Atlético", "PSG", "Juventus"];
const POSITIONS = ["All", "ST", "LW", "RW", "AM", "CM", "CB", "GK"];
const SORT_OPTIONS = [
  { label: "Highest Rated", value: "score" },
  { label: "Most Discussed", value: "tweets" },
  { label: "Trending 📈", value: "trending" },
];

// ── Component ─────────────────────────────────────────────────────
export function PlayerRatingsTab() {
  const [team, setTeam] = useState("All");
  const [position, setPosition] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  let filtered = PLAYERS.filter(p => {
    if (team !== "All" && p.team !== team) return false;
    if (position !== "All" && p.position !== position) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "tweets") return b.tweetsCount - a.tweetsCount;
    // trending: rising first
    const trendOrder = { rising: 0, stable: 1, falling: 2 };
    return trendOrder[a.trend] - trendOrder[b.trend] || b.score - a.score;
  });

  return (
    <div className="space-y-4">
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">⭐ Player Ratings</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
          <span>🤖 Powered by Gemini AI</span>
          <span>•</span>
          <span className="font-bold">𝕏</span>
          <span>data</span>
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Sort */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {SORT_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => setSortBy(s.value)}
              className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                sortBy === s.value
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {/* Team */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {TEAMS.map(t => (
            <button
              key={t}
              onClick={() => setTeam(t)}
              className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                team === t
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Position */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {POSITIONS.map(p => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                position === p
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Player list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No players match this filter</p>
        )}
        {filtered.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            rank={i + 1}
            index={i}
            expanded={expandedId === player.id}
            onToggle={() => setExpandedId(expandedId === player.id ? null : player.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Based on X.com fan reactions</span>
        <span>•</span>
        <span className="text-[hsl(var(--ai-green))]">🤖 Gemini AI</span>
      </div>
    </div>
  );
}

// ── Player Card ───────────────────────────────────────────────────
function PlayerCard({
  player,
  rank,
  index,
  expanded,
  onToggle,
}: {
  player: PlayerData;
  rank: number;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const mood = getMood(player.score);
  const trendIcon = player.trend === "rising" ? "📈" : player.trend === "falling" ? "📉" : "➡️";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-muted-foreground/30"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <span className="text-muted-foreground text-xs font-mono w-5 text-center">{rank}</span>
          <motion.span whileHover={{ scale: 1.15 }} className="text-3xl select-none">
            {mood.emoji}
          </motion.span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">{player.name}</p>
              <Badge variant="outline" className="text-[8px] py-0 px-1.5 border-muted-foreground/20 text-muted-foreground">
                {player.position}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{player.team}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-foreground">{player.score}%</p>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[10px]">{trendIcon}</span>
              <span className="text-[10px] text-muted-foreground">{player.tweets}</span>
            </div>
          </div>
        </div>
        {/* AI badge row */}
        <div className="flex items-center justify-between px-3 pb-2">
          <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] py-0 px-1.5">
            🤖 AI: {player.aiConfidence}%
          </Badge>
          <span className="text-[9px] text-muted-foreground">🤖 Gemini AI Analysis</span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <PlayerDetail player={player} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Player Detail ─────────────────────────────────────────────────
function PlayerDetail({ player }: { player: PlayerData }) {
  const trendLabel = player.trend === "rising" ? "📈 Rising" : player.trend === "falling" ? "📉 Falling" : "➡️ Stable";

  return (
    <div className="bg-card border border-t-0 border-border rounded-b-xl px-3 py-4 space-y-4">
      {/* AI Analysis header */}
      <div className="flex items-center gap-2 bg-[hsl(var(--ai-green))]/10 border border-[hsl(var(--ai-green))]/20 rounded-xl px-3 py-2">
        <span className="text-sm">🤖</span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-foreground">Gemini AI Analysis</p>
          <p className="text-[9px] text-muted-foreground">
            ✅ {player.tweetsCount.toLocaleString()} tweets analyzed • Confidence: {player.aiConfidence}%
          </p>
        </div>
        <span className="text-[10px] font-medium text-foreground">{trendLabel}</span>
      </div>

      {/* AI Summary */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1">AI Summary</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{player.aiSummary}</p>
      </div>

      {/* Themes */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">AI-Extracted Themes</p>
        <div className="space-y-1.5">
          {player.themes.map((theme) => (
            <div key={theme.label} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
              <span className="text-sm">{theme.icon}</span>
              <span className="text-[11px] text-foreground flex-1">{theme.label}</span>
              <span className="text-[10px] text-muted-foreground">{theme.count} tweets</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent form */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Last 5 Matches</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-hide">
          {player.recentForm.map((f) => (
            <div key={f.match} className="flex-shrink-0 bg-muted/40 rounded-lg px-3 py-2 text-center min-w-[80px]">
              <span className="text-xl block">{f.emoji}</span>
              <p className="text-[10px] font-medium text-foreground mt-0.5">{f.score}%</p>
              <p className="text-[9px] text-muted-foreground truncate">{f.match}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample tweets */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <span className="font-bold">𝕏</span> Fan Reactions
        </p>
        <div className="space-y-1.5">
          {player.sampleTweets.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-2 items-start bg-muted/40 rounded-lg px-3 py-2"
            >
              <span className="text-sm mt-0.5">{t.sentiment}</span>
              <p className="text-[11px] text-foreground/80 leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
