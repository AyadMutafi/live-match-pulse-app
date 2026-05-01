import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const activities = await db.agentActivity.findMany({
      where: {
        timestamp: {
          gte: fortyEightHoursAgo
        }
      },
      take: 15,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agent activities' }, { status: 500 });
  }
}
