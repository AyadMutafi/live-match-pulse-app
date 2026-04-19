import { NextRequest, NextResponse } from 'next/server';
import { scrapePlayerSentiment, scrapeMatchSentiment } from '@/lib/firecrawl';
import { db } from '@/lib/db';
import { analyzeSentimentWithAI } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, playerName, teamName, homeTeam, awayTeam, hashtag, playerId, matchId } = body;

    // Determine target date for strict temporal filtering
    let targetDate: string | undefined = undefined;
    let matchData: any = null;
    if (matchId) {
      matchData = await db.match.findUnique({ where: { id: matchId } });
      if (matchData) {
        targetDate = matchData.date.toISOString();
      }
    }

    if (type === 'player') {
      const scrapeResult = await scrapePlayerSentiment(playerName, teamName, targetDate);
      if (!scrapeResult.success || !scrapeResult.content) {
        return NextResponse.json({ error: scrapeResult.error || 'No content found' }, { status: 500 });
      }

      // Get previous sentiment for momentum calculation
      const player = playerId ? await db.player.findUnique({ where: { id: playerId } }) : null;
      const analysis = await analyzeSentimentWithAI(scrapeResult.content, playerName, player?.sentiment || 50);

      // Update database if playerId provided
      if (playerId) {
        await db.player.update({
          where: { id: playerId },
          data: {
            sentiment: Math.max(0, Math.min(100, analysis.sentiment)), // Clamp to 0-100 for UI consistency if needed
            lastUpdated: new Date()
          }
        });

        // Store sentiment record
        await db.sentiment.create({
          data: {
            score: analysis.sentiment,
            source: 'firecrawl',
            themes: JSON.stringify({
              positive: analysis.positiveThemes,
              negative: analysis.negativeThemes,
              volatility: analysis.volatility,
              momentum: analysis.momentum
            }),
            playerId,
            matchId: matchId || null
          }
        });
      }

      return NextResponse.json({
        success: true,
        playerName,
        ...analysis,
        scrapedAt: scrapeResult.timestamp,
        source: 'firecrawl'
      });
    }

    if (type === 'match') {
      const scrapeResult = await scrapeMatchSentiment(homeTeam, awayTeam, hashtag, targetDate);
      if (!scrapeResult.success || !scrapeResult.content) {
        return NextResponse.json({ error: scrapeResult.error || 'No content found' }, { status: 500 });
      }

      // Analyze home AND away team sentiment in parallel
      const [homeAnalysis, awayAnalysis] = await Promise.all([
        analyzeSentimentWithAI(scrapeResult.content, homeTeam, matchData?.homeSentiment || 50),
        analyzeSentimentWithAI(scrapeResult.content, awayTeam, matchData?.awaySentiment || 50)
      ]);
      
      // Update match record with advanced vectors
      if (matchId) {
        await db.match.update({
          where: { id: matchId },
          data: {
            homeSentiment: homeAnalysis.sentiment,
            awaySentiment: awayAnalysis.sentiment,
            volatility: homeAnalysis.volatility, // Using home volatility as primary
            momentum: homeAnalysis.momentum, // Using home momentum as primary
            predictedScore: homeAnalysis.predictedScore,
            lastUpdated: new Date()
          }
        });
      }

      return NextResponse.json({
        success: true,
        homeTeam,
        awayTeam,
        homeAnalysis,
        awayAnalysis,
        scrapedAt: scrapeResult.timestamp,
        source: 'firecrawl'
      });
    }

    return NextResponse.json({ error: 'Invalid type. Use "player" or "match"' }, { status: 400 });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape', 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'status';

  if (type === 'status') {
    return NextResponse.json({
      status: 'Firecrawl integration ready with Date Filtering',
      endpoints: {
        'POST /api/scrape [player]': {
          type: 'player',
          params: ['playerName', 'teamName', 'playerId (optional)', 'matchId (optional)']
        },
        'POST /api/scrape [match]': {
          type: 'match', 
          params: ['homeTeam', 'awayTeam', 'hashtag', 'matchId (optional)']
        }
      }
    });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}
