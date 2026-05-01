import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    const whereClause = matchId ? { matchId } : {};

    const signals = await db.interceptedSignal.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20 // Return the latest 20 signals
    });

    return NextResponse.json({ signals });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}
