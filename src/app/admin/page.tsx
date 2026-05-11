'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Users, Database, Activity, ShieldCheck, 
  Settings, LogOut, ChevronRight, Hash, UserCircle, 
  Globe, LayoutDashboard, Search, Zap, CheckCircle2,
  Lock, ArrowRight, UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CLUBS } from '@/lib/clubs'
import { ClubLogo } from '@/components/ClubLogo'

type Session = {
  userId: string
  username: string
  role: 'ADMIN' | 'EDITOR'
  assignedTeam?: string | null
}

type User = {
  id: string
  username: string
  role: string
  assignedTeam: string | null
}

type DataSource = {
  id: string
  name: string
  type: string
  url: string
  clubId: string | null
}

type AgentActivity = {
  id: string
  agent: string
  action: string
  target: string
  status: string
  message: string | null
  timestamp: string
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [sources, setSources] = useState<DataSource[]>([])
  const [activities, setActivities] = useState<AgentActivity[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('nexus') // Changed default
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddSource, setShowAddSource] = useState(false)
  const [editingEntity, setEditingEntity] = useState<any>(null)
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'EDITOR', assignedTeam: '' })
  const [newSource, setNewSource] = useState({ name: '', type: 'HASHTAG', url: '', clubId: '' })
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, sourcesRes, activitiesRes, entitiesRes, configRes] = await Promise.all([
          fetch('/api/auth/session'), 
          fetch('/api/admin/sources'),
          fetch('/api/admin/activity'),
          fetch('/api/admin/entities'),
          fetch('/api/admin/config')
        ])
        
        if (!sessionRes.ok) return router.push('/login')
        const sessionData = await sessionRes.json()
        setSession(sessionData)
        setSources(await sourcesRes.json())
        setActivities(await activitiesRes.json())
        const entities = await entitiesRes.json()
        setPlayers(entities.players || [])
        setMatches(entities.matches || [])
        setConfig(await configRes.json())
        
        if (sessionData.role === 'ADMIN') {
          const usersRes = await fetch('/api/admin/users')
          setUsers(await usersRes.json())
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    if (res.ok) {
      const added = await res.json()
      setUsers([added, ...users])
      setShowAddUser(false)
      setNewUser({ username: '', password: '', role: 'EDITOR', assignedTeam: '' })
    }
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { 
        ...newSource, 
        clubId: session?.role === 'ADMIN' ? newSource.clubId : session?.assignedTeam 
    }
    const res = await fetch('/api/admin/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const added = await res.json()
      setSources([added, ...sources])
      setShowAddSource(false)
      setNewSource({ name: '', type: 'HASHTAG', url: '', clubId: '' })
    }
  }

  const handleDeleteSource = async (id: string) => {
    const res = await fetch('/api/admin/sources', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) setSources(sources.filter(s => s.id !== id))
  }

  const handleDeleteUser = async (id: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) setUsers(users.filter(u => u.id !== id))
  }

  const handleToggleConfig = async (key: string) => {
    if (!config) return
    const newConfig = { ...config, [key]: !config[key] }
    const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
    })
    if (res.ok) setConfig(newConfig)
  }

  const handleUpdateOverride = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEntity)
    })
    if (res.ok) {
        // Refresh entities
        const entitiesRes = await fetch('/api/admin/entities')
        const entities = await entitiesRes.json()
        setPlayers(entities.players)
        setMatches(entities.matches)
        setEditingEntity(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0e0e13] flex flex-col items-center justify-center gap-4">
      <Zap className="w-8 h-8 text-primary animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establishing Secure Nexus...</span>
    </div>
  )

  if (!session) return null

  const isAdmin = session.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#0e0e13] text-foreground p-6 pb-24 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Curation <span className="text-primary italic">Nexus</span></h1>
            <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                    {session.role}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-40">Agent: {session.username}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-transparent border-white/5 hover:bg-destructive/10 hover:text-destructive transition-all gap-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
        
        {/* ── Sidebar Nav ────────────────────────────────────────────────── */}
        <aside className="space-y-2">
            <button 
                onClick={() => setActiveTab('nexus')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'nexus' ? 'bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
            >
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-widest">Sovereign Nexus</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'nexus' ? 'rotate-90' : ''}`} />
            </button>

            <button 
                onClick={() => setActiveTab('curation')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'curation' ? 'bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
            >
                <div className="flex items-center gap-3">
                    <Database className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-widest">Pulse Sources</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'curation' ? 'rotate-90' : ''}`} />
            </button>
            
            <button 
                onClick={() => setActiveTab('overrides')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'overrides' ? 'bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
            >
                <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-widest">Truth Override</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'overrides' ? 'rotate-90' : ''}`} />
            </button>

            <button 
                onClick={() => setActiveTab('activity')}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'activity' ? 'bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
            >
                <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4" />
                    <span className="text-[12px] font-black uppercase tracking-widest">Agent Activity</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'activity' ? 'rotate-90' : ''}`} />
            </button>
            
            {isAdmin && (
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === 'users' ? 'bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span className="text-[12px] font-black uppercase tracking-widest">Agent Roster</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'users' ? 'rotate-90' : ''}`} />
                </button>
            )}
            
            <div className="pt-8 px-4 opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4">Operations Center</p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-bold">API Status: Nominal</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold">Region: GLOBAL-01</span>
                    </div>
                </div>
            </div>
        </aside>

        {/* ── Main Content Area ─────────────────────────────────────────── */}
        <section className="space-y-8">
            <AnimatePresence mode="wait">
                {activeTab === 'nexus' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-8 bg-surface-container-high border-2 border-primary/10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Kill Switch</h3>
                                    <div className={`w-2 h-2 rounded-full ${config?.isAgentEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-destructive'}`} />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-6 leading-relaxed">
                                    Instantly halt all autonomous agent missions. This preserves credits and locks all current data.
                                </p>
                                <Button 
                                    onClick={() => handleToggleConfig('isAgentEnabled')}
                                    className={`w-full py-6 rounded-xl font-black uppercase tracking-widest ${config?.isAgentEnabled ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}
                                >
                                    {config?.isAgentEnabled ? 'Deactivate Agents' : 'Restore Agents'}
                                </Button>
                            </div>

                            <div className="glass-card p-8 bg-surface-container-high border-2 border-primary/10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Match Day Mode</h3>
                                    <Zap className={`w-4 h-4 ${config?.matchDayMode ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-6 leading-relaxed">
                                    Enables high-frequency (1m) polling for live matches. Use only during active UEFA or PL match windows.
                                </p>
                                <Button 
                                    onClick={() => handleToggleConfig('matchDayMode')}
                                    className={`w-full py-6 rounded-xl font-black uppercase tracking-widest ${config?.matchDayMode ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10'}`}
                                >
                                    {config?.matchDayMode ? 'ACTIVE' : 'Standby'}
                                </Button>
                            </div>

                            <div className="glass-card p-8 bg-surface-container-high border-2 border-primary/10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest">Maintenance</h3>
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-6 leading-relaxed">
                                    Public-facing maintenance mode. All routes except /admin will be locked for users.
                                </p>
                                <Button 
                                    onClick={() => handleToggleConfig('maintenanceMode')}
                                    className={`w-full py-6 rounded-xl font-black uppercase tracking-widest ${config?.maintenanceMode ? 'bg-primary text-black' : 'bg-white/5 border border-white/10'}`}
                                >
                                    {config?.maintenanceMode ? 'LOCKED' : 'Public'}
                                </Button>
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-surface-container-high border-2 border-primary/10">
                            <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Live Nexus Map</h3>
                            <div className="aspect-[21/9] bg-black/40 rounded-3xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                                <div className="flex flex-col items-center gap-2">
                                    <Globe className="w-12 h-12 text-primary/40 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Pulse Stream Online</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'overrides' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic text-amber-500">Truth Override</h2>
                                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">Manually nudge sentiment scores for players and matches</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest opacity-40 px-2">Player Overrides</h3>
                                {players.map(p => (
                                    <div key={p.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group" onClick={() => setEditingEntity({ type: 'player', id: p.id, name: p.name, isManual: p.isManual, manualSentiment: p.sentiment })}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-black text-sm text-primary">
                                                {p.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black uppercase">{p.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{p.team}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-black tracking-tighter">{p.sentiment}%</p>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${p.isManual ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                                    {p.isManual ? 'MANUAL' : 'AUTO'}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest opacity-40 px-2">Match Overrides</h3>
                                {matches.map(m => (
                                    <div key={m.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group" onClick={() => setEditingEntity({ type: 'match', id: m.id, name: `${m.homeTeam} vs ${m.awayTeam}`, isManual: m.isManual, manualHomeSentiment: m.homeSentiment, manualAwaySentiment: m.awaySentiment })}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">{m.homeTeam[0]}</div>
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black">{m.awayTeam[0]}</div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase leading-tight">{m.homeTeam} vs {m.awayTeam}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground opacity-60 uppercase">{m.league}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-black tracking-tighter">{m.homeSentiment}% | {m.awaySentiment}%</p>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${m.isManual ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                                    {m.isManual ? 'MANUAL' : 'AUTO'}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'curation' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic">Pulse Curation</h2>
                                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">Manage hashtags and influencers for live matching</p>
                            </div>
                            <Button onClick={() => setShowAddSource(true)} className="gap-2 bg-primary hover:bg-primary/80">
                                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Source</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sources.map(s => (
                                <div key={s.id} className="glass-card p-5 group flex flex-col h-full bg-surface-container-high relative overflow-hidden">
                                     {/* Owner Badge */}
                                     <div className="absolute top-2 right-2 text-[8px] font-black text-muted-foreground items-center gap-1 flex opacity-40">
                                        <UserCircle className="w-2.5 h-2.5" /> System
                                     </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg ${s.type === 'HASHTAG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                            {s.type === 'HASHTAG' ? <Hash className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-black text-foreground truncate uppercase">{s.name}</p>
                                            <p className="text-[10px] text-muted-foreground/60 truncate font-black mt-0.5">{s.clubId || 'Global'}</p>
                                        </div>
                                    </div>
                                    <div className="text-[11px] font-bold text-muted-foreground/50 break-all mb-4 px-1">{s.url}</div>
                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                        </div>
                                        <button onClick={() => handleDeleteSource(s.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && isAdmin && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic text-amber-500">Agent Roster</h2>
                                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">Authorized curators and team specialists</p>
                            </div>
                            <Button onClick={() => setShowAddUser(true)} variant="outline" className="gap-2 border-white/10 hover:bg-amber-500/10 hover:text-amber-500">
                                <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Recruit Agent</span>
                            </Button>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-muted/40 border-b border-border">
                                    <tr>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Specialization</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4 flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] ${u.username === 'admin' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                                                    {u.username[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold">{u.username}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${u.role === 'ADMIN' ? 'text-amber-500' : 'text-primary'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {u.assignedTeam ? (
                                                    <div className="flex items-center gap-2">
                                                        <ClubLogo club={u.assignedTeam} size={16} />
                                                        <span className="text-[11px] font-bold text-muted-foreground">{u.assignedTeam}</span>
                                                    </div>
                                                ) : <span className="text-[11px] font-bold opacity-30">—</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                {u.username !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'activity' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter italic text-emerald-500">Agent Telemetry</h2>
                                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest mt-1">Live feed of autonomous operations</p>
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-muted/40 border-b border-border">
                                    <tr>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Agent</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status & Message</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activities.map(a => (
                                        <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4 whitespace-nowrap text-[11px] font-bold text-muted-foreground">
                                                {new Date(a.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                                                  a.agent.includes('Scout') ? 'bg-blue-500/10 text-blue-500' : 
                                                  a.agent.includes('Journalist') ? 'bg-purple-500/10 text-purple-500' : 
                                                  'bg-primary/10 text-primary'}`}>
                                                    {a.agent}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[12px] font-bold">{a.target}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'success' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                                    <span className="text-[11px] text-muted-foreground">{a.message || a.action}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {activities.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                No agent activity recorded yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
      </main>

        <AnimatePresence>
            {editingEntity && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setEditingEntity(null)} />
                    <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative bg-surface-container-high border-2 border-primary/20 rounded-[2rem] p-8 w-full max-w-sm shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Override: {editingEntity.name}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Autonomous agents will be restricted from updating this target.</p>
                        
                        <form onSubmit={handleUpdateOverride} className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[11px] font-black uppercase tracking-widest">Manual Mode</span>
                                <button 
                                    type="button"
                                    onClick={() => setEditingEntity({...editingEntity, isManual: !editingEntity.isManual})}
                                    className={`w-12 h-6 rounded-full transition-all relative ${editingEntity.isManual ? 'bg-amber-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingEntity.isManual ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {editingEntity.isManual && (
                                <div className="space-y-4">
                                    {editingEntity.type === 'player' ? (
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Target Sentiment (0-100)</label>
                                            <input 
                                                type="number" 
                                                value={editingEntity.manualSentiment} 
                                                onChange={e => setEditingEntity({...editingEntity, manualSentiment: e.target.value})}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black tracking-tighter focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Home %</label>
                                                <input 
                                                    type="number" 
                                                    value={editingEntity.manualHomeSentiment} 
                                                    onChange={e => setEditingEntity({...editingEntity, manualHomeSentiment: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black tracking-tighter focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Away %</label>
                                                <input 
                                                    type="number" 
                                                    value={editingEntity.manualAwaySentiment} 
                                                    onChange={e => setEditingEntity({...editingEntity, manualAwaySentiment: e.target.value})}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black tracking-tighter focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setEditingEntity(null)} className="flex-1 rounded-xl">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black uppercase tracking-widest">Commit</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
}
