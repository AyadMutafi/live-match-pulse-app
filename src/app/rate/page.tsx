'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown, Minus, MessageCircle, ChevronRight, Zap, Sparkles, Heart, AlertCircle } from 'lucide-react'
import { getSentimentEmoji, getSentimentBarColor } from '@/lib/sentiment'
import { ClubLogo } from '@/components/ClubLogo'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'

type Player = {
  id: string; name: string; team: string; position: string;
  sentiment: number; tweets: number; aiConfidence: number; form: string;
  themes: string | null;
}

const positionBorder: Record<string, string> = {
  Forward: '#ec4899',
  Midfielder: '#8b5cf6',
  Defender: '#3b82f6',
  Goalkeeper: '#22c55e',
}

const positionGradient: Record<string, string> = {
  Forward: 'from-pink-500/20 to-transparent',
  Midfielder: 'from-purple-500/20 to-transparent',
  Defender: 'from-blue-500/20 to-transparent',
  Goalkeeper: 'from-emerald-500/20 to-transparent',
}

export default function PlayerRatings() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const loadData = async () => {
        try {
            const res = await fetch('/api/players')
            if (res.ok) setPlayers(await res.json())
        } finally {
            setLoading(false)
        }
    }
    loadData()
  }, [])

  const handleVote = (emoji: string) => {
    setSelectedEmoji(emoji)
    setVoted(true)
    setTimeout(() => setVoted(false), 2000)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Activity className="w-10 h-10 text-primary animate-spin" />
      <span className="text-[11px] font-black tracking-widest uppercase opacity-50">Syncing Arena Ratings...</span>
    </div>
  )

  const livePlayer = players.find(p => p.name.includes('Vinícius')) || players[0]

  return (
    <div className="px-4 py-6 space-y-6 max-w-md mx-auto min-h-screen pb-24 relative">
      
      {/* 1. Header with Aesthetic Glow — TIGHTENED */}
      <div className="text-center pb-4 pt-2 relative z-10 flex flex-col items-center">
        <h2 className="text-[34px] font-black text-foreground tracking-tighter leading-[1.1] uppercase italic border-b-4 border-secondary/20 inline-block mb-4 pb-1">
          {t('ratings.title')}
        </h2>
        <div className="flex items-center justify-center gap-2 max-w-[280px] mx-auto">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse shrink-0" />
            <p className="text-[12px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed opacity-80">
              {t('ratings.desc')}
            </p>
        </div>
      </div>

      {/* 2. Quick Action Entry Points (Standardized Buttons) — NOW FUNCTIONAL */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="glass" 
          onClick={() => {
            const el = document.getElementById('live-analysis');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-start gap-1 p-5 h-auto w-full group relative overflow-hidden active:scale-95 text-left rounded-2xl"
        >
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all"></div>
          <span className="text-2xl mb-1 drop-shadow-lg group-hover:scale-110 transition-transform origin-bottom-left">⚽</span>
          <span className="text-[13px] font-black text-foreground tracking-tighter uppercase leading-[1.2]">Matchday<br/>Report</span>
          <span className="text-[9px] text-muted-foreground font-black mt-2 opacity-50 tracking-widest flex items-center gap-1">
             <Activity className="w-3 h-3" /> ANALYZE
          </span>
        </Button>
        <Button 
          variant="glass" 
          onClick={() => {
            const el = document.getElementById('energy-transmit');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-start gap-1 p-5 h-auto w-full group relative overflow-hidden active:scale-95 text-left rounded-2xl"
        >
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-secondary/20 blur-2xl group-hover:bg-secondary/30 transition-all"></div>
          <span className="text-2xl mb-1 drop-shadow-lg group-hover:scale-110 transition-transform origin-bottom-left">⚡</span>
          <span className="text-[13px] font-black text-foreground tracking-tighter uppercase leading-[1.2]">Instant<br/>Feedback</span>
          <span className="text-[9px] text-muted-foreground font-black mt-2 opacity-50 tracking-widest flex items-center gap-1">
             <Zap className="w-3 h-3" /> FAST
          </span>
        </Button>
      </div>

      {/* 3. Live Match Focus (UI Audit Fix) */}
      {livePlayer && (
        <section id="live-analysis" className="glass-card overflow-hidden mt-2 relative border-primary/20 shadow-2xl bg-gradient-to-br from-card/80 to-muted/20 scroll-mt-4">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary/20 animate-pulse"></div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">LIVE ACTION</span>
                    </div>
                    <span className="text-[11px] font-black italic text-foreground flex items-center gap-2">
                        {livePlayer.name} <Sparkles className="w-3 h-3 text-secondary" />
                    </span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center gap-2 w-1/3 group">
                        <ClubLogo club={livePlayer.team} size={56} className="drop-shadow-2xl group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest opacity-60">HOME UNIT</span>
                    </div>
                    <div className="text-center w-1/3">
                        <span className="text-[34px] font-black text-foreground italic tracking-tighter drop-shadow-lg">3-1</span>
                        <div className="h-1 w-12 bg-primary/20 rounded-full mx-auto mt-1" />
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3 group opacity-50">
                        <ClubLogo club={livePlayer.team === 'Real Madrid' ? 'Barcelona' : 'Arsenal'} size={56} className="grayscale" />
                        <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">RIVAL UNIT</span>
                    </div>
                </div>

                <div id="energy-transmit" className="text-center mb-4 scroll-mt-4">
                    <span className="text-[10px] text-primary uppercase font-black tracking-widest italic border-b border-primary/20 pb-0.5">Transmit Your Energy</span>
                </div>

                {/* Emoji Tap Grid (Premium Interaction) */}
                <div className="grid grid-cols-3 gap-2.5 mb-4 relative">
                    {['🔥', '😍', '😊', '🤔', '😢', '😡'].map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => handleVote(emoji)}
                        className={`flex items-center justify-center p-3 rounded-[20px] text-[28px] transition-all duration-300 bg-background border-2 border-border/50 hover:scale-[1.1] hover:-translate-y-1 hover:shadow-xl active:scale-90 ${
                        selectedEmoji === emoji ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.3)]' : ''
                        }`}
                    >
                        {emoji}
                    </button>
                    ))}
                    {voted && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in fade-in duration-300">
                             <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-black italic text-sm shadow-2xl border-4 border-background">ARENA SYNCED!</div>
                        </div>
                    )}
                </div>

                <div className="bg-muted/30 rounded-2xl p-3.5 border border-border/50 shadow-inner">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Live Feed Fragments</span>
                        <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-[13px] bg-background/40 p-2 rounded-xl border border-border/10">
                            <span className="text-primary font-black w-7 text-right">65'</span>
                            <span className="text-foreground font-semibold">"Elite drive, narrow miss!"</span>
                            <span className="text-lg leading-none ml-auto">😩</span>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] bg-background/40 p-2 rounded-xl border border-border/10">
                            <span className="text-emerald-500 font-black w-7 text-right">55'</span>
                            <span className="text-foreground font-semibold">"Key vision, created clear."</span>
                            <span className="text-lg leading-none ml-auto">🎯</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* 4. Top Rated Players (Dynamic List) */}
      <h3 className="text-[20px] font-black text-foreground tracking-tighter uppercase italic px-1 pt-4">Global Power Ranks</h3>

      <div className="space-y-4">
        {players.sort((a,b) => b.sentiment - a.sentiment).map((player, idx) => {
          const s = getSentimentEmoji(player.sentiment)
          const posBorder = positionBorder[player.position] || '#6366f1'
          const gradClass = positionGradient[player.position] || 'from-primary/10 to-transparent'
          
          return (
            <div key={player.id} className="glass-card overflow-hidden group shadow-2xl hover:border-primary/30 transition-all border-l-[6px] relative" style={{ borderLeftColor: posBorder }}>
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 p-4 relative z-10">
                {/* 1. Rank Indicator */}
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-muted/20 border border-border/10 italic">
                   <span className="text-muted-foreground/30 font-black text-[20px] group-hover:text-primary transition-colors">{idx + 1}</span>
                </div>

                {/* 2. Avatar with Logo Overlay */}
                <div className="relative shrink-0">
                  <div
                    className={`rounded-[30%] flex items-center justify-center font-black text-xl bg-gradient-to-br ${gradClass} border-2 shadow-inner`}
                    style={{ width: 62, height: 62, borderColor: `${posBorder}40` }}
                  >
                    {player.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-lg p-1 border border-border shadow-xl">
                    <ClubLogo club={player.team} size={20} />
                  </div>
                </div>

                {/* 3. Info Block - prioritizes name display */}
                <div className="flex-1 min-w-0 pr-2 py-0.5">
                  <h4 className="font-black text-foreground text-[16px] leading-tight mb-2 truncate uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {player.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md bg-muted/40 border border-border/10 whitespace-nowrap" style={{ color: posBorder }}>
                      {player.position}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/20 shrink-0" />
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none truncate">
                      {player.team}
                    </span>
                  </div>
                </div>

                {/* 4. Score Badge - compact & elevated */}
                <div className="shrink-0 flex flex-col items-center justify-center bg-card-secondary/20 p-2.5 px-3 rounded-[1.25rem] border border-border/40 shadow-xl group-hover:border-primary/20 transition-all bg-background/40">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[24px] font-black leading-none italic" style={{ color: s.color }}>{player.sentiment}</span>
                  </div>
                  <span className="text-[14px] mt-1 leading-none drop-shadow-sm">{s.emoji}</span>
                </div>
              </div>

              {/* Sentiment Progress (Modernized) */}
              <div className="px-5 pb-4">
                <div className="h-3 w-full bg-muted/20 rounded-full overflow-hidden border border-border/10 shadow-inner group-hover:bg-muted/40 transition-colors">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${player.sentiment}%`, background: `linear-gradient(90deg, ${posBorder}88, ${posBorder})`, boxShadow: `0 0 15px ${posBorder}40` }} 
                  >
                      <div className="absolute inset-x-0 top-0 h-[40%] bg-white/10 blur-[1px]" />
                  </div>
                </div>
              </div>

              {/* Form & Engagement Stats */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/10 bg-muted/10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Live Pulse</span>
                  <div className="flex gap-1.5">
                    {Array.from(player.form).slice(0, 5).map((ch, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${ch === 'W' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ch === 'L' ? 'bg-red-500' : 'bg-amber-500'} shadow-sm animate-pulse`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-black text-foreground/70 uppercase italic tracking-tighter">
                   <div className="flex items-center gap-1 group/stat">
                        <MessageCircle className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                        <span>{player.tweets > 1000 ? `${(player.tweets/1000).toFixed(1)}k` : player.tweets} Mentions</span>
                   </div>
                </div>
              </div>

              {/* Dynamic Themes Fragment */}
              {player.themes && (
                <div className="px-5 pb-5 pt-2 flex flex-wrap gap-2">
                    {player.themes.split(',').map(theme => (
                        <span key={theme} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-background shadow-sm rounded-lg border border-border/50 text-muted-foreground/80 hover:text-primary hover:border-primary/20 transition-colors">
                            #{theme.trim()}
                        </span>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Bottom Engagement Hub (Electric Arena Style) */}
      <div className="grid grid-cols-2 gap-4 mt-8 pb-10">
        <Button variant="glow" className="h-16 flex flex-col items-center justify-center gap-1 rounded-3xl group active:scale-95">
          <span className="text-2xl mb-1 group-hover:rotate-12 transition-transform">🏆</span>
          <span className="text-[12px] font-black tracking-widest uppercase">Arena Awards</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-1 rounded-3xl border-border hover:bg-muted group active:scale-95">
          <span className="text-2xl mb-1 group-hover:-rotate-12 transition-transform">⚔️</span>
          <span className="text-[12px] font-black tracking-widest uppercase">Fan Showdown</span>
        </Button>
      </div>
      
      <div className="h-4" />
    </div>
  )
}
