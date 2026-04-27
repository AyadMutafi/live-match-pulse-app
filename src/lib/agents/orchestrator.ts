import { db } from '@/lib/db';
import { AGENT_TOOLS } from './manifest';
import ZAI from 'z-ai-web-dev-sdk';

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
    const zai = await ZAI.create();
    
    // 1. Get current status via tool
    const status = await AGENT_TOOLS.get_app_status.execute({});
    
    // 2. Ask AI to pick 3 high-priority targets
    const prompt = `You are the Fan Pulse Scout Agent. Based on the app status, pick the 3 MOST IMPORTANT entities to analyze right now.
Entities should be:
- Live matches (highest priority)
- Players with old sentiment data (lastUpdated > 24h)
- Upcoming big matches (GW33/UCL)

App Status:
${JSON.stringify(status)}

Return ONLY JSON:
{
  "targets": [
    { "type": "player", "id": "...", "reason": "..." },
    { "type": "match", "id": "...", "reason": "..." }
  ]
}`;

    const completion = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content || '{}';
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const { targets } = JSON.parse(cleaned);

    // 3. Log activity
    for (const target of targets) {
      await db.agentActivity.create({
        data: {
          agent: 'Scout',
          action: 'identified_target',
          target: `${target.type}:${target.id}`,
          status: 'success',
          message: target.reason
        }
      });
    }

    return {
      success: true,
      message: `Scout identified ${targets.length} targets.`,
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
export async function runAnalystAgent(type: 'player' | 'match', id: string): Promise<AgentResult> {
  try {
    // 1. Scrape data
    const scrapeResult = await AGENT_TOOLS.scrape_social_data.execute({ 
      entityType: type, 
      entityId: id 
    });

    if (!scrapeResult.success || !scrapeResult.content) {
      throw new Error(scrapeResult.error || 'Scrape yielded no content');
    }

    const entityLabel = type === 'player' 
      ? (await db.player.findUnique({ where: { id } }))?.name 
      : (await db.match.findUnique({ where: { id } }))?.league;

    // 2. Extract Sentiment & Themes
    const [sentiment, themes] = await Promise.all([
      AGENT_TOOLS.analyze_sentiment.execute({ 
        rawContent: scrapeResult.content, 
        entityLabel: entityLabel || 'Target' 
      }),
      AGENT_TOOLS.extract_themes.execute({ 
        rawContent: scrapeResult.content, 
        entityLabel: entityLabel || 'Target' 
      })
    ]);

    // 3. Update Database
    if (type === 'player') {
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
    } else {
      await db.match.update({
        where: { id },
        data: {
          homeSentiment: sentiment.sentiment, // Simplified for now
          volatility: sentiment.volatility,
          momentum: sentiment.momentum,
          predictedScore: sentiment.predictedScore,
          lastUpdated: new Date()
        }
      });
    }

    // 4. Log success
    await db.agentActivity.create({
      data: {
        agent: 'Analyst',
        action: `analyze_${type}`,
        target: id,
        status: 'success',
        message: `Extracted ${themes.positiveThemes.length} positive themes. Mood: ${themes.fanMood}`
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
