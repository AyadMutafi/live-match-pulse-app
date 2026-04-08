import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
    })
    
    return NextResponse.json(tweets)
  } catch (error: any) {
    console.error('Error fetching tweets:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
