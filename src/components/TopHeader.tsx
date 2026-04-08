"use client"

import Link from 'next/link'
import { Moon, Sun, Zap, Globe, X, Star } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'

export function TopHeader() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSubscribe = () => {
    setSubscribing(true)
    setTimeout(() => {
      setSubscribing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14"
      style={{
        background: 'hsl(var(--surface-container-low, var(--background)) / 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid hsl(var(--border) / 0.4)',
      }}
    >
      {/* Left: FANPULSE ⚡ logo — matching Stitch design */}
      <Link href="/" className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
        <span
          className="font-black text-[16px] tracking-tight text-foreground"
          style={{ letterSpacing: '-0.03em' }}
        >
          {t('app.title')}
        </span>
        <span className="text-primary font-black text-[16px]">⚡</span>
      </Link>

      {/* Right: controls */}
      <div className="flex items-center gap-1.5">

        {/* PRO Gold Badge — Championship Gold, Stitch secondary */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="pro-badge hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="Upgrade to PRO"
            >
              PRO
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <Dialog.Content
              className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md p-6 rounded-2xl shadow-2xl z-50"
              style={{ background: 'hsl(var(--surface-container-high, var(--card)))', border: '1px solid hsl(var(--border))' }}
            >
              {/* Gold glow at top */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, #fcc025, transparent)' }} />

              <Dialog.Title className="text-xl font-black text-foreground mb-1 flex items-center gap-2.5 mt-1">
                <span className="text-2xl">⚡</span>
                Upgrade to PRO
                <span className="pro-badge ml-1">GOLD</span>
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Unlock advanced sentiment analytics, historical fan data, and exclusive AI-driven insights for your favourite clubs.
              </Dialog.Description>

              <div className="space-y-2.5 mb-6">
                {[
                  ['📊', 'Deep Analytics', 'Real-time word clouds, emotion mapping, and sentiment heatmaps.'],
                  ['⚽', 'All 7 Club Focus', 'Expanded coverage for all PL & La Liga powerhouses.'],
                  ['🤖', 'Priority Gemini AI', 'Faster updates & richer match narrative analysis.'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: 'hsl(var(--secondary) / 0.08)', border: '1px solid hsl(var(--secondary) / 0.2)' }}>
                    <span className="text-xl shrink-0">{icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors border border-border">
                    Maybe Later
                  </button>
                </Dialog.Close>
                <button 
                  className="flex-1 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100 glow-gold disabled:opacity-50 disabled:scale-100" 
                  style={{ background: '#fcc025', color: '#3a2700' }}
                  onClick={handleSubscribe}
                  disabled={subscribing || success}
                >
                  {success ? '✅ UPGRADED' : subscribing ? '⚡ ACTIVATING...' : '⭐ Subscribe Now'}
                </button>
              </div>

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && theme === 'dark' ? (
            <Moon className="w-[17px] h-[17px]" strokeWidth={2} />
          ) : (
            <Sun className="w-[17px] h-[17px]" strokeWidth={2} />
          )}
        </button>

        {/* Language Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-[11px] font-bold uppercase">
              <Globe className="w-3.5 h-3.5" strokeWidth={2} />
              {lang}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[130px] rounded-xl p-1 z-50 shadow-xl"
              style={{ background: 'hsl(var(--surface-bright, var(--popover)))', border: '1px solid hsl(var(--border))' }}
              sideOffset={8}
            >
              <DropdownMenu.Item
                className={`text-sm px-3 py-2 rounded-lg cursor-pointer outline-none transition-colors ${lang === 'EN' ? 'text-primary font-bold' : 'text-foreground hover:bg-muted'}`}
                style={lang === 'EN' ? { background: 'hsl(var(--primary) / 0.1)' } : {}}
                onClick={() => setLang('EN')}
              >
                🇬🇧 English
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={`text-sm px-3 py-2 rounded-lg cursor-pointer outline-none transition-colors ${lang === 'AR' ? 'text-primary font-bold' : 'text-foreground hover:bg-muted'}`}
                style={lang === 'AR' ? { background: 'hsl(var(--primary) / 0.1)' } : {}}
                onClick={() => setLang('AR')}
              >
                🇸🇦 العربية
              </DropdownMenu.Item>
              <DropdownMenu.Arrow style={{ fill: 'hsl(var(--border))' }} />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

      </div>
    </header>
  )
}
