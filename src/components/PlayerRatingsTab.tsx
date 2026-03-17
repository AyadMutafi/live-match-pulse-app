import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Clock } from "lucide-react";

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

function timeAgo(isoString?: string): string {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
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

// ── Players to analyze ───────────────────────────────────────────
const PLAYER_INPUTS = [
  { name: "Haaland", team: "Man City", position: "ST" },
  { name: "Vinícius Jr", team: "Real Madrid", position: "LW" },
  { name: "Lamine Yamal", team: "Barcelona", position: "RW" },
  { name: "Salah", team: "Liverpool", position: "RW" },
  { name: "Musiala", team: "Bayern", position: "AM" },
  { name: "Saka", team: "Arsenal", position: "RW" },
  { name: "De Bruyne", team: "Man City", position: "CM" },
  { name: "Pedri", team: "Barcelona", position: "CM" },
  { name: "Mbappé", team: "Real Madrid", position: "ST" },
  { name: "Palmer", team: "Chelsea", position: "AM" },
  { name: "Bellingham", team: "Real Madrid", position: "AM" },
  { name: "Wirtz", team: "Leverkusen", position: "AM" },
];

// ── Loading steps ─────────────────────────────────────────────────
const LOADING_STEPS = [
  { icon: "🔍", text: "Firecrawl searching X.com for fan reactions..." },
  { icon: "📊", text: "Extracting post text & engagement metrics..." },
  { icon: "🤖", text: "Gemini AI analyzing fan sentiment..." },
  { icon: "⭐", text: "Calculating player ratings & saving to DB..." },
];

// ── Data hook (Firecrawl + Gemini pipeline) ───────────────────────
function usePlayerSentiments() {
  return useQuery({
    queryKey: ["player-sentiments-live"],
    queryFn: async (): Promise<{ players: PlayerData[]; analyzedAt: string }> => {
      const { data, error } = await supabase.functions.invoke("firecrawl-player-sentiment", {
        body: { players: PLAYER_INPUTS },
      });

      if (error) throw error;

      const players: PlayerData[] = (data.players || []).map((p: any, i: number) => ({
        id: `player-${i}`,
        name: p.name || PLAYER_INPUTS[i]?.name || "Unknown",
        team: p.team || PLAYER_INPUTS[i]?.team || "Unknown",
        position: p.position || PLAYER_INPUTS[i]?.position || "FW",
        score: Math.min(100, Math.max(0, p.score || 50)),
        tweets: p.tweetsCount ? (p.tweetsCount >= 1000 ? `${(p.tweetsCount / 1000).toFixed(1)}K` : `${p.tweetsCount}`) : "N/A",
        tweetsCount: p.tweetsCount || 0,
        trend: p.trend || "stable",
        aiConfidence: p.aiConfidence || 75,
        aiSummary: p.aiSummary || "Analysis pending...",
        themes: (p.themes || []).slice(0, 3).map((t: any) => ({
          icon: t.icon || "📊",
          label: t.label || "Discussion",
          count: t.count || "N/A",
        })),
        recentForm: (p.recentForm || []).slice(0, 5).map((f: any) => ({
          match: f.match || "Unknown",
          emoji: f.emoji || "🙂",
          score: f.score || 50,
        })),
        sampleTweets: (p.sampleTweets || []).slice(0, 3).map((t: any) => ({
          text: t.text || "",
          sentiment: t.sentiment || "😐",
        })),
      }));

      return {
        players,
        analyzedAt: data.analyzedAt || new Date().toISOString(),
      };
    },
    staleTime: 10 * 60 * 1000,
  });
}

const TEAMS = ["All", "Man City", "Real Madrid", "Barcelona", "Liverpool", "Arsenal", "Bayern", "Chelsea", "Leverkusen"];
const POSITIONS = ["All", "ST", "LW", "RW", "AM", "CM"];
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
  const [loadingStep, setLoadingStep] = useState(0);

  const { data, isLoading, isFetching, error } = usePlayerSentiments();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["player-sentiments-live"] });
  };

  const players = data?.players || [];

  let filtered = players.filter(p => {
    if (team !== "All" && p.team !== team) return false;
    if (position !== "All" && p.position !== position) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "tweets") return b.tweetsCount - a.tweetsCount;
    const trendOrder = { rising: 0, stable: 1, falling: 2 };
    return trendOrder[a.trend] - trendOrder[b.trend] || b.score - a.score;
  });

  return (
    <div className="space-y-4">
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">⭐ Player Ratings</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
          <span>🔥 Powered by Firecrawl + Gemini AI</span>
          <span>•</span>
          <span className="font-bold">𝕏</span>
          <span>live fan data</span>
        </p>
      </div>

      {/* Refresh + Timestamp */}
      <div className="flex items-center justify-between">
        {data?.analyzedAt && !isLoading ? (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            Updated {timeAgo(data.analyzedAt)}
          </div>
        ) : <div />}
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Updating..." : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
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

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="text-center">
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-foreground font-medium"
              >
                {LOADING_STEPS[loadingStep].icon} {LOADING_STEPS[loadingStep].text}
              </motion.p>
              <p className="text-[10px] text-muted-foreground mt-1">Analyzing {PLAYER_INPUTS.length} players with Gemini AI</p>
            </div>
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load player ratings</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(error as any)?.message?.includes("429") ? "Rate limit exceeded. Please try again in a moment." : "Please try again later"}
          </p>
          <button onClick={handleRefresh} className="mt-3 text-xs text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Player list */}
      {!isLoading && !error && (
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
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Firecrawl live data</span>
        <span>•</span>
        <span className="text-[hsl(var(--ai-green))]">🤖 Gemini AI sentiment</span>
        <span>•</span>
        <span>Saved to Supabase</span>
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
        <div className="flex items-center justify-between px-3 pb-2">
          <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] py-0 px-1.5">
            🤖 AI: {player.aiConfidence}%
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[7px] py-0 px-1 border-primary/20 text-primary">
              LIVE DATA
            </Badge>
            <span className="text-[9px] text-muted-foreground">🤖 Gemini AI</span>
          </div>
        </div>
      </button>

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
          <p className="text-[11px] font-semibold text-foreground">Gemini AI Web Search Analysis</p>
          <p className="text-[9px] text-muted-foreground">
            ✅ {player.tweetsCount.toLocaleString()} posts analyzed • Confidence: {player.aiConfidence}%
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
      {player.themes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">AI-Extracted Themes</p>
          <div className="space-y-1.5">
            {player.themes.map((theme) => (
              <div key={theme.label} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
                <span className="text-sm">{theme.icon}</span>
                <span className="text-[11px] text-foreground flex-1">{theme.label}</span>
                <span className="text-[10px] text-muted-foreground">{theme.count} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent form */}
      {player.recentForm.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Recent Form</p>
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
      )}

      {/* Sample tweets */}
      {player.sampleTweets.length > 0 && (
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
      )}

      {/* Data source */}
      <div className="flex items-center gap-1 text-[8px] text-muted-foreground/70">
        <span>🌐</span>
        <span>Data sourced from live Gemini web search</span>
      </div>
    </div>
  );
}
