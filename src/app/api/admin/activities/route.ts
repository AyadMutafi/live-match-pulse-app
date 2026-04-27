import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const activities = await db.agentActivity.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agent activities' }, { status: 500 });
  }
}
