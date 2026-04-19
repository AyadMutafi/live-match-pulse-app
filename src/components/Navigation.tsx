'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Activity, Star, Flame, Trophy, Zap, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export const NAV_ITEMS = [
  { href: '/',           labelKey: 'nav.home',       icon: Home,     emoji: '🏠' },
  { href: '/sentiments', labelKey: 'nav.sentiments', icon: Activity, emoji: '⚡' },
  { href: '/rate',       labelKey: 'nav.rate',       icon: Star,     emoji: '⭐' },
  { href: '/goals',      labelKey: 'nav.goals',      icon: Flame,    emoji: '🔥' },
  { href: '/totw',       labelKey: 'nav.totw',       icon: Trophy,   emoji: '🏆' },
]

// ── Mobile bottom tab bar ────────────────────────────────────────────────────
export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around h-16 w-full px-2 max-w-md mx-auto">
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 group relative"
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: 'hsl(var(--primary))' }}
                />
              )}

              <span
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                style={{
                  background: isActive ? 'hsl(var(--primary) / 0.15)' : 'transparent',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-all duration-200"
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    filter: isActive ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.6))' : 'none',
                  }}
                />
              </span>

              <span
                className="text-[10px] font-bold tracking-wide leading-none transition-colors duration-200"
                style={{
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: isActive ? '0.05em' : '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {t(labelKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// ── Desktop sticky sidebar ───────────────────────────────────────────────────
export function SidebarNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-56px)] sticky top-14 z-40"
      style={{ background: 'hsl(var(--surface-container-lowest, var(--background)))' }}
    >
      {/* Inner scroll container */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-8 pb-8">

        {/* Section label */}
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30 px-2 mb-3">
          Navigation
        </p>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon, emoji }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full"
                    style={{ background: 'hsl(var(--primary))' }}
                  />
                )}

                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    background: isActive ? 'hsl(var(--primary) / 0.18)' : 'hsl(var(--muted) / 0.5)',
                  }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                  />
                </span>

                <span
                  className="text-[13px] font-black uppercase tracking-wider flex-1"
                  style={{
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {t(labelKey)}
                </span>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Live status indicator */}
        <div className="mt-6 mx-2 flex items-center gap-2 p-3 rounded-xl"
          style={{ background: 'hsl(var(--muted) / 0.3)' }}>
          <span className="live-dot shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Arena Live</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">AI sync active</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px mx-2" style={{ background: 'hsl(var(--border) / 0.4)' }} />

        {/* ── Arena Pro CTA at bottom */}
        <div className="mt-auto">
          <div
            className="p-4 rounded-2xl border relative overflow-hidden group cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--secondary) / 0.05) 100%)',
              borderColor: 'hsl(var(--primary) / 0.2)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-xl"
              style={{ background: 'hsl(var(--primary))' }}
            />
            <Zap className="w-5 h-5 text-primary mb-2 animate-float relative z-10" />
            <h4 className="text-foreground font-black text-[13px] uppercase italic relative z-10">Arena Pro</h4>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed relative z-10">
              Unlock AI sweeps, historical data & live sentiment alerts.
            </p>
            <div className="mt-3 flex items-center gap-1 relative z-10">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">Upgrade</span>
              <ChevronRight className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
