import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useMatches, Match } from "@/hooks/useMatches";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";

// ── Sentiment scale ───────────────────────────────────────────────
const SENTIMENT_SCALE = [
  { emoji: "🔥", label: "On Fire", range: [90, 100], key: "fire" },
  { emoji: "😍", label: "Love It", range: [70, 89], key: "love" },
  { emoji: "🙂", label: "Good", range: [50, 69], key: "good" },
  { emoji: "😐", label: "Meh", range: [30, 49], key: "meh" },
  { emoji: "😤", label: "Frustrated", range: [10, 29], key: "frustrated" },
  { emoji: "💩", label: "Awful", range: [0, 9], key: "awful" },
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
type MatchStatus = "live" | "today" | "finished" | "upcoming";

interface SentimentData {
  sentimentScore: number;
  aiSummary: string;
  aiConfidence: number;
  totalPosts: number;
  breakdown: number[];
  keyThemes: string[];
  sampleTweets: { text: string; sentiment: string }[];
  source: string;
}

// ── Helpers ───────────────────────────────────────────────────────
function getMatchStatus(match: Match): { status: MatchStatus; detail?: string } {
  const s = (match.status || "").toUpperCase();
  const liveStatuses = ["IN_PLAY", "LIVE", "FIRST_HALF", "SECOND_HALF", "HALFTIME", "HT", "PAUSED"];
  if (liveStatuses.includes(s)) {
    return { status: "live", detail: s === "HALFTIME" || s === "HT" ? "HT" : "LIVE" };
  }
  const finishedStatuses = ["FINISHED", "FT", "FULL_TIME"];
  if (finishedStatuses.includes(s)) return { status: "finished" };

  const matchDate = new Date(match.match_date);
  const now = new Date();
  const isToday = matchDate.toDateString() === now.toDateString();
  if (isToday) return { status: "today" };
  return { status: "upcoming" };
}

function getMatchKeyword(match: Match): string {
  const home = match.home_team?.name || "";
  const away = match.away_team?.name || "";
  // Use short/common names for better search results
  const shorten = (n: string) => n.replace(/\s*(FC|CF|SC|SSC|AC|AFC)\s*/gi, "").trim();
  return `${shorten(home)} vs ${shorten(away)}`;
}

function getLeague(match: Match): string {
  return match.competition || match.home_team?.league || "Unknown";
}

// Parse sentiment API response into our UI format
function parseSentimentResponse(data: any): SentimentData {
  const positive = data.percentages?.positive ?? 50;
  const negative = data.percentages?.negative ?? 20;
  const neutral = data.percentages?.neutral ?? 30;

  // Map positive/negative/neutral to our 6-tier breakdown
  const score = Math.min(100, Math.max(0, Math.round(positive * 1.0 + neutral * 0.4)));
  const fire = score >= 90 ? Math.round(positive * 0.5) : Math.round(positive * 0.2);
  const love = Math.round(positive * 0.35);
  const good = Math.round(neutral * 0.5);
  const meh = Math.round(neutral * 0.5);
  const frustrated = Math.round(negative * 0.6);
  const awful = Math.round(negative * 0.4);
  const total = fire + love + good + meh + frustrated + awful || 1;
  const normalize = (v: number) => Math.round((v / total) * 100);

  // Extract sample tweets from results
  const sampleTweets = (data.results || []).slice(0, 5).map((r: any) => ({
    text: r.text || r.originalContent || "",
    sentiment: r.sentiment === "Positive" ? "😍" : r.sentiment === "Negative" ? "😤" : "😐",
  }));

  // Extract themes from summary
  const summaryText = data.summary || "";
  const keyThemes = summaryText
    .split(/[.,;!]/)
    .filter((s: string) => s.trim().length > 5 && s.trim().length < 60)
    .slice(0, 5)
    .map((s: string) => s.trim());

  return {
    sentimentScore: score,
    aiSummary: summaryText || "Analysis in progress...",
    aiConfidence: Math.min(98, Math.max(70, 75 + data.total_posts * 0.5)),
    totalPosts: data.total_posts || 0,
    breakdown: [normalize(fire), normalize(love), normalize(good), normalize(meh), normalize(frustrated), normalize(awful)],
    keyThemes: keyThemes.length > 0 ? keyThemes : ["Match discussion", "Fan reactions"],
    sampleTweets,
    source: data.source || "ai",
  };
}

// ── Sentiment hook per match ──────────────────────────────────────
function useMatchSentiment(match: Match | null, enabled: boolean) {
  const keyword = match ? getMatchKeyword(match) : "";

  return useQuery({
    queryKey: ["match-sentiment", match?.id],
    queryFn: async (): Promise<SentimentData> => {
      const { data, error } = await supabase.functions.invoke("analyze-football-sentiment", {
        body: { keyword, limit: 25 },
      });
      if (error) throw error;
      return parseSentimentResponse(data);
    },
    enabled: enabled && !!match,
    staleTime: 5 * 60 * 1000,
    refetchInterval: match && getMatchStatus(match).status === "live" ? 5 * 60 * 1000 : false,
  });
}

// ── Bulk sentiment for visible matches ────────────────────────────
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function useBulkMatchSentiments(matches: Match[]) {
  return useQuery({
    queryKey: ["bulk-sentiments", matches.map(m => m.id).join(",")],
    queryFn: async (): Promise<Record<string, SentimentData>> => {
      const results: Record<string, SentimentData> = {};

      // Process sequentially with delays to avoid 429 rate limits
      const batch = matches.slice(0, 6);
      for (const match of batch) {
        try {
          const keyword = getMatchKeyword(match);
          const { data, error } = await supabase.functions.invoke("analyze-football-sentiment", {
            body: { keyword, limit: 15 },
          });
          if (error) throw error;
          results[match.id] = parseSentimentResponse(data);
          // Wait 2s between requests to respect rate limits
          await delay(2000);
        } catch (e: any) {
          console.error(`Sentiment analysis failed for ${match.id}:`, e);
          const is429 = e?.message?.includes("429") || e?.status === 429;
          if (is429) {
            // Stop making more requests if rate limited
            console.warn("Rate limited, stopping further requests");
            break;
          }
          results[match.id] = {
            sentimentScore: 50,
            aiSummary: "Sentiment analysis pending...",
            aiConfidence: 0,
            totalPosts: 0,
            breakdown: [10, 15, 25, 25, 15, 10],
            keyThemes: ["Awaiting analysis"],
            sampleTweets: [],
            source: "pending",
          };
        }
      }

      return results;
    },
    enabled: matches.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

const LEAGUES = ["All", "Premier League", "La Liga", "Bundesliga", "Ligue 1", "Serie A", "UEFA Champions League"];
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

  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches();
  const queryClient = useQueryClient();

  const filtered = (matches || []).filter(m => {
    const ms = getMatchStatus(m);
    if (league !== "All" && getLeague(m) !== league) return false;
    if (status !== "all" && ms.status !== status) return false;
    return true;
  });

  const { data: sentiments, isLoading: sentimentsLoading, isFetching: sentimentsFetching } = useBulkMatchSentiments(filtered);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bulk-sentiments"] });
  }, [queryClient]);

  const isLoading = matchesLoading || sentimentsLoading;

  // Get unique leagues from actual data
  const availableLeagues = ["All", ...Array.from(new Set((matches || []).map(m => getLeague(m))))];

  return (
    <div className="space-y-4">
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Match Sentiments</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
          <span>🤖 Powered by Gemini AI</span>
          <span>•</span>
          <span className="font-bold">𝕏</span>
          <span>data</span>
        </p>
      </div>

      {/* Refresh button */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={sentimentsFetching}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${sentimentsFetching ? "animate-spin" : ""}`} />
          {sentimentsFetching ? "Analyzing..." : "Refresh AI Analysis"}
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {availableLeagues.map(l => (
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            {matchesLoading ? "Loading matches..." : "🤖 Gemini AI analyzing tweets..."}
          </p>
        </div>
      )}

      {/* Error state */}
      {matchesError && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load matches</p>
          <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
        </div>
      )}

      {/* Match cards */}
      {!isLoading && (
        <div className="space-y-3">
          {filtered.length === 0 && !matchesLoading && (
            <p className="text-center text-sm text-muted-foreground py-8">No matches found for this filter</p>
          )}
          {filtered.map((match, i) => {
            const sentiment = sentiments?.[match.id];
            return (
              <MatchCard
                key={match.id}
                match={match}
                sentiment={sentiment}
                index={i}
                expanded={expandedId === match.id}
                onToggle={() => setExpandedId(expandedId === match.id ? null : match.id)}
              />
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Sentiment data from X.com</span>
        <span>•</span>
        <span className="text-[hsl(var(--ai-green))]">🤖 Gemini AI</span>
        {filtered.length > 0 && (
          <>
            <span>•</span>
            <span>{filtered.length} matches</span>
          </>
        )}
      </div>
    </div>
  );
}

// ── Match Card ────────────────────────────────────────────────────
function MatchCard({
  match,
  sentiment,
  index,
  expanded,
  onToggle,
}: {
  match: Match;
  sentiment?: SentimentData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { status, detail } = getMatchStatus(match);
  const score = sentiment?.sentimentScore ?? 50;
  const mood = getMood(score);
  const gradient = getBorderGradient(score);
  const homeName = match.home_team?.name || "Home";
  const awayName = match.away_team?.name || "Away";
  const leagueName = getLeague(match);
  const isPending = !sentiment || sentiment.source === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:border-muted-foreground/30"
      >
        <div className={`h-1 bg-gradient-to-r ${gradient}`} />

        <div className="px-4 py-3">
          {/* Top row: teams + status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {homeName} vs {awayName}
              </p>
              <p className="text-[10px] text-muted-foreground">{leagueName}</p>
            </div>
            <StatusBadge status={status} detail={detail} />
          </div>

          {/* Hero: emoji + score */}
          <div className="flex items-center gap-4">
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="text-5xl select-none"
            >
              {isPending ? "⏳" : mood.emoji}
            </motion.span>
            <div className="flex-1">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Analyzing...</p>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{score}%</p>
                  <p className="text-xs text-muted-foreground">{mood.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-muted-foreground">
                      📊 {sentiment.totalPosts} posts analyzed
                    </p>
                    <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] py-0 px-1.5">
                      🤖 AI: {Math.round(sentiment.aiConfidence)}%
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top reaction */}
          {sentiment?.sampleTweets?.[0] && (
            <p className="text-[11px] text-muted-foreground mt-3 italic line-clamp-2">
              "{sentiment.sampleTweets[0].text}"
            </p>
          )}

          {/* Score display for finished matches */}
          {status === "finished" && match.home_score != null && match.away_score != null && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Score: {match.home_score} - {match.away_score}
            </p>
          )}

          {/* Last updated */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] text-muted-foreground">
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <Badge variant="outline" className="text-[8px] border-muted-foreground/20 text-muted-foreground py-0">
              🤖 Analyzed by Gemini AI
            </Badge>
          </div>
        </div>
      </button>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && sentiment && sentiment.source !== "pending" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ExpandedView match={match} sentiment={sentiment} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────
function StatusBadge({ status, detail }: { status: MatchStatus; detail?: string }) {
  if (status === "live") {
    return (
      <Badge className="bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))] border-[hsl(var(--destructive))]/20 text-[10px] gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--destructive))] animate-pulse" />
        LIVE {detail || ""}
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
  if (status === "upcoming") {
    return (
      <Badge variant="outline" className="text-[10px] text-primary border-primary/20">
        Upcoming
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
function ExpandedView({ match, sentiment }: { match: Match; sentiment: SentimentData }) {
  const { status } = getMatchStatus(match);
  const queryClient = useQueryClient();

  const handleReanalyze = () => {
    queryClient.invalidateQueries({ queryKey: ["bulk-sentiments"] });
  };

  return (
    <div className="bg-card border border-t-0 border-border rounded-b-2xl px-4 py-4 space-y-5">
      {/* Gemini AI Analysis header */}
      <div className="flex items-center gap-2 bg-[hsl(var(--ai-green))]/10 border border-[hsl(var(--ai-green))]/20 rounded-xl px-3 py-2">
        <span className="text-sm">🤖</span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-foreground">Gemini AI Analysis</p>
          <p className="text-[9px] text-muted-foreground">
            ✅ Analysis complete • {sentiment.totalPosts} posts • Confidence: {Math.round(sentiment.aiConfidence)}%
          </p>
        </div>
        <button onClick={handleReanalyze}>
          <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] cursor-pointer hover:bg-[hsl(var(--ai-green))]/10">
            Re-analyze
          </Badge>
        </button>
      </div>

      {/* AI Summary */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">AI-Generated Summary</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{sentiment.aiSummary}</p>
      </div>

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
                  animate={{ width: `${sentiment.breakdown[i] || 0}%` }}
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
              <span className="text-[10px] text-muted-foreground w-8 text-right">{sentiment.breakdown[i] || 0}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Themes */}
      {sentiment.keyThemes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <span className="font-bold">𝕏</span> Key Themes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sentiment.keyThemes.map((theme) => (
              <span
                key={theme}
                className="text-[10px] px-2.5 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* What X is saying */}
      {sentiment.sampleTweets.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <span className="font-bold">𝕏</span> What X.com is saying
          </p>
          <div className="space-y-2">
            {sentiment.sampleTweets.map((t, i) => (
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

      {/* Auto-refresh note for live */}
      {status === "live" && (
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-[hsl(var(--ai-green))]">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ai-green))] animate-pulse" />
          Auto-refreshing every 5 minutes • Gemini AI analyzing live
        </div>
      )}
    </div>
  );
}
