'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Activity, Star, Flame, Trophy } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const NAV_ITEMS = [
  { href: '/',           labelKey: 'nav.home',       icon: Home },
  { href: '/sentiments', labelKey: 'nav.sentiments', icon: Activity },
  { href: '/ratings',    labelKey: 'nav.rate',       icon: Star },
  { href: '/goals',      labelKey: 'nav.goals',      icon: Flame },
  { href: '/totw',       labelKey: 'nav.totw',       icon: Trophy },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 group relative"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator - top glow line */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: 'hsl(var(--primary))' }}
                />
              )}

              {/* Icon container */}
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                style={{
                  background: isActive ? 'hsl(var(--primary) / 0.15)' : 'transparent',
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-all duration-200"
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    filter: isActive ? 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))' : 'none',
                  }}
                />
              </span>

              {/* Label */}
              <span
                className="text-[10px] font-bold tracking-wide leading-none transition-colors duration-200"
                style={{
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? '0.04em' : '0.02em',
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
