'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Share2, ThumbsUp, Activity, Download, TrendingUp, Zap, Sparkles, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { ClubLogo } from '@/components/ClubLogo'

declare global {
  interface Window {
    twttr: any;
  }
}

// We disabled status URL widget checking to force usage of our more visually consistent dynamic Custom Cards that don't leak "2025" fallback timestamp dates
const isStatusUrl = (url: string) => false;
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'

// ── Types ────────────────────────────────────────────────────────────────────

type Tweet = {
  id: string; author: string; handle: string; content: string;
  sentiment: number; likes: number; retweets: number; replies: number;
  url: string; avatarBg: string; avatarInitial: string;
}

type Match = {
  id: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number;
  status: string; league: string; date: string; homeSentiment: number; awaySentiment: number;
}

// ── Components ───────────────────────────────────────────────────────────────

function SentimentBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#fbbf24' : '#ef4444'
  const icon = score >= 80 ? '🔥' : score >= 50 ? '😐' : '😡'
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight" style={{ color }}>
      <span>{icon}</span> {score}% positive sentiment
    </span>
  )
}

function StatBtn({ icon: Icon, count, label }: { icon: any; count: number; label: string }) {
  return (
    <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-all px-3 py-1.5 rounded-lg hover:bg-primary/10 active:scale-95">
      <Icon className="w-3.5 h-3.5" />
      <span>{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [fetchingData, setFetchingData] = useState(true)

  // 100% Real Tweet Loader Hook
  useEffect(() => {
    // Refresh Twitter widgets whenever tweets update
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [tweets]);
  const [scraping, setScraping] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { t } = useLanguage()

  const loadData = async () => {
    try {
      setFetchingData(true)
      const [twRes, matchRes] = await Promise.all([
        fetch('/api/tweets'),
        fetch('/api/matches')
      ])
      
      if (twRes.ok) setTweets(await twRes.json())
      if (matchRes.ok) setMatches(await matchRes.json())
      
      setLastUpdated(new Date())
    } catch (e) {
      console.error('Failed to load data', e)
    } finally {
      setFetchingData(false)
    }
  }

  const triggerLiveScrape = async () => {
    setScraping(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/scrape', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to scrape live tweets')
      await loadData()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setScraping(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  if (!mounted) return null

  // Derived data for UI
  const featuredMatch = matches.find(m => m.status === 'live') || matches[0]
  const recentMatches = matches.filter(m => m.status === 'finished').slice(0, 3)

  return (
    <div className="px-4 py-5 space-y-6 max-w-md mx-auto min-h-screen pb-24">

      {/* Header section with Premium Glow */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        <h2 className="text-[28px] font-black text-foreground tracking-tight leading-tight flex items-center gap-2">
          {t('home.your_pulse')}
          <Zap className="w-6 h-6 text-secondary fill-secondary animate-pulse" />
        </h2>
        <p className="text-[14px] text-muted-foreground mt-1 font-medium italic">
          {t('home.mood_desc')}
        </p>
      </div>

      {/* 1. Dynamic Club Mood Card (Real Data) - Robust Layout */}
      {featuredMatch && (
        <div className="glass-card flex flex-col sm:flex-row items-center justify-between p-8 relative overflow-hidden bg-gradient-to-br from-card/80 to-muted/30 border-primary/20 shadow-xl group hover:border-primary/40 transition-all min-h-[160px] gap-6">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-2xl shadow-[0_0_20px_rgba(var(--primary),0.6)] z-20"></div>
          <div className="flex items-center gap-7 relative z-10 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="p-1 rounded-full bg-background/50 shadow-inner">
                <ClubLogo club={featuredMatch.homeTeam} size={72} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full border-2 border-primary flex items-center justify-center text-[12px] font-black shadow-2xl z-30">
                {featuredMatch.homeSentiment}%
              </div>
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-3">
              <h3 className="text-foreground font-black text-[24px] sm:text-[28px] tracking-tighter truncate leading-none uppercase italic drop-shadow-sm pr-2">
                {featuredMatch.homeTeam}
              </h3>
              <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.25em] flex items-center gap-2.5 opacity-40">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                {featuredMatch.homeSentiment > 70 ? 'Global Dominance' : 'Highly Volatile'}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l-2 border-border/20 pt-6 sm:pt-0 sm:pl-10 relative z-10 w-full sm:w-auto">
            <span className="text-5xl mb-3 drop-shadow-2xl group-hover:scale-125 transition-all duration-500 ease-elastic">
              {featuredMatch.homeSentiment > 80 ? '👑' : featuredMatch.homeSentiment > 60 ? '🤩' : '😤'}
            </span>
            <span className="text-foreground font-black text-3xl leading-none tabular-nums tracking-tighter">
              {featuredMatch.homeSentiment}%
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2 font-black opacity-30">Mood Radar</span>
          </div>
        </div>
      )}

      {/* 2. Trending Pulse (Dynamic Leagues) */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Live Momentum
          </h3>
          <Link href="/sentiments" className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors">Explorer</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
          {matches.slice(0, 4).map((match, i) => (
            <div key={match.id} className="glass-card flex items-center gap-3 px-5 py-4 min-w-[200px] animate-fade-up snap-center bg-muted/20 hover:bg-muted/40 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative">
                <ClubLogo club={match.homeTeam} size={32} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-foreground leading-none mb-1 truncate">{match.homeTeam}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-400">+{Math.floor(match.homeSentiment / 10)}%</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                  <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-tighter">{match.league === 'La Liga' ? 'ESP' : 'ENG'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Quick Links Grid (Fixing watermarks once and for all) */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/sentiments" className="glass-card flex flex-col justify-between p-6 transition-all group hover:bg-primary/5 hover:border-primary/30 relative overflow-hidden active:scale-95">
          <div className="absolute -bottom-4 -right-4 p-2 opacity-3 group-hover:opacity-10 transition-all duration-700 z-0 pointer-events-none group-hover:rotate-12 group-hover:scale-125">
            <Zap className="w-32 h-32 text-primary" />
          </div>
          <span className="text-4xl group-hover:scale-125 transition-transform origin-bottom-left z-10 relative">⚡</span>
          <div className="z-10 relative mt-4">
            <span className="text-[18px] font-black text-foreground tracking-tighter block uppercase italic leading-none">Live Pulse</span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-30 mt-2 block">Fan Radar</span>
          </div>
        </Link>
        <Link href="/rivals" className="glass-card flex flex-col justify-between p-6 transition-all group hover:bg-secondary/5 hover:border-secondary/30 relative overflow-hidden active:scale-95">
          <div className="absolute -bottom-4 -right-4 p-2 opacity-3 group-hover:opacity-10 transition-all duration-700 z-0 pointer-events-none group-hover:-rotate-12 group-hover:scale-125">
            <TrendingUp className="w-32 h-32 text-secondary" />
          </div>
          <span className="text-4xl group-hover:scale-125 transition-transform origin-bottom-left z-10 relative">⚔️</span>
          <div className="z-10 relative mt-4">
            <span className="text-[18px] font-black text-foreground tracking-tighter block uppercase italic leading-none">Rivalry Hub</span>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-30 mt-2 block">Arena Wars</span>
          </div>
        </Link>
      </div>

      {/* 4. Live X/Twitter Feed (Fixing Header Clash) */}
      <section className="glass-card p-10 border-primary/10 shadow-2xl relative">
        <Script 
          src="https://platform.twitter.com/widgets.js" 
          strategy="afterInteractive" 
          onLoad={() => {
            if (window.twttr && window.twttr.widgets) {
               window.twttr.widgets.load();
            }
          }}
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-7 w-full sm:w-auto overflow-hidden">
            <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-4xl shadow-2xl border border-primary/20 shrink-0">🎙️</div>
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-foreground font-black text-[32px] tracking-[-0.04em] uppercase italic leading-tight drop-shadow-md truncate">Arena Talk</h3>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                <span className="text-[12px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] leading-none">Real-Time Social Pulse</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
            <Button 
                variant="glow"
                size="sm"
                onClick={triggerLiveScrape}
                disabled={scraping}
                className="font-black text-[13px] h-12 px-8 active:scale-95 transition-all w-full sm:w-auto rounded-3xl shadow-[0_15px_40px_rgba(var(--primary),0.25)] relative z-10"
            >
              {scraping ? <RefreshCw className="w-5 h-5 animate-spin mr-3" /> : <Zap className="w-5 h-5 mr-3 fill-current" />}
              {scraping ? 'Syncing...' : 'Fetch Live Quotes'}
            </Button>
            {lastUpdated && (
              <div className="flex items-center gap-2 opacity-30 mt-1">
                 <Activity className="w-3 h-3 text-secondary animate-pulse" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
                  PULSE SYNCED: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            )}
          </div>
        </div>

        {fetchingData ? (
          <div className="py-20 flex flex-col items-center justify-center w-full gap-4">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Activity className="w-8 h-8 text-primary animate-spin relative z-10" />
            </div>
            <p className="text-[12px] font-bold text-muted-foreground animate-pulse">Connecting to Electric Arena...</p>
          </div>
        ) : tweets.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center w-full text-center border-2 border-dashed border-border rounded-2xl mb-4 bg-muted/5">
            <span className="text-3xl mb-3 grayscale opacity-50">📡</span>
            <p className="text-[14px] font-black text-foreground tracking-tight">The Air is Silent</p>
            <p className="text-[11px] text-muted-foreground mt-1 px-8 font-medium">Click "Fetch Live Quotes" to ignite the social feed with Firecrawl intelligence.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-[12px] p-4 rounded-xl font-bold mb-4 flex items-center gap-2">
                <span>⚠️</span> {errorMsg}
              </div>
            )}
            <div className="grid gap-8">
              {tweets.map((tweet) => (
                <div key={tweet.id + lastUpdated?.getTime()} className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl hover:border-primary/30 transition-all duration-500 group">
                  <div className="p-5 bg-muted/10 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{isStatusUrl(tweet.url) ? 'Verified Source' : 'Social Radar'}</span>
                     </div>
                     <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black text-primary hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        X SOURCE <ExternalLink className="w-3 h-3" />
                     </a>
                  </div>

                  {isStatusUrl(tweet.url) ? (
                    /* HYBRID: Official Widget for validated status URLs */
                    <div className="p-2 min-h-[160px] flex items-center justify-center bg-black/20 px-6 py-10 transition-all">
                       <blockquote className="twitter-tweet w-full" data-theme="dark" data-chrome="noheader nofooter noborders transparent" data-conversation="none" data-align="center">
                          <a href={tweet.url.replace('x.com', 'twitter.com')}>
                            <div className="text-center p-4">
                              <p className="font-bold text-lg mb-2 italic">"{tweet.content}"</p>
                              <p className="text-muted-foreground text-sm">— {tweet.author} (@{tweet.handle.replace('@', '')})</p>
                            </div>
                          </a>
                       </blockquote>
                    </div>
                  ) : (
                    /* HYBRID: Custom Interaction Card for search results/other */
                    <div className="p-8 space-y-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <AlertCircle className="w-24 h-24 text-primary" />
                       </div>
                       <p className="text-[18px] text-foreground font-bold tracking-tight leading-relaxed italic border-l-4 border-primary/40 pl-6">
                         "{tweet.content}"
                       </p>
                       <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shadow-lg border border-primary/20">𝕏</div>
                             <div>
                                <p className="text-[13px] font-black text-foreground leading-none">{tweet.author}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{tweet.handle?.startsWith('@') ? tweet.handle : `@${tweet.handle || 'PulseArena'}`}</p>
                             </div>
                          </div>
                          <div className="flex gap-4 opacity-50">
                             <div className="flex items-center gap-1.5">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black tabular-nums">{tweet.likes}</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black tabular-nums">{tweet.retweets}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted/5 border-t border-white/5 flex flex-wrap items-center justify-between px-8 gap-4">
                    <SentimentBadge score={tweet.sentiment} />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 whitespace-nowrap">Arena Verified</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 4b. Official X Timeline Embed (Hashtag #FanPulse) */}
            <div className="mt-8 border-t border-border pt-8">
               <div className="flex items-center gap-2 mb-6 ml-2">
                 <Sparkles className="w-4 h-4 text-secondary" />
                 <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Arena Trending</h4>
               </div>
               <div className="w-full h-[500px] overflow-y-auto rounded-3xl border border-border shadow-inner bg-background/50 scrollbar-none custom-twitter-embed">
                  <a 
                    className="twitter-timeline" 
                    data-theme="dark" 
                    data-chrome="noheader nofooter noborders transparent" 
                    data-tweet-limit="5"
                    href="https://twitter.com/hashtag/RealMadrid?src=hash&ref_src=twsrc%5Etfw"
                  >
                    Loading #RealMadrid Pulse Feed...
                  </a>
               </div>
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full mt-4 h-12 font-black rounded-2xl border-border hover:bg-muted transition-all text-xs tracking-widest uppercase active:scale-95">
          Deep Archive Insight
        </Button>
      </section>

      {/* 5. World Class Matches (Dynamic Footer) */}
      <section className="pb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[17px] font-black text-foreground tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary fill-secondary" />
            Arena Legends
          </span>
          <Link href="/sentiments" className="text-[12px] font-black text-primary hover:opacity-80 transition-opacity uppercase tracking-widest">
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
                    <p className="text-[18px] font-black text-foreground group-hover:text-primary transition-all tracking-tighter truncate uppercase italic leading-tight">
                        {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-muted-foreground/40 tracking-[0.3em] uppercase">{match.homeScore}-{match.awayScore}</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Full Time</span>
                    </div>
                 </div>
              </div>
              <div className="text-right shrink-0 border-l-2 border-border/20 pl-8 h-full flex flex-col justify-center gap-1">
                  <div className="text-[18px] font-black text-emerald-500 tabular-nums leading-none">
                      {match.homeSentiment}%
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">
                      Eng Pulse
                  </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
