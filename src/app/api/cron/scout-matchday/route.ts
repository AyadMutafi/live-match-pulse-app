import { NextResponse } from 'next/server'
import { runMatchdayScoutAgent } from '@/lib/agents/orchestrator'

export const dynamic = 'force-dynamic'

/**
 * CRON: Scout Matchday
 * Triggers the Matchday Scout Agent to verify player availability.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
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
