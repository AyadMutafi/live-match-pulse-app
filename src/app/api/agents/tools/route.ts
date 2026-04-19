import { NextRequest, NextResponse } from 'next/server';
import { AGENT_TOOLS } from '@/lib/agents/manifest';
import { validateAgentRequest, unauthorizedAgentResponse } from '@/lib/agents/security';

/**
 * Paperclip Agent Tool Execution Endpoint
 * POST /api/agents/tools
 * Headers: x-paperclip-key: ...
 * Body: { "tool": "tool_name", "arguments": { ... } }
 */
export async function POST(request: NextRequest) {
  // 1. Validate Security
  if (!validateAgentRequest(request)) {
    return unauthorizedAgentResponse();
  }

  try {
    const { tool, arguments: args } = await request.json();

    // 2. Check if tool exists
    const toolDefinition = AGENT_TOOLS[tool];
    if (!toolDefinition) {
      return NextResponse.json({ 
        error: 'Unknown Tool', 
        message: `Tool "${tool}" is not defined in the agent manifest.` 
      }, { status: 404 });
    }

    // 3. Execute Tool
    console.log(`[Agent] Executing tool: ${tool}`, args);
    const result = await toolDefinition.execute(args);

    return NextResponse.json({
      success: true,
      tool,
      result
    });

  } catch (error: any) {
    console.error('[Agent Tool Error]:', error);
    return NextResponse.json({ 
      error: 'Execution Failed', 
      message: error.message 
    }, { status: 500 });
  }
}

/**
 * Discovery Endpoint (GET /api/agents/tools)
 * Returns the manifest of available tools for Paperclip to import.
 */
export async function GET(request: NextRequest) {
  // We can choose to make discovery public or secured
  const tools = Object.values(AGENT_TOOLS).map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters
  }));

  return NextResponse.json({
    version: '1.0.0',
    tools
  });
}
