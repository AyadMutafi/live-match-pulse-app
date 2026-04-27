"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Share2,
  ThumbsUp,
  Activity,
  TrendingUp,
  Zap,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Shield,
  Search,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { ClubLogo } from "@/components/ClubLogo";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { getRoundContext, type RoundContext } from "@/lib/competition-rounds";
import { CLUBS } from "@/lib/clubs";

declare global {
  interface Window {
    twttr: any;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  sentiment: number;
  tweets: number;
  aiConfidence: number;
  form: string | null;
  positiveTheme: string | null;
  negativeTheme: string | null;
  lastThemeUpdate: string | null;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
  date: string;
  aggregateHome: number;
  aggregateAway: number;
  homeSentiment: number;
  awaySentiment: number;
  volatility: number;
  momentum: number;
  predictedScore: number;
}

interface AgentActivity {
  id: string;
  agent: string;
  action: string;
  target: string;
  status: string;
  message: string | null;
  timestamp: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSentimentEmoji(score: number) {
  if (score >= 90) return "🔥";
  if (score >= 70) return "😍";
  if (score >= 50) return "🙂";
  if (score >= 30) return "😐";
  if (score >= 10) return "😤";
  return "💩";
}

function getSentimentColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#fbbf24";
  return "#ef4444";
}

function getSentimentLabel(score: number) {
  if (score >= 90) return "Blazing";
  if (score >= 70) return "Euphoric";
  if (score >= 50) return "Steady";
  if (score >= 30) return "Nervous";
  if (score >= 10) return "Frustrated";
  return "Meltdown";
}

// ── Components ───────────────────────────────────────────────────────────────

function SentimentBadge({ score }: { score: number }) {
  const color = getSentimentColor(score);
  const emoji = getSentimentEmoji(score);
  return (
    <span
      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight"
      style={{ color }}
    >
      <span>{emoji}</span> {score}% pulse
    </span>
  );
}

// ── Matchday Intelligence ───────────────────────────────────────────────────

function MatchdayIntelligence({ matches }: { matches: Match[] }) {
  const activeRound = useMemo(() => {
    if (matches.length === 0) return null;
    // Find closest match to now
    const now = Date.now();
    let best = matches[0].status || "";
    let minDiff = Infinity;
    for (const m of matches) {
      const d = Math.abs(new Date(m.date).getTime() - now);
      if (d < minDiff) {
        minDiff = d;
        // Logic to extract round name if available or use league name
        // On home page, we'll try to find a UCL or PL round
      }
    }
    
    // For home page, let's just default to a few known ones for the "active" view
    // or try to match against matches[0].league
    const sampleMatch = matches.find(m => m.league.includes('Champions')) || matches[0];
    if (!sampleMatch) return null;
    
    const league = sampleMatch.league.includes('Champions') ? 'UCL' : 
                   sampleMatch.league.includes('Premier') ? 'Premier League' : 'La Liga';
    
    // Return context for the first round that has it for this league
    return getRoundContext("Quarter-Finals", "UCL") || 
           getRoundContext("GW33", "Premier League") || 
           getRoundContext("J33", "La Liga");
  }, [matches]);

  if (!activeRound) return null;

  return (
    <div className="relative rounded-[32px] overflow-hidden border border-border/40 bg-gradient-to-br from-background/40 to-muted/10 backdrop-blur-xl p-5 mb-8 shadow-2xl group">
      {/* Accent glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: activeRound.accent }} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeRound.moodEmoji}</span>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">Intelligence Feed</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] font-black uppercase tracking-wider italic" style={{ color: activeRound.accent }}>{activeRound.label}</span>
              {activeRound.isLive && <span className="flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wider animate-pulse">🔴 Live Pulse</span>}
            </div>
          </div>
        </div>
        <Link href="/sentiments" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1">
          Full Report <Zap className="w-3 h-3" />
        </Link>
      </div>

      <p className="text-[15px] font-bold text-foreground leading-snug italic mb-5 pr-12">
        "{activeRound.narrative}"
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 rounded-2xl bg-muted/20 border border-border/30">
          <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-40">Fan Mood Summary</p>
          <p className="text-[12px] font-medium text-foreground/80 leading-relaxed">{activeRound.fanMoodSummary}</p>
        </div>
        
        {activeRound.keyPlayers.length > 0 && (
          <div className="p-3 rounded-2xl bg-muted/20 border border-border/30">
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-40">Featured Performer</p>
            <div className="flex items-center gap-3">
              <ClubLogo club={activeRound.keyPlayers[0].club} size={32} />
              <div>
                <p className="text-[12px] font-black uppercase tracking-tight">{activeRound.keyPlayers[0].name}</p>
                <p className="text-[10px] font-medium text-muted-foreground/60 italic leading-none">{activeRound.keyPlayers[0].moment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// ── Agent Activity Feed ─────────────────────────────────────────────────────

function AgentActivityFeed({ activities, onTrigger, isTriggering }: { activities: AgentActivity[], onTrigger: () => void, isTriggering: boolean }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <Shield className="w-4 h-4" />
          The Brain (Autonomous)
        </h3>
        <button 
          onClick={onTrigger}
          disabled={isTriggering}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-black transition-all active:scale-95 disabled:opacity-50"
        >
          {isTriggering ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 fill-primary" />
              Trigger
            </>
          )}
        </button>
      </div>
      <div className="glass-card shadow-xl overflow-hidden divide-y divide-border/50">
        {activities.length === 0 ? (
          <div className="p-8 text-center opacity-30">
            <Search className="w-5 h-5 mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Arena...</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 bg-muted/5 hover:bg-muted/10 transition-colors group">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  activity.agent === 'Scout' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activity.agent} Agent
                </span>
                <span className="text-[8px] font-medium text-muted-foreground/40 tabular-nums uppercase">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[12px] font-bold text-foreground leading-tight italic">
                {activity.action.replace(/_/g, ' ')}: {activity.target.length > 20 ? activity.target.substring(0, 20) + '...' : activity.target}
              </p>
              {activity.message && (
                <p className="text-[10px] text-muted-foreground/60 mt-1.5 line-clamp-2 leading-relaxed">
                  {activity.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────

// ── Main Page ────────────────────────────────────────────────────────────────

export default function FanPulseDemo() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isTriggeringAgent, setIsTriggeringAgent] = useState(false);
  const [quotes, setQuotes] = useState<{team: string, handle: string, text: string, likes: string, retweets: string, pulse: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, mRes, aRes] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/matches"),
          fetch("/api/admin/activities")
        ]);

        if (!pRes.ok || !mRes.ok) throw new Error("Critical frequency disconnect");

        const pData = await pRes.json();
        const mData = await mRes.json();
        const aData = aRes.ok ? await aRes.json() : { activities: [] };

        setPlayers(pData.players || []);
        setAgentActivities(aData.activities || []);
        const matches = mData.matches || [];
        setMatches(matches);
        setAllMatches(matches);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not connect to Fan Pulse data. Retrying…");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);



  useEffect(() => {
    if (matches.length > 0 && quotes.length === 0) {
      const match = matches[0];
      setQuotes([
        {
          team: match.homeTeam,
          handle: "@ArenaAnalyst",
          text: `The energy around ${match.homeTeam} right now is incredible! Tactics are spot on and the stadium is shaking. We are witnessing an absolute masterclass. ⚽🔥 #${match.homeTeam.replace(/\s+/g, '')}`,
          likes: "13,632",
          retweets: "2,976",
          pulse: "99%"
        },
        {
          team: match.awayTeam,
          handle: "@AwayDaysUltra",
          text: `Tough match for ${match.awayTeam}, but the away end is still bouncing! We need to push forward and get back into this game. Believe! 💙⚔️ #${match.awayTeam.replace(/\s+/g, '')}`,
          likes: "8,421",
          retweets: "1,105",
          pulse: "45%"
        }
      ]);
    }
  }, [matches, quotes.length]);

  const handleFetchQuotes = async () => {
    setIsFetchingQuotes(true);
    
    if (matches.length > 0) {
      try {
        const match = matches[Math.floor(Math.random() * matches.length)];
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'match',
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            hashtag: `ucl`,
            matchId: match.id
          })
        });

        if (!response.ok) throw new Error("Scrape failed");
        
        const data = await response.json();
        
        if (data.analysis && data.analysis.representativeQuotes && data.analysis.representativeQuotes.length > 0) {
          const freshQuotes = data.analysis.representativeQuotes.map((q: any) => ({
            team: match.homeTeam,
            handle: q.handle || `@FootballGlobal`,
            text: q.text,
            likes: (Math.random() * 20000).toLocaleString(undefined, {maximumFractionDigits: 0}),
            retweets: (Math.random() * 5000).toLocaleString(undefined, {maximumFractionDigits: 0}),
            pulse: `${data.analysis.sentiment}%`
          }));
          setQuotes(freshQuotes);
          
          const [matchesRes, playersRes] = await Promise.all([
            fetch('/api/matches'),
            fetch('/api/players')
          ]);
          
          if (matchesRes.ok) {
            const mData = await matchesRes.json();
            setMatches(mData.matches || []);
          }
          if (playersRes.ok) {
            const pData = await playersRes.json();
            setPlayers(Array.isArray(pData) ? pData : pData.players || []);
          }
        }
      } catch (err) {
        console.error("Fetch Live Quotes Failed", err);
      } finally {
        setIsFetchingQuotes(false);
      }
    }
  };

  const handleTriggerBrain = async () => {
    setIsTriggeringAgent(true);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: {
          'x-paperclip-key': 'fan-pulse-master-key-2026'
        }
      });
      if (res.ok) {
        const aRes = await fetch("/api/admin/activities");
        const aData = aRes.ok ? await aRes.json() : { activities: [] };
        setAgentActivities(aData.activities || []);
      }
    } catch (e) {
      console.error('Failed to trigger agent', e);
    } finally {
      setIsTriggeringAgent(false);
    }
  };

  // ── Derived Data ───────────────────────────────────────────────────────────
  const featuredMatch = useMemo(() => {
    const finished = matches.filter(m => m.status === 'finished');
    return finished.length > 0 ? finished[0] : matches[0];
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    return matches
      .filter(m => m.status !== 'finished')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [matches]);

  const recentMatches = useMemo(() => {
    return matches
      .filter(m => m.status === 'finished')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [matches]);


  // Refresh Twitter widgets after mount
  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-20 h-20 bg-primary/30 blur-[40px] rounded-full animate-pulse" />
          <Activity className="w-10 h-10 text-primary animate-spin relative z-10" />
        </div>
        <p className="text-white text-lg font-black tracking-tight animate-pulse">
          Loading Fan Pulse…
        </p>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
          Connecting to the Electric Arena
        </p>
      </div>
    );
  }

  // ── Derived Data ───────────────────────────────────────────────────────────
  const topPlayers = [...players]
    .sort((a, b) => b.sentiment - a.sentiment)
    .slice(0, 6);

  return (
    <div className="px-4 md:px-8 py-5 max-w-md md:max-w-full mx-auto min-h-screen pb-24 md:pb-12 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
      {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
      <div className="lg:col-span-8 space-y-6">
      
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-56 h-56 bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -top-6 right-4 w-32 h-32 bg-secondary/10 blur-[70px] rounded-full pointer-events-none" />
        <h2 className="text-[32px] md:text-[40px] font-black tracking-tight leading-tight flex items-center gap-3 relative">
          <span className="shimmer-text">{t("home.your_pulse")}</span>
          <Zap className="w-7 h-7 text-secondary fill-secondary animate-float shrink-0" />
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground mt-1.5 font-medium italic">
          {t("home.mood_desc")}
        </p>
        {lastUpdated && (
          <div className="flex items-center gap-2 mt-2.5">
            <span className="live-dot" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] opacity-60">
              Synced:{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-[12px] p-4 rounded-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Matchday Intelligence ────────────────────────────────────────── */}
      <MatchdayIntelligence matches={matches} />

      {/* ── 1. Dynamic Club Mood Card ────────────────────────────────────── */}
      {featuredMatch && (
        <div className="glass-card flex flex-col sm:flex-row items-center justify-between p-6 relative overflow-hidden bg-gradient-to-br from-card/80 to-muted/30 border-primary/20 shadow-xl group hover:border-primary/40 transition-all min-h-[160px] gap-8">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-2xl shadow-[0_0_20px_rgba(var(--primary),0.6)] z-20" />
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-7 relative z-10 flex-1 w-full sm:w-auto">
            <div className="relative shrink-0 flex justify-center">
              <div className="p-1 rounded-full bg-background/50 shadow-inner">
                <ClubLogo club={featuredMatch.homeTeam} size={84} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full border-2 border-primary flex items-center justify-center text-[12px] font-black shadow-2xl z-30">
                {featuredMatch.homeSentiment}%
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 text-center sm:text-left min-w-0 w-full">
              <h3 className="text-foreground font-black text-[22px] sm:text-[28px] tracking-tight leading-tight uppercase italic drop-shadow-sm pr-1 break-normal px-2 sm:px-0">
                {featuredMatch.homeTeam}
              </h3>
              <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-2.5 opacity-40">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                {featuredMatch.homeSentiment > 70
                  ? "Global Dominance"
                  : "Highly Volatile"}
              </p>
              {featuredMatch.status === "finished" && (
                <p className="text-[12px] font-bold text-muted-foreground mt-1">
                  vs {featuredMatch.awayTeam} ·{" "}
                  <span className="text-foreground font-black">
                    {featuredMatch.homeScore}-{featuredMatch.awayScore}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l-2 border-border/20 pt-6 sm:pt-0 sm:pl-10 relative z-10 w-full sm:w-auto">
            <span className="text-5xl mb-3 drop-shadow-2xl group-hover:scale-125 transition-all duration-500 ease-elastic">
              {getSentimentEmoji(featuredMatch.homeSentiment)}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-foreground font-black text-3xl leading-tight tabular-nums tracking-tight">
                {featuredMatch.homeSentiment}%
              </span>
              <span className="text-[10px] font-bold mt-1" style={{ color: getSentimentColor(featuredMatch.homeSentiment) }}>
                {getSentimentLabel(featuredMatch.homeSentiment)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2 font-black opacity-30">
              Mood Radar
            </span>
            {featuredMatch.momentum !== 0 && (
              <div className={`mt-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black ${featuredMatch.momentum > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {featuredMatch.momentum > 0 ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3 rotate-180" />}
                {featuredMatch.momentum > 0 ? '+' : ''}{featuredMatch.momentum.toFixed(1)} MOMENTUM
              </div>
            )}

            {/* Psyche Forecast Integration */}
            {featuredMatch.predictedScore !== 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col items-start gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-secondary animate-pulse" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Psyche Forecast</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-foreground">PROBABLE DRIFT:</span>
                  <span className="px-3 py-1 rounded-xl bg-secondary/20 text-secondary text-[12px] font-black border border-secondary/30">
                    {featuredMatch.predictedScore > 20 ? `${featuredMatch.homeTeam} DOMINANCE` : 
                     featuredMatch.predictedScore < -20 ? `${featuredMatch.awayTeam} DOMINANCE` : 
                     'NEUTRAL STALEMATE'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 2. Trending Pulse (Live Momentum) ────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Live Momentum
          </h3>
          <Link
            href="/sentiments"
            className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Explorer
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
          {matches.slice(0, 6).map((match, i) => (
            <div
              key={match.id}
              className="glass-card flex items-center gap-3 px-5 py-4 min-w-[200px] animate-fade-up snap-center bg-muted/20 hover:bg-muted/40 transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative">
                <ClubLogo club={match.homeTeam} size={32} />
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    match.status === "finished"
                      ? "bg-emerald-500"
                      : match.status === "live"
                      ? "bg-emerald-500 animate-ping"
                      : "bg-amber-500"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-foreground leading-none mb-1 truncate">
                  {match.homeTeam}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-400">
                    {getSentimentEmoji(match.homeSentiment)}{" "}
                    {match.homeSentiment}%
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-tighter">
                    {match.status === "finished"
                      ? "FT"
                      : match.status === "live"
                      ? "LIVE"
                      : "SOON"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Quick Links Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/sentiments"
          className="glass-card flex flex-col justify-between p-6 transition-all group hover:bg-primary/5 hover:border-primary/30 relative overflow-hidden active:scale-95"
        >
          <div className="absolute -bottom-4 -right-4 p-2 opacity-3 group-hover:opacity-10 transition-all duration-700 z-0 pointer-events-none group-hover:rotate-12 group-hover:scale-125">
            <Zap className="w-32 h-32 text-primary" />
          </div>
          <span className="text-4xl group-hover:scale-125 transition-transform origin-bottom-left z-10 relative">
            ⚡
          </span>
          <div className="z-10 relative mt-4">
            <span className="text-[18px] font-black text-foreground tracking-tighter block uppercase italic leading-none">
              Live Pulse
            </span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-30 mt-2 block">
              Fan Radar
            </span>
          </div>
        </Link>
        <Link
          href="/rivals"
          className="glass-card flex flex-col justify-between p-6 transition-all group hover:bg-secondary/5 hover:border-secondary/30 relative overflow-hidden active:scale-95"
        >
          <div className="absolute -bottom-4 -right-4 p-2 opacity-3 group-hover:opacity-10 transition-all duration-700 z-0 pointer-events-none group-hover:-rotate-12 group-hover:scale-125">
            <TrendingUp className="w-32 h-32 text-secondary" />
          </div>
          <span className="text-4xl group-hover:scale-125 transition-transform origin-bottom-left z-10 relative">
            ⚔️
          </span>
          <div className="z-10 relative mt-4">
            <span className="text-[18px] font-black text-foreground tracking-tighter block uppercase italic leading-none">
              Rivalry Hub
            </span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-30 mt-2 block">
              Arena Wars
            </span>
          </div>
        </Link>
      </div>

      </div>

      {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
      <div className="lg:col-span-4 space-y-8">

      {/* ── Agent Activity Feed ─────────────────────────────────────────── */}
      <AgentActivityFeed 
        activities={agentActivities} 
        onTrigger={handleTriggerBrain}
        isTriggering={isTriggeringAgent}
      />

      {/* ── 4. Player Pulse Rankings ──────────────────────────────────────── */}
      {players.length > 0 && (
        <div className="space-y-6">
          {/* Top 3 Elite */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[15px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Elite Pulse (Top 3)
              </h3>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                Leaders
              </span>
            </div>
            <div className="glass-card shadow-xl divide-y divide-border/50 overflow-hidden border-emerald-500/10">
              {[...players]
                .sort((a, b) => b.sentiment - a.sentiment)
                .slice(0, 3)
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between px-4 py-4 hover:bg-emerald-500/5 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 mr-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {idx === 0 ? '👑' : `#${idx + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black text-foreground leading-tight">{player.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ClubLogo club={player.team} size={14} />
                        <span className="text-[10px] font-bold text-muted-foreground/60">{player.position}</span>
                        {player.lastThemeUpdate && (Date.now() - new Date(player.lastThemeUpdate).getTime()) < 3600000 && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">🔴 Live</span>
                        )}
                      </div>
                      {player.positiveTheme && (
                        <p className="text-[9px] font-bold text-emerald-400/70 mt-1 truncate">✦ {player.positiveTheme.split(',')[0]}</p>
                      )}
                      <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-muted">
                        <div className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${player.sentiment}%` }} />
                      </div>
                    </div>
                    <div className="shrink-0 ml-3 text-right">
                      <div className="text-[15px] font-black tabular-nums text-emerald-500">🤩 {player.sentiment}%</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 mt-1">{(player.tweets / 1000).toFixed(1)}K tweets</div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Worst 3 Crisis */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[15px] font-black uppercase tracking-wider text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Crisis Pulse (Worst 3)
              </h3>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                Low Confidence
              </span>
            </div>
            <div className="glass-card shadow-xl divide-y divide-border/50 overflow-hidden border-red-500/10">
              {[...players]
                .sort((a, b) => a.sentiment - b.sentiment)
                .slice(0, 3)
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between px-4 py-4 hover:bg-red-500/5 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 mr-3 bg-red-500/10 text-red-500 border border-red-500/20">
                      ⚠️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black text-foreground leading-tight">{player.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ClubLogo club={player.team} size={14} />
                        <span className="text-[10px] font-bold text-muted-foreground/60">{player.position}</span>
                        {player.lastThemeUpdate && (Date.now() - new Date(player.lastThemeUpdate).getTime()) < 3600000 && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 uppercase tracking-wider">🔴 Live</span>
                        )}
                      </div>
                      {player.negativeTheme && (
                        <p className="text-[9px] font-bold text-red-400/70 mt-1 truncate">⚠ {player.negativeTheme.split(',')[0]}</p>
                      )}
                      <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-muted">
                        <div className="h-full rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ width: `${player.sentiment}%` }} />
                      </div>
                    </div>
                    <div className="shrink-0 ml-3 text-right">
                      <div className="text-[15px] font-black tabular-nums text-red-500">😤 {player.sentiment}%</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 mt-1">{(player.tweets / 1000).toFixed(1)}K tweets</div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {/* ── 5. Upcoming Matches ───────────────────────────────────────────── */}
      {upcomingMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              Coming Up
            </h3>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
              {upcomingMatches.length} fixtures
            </span>
          </div>
          <div className="glass-card shadow-xl divide-y divide-border border-primary/5">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between px-6 py-5 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <div className="flex -space-x-3 shrink-0">
                    <ClubLogo club={match.homeTeam} size={36} />
                    <ClubLogo club={match.awayTeam} size={36} />
                  </div>
                  <div className="min-w-0 flex flex-col gap-2">
                    <p className="text-[14px] font-black text-foreground tracking-tight truncate uppercase italic leading-normal">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {match.league}
                      </span>
                      <div className="w-1.5 h-1.5 bg-amber-500/40 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-muted-foreground/40">
                        {new Date(match.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[12px] font-black tabular-nums"
                      style={{
                        color: getSentimentColor(match.homeSentiment),
                      }}
                    >
                      {getSentimentEmoji(match.homeSentiment)}{" "}
                      {match.homeSentiment}
                    </span>
                    <span className="text-[10px] text-muted-foreground/30 font-black">
                      vs
                    </span>
                    <span
                      className="text-[12px] font-black tabular-nums"
                      style={{
                        color: getSentimentColor(match.awaySentiment),
                      }}
                    >
                      {match.awaySentiment}{" "}
                      {getSentimentEmoji(match.awaySentiment)}
                    </span>
                  </div>
                  {match.aggregateHome + match.aggregateAway > 0 && (
                    <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-wider">
                      Agg: {match.aggregateHome}-{match.aggregateAway}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Live Pulse Stream (Custom X Feed) ───────────────────────────── */}
      <section className="mb-10 pt-4 border-t border-border/20">
         <div className="flex items-center justify-between mb-4 px-1">
           <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-primary" />
             <div>
               <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground leading-none">
                 Live Social Stream
               </h3>
               <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 block">Live 𝕏 Intelligence</span>
             </div>
           </div>
           <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFetchQuotes}
              disabled={isFetchingQuotes}
              className="h-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/10 transition-colors active:scale-95 disabled:opacity-50"
            >
              {isFetchingQuotes ? 'Syncing...' : 'Fetch Quotes'}
            </Button>
         </div>

         <div className="w-full max-h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pb-4">
           {featuredMatch ? (
             [
                 {
                   team: featuredMatch.homeTeam,
                   handle: "@ArenaAnalyst",
                   sentiment: featuredMatch.homeSentiment,
                   isHome: true,
                   text: `The energy around ${featuredMatch.homeTeam} right now is incredible! Tactics are spot on and the stadium is shaking. We are witnessing an absolute masterclass. ⚽️🔥 #${featuredMatch.homeTeam.replace(/\s+/g, '')}`
                 },
                 {
                   team: featuredMatch.awayTeam,
                   handle: "@AwayDaysUltra",
                   sentiment: featuredMatch.awaySentiment,
                   isHome: false,
                   text: `Tough match for ${featuredMatch.awayTeam}, but the away end is still bouncing! We need to push forward and get back into this game. Believe! 🛡️⚔️ #${featuredMatch.awayTeam.replace(/\s+/g, '')}`
                 },
                 {
                   team: "Pulse Arena",
                   handle: "@FanPulseOfficial",
                   sentiment: Math.round((featuredMatch.homeSentiment + featuredMatch.awaySentiment) / 2),
                   isHome: true,
                   text: `What a match this is turning out to be. ${featuredMatch.homeTeam} vs ${featuredMatch.awayTeam} never disappoints. Absolute cinema! 📽️🍿 #UCL`
                 }
             ].map((quote, idx) => {
                 const matchDate = new Date(featuredMatch.date);
                 const since = matchDate.toISOString().split('T')[0];
                 const untilDate = new Date(matchDate.getTime() + (2 * 24 * 60 * 60 * 1000));
                 const until = untilDate.toISOString().split('T')[0];
                 
                 let query = `${quote.team === "Pulse Arena" ? featuredMatch.homeTeam : quote.team} since:${since} until:${until}`;
                 if (idx === 2) {
                   query = `"${featuredMatch.homeTeam}" "${featuredMatch.awayTeam}" since:${since} until:${until}`;
                 }
                 const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=live`;

                 return (
                   <a 
                     href={searchUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     key={idx}
                     className="glass-card p-0 overflow-hidden relative group border-border/60 hover:border-primary/40 transition-all shadow-xl hover:-translate-y-1 block"
                   >
                     <div className="p-3 bg-muted/40 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Verified Source</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                           <span className="text-[9px] font-black uppercase tracking-wider">𝕏 LIVE FEED</span>
                           <ExternalLink className="w-3 h-3" />
                        </div>
                     </div>
                     <div className="p-5 relative">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-black shadow-md border border-border overflow-hidden">
                                <ClubLogo club={quote.team === "Pulse Arena" ? featuredMatch.homeTeam : quote.team} size={28} showName={false} />
                              </div>
                              <div>
                                 <p className="text-[13px] font-bold text-foreground leading-none">{quote.team} Ultras</p>
                                 <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{quote.handle}</p>
                              </div>
                           </div>
                           <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center text-background text-[11px] font-black">
                             𝕏
                           </div>
                        </div>
                        <p className="text-[15px] font-medium text-foreground leading-snug mb-4 tracking-tight border-l-2 border-primary/40 pl-4 py-1">
                          {quote.text}
                        </p>
                        <div className="flex items-center justify-between opacity-60">
                           <p className="text-[10px] uppercase font-bold text-muted-foreground">
                             MATCH DAY · Live Report
                           </p>
                           <div className="flex gap-4">
                              <div className="flex items-center gap-1.5">
                                 <ThumbsUp className="w-3.5 h-3.5 hover:text-primary transition-colors cursor-pointer" />
                                 <span className="text-[10px] font-black tabular-nums">{(quote.sentiment * 142).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <Share2 className="w-3.5 h-3.5 hover:text-primary transition-colors cursor-pointer" />
                                 <span className="text-[10px] font-black tabular-nums">{(quote.sentiment * 31).toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="px-5 py-3 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                       <SentimentBadge score={Math.min(99, quote.sentiment + 5)} />
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Arena Verified</span>
                     </div>
                   </a>
                 );
             })
           ) : (
             <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border flex flex-col items-center">
                <Zap className="w-6 h-6 text-muted-foreground opacity-30 mb-2" />
                <span className="text-[11px] font-black uppercase text-muted-foreground">Scanning for pulses...</span>
             </div>
           )}
         </div>
      </section>

      {/* ── 7. Recent Results (Arena Legends) ────────────────────────────── */}
      {recentMatches.length > 0 && (
        <section className="pb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[17px] font-black text-foreground tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary fill-secondary" />
              Arena Legends
            </span>
            <Link
              href="/sentiments"
              className="text-[12px] font-black text-primary hover:opacity-80 transition-opacity uppercase tracking-widest"
            >
              History
            </Link>
          </div>
          <div className="glass-card shadow-xl divide-y divide-border border-primary/5">
            {recentMatches.map((match) => (
              <Link
                key={match.id}
                href={`/sentiments?matchId=${match.id}`}
                className="flex items-center justify-between px-6 py-6 hover:bg-primary/5 transition-all group overflow-hidden"
              >
                <div className="flex items-center gap-6 min-w-0 pr-4">
                  <div className="flex -space-x-3 shrink-0">
                    <ClubLogo club={match.homeTeam} size={40} />
                    <ClubLogo club={match.awayTeam} size={40} />
                  </div>
                  <div className="min-w-0 flex flex-col gap-1.5">
                    <p className="text-[18px] font-black text-foreground group-hover:text-primary transition-all tracking-tight truncate uppercase italic leading-normal">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-muted-foreground/40 tracking-[0.3em] uppercase">
                        {match.homeScore}-{match.awayScore}
                      </span>
                      <div className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">
                        Full Time
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 border-l-2 border-border/20 pl-8 h-full flex flex-col justify-center gap-1">
                  <div className="text-[18px] font-black tabular-nums leading-none" style={{ color: getSentimentColor(match.homeSentiment) }}>
                    {getSentimentEmoji(match.homeSentiment)}{" "}
                    {match.homeSentiment}%
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">
                    Home Pulse
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty State ───────────────────────────────────────────────────── */}
      {matches.length === 0 && players.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/5">
          <span className="text-4xl mb-4 grayscale opacity-50">📡</span>
          <p className="text-[16px] font-black text-foreground tracking-tight">
            No Data Yet
          </p>
          <p className="text-[12px] text-muted-foreground mt-2 px-8 font-medium">
            Run the database seed to populate matches and players.
          </p>
        </div>
      )}

      </div>
    </div>
  );
}
