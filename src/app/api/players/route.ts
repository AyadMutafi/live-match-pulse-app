import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

// Dynamically calculate the current football week based on the season start date
function getCurrentWeekNumber(): number {
  // 2024-25 Premier League season started August 16, 2024
  const seasonStart = new Date('2024-08-16')
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.max(1, Math.floor((now.getTime() - seasonStart.getTime()) / msPerWeek) + 1)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const weekParam = searchParams.get('week') || 'current'
    const currentWeek = getCurrentWeekNumber()

    // Resolve the week parameter to a number
    let targetWeekNumber: number | null = null
    if (weekParam === 'current') {
      targetWeekNumber = null // no filter — get all current data
    } else if (weekParam === 'last') {
      targetWeekNumber = currentWeek - 1
    } else if (weekParam.startsWith('week-')) {
      const parsed = parseInt(weekParam.replace('week-', ''), 10)
      if (!isNaN(parsed)) targetWeekNumber = parsed
    }

    // 1. Fetch players, filtering by weekNumber if a historical week was requested
    const players = await prisma.player.findMany({
      where: targetWeekNumber !== null
        ? { weekNumber: targetWeekNumber, season: '2024-25' }
        : {},
      include: {
        sentiments: {
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    })

    // 2. Fetch all matches to correlate players to their team's recent matches
    const matches = await prisma.match.findMany({
      orderBy: { date: 'desc' }
    })

    // 3. Process each player to apply the 70/30 matchday weighting rule
    const processedPlayers = players.map(player => {
      // Find the most recent match for this player's team
      const teamMatch = matches.find(m => m.homeTeam === player.team || m.awayTeam === player.team)
      
      let finalSentiment = player.sentiment
      
      if (teamMatch) {
        const matchStart = new Date(teamMatch.date).getTime()
        // Window: during the match (~2 hours) + 3 hours after = 5 hours total from kickoff
        const windowEnd = matchStart + (5 * 60 * 60 * 1000)

        // Isolate sentiments that strictly fall within this 5-hour matchday window
        const matchdaySentiments = player.sentiments.filter(s => {
          const sTime = new Date(s.timestamp).getTime()
          return sTime >= matchStart && sTime <= windowEnd
        })

        if (matchdaySentiments.length > 0) {
          // Calculate the average score from the matchday specifically
          const matchdayAvg = matchdaySentiments.reduce((acc, s) => acc + s.score, 0) / matchdaySentiments.length
          
          // Apply the rule: 70% matchday data, 30% baseline/historical sentiment
          finalSentiment = Math.round((matchdayAvg * 0.7) + (player.sentiment * 0.3))
        }
      }

      return {
        ...player,
        sentiment: finalSentiment,
        historicalSentiment: player.sentiment
      }
    })

    // 4. Sort by weighted sentiment descending
    processedPlayers.sort((a, b) => b.sentiment - a.sentiment)

    return NextResponse.json(processedPlayers)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 })
  }
}
