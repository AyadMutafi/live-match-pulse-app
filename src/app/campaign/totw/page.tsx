'use client'

import { useState, useEffect } from 'react'
import { Zap, Siren, Sparkles, Skull, Share2, TrendingUp, Activity, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { ClubLogo } from '@/components/ClubLogo'

type Player = {
  id: string; 
  name: string; 
  team: string; 
  position: string; 
  sentiment: number;
  status: string;
  lastUpdated: string | null;
  statusNote: string | null;
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

  // 1. Filter out non-ACTIVE players and stale data (> 48h)
  const eligiblePlayers = players.filter(p => 
    p.status === 'ACTIVE' && 
    p.lastUpdated && 
    (Date.now() - new Date(p.lastUpdated).getTime()) < 48 * 60 * 60 * 1000
  );

  // 2. Selection algorithm for XI (4-3-3)
  const selectXI = (pool: Player[], sortDir: 'desc' | 'asc') => {
    const sorted = [...pool].sort((a, b) => sortDir === 'desc' ? b.sentiment - a.sentiment : a.sentiment - b.sentiment);
    
    const getTop = (pos: string, count: number) => {
      const filtered = sorted.filter(p => p.position === pos);
      const result: (Player | null)[] = filtered.slice(0, count);
      while (result.length < count) {
        result.push(null);
      }
      return result;
    };

    return [
      ...getTop('GK', 1),
      ...getTop('DEF', 4),
      ...getTop('MID', 3),
      ...getTop('FW', 3)
    ];
  };

  const eliteXI = selectXI(eligiblePlayers, 'desc');
  const crisisXI = selectXI(eligiblePlayers, 'asc');

  // For the legacy frames, pick the absolute top of the XI
  const elite = eliteXI.find(p => p !== null);
  const crisis = crisisXI.find(p => p !== null);

  const formatFreshness = (dateStr: string | null) => {
    if (!dateStr) return 'STALE';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60)) % 60;
    return `${hours}H ${mins}M AGO`;
  };

  const SquadGrid = ({ title, squad, colorClass }: { title: string, squad: (Player | null)[], colorClass: string }) => (
    <div className="w-full max-w-4xl space-y-4">
      <h3 className={`text-xl font-black uppercase tracking-widest ${colorClass}`}>{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {squad.map((player, idx) => (
          <div key={idx} className={`relative p-4 rounded-2xl bg-white/5 border ${player ? 'border-white/10' : 'border-dashed border-white/5 opacity-50'} flex flex-col gap-2`}>
            {player ? (
              <>
                <div className="flex justify-between items-start">
                  <ClubLogo club={player.team} size={20} />
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${colorClass} bg-current/10`}>{player.sentiment}%</span>
                </div>
                <div className="min-h-[40px]">
                  <p className="text-[12px] font-black uppercase text-white leading-tight truncate">{player.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{player.position}</p>
                </div>
                <div className="mt-auto pt-2 border-t border-white/5 flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-white/20" />
                  <span className="text-[8px] font-black text-white/30 uppercase">{formatFreshness(player.lastUpdated)}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-4">
                <Skull className="w-6 h-6 text-white/5 mb-2" />
                <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">No eligible player</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
                            {elite ? (elite.sentiment > 90 ? '👑' : '🔥') : '💀'}
                        </div>
                        {elite && (
                          <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-black font-black italic text-4xl px-6 py-2 rounded-2xl border-4 border-black rotate-6 shadow-2xl">
                              {elite.sentiment}%
                          </div>
                        )}
                        <div className="absolute -top-4 -left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-black text-white">{elite ? formatFreshness(elite.lastUpdated) : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">{elite?.name || 'No Elite Player'}</h2>
                        {elite && (
                          <div className="flex items-center justify-center gap-2">
                              <ClubLogo club={elite.team} size={24} />
                              <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">{elite.team}</span>
                          </div>
                        )}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 max-w-[200px]">
                        {elite ? 'Dominating the digital arena with peak fan resonance.' : 'No players met the elite eligibility criteria this week.'}
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
                        {crisis && (
                          <div className="absolute -bottom-4 -right-4 bg-rose-500 text-white font-black italic text-4xl px-6 py-2 rounded-2xl border-4 border-black -rotate-6 shadow-2xl">
                              {crisis.sentiment}%
                          </div>
                        )}
                        <div className="absolute -top-4 -left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-rose-500" />
                          <span className="text-[10px] font-black text-white">{crisis ? formatFreshness(crisis.lastUpdated) : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">{crisis?.name || 'No Crisis Player'}</h2>
                        {crisis && (
                          <div className="flex items-center justify-center gap-2">
                              <ClubLogo club={crisis.team} size={24} />
                              <span className="text-sm font-bold uppercase tracking-widest text-rose-400">{crisis.team}</span>
                          </div>
                        )}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500/60 max-w-[200px]">
                        {crisis ? 'Intercepted signals indicate a complete digital meltdown.' : 'Stability detected. No players in the crisis zone.'}
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

      <SquadGrid title="Elite XI Selection" squad={eliteXI} colorClass="text-emerald-500" />
      <SquadGrid title="Crisis XI Selection" squad={crisisXI} colorClass="text-rose-500" />

      {/* Frame 4: Large Landscape Poster */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Arena Landscape Poster (4:3)</span>
        <div className="w-[800px] h-[600px] bg-black rounded-[40px] border-[12px] border-[#111] shadow-2xl relative overflow-hidden flex flex-col p-12">
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
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-3xl">
                                  {elite ? '🔥' : '💀'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">{elite?.name || 'No Elite Player'}</h3>
                                    <span className="text-sm font-bold text-emerald-500/60 uppercase">{elite?.team || 'N/A'}</span>
                                    {elite && <p className="text-[9px] font-black text-white/40 mt-1 uppercase">{formatFreshness(elite.lastUpdated)}</p>}
                                </div>
                            </div>
                            <div className="text-6xl font-black italic text-white">{elite?.sentiment || 0}%</div>
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
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">{crisis?.name || 'No Crisis Player'}</h3>
                                    <span className="text-sm font-bold text-rose-500/60 uppercase">{crisis?.team || 'N/A'}</span>
                                    {crisis && <p className="text-[9px] font-black text-white/40 mt-1 uppercase">{formatFreshness(crisis.lastUpdated)}</p>}
                                </div>
                            </div>
                            <div className="text-6xl font-black italic text-white">{crisis?.sentiment || 0}%</div>
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
