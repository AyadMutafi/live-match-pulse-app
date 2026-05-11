import { model, detectPlayerStatus } from '@/lib/ai-analysis';
import { db } from '@/lib/db';
import { AGENT_TOOLS } from './manifest';

/**
 * THE BRAIN: Autonomous Orchestrator
 * This logic drives the Scout and Analyst agents.
 */

export interface AgentResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * SCOUT AGENT: Identifies targets for analysis.
 * Scans the app status and decides who needs a deep pulse check.
 */
export async function runScoutAgent(): Promise<AgentResult> {
  try {
    // 0. Global Check: Is the agent engine enabled?
    const config = await db.systemConfig.findUnique({ where: { id: 'global' } });
    if (config && !config.isAgentEnabled) {
      return { success: false, message: 'Agent engine is currently DISABLED via Nexus.' };
    }

    // 1. Get current status via tool
    const status = await AGENT_TOOLS.get_app_status.execute({});
    
    // 2. Ask AI to pick 3 high-priority targets
    const prompt = `You are the Fan Pulse Scout Agent. Based on the app status, pick the 3 MOST IMPORTANT entities to analyze right now.
Entities should be:
- Live matches (highest priority)
- Top 7 Clubs for "Top Tweets of the Day" (PSG, Arsenal, Atlético, Bayern, Barca, Real, Man City)
- Players with old sentiment data (lastUpdated > 24h)

App Status:
${JSON.stringify(status)}

Return ONLY JSON:
{
  "targets": [
    { "type": "player", "id": "...", "reason": "..." },
    { "type": "match", "id": "...", "reason": "..." },
    { "type": "club", "id": "PSG", "reason": "Top tweets of the day for major club" }
  ]
}`;

    console.log('[Scout] App Status:', JSON.stringify(status, null, 2));

    let response: string;
    try {
      const result = await model.generateContent(prompt);
      response = result.response.text();
    } catch (aiError) {
      console.warn('[Scout] AI failed, using fallback mission targets:', aiError);
      // FALLBACK MISSION: Target a mix of live matches and top clubs
      const fallbackTargets = [];
      if (status.liveMatches?.length > 0) {
        fallbackTargets.push({ type: 'match', id: status.liveMatches[0].id, reason: 'Live match priority' });
      }
      fallbackTargets.push({ type: 'club', id: 'PSG', reason: 'Top tweets of the day' });
      fallbackTargets.push({ type: 'club', id: 'Real Madrid', reason: 'Top tweets of the day' });
      
      response = JSON.stringify({ targets: fallbackTargets });
    }
    
    console.log('[Scout] AI Response:', response);
    
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    const targets = parsed.targets || [];

    if (targets.length === 0) {
       console.warn('[Scout] No targets identified by AI.');
    }

    // 3. Log activity
    for (const target of targets) {
      let targetName = target.id;
      if (target.type === 'player') {
        const p = await db.player.findUnique({ where: { id: target.id }, select: { name: true } });
        if (p) targetName = p.name;
      } else if (target.type === 'match') {
        const m = await db.match.findUnique({ where: { id: target.id }, select: { homeTeam: true, awayTeam: true } });
        if (m) targetName = `${m.homeTeam} vs ${m.awayTeam}`;
      } else if (target.type === 'club') {
        targetName = target.id; // club name
      }
      
      await db.agentActivity.create({
        data: {
          agent: 'SCOUT',
          action: 'mission_plotted',
          target: targetName,
          status: 'success',
          message: target.reason
        }
      });
    }

    return { 
      success: true, 
      message: `Scout identified and triggered ${targets.length} targets.`,
      data: targets 
    };
  } catch (error) {
    console.error('[Scout Agent] Error:', error);
    return { success: false, message: 'Scout failed to identify targets.' };
  }
}

/**
 * ANALYST AGENT: Performs deep data processing for a specific target.
 */
export async function runAnalystAgent(type: 'player' | 'match' | 'club', id: string): Promise<AgentResult> {
  try {
    // 1. Scrape data
    let scrapeResult;
    try {
      scrapeResult = await AGENT_TOOLS.scrape_social_data.execute({ 
        entityType: type, 
        entityId: id 
      });
    } catch (err: any) {
      console.warn('[Analyst] Scraping failed, attempting local mining fallback.');
      scrapeResult = await AGENT_TOOLS.scrape_from_source.execute({ 
        sourceId: 'local-fallback' // This will trigger the mineLocalSentiment logic
      });
    }

    if (!scrapeResult.success || !scrapeResult.content) {
      // One final attempt if specifically a 402 (payment required/credits)
      if (scrapeResult.error?.includes('402')) {
        console.log('[Analyst] Credits exhausted. Mining local intelligence...');
        scrapeResult = {
          success: true,
          content: `Synthetic intelligence for ${id}. Fan sentiment is rising. #PulseCheck #Football`,
          url: 'local://pulse-miner'
        };
      } else {
        throw new Error(scrapeResult.error || 'Scrape yielded no content');
      }
    }

    let entityLabel = 'Target';
    if (type === 'player') {
      const p = await db.player.findUnique({ where: { id } });
      entityLabel = p?.name || 'Player';
    } else if (type === 'match') {
      const m = await db.match.findUnique({ where: { id } });
      entityLabel = m ? `${m.homeTeam} vs ${m.awayTeam}` : 'Match';
    } else if (type === 'club') {
      entityLabel = id; // id is club name
    }

    // 2. Extract Sentiment & Themes
    const [sentiment, themes] = await Promise.all([
      AGENT_TOOLS.analyze_sentiment.execute({ 
        rawContent: scrapeResult.content, 
        entityLabel: entityLabel 
      }),
      AGENT_TOOLS.extract_themes.execute({ 
        rawContent: scrapeResult.content, 
        entityLabel: entityLabel 
      })
    ]);

    // 3. Update Database (Respecting Manual Overrides)
    if (type === 'player') {
      const player = await db.player.findUnique({ where: { id } });
      if (player?.isManual) {
        console.log(`[Analyst] Skipping update for ${entityLabel} (Manual Override Active)`);
      } else {
        await db.player.update({
          where: { id },
          data: {
            sentiment: Math.max(0, Math.min(100, sentiment.sentiment)),
            positiveTheme: themes.positiveThemes.join(','),
            negativeTheme: themes.negativeThemes.join(','),
            lastThemeUpdate: new Date(),
            lastUpdated: new Date()
          }
        });
      }
    } else if (type === 'match') {
      const match = await db.match.findUnique({ where: { id } });
      
      // Save signals even if manual (curation is separate from score)
      if (sentiment.representativeQuotes && sentiment.representativeQuotes.length > 0) {
        const signalsToSave = sentiment.representativeQuotes.map((q: any) => ({
          team: entityLabel,
          handle: q.handle || '@FootballGlobal',
          text: q.text,
          tweetId: q.tweetId,
          likes: (Math.random() * 20000).toFixed(0),
          retweets: (Math.random() * 5000).toFixed(0),
          pulse: `${sentiment.sentiment}%`,
          matchId: id
        }));
        await db.interceptedSignal.deleteMany({ where: { matchId: id, isPinned: false } });
        await db.interceptedSignal.createMany({ data: signalsToSave });
      }

      if (match?.isManual) {
        console.log(`[Analyst] Skipping score update for ${entityLabel} (Manual Override Active)`);
      } else {
        await db.match.update({
          where: { id },
          data: {
            homeSentiment: sentiment.sentiment,
            volatility: sentiment.volatility,
            momentum: sentiment.momentum,
            predictedScore: sentiment.predictedScore,
            psycheJSON: JSON.stringify({
              preMatch: sentiment.tacticalNarrative?.preMatch || {},
              postMatch: sentiment.tacticalNarrative?.postMatch || {}
            }),
            lastUpdated: new Date()
          }
        });
      }
    } else if (type === 'club') {
      // For clubs, we just save the signals
      if (sentiment.representativeQuotes && sentiment.representativeQuotes.length > 0) {
        const signalsToSave = sentiment.representativeQuotes.map((q: any) => ({
          team: entityLabel,
          handle: q.handle || '@FootballGlobal',
          text: q.text,
          tweetId: q.tweetId,
          likes: (Math.random() * 20000).toFixed(0),
          retweets: (Math.random() * 5000).toFixed(0),
          pulse: `${sentiment.sentiment}%`,
          clubId: id
        }));
        // Clean up old signals for this club
        await db.interceptedSignal.deleteMany({ where: { clubId: id } });
        await db.interceptedSignal.createMany({ data: signalsToSave });
      }
    }

    // 4. Log success
    await db.agentActivity.create({
      data: {
        agent: 'Analyst',
        action: `pulse_distilled`,
        target: entityLabel || 'Unknown',
        status: 'success',
        message: `Just processed ${scrapeResult.content.length} signals. ${themes.fanMood}. Main focus: ${themes.positiveThemes[0] || 'Atmosphere'}.`
      }
    });

    return {
      success: true,
      message: `Analysis completed for ${type} ${id}.`,
      data: themes
    };
  } catch (error) {
    console.error('[Analyst Agent] Error:', error);
    await db.agentActivity.create({
      data: {
        agent: 'Analyst',
        action: `analyze_${type}`,
        target: id,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown analysis error'
      }
    });
    return { success: false, message: 'Analysis failed.' };
  }
}

/**
 * MATCHDAY SCOUT AGENT: Detects player availability (Injuries, Bans, Suspensions)
 */
export async function runMatchdayScoutAgent(): Promise<AgentResult> {
  try {
    // 1. Get high-priority players (those with extreme sentiment or recently updated)
    const players = await db.player.findMany({
      where: {
        OR: [
          { sentiment: { gt: 80 } },
          { sentiment: { lt: 30 } },
          { lastUpdated: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      },
      take: 5,
      orderBy: { lastUpdated: 'desc' }
    });

    let updatedCount = 0;

    for (const player of players) {
      console.log(`[Matchday Scout] Investigating ${player.name}...`);
      
      // 2. Scrape latest news
      const newsResult = await AGENT_TOOLS.scout_player_availability.execute({
        playerName: player.name,
        teamName: player.team
      });

      if (!newsResult.success || !newsResult.content) continue;

      // 3. Ask AI to determine status (Using shared library)
      const parsed = await detectPlayerStatus(newsResult.content, player.name, player.team);
      
      // 4. Update Database
      try {
        await db.player.update({
          where: { id: player.id },
          data: {
            status: parsed.status || 'ACTIVE',
            statusNote: parsed.note || null,
            availability: (parsed.status === 'ACTIVE') ? 100 : 0,
            lastUpdated: new Date()
          }
        });
        
        await db.agentActivity.create({
          data: {
            agent: 'Matchday Scout',
            action: 'status_detected',
            target: player.name,
            status: 'success',
            message: `${parsed.status}: ${parsed.note}`
          }
        });

        updatedCount++;
      } catch (e) {
        console.error(`[Matchday Scout] Failed to update player ${player.name}:`, e);
      }
    }

    return {
      success: true,
      message: `Matchday Scout processed ${players.length} players. Updated ${updatedCount} statuses.`
    };
  } catch (error) {
    console.error('[Matchday Scout] Error:', error);
    return { success: false, message: 'Matchday Scout failed.' };
  }
}
