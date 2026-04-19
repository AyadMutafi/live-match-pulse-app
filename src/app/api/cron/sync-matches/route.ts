import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FOOTBALL_DATA_API_KEY is not defined' }, { status: 500 });
    }

    const competitions = '2021,2014,2001,2000,2015,2002,2019';

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 3);
    const dateFromStr = dateFrom.toISOString().split('T')[0];

    const dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + 6);
    const dateToStr = dateTo.toISOString().split('T')[0];

    console.log(`[Sync] Fetching matches from ${dateFromStr} to ${dateToStr}...`);

    const apiUrl = `https://api.football-data.org/v4/matches?competitions=${competitions}&dateFrom=${dateFromStr}&dateTo=${dateToStr}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Sync Error]', response.status, errText);
      throw new Error(`API responded with ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const fetchedMatches = data.matches || [];
    let upsertedCount = 0;

    for (const match of fetchedMatches) {
      let mappedStatus = 'upcoming';
      if (['IN_PLAY', 'LIVE', 'PAUSED'].includes(match.status)) {
        mappedStatus = 'live';
      } else if (match.status === 'FINISHED') {
        mappedStatus = 'finished';
      } else if (['POSTPONED', 'CANCELLED', 'SUSPENDED'].includes(match.status)) {
        mappedStatus = 'cancelled';
      }

      let leagueName = match.competition?.name || 'Unknown League';
      if (match.competition?.code === 'PL') leagueName = 'Premier League';
      if (match.competition?.code === 'PD') leagueName = 'La Liga';
      if (match.competition?.code === 'CL') leagueName = 'Champions League';
      if (match.competition?.code === 'FAC' || match.competition?.code === 'WC') leagueName = 'FA Cup';

      const homeTeam = match.homeTeam?.shortName || match.homeTeam?.name || 'Unknown Home';
      const awayTeam = match.awayTeam?.shortName || match.awayTeam?.name || 'Unknown Away';

      const homeScore = match.score?.fullTime?.home ?? 0;
      const awayScore = match.score?.fullTime?.away ?? 0;

      const matchDateObj = new Date(match.utcDate);

      const existingMatch = await prisma.match.findFirst({
        where: {
          homeTeam: { contains: homeTeam },
          awayTeam: { contains: awayTeam },
          league: leagueName
        }
      });

      if (existingMatch) {
         await prisma.match.update({
           where: { id: existingMatch.id },
           data: {
             homeScore: homeScore,
             awayScore: awayScore,
             status: mappedStatus,
             date: matchDateObj
           }
         });
      } else {
         await prisma.match.create({
           data: {
             homeTeam: homeTeam,
             awayTeam: awayTeam,
             homeScore: homeScore,
             awayScore: awayScore,
             status: mappedStatus,
             league: leagueName,
             date: matchDateObj,
             homeSentiment: 50,
             awaySentiment: 50
           }
         });
      }
      
      upsertedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${upsertedCount} matches`,
      dateFrom: dateFromStr,
      dateTo: dateToStr,
    });
  } catch (error: any) {
    console.error('[Cron/Sync Error]:', error);
    return NextResponse.json({ error: 'Failed to process match synchronization', msg: error.message }, { status: 500 });
  }
}
