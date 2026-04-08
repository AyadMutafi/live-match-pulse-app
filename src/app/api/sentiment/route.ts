import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('matchId')
  const playerId = searchParams.get('playerId')

  try {
    const sentiments = await prisma.sentiment.findMany({
      where: {
        ...(matchId ? { matchId } : {}),
        ...(playerId ? { playerId } : {})
      },
      orderBy: { timestamp: 'desc' }
    })
    return NextResponse.json(sentiments)
  } catch (error) {
    console.error('Error fetching sentiments:', error)
    return NextResponse.json({ error: 'Failed to load sentiments' }, { status: 500 })
  }
}
