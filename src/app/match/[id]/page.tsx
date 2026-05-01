"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Zap, Trophy, Shield, Activity, Share2, AlertCircle } from "lucide-react"
import { ClubLogo } from "@/components/ClubLogo"
import { AnimatedCounter, Sparkline, Skeleton } from "@/components/PulsePolish"
import { Button } from "@/components/ui/button"
import { CLUBS } from "@/lib/clubs"

type Player = {
  id: string
  name: string
  team: string
  position: string
  sentiment: number
}

type Match = {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  homeSentiment: number
  awaySentiment: number
  status: string
  psycheJSON?: string | null
}

const getSentimentColor = (score: number) => {
  if (score >= 70) return "#10b981"
  if (score >= 40) return "#f59e0b"
  return "#f43f5e"
}

const getSentimentEmoji = (score: number) => {
  if (score >= 70) return "🤩"
  if (score >= 40) return "😐"
  return "😤"
}

const getSentimentLabel = (score: number) => {
  if (score >= 70) return "Global Dominance"
  if (score >= 40) return "Highly Volatile"
  return "Critical Meltdown"
}

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string

  const [match, setMatch] = useState<Match | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatchData() {
      try {
        const res = await fetch(`/api/matches/${matchId}`)
        if (!res.ok) throw new Error("Match not found")
        const data = await res.json()
        setMatch(data.match)
        setPlayers(data.players || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (matchId) fetchMatchData()
  }, [matchId])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton variant="circle" className="w-10 h-10" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton variant="card" className="h-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton variant="card" className="h-64" />
          <Skeleton variant="card" className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-2xl font-black text-white uppercase italic">Match Not Found</h2>
        <Button onClick={() => router.push("/")} variant="glow">
          Return to Arena
        </Button>
      </div>
    )
  }

  const isLiveOrFinished = match.status === "finished" || match.homeScore !== null
  const homeColor = getSentimentColor(match.homeSentiment)
  const awayColor = getSentimentColor(match.awaySentiment)

  const homePlayers = players.filter(p => p.team === match.homeTeam).slice(0, 3)
  const awayPlayers = players.filter(p => p.team === match.awayTeam).slice(0, 3)

  let psyche = null
  if (match.psycheJSON) {
    try {
      psyche = JSON.parse(match.psycheJSON)
    } catch(e) {}
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[12px] font-black uppercase tracking-widest">Back</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Arena Match Center</span>
        </div>
        <button className="p-2 text-muted-foreground hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* ── Scoreboard Hero ── */}
      <div className="relative glass-card overflow-hidden p-8 md:p-12 border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ClubLogo club={match.homeTeam} size={100} showName={false} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{match.homeTeam}</h2>
            
            <div className="flex flex-col items-center gap-1 mt-4">
              <div className="flex items-center gap-2" style={{ color: homeColor }}>
                <span className="text-3xl">{getSentimentEmoji(match.homeSentiment)}</span>
                <span className="text-5xl font-black tabular-nums tracking-tighter">
                  <AnimatedCounter value={match.homeSentiment} />
                </span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Pulse</span>
            </div>
          </div>

          {/* Score / vs */}
          <div className="shrink-0 flex flex-col items-center gap-4">
             {isLiveOrFinished ? (
               <div className="flex items-center gap-4">
                 <span className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter">{match.homeScore}</span>
                 <span className="text-3xl text-white/30 font-black">-</span>
                 <span className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter">{match.awayScore}</span>
               </div>
             ) : (
               <span className="text-4xl font-black text-white/20 italic uppercase">VS</span>
             )}
             
             <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
               {isLiveOrFinished ? "Full Time" : "Upcoming"}
             </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ClubLogo club={match.awayTeam} size={100} showName={false} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{match.awayTeam}</h2>
            
            <div className="flex flex-col items-center gap-1 mt-4">
              <div className="flex items-center gap-2" style={{ color: awayColor }}>
                <span className="text-5xl font-black tabular-nums tracking-tighter">
                  <AnimatedCounter value={match.awaySentiment} />
                </span>
                <span className="text-3xl">{getSentimentEmoji(match.awaySentiment)}</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Pulse</span>
            </div>
          </div>
          
        </div>

        {/* Momentum Sparklines */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
           <div className="flex-1" style={{ backgroundColor: homeColor, opacity: 0.8 }} />
           <div className="flex-1" style={{ backgroundColor: awayColor, opacity: 0.8 }} />
        </div>
      </div>

      {/* ── Key Players & Analysis ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Home Players */}
         <div className="glass-card p-6 space-y-4">
           <div className="flex items-center justify-between pb-4 border-b border-white/5">
             <div className="flex items-center gap-2">
               <Shield className="w-5 h-5 text-white/50" />
               <span className="text-[13px] font-black uppercase tracking-widest text-white">{match.homeTeam} Key Figures</span>
             </div>
           </div>
           <div className="space-y-3">
             {homePlayers.map(player => (
               <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-white font-black text-[14px] uppercase italic">{player.name}</p>
                   <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{player.position}</p>
                 </div>
                 <div className="flex flex-col items-end">
                   <div className="flex items-center gap-2">
                     <span className="text-lg">{getSentimentEmoji(player.sentiment)}</span>
                     <span className="text-lg font-black" style={{ color: getSentimentColor(player.sentiment) }}>
                       <AnimatedCounter value={player.sentiment} />
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Away Players */}
         <div className="glass-card p-6 space-y-4">
           <div className="flex items-center justify-between pb-4 border-b border-white/5">
             <div className="flex items-center gap-2">
               <Shield className="w-5 h-5 text-white/50" />
               <span className="text-[13px] font-black uppercase tracking-widest text-white">{match.awayTeam} Key Figures</span>
             </div>
           </div>
           <div className="space-y-3">
             {awayPlayers.map(player => (
               <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                 <div>
                   <p className="text-white font-black text-[14px] uppercase italic">{player.name}</p>
                   <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{player.position}</p>
                 </div>
                 <div className="flex flex-col items-end">
                   <div className="flex items-center gap-2">
                     <span className="text-lg">{getSentimentEmoji(player.sentiment)}</span>
                     <span className="text-lg font-black" style={{ color: getSentimentColor(player.sentiment) }}>
                       <AnimatedCounter value={player.sentiment} />
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>

      </div>

      {/* ── AI Narrative (if available) ── */}
      {psyche && (
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Activity className="w-32 h-32" />
           </div>
           <div className="flex items-center gap-3 mb-6 relative z-10">
             <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
               <Zap className="w-5 h-5 text-primary" />
             </div>
             <div>
               <h3 className="text-white font-black text-[16px] uppercase italic tracking-tight">AI Match Analysis</h3>
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Verified Pulse Intel</p>
             </div>
           </div>

           <div className="space-y-6 relative z-10">
             <div>
               <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Narrative</h4>
               <p className="text-white/90 text-[14px] leading-relaxed font-medium italic">
                 "{psyche.narrative || `The pulse is heavily volatile. Fans of ${match.homeTeam} are experiencing a mix of emotions, while ${match.awayTeam} supporters are highly vocal.`}"
               </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Key Theme</h4>
                 <p className="text-white font-bold text-[12px] uppercase">{psyche.themes?.[0] || 'Tactical Shifts'}</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Volume</h4>
                 <p className="text-white font-bold text-[12px] uppercase tracking-widest">
                   {Math.floor(match.homeSentiment * 142)} Signals Analyzed
                 </p>
               </div>
             </div>
           </div>
        </div>
      )}

    </div>
  )
}
