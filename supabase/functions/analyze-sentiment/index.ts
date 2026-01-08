import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const inputSchema = z.object({
  matchId: z.string().uuid({ message: 'Invalid match ID format' }),
});

// Simple in-memory rate limiter (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate input
    let validatedInput;
    try {
      const body = await req.json();
      validatedInput = inputSchema.parse(body);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return new Response(
        JSON.stringify({ error: 'Invalid input parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { matchId } = validatedInput;

    // Fetch social posts for the match
    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select('content, sentiment_score, emotions')
      .eq('match_id', matchId)
      .limit(50);

    if (postsError) {
      console.error('Posts fetch error:', postsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch social posts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No social posts found for this match' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use AI to analyze sentiment
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert specializing in sports fan reactions. Analyze the overall sentiment and key emotions from fan posts.',
          },
          {
            role: 'user',
            content: `Analyze these fan reactions and provide a summary:\n${posts.map(p => p.content).join('\n')}\n\nProvide: 1) Overall sentiment (positive/neutral/negative), 2) Dominant emotions, 3) Key themes`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze sentiment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    // Calculate aggregate sentiment
    const avgSentiment = posts.reduce((sum, p) => sum + (p.sentiment_score || 0), 0) / posts.length;
    
    return new Response(
      JSON.stringify({
        matchId,
        totalPosts: posts.length,
        averageSentiment: avgSentiment,
        aiAnalysis: analysis,
        posts: posts.slice(0, 10), // Return top 10 posts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
