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
  Wifi,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { ClubLogo } from "@/components/ClubLogo";
import { Tweet } from "react-tweet";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { getRoundContext, type RoundContext } from "@/lib/competition-rounds";
import { CLUBS } from "@/lib/clubs";
import { AnimatedCounter, Sparkline, DashboardSkeleton } from "@/components/PulsePolish";
import { useLiveMatches } from "@/lib/hooks/useLiveMatches";

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

// ── Pulse Ticker Component ──────────────────────────────────────────────────

function PulseTicker({ matches, players }: { matches: Match[], players: Player[] }) {
  const tickerItems = useMemo(() => {
    const items: { label: string, value: string, color: string }[] = [];
    
    // Add Match Pulses
    matches.slice(0, 3).forEach(m => {
      items.push({
        label: 'MATCH PULSE',
        value: `${m.homeTeam} vs ${m.awayTeam}: ${m.homeSentiment}%`,
        color: m.homeSentiment > 70 ? 'text-emerald-400' : 'text-amber-400'
      });
    });

    // Add Player Spikes
    players.slice(0, 3).forEach(p => {
      items.push({
        label: 'PLAYER SPIKE',
        value: `${p.name} (+${Math.floor(Math.random() * 10) + 5}% Surge)`,
        color: 'text-primary'
      });
    });

    // Add Trending Hashtags
    ['#UCL', '#CmonArsenal', '#HalaMadrid', '#MiaSanMia'].forEach(tag => {
      items.push({
        label: 'TRENDING',
        value: tag,
        color: 'text-secondary'
      });
    });

    return [...items, ...items]; // Double for seamless loop
  }, [matches, players]);

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-y border-white/5 overflow-hidden py-2.5 relative z-40">
      <div className="flex whitespace-nowrap animate-ticker">
        {tickerItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 mx-8">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-white/5 ${item.color}`}>
              {item.label}
            </span>
            <span className="text-[11px] font-black text-foreground/90 uppercase tracking-widest">
              {item.value}
            </span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentActivityFeed({ activities, onTrigger, isTriggering }: { activities: AgentActivity[], onTrigger: () => void, isTriggering: boolean }) {
  const getAgentConfig = (agent: string) => {
    switch (agent) {
      case 'Scout':
        return { name: 'Pulse Scout', icon: <Search className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-400/10' };
      case 'Analyst':
        return { name: 'Arena Analyst', icon: <Activity className="w-3.5 h-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'Journalist':
        return { name: 'Arena Journalist', icon: <ExternalLink className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-400/10' };
      default:
        return { name: 'Assistant', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-primary', bg: 'bg-primary/10' };
    }
  };

  const humanizeAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-primary flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Arena Intelligence
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Autonomous</span>
        </div>
      </div>
      <div className="glass-card shadow-xl overflow-hidden divide-y divide-border/30">
        {activities.length === 0 ? (
          <div className="p-10 text-center opacity-30">
            <Search className="w-6 h-6 mx-auto mb-3" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em]">Scanning Arena...</p>
          </div>
        ) : (
          activities.map((activity) => {
            const config = getAgentConfig(activity.agent);
            return (
              <div key={activity.id} className="p-5 hover:bg-muted/10 transition-all group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                    {config.icon}
                    <span className="text-[9px] font-black uppercase tracking-wider">
                      {config.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground/30 tabular-nums uppercase tracking-tighter">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-black text-foreground leading-none tracking-tight">
                    {activity.target}
                  </p>
                  <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.1em] italic">
                    {humanizeAction(activity.action)}
                  </p>
                </div>
                {activity.message && (
                  <div className="mt-3 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                    <p className="text-[11px] text-muted-foreground/80 pl-3 leading-relaxed font-medium">
                      {activity.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────

// ── Main Page ────────────────────────────────────────────────────────────────

export default function FanPulseDemo() {
  const { matches, isLoading: isMatchesLoading, isError, hasLiveMatch } = useLiveMatches();
  const [players, setPlayers] = useState<Player[]>([]);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isTriggeringAgent, setIsTriggeringAgent] = useState(false);
  const [quotes, setQuotes] = useState<{team: string, handle: string, text: string, likes: string, retweets: string, pulse: string, tweetId?: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>("just now");
  
  const [myClub, setMyClub] = useState<string | null>(null);
  const [showClubSelect, setShowClubSelect] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('myClub');
    if (saved) {
      setMyClub(saved);
      applyClubTheme(saved);
    } else {
      setTimeout(() => setShowClubSelect(true), 1500);
    }
  }, []);

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const applyClubTheme = (clubId: string) => {
    const club = CLUBS.find(c => c.id === clubId);
    if (!club) return;
    const { h, s, l } = hexToHsl(club.primaryColor);
    const safeLightness = Math.min(l, 55);
    const safeSaturation = Math.max(s, 40);
    document.documentElement.style.setProperty('--primary', `${h} ${safeSaturation}% ${safeLightness}%`);
  };

  const selectMyClub = (clubId: string) => {
    localStorage.setItem('myClub', clubId);
    setMyClub(clubId);
    applyClubTheme(clubId);
    setShowClubSelect(false);
  };

  // Sync matches update time
  useEffect(() => {
    if (matches && matches.length > 0) {
      setLastUpdated(new Date());
    }
  }, [matches]);

  // Update freshness indicator
  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds} seconds ago`);
      else setTimeAgo(`${Math.floor(seconds / 60)} minutes ago`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Handle errors from SWR
  useEffect(() => {
    if (isError) {
      setError("Could not connect to Fan Pulse data. Retrying…");
    } else {
      setError(null);
    }
  }, [isError]);

  useEffect(() => {
    async function fetchStaticData() {
      try {
        const [pRes, aRes] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/admin/activities")
        ]);

        if (!pRes.ok) throw new Error("Critical frequency disconnect");

        const pData = await pRes.json();
        const aData = aRes.ok ? await aRes.json() : { activities: [] };

        setPlayers(pData.players || []);
        setAgentActivities(aData.activities || []);
      } catch (err) {
        console.error("Failed to fetch static data:", err);
        setError("Could not connect to Fan Pulse data. Retrying…");
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchStaticData();
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

  const fetchSignals = async () => {
    setIsFetchingQuotes(true);
    try {
      // Just fetch the cached signals from the database
      const res = await fetch('/api/signals');
      if (res.ok) {
        const data = await res.json();
        if (data.signals && data.signals.length > 0) {
          setQuotes(data.signals.slice(0, 4));
        }
      }
    } catch (err) {
      console.error("Failed to fetch signals:", err);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  // Poll for new signals every 2 minutes
  useEffect(() => {
    fetchSignals(); // Initial fetch
    const interval = setInterval(fetchSignals, 120000);
    return () => clearInterval(interval);
  }, []);


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
    let sortedMatches = [...matches];
    if (myClub) {
      const clubObj = CLUBS.find(c => c.id === myClub);
      if (clubObj) {
         const clubName = clubObj.shortName;
         sortedMatches.sort((a, b) => {
           const aIsMyClub = a.homeTeam === clubName || a.awayTeam === clubName;
           const bIsMyClub = b.homeTeam === clubName || b.awayTeam === clubName;
           if (aIsMyClub && !bIsMyClub) return -1;
           if (!aIsMyClub && bIsMyClub) return 1;
           return 0;
         });
      }
    }
    const finished = sortedMatches.filter(m => m.status === 'finished');
    return finished.length > 0 ? finished[0] : sortedMatches[0];
  }, [matches, myClub]);

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
  if (loadingInitial || (isMatchesLoading && matches.length === 0)) {
    return <DashboardSkeleton />;
  }

  // ── Derived Data ───────────────────────────────────────────────────────────
  const topPlayers = [...players]
    .sort((a, b) => b.sentiment - a.sentiment)
    .slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-arena">
      {hasLiveMatch && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest py-1.5 px-4 flex items-center justify-center gap-2 z-50 relative">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          LIVE — Auto-refreshing every 15s
        </div>
      )}
      <PulseTicker matches={matches} players={players} />
      
      <div className="px-4 md:px-8 py-8 max-w-md md:max-w-full mx-auto pb-24 md:pb-12 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
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
              Last updated {timeAgo}
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
        <Link href={`/match/${featuredMatch.id}`} className="block glass-card flex flex-col sm:flex-row items-center justify-between p-6 relative overflow-hidden bg-gradient-to-br from-card/80 to-muted/30 border-primary/20 shadow-xl group hover:border-primary/40 transition-all min-h-[160px] gap-8">
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
                <AnimatedCounter value={featuredMatch.homeSentiment} />
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
        </Link>
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
            <Link
              key={match.id}
              href={`/match/${match.id}`}
              className="block glass-card flex items-center gap-3 px-5 py-4 min-w-[200px] animate-fade-up snap-center bg-muted/20 hover:bg-muted/40 transition-colors"
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
            </Link>
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

      {/* ── Tactical Signal Cards (AI Intercepts) ─────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[15px] font-black uppercase tracking-wider text-primary flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary animate-pulse" />
            Intercepted Signals
          </h3>
        </div>
        
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center opacity-50">
              <Wifi className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Awaiting Signals</p>
            </div>
          ) : (
            quotes.map((quote, idx) => (
              <div key={idx} className="glass-card relative overflow-hidden group hover:border-primary/30 transition-all">
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
                
                <div className="p-5 pb-2">
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                        🤖
                      </div>
                      <div>
                        <a 
                          href={`https://x.com/${quote.handle.replace('@', '')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[12px] font-black text-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
                        >
                          {quote.handle}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{quote.team} Intel</p>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-black bg-primary/20 text-primary uppercase tracking-widest border border-primary/20">
                      Pulse: {quote.pulse}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="relative mb-4">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/40 rounded-full" />
                    <p className="pl-4 text-[13px] font-medium leading-relaxed text-foreground/90 italic">
                      "{quote.text}"
                    </p>
                  </div>

                  {quote.tweetId && (
                    <div className="mt-2 pt-4 border-t border-border/10 dark-tweet-container">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Verified Signal Source</span>
                      </div>
                      <Tweet id={quote.tweetId} />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest border-t border-border/40 pt-3 relative z-10">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {quote.likes}</span>
                    <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {quote.retweets}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </section>

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
         </div>

         <div className="w-full max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pb-4">
            {quotes.length > 0 ? (
              quotes.map((quote, idx) => (
                <div key={idx} className="glass-card relative overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="p-4 pb-2 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verified Source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-full text-[9px] font-black bg-primary/20 text-primary uppercase tracking-widest border border-primary/20">
                        {quote.pulse}
                      </div>
                    </div>
                  </div>

                  {quote.tweetId ? (
                    <div className="px-2 py-2 dark-tweet-container">
                      <Tweet id={quote.tweetId} />
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg border border-white/10 shadow-inner">
                             ⚽
                           </div>
                           <div>
                             <h4 className="text-[13px] font-black text-foreground uppercase tracking-tight leading-none mb-1">{quote.team} Intel</h4>
                             <p className="text-[11px] text-muted-foreground font-bold">{quote.handle}</p>
                           </div>
                        </div>
                      </div>
                      <p className="text-[14px] text-foreground/90 font-medium leading-relaxed italic mb-4">
                        "{quote.text}"
                      </p>
                      <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> {quote.likes}</span>
                        <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 text-secondary" /> {quote.retweets}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : featuredMatch ? (
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
                  }
              ].map((quote, idx) => {
                  const matchDate = new Date(featuredMatch.date);
                  const since = matchDate.toISOString().split('T')[0];
                  const untilDate = new Date(matchDate.getTime() + (2 * 24 * 60 * 60 * 1000));
                  const until = untilDate.toISOString().split('T')[0];
                  
                  const query = `${quote.team} since:${since} until:${until}`;
                  const searchUrl = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=live`;

                  return (
                    <div key={idx} className="glass-card relative overflow-hidden group hover:border-primary/30 transition-all">
                       <div className="p-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-primary/40" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Historical Intel</span>
                        </div>
                        <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-black text-primary uppercase hover:underline">
                           X Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg border border-white/10">
                               <ClubLogo club={quote.team} size={28} showName={false} />
                             </div>
                             <div>
                               <h4 className="text-[13px] font-black text-foreground uppercase tracking-tight leading-none mb-1">{quote.team}</h4>
                               <p className="text-[11px] text-muted-foreground font-bold">{quote.handle}</p>
                             </div>
                          </div>
                          <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                            {quote.sentiment}% Pulse
                          </div>
                        </div>
                        <p className="text-[14px] text-foreground/90 font-medium leading-relaxed italic mb-4">
                          "{quote.text}"
                        </p>
                        <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> 14.2K</span>
                          <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3 text-secondary" /> 3.1K</span>
                        </div>
                      </div>
                    </div>
                  );
              })
            ) : (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
                <Wifi className="w-10 h-10 text-muted-foreground mb-4 animate-pulse" />
                <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.3em]">Scanners Active</p>
                <p className="text-[10px] text-muted-foreground/60 uppercase font-bold mt-2">Awaiting social intercepts...</p>
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
                <div className="text-right shrink-0 border-l-2 border-border/20 pl-8 h-full flex flex-col justify-center gap-1.5">
                  <div className="text-[18px] font-black tabular-nums leading-none" style={{ color: getSentimentColor(match.homeSentiment) }}>
                    {getSentimentEmoji(match.homeSentiment)}{" "}
                    <AnimatedCounter value={match.homeSentiment} />
                  </div>
                  <Sparkline
                    data={[
                      Math.max(20, match.homeSentiment - 15 + Math.floor(match.homeTeam.length * 2)),
                      Math.max(20, match.homeSentiment - 8),
                      Math.max(20, match.homeSentiment - 3 + Math.floor(match.awayTeam.length)),
                      Math.max(20, match.homeSentiment + 5),
                      match.homeSentiment
                    ]}
                    width={50}
                    height={16}
                  />
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

      {/* ── My Club Selection Modal ── */}
      {showClubSelect && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="glass-card max-w-lg w-full p-8 shadow-2xl border-primary/30 flex flex-col items-center text-center max-h-[90vh] overflow-y-auto custom-scrollbar">
             <Shield className="w-12 h-12 text-primary mb-4 animate-pulse shrink-0" />
             <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Select Your Arena</h2>
             <p className="text-muted-foreground text-sm font-medium mb-8">Personalize your Fan Pulse experience. We'll prioritize your club's signals and theme your dashboard.</p>
             
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full mb-8">
               {CLUBS.map(club => (
                 <button 
                   key={club.id}
                   onClick={() => selectMyClub(club.id)}
                   className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                 >
                   <div className="w-14 h-14 rounded-full bg-background border border-border shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform p-2">
                     <ClubLogo club={club.name} size={40} showName={false} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{club.shortName}</span>
                 </button>
               ))}
             </div>
             
             <button onClick={() => setShowClubSelect(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
               Skip for now
             </button>
          </div>
        </div>
      )}

      </div>
    </div>
  </div>
);
}
