import { NextRequest, NextResponse } from 'next/server';
import { validateAgentRequest, unauthorizedAgentResponse } from '@/lib/agents/security';
import { runScoutAgent, runAnalystAgent } from '@/lib/agents/orchestrator';

/**
 * AGENT RUNNER: The external entry point for autonomous agents.
 * This can be triggered by a CRON job or an external agent platform.
 */
export async function POST(request: NextRequest) {
  // 1. Security Check
  if (!validateAgentRequest(request)) {
    return unauthorizedAgentResponse();
  }

  try {
    console.log('[Agents] Starting Autonomous Cycle...');

    // 2. Run Scout to identify mission targets
    const scoutResult = await runScoutAgent();
    
    if (!scoutResult.success || !scoutResult.data) {
      return NextResponse.json({ 
        success: false, 
        message: 'Scout mission aborted.', 
        error: scoutResult.message 
      }, { status: 500 });
    }

    const targets = scoutResult.data;
    const results = [];

    // 3. Process each target with the Analyst
    // Note: We process them sequentially to avoid overwhelming rate limits
    for (const target of targets) {
      console.log(`[Agents] Analyst starting on target: ${target.type}:${target.id}`);
      const result = await runAnalystAgent(target.type, target.id);
      results.push({
        target: `${target.type}:${target.id}`,
        success: result.success,
        message: result.message
      });
    }

    return NextResponse.json({
      success: true,
      cycleId: Date.now().toString(),
      scout: scoutResult.message,
      analystResults: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Agents] Cycle Failure:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Autonomous cycle failed.',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
