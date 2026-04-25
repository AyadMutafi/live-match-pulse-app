'use client'

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Activity, ChevronDown, ChevronRight, Zap, CalendarDays } from 'lucide-react'
import { ClubLogo } from '@/components/ClubLogo'
import { useLanguage } from '@/context/LanguageContext'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { CLUBS, findClub } from '@/lib/clubs'

// ── Constants ──────────────────────────────────────────────────
const CORE_CLUBS = CLUBS.map(c => c.name).concat(
  'Man City', 'Man United', 'FC Barcelona', 'Real Madrid',
  'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City',
  'Manchester United'
)

type Match = {
  id: string
  date: string
  round: string   // synthesised client-side (not in DB schema)
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  league: string
  homeSentiment: number
  awaySentiment: number
  psycheJSON?: string | null
}

const NOW = new Date()

// ── Helpers ────────────────────────────────────────────────────
const getTeamLabel = (name: string): string => {
  const club = findClub(name)
  if (club) return club.shortName
  const clean = name
    .replace(/\s(FC|CF|RC|UD|AFC|Utd|United|Club)$/i, '')
    .trim()
  const parts = clean.split(' ')
  return parts.length <= 2 ? clean : parts.slice(-1)[0]
}

function deterministicHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h)
}

function getLifecycleState(dateStr: string, hasScore: boolean) {
  const diff = (new Date(dateStr).getTime() - NOW.getTime()) / 864e5
  if (diff > 2) return { state: 'FUTURE', label: 'AWAITING', color: '#64748b', bg: 'bg-muted/10', border: 'border-border' }
  if (diff > 0) return { state: 'PRE_MATCH', label: 'PRE-MATCH HYPE', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  if (diff > -1 && !hasScore) return { state: 'LIVE', label: 'LIVE PULSE', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  return { state: 'ARCHIVED', label: 'FINAL', color: '#64748b', bg: 'bg-muted/10', border: 'border-border/50' }
}

// ── Sub-components ─────────────────────────────────────────────
function SentimentBar({ label, score, color, secondary }: { label: string; score: number; color: string; secondary: string }) {
  const emoji = score >= 75 ? '🤩' : score >= 50 ? '😐' : '😤'
  return (
    <div className="flex-1 group/bar">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-1.5 bg-background/50 px-2 py-0.5 rounded-full border border-border/50">
          <span className="text-[11px] font-black" style={{ color }}>{score}%</span>
          <span className="text-xs">{emoji}</span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/10 shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${secondary}, ${color})`, boxShadow: `0 0 12px ${color}40` }}
        >
          <div className="absolute inset-0 bg-white/10 blur-[1px] h-[50%]" />
        </div>
      </div>
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false)
  const lifecycle = getLifecycleState(match.date, match.homeScore !== null)
  
  const homeSentiment = match.homeSentiment || 50
  const awaySentiment = match.awaySentiment || 50

  const home = getTeamLabel(match.homeTeam)
  const away = getTeamLabel(match.awayTeam)

  // ── Parse real Psyche JSON from Scraper ──
  const realPsyche = useMemo(() => {
    if (!match.psycheJSON) return null
    try {
      return JSON.parse(match.psycheJSON)
    } catch (e) {
      return null
    }
  }, [match.psycheJSON])

  const psycheContent = useMemo(() => {
    if (realPsyche) {
      const isPreMatch = lifecycle.state === 'PRE_MATCH' || lifecycle.state === 'FUTURE'
      const data = isPreMatch ? realPsyche.preMatch : realPsyche.postMatch

      if (isPreMatch && data) {
        return {
          headline: `⏳ PRE-MATCH — ${home} vs ${away}`,
          mode: 'pre' as const,
          sections: [
            { icon: '🏋️', label: 'Preparation & Setup',    items: data.preparation || [] },
            { icon: '🔊', label: 'Fan Atmosphere',          items: data.atmosphere  || [] },
            { icon: '📰', label: 'What the Media is Saying', items: data.media      || [] },
            { icon: '⭐', label: 'Players to Watch',        items: data.players     || [] },
          ]
        }
      }

      if (!isPreMatch && data) {
        return {
          headline: `📋 POST-MATCH VERDICT`,
          mode: 'post' as const,
          sections: [
            { icon: '🎯', label: 'The Result',                items: data.outcome      || [] },
            { icon: '📊', label: 'How They Played',           items: data.performance  || [] },
            { icon: '💬', label: 'Fan Reactions',             items: data.supporters   || [] },
            { icon: '📣', label: 'Media & Expert Takes',      items: data.media        || [] },
          ]
        }
      }
    }

    // Fallback while scraper runs
    return {
      headline: '🧠 ARENA PSYCHE — Analysing...',
      mode: 'pre' as const,
      sections: [
        { icon: '⚡', label: 'Status', items: ['Sentiment scan running. Check back soon — insights incoming.'] }
      ]
    }
  }, [realPsyche, lifecycle.state, home, away])

  return (
    <div className={`group/card relative rounded-[32px] border border-border/50 bg-background/40 backdrop-blur-md hover:bg-background/60 transition-all duration-500 shadow-xl overflow-hidden ${expanded ? 'ring-2 ring-primary/20' : ''}`}>
      {/* League badge */}
      <div className="absolute top-5 left-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/30 border border-border/40 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
            {match.league.includes('Premier') ? 'PL' : match.league.includes('La Liga') ? 'LL' : 'CUP'}
          </span>
        </div>
      </div>

      {/* Lifecycle label + expand toggle */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="mt-7">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg italic"
            style={{ background: `${lifecycle.color}18`, color: lifecycle.color, border: `1px solid ${lifecycle.color}30` }}
          >
            {lifecycle.label}
          </span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-muted-foreground/40 hover:text-foreground transition-all p-2 hover:bg-muted/50 rounded-full"
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Teams + Score */}
      <div className="grid grid-cols-3 items-center px-5 pb-5 pt-1">
        <div className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
          <ClubLogo club={match.homeTeam} size={52} />
          <p className="text-[12px] font-black text-foreground text-center leading-none uppercase tracking-tight truncate w-full">
            {home}
          </p>
        </div>

        <div className="flex flex-col items-center">
          {match.homeScore === null ? (
            <div className="flex flex-col items-center opacity-40">
              <span className="text-[22px] font-black text-muted-foreground tracking-tighter italic">VS</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 opacity-60 bg-muted px-2 py-[2px] rounded-sm">
                {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-black text-foreground drop-shadow-md text-[36px] tracking-tighter leading-none">
                {match.homeScore}<span className="text-muted-foreground/30 px-1 opacity-50">-</span>{match.awayScore}
              </span>
              <div className="mt-2 h-1 w-8 bg-primary/20 rounded-full" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
          <ClubLogo club={match.awayTeam} size={52} />
          <p className="text-[12px] font-black text-foreground text-center leading-none uppercase tracking-tight truncate w-full">
            {away}
          </p>
        </div>
      </div>

      {/* Sentiment bars */}
      {lifecycle.state !== 'FUTURE' && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-b from-muted/30 to-background/50 border border-border/50 shadow-inner">
          <div className="flex items-center gap-5">
            <SentimentBar
              label={home}
              score={homeSentiment}
              color={homeSentiment >= 60 ? '#48e5d0' : '#ff6e84'}
              secondary={homeSentiment >= 60 ? '#22c55e' : '#ef4444'}
            />
            <div className="w-px h-10 bg-border/50 hidden sm:block" />
            <SentimentBar
              label={away}
              score={awaySentiment}
              color={awaySentiment >= 60 ? '#48e5d0' : '#ff6e84'}
              secondary={awaySentiment >= 60 ? '#22c55e' : '#ef4444'}
            />
          </div>
        </div>
      )}

      {/* Arena Psyche — structured AI analysis */}
      {expanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`mx-4 mb-4 p-4 rounded-2xl border shadow-inner ${lifecycle.bg} ${lifecycle.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{ color: lifecycle.color }} />
              <span className="font-black text-[11px] uppercase tracking-widest italic" style={{ color: lifecycle.color }}>
                ARENA PSYCHE
              </span>
            </div>
            <p className="text-[14px] font-black text-foreground mb-4 tracking-tight leading-snug">
              {psycheContent.headline}
            </p>
            <div className="space-y-4">
              {psycheContent.sections.map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base leading-none">{section.icon}</span>
                    <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: lifecycle.color }}>
                      {section.label}
                    </h4>
                  </div>
                  {section.items && section.items.length > 0 ? (
                    <ul className="space-y-1 pl-1">
                      {section.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-[12.5px] font-medium leading-snug text-foreground/85">
                          <span className="mt-[3px] shrink-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/50 italic pl-1">No data available yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4 flex items-center gap-3">
        <ShareButton
          variant="glass"
          size="sm"
          className="flex-1 h-10"
          title={`${home} vs ${away}`}
          text={`⚽ ${home} vs ${away} — look at this deep psyche report 🔥 Check the fan mood on FanPulse!`}
        />
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 h-10 text-[10px] font-black bg-muted/40 hover:bg-muted/60"
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? 'CLOSE' : 'PSYCHE'}
          <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>
    </div>
  )
}


// ── Main Content ───────────────────────────────────────────────
function SentimentsContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  // Filter state
  const [activeCompetition, setActiveCompetition] = useState('All')
  const [activeClub, setActiveClub] = useState<string | null>(null)
  const [activeRound, setActiveRound] = useState<string>('')

  // Ref for the round scroller
  const roundScrollerRef = useRef<HTMLDivElement>(null)

  // 1. Fetch matches from API dynamically
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        const matchesArray = data.matches || []
        // Only keep matches for CORE_CLUBS, or matches where findClub returns a valid mapping
        const filtered = matchesArray.map((m: any) => ({
          ...m,
          round: m.round || "Champions League" // Fallback since round was removed from schema
        }))
        setAllMatches(filtered)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load live matches:', err)
        setLoading(false)
      })
  }, [])

  // 2. Filtered by active competition
  const competitionMatches = useMemo(() => {
    if (activeCompetition === 'Premier League') return allMatches.filter(m => m.league.includes('Premier'))
    if (activeCompetition === 'La Liga') return allMatches.filter(m => m.league.includes('La Liga'))
    if (activeCompetition === 'UCL') return allMatches.filter(m => m.league.includes('Champions'))
    return allMatches
  }, [allMatches, activeCompetition])

  // 3. Extract unique rounds, sorted naturally, and find closest
  const { rounds, closestRound } = useMemo(() => {
    const unique = [...new Set(competitionMatches.map(m => m.round || "Unspecified"))]
    unique.sort((a, b) => {
      const aNum = parseInt(a?.replace(/\D/g, '') || "0")
      const bNum = parseInt(b?.replace(/\D/g, '') || "0")
      if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) return aNum - bNum
      return (a || "").localeCompare(b || "")
    })

    // Find the round closest to today
    let best = unique[0] || ''
    let minDiff = Infinity
    for (const m of competitionMatches) {
      const d = Math.abs(new Date(m.date).getTime() - NOW.getTime())
      if (d < minDiff) { minDiff = d; best = m.round }
    }
    return { rounds: unique, closestRound: best }
  }, [competitionMatches])

  // Reset round when competition changes
  useEffect(() => {
    setActiveRound(closestRound)
  }, [closestRound])

  // 4. Final matches for display
  const displayMatches = useMemo(() => {
    let result = competitionMatches.filter(m => m.round === activeRound)
    if (activeClub) {
      result = result.filter(m => {
        const homeCLub = findClub(m.homeTeam)
        const awayClub = findClub(m.awayTeam)
        return m.homeTeam.includes(activeClub) || 
               m.awayTeam.includes(activeClub) || 
               homeCLub?.shortName === activeClub || 
               awayClub?.shortName === activeClub
      })
    }
    return result
  }, [competitionMatches, activeRound, activeClub])

  // Mount
  useEffect(() => { setMounted(true) }, [])

  // Scroll active round pill into view
  useEffect(() => {
    if (!mounted || !activeRound) return
    const idx = rounds.indexOf(activeRound)
    const el = document.getElementById(`round-pill-${idx}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [mounted, activeRound, rounds])

  // Handler for competition change
  const handleCompetitionChange = useCallback((comp: string) => {
    setActiveCompetition(comp)
    setActiveClub(null)
  }, [])

  // Handler for round change
  const handleRoundChange = useCallback((round: string) => {
    setActiveRound(round)
  }, [])

  if (!mounted) return null

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-5 max-w-md md:max-w-full mx-auto min-h-screen pb-32 md:pb-12 relative">
      {/* Header */}
      <div className="text-center space-y-2 relative z-10 mb-4">
        <h2 className="text-[30px] font-black tracking-tighter leading-none uppercase italic text-foreground">
          Sentiments Hub
        </h2>
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 mx-auto rounded-full bg-background/50 border border-border shadow-sm w-max">
          <CalendarDays className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            2025-2026 Schedule
          </span>
        </div>
      </div>

      {/* ─── Competition Switcher ─── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 relative z-10" role="tablist">
        {['All', 'Premier League', 'La Liga', 'UCL'].map(comp => (
          <button
            key={comp}
            role="tab"
            aria-selected={activeCompetition === comp}
            onClick={() => handleCompetitionChange(comp)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex-shrink-0 border whitespace-nowrap ${
              activeCompetition === comp
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.03]'
                : 'bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40'
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* ─── Club Selector ─── */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none py-1 relative z-10 items-center">
        <button
          onClick={() => setActiveClub(null)}
          className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 ${
            activeClub === null ? 'opacity-100 scale-110' : 'opacity-40 scale-95 hover:opacity-70'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm">🌐</div>
          <span className="text-[8px] font-black uppercase text-foreground">ALL</span>
        </button>
        {CLUBS.map(club => (
          <button
            key={club.id}
            onClick={() => setActiveClub(activeClub === club.shortName ? null : club.shortName)}
            className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 ${
              activeClub === club.shortName ? 'opacity-100 scale-110' : 'opacity-40 scale-95 hover:opacity-70'
            }`}
          >
            <ClubLogo club={club.name} size={40} showName={false} />
            <span className="text-[8px] font-black uppercase text-foreground truncate w-12 text-center">
              {club.shortName}
            </span>
          </button>
        ))}
      </div>

      {/* ─── Round / Matchday Scroller ─── */}
      <div
        ref={roundScrollerRef}
        className="flex gap-2 overflow-x-auto scrollbar-none pb-3 relative z-10"
        role="tablist"
      >
        {rounds.map((round, idx) => {
          const isActive = activeRound === round
          return (
            <button
              key={round}
              id={`round-pill-${idx}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleRoundChange(round)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex-shrink-0 border whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-foreground text-background border-foreground shadow-xl scale-[1.04]'
                  : 'bg-muted/20 text-muted-foreground border-border/10 hover:bg-muted/40 hover:border-border/30'
              }`}
            >
              {round}
            </button>
          )
        })}
      </div>

      {/* ─── Match Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
        {loading ? (
          <div className="text-center py-16 bg-muted/5 rounded-3xl border-2 border-dashed border-border/50 animate-pulse md:col-span-full">
             <p className="text-foreground font-black text-lg tracking-tight">Syncing Live Pulses...</p>
          </div>
        ) : displayMatches.length === 0 ? (
          <div className="text-center py-16 bg-muted/5 rounded-3xl border-2 border-dashed border-border/50 md:col-span-full">
            <Zap className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
            <p className="text-foreground font-black text-lg tracking-tight">No Signals Detected</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">
              Adjust your filters above
            </p>
          </div>
        ) : (
          displayMatches.map((m, idx) => (
            <MatchCard key={`${m.homeTeam}-${m.awayTeam}-${m.date}`} match={m} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-6 opacity-40 relative z-10">
        <Activity className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Arena Psyche Engine Active
        </span>
      </div>
    </div>
  )
}

// ── Page Export ─────────────────────────────────────────────────
export default function SentimentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest italic text-primary animate-pulse">
        Initializing Pulse...
      </div>
    }>
      <SentimentsContent />
    </Suspense>
  )
}
