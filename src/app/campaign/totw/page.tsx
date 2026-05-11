'use client'

import { useState, useEffect } from 'react'
import { Zap, Siren, Sparkles, Skull, Share2, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { ClubLogo } from '@/components/ClubLogo'

type Player = {
  id: string; name: string; team: string; position: string; sentiment: number;
}

export default function CampaignPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const res = await fetch('/api/players?week=current')
        if (res.ok) setPlayers(await res.json())
      } finally {
        setLoading(false)
      }
    }
    loadPlayers()
  }, [])

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest opacity-50">Generating Campaign Frames...</div>

  const elite = [...players].sort((a,b) => b.sentiment - a.sentiment)[0]
  const crisis = [...players].sort((a,b) => a.sentiment - b.sentiment)[0]

  return (
    <div className="min-h-screen bg-[#050505] p-8 flex flex-col items-center gap-12 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Social Media Assets</h1>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-50">Direct from the Arena Engine</p>
      </div>

      {/* Frame 1: Instagram Story - Elite XI */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Instagram Story Layout (Elite)</span>
        <div className="w-[360px] h-[640px] bg-black rounded-[40px] border-[8px] border-[#111] shadow-2xl relative overflow-hidden flex flex-col p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#10b98115_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#fbbf2410_0%,transparent_50%)]" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Fan Pulse Elite</span>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground opacity-50 uppercase">MAY 2026</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                    <div className="relative">
                        <div className="w-48 h-48 rounded-[3rem] bg-emerald-500/10 border-4 border-emerald-500 shadow-[0_0_60px_#10b98130] flex items-center justify-center text-8xl">
                            {elite?.sentiment > 90 ? '👑' : '🔥'}
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-black font-black italic text-4xl px-6 py-2 rounded-2xl border-4 border-black rotate-6 shadow-2xl">
                            {elite?.sentiment}%
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">{elite?.name}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <ClubLogo club={elite?.team} size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">{elite?.team}</span>
                        </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 max-w-[200px]">
                        Dominating the digital arena with peak fan resonance.
                    </p>
                </div>

                <div className="mt-auto pt-12 pb-4 text-center">
                    <div className="inline-block px-6 py-3 bg-emerald-500 rounded-full text-black font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#10b98180]">
                        ENTER THE ARENA
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Frame 2: Instagram Story - Crisis Radar */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Instagram Story Layout (Crisis)</span>
        <div className="w-[360px] h-[640px] bg-black rounded-[40px] border-[8px] border-[#111] shadow-2xl relative overflow-hidden flex flex-col p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f43f5e20_0%,transparent_60%)]" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <Siren className="w-5 h-5 text-rose-500 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Crisis Radar</span>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground opacity-50 uppercase">MAY 2026</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                    <div className="relative">
                        <div className="w-48 h-48 rounded-[3rem] bg-rose-500/10 border-4 border-rose-500 shadow-[0_0_60px_#f43f5e30] flex items-center justify-center text-8xl">
                            💀
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-rose-500 text-white font-black italic text-4xl px-6 py-2 rounded-2xl border-4 border-black -rotate-6 shadow-2xl">
                            {crisis?.sentiment}%
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">{crisis?.name}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <ClubLogo club={crisis?.team} size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest text-rose-400">{crisis?.team}</span>
                        </div>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500/60 max-w-[200px]">
                        Intercepted signals indicate a complete digital meltdown.
                    </p>
                </div>

                <div className="mt-auto pt-12 pb-4 text-center">
                    <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-xl border border-rose-500/30 rounded-full text-rose-500 font-black uppercase tracking-widest text-sm">
                        VIEW LIVE FEED
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Frame 4: Large Landscape Poster */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Arena Landscape Poster (4:3)</span>
        <div className="w-[800px] h-[600px] bg-black rounded-[40px] border-[12px] border-[#111] shadow-2xl relative overflow-hidden flex flex-col p-12">
            {/* Massive background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#bd9dff15_0%,transparent_70%)]" />
            <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-amber-400/5 blur-[120px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                            ARENA<br /><span className="text-primary">PULSE</span>
                        </h1>
                        <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mt-4">AI-DRIVEN SENTIMENT ENGINE</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">LIVE METRIC</p>
                            <p className="text-4xl font-black italic text-primary">05.2026</p>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                            <Activity className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-between gap-12">
                    {/* Elite Section */}
                    <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4 block">PEAK RESONANCE</span>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-3xl">🔥</div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">{elite?.name}</h3>
                                    <span className="text-sm font-bold text-emerald-500/60 uppercase">{elite?.team}</span>
                                </div>
                            </div>
                            <div className="text-6xl font-black italic text-white">{elite?.sentiment}%</div>
                        </div>
                    </div>

                    <div className="text-4xl font-black italic text-white/10 select-none">VS</div>

                    {/* Crisis Section */}
                    <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-rose-500/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4 block">SYSTEM CRITICAL</span>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-3xl">💀</div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">{crisis?.name}</h3>
                                    <span className="text-sm font-bold text-rose-500/60 uppercase">{crisis?.team}</span>
                                </div>
                            </div>
                            <div className="text-6xl font-black italic text-white">{crisis?.sentiment}%</div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-12 flex justify-between items-end border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 FAN PULSE ANALYTICS • MAY CAMPAIGN</p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
