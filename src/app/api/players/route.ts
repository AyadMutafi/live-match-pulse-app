import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: { 
        sentiments: { 
          orderBy: { timestamp: 'desc' }, 
          take: 10 
        } 
      },
      orderBy: { sentiment: 'desc' }
    })
    return NextResponse.json(players)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 })
  }
}
