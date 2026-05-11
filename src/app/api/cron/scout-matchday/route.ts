import { NextResponse } from 'next/server'
import { runMatchdayScoutAgent } from '@/lib/agents/orchestrator'

export const dynamic = 'force-dynamic'

/**
 * CRON: Scout Matchday
 * Triggers the Matchday Scout Agent to verify player availability.
 */
export async function GET(request: Request) {
  try {
    const result = await runMatchdayScoutAgent();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[Cron/ScoutMatchday Error]:', error);
    return NextResponse.json({ error: 'Internal server error', msg: error.message }, { status: 500 });
  }
}
