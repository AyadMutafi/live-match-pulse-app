// Shared sentiment helpers used across multiple pages

export type SentimentResult = {
  emoji: string
  label: string
  color: string
  bg: string
}

export function getSentimentEmoji(score: number): SentimentResult {
  if (score >= 90) return { emoji: '🔥', label: 'On Fire',    color: '#f97316', bg: 'rgba(249,115,22,0.12)'  }
  if (score >= 70) return { emoji: '😍', label: 'Love It',   color: '#ec4899', bg: 'rgba(236,72,153,0.12)'  }
  if (score >= 50) return { emoji: '🙂', label: 'Good',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  }
  if (score >= 30) return { emoji: '😐', label: 'Meh',       color: '#94a3b8', bg: 'rgba(148,163,184,0.10)' }
  if (score >= 10) return { emoji: '😤', label: 'Frustrated',color: '#f87171', bg: 'rgba(248,113,113,0.12)' }
  return               { emoji: '💩', label: 'Awful',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   }
}

export function getSentimentBarColor(score: number): string {
  if (score >= 90) return 'linear-gradient(90deg,#f97316,#ef4444)'
  if (score >= 70) return 'linear-gradient(90deg,#a855f7,#ec4899)'
  if (score >= 50) return 'linear-gradient(90deg,#3b82f6,#60a5fa)'
  if (score >= 30) return 'linear-gradient(90deg,#64748b,#94a3b8)'
  return 'linear-gradient(90deg,#dc2626,#ef4444)'
}
