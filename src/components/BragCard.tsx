"use client"

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Download, Zap, Loader2 } from 'lucide-react'
import { ClubLogo } from './ClubLogo'

interface BragCardProps {
  isOpen: boolean
  onClose: () => void
  player: {
    name: string
    team: string
    position: string
    sentiment: number
    sentimentEmoji?: string
    label?: string
  }
  isCrisis?: boolean
}

export function BragCard({ isOpen, onClose, player, isCrisis }: BragCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  if (!player) return null

  const themeColor = isCrisis ? '#f43f5e' : '#10b981'
  const sentiment = player.sentiment
  const label = player.label || (isCrisis ? 'CRITICAL MELTDOWN' : 'ABSOLUTE SOVEREIGN')
  const emoji = player.sentimentEmoji || (isCrisis ? '😤' : '🤩')

  const captureCard = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null
    try {
      // Dynamically import to avoid SSR issues
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })
      // Convert data URL to blob
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch (err) {
      console.error('BragCard capture failed:', err)
      return null
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const blob = await captureCard()
      if (!blob) throw new Error('Capture failed')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `FanPulse-${player.name.replace(/\s+/g, '-')}-${sentiment}pct.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const blob = await captureCard()
      if (blob && navigator.canShare?.({ files: [new File([blob], 'fanpulse.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `${player.name} — Fan Pulse Verdict`,
          text: `${player.name} is at ${sentiment}% Pulse (${label}) on Fan Pulse! 🔥 #FanPulse #Football`,
          files: [new File([blob], 'fanpulse.png', { type: 'image/png' })],
        })
      } else {
        // Fallback: open X intent
        const text = `${player.name} is at ${sentiment}% Fan Pulse (${label})! 🔥 #FanPulse #Football`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
      }
    } catch (err) {
      console.error('Share failed:', err)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors border border-white/10 z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hint */}
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-5">
            Screenshot or Download for Stories
          </p>

          {/* ── The actual card that gets captured ─────────────────── */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative w-[340px] h-[600px] bg-slate-950 rounded-[3rem] overflow-hidden flex flex-col"
            style={{ boxShadow: `0 0 120px ${themeColor}30` }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] opacity-20"
                style={{ background: `radial-gradient(circle at 30% 30%, ${themeColor} 0%, transparent 60%)` }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10"
                style={{ background: `radial-gradient(circle at 50% 100%, ${themeColor} 0%, transparent 60%)` }}
              />
            </div>

            {/* Horizontal stripe accent */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: themeColor }} />

            {/* Header */}
            <div className="relative z-10 px-8 pt-8 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit">
                  <Zap className="w-3 h-3" style={{ color: themeColor }} fill="currentColor" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Fan Pulse Intel</span>
                </div>
                <h1 className="text-white font-black text-[2.2rem] tracking-tighter italic uppercase mt-3 leading-none">
                  ARENA<br /><span style={{ color: themeColor }}>VERDICT</span>
                </h1>
              </div>
              <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mt-1">
                <ClubLogo club={player.team} size={44} showName={false} />
              </div>
            </div>

            {/* Center content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
              {/* Emoji + Score */}
              <div className="relative mb-6">
                <div
                  className="w-40 h-40 bg-slate-900 rounded-[2.5rem] border-8 flex items-center justify-center text-7xl shadow-2xl"
                  style={{ borderColor: themeColor }}
                >
                  {emoji}
                </div>
                <div className="absolute -bottom-4 -right-3 bg-white text-slate-950 font-black italic text-2xl px-5 py-1.5 rounded-2xl shadow-2xl transform rotate-6">
                  {sentiment}%
                </div>
              </div>

              {/* Player info */}
              <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic leading-none mb-1.5">
                {player.name}
              </h2>
              <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.3em] mb-6">
                {player.team} &bull; {player.position}
              </p>

              {/* Stats card */}
              <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Pulse Status</span>
                  <span className="text-[11px] font-black uppercase italic" style={{ color: themeColor }}>
                    {label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${sentiment}%`, backgroundColor: themeColor }} />
                </div>
                <p className="text-[10px] text-white/50 font-medium italic leading-relaxed">
                  &ldquo;Digital resonance confirms {isCrisis ? 'unprecedented negative pressure' : 'elite-level fan approval'} across all verified arena channels.&rdquo;
                </p>
              </div>
            </div>

            {/* Footer watermark */}
            <div className="relative z-10 px-8 pb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 opacity-30">
                <span className="w-6 h-px bg-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">FAN-PULSE.APP</span>
                <span className="w-6 h-px bg-white" />
              </div>
              <p className="text-white/15 text-[7px] font-black uppercase tracking-widest text-center">
                AI-DRIVEN SENTIMENT ANALYTICS
              </p>
            </div>
          </motion.div>

          {/* ── Action buttons (outside the captured area) ─────────── */}
          <div className="flex gap-3 mt-6 w-[340px]">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-4 bg-white text-slate-950 font-black text-[12px] uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
              ) : (
                <><Download className="w-4 h-4" /> Save Image</>
              )}
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="p-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors disabled:opacity-60"
            >
              {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>

        </div>
      )}
    </AnimatePresence>
  )
}
