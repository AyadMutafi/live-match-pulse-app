'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an analytics provider
    console.error('Arena System Error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="relative bg-red-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
            ARENA SYSTEM COLLAPSE
          </h1>
          <p className="text-zinc-400 max-w-xs mx-auto text-sm leading-relaxed">
            The digital pulse has encountered a critical interference. Our AI agents are currently recalibrating the signal.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-black/40 rounded-lg text-left overflow-auto max-w-md">
              <code className="text-[10px] text-red-400 font-mono">
                {error.message || 'Unknown protocol error'}
              </code>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold tracking-tight px-8 py-6 h-auto rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          REBOOT PULSE
        </Button>
        
        <Link href="/">
          <Button 
            variant="outline"
            className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 font-bold tracking-tight px-8 py-6 h-auto rounded-xl transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            RETURN TO HUB
          </Button>
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        Protocol: Emergency Maintenance Active
      </div>
    </div>
  )
}
