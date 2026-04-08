'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
      } else {
        setError(data.error || 'Identity verification failed.')
      }
    } catch (err) {
      setError('Connection disrupted. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e13] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4 shadow-[0_0_40px_rgba(var(--primary),0.15)]">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground mb-2">
            Pulse <span className="text-primary italic">Arena</span>
          </h1>
          <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.3em]">Curation Nexus Access</p>
        </div>

        <div className="glass-card p-8 border-t-4 border-primary shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                  <User className="w-3 h-3" /> Agent Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all pr-10"
                    placeholder="ENTER ID..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                  <Lock className="w-3 h-3" /> Authorization Hash
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-30 group-focus-within:opacity-100 transition-opacity">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-3 text-destructive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-tight">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-all group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Secure Encryption Layer Active</span>
             </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
          Fan Pulse Digital Colosseum · v2.0-secure
        </div>
      </motion.div>
    </div>
  )
}
