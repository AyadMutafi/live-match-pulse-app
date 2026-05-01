import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Retrieves intercepted signals (top tweets) for specific clubs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubId = searchParams.get('clubId');

  try {
    const signals = await db.interceptedSignal.findMany({
      where: clubId ? { clubId } : { clubId: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ signals });
  } catch (error) {
    console.error('Failed to fetch club signals:', error);
    return NextResponse.json({ signals: [] }, { status: 500 });
  }
}
