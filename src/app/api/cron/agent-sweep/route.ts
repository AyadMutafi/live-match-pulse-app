import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AGENT_TOOLS } from '@/lib/agents/manifest';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('[Agent Sweep] Starting orchestration cron...');
    
    // 1. Get status info via Scout Agent
    const status = await AGENT_TOOLS.get_app_status.execute({});
    const liveMatches = status.liveMatches || [];
    const results = [];

    // 2. Analyst Agent: Scrape Live Matches
    for (const match of liveMatches) {
      console.log(`[Agent Sweep] Scraping live match: ${match.homeTeam} vs ${match.awayTeam}`);
      const matchResult = await AGENT_TOOLS.scrape_social_data.execute({
        entityType: 'match',
        entityId: match.id
      });
      
      // If we got content, analyze it
      if (matchResult && matchResult.success && matchResult.content) {
        // Find existing match data to get previous sentiments
        const matchData = await db.match.findUnique({ where: { id: match.id } });
        
        // Analyze Home Team
        const homeAnalysis = await AGENT_TOOLS.analyze_sentiment.execute({
          rawContent: matchResult.content,
          entityLabel: match.homeTeam,
          previousScore: matchData?.homeSentiment || 50
        });

        // Analyze Away Team
        const awayAnalysis = await AGENT_TOOLS.analyze_sentiment.execute({
          rawContent: matchResult.content,
          entityLabel: match.awayTeam,
          previousScore: matchData?.awaySentiment || 50
        });

        // Save
        await db.match.update({
          where: { id: match.id },
          data: {
            homeSentiment: homeAnalysis.sentiment,
            awaySentiment: awayAnalysis.sentiment,
            volatility: homeAnalysis.volatility,
            momentum: homeAnalysis.momentum,
            predictedScore: homeAnalysis.predictedScore,
            lastUpdated: new Date()
          }
        });
        
        // Let Journalist Agent write the intel
        if (Math.abs(homeAnalysis.sentiment - awayAnalysis.sentiment) > 20) {
          await AGENT_TOOLS.publish_rivals_intel.execute({
            matchId: match.id,
            analysisText: `Fierce battle in the digital arena! Fans of ${match.homeTeam} are at ${homeAnalysis.sentiment}% pulse, while ${match.awayTeam} supporters are feeling ${awayAnalysis.sentiment}%. The momentum swings are profound.`
          });
        }
      }
      
      results.push({ type: 'match', id: match.id, success: matchResult?.success });
      await new Promise(r => setTimeout(r, 2000)); // rate limiting
    }

    // 3. Analyst Agent: Scrape Custom Admin Sources
    const sources = await db.dataSource.findMany({ where: { isActive: true } });
    for (const source of sources) {
      console.log(`[Agent Sweep] Scraping custom source: ${source.name}`);
      if (AGENT_TOOLS.scrape_from_source) {
        const sourceResult = await AGENT_TOOLS.scrape_from_source.execute({
          sourceId: source.id
        });
        
        results.push({ type: 'source', id: source.id, success: sourceResult?.success });
        
        await db.dataSource.update({
          where: { id: source.id },
          data: { lastScraped: new Date() }
        });

        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Agent sweep orchestration completed',
      sweptMatches: liveMatches.length,
      sweptSources: sources.length,
      results
    });
  } catch (error: any) {
    console.error('[Agent Sweep Error]:', error);
    return NextResponse.json({ error: 'Agent Sweep failed', msg: error.message }, { status: 500 });
  }
}
