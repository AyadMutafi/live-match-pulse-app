'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, ChevronLeft, ChevronRight, Zap, Share2, Sparkles, X, Siren, Skull, Flame, BarChart3, SignalHigh, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClubLogo } from '@/components/ClubLogo'
import { useLanguage } from '@/context/LanguageContext'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { getPlayerImage } from '@/lib/player-images'
import { canPlayInSlot, getPositionTabCode } from '@/lib/positions'

type Player = {
  id: string; name: string; team: string; position: string; sentiment: number;
  trending: string | null; themes: string | null;
  sentiments?: { themes: string; score: number }[]
}

const getSignalInsight = (p: Player, isCrisis: boolean) => {
  const themes = p.sentiments?.[0]?.themes || p.themes || (isCrisis ? 'Error, Struggle, Pressure' : 'Elite, Form, Class');
  const themeList = themes.split(',').map(t => t.trim());
  const primaryTheme = themeList[0] || 'In Review';
  
  if (isCrisis) {
    if (p.sentiment < 25) return `DEVASTATING SIGNAL: ${p.name} is currently radiating a level of negative resonance not seen since last season. Arena metrics indicate "${primaryTheme}" is the primary driver of this 𝕏 meltdown.`;
    if (p.sentiment < 40) return `UNDER PRESSURE: The digital feeds in ${p.team} circles have turned critical. High-frequency signals of "${primaryTheme}" are flooding the colosseum.`;
    return `COLD FRONT: ${p.name}'s pulse is fading. The social atmosphere is shifting toward skepticism, with "${primaryTheme}" trending in recent extracts.`;
  } else {
    if (p.sentiment > 90) return `ARENA SOVEREIGN: ${p.name} has effectively annexed the digital landscape. Current signals for "${primaryTheme}" are hitting absolute peak saturation.`;
    if (p.sentiment > 70) return `ELITE RESONANCE: The ${p.team} fanbase is vibrating with high-energy masterclass data. "${primaryTheme}" is dominating the narrative stream.`;
    return `POSITIVE SURGE: A clear uptick in sentiment detected. ${p.name} is clearing the tactical perimeter, driven by a series of "${primaryTheme}" mentions.`;
  }
}

const getPlayerEmoji = (sentiment: number, isCrisis: boolean) => {
  if (isCrisis) {
    // Crisis players have genuinely LOW sentiment — sorted ascending from database
    if (sentiment < 15) return { emoji: '🤬', color: '#dc2626', label: 'CATASTROPHIC' }
    if (sentiment < 25) return { emoji: '😡', color: '#ef4444', label: 'CRITICAL MELTDOWN' }
    if (sentiment < 35) return { emoji: '😤', color: '#f87171', label: 'HIGH TENSION' }
    if (sentiment < 45) return { emoji: '😟', color: '#fca5a5', label: 'UNDER SCRUTINY' }
    if (sentiment < 55) return { emoji: '🫠', color: '#fecdd3', label: 'FADING PULSE' }
    return { emoji: '😐', color: '#94a3b8', label: 'LUKEWARM' }
  }
  // Elite XI logic — high sentiment = strong fan approval
  if (sentiment >= 95) return { emoji: '👑', color: '#fbbf24', label: 'GOAT STATUS' }
  if (sentiment >= 90) return { emoji: '🤩', color: '#10b981', label: 'ABSOLUTE SOVEREIGN' }
  if (sentiment >= 85) return { emoji: '🔥', color: '#34d399', label: 'ON FIRE' }
  if (sentiment >= 75) return { emoji: '⚡', color: '#6ee7b7', label: 'ELECTRIC FORM' }
  if (sentiment >= 65) return { emoji: '✨', color: '#a7f3d0', label: 'TOP SPEC' }
  return { emoji: '👍', color: '#d1fae5', label: 'SOLID' }
}

function getContextualThemes(player: Player, isCrisis: boolean): string[] {
  const baseThemes = player.sentiments?.[0]?.themes?.split(',').map(t => t.trim()).filter(Boolean)
  
  if (baseThemes && baseThemes.length > 0) {
    return baseThemes
  }
  
  // Fallback themes based on sentiment level
  if (isCrisis) {
    if (player.sentiment < 20) return ['DISASTER', 'MELTDOWN', 'CRISIS']
    if (player.sentiment < 35) return ['STRUGGLING', 'PRESSURE', 'SCRUTINY']
    if (player.sentiment < 50) return ['COLD', 'FADING', 'QUIET']
    return ['LUKEWARM', 'AVERAGE', 'FORGETTABLE']
  } else {
    if (player.sentiment >= 95) return ['GOAT', 'LEGENDARY', 'UNSTOPPABLE']
    if (player.sentiment >= 90) return ['ELITE', 'DOMINANT', 'CLASS']
    if (player.sentiment >= 80) return ['FORM', 'MAGIC', 'STAR']
    return ['SOLID', 'RELIABLE', 'GOOD']
  }
}

// Formation templates
const FORMATIONS = {
  '4-3-3': [
    { top: '10%', left: '50%', role: 'ST' },
    { top: '22%', left: '20%', role: 'LW' },
    { top: '22%', left: '80%', role: 'RW' },
    { top: '42%', left: '25%', role: 'CM' },
    { top: '40%', left: '50%', role: 'CAM' },
    { top: '42%', left: '75%', role: 'CM' },
    { top: '65%', left: '15%', role: 'LB' },
    { top: '68%', left: '38%', role: 'CB' },
    { top: '68%', left: '62%', role: 'CB' },
    { top: '65%', left: '85%', role: 'RB' },
    { top: '85%', left: '50%', role: 'GK' },
  ],
  '4-4-2': [
    { top: '12%', left: '35%', role: 'ST' },
    { top: '12%', left: '65%', role: 'ST' },
    { top: '38%', left: '15%', role: 'LM' },
    { top: '42%', left: '40%', role: 'CM' },
    { top: '42%', left: '60%', role: 'CM' },
    { top: '38%', left: '85%', role: 'RM' },
    { top: '65%', left: '15%', role: 'LB' },
    { top: '68%', left: '38%', role: 'CB' },
    { top: '68%', left: '62%', role: 'CB' },
    { top: '65%', left: '85%', role: 'RB' },
    { top: '85%', left: '50%', role: 'GK' },
  ],
  '3-5-2': [
    { top: '12%', left: '35%', role: 'ST' },
    { top: '12%', left: '65%', role: 'ST' },
    { top: '35%', left: '15%', role: 'LM' },
    { top: '42%', left: '35%', role: 'CM' },
    { top: '38%', left: '50%', role: 'CAM' },
    { top: '42%', left: '65%', role: 'CM' },
    { top: '35%', left: '85%', role: 'RM' },
    { top: '68%', left: '25%', role: 'CB' },
    { top: '72%', left: '50%', role: 'CB' },
    { top: '68%', left: '75%', role: 'CB' },
    { top: '88%', left: '50%', role: 'GK' },
  ],
  '3-4-3': [
    { top: '10%', left: '50%', role: 'ST' },
    { top: '18%', left: '25%', role: 'LW' },
    { top: '18%', left: '75%', role: 'RW' },
    { top: '42%', left: '20%', role: 'CM' },
    { top: '45%', left: '50%', role: 'CM' },
    { top: '42%', left: '80%', role: 'CM' },
    { top: '70%', left: '15%', role: 'CB' },
    { top: '72%', left: '38%', role: 'CB' },
    { top: '72%', left: '62%', role: 'CB' },
    { top: '70%', left: '85%', role: 'CB' },
    { top: '88%', left: '50%', role: 'GK' },
  ],
  '5-3-2': [
    { top: '12%', left: '35%', role: 'ST' },
    { top: '12%', left: '65%', role: 'ST' },
    { top: '42%', left: '25%', role: 'CM' },
    { top: '45%', left: '50%', role: 'CM' },
    { top: '42%', left: '75%', role: 'CM' },
    { top: '68%', left: '10%', role: 'LB' },
    { top: '70%', left: '28%', role: 'CB' },
    { top: '72%', left: '50%', role: 'CB' },
    { top: '70%', left: '72%', role: 'CB' },
    { top: '68%', left: '90%', role: 'RB' },
    { top: '88%', left: '50%', role: 'GK' },
  ]
}

function selectBestFormation(players: Player[]): keyof typeof FORMATIONS {
  const forwards = players.filter(p => p.position === 'Forward').length
  const midfielders = players.filter(p => p.position === 'Midfielder').length
  const defenders = players.filter(p => p.position === 'Defender').length
  const goalkeepers = players.filter(p => p.position === 'Goalkeeper').length

  // Must have a goalkeeper fallback
  if (goalkeepers === 0) return '4-3-3'

  // 3-5-2: Good for teams with fewer defenders, more midfielders
  if (defenders <= 3 && midfielders >= 5) return '3-5-2'
  
  // 4-4-2: Classic for balanced teams with 2 strikers
  if (forwards === 2 && defenders >= 4) return '4-4-2'
  
  // 4-3-3: Best for attacking teams with 3 forwards
  if (forwards >= 3 && defenders >= 4) return '4-3-3'
  
  // 3-4-3: Attacking with 3 defenders
  if (defenders === 3 && forwards >= 3) return '3-4-3'
  
  // 5-3-2: Defensive
  if (defenders >= 5) return '5-3-2'
  
  // Default fallback
  return '4-3-3'
}

export default function TeamOfTheWeek() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Forwards')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [mode, setMode] = useState<'elite' | 'crisis'>('elite')
  const [selectedWeek, setSelectedWeek] = useState('current')
  const { t } = useLanguage()

  // Dynamically calculate current week from season start
  const seasonStart = new Date('2024-08-16')
  const currentWeek = Math.max(1, Math.floor((Date.now() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1)

  const weeks = [
    { id: 'current', label: 'This Week' },
    { id: 'last', label: 'Last Week' },
    ...Array.from({ length: Math.min(currentWeek - 1, 8) }, (_, i) => ({
      id: `week-${currentWeek - 1 - i}`,
      label: `GW ${currentWeek - 1 - i}`
    }))
  ]

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/players?week=${selectedWeek}`)
        if (res.ok) setPlayers(await res.json())
        else setPlayers([])
      } finally {
        setLoading(false)
      }
    }
    loadPlayers()
  }, [selectedWeek])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Activity className="w-10 h-10 text-primary animate-spin" />
      <span className="text-[11px] font-black tracking-widest uppercase opacity-50">Rendering Digital Pitch...</span>
    </div>
  )

  const isCrisis = mode === 'crisis'
  const sortedPlayers = [...players].sort((a,b) => isCrisis ? a.sentiment - b.sentiment : b.sentiment - a.sentiment)
  const top11 = sortedPlayers.slice(0, 11)

  const selectedFormat = selectBestFormation(top11)

  const activeFormation = FORMATIONS[selectedFormat]

  // Filter pools by line
  const fwds = [...top11].filter(p => p.position === 'Forward')
  const mids = [...top11].filter(p => p.position === 'Midfielder')
  const defs = [...top11].filter(p => p.position === 'Defender')
  const gks = [...top11].filter(p => p.position === 'Goalkeeper')
  
  // Mixed pool for filling gaps
  const remainder = [...top11]

  // ── Pitch Logic (Strict Positions & Unique Players) ──────────────────────
  
  const usedIds = new Set<string>()

  const pitchPlayers = activeFormation.map((pos) => {
    let p: Player | null = null
    
    // 2. Find the highest-rated available player matching the position using tactical slot matching
    p = sortedPlayers.find(player => 
      canPlayInSlot(player.position, pos.role) && !usedIds.has(player.id)
    ) || null

    if (p) usedIds.add(p.id)

    return { ...pos, player: p }
  })

  // Theme data
  const themeColor = isCrisis ? '#f43f5e' : '#10b981'
  const potw = top11[0]
  const topTeams = Array.from(new Set(players.map(p => p.team))).slice(0, 5)

  return (
    <div className="px-4 py-6 space-y-6 max-w-md mx-auto min-h-screen pb-24 relative">
      
      {/* 1. Mode Toggle & Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex p-1 bg-muted/30 rounded-2xl border border-white/5 backdrop-blur-xl w-full">
            <button 
                onClick={() => setMode('elite')}
                className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${mode === 'elite' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)]' : 'text-muted-foreground hover:text-foreground'}`}
            >
                <Zap className="w-3.5 h-3.5" /> Elite XI
            </button>
            <button 
                onClick={() => setMode('crisis')}
                className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${mode === 'crisis' ? 'bg-rose-500 text-white shadow-[0_0_20px_#f43f5e80]' : 'text-muted-foreground hover:text-foreground'}`}
            >
                <Siren className="w-3.5 h-3.5" /> Crisis XI
            </button>
        </div>

        {/* Week / Matchday Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 w-full">
          {weeks.map(week => (
            <button
              key={week.id}
              onClick={() => setSelectedWeek(week.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex-shrink-0 border whitespace-nowrap ${
                selectedWeek === week.id
                  ? (isCrisis ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25' : 'bg-foreground text-background border-foreground shadow-lg')
                  : 'bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/50'
              }`}
            >
              {week.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
            <h2 className={`text-[42px] font-black tracking-tighter leading-none uppercase italic drop-shadow-2xl transition-colors duration-500 ${isCrisis ? 'text-rose-500' : 'text-foreground'}`}>
                {isCrisis ? 'Crisis Radar' : 'Pulse Elite'}
            </h2>
            <div className="flex items-center justify-center gap-2 opacity-40">
                <span className={`w-12 h-1 rounded-full ${isCrisis ? 'bg-rose-500' : 'bg-primary'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{isCrisis ? 'Flops of the Week' : 'Stars of the Week'}</span>
                <span className={`w-12 h-1 rounded-full ${isCrisis ? 'bg-rose-500' : 'bg-primary'}`}></span>
            </div>
        </div>
      </div>

      {/* 2. Pitch Arena (Premium Digital Interaction) */}
      <div className={`relative w-full rounded-[40px] overflow-hidden shadow-2xl border-4 transition-colors duration-700 ${isCrisis ? 'border-rose-950/40 bg-rose-950/20' : 'border-background bg-emerald-950/40'}`} style={{ paddingBottom: '140%' }}>
        {/* Formation Badge */}
        <div className="absolute top-4 left-4 z-30">
          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-background/80 backdrop-blur-md border border-border/50">
            {selectedFormat}
          </span>
        </div>
        
        {/* Grass texture & Digital Grid */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${isCrisis ? 'opacity-30 bg-[radial-gradient(circle_at_center,#f43f5e10_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)]'}`} />
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* SVG pitch markings */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 420" fill="none">
          <line x1="0" y1="210" x2="300" y2="210" stroke="#fff" strokeWidth="2" />
          <circle cx="150" cy="210" r="40" stroke="#fff" strokeWidth="2" />
          <circle cx="150" cy="210" r="4" fill="#fff" />
          <rect x="60" y="4" width="180" height="80" rx="4" stroke="#fff" strokeWidth="2" />
          <rect x="100" y="4" width="100" height="30" rx="4" stroke="#fff" strokeWidth="1.5" />
          <rect x="60" y="336" width="180" height="80" rx="4" stroke="#fff" strokeWidth="2" />
          <rect x="100" y="386" width="100" height="30" rx="4" stroke="#fff" strokeWidth="1.5" />
        </svg>

        {/* Player tokens */}
        {pitchPlayers.map((pos, i) => {
          const p = pos.player
          const s = p ? getPlayerEmoji(p.sentiment, isCrisis) : null

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%,-50%)', zIndex: 20 }}
            >
              <button
                onClick={() => p && setSelectedPlayer(p)}
                className={`relative flex items-center justify-center rounded-2xl font-black text-sm transition-all duration-300 ${p ? 'hover:scale-[1.25] hover:-translate-y-2 cursor-pointer' : 'cursor-default opacity-40'} bg-background/80 backdrop-blur-xl shadow-2xl border-2`}
                style={{
                  width: 52, height: 52,
                  borderColor: p && s ? s.color : 'rgba(255,255,255,0.1)',
                  boxShadow: p && s ? `0 10px 30px ${s.color}40` : 'none'
                }}
              >
                {p && s ? (() => {
                  const playerDetails = getPlayerEmoji(p.sentiment, isCrisis)
                  return (
                    <div className="relative flex items-center justify-center w-full h-full text-center">
                      {p && getPlayerImage(p.name) ? (
                        <img 
                          src={getPlayerImage(p.name)} 
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/20 z-10"
                        />
                      ) : (
                        <span className="text-[28px] leading-none drop-shadow-md z-10 transition-transform group-hover:scale-110">
                            {playerDetails.emoji}
                        </span>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-background rounded-xl p-1 border-2 border-border z-30 shadow-xl">
                        <ClubLogo club={p.team} size={20} />
                      </div>
                    </div>
                  )
                })() : (
                  <div className="flex flex-col items-center justify-center gap-1 opacity-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Scanning</span>
                  </div>
                )}
                {p && s && (
                  <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground font-black italic rounded-lg px-2 py-0.5 text-[10px] shadow-lg rotate-[-15deg] border-2 border-background">
                    {p.sentiment}
                  </div>
                )}
              </button>
              <div
                className={`mt-2 text-center px-3 py-1 rounded-xl bg-background/90 backdrop-blur-md shadow-2xl border-2 border-border/10 ${p ? 'scale-100' : 'scale-90 opacity-40'}`}
                style={{ maxWidth: 90 }}
              >
                <p className="text-[10px] font-black text-foreground leading-tight truncate uppercase tracking-tighter">
                  {p ? p.name.split(' ').pop() : pos.role}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. POTW/FOTW Hero & Data Grid */}
      {potw && (() => {
          const s = getPlayerEmoji(potw.sentiment, isCrisis)
          return (
            <section className={`glass-card overflow-hidden relative group/hero shadow-2xl transition-all duration-700 border-2 ${isCrisis ? 'border-rose-500/30' : 'border-primary/20'}`}>
                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ${isCrisis ? 'from-rose-500/10' : 'from-primary/5'} to-transparent pointer-events-none`} />
                <div className="p-5 bg-muted/40 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClubLogo club={potw.team} size={28} />
                        <span className={`text-[12px] font-black uppercase tracking-[0.25em] italic flex items-center gap-2 ${isCrisis ? 'text-rose-500' : 'text-primary'}`}>
                             {isCrisis ? <Skull className="w-4 h-4 animate-bounce" /> : <Sparkles className="w-4 h-4" />} 
                             {isCrisis ? 'Flop of the Week' : 'MVP of the Week'}
                        </span>
                    </div>
                    <ShareButton 
                        variant="glass" 
                        size="sm"
                        title={isCrisis ? `FOTW: ${potw.name}` : `POTW: ${potw.name}`}
                        text={isCrisis ? `⚠️ CRISIS DETECTED! ${potw.name} is the Flop of the Week with ${potw.sentiment}% sentiment. The arena is brutal. #FanPulse #FOTW` : `🏆 ELITE ARENA POTW! ${potw.name} is unstoppable with ${potw.sentiment}% sentiment! ⚡️ #FanPulse #POTW`}
                    />
                </div>
                <div className="p-8 flex items-center gap-8">
                    <div className="relative shrink-0">
                <div className={`w-28 h-28 bg-background rounded-[2rem] border-4 flex items-center justify-center text-6xl group-hover/hero:scale-110 transition-all duration-700 shadow-[0_0_40px_rgba(0,0,0,0.4)] ${isCrisis ? 'border-rose-500 shadow-rose-900/40' : 'border-primary shadow-primary/20'}`}>
                    {getPlayerEmoji(potw.sentiment, isCrisis).emoji}
                </div>
                        <div className={`absolute -bottom-2 -right-2 font-black italic text-[22px] px-4 py-1.5 rounded-2xl shadow-2xl border-4 border-background transition-colors duration-700 ${isCrisis ? 'bg-rose-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                            {potw.sentiment}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-foreground text-[28px] leading-tight tracking-tighter uppercase italic">{potw.name}</h3>
                        <p className="text-[13px] text-muted-foreground mt-2 font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
                            {potw.position} <span className={`w-1.5 h-1.5 rounded-full ${isCrisis ? 'bg-rose-500' : 'bg-primary'}`} /> {potw.team}
                        </p>
                        <div className="flex gap-2 mt-5">
                            {getContextualThemes(potw, isCrisis).slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] font-black px-3 py-1 bg-muted rounded-xl border border-border/50">#{tag.toUpperCase()}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
          )
      })()}

      {/* 4. Position Rankings (Interactive List) */}
      <section className={`glass-card shadow-xl overflow-hidden transition-all duration-700 border-2 ${isCrisis ? 'border-rose-500/10' : 'border-transparent'}`}>
        <div className="flex w-full divide-x divide-border border-b border-border bg-muted/20">
          {['Forwards', 'Midfielders', 'Defenders', 'Goalkeepers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab 
                  ? (isCrisis ? 'text-rose-500 bg-rose-500/5 shadow-inner' : 'text-primary bg-primary/5 shadow-inner') 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {getPositionTabCode(tab)}
            </button>
          ))}
        </div>
        
        <div className="p-4 space-y-4">
          {players.filter(p => canPlayInSlot(p.position, activeTab))
            .sort((a, b) => isCrisis ? a.sentiment - b.sentiment : b.sentiment - a.sentiment)
            .slice(0, 5)
            .map((p, idx) => {
               const s = getPlayerEmoji(p.sentiment, isCrisis)
               return (
                 <button 
                    key={p.id} 
                    onClick={() => setSelectedPlayer(p)}
                    className="flex items-center gap-4 w-full p-2 rounded-2xl hover:bg-muted/40 transition-all group/item text-left active:scale-[0.98]"
                 >
                   <div className="w-8 text-center text-[16px] font-black text-muted-foreground/30 italic group-hover/item:text-primary transition-colors">{idx + 1}</div>
                   <div className="w-10 h-10 rounded-xl bg-background border-2 border-border/50 flex items-center justify-center text-xl shadow-xl group-hover/item:scale-110 transition-transform" style={{ borderColor: s.color }}>{s.emoji}</div>
                   <div className="flex-1 min-w-0">
                     <p className="text-[15px] font-black text-foreground truncate leading-none uppercase tracking-tight">{p.name}</p>
                     <p className="text-[11px] font-bold text-muted-foreground truncate mt-1 opacity-70 uppercase tracking-widest leading-none">{p.team}</p>
                   </div>
                   <div className="text-[18px] font-black tabular-nums italic" style={{ color: s.color }}>{p.sentiment}</div>
                 </button>
               )
            })}
        </div>
      </section>

      {/* Honorable Mentions - Players ranked 12-18 */}
      <section className="glass-card shadow-xl overflow-hidden border border-border/50">
        <div className="p-4 border-b border-border bg-muted/20">
          <h4 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
            <Star className="w-4 h-4 text-secondary" />
            Honorable Mentions
          </h4>
          <p className="text-[10px] text-muted-foreground mt-1">Just missed the XI</p>
        </div>
        
        <div className="p-3 flex gap-3 overflow-x-auto scrollbar-none">
          {sortedPlayers.slice(11, 18).map(p => {
            const s = getPlayerEmoji(p.sentiment, isCrisis)
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all group border border-transparent hover:border-primary/20"
              >
                <div 
                  className="w-12 h-12 rounded-xl bg-background border-2 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform"
                  style={{ borderColor: s.color }}
                >
                  {s.emoji}
                </div>
                <div className="text-center min-w-[60px]">
                  <p className="text-[11px] font-black text-foreground truncate uppercase tracking-tight">
                    {p.name.split(' ').pop()}
                  </p>
                  <p className="text-[10px] font-black tabular-nums" style={{ color: s.color }}>
                    {p.sentiment}%
                  </p>
                </div>
                <ClubLogo club={p.team} size={20} />
              </button>
            )
          })}
        </div>
      </section>

      {/* 5. Sentiment Detail Modal (Interactivity Audit) */}
      <AnimatePresence>
        {selectedPlayer && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
                onClick={() => setSelectedPlayer(null)} 
              />
              
              <motion.div 
                  initial={{ y: 100, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 100, opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`relative w-full max-w-sm glass-card shadow-[0_0_100px_rgba(var(--primary),0.1)] overflow-hidden border-t-8 z-10 max-h-[90vh] flex flex-col`}
                  style={{ 
                    borderColor: isCrisis ? '#f43f5e' : getPlayerEmoji(selectedPlayer.sentiment, isCrisis).color,
                    boxShadow: isCrisis ? '0 0 100px rgba(244, 63, 94, 0.1)' : undefined
                  }}
              >
                  <button 
                      onClick={() => setSelectedPlayer(null)}
                      className="absolute top-4 right-4 p-2 bg-muted/80 backdrop-blur-md rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors z-30 border border-white/5 shadow-lg"
                  >
                      <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col items-center text-center custom-scrollbar overflow-x-hidden">
                      <div className="relative mb-2">
                          <div className={`w-14 h-14 bg-background rounded-2xl border-4 flex items-center justify-center text-3xl shadow-2xl ${isCrisis ? 'border-rose-500' : 'border-primary'}`}>
                               {getPlayerEmoji(selectedPlayer.sentiment, isCrisis).emoji}
                          </div>
                          <ClubLogo club={selectedPlayer.team} size={24} className="absolute -bottom-1 -right-2 bg-background p-1 rounded-lg border border-border shadow-xl" />
                      </div>
                      
                      <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic leading-none mb-0.5">{selectedPlayer.name}</h3>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${isCrisis ? 'text-rose-500' : 'text-primary'}`}>
                        {selectedPlayer.team} · PULSE ELITE
                      </p>
                      
                      <div className="w-full grid grid-cols-2 gap-2 mb-2 px-1">
                          <div className="p-2.5 bg-muted/30 rounded-xl border border-border/50 text-left relative overflow-hidden group/sentv">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-0.5">Sentiment</span>
                              <span className="text-[1.3rem] font-black tabular-nums italic relative z-10 leading-none" style={{ color: isCrisis ? '#f43f5e' : getPlayerEmoji(selectedPlayer.sentiment, isCrisis).color }}>
                                  {selectedPlayer.sentiment}%
                              </span>
                          </div>

                          <div className="p-2.5 bg-muted/30 rounded-xl border border-border/50 text-left overflow-hidden relative group/atmo text-[9px]">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Stability</span>
                              <div className="flex gap-0.5 mb-1 h-1 w-full max-w-[60px]">
                                 {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`flex-1 rounded-full ${i <= (selectedPlayer.sentiment / 20) ? (isCrisis ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]') : 'bg-muted/30'}`} />
                                 ))}
                              </div>
                              <span className={`font-black italic uppercase leading-none truncate block ${isCrisis ? 'text-rose-500' : 'text-foreground'}`}>
                                {getPlayerEmoji(selectedPlayer.sentiment, isCrisis).label}
                              </span>
                          </div>
                      </div>

                      {/* 5.5. Dual-Pulse Intelligence Source Mix (Reddit + X.com) — ULTRA COMPACT */}
                      <div className="w-full mb-2 pt-2 mt-1 border-t border-white/5 text-left">
                         <div className="flex items-center justify-between mb-1.5 px-1">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 italic">Intelligence Source Mix</h4>
                            <div className="flex items-center gap-1 opacity-60">
                               <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                               <span className="text-[7px] font-black uppercase text-primary tracking-widest">Verified</span>
                            </div>
                         </div>
                         
                         <div className="grid gap-1.5">
                            {['REDDIT', 'X'].map((source) => {
                               const sourceData = selectedPlayer.sentiments?.find((s: any) => s.source === source);
                               
                               // Use real score from database for this specific source, or fall back to main sentiment
                               const val = sourceData?.score ?? selectedPlayer.sentiment;
                               
                               // Use real theme from database for this specific source, or use a default
                               const theme = sourceData?.themes?.split(',')[0] || (source === 'X' ? 'Momentum Feedback' : 'Tactical Consensus');
                               
                               return (
                                  <div key={source} className="bg-card/60 backdrop-blur-md rounded-xl p-2.5 px-3 border border-white/10 relative overflow-hidden group/source shadow-lg">
                                     <div className="flex items-center justify-between gap-4 mb-2">
                                        <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{source === 'X' ? '𝕏 SIGNAL' : 'REDDIT SCORE'}</span>
                                        <span className="font-black text-[16px] italic leading-none tabular-nums text-foreground">{val}%</span>
                                     </div>
                                     
                                     <div className="space-y-1.5 pt-1 border-t border-white/5">
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5 mt-2">
                                           <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${val}%` }}
                                             transition={{ type: "spring", damping: 30, stiffness: 90 }}
                                             className={`h-full ${isCrisis ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]'}`} 
                                           />
                                        </div>
                                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                                            <span className="text-[8px] font-bold text-muted-foreground/60 italic leading-none truncate">{theme}</span>
                                            <Zap className={`w-2 h-2 shrink-0 ${isCrisis ? 'text-rose-400' : 'text-primary'}`} />
                                         </div>
                                     </div>
                                  </div>
                               )
                            })}
                         </div>
                      </div>
  
                      <div className="w-full mb-2">
                        <div className="relative p-2.5 rounded-xl bg-background/40 border border-border/50 text-left overflow-hidden">
                            <div className="flex items-center gap-2 mb-1.5">
                                <SignalHigh className={`w-2.5 h-2.5 ${isCrisis ? 'text-rose-500' : 'text-emerald-500'}`} />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Digital Signal</span>
                            </div>

                            <p className="text-[10px] font-bold text-foreground leading-tight italic line-clamp-2">
                                {getSignalInsight(selectedPlayer, isCrisis)}
                            </p>
                        </div>
                      </div>

                      <Button 
                        variant={isCrisis ? 'destructive' : 'glow'} 
                        className={`w-full h-9 text-[12px] font-black tracking-widest rounded-lg ${isCrisis ? 'bg-rose-500 shadow-lg' : 'shadow-lg'}`} 
                        onClick={() => setSelectedPlayer(null)}
                      >
                          {isCrisis ? 'EXIT' : 'DONE'}
                      </Button>
                  </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="h-4" />
    </div>
  )
}
