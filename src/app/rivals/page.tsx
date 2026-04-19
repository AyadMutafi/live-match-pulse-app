"use client"

import { useState, useEffect } from 'react'
import { Swords, Activity, TrendingUp, Thermometer, Zap } from 'lucide-react'
import { ClubLogo } from '@/components/ClubLogo'
import { useLanguage } from '@/context/LanguageContext'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'

// ── Types ────────────────────────────────────────────────────────────────────

type Match = {
  id: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number;
  status: string; league: string; date: string; homeSentiment: number; awaySentiment: number;
  events: string | null;
}

// ── Constants & Helpers ──────────────────────────────────────────────────────

const LEAGUE_COLORS: Record<string, string> = {
  'La Liga': '#fbbf24',
  'Premier League': '#bd9dff',
  'Champions League': '#d946ef',
}

function generateDeepAnalysis(match: Match) {
  const diff = Math.abs(match.homeSentiment - match.awaySentiment);
  const isHomeDominant = match.homeSentiment > match.awaySentiment;
  const dominantTeam = isHomeDominant ? match.homeTeam : match.awayTeam;
  const weakerTeam = isHomeDominant ? match.awayTeam : match.homeTeam;
  const totalHeat = Math.floor(match.homeSentiment * 0.6 + match.awaySentiment * 0.4);

  if (diff < 10) {
    return `ARENA STATUS: TENSE POLARIZATION (${totalHeat}%). The fans are locked in a digital stalemate. Neither ${match.homeTeam} nor ${match.awayTeam} has established a linguistic perimeter. We are seeing high-frequency signals of mutual respect masking extreme underlying anxiety. A classic "Cold War" of words.`;
  }

  if (diff < 30) {
    return `MARCH STATUS: STRATEGIC SHIFT (${totalHeat}%). ${dominantTeam} has successfully seized the narrative high-ground. Their fan-mentions are surfacing with 2.4x the intensity of ${weakerTeam}. While NOT a total rout, ${weakerTeam} fans are currently operating in "Defensive Denial" mode, waiting for a catalyst to breach the Arena's sentiment wall.`;
  }

  return `ARENA STATUS: ABSOLUTE DOMINANCE (${totalHeat}%). The High-Fire Arena has identified a clear sovereign. ${dominantTeam} is currently flooding the 𝕏 intelligence streams with overwhelming positive resonance. The ${weakerTeam} fanbase is effectively silenced; their digital footprints are retreating as the "Arena Mastery" tag hits critical mass. A complete psychological annexation.`;
}

// ── Fan War Card ─────────────────────────────────────────────────────────────

function FanWarCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false)
  const isLive = match.status === 'live'
  const accentColor = LEAGUE_COLORS[match.league] || '#3b82f6'

  return (
    <div 
      className="glass-card overflow-hidden relative shadow-xl transition-all duration-500 hover:border-orange-500/30 group"
      style={{ borderLeft: `6px solid ${accentColor}` }}
    >
      {/* Background glow based on league accent color */}
      <div 
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-30"
        style={{ background: accentColor }}
      />
      
      {/* Header — FIXED OVERLAP via Grid */}
      <div className="grid grid-cols-[1fr,auto] gap-x-4 items-start px-5 pt-5 pb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20 text-sm">⚔️</div>
          <h3 className="font-black text-foreground text-[14px] leading-tight tracking-tight uppercase italic mt-0.5 truncate">
            {match.league} Pulse
          </h3>
        </div>
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border bg-red-500/10 border-red-500/20 text-red-500 shadow-sm shrink-0"
        >
          <Thermometer className="w-3.5 h-3.5 fill-current" />
          {Math.floor(match.homeSentiment * 0.6 + match.awaySentiment * 0.4)}% HEAT
        </div>
      </div>
      
      {/* Data Status Indicator */}
      <div className="px-5 pb-5">
        <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${isLive ? 'text-emerald-500' : 'text-muted-foreground/60'}`}>
          {isLive ? (
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          ) : '🏟️'}
          {isLive ? 'LIVE BATTLE DATA' : 'Awaiting Matchday Pulse'}
        </span>
      </div>

      {/* Club name row */}
      <div className="flex items-center justify-between px-6 pb-4 relative z-10">
        <div className="flex flex-col items-center gap-2 w-[40%] group/club">
          <div className="p-2 rounded-full border-2 border-transparent group-hover/club:border-orange-500/20 group-hover/club:bg-orange-500/5 transition-all">
            <ClubLogo club={match.homeTeam} size={56} />
          </div>
          <span className="font-black text-foreground text-[14px] tracking-tighter text-center uppercase break-words px-1 leading-tight">{match.homeTeam}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center w-[20%]">
          <span className="text-muted-foreground/30 font-black text-[32px] italic tracking-tighter select-none">VS</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 w-[40%] group/club">
          <div className="p-2 rounded-full border-2 border-transparent group-hover/club:border-orange-500/20 group-hover/club:bg-orange-500/5 transition-all">
            <ClubLogo club={match.awayTeam} size={56} />
          </div>
          <span className="font-black text-foreground text-[14px] tracking-tighter text-center uppercase break-words px-1 leading-tight">{match.awayTeam}</span>
        </div>
      </div>

      {/* War bar */}
      <div className="px-6 pb-6">
        <div className="flex rounded-2xl overflow-hidden h-[34px] border border-border/50 shadow-2xl bg-muted/10 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div className="w-1 h-full bg-white/20 blur-[1px]" />
          </div>
          
          {/* Left bar */}
          <div
            className="flex items-center justify-center text-[13px] font-black text-white transition-all duration-1000 ease-out relative z-10"
            style={{
              width: `${match.homeSentiment}%`,
              background: `linear-gradient(90deg, #1e1b4b, #4338ca)`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {match.homeSentiment}%
          </div>
          
          {/* Right bar */}
          <div
            className="flex items-center justify-center text-[13px] font-black text-white flex-1 transition-all duration-1000 ease-out relative z-10"
            style={{
              background: `linear-gradient(270deg, #dc2626, #f97316)`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {match.awaySentiment}%
          </div>
        </div>

        {/* Fan counts */}
        <div className="flex justify-between mt-3 text-[11px] uppercase font-black tracking-widest text-muted-foreground opacity-60 px-1">
          <span>Pulse: {match.homeSentiment > 50 ? 'Dominant' : 'Fading'}</span>
          <span>Pulse: {match.awaySentiment > 50 ? 'Strong' : 'Weak'}</span>
        </div>
      </div>

      {/* Expand & Share Actions (Standardized Buttons) */}
      <div className="px-5 pb-5 flex items-center gap-3">
        <ShareButton 
          variant="gold"
          size="sm"
          label="RALLY THE FANS"
          className="flex-1 h-11 shadow-lg"
          title={`Fan War: ${match.homeTeam} vs ${match.awayTeam}`}
          text={`⚔️ FAN WAR ALERT! ${match.homeTeam} fans at ${match.homeSentiment}% sentiment vs ${match.awayTeam} at ${match.awaySentiment}%! Join the Pulse on 𝕏! 🏟️ #FanWar #FanPulse`}
        />
        <Button
          variant="outline"
          onClick={() => setExpanded(v => !v)}
          className="flex-1 h-11 text-[11px] font-black border-orange-500/20 hover:bg-orange-500/10 active:scale-95 transition-all gap-2"
        >
          <Zap className={`w-4 h-4 ${expanded ? 'fill-orange-500 text-orange-500' : 'text-orange-500'}`} />
          {expanded ? 'Hide' : 'Enter'} Strategic Intel
        </Button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-4 mx-5 mb-5 rounded-[2rem] border border-orange-500/20 bg-orange-500/5 ring-4 ring-orange-500/5 shadow-inner animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-black text-[12px] uppercase tracking-[0.2em] block italic">Battlefront Tactical</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-widest">
                LIVE INTEL
            </div>
          </div>
          <p className="text-[13px] text-foreground/90 leading-relaxed font-bold italic whitespace-pre-line border-l-4 border-orange-500/40 pl-4 py-1">
            "{generateDeepAnalysis(match)}"
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function RivalsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await fetch('/api/matches')
        if (res.ok) {
          const data = await res.json()
          setMatches(data.matches || [])
        }
      } catch (e) {
        console.error('Failed to load rivals', e)
      } finally {
        setLoading(false)
      }
    }
    loadMatches()
  }, [])

  return (
    <div className="px-4 md:px-8 py-5 md:py-8 space-y-6 max-w-md md:max-w-full mx-auto min-h-screen pb-32 md:pb-12">
      
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-[32px] font-black text-foreground tracking-tighter leading-none uppercase italic border-b-4 border-primary inline-block mb-3">
          {t('rivals.title')}
        </h2>
        <p className="text-[13px] text-muted-foreground font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-tight opacity-70">
          {t('rivals.desc')}
        </p>
      </div>

      {/* Tip Banner */}
      <div className="glass-card rounded-2xl p-5 flex items-start gap-4 shadow-2xl bg-gradient-to-r from-primary/10 to-transparent border-primary/20 relative overflow-hidden group">
        <TrendingUp className="w-6 h-6 text-primary shrink-0 group-hover:scale-125 transition-transform" />
        <p className="text-[12px] text-foreground leading-tight font-black uppercase tracking-tight">
          Fan Wars are updated live via <span className="text-primary italic">Firecrawl Smart-Search</span> on 𝕏. Stand your ground.
        </p>
      </div>

      {/* Rivalry cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Activity className="w-8 h-8 text-primary animate-spin" />
            <span className="text-[11px] font-black tracking-widest uppercase opacity-50">Calibrating Arena...</span>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl opacity-50 md:col-span-full">
            <Swords className="w-10 h-10 mx-auto mb-3" />
            <p className="text-[13px] font-black tracking-widest uppercase italic">No Battles Found</p>
          </div>
        ) : (
          matches.map(m => <FanWarCard key={m.id} match={m} />)
        )}
      </div>

      <div className="h-4"></div>
    </div>
  )
}
