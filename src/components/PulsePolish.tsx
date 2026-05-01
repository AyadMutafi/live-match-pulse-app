"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Animated number counter that counts up from 0 to `value` when it enters the viewport.
 * Use this anywhere a sentiment percentage or stat is displayed.
 */
export function AnimatedCounter({ value, suffix = '%', duration = 0.8, className, style }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const increment = end / (duration * 60) // ~60fps
    let frame: number

    const step = () => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        return
      }
      setDisplay(Math.floor(start))
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {display}{suffix}
    </span>
  )
}

/**
 * Minimal sparkline SVG — shows a trend over the last N data points.
 * Pass an array of numbers (e.g. last 5 match sentiments).
 * No axes, no labels — just a clean, glowing trend line.
 */
interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

export function Sparkline({ data, width = 60, height = 20, color = 'hsl(var(--primary))', className }: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2 // 2px padding
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  // Determine trend
  const trend = data[data.length - 1] - data[0]
  const trendColor = trend > 5 ? '#22c55e' : trend < -5 ? '#ef4444' : color

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* Glow filter */}
      <defs>
        <filter id="sparkline-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={trendColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sparkline-glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* End dot */}
      <motion.circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="2"
        fill={trendColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      />
    </svg>
  )
}

/**
 * Skeleton loader — a pulsing placeholder rectangle.
 * Use these to replace loading spinners.
 */
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'card' | 'bar'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-3/4 rounded',
    circle: 'w-12 h-12 rounded-full',
    card: 'h-32 w-full rounded-2xl',
    bar: 'h-2 w-full rounded-full',
  }

  return (
    <div
      className={`animate-pulse bg-muted/30 ${variants[variant]} ${className || ''}`}
    />
  )
}

/**
 * Full dashboard skeleton — replaces the spinning loader on the home page
 */
export function DashboardSkeleton() {
  return (
    <div className="px-4 md:px-8 py-8 max-w-md md:max-w-full mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Featured match skeleton */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-6">
          <Skeleton variant="circle" className="w-20 h-20" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton variant="circle" className="w-14 h-14" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>

      {/* Intelligence feed skeleton */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Skeleton variant="card" className="h-20" />
          <Skeleton variant="card" className="h-20" />
        </div>
      </div>

      {/* Player cards skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-14" />
                </div>
              </div>
              <Skeleton variant="bar" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
