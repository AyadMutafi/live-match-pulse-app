'use client'

import { useState, useEffect, useMemo } from 'react'
import { Play, Flame, ExternalLink } from 'lucide-react'
import { ClubLogo } from '@/components/ClubLogo'
import { ShareButton } from '@/components/ShareButton'
import {
  GOALS_FEED,
  OFFICIAL_SOURCES,
  getGoalMatchdays,
  getGoalsByMatchday,
  GOAL_TYPE_EMOJI,
  GOAL_TYPE_LABEL,
  type GoalHighlight,
  type GoalSource,
} from '@/lib/goals-data'

// ── Platform icons ────────────────────────────────────────────
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.26a8.26 8.26 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.67z" />
    </svg>
  )
}

function YouTubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
      <polygon fill="white" points="9.545,15.568 15.818,12 9.545,8.432" />
    </svg>
  )
}

const PLATFORM_ICON: Record<string, React.FC<{ size?: number }>> = {
  x: XIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
}

const PLATFORM_COLORS: Record<string, string> = {
  x: '#1DA1F2',
  tiktok: '#00f2ea',
  instagram: '#E4405F',
  youtube: '#FF0000',
}

// ── Source button ──────────────────────────────────────────────
function SourceButton({ source }: { source: GoalSource }) {
  const Icon = PLATFORM_ICON[source.platform] || XIcon
  const color = PLATFORM_COLORS[source.platform] || '#666'

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 hover:scale-[1.04] active:scale-95 whitespace-nowrap"
      style={{
        borderColor: `${color}30`,
        background: `${color}08`,
        color: source.platform === 'x' ? 'var(--foreground, #333)' : color,
      }}
    >
      <Icon size={12} />
      <span>{source.label}</span>
      {source.verified && (
        <svg className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
        </svg>
      )}
    </a>
  )
}

// ── Goal Type Filter Pill ─────────────────────────────────────
function GoalTypeFilter({
  types,
  active,
  onToggle,
}: {
  types: string[]
  active: string | null
  onToggle: (type: string | null) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      <button
        onClick={() => onToggle(null)}
        className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex-shrink-0 border whitespace-nowrap ${
          active === null
            ? 'bg-foreground text-background border-foreground shadow-lg'
            : 'bg-muted/20 text-muted-foreground border-border/10 hover:bg-muted/40'
        }`}
      >
        🔥 ALL
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onToggle(active === type ? null : type)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex-shrink-0 border whitespace-nowrap ${
            active === type
              ? 'bg-foreground text-background border-foreground shadow-lg'
              : 'bg-muted/20 text-muted-foreground border-border/10 hover:bg-muted/40'
          }`}
        >
          {GOAL_TYPE_EMOJI[type as GoalHighlight['goalType']] || '⚽'}{' '}
          {GOAL_TYPE_LABEL[type as GoalHighlight['goalType']] || type}
        </button>
      ))}
    </div>
  )
}

// ── Goal Card ─────────────────────────────────────────────────
function GoalCard({ goal, index }: { goal: GoalHighlight; index: number }) {

  // Map club name to the internal slug used by ClubLogo
  const clubSlug =
    goal.club === 'Manchester City' ? 'Manchester City FC' :
    goal.club === 'Manchester United' ? 'Manchester United FC' :
    goal.club === 'Liverpool' ? 'Liverpool FC' :
    goal.club === 'Chelsea' ? 'Chelsea FC' :
    goal.club === 'Arsenal' ? 'Arsenal FC' :
    goal.club === 'Barcelona' ? 'FC Barcelona' :
    goal.club === 'Real Madrid' ? 'Real Madrid CF' :
    goal.club

  return (
    <div
      className="group/goal relative rounded-[28px] border border-border/40 bg-background/50 backdrop-blur-md overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-border/60"
      style={{
        animationDelay: `${index * 80}ms`,
        animation: 'fadeInUp 0.5s ease-out backwards',
      }}
    >
      {/* Accent gradient top bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${goal.accentColor}, ${goal.accentColor}80, transparent)`,
        }}
      />

      {/* Header row: Goal type badge + minute */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{GOAL_TYPE_EMOJI[goal.goalType]}</span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-foreground/5 border border-border/30 text-foreground/70">
            {GOAL_TYPE_LABEL[goal.goalType]}
          </span>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
          style={{
            background: `${goal.accentColor}15`,
            color: goal.accentColor,
            border: `1px solid ${goal.accentColor}30`,
          }}
        >
          {goal.minute}&apos;
        </span>
      </div>

      {/* Player + Club Row */}
      <div className="px-5 pb-3 flex items-center gap-4">
        <ClubLogo club={clubSlug} size={48} />
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-black text-foreground tracking-tight leading-tight truncate">
            {goal.player}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              {goal.club}
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-[11px] font-bold text-muted-foreground/60">
              vs {goal.opponent}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[24px] font-black text-foreground tracking-tighter">
            {goal.matchScore}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="mx-5 mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5 border border-border/30">
        <p className="text-[13px] font-semibold text-foreground/85 leading-relaxed">
          {goal.caption}
        </p>
      </div>

      {/* Tags */}
      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {goal.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-primary/70 border border-primary/10"
          >
            #{tag.replace(/\s/g, '')}
          </span>
        ))}
      </div>

      {/* ── Watch section — multiple source buttons ── */}
      <div className="px-5 pb-3 space-y-2">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 flex items-center gap-1.5">
          <Play className="w-3 h-3" /> WATCH FROM OFFICIAL SOURCES
        </p>
        <div className="flex flex-wrap gap-2">
          {goal.sources.map((source, i) => (
            <SourceButton key={i} source={source} />
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="px-5 pb-4 pt-1">
        <ShareButton
          variant="glass"
          size="sm"
          className="w-full h-10"
          title={`${goal.player} Goal vs ${goal.opponent}`}
          text={`⚽ ${goal.player} ${goal.minute}' — ${goal.caption} 🔥 Watch on FanPulse!`}
        />
      </div>
    </div>
  )
}

// ── Stat Banner ───────────────────────────────────────────────
function StatBanner({ goals }: { goals: GoalHighlight[] }) {
  const totalGoals = goals.length
  const leagues = new Set(goals.map((g) => g.league))
  const totalSources = new Set(goals.flatMap(g => g.sources.map(s => s.handle))).size
  const topType = goals.reduce(
    (acc, g) => {
      acc[g.goalType] = (acc[g.goalType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const bestType = Object.entries(topType).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-4 gap-2 px-1">
      {[
        { icon: '⚽', value: totalGoals, label: 'GOALS' },
        { icon: '🏆', value: leagues.size, label: 'LEAGUES' },
        { icon: '📡', value: totalSources, label: 'SOURCES' },
        {
          icon: GOAL_TYPE_EMOJI[bestType?.[0] as GoalHighlight['goalType']] || '🎯',
          value: bestType?.[1] || 0,
          label: 'TOP TYPE',
        },
      ].map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center p-2.5 rounded-2xl bg-background/30 border border-border/20 backdrop-blur-sm"
        >
          <span className="text-lg">{stat.icon}</span>
          <span className="text-[16px] font-black text-foreground tracking-tight">{stat.value}</span>
          <span className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function GoalsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeMatchday, setActiveMatchday] = useState<string>('')
  const [activeType, setActiveType] = useState<string | null>(null)
  const [activeLeague, setActiveLeague] = useState<string>('All')

  const matchdays = useMemo(() => getGoalMatchdays(), [])

  useEffect(() => {
    setMounted(true)
    if (matchdays.length > 0) setActiveMatchday(matchdays[0])
  }, [matchdays])

  const filteredGoals = useMemo(() => {
    let goals = activeMatchday ? getGoalsByMatchday(activeMatchday) : GOALS_FEED
    if (activeLeague !== 'All') {
      goals = goals.filter((g) => g.league === activeLeague)
    }
    if (activeType) {
      goals = goals.filter((g) => g.goalType === activeType)
    }
    return goals
  }, [activeMatchday, activeLeague, activeType])

  const goalTypes = useMemo(() => {
    return [...new Set(GOALS_FEED.map((g) => g.goalType))]
  }, [])

  if (!mounted) return null

  return (
    <div className="px-4 py-6 space-y-5 max-w-md mx-auto min-h-screen pb-32 relative">
      {/* Animated background accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-5 pointer-events-none bg-gradient-to-br from-red-500 via-amber-500 to-green-500" />

      {/* Header */}
      <div className="text-center space-y-2 relative z-10 mb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl">⚽</span>
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        </div>
        <h2 className="text-[30px] font-black tracking-tighter leading-none uppercase italic text-foreground">
          Goals
        </h2>
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
          Official highlights from verified accounts only ✅
        </p>
      </div>

      {/* Stats banner */}
      <StatBanner goals={GOALS_FEED} />

      {/* League filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 relative z-10" role="tablist">
        {['All', 'Premier League', 'La Liga'].map((league) => (
          <button
            key={league}
            role="tab"
            aria-selected={activeLeague === league}
            onClick={() => setActiveLeague(league)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex-shrink-0 border whitespace-nowrap ${
              activeLeague === league
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.03]'
                : 'bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40'
            }`}
          >
            {league === 'All' ? '🌍 ALL' : league === 'Premier League' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL' : '🇪🇸 LA LIGA'}
          </button>
        ))}
      </div>

      {/* Matchday scroller */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 relative z-10" role="tablist">
        {matchdays.map((md) => {
          const isActive = activeMatchday === md
          return (
            <button
              key={md}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveMatchday(md)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all flex-shrink-0 border whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-foreground text-background border-foreground shadow-xl scale-[1.04]'
                  : 'bg-muted/20 text-muted-foreground border-border/10 hover:bg-muted/40 hover:border-border/30'
              }`}
            >
              {md}
            </button>
          )
        })}
      </div>

      {/* Goal type filter */}
      <GoalTypeFilter types={goalTypes} active={activeType} onToggle={setActiveType} />

      {/* Goal Cards */}
      <div className="space-y-5 relative z-10">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16 bg-muted/5 rounded-3xl border-2 border-dashed border-border/50">
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-foreground font-black text-lg tracking-tight">No Goals Found</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mt-1">
              Try a different filter or matchday
            </p>
          </div>
        ) : (
          filteredGoals.map((goal, idx) => (
            <GoalCard key={goal.id} goal={goal} index={idx} />
          ))
        )}
      </div>

      {/* Official sources disclaimer */}
      <div className="relative z-10 mx-2 p-4 rounded-2xl bg-muted/10 border border-border/30 space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-sm mt-0.5">✅</span>
          <div>
            <p className="text-[11px] font-black text-foreground/70 uppercase tracking-wider mb-2">
              Official Sources Only
            </p>
          </div>
        </div>

        {/* Source categories */}
        <div className="space-y-2">
          <div>
            <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-1">🏆 Leagues</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-semibold">
              {OFFICIAL_SOURCES.leagues.join(' · ')}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-1">📺 Broadcasters</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-semibold">
              {OFFICIAL_SOURCES.broadcasters.join(' · ')}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-1">⚽ Clubs</p>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-semibold">
              {OFFICIAL_SOURCES.clubs.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-6 opacity-40 relative z-10">
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Goal Feed • Updated Every Matchday
        </span>
      </div>

      {/* fadeInUp animation is defined in globals.css */}
    </div>
  )
}
