import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { date: 'desc' },
      include: {
        sentiments: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    })
    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Failed to load matches' }, { status: 500 })
  }
}
