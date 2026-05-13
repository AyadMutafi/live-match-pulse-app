import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // using prisma instead of db as it exists in lib/prisma

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Require CRON_SECRET authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Query the database for matches where status === 'live'
    const liveMatches = await prisma.match.findMany({
      where: {
        status: 'live'
      }
    });

    // 3. If no live matches, return
    if (!liveMatches || liveMatches.length === 0) {
      return NextResponse.json({ message: 'No live matches, skipping' });
    }

    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FOOTBALL_DATA_API_KEY missing' }, { status: 500 });
    }

    const results = [];

    // 4. For each live match, call API
    for (const match of liveMatches) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Using match.id as the requested {externalId} parameter
        const response = await fetch(`https://api.football-data.org/v4/matches/${match.id}`, {
          method: 'GET',
          headers: {
            'X-Auth-Token': apiKey
          },
          signal: controller.signal as any
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(`[Live Pulse] Failed to fetch match ${match.id}: ${response.status}`);
          results.push({ id: match.id, success: false, error: `API responded with ${response.status}` });
          continue;
        }

        const data = await response.json();
        
        // 5. Map statuses
        let mappedStatus = 'upcoming';
        if (['IN_PLAY', 'LIVE', 'PAUSED', 'HALFTIME'].includes(data.status)) {
          mappedStatus = 'live';
        } else if (data.status === 'FINISHED') {
          mappedStatus = 'finished';
        } else if (['POSTPONED', 'CANCELLED'].includes(data.status)) {
          mappedStatus = 'cancelled';
        }

        const homeScore = data.score?.fullTime?.home ?? 0;
        const awayScore = data.score?.fullTime?.away ?? 0;

        // 6. Update the match in the database
        await prisma.match.update({
          where: { id: match.id },
          data: {
            status: mappedStatus,
            homeScore: homeScore,
            awayScore: awayScore,
            lastUpdated: new Date()
          }
        });

        results.push({
          id: match.id,
          success: true,
          status: mappedStatus,
          homeScore,
          awayScore
        });

      } catch (err: any) {
        console.error(`[Live Pulse] Error processing match ${match.id}:`, err);
        results.push({ id: match.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${liveMatches.length} live matches`,
      results
    });

  } catch (error: any) {
    console.error('[Live Pulse Cron Error]:', error);
    return NextResponse.json({ error: 'Internal server error', msg: error.message }, { status: 500 });
  }
}
