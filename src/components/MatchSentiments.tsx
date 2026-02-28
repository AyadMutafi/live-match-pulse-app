import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// ── Sentiment scale ───────────────────────────────────────────────
const SENTIMENT_SCALE = [
  { emoji: "🔥", label: "On Fire", range: [90, 100], hue: 25 },
  { emoji: "😍", label: "Love It", range: [70, 89], hue: 340 },
  { emoji: "🙂", label: "Good", range: [50, 69], hue: 142 },
  { emoji: "😐", label: "Meh", range: [30, 49], hue: 215 },
  { emoji: "😤", label: "Frustrated", range: [10, 29], hue: 25 },
  { emoji: "💩", label: "Awful", range: [0, 9], hue: 0 },
];

function getMood(score: number) {
  return SENTIMENT_SCALE.find(s => score >= s.range[0] && score <= s.range[1]) || SENTIMENT_SCALE[2];
}

function getBorderGradient(score: number) {
  if (score >= 70) return "from-[hsl(var(--success))]/40 to-[hsl(var(--success))]/10";
  if (score >= 50) return "from-[hsl(var(--warning))]/40 to-[hsl(var(--warning))]/10";
  if (score >= 30) return "from-muted-foreground/30 to-muted-foreground/10";
  return "from-[hsl(var(--destructive))]/40 to-[hsl(var(--destructive))]/10";
}

// ── Types ─────────────────────────────────────────────────────────
type MatchStatus = "live" | "today" | "finished";

interface MatchData {
  id: string;
  home: string;
  away: string;
  league: string;
  status: MatchStatus;
  sentimentScore: number;
  tweets: string;
  topReaction: string;
  breakdown: number[]; // [🔥, 😍, 🙂, 😐, 😤, 💩]
  sampleTweets: { text: string; sentiment: string }[];
  trendData: { min: string; score: number }[];
  topWords: string[];
}

// ── Sample data ───────────────────────────────────────────────────
const MATCHES: MatchData[] = [
  {
    id: "1",
    home: "Man United",
    away: "Liverpool",
    league: "Premier League",
    status: "live",
    sentimentScore: 82,
    tweets: "15.2K",
    topReaction: '"What a counter-attack! United are on fire today 🔥🔥"',
    breakdown: [45, 25, 15, 8, 5, 2],
    sampleTweets: [
      { text: "Rashford is absolutely cooking today, incredible performance!", sentiment: "🔥" },
      { text: "This is the best football United have played in months", sentiment: "😍" },
      { text: "Liverpool need to sort out that midfield, getting overrun", sentiment: "😤" },
      { text: "Decent game so far, both teams giving it a go", sentiment: "🙂" },
      { text: "Salah looks frustrated, not getting the service he needs", sentiment: "😐" },
    ],
    trendData: [
      { min: "0'", score: 55 }, { min: "15'", score: 62 }, { min: "30'", score: 78 },
      { min: "45'", score: 85 }, { min: "60'", score: 80 }, { min: "75'", score: 82 },
    ],
    topWords: ["🔥", "amazing", "goal", "counter", "brilliant", "Rashford", "defense", "midfield"],
  },
  {
    id: "2",
    home: "Arsenal",
    away: "Chelsea",
    league: "Premier League",
    status: "live",
    sentimentScore: 76,
    tweets: "22.1K",
    topReaction: '"Saka is pure magic, love watching this kid play 😍"',
    breakdown: [20, 38, 22, 12, 6, 2],
    sampleTweets: [
      { text: "Arsenal completely dominating this derby, beautiful football", sentiment: "😍" },
      { text: "Saka skinning defenders for fun, world class talent", sentiment: "🔥" },
      { text: "Chelsea look clueless in attack, where's the creativity?", sentiment: "😤" },
      { text: "Good match but nothing spectacular so far", sentiment: "🙂" },
      { text: "Palmer needs more of the ball, he's Chelsea's only hope", sentiment: "😐" },
    ],
    trendData: [
      { min: "0'", score: 60 }, { min: "15'", score: 68 }, { min: "30'", score: 72 },
      { min: "45'", score: 74 }, { min: "60'", score: 78 }, { min: "75'", score: 76 },
    ],
    topWords: ["Saka", "derby", "😍", "dominating", "defense", "Palmer", "class", "beautiful"],
  },
  {
    id: "3",
    home: "Real Madrid",
    away: "Barcelona",
    league: "La Liga",
    status: "today",
    sentimentScore: 58,
    tweets: "45.8K",
    topReaction: '"El Clásico hype is real but let\'s see who shows up 🙂"',
    breakdown: [12, 18, 30, 22, 14, 4],
    sampleTweets: [
      { text: "El Clásico tonight! Can't contain my excitement", sentiment: "😍" },
      { text: "Honestly expecting a boring tactical battle today", sentiment: "😐" },
      { text: "Vinícius needs to step up in big games like these", sentiment: "🙂" },
      { text: "Nervous about our defense, Yamal could destroy us", sentiment: "😤" },
      { text: "Both teams have weaknesses, should be an even match", sentiment: "🙂" },
    ],
    trendData: [
      { min: "6h", score: 52 }, { min: "5h", score: 55 }, { min: "4h", score: 58 },
      { min: "3h", score: 56 }, { min: "2h", score: 60 }, { min: "1h", score: 58 },
    ],
    topWords: ["Clásico", "hype", "Vinícius", "Yamal", "nervous", "excited", "🙂", "rivalry"],
  },
  {
    id: "4",
    home: "Bayern Munich",
    away: "Dortmund",
    league: "Bundesliga",
    status: "finished",
    sentimentScore: 42,
    tweets: "8.3K",
    topReaction: '"Meh game overall. Expected more from Der Klassiker 😐"',
    breakdown: [5, 12, 18, 35, 22, 8],
    sampleTweets: [
      { text: "That was the most boring Klassiker I've ever seen", sentiment: "😐" },
      { text: "Bayern completely parking the bus after going ahead", sentiment: "😤" },
      { text: "Musiala was decent but nobody else showed up", sentiment: "🙂" },
      { text: "Dortmund fans deserve better than this performance", sentiment: "💩" },
      { text: "At least the atmosphere was good I guess", sentiment: "😐" },
    ],
    trendData: [
      { min: "0'", score: 65 }, { min: "15'", score: 58 }, { min: "30'", score: 48 },
      { min: "45'", score: 45 }, { min: "60'", score: 40 }, { min: "90'", score: 42 },
    ],
    topWords: ["boring", "😐", "Klassiker", "parking", "Musiala", "disappointed", "meh", "defend"],
  },
  {
    id: "5",
    home: "PSG",
    away: "Marseille",
    league: "Ligue 1",
    status: "finished",
    sentimentScore: 24,
    tweets: "6.7K",
    topReaction: '"Absolutely disgraceful performance from PSG. No passion. 😤"',
    breakdown: [2, 5, 8, 15, 48, 22],
    sampleTweets: [
      { text: "PSG are a disgrace, all that money for nothing", sentiment: "💩" },
      { text: "Dembélé was invisible the whole match, shocking", sentiment: "😤" },
      { text: "At least Marseille showed some fight and heart", sentiment: "🙂" },
      { text: "This team has zero identity, just vibes and prayers", sentiment: "😤" },
      { text: "Worst Le Classique in years, embarrassing", sentiment: "💩" },
    ],
    trendData: [
      { min: "0'", score: 55 }, { min: "15'", score: 42 }, { min: "30'", score: 35 },
      { min: "45'", score: 28 }, { min: "60'", score: 22 }, { min: "90'", score: 24 },
    ],
    topWords: ["disgrace", "😤", "💩", "embarrassing", "Dembélé", "invisible", "no passion", "worst"],
  },
  {
    id: "6",
    home: "Juventus",
    away: "Inter Milan",
    league: "Serie A",
    status: "today",
    sentimentScore: 65,
    tweets: "11.4K",
    topReaction: '"Derby d\'Italia is always special. Forza! 🙂"',
    breakdown: [15, 22, 30, 18, 10, 5],
    sampleTweets: [
      { text: "Can't wait for the Derby d'Italia, biggest match of the season", sentiment: "😍" },
      { text: "Nervous about Lautaro, he always scores against us", sentiment: "😤" },
      { text: "Should be a good tactical battle between two great coaches", sentiment: "🙂" },
      { text: "Vlahović needs to finally prove himself in a big match", sentiment: "😐" },
      { text: "Inter are favourites but Juve have the momentum", sentiment: "🙂" },
    ],
    trendData: [
      { min: "6h", score: 60 }, { min: "5h", score: 62 }, { min: "4h", score: 64 },
      { min: "3h", score: 63 }, { min: "2h", score: 66 }, { min: "1h", score: 65 },
    ],
    topWords: ["Derby", "Italia", "🙂", "Lautaro", "tactics", "Vlahović", "forza", "momentum"],
  },
];

const LEAGUES = ["All", "Premier League", "La Liga", "Bundesliga", "Ligue 1", "Serie A"];
const STATUSES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "🔴 Live", value: "live" },
  { label: "Today", value: "today" },
  { label: "Finished", value: "finished" },
];

// ── Component ─────────────────────────────────────────────────────
export function MatchSentiments() {
  const [league, setLeague] = useState("All");
  const [status, setStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MATCHES.filter(m => {
    if (league !== "All" && m.league !== league) return false;
    if (status !== "all" && m.status !== status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Match Sentiments</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">How fans feel about each match on 𝕏</p>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* League filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {LEAGUES.map(l => (
            <button
              key={l}
              onClick={() => setLeague(l)}
              className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                league === l
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                status === s.value
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Match cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No matches for this filter</p>
        )}
        {filtered.map((match, i) => (
          <MatchCard
            key={match.id}
            match={match}
            index={i}
            expanded={expandedId === match.id}
            onToggle={() => setExpandedId(expandedId === match.id ? null : match.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Sentiment data from X.com</span>
      </div>
    </div>
  );
}

// ── Match Card ────────────────────────────────────────────────────
function MatchCard({
  match,
  index,
  expanded,
  onToggle,
}: {
  match: MatchData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const mood = getMood(match.sentimentScore);
  const gradient = getBorderGradient(match.sentimentScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      {/* Card */}
      <button
        onClick={onToggle}
        className={`w-full text-left bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:border-muted-foreground/30`}
      >
        {/* Gradient accent top */}
        <div className={`h-1 bg-gradient-to-r ${gradient}`} />

        <div className="px-4 py-3">
          {/* Top row: teams + status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {match.home} vs {match.away}
              </p>
              <p className="text-[10px] text-muted-foreground">{match.league}</p>
            </div>
            <StatusBadge status={match.status} />
          </div>

          {/* Hero: emoji + score */}
          <div className="flex items-center gap-4">
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="text-5xl select-none"
            >
              {mood.emoji}
            </motion.span>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">{match.sentimentScore}%</p>
              <p className="text-xs text-muted-foreground">{mood.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">📊 {match.tweets} posts</p>
            </div>
          </div>

          {/* Top reaction */}
          <p className="text-[11px] text-muted-foreground mt-3 italic line-clamp-2">
            {match.topReaction}
          </p>
        </div>
      </button>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ExpandedView match={match} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === "live") {
    return (
      <Badge className="bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/20 text-[10px] gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--destructive))] animate-pulse" />
        LIVE
      </Badge>
    );
  }
  if (status === "today") {
    return (
      <Badge variant="outline" className="text-[10px] text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20">
        Today
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] text-muted-foreground">
      Finished
    </Badge>
  );
}

// ── Expanded View ─────────────────────────────────────────────────
function ExpandedView({ match }: { match: MatchData }) {
  return (
    <div className="bg-card border border-t-0 border-border rounded-b-2xl px-4 py-4 space-y-5">
      {/* Breakdown bars */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Sentiment Breakdown</p>
        <div className="space-y-1.5">
          {SENTIMENT_SCALE.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-sm w-5">{s.emoji}</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${match.breakdown[i]}%` }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      i <= 1 ? "hsl(var(--success))" :
                      i === 2 ? "hsl(var(--warning))" :
                      i === 3 ? "hsl(var(--muted-foreground))" :
                      "hsl(var(--destructive))",
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-8 text-right">{match.breakdown[i]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* What X is saying */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <span className="font-bold">𝕏</span> What X.com is saying
        </p>
        <div className="space-y-2">
          {match.sampleTweets.map((t, i) => (
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

      {/* Sentiment trend chart */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Sentiment Trend</p>
        <div className="h-28 bg-muted/30 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={match.trendData}>
              <defs>
                <linearGradient id={`grad-${match.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="min" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(v: number) => [`${v}%`, "Sentiment"]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#grad-${match.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Word cloud (simple tag style) */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Trending Words & Emojis</p>
        <div className="flex flex-wrap gap-1.5">
          {match.topWords.map((w) => (
            <span
              key={w}
              className="text-[10px] px-2 py-1 bg-muted rounded-full text-muted-foreground"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
