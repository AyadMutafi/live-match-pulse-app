import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await db.match.findUnique({
      where: { id }
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Also fetch players from these teams to show key players
    const players = await db.player.findMany({
      where: {
        team: { in: [match.homeTeam, match.awayTeam] }
      },
      orderBy: { sentiment: 'desc' }
    });

    return NextResponse.json({
      match,
      players,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}
