"use client"

import React, { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  variant?: 'ghost' | 'glass' | 'gold'
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

export function ShareButton({ title, text, url, variant = 'glass', size = 'md', label, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Construct X (Twitter) share URL
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url || window.location.href)}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: url || window.location.href,
        })
      } catch (err) {
        // Fallback to X intent if sharing is cancelled or fails
        window.open(shareUrl, '_blank')
      }
    } else {
      window.open(shareUrl, '_blank')
    }
    
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const baseStyles = "relative flex items-center justify-center gap-2 font-black transition-all active:scale-95 rounded-xl transition-all duration-300 overflow-hidden group"
  
  const variants = {
    glass: "glass-card border-primary/20 text-primary hover:border-primary/50 hover:bg-primary/5",
    gold: "bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(252,192,37,0.3)] hover:scale-[1.02] active:scale-100",
    ghost: "hover:bg-muted text-muted-foreground hover:text-foreground"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2.5 text-[12px]"
  }

  return (
    <button
      onClick={handleShare}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
    >
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>SHARED!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>{label || 'SHARE PULSE'}</span>
        </>
      )}
    </button>
  )
}
