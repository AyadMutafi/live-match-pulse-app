import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const matches = await db.match.findMany({
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json({
      matches,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
