import { NextRequest } from 'next/server';

/**
 * Validates the Paperclip API key from headers.
 * This ensures that only authorized Paperclip agents can trigger internal tools.
 */
export function validateAgentRequest(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-paperclip-key');
  const expectedKey = process.env.PAPERCLIP_API_KEY;

  if (!expectedKey) {
    console.warn('[Security] PAPERCLIP_API_KEY not set in environment.');
    return false;
  }

  return apiKey === expectedKey;
}

/**
 * Generic unauthorized response for agents
 */
export function unauthorizedAgentResponse() {
  return new Response(JSON.stringify({ 
    error: 'Unauthorized', 
    message: 'Invalid or missing x-paperclip-key header.' 
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
