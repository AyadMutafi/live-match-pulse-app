import { model, detectPlayerStatus } from '@/lib/ai-analysis';
import { db } from '@/lib/db';
import { AGENT_TOOLS } from './manifest';
import { namesMatch } from '@/lib/name-utils';

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
      console.warn(`[Analyst] All scraping failed for match ${id}, marking as STALE`);
      
      if (type === 'match') {
        await db.match.update({
          where: { id },
          data: {
            dataStatus: 'STALE',
            staleAt: new Date()
          }
        });
      }
      
      return { success: false, message: `Scraping failed for ${type} ${id}` };
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
          likes: q.likes ? parseInt(q.likes, 10) : null,
          retweets: q.retweets ? parseInt(q.retweets, 10) : null,
          pulse: `${sentiment.sentiment}%`,
          source: scrapeResult.url?.includes('grok') ? 'grok' : scrapeResult.source || 'agent',
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
          likes: q.likes ? parseInt(q.likes, 10) : null,
          retweets: q.retweets ? parseInt(q.retweets, 10) : null,
          pulse: `${sentiment.sentiment}%`,
          source: scrapeResult.url?.includes('grok') ? 'grok' : scrapeResult.source || 'agent',
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
 * Process all players, prioritizing the stalest ones, in batches.
 */
export async function runMatchdayScoutAgent(playerName?: string): Promise<AgentResult> {
  try {
    let players;
    
    if (playerName) {
      // Fetch all and match in-memory for robust name matching (accents, etc)
      const allPlayers = await db.player.findMany();
      players = allPlayers.filter(p => namesMatch(p.name, playerName));
      
      if (players.length === 0) {
        return { success: false, message: `No player matching "${playerName}" found.` };
      }
    } else {
      players = await db.player.findMany({
        where: {
          OR: [
            { status: 'ACTIVE', lastUpdated: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            { status: { not: 'ACTIVE' } }
          ]
        },
        orderBy: { lastUpdated: 'asc' } // Stalest first
      });
    }

    const summary = { checked: players.length, active: 0, injured: 0, banned: 0, suspended: 0, errors: 0 };
    const BATCH_SIZE = 5;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(player => 
        processPlayerAvailability(player).catch(err => {
          console.error(`[Matchday Scout] Critical error processing ${player.name}:`, err);
          return { status: 'ERROR' };
        })
      ));

      results.forEach(res => {
        if (res.status === 'ACTIVE') summary.active++;
        else if (res.status === 'INJURED') summary.injured++;
        else if (res.status === 'BANNED') summary.banned++;
        else if (res.status === 'SUSPENDED') summary.suspended++;
        else if (res.status === 'ERROR') summary.errors++;
      });

      if (i + BATCH_SIZE < players.length) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    return {
      success: true,
      message: `Matchday Scout processed ${players.length} players.`,
      data: summary
    };
  } catch (error) {
    console.error('[Matchday Scout] Global Error:', error);
    return { success: false, message: 'Matchday Scout failed to execute global run.' };
  }
}

/**
 * Helper to process a single player's availability
 */
async function processPlayerAvailability(player: any): Promise<{ status: string }> {
  try {
    console.log(`[Matchday Scout] Investigating ${player.name}...`);
    
    const newsResult = await AGENT_TOOLS.scout_player_availability.execute({
      playerName: player.name,
      teamName: player.team
    });

    if (!newsResult.success || !newsResult.content) {
      throw new Error(`No news found for ${player.name}`);
    }

    const parsed = await detectPlayerStatus(newsResult.content, player.name, player.team);
    
    // Calculate availability based on status and proximity
    let availability = 100;
    const status = parsed.status || 'ACTIVE';
    const note = (parsed.note || '').toLowerCase();

    if (status === 'ACTIVE') {
      availability = 100;
    } else if (status === 'INJURED') {
      if (note.includes('out for season') || note.includes('season over') || note.includes('long-term')) {
        availability = 0;
      } else if (note.includes('week')) {
        availability = 50;
      } else if (note.includes('month')) {
        availability = 20;
      } else {
        availability = 10;
      }
    } else if (['SUSPENDED', 'BANNED'].includes(status)) {
      availability = 0;
    }

    await db.player.update({
      where: { id: player.id },
      data: {
        status: status,
        statusNote: parsed.note || null,
        availability: availability,
        lastUpdated: new Date()
      }
    });
    
    await db.agentActivity.create({
      data: {
        agent: 'Matchday Scout',
        action: 'status_detected',
        target: player.name,
        status: 'success',
        message: `${status} (${availability}%): ${parsed.note}`
      }
    });

    return { status };
  } catch (e: any) {
    console.warn(`[Matchday Scout] Failed for ${player.name}:`, e.message);
    return { status: 'ERROR' };
  }
}
