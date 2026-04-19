import { NextRequest, NextResponse } from 'next/server';
import { AGENT_TOOLS } from '@/lib/agents/manifest';
import { validateAgentRequest, unauthorizedAgentResponse } from '@/lib/agents/security';

/**
 * Paperclip Agent Status Endpoint
 * GET /api/agents/status
 * Headers: x-paperclip-key: ...
 * 
 * Specifically designed for the "Scout Agent" to monitor match and player states.
 */
export async function GET(request: NextRequest) {
  // 1. Validate Security
  if (!validateAgentRequest(request)) {
    return unauthorizedAgentResponse();
  }

  try {
    // 2. Reuse the get_app_status logic from the manifest
    const status = await AGENT_TOOLS.get_app_status.execute({});

    return NextResponse.json({
      success: true,
      ...status
    });

  } catch (error: any) {
    console.error('[Agent Status Error]:', error);
    return NextResponse.json({ 
      error: 'Status Fetch Failed', 
      message: error.message 
    }, { status: 500 });
  }
}
