import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activities = await prisma.agentActivity.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    })
    return NextResponse.json(activities)
  } catch (error: any) {
    console.error('Failed to load agent activity:', error)
    return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 })
  }
}
