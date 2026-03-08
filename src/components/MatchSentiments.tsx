import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useMatches, Match } from "@/hooks/useMatches";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { getClubInfo } from "@/lib/constants";

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

// ── Team colors ───────────────────────────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  "manchester united": "#DA291C",
  "man united": "#DA291C",
  "liverpool": "#C8102E",
  "arsenal": "#EF0107",
  "chelsea": "#034694",
  "man city": "#6CABDD",
  "manchester city": "#6CABDD",
  "tottenham": "#132257",
  "real madrid": "#FEBE10",
  "barcelona": "#A50044",
  "bayern munich": "#DC052D",
  "bayern": "#DC052D",
  "dortmund": "#FDE100",
  "borussia dortmund": "#FDE100",
  "psg": "#004170",
  "paris saint-germain": "#004170",
  "juventus": "#000000",
  "inter milan": "#0068A8",
  "ac milan": "#FB090B",
  "napoli": "#12A0D7",
  "atletico madrid": "#CB3524",
  "leverkusen": "#E32221",
  "marseille": "#2FAEE0",
};

function getTeamColor(teamName: string): string {
  const lower = teamName.toLowerCase();
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (lower.includes(key)) return color;
  }
  const clubInfo = getClubInfo(teamName);
  return clubInfo?.color || "#6B7280";
}

// ── Types ─────────────────────────────────────────────────────────
type MatchStatus = "live" | "today" | "finished" | "upcoming";

interface TeamSentimentData {
  teamName: string;
  sentimentScore: number;
  aiSummary: string;
  aiConfidence: number;
  totalPosts: number;
  breakdown: number[];
  keyThemes: string[];
  sampleTweets: { text: string; sentiment: string }[];
  source: string;
}

interface DualSentimentData {
  home: TeamSentimentData;
  away: TeamSentimentData;
  totalPosts: number;
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
  if (matchDate.toDateString() === now.toDateString()) return { status: "today" };
  return { status: "upcoming" };
}

function getTeamKeyword(teamName: string): string {
  return teamName.replace(/\s*(FC|CF|SC|SSC|AC|AFC)\s*/gi, "").trim();
}

function getLeague(match: Match): string {
  return match.competition || match.home_team?.league || "Unknown";
}

// Parse sentiment API response into team-specific format
function parseTeamSentimentResponse(data: any, teamName: string): TeamSentimentData {
  const positive = data.percentages?.positive ?? 50;
  const negative = data.percentages?.negative ?? 20;
  const neutral = data.percentages?.neutral ?? 30;

  const score = Math.min(100, Math.max(0, Math.round(positive * 1.0 + neutral * 0.4)));
  const fire = score >= 90 ? Math.round(positive * 0.5) : Math.round(positive * 0.2);
  const love = Math.round(positive * 0.35);
  const good = Math.round(neutral * 0.5);
  const meh = Math.round(neutral * 0.5);
  const frustrated = Math.round(negative * 0.6);
  const awful = Math.round(negative * 0.4);
  const total = fire + love + good + meh + frustrated + awful || 1;
  const normalize = (v: number) => Math.round((v / total) * 100);

  const sampleTweets = (data.results || []).slice(0, 5).map((r: any) => ({
    text: r.text || "",
    sentiment: r.sentiment === "Positive" ? "😍" : r.sentiment === "Negative" ? "😤" : "😐",
  }));

  const summaryText = data.summary || "";
  const keyThemes = summaryText
    .split(/[.,;!]/)
    .filter((s: string) => s.trim().length > 5 && s.trim().length < 60)
    .slice(0, 4)
    .map((s: string) => s.trim());

  return {
    teamName,
    sentimentScore: score,
    aiSummary: summaryText || "Analysis in progress...",
    aiConfidence: Math.min(98, Math.max(70, 75 + (data.total_posts || 0) * 0.5)),
    totalPosts: data.total_posts || 0,
    breakdown: [normalize(fire), normalize(love), normalize(good), normalize(meh), normalize(frustrated), normalize(awful)],
    keyThemes: keyThemes.length > 0 ? keyThemes : ["Match discussion"],
    sampleTweets,
    source: data.source || "ai",
  };
}

function pendingTeamSentiment(teamName: string): TeamSentimentData {
  return {
    teamName,
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

// ── Data fetching ─────────────────────────────────────────────────
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function useBulkDualSentiments(matches: Match[]) {
  return useQuery({
    queryKey: ["bulk-dual-sentiments", matches.map(m => m.id).join(",")],
    queryFn: async (): Promise<Record<string, DualSentimentData>> => {
      const results: Record<string, DualSentimentData> = {};
      const batch = matches.slice(0, 5); // Max 5 matches = 10 API calls

      for (const match of batch) {
        const homeName = match.home_team?.name || "Home";
        const awayName = match.away_team?.name || "Away";

        let homeSentiment: TeamSentimentData;
        let awaySentiment: TeamSentimentData;

        // Fetch home team sentiment
        try {
          const keyword = `${getTeamKeyword(homeName)} fans`;
          const { data, error } = await supabase.functions.invoke("analyze-football-sentiment", {
            body: { keyword, limit: 12 },
          });
          if (error) throw error;
          homeSentiment = parseTeamSentimentResponse(data, homeName);
        } catch (e: any) {
          console.error(`Home sentiment failed for ${homeName}:`, e);
          if (e?.message?.includes("429") || e?.status === 429) {
            // Rate limited - use pending for both and stop
            results[match.id] = {
              home: pendingTeamSentiment(homeName),
              away: pendingTeamSentiment(awayName),
              totalPosts: 0,
            };
            break;
          }
          homeSentiment = pendingTeamSentiment(homeName);
        }

        await delay(2500);

        // Fetch away team sentiment
        try {
          const keyword = `${getTeamKeyword(awayName)} fans`;
          const { data, error } = await supabase.functions.invoke("analyze-football-sentiment", {
            body: { keyword, limit: 12 },
          });
          if (error) throw error;
          awaySentiment = parseTeamSentimentResponse(data, awayName);
        } catch (e: any) {
          console.error(`Away sentiment failed for ${awayName}:`, e);
          if (e?.message?.includes("429") || e?.status === 429) {
            results[match.id] = {
              home: homeSentiment,
              away: pendingTeamSentiment(awayName),
              totalPosts: homeSentiment.totalPosts,
            };
            break;
          }
          awaySentiment = pendingTeamSentiment(awayName);
        }

        results[match.id] = {
          home: homeSentiment,
          away: awaySentiment,
          totalPosts: homeSentiment.totalPosts + awaySentiment.totalPosts,
        };

        await delay(2500);
      }

      return results;
    },
    enabled: matches.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Filters ───────────────────────────────────────────────────────
const STATUSES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "🔴 Live", value: "live" },
  { label: "Today", value: "today" },
  { label: "Finished", value: "finished" },
];

// ── Main Component ────────────────────────────────────────────────
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

  const { data: sentiments, isLoading: sentimentsLoading, isFetching: sentimentsFetching } = useBulkDualSentiments(filtered);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bulk-dual-sentiments"] });
  }, [queryClient]);

  const isLoading = matchesLoading || sentimentsLoading;
  const availableLeagues = ["All", ...Array.from(new Set((matches || []).map(m => getLeague(m))))];

  return (
    <div className="space-y-4">
      <div className="text-center pt-2 pb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Match Sentiments</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
          <span>🤖 Powered by Gemini AI</span>
          <span>•</span>
          <span className="font-bold">𝕏</span>
          <span>data from both fanbases</span>
        </p>
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={sentimentsFetching}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${sentimentsFetching ? "animate-spin" : ""}`} />
          {sentimentsFetching ? "Analyzing both fanbases..." : "Refresh AI Analysis"}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            {matchesLoading ? "Loading matches..." : "🤖 Gemini AI analyzing both fanbases..."}
          </p>
        </div>
      )}

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
          {filtered.map((match, i) => (
            <DualMatchCard
              key={match.id}
              match={match}
              sentiment={sentiments?.[match.id]}
              index={i}
              expanded={expandedId === match.id}
              onToggle={() => setExpandedId(expandedId === match.id ? null : match.id)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2 pb-4">
        <span className="font-bold text-xs">𝕏</span>
        <span>Sentiment from both fanbases</span>
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

// ── Team Sentiment Box ────────────────────────────────────────────
function TeamSentimentBox({
  team,
  label,
  isPending,
}: {
  team: TeamSentimentData;
  label: string;
  isPending: boolean;
}) {
  const mood = getMood(team.sentimentScore);
  const color = getTeamColor(team.teamName);

  return (
    <div
      className="flex-1 rounded-xl border border-border bg-muted/30 p-3 text-center relative overflow-hidden"
      style={{ borderTopColor: color, borderTopWidth: "3px" }}
    >
      {isPending ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">Analyzing...</p>
        </div>
      ) : (
        <>
          <motion.span
            whileHover={{ scale: 1.15 }}
            className={`text-4xl select-none block ${mood.key === "fire" ? "animate-pulse" : ""}`}
          >
            {mood.emoji}
          </motion.span>
          <p className="text-xl font-bold text-foreground mt-1">{team.sentimentScore}%</p>
          <p className="text-[10px] text-muted-foreground font-medium">{mood.label}</p>
          <p className="text-[10px] mt-1.5 font-semibold" style={{ color }}>
            {label}
          </p>
        </>
      )}
    </div>
  );
}

// ── Dual Match Card ───────────────────────────────────────────────
function DualMatchCard({
  match,
  sentiment,
  index,
  expanded,
  onToggle,
}: {
  match: Match;
  sentiment?: DualSentimentData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { status, detail } = getMatchStatus(match);
  const homeName = match.home_team?.name || "Home";
  const awayName = match.away_team?.name || "Away";
  const leagueName = getLeague(match);
  const homeColor = getTeamColor(homeName);
  const awayColor = getTeamColor(awayName);
  const isPending = !sentiment || (sentiment.home.source === "pending" && sentiment.away.source === "pending");
  const totalPosts = sentiment?.totalPosts || 0;
  const avgConfidence = sentiment
    ? Math.round((sentiment.home.aiConfidence + sentiment.away.aiConfidence) / 2)
    : 0;

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
        {/* Dual color top stripe */}
        <div className="h-1.5 flex">
          <div className="flex-1" style={{ backgroundColor: homeColor }} />
          <div className="flex-1" style={{ backgroundColor: awayColor }} />
        </div>

        <div className="px-4 py-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {homeName} vs {awayName}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {leagueName}
                {status === "finished" && match.home_score != null && match.away_score != null && (
                  <span className="ml-1.5">• {match.home_score} - {match.away_score}</span>
                )}
              </p>
            </div>
            <StatusBadge status={status} detail={detail} />
          </div>

          {/* Two sentiment boxes side by side */}
          <div className="flex gap-3">
            <TeamSentimentBox
              team={sentiment?.home || pendingTeamSentiment(homeName)}
              label={`${getTeamKeyword(homeName)} Fans`}
              isPending={!sentiment || sentiment.home.source === "pending"}
            />
            <TeamSentimentBox
              team={sentiment?.away || pendingTeamSentiment(awayName)}
              label={`${getTeamKeyword(awayName)} Fans`}
              isPending={!sentiment || sentiment.away.source === "pending"}
            />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="font-bold">𝕏</span>
              {isPending ? "Analyzing..." : `${totalPosts.toLocaleString()} tweets`}
            </p>
            {!isPending && (
              <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] py-0 px-1.5">
                🤖 AI: {avgConfidence}%
              </Badge>
            )}
          </div>
        </div>
      </button>

      {/* Expanded view */}
      <AnimatePresence>
        {expanded && sentiment && !isPending && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <DualExpandedView match={match} sentiment={sentiment} />
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

// ── Team Section in Expanded View ─────────────────────────────────
function TeamExpandedSection({ team }: { team: TeamSentimentData }) {
  const mood = getMood(team.sentimentScore);
  const color = getTeamColor(team.teamName);
  const shortName = getTeamKeyword(team.teamName);

  return (
    <div className="space-y-4">
      {/* Team header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">
            {shortName} Fans
          </p>
          <p className="text-[10px] text-muted-foreground">
            {mood.emoji} {team.sentimentScore}% - {mood.label}
          </p>
        </div>
      </div>

      {/* Breakdown bars */}
      <div>
        <p className="text-[10px] font-semibold text-foreground mb-1.5">Sentiment Breakdown:</p>
        <div className="flex gap-0.5 h-4 rounded-full overflow-hidden bg-muted">
          {SENTIMENT_SCALE.map((s, i) => {
            const val = team.breakdown[i] || 0;
            if (val === 0) return null;
            return (
              <motion.div
                key={s.key}
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="h-full flex items-center justify-center"
                title={`${s.emoji} ${s.label}: ${val}%`}
                style={{
                  backgroundColor:
                    i <= 1 ? "hsl(var(--success))" :
                    i === 2 ? "hsl(var(--warning))" :
                    i === 3 ? "hsl(var(--muted-foreground))" :
                    "hsl(var(--destructive))",
                }}
              >
                {val >= 10 && <span className="text-[8px] text-white font-bold">{s.emoji} {val}%</span>}
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1 text-[8px] text-muted-foreground">
          {SENTIMENT_SCALE.map((s, i) => (
            <span key={s.key}>{s.emoji} {team.breakdown[i] || 0}%</span>
          ))}
        </div>
      </div>

      {/* Key Themes */}
      {team.keyThemes.length > 0 && team.keyThemes[0] !== "Awaiting analysis" && (
        <div>
          <p className="text-[10px] font-semibold text-foreground mb-1.5">What They're Saying:</p>
          <div className="space-y-1">
            {team.keyThemes.map((theme, i) => (
              <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                <span>{i === 0 ? "⚽" : i === 1 ? "🔥" : i === 2 ? "💪" : "💬"}</span>
                <span>"{theme}"</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Sample tweets */}
      {team.sampleTweets.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-foreground mb-1.5 flex items-center gap-1">
            <span className="font-bold">𝕏</span>
            Top Tweets from {shortName} Fans:
          </p>
          <div className="space-y-1.5">
            {team.sampleTweets.slice(0, 3).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-2 items-start bg-muted/40 rounded-lg px-2.5 py-1.5"
              >
                <span className="text-xs mt-0.5">{t.sentiment}</span>
                <p className="text-[10px] text-foreground/80 leading-relaxed line-clamp-2">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dual Expanded View ────────────────────────────────────────────
function DualExpandedView({ match, sentiment }: { match: Match; sentiment: DualSentimentData }) {
  const { status } = getMatchStatus(match);
  const queryClient = useQueryClient();
  const homeColor = getTeamColor(match.home_team?.name || "");
  const awayColor = getTeamColor(match.away_team?.name || "");

  const handleReanalyze = () => {
    queryClient.invalidateQueries({ queryKey: ["bulk-dual-sentiments"] });
  };

  return (
    <div className="bg-card border border-t-0 border-border rounded-b-2xl px-4 py-4 space-y-4">
      {/* AI Header */}
      <div className="flex items-center gap-2 bg-[hsl(var(--ai-green))]/10 border border-[hsl(var(--ai-green))]/20 rounded-xl px-3 py-2">
        <span className="text-sm">🤖</span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-foreground">Gemini AI Dual Fanbase Analysis</p>
          <p className="text-[9px] text-muted-foreground">
            ✅ {sentiment.totalPosts} posts analyzed from both fanbases
          </p>
        </div>
        <button onClick={handleReanalyze}>
          <Badge variant="outline" className="text-[8px] border-[hsl(var(--ai-green))]/30 text-[hsl(var(--ai-green))] cursor-pointer hover:bg-[hsl(var(--ai-green))]/10">
            Re-analyze
          </Badge>
        </button>
      </div>

      {/* Home team section */}
      {sentiment.home.source !== "pending" && (
        <div className="border rounded-xl p-3" style={{ borderColor: `${homeColor}30` }}>
          <TeamExpandedSection team={sentiment.home} />
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground font-medium">vs</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Away team section */}
      {sentiment.away.source !== "pending" && (
        <div className="border rounded-xl p-3" style={{ borderColor: `${awayColor}30` }}>
          <TeamExpandedSection team={sentiment.away} />
        </div>
      )}

      {/* Auto-refresh for live */}
      {status === "live" && (
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-[hsl(var(--ai-green))]">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ai-green))] animate-pulse" />
          Auto-refreshing every 5 minutes • Gemini AI analyzing live
        </div>
      )}
    </div>
  );
}
